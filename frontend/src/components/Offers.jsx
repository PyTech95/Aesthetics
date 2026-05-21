import { Check, ArrowRight } from "lucide-react";
import { OFFERS } from "@/lib/content";
import { scrollToId } from "@/lib/hooks";

export default function Offers() {
  return (
    <section
      id="offers"
      data-testid="offers-section"
      className="relative bg-[#FAF9F6] py-20 sm:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="max-w-3xl reveal">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Offers & Memberships
            </span>
          </div>
          <h2 className="mt-5 font-serif-display font-light text-[34px] sm:text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29]">
            Rituals worth{" "}
            <em className="italic text-shimmer">returning to</em>.
          </h2>
          <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light">
            Curated bundles and membership plans for those who treat self-care
            as a discipline, not a treat.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {OFFERS.map((o, i) => {
            const featured = i === 1;
            return (
              <article
                key={o.title}
                data-testid={`offer-card-${o.title.replace(/\s+/g, "-").toLowerCase()}`}
                className={`relative rounded-3xl p-8 lg:p-10 hover-lift reveal flex flex-col ${
                  featured
                    ? "bg-[#2C2A29] text-white border border-[#2C2A29]"
                    : "bg-white border border-[#E5E1D8]"
                }`}
              >
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em] ${
                    featured
                      ? "bg-[#D4AF37] text-white"
                      : "bg-[#F2E8DF] text-[#B8932E]"
                  }`}
                >
                  {o.badge}
                </span>
                <h3
                  className={`mt-6 font-serif-display text-3xl lg:text-[34px] ${
                    featured ? "text-white" : "text-[#2C2A29]"
                  }`}
                >
                  {o.title}
                </h3>
                <p
                  className={`mt-4 font-serif-display text-4xl ${
                    featured ? "text-[#D4AF37]" : "text-[#B8932E]"
                  }`}
                >
                  {o.price}
                </p>
                <p
                  className={`mt-2 text-[12px] uppercase tracking-[0.24em] ${
                    featured ? "text-white/60" : "text-[#5C5A59]"
                  }`}
                >
                  {o.note}
                </p>

                <ul className="mt-7 space-y-3 flex-1">
                  {o.benefits.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-3 text-[14px] leading-relaxed ${
                        featured ? "text-white/85" : "text-[#5C5A59]"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 ${
                          featured ? "text-[#D4AF37]" : "text-[#B8932E]"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  data-testid={`offer-cta-${o.title.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => scrollToId("contact")}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[12px] uppercase tracking-[0.24em] transition-colors ${
                    featured
                      ? "bg-[#D4AF37] text-white hover:bg-[#C5A059]"
                      : "border border-[#2C2A29]/25 text-[#2C2A29] hover:border-[#D4AF37] hover:text-[#B8932E]"
                  }`}
                >
                  Book this offer
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
