import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BRAND, SERVICES } from "@/lib/content";
import { useAuth } from "@/contexts/AuthContext";
import QRBookCard from "@/components/QRBookCard";

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
  "7:00 PM",
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Booking() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: "",
  });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill name/email/phone when client is logged in
  useEffect(() => {
    if (user && typeof user === "object") {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        email: f.email || user.email || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Listen for prefill from availability calendar
  useEffect(() => {
    const applyPrefill = () => {
      try {
        const raw = sessionStorage.getItem("cla_prefill");
        if (!raw) return;
        const { date: d, time: t } = JSON.parse(raw);
        if (d) setDate(parseISO(d));
        if (t) setTime(t);
        sessionStorage.removeItem("cla_prefill");
      } catch {
        /* ignore */
      }
    };
    applyPrefill();
    window.addEventListener("cla:prefill", applyPrefill);
    return () => window.removeEventListener("cla:prefill", applyPrefill);
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service || !date || !time) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        preferred_date: format(date, "yyyy-MM-dd"),
        preferred_time: time,
        notes: form.notes || "",
      });
      toast.success("Your booking request has been received.", {
        description: "We will confirm by phone or email within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", service: "", notes: "" });
      setDate(null);
      setTime("");
      if (BRAND.bookingExternalUrl) {
        window.open(BRAND.bookingExternalUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.detail ||
        "Something went wrong. Please try again or call us.";
      toast.error(typeof msg === "string" ? msg : "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="booking-section"
      className="relative bg-[#F5F2EA] py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left column: heading + contact info */}
        <div className="lg:col-span-5 reveal">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Book Your Appointment
            </span>
          </div>
          <h2 className="mt-5 font-serif-display font-light text-[34px] sm:text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29]">
            Reserve your{" "}
            <em className="italic text-shimmer">moment</em>.
          </h2>
          <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light max-w-md">
            Tell us a little about your visit. We'll personally confirm your
            appointment and prepare your suite ahead of time.
          </p>

          {/* Contact details */}
          <div className="mt-10 space-y-5">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              data-testid="contact-phone"
              className="group flex items-start gap-4"
            >
              <span className="h-11 w-11 grid place-items-center rounded-full border border-[#E5E1D8] bg-white">
                <Phone className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">
                  Call us
                </p>
                <p className="font-serif-display text-xl text-[#2C2A29] group-hover:text-[#B8932E] transition-colors">
                  {BRAND.phone}
                </p>
              </div>
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              data-testid="contact-email"
              className="group flex items-start gap-4"
            >
              <span className="h-11 w-11 grid place-items-center rounded-full border border-[#E5E1D8] bg-white">
                <Mail className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">
                  Email
                </p>
                <p className="font-serif-display text-xl text-[#2C2A29] group-hover:text-[#B8932E] transition-colors break-all">
                  {BRAND.email}
                </p>
              </div>
            </a>
            <div data-testid="contact-address" className="flex items-start gap-4">
              <span className="h-11 w-11 grid place-items-center rounded-full border border-[#E5E1D8] bg-white">
                <MapPin className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">
                  Studio
                </p>
                <p className="font-serif-display text-xl text-[#2C2A29] leading-snug">
                  {BRAND.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="h-11 w-11 grid place-items-center rounded-full border border-[#E5E1D8] bg-white">
                <Clock className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#5C5A59]">
                  Hours
                </p>
                <ul className="mt-1 space-y-1">
                  {BRAND.hours.map((h) => (
                    <li
                      key={h.d}
                      className="flex items-baseline gap-3 text-[14px] text-[#2C2A29]"
                    >
                      <span className="font-serif-display text-[16px]">
                        {h.d}
                      </span>
                      <span className="flex-1 border-b border-dotted border-[#D9D2C6]" />
                      <span className="text-[#5C5A59]">{h.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              data-testid="quick-call"
              className="inline-flex items-center gap-2 rounded-full bg-[#2C2A29] text-white px-5 py-3 text-[11px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> Call now
            </a>
            <a
              href={BRAND.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="quick-whatsapp"
              className="inline-flex items-center gap-2 rounded-full border border-[#2C2A29]/25 text-[#2C2A29] px-5 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} /> WhatsApp
            </a>
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="quick-instagram"
              className="inline-flex items-center gap-2 rounded-full border border-[#2C2A29]/25 text-[#2C2A29] px-5 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} /> Instagram
            </a>
          </div>

          {/* Map */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E1D8]">
            <iframe
              title="CLA Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                BRAND.address
              )}&output=embed`}
              width="100%"
              height="240"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>

          {/* QR scan to book */}
          <div className="mt-6">
            <QRBookCard />
          </div>
        </div>

        {/* Right column: Form */}
        <form
          onSubmit={onSubmit}
          data-testid="booking-form"
          className="lg:col-span-7 relative rounded-[24px] sm:rounded-[28px] bg-white border border-[#E5E1D8] p-5 sm:p-7 md:p-10 shadow-[0_30px_80px_-50px_rgba(44,42,41,0.25)] reveal"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name" htmlFor="bk-name" required>
              <input
                id="bk-name"
                data-testid="booking-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-[14px] text-[#2C2A29] placeholder:text-[#A8A39B] transition-colors"
              />
            </Field>
            <Field label="Email" htmlFor="bk-email" required>
              <input
                id="bk-email"
                data-testid="booking-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@email.com"
                className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-[14px] text-[#2C2A29] placeholder:text-[#A8A39B] transition-colors"
              />
            </Field>
            <Field label="Phone" htmlFor="bk-phone" required>
              <input
                id="bk-phone"
                data-testid="booking-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(555) 555-5555"
                className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-[14px] text-[#2C2A29] placeholder:text-[#A8A39B] transition-colors"
              />
            </Field>
            <Field label="Preferred service" required>
              <Select
                value={form.service}
                onValueChange={(v) => update("service", v)}
              >
                <SelectTrigger
                  data-testid="booking-service"
                  className="w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 h-auto text-[14px] text-[#2C2A29] focus:ring-[#D4AF37]/30"
                >
                  <SelectValue placeholder="Choose a treatment" />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF9F6] border-[#E5E1D8]">
                  {SERVICES.filter((s) => !s.comingSoon).map((s) => (
                    <SelectItem
                      key={s.id}
                      value={s.name}
                      data-testid={`booking-service-option-${s.id}`}
                    >
                      {s.name} — {s.duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Preferred date" required>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    data-testid="booking-date-trigger"
                    className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-left text-[14px] text-[#2C2A29] flex items-center justify-between"
                  >
                    {date ? format(date, "EEE, MMM d, yyyy") : (
                      <span className="text-[#A8A39B]">Select a date</span>
                    )}
                    <CalendarIcon className="h-4 w-4 text-[#B8932E]" strokeWidth={1.5} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[#FAF9F6] border-[#E5E1D8]"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) =>
                      d < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label="Preferred time" required>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger
                  data-testid="booking-time"
                  className="w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 h-auto text-[14px] text-[#2C2A29]"
                >
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent className="bg-[#FAF9F6] border-[#E5E1D8]">
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t} data-testid={`booking-time-${t}`}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Notes (optional)">
              <textarea
                data-testid="booking-notes"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Anything we should know — sensitivities, goals, preferences."
                rows={4}
                className="cla-input w-full bg-transparent border border-[#E5E1D8] rounded-xl px-4 py-3 text-[14px] text-[#2C2A29] placeholder:text-[#A8A39B] resize-none"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            data-testid="booking-submit"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#2C2A29] text-white px-8 py-4 text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Confirm booking"}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <p className="mt-4 text-[12px] text-[#5C5A59] leading-relaxed">
            By submitting, you agree to be contacted by our team to confirm your
            appointment. You'll receive a confirmation by phone or email within
            24 hours.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children, required, htmlFor }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-[0.24em] text-[#5C5A59] mb-2"
      >
        {label} {required && <span className="text-[#D4AF37]">*</span>}
      </label>
      {children}
    </div>
  );
}
