# CLA Aesthetics & Wellness — PRD

## Original Problem Statement
Single-page luxury spa website (originally requested as "UM Spa Bendez", confirmed by user as **CLA Aesthetics & Wellness** matching the uploaded logo). Editorial, calm, premium aesthetic with ivory + gold palette, serif+sans typography. Sections: Hero, About, Services, Portfolio, Testimonials, Offers, Contact & Booking, Footer. Includes /admin page for booking management.

## Architecture
- **Stack**: React (CRA + craco, Tailwind, shadcn/ui, Radix, Lucide, Sonner, date-fns) + FastAPI + MongoDB (Motor).
- **Frontend**: `/app/frontend/src/pages/Home.jsx` composes section components (`Nav`, `Hero`, `About`, `Services`, `Gallery`, `Testimonials`, `Offers`, `Booking`, `Footer`). `/admin` route at `pages/Admin.jsx`.
- **Backend**: `/app/backend/server.py` with `/api` prefix. Endpoints:
  - `GET /api/services` — returns static services catalog (6 items)
  - `POST /api/bookings` — creates booking, returns Booking object with uuid + ISO `created_at`
  - `GET /api/bookings` — admin list, sorted desc by created_at
  - `PATCH /api/bookings/{id}?status=...` — update status (new|contacted|confirmed|completed|cancelled)
- **DB**: collection `bookings` (uuid id, name, email, phone, service, preferred_date, preferred_time, notes, status, created_at — all stored as primitives, `_id` excluded on reads).
- **Fonts**: Cormorant Garamond (display serif) + Outfit (body) + Italianno (script accent) via Google Fonts.

## User Personas
- **Prospective client**: visits homepage, browses services + gallery, books an appointment.
- **Studio owner (Cinthia)**: opens `/admin` to triage incoming bookings and mark statuses.

## Core Requirements (static)
- Premium one-page experience with smooth-scroll anchored navigation.
- Brand colors: `#FAF9F6` ivory, `#F5F2EA` champagne, `#D4AF37` gold, `#2C2A29` charcoal.
- Sticky nav with mobile hamburger sheet, "Book Now" CTA throughout.
- Booking form with shadcn Select + Popover Calendar + native time slots; client validation + success toast.
- Lightbox gallery using shadcn Dialog. Testimonials carousel. Offers cards.
- Contact section with phone, email, address, Google Maps embed, and quick-action buttons (Call / WhatsApp / Instagram).
- Footer with social links + Privacy/Terms placeholders.
- Admin page lists bookings + status updater (no auth gate — intentional for MVP).

## Implemented (2026-05-21)
- ✅ Backend bookings CRUD + services catalog (8/8 backend tests pass).
- ✅ Full single-page site with Hero (Korean greeting badge "안녕하세요"), About (founder card), Services (bento grid), Portfolio gallery with lightbox, Testimonials carousel, Offers/Memberships, Booking form, Footer.
- ✅ Admin page `/admin` with table, status filter, per-row status update.
- ✅ All UI elements have `data-testid` hooks. A11y titles added to Dialog/Sheet.
- ✅ Frontend e2e tested via Playwright (100% of tested flows).

## Deferred / Backlog
- **P1** Email notifications via Resend (client confirmation + studio alert) — needs Resend API key + verified sender domain.
- **P1** External booking redirect URL (Calendly/Square) — needs URL from owner.
- **P2** Admin auth gate (currently open). Recommend simple PIN or Emergent Google Auth.
- **P2** Replace placeholder Instagram/WhatsApp/Facebook URLs.
- **P2** Optional features: gift-card purchases, retail product list, blog/journal.
- **P3** SEO meta tags, Open Graph image, sitemap, structured data (LocalBusiness).
- **P3** Replace placeholder Privacy Policy & Terms with real legal copy.

## Test Credentials
- No auth in current build. `/admin` is open.
