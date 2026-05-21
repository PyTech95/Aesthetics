import { Instagram, MessageCircle, Facebook } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/content";
import { scrollToId } from "@/lib/hooks";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#2C2A29] text-white py-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 grid place-items-center rounded-full bg-white/5 border border-white/10">
              <img
                src={BRAND.logoUrl}
                alt="CLA"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div>
              <p className="font-serif-display text-2xl">CLA Aesthetics</p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]">
                & Wellness
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-white/65 font-light">
            A boutique aesthetics & wellness studio in South Hempstead, NY.
            Bespoke facials, advanced skin treatments and holistic body
            therapies — by appointment.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram"
              aria-label="Instagram"
              className="h-11 w-11 grid place-items-center rounded-full border border-white/15 hover:border-[#D4AF37] hover:bg-white/5 transition-colors"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a
              href={BRAND.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-whatsapp"
              aria-label="WhatsApp"
              className="h-11 w-11 grid place-items-center rounded-full border border-white/15 hover:border-[#D4AF37] hover:bg-white/5 transition-colors"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <a
              href={BRAND.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-facebook"
              aria-label="Facebook"
              className="h-11 w-11 grid place-items-center rounded-full border border-white/15 hover:border-[#D4AF37] hover:bg-white/5 transition-colors"
            >
              <Facebook className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">
            Navigate
          </p>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollToId(l.id)}
                  data-testid={`footer-link-${l.id}`}
                  className="text-[14px] text-white/80 hover:text-[#D4AF37] transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">
            Visit
          </p>
          <p className="mt-5 font-serif-display text-xl leading-relaxed">
            {BRAND.address}
          </p>
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="mt-4 block font-serif-display text-xl text-[#D4AF37]"
          >
            {BRAND.phone}
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="block text-[14px] text-white/75 hover:text-[#D4AF37] transition-colors"
          >
            {BRAND.email}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-[12px] text-white/55">
          © {new Date().getFullYear()} CLA Aesthetics & Wellness. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[12px] text-white/55">
          <a href="#" className="hover:text-[#D4AF37]">Privacy Policy</a>
          <a href="#" className="hover:text-[#D4AF37]">Terms</a>
        </div>
      </div>
    </footer>
  );
}
