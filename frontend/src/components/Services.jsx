import { ArrowUpRight, Clock } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { scrollToId } from "@/lib/hooks";

const CATEGORY_IMG = {
  Injectables:
    "https://images.unsplash.com/photo-1583241800698-9c2e6f0a35a4?auto=format&fit=crop&w=1200&q=80",
  Lifts:
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=900&q=80",
  Facials:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  Skin:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
  Hair:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  Wellness:
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=900&q=80",
  "Body Spa":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
};

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative bg-[#F5F2EA] py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 reveal">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF37]" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
                Signature Menu
              </span>
            </div>
            <h2 className="mt-5 font-serif-display font-light text-[34px] sm:text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29]">
              Our signature{" "}
              <em className="italic text-shimmer">services</em>.
            </h2>
            <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light">
              A curated menu of rituals, refined treatments and quietly powerful
              technologies — each designed to leave skin radiant and the mind
              restored.
            </p>
          </div>

          <button
            data-testid="services-view-all"
            onClick={() => scrollToId("contact")}
            className="self-start inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-[#2C2A29] hover:text-[#B8932E] transition-colors"
          >
            Book a consultation
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Luxury treatments flyer */}
        <a
          href="https://customer-assets.emergentagent.com/job_luxury-spa-preview-1/artifacts/j6c024fe_009%20%281%29.png"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="services-flyer"
          className="mt-10 block rounded-3xl overflow-hidden border border-[#E5E1D8] bg-white hover-lift group"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_luxury-spa-preview-1/artifacts/j6c024fe_009%20%281%29.png"
            alt="CLA Luxury Treatments — Modern luxury, refined results"
            className="w-full h-auto object-contain"
          />
        </a>

        {/* Bento Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const isFeatured = i === 0;
            return (
              <article
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className={`group relative overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white hover-lift reveal ${
                  isFeatured ? "md:col-span-2 md:row-span-2" : ""
                } ${s.comingSoon ? "opacity-95" : ""}`}
              >
                <div className={`relative ${isFeatured ? "h-72 md:h-[420px]" : "h-56"} overflow-hidden`}>
                  <img
                    src={CATEGORY_IMG[s.category]}
                    alt={s.name}
                    className={`absolute inset-0 h-full w-full object-cover kenburns ${
                      s.comingSoon ? "grayscale-[40%]" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/40 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.32em] text-white bg-[#2C2A29]/40 backdrop-blur px-3 py-1 rounded-full border border-white/30">
                    {s.category}
                  </span>
                  {s.comingSoon && (
                    <span
                      data-testid={`service-coming-soon-${s.id}`}
                      className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-[#2C2A29] bg-[#D4AF37] px-3 py-1 rounded-full font-medium shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2C2A29] animate-pulse" />
                      Coming Soon
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="font-serif-display text-2xl md:text-[26px] text-[#2C2A29]">
                    {s.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#5C5A59] font-light">
                    {s.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[#EDE7DC] pt-4">
                    <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-[#5C5A59]">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {s.duration}
                    </span>
                    <span className={`font-serif-display text-xl ${s.comingSoon ? "italic text-[#5C5A59]" : "text-[#B8932E]"}`}>
                      {s.price}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
