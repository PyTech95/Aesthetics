import { QrCode, Smartphone } from "lucide-react";
import { BRAND } from "@/lib/content";

const QR_URL =
  "https://customer-assets.emergentagent.com/job_luxury-spa-preview-1/artifacts/uh5zkul7_qr-code.png";

export default function QRBookCard({ compact = false }) {
  if (compact) {
    return (
      <div className="rounded-2xl bg-white border border-[#E5E1D8] p-4 flex items-center gap-4">
        <img src={QR_URL} alt="Scan to book" className="h-20 w-20 rounded-md object-contain" />
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">Scan to book</p>
          <p className="mt-1 font-serif-display text-base text-[#2C2A29] leading-snug">
            Open this site on your phone
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="qr-book-card"
      className="rounded-[28px] bg-gradient-to-br from-[#2C2A29] to-[#3a3736] text-white p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#D4AF37]/12 blur-2xl" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shrink-0">
          <img
            src={QR_URL}
            alt="Scan to book CLA Aesthetics"
            className="h-28 w-28 sm:h-32 sm:w-32 object-contain"
          />
        </div>
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]">
            <QrCode className="h-3.5 w-3.5" strokeWidth={1.5} /> Scan to book
          </p>
          <h3 className="mt-3 font-serif-display text-2xl sm:text-[28px] font-light">
            Take CLA with you.
          </h3>
          <p className="mt-2 text-[13px] sm:text-[14px] text-white/70 leading-relaxed max-w-sm">
            Scan with your phone camera to instantly open our booking page —
            or install our app for one-tap access to your bookings, treatments and offers.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/65">
            <Smartphone className="h-3.5 w-3.5" strokeWidth={1.5} />
            {BRAND.phone}
          </div>
        </div>
      </div>
    </div>
  );
}
