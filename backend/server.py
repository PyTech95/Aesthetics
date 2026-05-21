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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
