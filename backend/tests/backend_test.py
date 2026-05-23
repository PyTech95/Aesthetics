"""Backend tests for CLA Aesthetics & Wellness API (auth + bookings + leads + availability + PWA)"""
import os
import time
import uuid
import pytest
import requests
from datetime import date, timedelta

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "cinthia@claaesthetics.com"
ADMIN_PASSWORD = "ChangeMe2026!"


def _future_weekday(days_ahead: int = 7) -> str:
    d = date.today() + timedelta(days=days_ahead)
    while d.weekday() == 6:  # Sunday
        d += timedelta(days=1)
    return d.isoformat()


def _next_sunday() -> str:
    d = date.today()
    while d.weekday() != 6:
        d += timedelta(days=1)
    return d.isoformat()


@pytest.fixture(scope="module")
def anon():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return s


@pytest.fixture(scope="module")
def client_user():
    """Register a fresh test client and return (session, info)."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"test_client_{uuid.uuid4().hex[:8]}@test.com"
    password = "client123"
    r = s.post(f"{API}/auth/register", json={
        "name": "TEST Client",
        "email": email,
        "phone": "5165550111",
        "password": password,
    }, timeout=30)
    assert r.status_code == 200, r.text
    return s, {"email": email, "password": password, "id": r.json()["id"]}


# ---------- Services ----------
class TestServices:
    def test_list_services_12_luxury(self, anon):
        r = anon.get(f"{API}/services", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 12
        names = {s["name"] for s in data}
        for expected in ["Botox", "Dermal Fillers", "PDO Thread Lift", "PRP Facial",
                         "Hydrofacial", "Laser Therapy", "Hair Restoration",
                         "IV Nutrition Therapy", "Weight Loss Program"]:
            assert expected in names, f"Missing {expected}"


# ---------- Auth ----------
class TestAuth:
    def test_admin_login_sets_cookies(self, anon):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["role"] == "admin"
        assert data["email"] == ADMIN_EMAIL
        assert "access_token" in s.cookies
        assert "refresh_token" in s.cookies

    def test_invalid_login_401(self, anon):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG"}, timeout=30)
        assert r.status_code == 401

    def test_me_with_cookies(self, admin_client):
        r = admin_client.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        assert r.json()["role"] == "admin"

    def test_me_unauthenticated_401(self, anon):
        s = requests.Session()
        r = s.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 401

    def test_register_creates_client(self, client_user):
        s, info = client_user
        r = s.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["role"] == "client"
        assert data["email"] == info["email"]

    def test_logout_clears_cookies(self, anon):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200
        r2 = s.post(f"{API}/auth/logout", timeout=30)
        assert r2.status_code == 200
        # Clear local cookies that may persist (server sends delete but client keeps until next response strip)
        s.cookies.clear()
        r3 = s.get(f"{API}/auth/me", timeout=30)
        assert r3.status_code == 401


# ---------- Admin-only endpoints ----------
class TestAdminProtection:
    def test_bookings_unauth_returns_401_or_403(self, anon):
        s = requests.Session()
        r = s.get(f"{API}/bookings", timeout=30)
        assert r.status_code in (401, 403)

    def test_leads_unauth_returns_401_or_403(self, anon):
        s = requests.Session()
        r = s.get(f"{API}/leads", timeout=30)
        assert r.status_code in (401, 403)

    def test_bookings_as_client_403(self, client_user):
        s, _ = client_user
        r = s.get(f"{API}/bookings", timeout=30)
        assert r.status_code == 403

    def test_leads_as_client_403(self, client_user):
        s, _ = client_user
        r = s.get(f"{API}/leads", timeout=30)
        assert r.status_code == 403

    def test_bookings_admin_200(self, admin_client):
        r = admin_client.get(f"{API}/bookings", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_leads_admin_200(self, admin_client):
        r = admin_client.get(f"{API}/leads", timeout=30)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Availability ----------
class TestAvailability:
    def test_availability_weekday(self, anon):
        d = _future_weekday(10)
        r = anon.get(f"{API}/availability", params={"d": d}, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["date"] == d
        assert isinstance(data["slots"], list) and len(data["slots"]) > 0
        assert isinstance(data["available"], list)
        assert "taken" in data

    def test_availability_sunday_empty_with_note(self, anon):
        d = _next_sunday()
        r = anon.get(f"{API}/availability", params={"d": d}, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert data["available"] == []
        assert "note" in data and "Sunday" in data["note"]

    def test_availability_invalid_date_400(self, anon):
        r = anon.get(f"{API}/availability", params={"d": "bad-date"}, timeout=30)
        assert r.status_code in (400, 422)


# ---------- Bookings (client + duplicate slot) ----------
class TestBookingFlow:
    created_ids = []

    def test_client_create_booking_attached(self, client_user):
        s, info = client_user
        d = _future_weekday(14)
        t = "10:30 AM"
        payload = {
            "name": "TEST Client Booking",
            "email": info["email"],
            "phone": "5165550111",
            "service": "Hydrofacial",
            "preferred_date": d,
            "preferred_time": t,
            "notes": "TEST",
        }
        r = s.post(f"{API}/bookings", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user_id"] == info["id"]
        TestBookingFlow.created_ids.append(data["id"])

    def test_duplicate_slot_409(self, anon, client_user):
        s, _ = client_user
        d = _future_weekday(15)
        t = "11:00 AM"
        payload = {
            "name": "TEST First",
            "email": "test_first@test.com",
            "phone": "5165550112",
            "service": "Botox",
            "preferred_date": d,
            "preferred_time": t,
        }
        r1 = anon.post(f"{API}/bookings", json=payload, timeout=30)
        assert r1.status_code == 200, r1.text
        TestBookingFlow.created_ids.append(r1.json()["id"])
        # Second with same slot
        payload["name"] = "TEST Second"
        payload["email"] = "test_second@test.com"
        r2 = anon.post(f"{API}/bookings", json=payload, timeout=30)
        assert r2.status_code == 409, r2.text

    def test_bookings_mine_returns_own(self, client_user):
        s, info = client_user
        r = s.get(f"{API}/bookings/mine", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # all returned should belong to this user
        for b in data:
            assert b.get("user_id") == info["id"] or b.get("email") == info["email"]

    def test_client_cancel_own(self, client_user):
        s, info = client_user
        d = _future_weekday(20)
        t = "12:00 PM"
        r = s.post(f"{API}/bookings", json={
            "name": "TEST Cancel",
            "email": info["email"],
            "phone": "5165550111",
            "service": "PRP Facial",
            "preferred_date": d,
            "preferred_time": t,
        }, timeout=30)
        assert r.status_code == 200
        bid = r.json()["id"]
        TestBookingFlow.created_ids.append(bid)
        r2 = s.patch(f"{API}/bookings/{bid}?status=cancelled", timeout=30)
        assert r2.status_code == 200
        assert r2.json()["status"] == "cancelled"

    def test_client_cannot_cancel_others(self, anon, client_user):
        # Create booking as anon (no user_id)
        s, _ = client_user
        d = _future_weekday(21)
        t = "1:00 PM"
        r = anon.post(f"{API}/bookings", json={
            "name": "TEST OtherOwner",
            "email": "test_other_owner@test.com",
            "phone": "5165550113",
            "service": "Botox",
            "preferred_date": d,
            "preferred_time": t,
        }, timeout=30)
        assert r.status_code == 200
        bid = r.json()["id"]
        TestBookingFlow.created_ids.append(bid)
        # Client tries to cancel
        r2 = s.patch(f"{API}/bookings/{bid}?status=cancelled", timeout=30)
        assert r2.status_code == 404

    def test_client_cannot_set_non_cancel_status(self, client_user):
        s, info = client_user
        # Create own booking
        d = _future_weekday(22)
        r = s.post(f"{API}/bookings", json={
            "name": "TEST Conf",
            "email": info["email"],
            "phone": "5165550111",
            "service": "Botox",
            "preferred_date": d,
            "preferred_time": "2:00 PM",
        }, timeout=30)
        assert r.status_code == 200
        bid = r.json()["id"]
        TestBookingFlow.created_ids.append(bid)
        r2 = s.patch(f"{API}/bookings/{bid}?status=confirmed", timeout=30)
        assert r2.status_code == 403

    def test_admin_set_any_status(self, admin_client):
        if not TestBookingFlow.created_ids:
            pytest.skip("no bookings")
        bid = TestBookingFlow.created_ids[0]
        r = admin_client.patch(f"{API}/bookings/{bid}?status=confirmed", timeout=30)
        assert r.status_code == 200
        assert r.json()["status"] == "confirmed"


# ---------- Brute force lockout ----------
class TestBruteForce:
    def test_brute_force_lock(self, anon):
        # Use a unique fake email so we don't lock the real admin
        fake_email = f"locktest_{uuid.uuid4().hex[:6]}@example.com"
        s = requests.Session()
        last_status = None
        for i in range(6):
            r = s.post(f"{API}/auth/login", json={"email": fake_email, "password": "wrongwrong"}, timeout=30)
            last_status = r.status_code
            if r.status_code == 429:
                break
        # After 5 wrong attempts the 6th should be 429
        assert last_status == 429, f"Expected 429 lockout, got {last_status}"


# ---------- PWA assets ----------
class TestPWA:
    def test_manifest(self, anon):
        r = anon.get(f"{BASE_URL}/manifest.json", timeout=30)
        assert r.status_code == 200
        # Some hosts return JSON; gracefully try
        try:
            data = r.json()
            assert "CLA Aesthetics" in (data.get("name", "") + data.get("short_name", ""))
        except Exception:
            assert "CLA Aesthetics" in r.text

    def test_service_worker(self, anon):
        r = anon.get(f"{BASE_URL}/sw.js", timeout=30)
        assert r.status_code == 200


# ---------- Chat graceful fallback ----------
class TestChat:
    def test_chat_returns_503_or_200(self, anon):
        r = anon.post(f"{API}/chat", json={"session_id": str(uuid.uuid4()), "message": "Hello"}, timeout=60)
        # LLM budget may be exhausted -> 503; or 200 if available; 502 if other error
        assert r.status_code in (200, 502, 503), r.text
