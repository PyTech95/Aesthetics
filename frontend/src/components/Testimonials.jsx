import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % TESTIMONIALS.length);
  const prev = () => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const t = TESTIMONIALS[i];

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative bg-[#F2E8DF] py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-10 text-center">
        <div className="reveal flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              Client Love
            </span>
            <span className="h-px w-10 bg-[#D4AF37]" />
          </div>
          <h2 className="mt-5 font-serif-display font-light text-[34px] sm:text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29]">
            What our clients{" "}
            <em className="italic text-shimmer">say</em>.
          </h2>
        </div>

        <div className="mt-12 sm:mt-14 relative reveal">
          <Quote
            className="mx-auto h-9 w-9 text-[#D4AF37]"
            strokeWidth={1.2}
          />
          <p
            data-testid="testimonial-text"
            className="mt-6 sm:mt-8 font-serif-display italic text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px] leading-[1.3] text-[#2C2A29] font-light"
          >
            “{t.text}”
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(t.rating)].map((_, idx) => (
                <Star
                  key={idx}
                  className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
                  strokeWidth={1.2}
                />
              ))}
            </div>
            <p className="text-[12px] uppercase tracking-[0.32em] text-[#5C5A59]">
              — {t.name}
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            data-testid="testimonial-prev"
            onClick={prev}
            aria-label="Previous testimonial"
            className="h-11 w-11 grid place-items-center rounded-full border border-[#2C2A29]/20 bg-white/60 hover:bg-white hover:border-[#D4AF37] transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-[#2C2A29]" strokeWidth={1.4} />
          </button>
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i
                    ? "w-8 bg-[#D4AF37]"
                    : "w-1.5 bg-[#2C2A29]/20"
                }`}
              />
            ))}
          </div>
          <button
            data-testid="testimonial-next"
            onClick={next}
            aria-label="Next testimonial"
            className="h-11 w-11 grid place-items-center rounded-full border border-[#2C2A29]/20 bg-white/60 hover:bg-white hover:border-[#D4AF37] transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-[#2C2A29]" strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </section>
  );
}
