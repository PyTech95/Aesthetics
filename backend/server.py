from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI(title="CLA Aesthetics & Wellness API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class BookingCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=4, max_length=40)
    service: str = Field(..., min_length=1, max_length=120)
    preferred_date: str = Field(..., min_length=1, max_length=40)  # ISO date string
    preferred_time: str = Field(..., min_length=1, max_length=40)
    notes: Optional[str] = Field(default="", max_length=2000)


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
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


# Static services catalog
SERVICES_CATALOG: List[Service] = [
    Service(id="signature-facial", category="Facials", name="Signature Glow Facial",
            description="A bespoke deep-cleansing facial tailored to restore radiance, hydration, and a healthy glow.",
            duration="75 min", price="From $145"),
    Service(id="advanced-skin", category="Advanced Skin Treatments", name="Microneedling Renewal",
            description="Stimulates collagen for smoother texture, even tone, and visible firmness over time.",
            duration="60 min", price="From $295"),
    Service(id="body-treatment", category="Body Treatments", name="Body Sculpt & Detox",
            description="Lymphatic-drainage technique combined with warming masques for contoured, toned skin.",
            duration="90 min", price="From $210"),
    Service(id="massage-deep", category="Massage Therapy", name="Holistic Deep Tissue",
            description="A restorative massage that releases tension and rebalances mind and body.",
            duration="60 min", price="From $135"),
    Service(id="massage-aroma", category="Massage Therapy", name="Aromatherapy Ritual",
            description="Hand-blended essential oils and slow flowing strokes for total relaxation.",
            duration="60 min", price="From $120"),
    Service(id="membership", category="Packages & Memberships", name="Monthly Glow Membership",
            description="One signature facial per month, member-only pricing on all treatments and retail.",
            duration="Monthly", price="From $129/mo"),
]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "CLA Aesthetics & Wellness API"}


@api_router.get("/services", response_model=List[Service])
async def list_services():
    return SERVICES_CATALOG


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Booking(**d) for d in docs]


@api_router.patch("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, status: str):
    if status not in {"new", "confirmed", "contacted", "completed", "cancelled"}:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"id": booking_id, "status": status}


# ---------- Chat Concierge ----------
CONCIERGE_SYSTEM_PROMPT = """You are 'Camille', the warm, refined virtual concierge for CLA Aesthetics & Wellness — a boutique luxury spa in South Hempstead, NY, founded by Cinthia Lariviere Alexandre.

Your tone: warm, elegant, attentive, and concise (max 3 short sentences per reply). Never sales-pushy.

You can help with:
- Service questions (Signature Glow Facial, Microneedling Renewal, Body Sculpt & Detox, Holistic Deep Tissue, Aromatherapy Ritual, Monthly Glow Membership)
- Pricing ranges (facials from $145, microneedling from $295, body from $210, massage from $120-$135, membership from $129/mo)
- Hours (Mon–Fri 10–8, Sat 9–6, Sun by appointment)
- Address: 1078 Grand Avenue, South Hempstead, NY 11550
- Phone: 516-620-9158 | Email: cinthia@claaesthetics.com

Conversation flow:
1. Greet warmly and ask how you can help today.
2. Answer any questions about services/pricing/hours.
3. When the guest shows booking interest, gently collect: first name, phone number, and which service they're curious about.
4. Once you have name + phone, suggest they pick up the conversation by Call or WhatsApp — the UI will surface those buttons.
5. Never invent services or prices that aren't in this brief. If unsure, say "I'll have Cinthia confirm by text — what's the best number to reach you?"

Keep replies short, sensory, and graceful. Use light, occasional touches like "of course", "beautiful question", or em-dashes for refinement."""


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
    preferred_channel: Optional[str] = Field(default="phone")  # phone | whatsapp | email


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


@api_router.post("/chat", response_model=ChatMessageOut)
async def chat(payload: ChatMessageIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=503, detail="Concierge is offline. Please call 516-620-9158.")

    # Save user message
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
            raise HTTPException(
                status_code=503,
                detail="Our virtual concierge is briefly resting. Please call 516-620-9158 or use WhatsApp — Cinthia will help you right away.",
            )
        raise HTTPException(
            status_code=502,
            detail="Our concierge couldn't respond just now. Please call 516-620-9158 — we'd love to help.",
        )

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
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Lead(**d) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
