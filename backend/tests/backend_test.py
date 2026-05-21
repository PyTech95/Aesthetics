"""Backend tests for CLA Aesthetics & Wellness API
Endpoints: /api/services, /api/bookings (POST/GET), /api/bookings/{id} PATCH
"""
import os
import pytest
import requests
from datetime import date, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://luxury-spa-preview-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Services ----------
class TestServices:
    def test_list_services_returns_six(self, session):
        r = session.get(f"{API}/services", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
        # Validate the structure of first service
        item = data[0]
        for k in ("id", "category", "name", "description", "duration", "price"):
            assert k in item
        names = [s["name"] for s in data]
        assert "Signature Glow Facial" in names


# ---------- Bookings ----------
class TestBookings:
    created_id = None

    def test_create_booking_success(self, session):
        future = (date.today() + timedelta(days=7)).isoformat()
        payload = {
            "name": "TEST_Jane Doe",
            "email": "test_jane@example.com",
            "phone": "5165550100",
            "service": "Signature Glow Facial",
            "preferred_date": future,
            "preferred_time": "2:30 PM",
            "notes": "TEST_booking notes",
        }
        r = session.post(f"{API}/bookings", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["service"] == payload["service"]
        assert data["preferred_date"] == future
        assert data["status"] == "new"
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        TestBookings.created_id = data["id"]

    def test_create_booking_invalid_email_422(self, session):
        future = (date.today() + timedelta(days=7)).isoformat()
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "phone": "5165550100",
            "service": "Signature Glow Facial",
            "preferred_date": future,
            "preferred_time": "2:30 PM",
        }
        r = session.post(f"{API}/bookings", json=payload, timeout=30)
        assert r.status_code == 422, r.text

    def test_create_booking_missing_field_422(self, session):
        payload = {
            # missing name
            "email": "test_missing@example.com",
            "phone": "5165550100",
            "service": "Signature Glow Facial",
            "preferred_date": "2026-02-01",
            "preferred_time": "2:30 PM",
        }
        r = session.post(f"{API}/bookings", json=payload, timeout=30)
        assert r.status_code == 422, r.text

    def test_list_bookings_sorted_desc(self, session):
        # Create a second booking and verify ordering
        future = (date.today() + timedelta(days=10)).isoformat()
        payload = {
            "name": "TEST_Sort Check",
            "email": "test_sort@example.com",
            "phone": "5165550101",
            "service": "Aromatherapy Ritual",
            "preferred_date": future,
            "preferred_time": "4:00 PM",
            "notes": "TEST_sort",
        }
        r2 = session.post(f"{API}/bookings", json=payload, timeout=30)
        assert r2.status_code == 200

        r = session.get(f"{API}/bookings", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        # Sorted desc by created_at
        created_ats = [b["created_at"] for b in data]
        assert created_ats == sorted(created_ats, reverse=True)
        # Created booking present
        ids = [b["id"] for b in data]
        assert TestBookings.created_id in ids

    def test_patch_booking_confirmed(self, session):
        assert TestBookings.created_id, "Need created booking id"
        r = session.patch(
            f"{API}/bookings/{TestBookings.created_id}?status=confirmed",
            timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "confirmed"
        assert data["id"] == TestBookings.created_id

        # Verify via list
        lr = session.get(f"{API}/bookings", timeout=30)
        assert lr.status_code == 200
        for b in lr.json():
            if b["id"] == TestBookings.created_id:
                assert b["status"] == "confirmed"
                break

    def test_patch_booking_invalid_status_400(self, session):
        assert TestBookings.created_id
        r = session.patch(
            f"{API}/bookings/{TestBookings.created_id}?status=garbage",
            timeout=30,
        )
        assert r.status_code == 400, r.text

    def test_patch_booking_unknown_id_404(self, session):
        r = session.patch(
            f"{API}/bookings/nonexistent-id-xyz?status=confirmed",
            timeout=30,
        )
        assert r.status_code == 404, r.text
