# CLA Aesthetics & Wellness — PRD

## Original Problem Statement
Premium one-page spa website → evolved into PWA + CRM with JWT auth, client portal, admin dashboard, AI concierge chatbot, public availability calendar, and 12 medical-aesthetic luxury treatments.

## Architecture
- **Stack**: React (CRA + craco, Tailwind, shadcn/ui, Radix, Lucide, Sonner, date-fns) + FastAPI + MongoDB (Motor) + bcrypt + PyJWT.
- **PWA**: `manifest.json` + `sw.js` (network-first navigation, stale-while-revalidate assets, never caches /api/*) + install prompt component.
- **Auth**: JWT (HS256) with httpOnly cookies (access 15 min + refresh 7 d). bcrypt hashing. Brute-force lockout (5 attempts → 15 min lock, keyed on real IP via X-Forwarded-For). Admin seeded on startup.
- **Frontend Routes**: `/`, `/login`, `/register`, `/portal` (client), `/admin` (admin only).
- **Backend Endpoints**:
  - Auth: POST `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/refresh`; GET `/api/auth/me`
  - Public: GET `/api/services`, GET `/api/availability?d=YYYY-MM-DD`, POST `/api/bookings`, POST `/api/leads`, POST `/api/chat`
  - Client-protected: GET `/api/bookings/mine`, PATCH `/api/bookings/{id}?status=cancelled` (own bookings only)
  - Admin-only: GET `/api/bookings`, GET `/api/leads`, PATCH `/api/bookings/{id}` (any status)
- **DB collections**: users, bookings, leads, chat_messages, login_attempts.
- **Fonts**: Fraunces (display, variable opsz) + Outfit (body) + Italianno (script). Gold shimmer animation on italic accents.

## User Personas
- **Visitor**: browses → views availability → books a treatment (no account needed).
- **Returning client**: signs in → portal shows upcoming + history → cancel own bookings.
- **Studio owner (Cinthia)**: admin dashboard → bookings + leads tabs → status workflow.

## Implemented (2026-05-21 → 2026-05-23)
- ✅ One-page brand site with Nav, Hero, Marquee, About, Services (12 treatments + luxury flyer image), Gallery, Testimonials, Offers, AvailabilityCalendar, Booking (+QR), Footer.
- ✅ AI Concierge "Camille" (Claude Sonnet 4.5 via Emergent LLM key) with in-chat lead capture + Call/WhatsApp CTAs. Auto-opens after 10s.
- ✅ Admin dashboard with Bookings + Leads tabs and inline status updater.
- ✅ Client portal with own upcoming/history + cancel.
- ✅ Public availability calendar — pick date → backend computes open slots → pre-fills booking form.
- ✅ PWA install pill, manifest, service worker, theme color.
- ✅ QR "Scan to book" panels in Contact + Footer.
- ✅ JWT auth + bcrypt + brute-force lockout (X-Forwarded-For).
- ✅ Backend 27/27 pytest pass after the X-Forwarded-For fix. Frontend 100% of tested flows pass.

## Deferred / Backlog
- **P1** Top up Emergent Universal LLM key — Camille currently returns a friendly "briefly resting" 503 because budget is exceeded.
- **P1** Email/SMS notifications (Resend/Twilio) on new booking + status changes.
- **P1** Replace placeholder Instagram / WhatsApp / Facebook URLs with real handles.
- **P2** Password reset (forgot password) flow.
- **P2** Stripe deposit on booking + Gift Cards.
- **P2** Bookings: rescheduling (currently cancel only).
- **P2** Treatment intake forms + therapist treatment notes in portal.
- **P3** Migrate FastAPI startup/shutdown to lifespan handlers.
- **P3** SEO meta + Open Graph image + structured data (LocalBusiness).
- **P3** Replace placeholder Privacy Policy & Terms.

## Test Credentials
See `/app/memory/test_credentials.md`.
- Admin: `cinthia@claaesthetics.com` / `ChangeMe2026!`
- Test client: `client@test.com` / `client123`
