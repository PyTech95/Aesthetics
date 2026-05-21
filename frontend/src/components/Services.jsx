import { ArrowUpRight, Clock } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { scrollToId } from "@/lib/hooks";

const CATEGORY_IMG = {
  Facials:
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  "Advanced Skin":
    "https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=900&q=80",
  "Body Treatments":
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80",
  Massage:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  Memberships:
    "https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=900&q=80",
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
                }`}
              >
                <div className={`relative ${isFeatured ? "h-72 md:h-[420px]" : "h-56"} overflow-hidden`}>
                  <img
                    src={CATEGORY_IMG[s.category]}
                    alt={s.name}
                    className="absolute inset-0 h-full w-full object-cover kenburns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/40 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.32em] text-white bg-[#2C2A29]/40 backdrop-blur px-3 py-1 rounded-full border border-white/30">
                    {s.category}
                  </span>
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
                    <span className="font-serif-display text-xl text-[#B8932E]">
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
