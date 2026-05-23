from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta, date
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage


# ---------------- Config ----------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret-change-me')
JWT_ALGO = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com').lower()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

app = FastAPI(title="CLA Aesthetics & Wellness API")
api_router = APIRouter(prefix="/api")


# ---------------- Auth helpers ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, email: str, role: str, kind: str, ttl_minutes: int) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": kind,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ttl_minutes),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def set_auth_cookies(resp: Response, access: str, refresh: str):
    # secure=True is needed for cross-site iframe via HTTPS preview; samesite=none paired
    secure = True
    samesite = "none"
    resp.set_cookie("access_token", access, httponly=True, secure=secure, samesite=samesite, max_age=900, path="/")
    resp.set_cookie("refresh_token", refresh, httponly=True, secure=secure, samesite=samesite, max_age=604800, path="/")


def clear_auth_cookies(resp: Response):
    resp.delete_cookie("access_token", path="/")
    resp.delete_cookie("refresh_token", path="/")


def extract_token(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if token:
        return token
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def get_current_user(request: Request) -> dict:
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# ---------------- Models ----------------
class RegisterIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    password: str = Field(..., min_length=6, max_length=200)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = ""
    role: str
    created_at: str


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    service: str = Field(..., min_length=1, max_length=120)
    preferred_date: str = Field(..., min_length=1, max_length=40)
    preferred_time: str = Field(..., min_length=1, max_length=40)
    notes: Optional[str] = Field(default="", max_length=2000)


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    name: str
    email: str
    phone: str
    service: str
    preferred_date: str
    preferred_time: str
    notes: str = ""
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Service(BaseModel):
    id: str
    category: str
    name: str
    description: str
    duration: str
    price: str


class ChatMessageIn(BaseModel):
    session_id: str
    message: str = Field(..., min_length=1, max_length=2000)


class ChatMessageOut(BaseModel):
    session_id: str
    reply: str


class LeadCreate(BaseModel):
    session_id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=120)
    phone: str = Field(..., min_length=4, max_length=40)
    interest: Optional[str] = Field(default="", max_length=240)
    notes: Optional[str] = Field(default="", max_length=2000)
    preferred_channel: Optional[str] = Field(default="phone")


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: Optional[str] = None
    name: str
    phone: str
    interest: str = ""
    notes: str = ""
    preferred_channel: str = "phone"
    source: str = "chat_concierge"
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------------- Services catalog ----------------
SERVICES_CATALOG: List[Service] = [
    Service(id="botox", category="Injectables", name="Botox",
            description="Smooth fine lines & wrinkles with precision-placed neurotoxin. Results last 3–4 months.",
            duration="30 min", price="From $12/unit"),
    Service(id="fillers", category="Injectables", name="Dermal Fillers",
            description="Enhance contours and add natural volume to lips, cheeks and jawline.",
            duration="45 min", price="From $650/syringe"),
    Service(id="pdo", category="Lifts", name="PDO Thread Lift",
            description="Non-surgical lift using absorbable threads for natural contours.",
            duration="60 min", price="From $800"),
    Service(id="prp-facial", category="Facials", name="PRP Facial",
            description="Collagen-boosting plasma therapy for radiant rejuvenation.",
            duration="60 min", price="From $450"),
    Service(id="prf", category="Facials", name="PRF Treatment",
            description="Advanced healing with platelet-rich fibrin for a natural glow.",
            duration="60 min", price="From $500"),
    Service(id="hydrofacial", category="Facials", name="Hydrofacial",
            description="Deep cleansing, hydration boost and instant glow in one ritual.",
            duration="60 min", price="From $250"),
    Service(id="laser", category="Skin", name="Laser Therapy",
            description="Target imperfections for smoother, clearer skin.",
            duration="45 min", price="From $295"),
    Service(id="microneedling-prp", category="Skin", name="Microneedling + PRP",
            description="Skin renewal and even tone using collagen induction with PRP.",
            duration="75 min", price="From $400/session"),
    Service(id="skin-rejuvenation", category="Skin", name="Skin Rejuvenation",
            description="A complete transformation for radiant, glass-skin results.",
            duration="90 min", price="From $350"),
    Service(id="hair-restoration", category="Hair", name="Hair Restoration",
            description="Stimulate new growth for fuller, thicker hair.",
            duration="60 min", price="From $500 · 3-pack $1,350"),
    Service(id="iv-nutrition", category="Wellness", name="IV Nutrition Therapy",
            description="Boost immunity, energy and rapid hydration with custom IV blends.",
            duration="45 min", price="From $185"),
    Service(id="weight-loss", category="Wellness", name="Weight Loss Program",
            description="Customized plans under medical supervision.",
            duration="Consultation", price="From $299"),
]

DEFAULT_SLOTS = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM",
]


# ---------------- Startup ----------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.bookings.create_index("preferred_date")
    await db.bookings.create_index("user_id")
    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    now = datetime.now(timezone.utc).isoformat()
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Cinthia Lariviere Alexandre",
            "phone": "516-620-9158",
            "role": "admin",
            "created_at": now,
        })
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one({"email": ADMIN_EMAIL}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})


# ---------------- Auth Routes ----------------
@api_router.post("/auth/register", response_model=UserOut)
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email is already registered")
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "id": user_id,
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "phone": payload.phone,
        "role": "client",
        "created_at": now,
    }
    await db.users.insert_one(user_doc)
    access = create_token(user_id, email, "client", "access", 15)
    refresh = create_token(user_id, email, "client", "refresh", 60 * 24 * 7)
    set_auth_cookies(response, access, refresh)
    return UserOut(id=user_id, name=payload.name, email=email, phone=payload.phone, role="client", created_at=now)


@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginIn, response: Response, request: Request):
    email = payload.email.lower()
    # Use first IP from X-Forwarded-For (real client) — fall back to request.client.host
    xff = request.headers.get("x-forwarded-for", "")
    real_ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else "unknown")
    identifier = f"{real_ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        try:
            locked_until = datetime.fromisoformat(attempt["locked_until"])
            if locked_until > datetime.now(timezone.utc):
                raise HTTPException(status_code=429, detail="Too many attempts. Please try again later.")
        except ValueError:
            pass

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        count = (attempt.get("count", 0) + 1) if attempt else 1
        update = {"identifier": identifier, "count": count}
        if count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})

    access = create_token(user["id"], user["email"], user["role"], "access", 15)
    refresh = create_token(user["id"], user["email"], user["role"], "refresh", 60 * 24 * 7)
    set_auth_cookies(response, access, refresh)
    return UserOut(
        id=user["id"], name=user["name"], email=user["email"],
        phone=user.get("phone", ""), role=user["role"], created_at=user["created_at"],
    )


@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(
        id=user["id"], name=user["name"], email=user["email"],
        phone=user.get("phone", ""), role=user["role"], created_at=user["created_at"],
    )


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    rt = request.cookies.get("refresh_token")
    if not rt:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(rt, JWT_SECRET, algorithms=[JWT_ALGO])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_token(user["id"], user["email"], user["role"], "access", 15)
        # keep existing refresh
        secure = True
        response.set_cookie("access_token", access, httponly=True, secure=secure, samesite="none", max_age=900, path="/")
        return {"ok": True}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------- Public ----------------
@api_router.get("/")
async def root():
    return {"message": "CLA Aesthetics & Wellness API"}


@api_router.get("/services", response_model=List[Service])
async def list_services():
    return SERVICES_CATALOG


@api_router.get("/availability")
async def availability(d: str = Query(..., min_length=8, max_length=12)):
    """Return available time slots for a given date."""
    try:
        the_date = date.fromisoformat(d)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format (use YYYY-MM-DD)")
    if the_date < date.today():
        return {"date": d, "slots": [], "available": []}
    # Sunday is by appointment only — return empty
    if the_date.weekday() == 6:
        return {"date": d, "slots": DEFAULT_SLOTS, "available": [], "note": "Sundays by appointment — please call."}
    # Find existing bookings on that date
    docs = await db.bookings.find(
        {"preferred_date": d, "status": {"$nin": ["cancelled"]}},
        {"_id": 0, "preferred_time": 1},
    ).to_list(500)
    taken = {doc["preferred_time"] for doc in docs}
    available = [s for s in DEFAULT_SLOTS if s not in taken]
    return {"date": d, "slots": DEFAULT_SLOTS, "available": available, "taken": list(taken)}


# ---------------- Bookings ----------------
@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate, request: Request):
    # Attach user_id if logged in (optional)
    user_id = None
    token = extract_token(request)
    if token:
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
            if data.get("type") == "access":
                user_id = data.get("sub")
        except jwt.PyJWTError:
            user_id = None

    # Prevent double-booking the same slot
    exists = await db.bookings.find_one({
        "preferred_date": payload.preferred_date,
        "preferred_time": payload.preferred_time,
        "status": {"$nin": ["cancelled"]},
    })
    if exists:
        raise HTTPException(status_code=409, detail="This time slot has just been taken — please pick another.")

    booking = Booking(user_id=user_id, **payload.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(_: dict = Depends(require_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Booking(**d) for d in docs]


@api_router.get("/bookings/mine", response_model=List[Booking])
async def list_my_bookings(user: dict = Depends(get_current_user)):
    docs = await db.bookings.find(
        {"$or": [{"user_id": user["id"]}, {"email": user["email"]}]},
        {"_id": 0},
    ).sort("preferred_date", -1).to_list(500)
    return [Booking(**d) for d in docs]


@api_router.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, status: str, user: dict = Depends(get_current_user)):
    valid = {"new", "confirmed", "contacted", "completed", "cancelled"}
    if status not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")
    # Clients can only cancel their own bookings
    if user["role"] != "admin":
        if status != "cancelled":
            raise HTTPException(status_code=403, detail="Clients can only cancel their bookings.")
        doc = await db.bookings.find_one({"id": booking_id})
        if not doc or (doc.get("user_id") != user["id"] and doc.get("email") != user["email"]):
            raise HTTPException(status_code=404, detail="Booking not found")
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"id": booking_id, "status": status}


# ---------------- Chat Concierge ----------------
CONCIERGE_SYSTEM_PROMPT = """You are 'Camille', the warm, refined virtual concierge for CLA Aesthetics & Wellness — a boutique luxury spa & aesthetics studio in South Hempstead, NY, founded by Cinthia Lariviere Alexandre.

Your tone: warm, elegant, attentive, concise (max 3 short sentences per reply). Never sales-pushy.

Services & price ranges:
- Botox from $12/unit · Dermal Fillers from $650/syringe · PDO Thread Lift from $800
- PRP Facial from $450 · PRF from $500 · Hydrofacial from $250
- Laser Therapy from $295 · Microneedling + PRP from $400 · Skin Rejuvenation from $350
- Hair Restoration from $500 (3-pack $1,350) · IV Nutrition from $185 · Weight Loss Program from $299

Hours: Mon–Fri 10–8, Sat 9–6, Sun by appointment.
Address: 1078 Grand Avenue, South Hempstead, NY 11550 · Phone: 516-620-9158 · cinthia@claaesthetics.com

Conversation flow:
1. Greet warmly and ask how you can help.
2. Answer service / price / hours questions accurately.
3. When the guest shows booking interest, gently collect: first name, phone, and which service.
4. Once you have name + phone, suggest they continue by Call or WhatsApp — the UI surfaces those buttons.
5. Never invent services or prices outside this brief.

Keep replies short, sensory, graceful."""


@api_router.post("/chat", response_model=ChatMessageOut)
async def chat(payload: ChatMessageIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Concierge is offline. Please call 516-620-9158.")

    await db.chat_messages.insert_one({
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    try:
        llm = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=payload.session_id,
            system_message=CONCIERGE_SYSTEM_PROMPT,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        reply = await llm.send_message(UserMessage(text=payload.message))
        reply = (reply or "").strip()
    except Exception as e:
        err = str(e)
        logging.exception("LLM error")
        if "Budget has been exceeded" in err or "budget" in err.lower():
            raise HTTPException(status_code=503, detail="Our virtual concierge is briefly resting. Please call 516-620-9158 or use WhatsApp.")
        raise HTTPException(status_code=502, detail="Our concierge couldn't respond just now. Please call 516-620-9158.")

    await db.chat_messages.insert_one({
        "session_id": payload.session_id,
        "role": "assistant",
        "content": reply,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return ChatMessageOut(session_id=payload.session_id, reply=reply)


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(_: dict = Depends(require_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Lead(**d) for d in docs]


# ---------------- App wiring ----------------
app.include_router(api_router)

# CORS — explicit origin required when allow_credentials=True
ALLOWED_ORIGINS = list({FRONTEND_URL, "http://localhost:3000"})
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.preview\.emergentagent\.com",
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
