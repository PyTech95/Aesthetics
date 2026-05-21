import { ArrowRight, Star } from "lucide-react";
import { scrollToId } from "@/lib/hooks";
import { BRAND } from "@/lib/content";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/21fa9d9f-67b4-4058-a89a-ebf3ae7dfc46/images/ecdfcc126cf7fb62c42b8576ebf029c48b4845c0241290f67ad3781659f042ae.png";

export default function Hero() {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#FAF9F6]"
    >
      {/* Background image right side */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-[120px] lg:pt-[140px] pb-24 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-[100svh]">
        <div className="lg:col-span-7 flex flex-col">
          <h1
            data-testid="hero-headline"
            className="font-serif-display text-[44px] sm:text-6xl lg:text-[80px] leading-[1.02] tracking-tight text-[#2C2A29] font-light"
          >
            Elevate your <em className="italic text-[#B8932E]">glow.</em>
            <br />
            Restore your <span className="italic">calm.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[15px] sm:text-[17px] leading-relaxed font-light text-[#5C5A59]">
            A boutique aesthetics & wellness studio in South Hempstead. Bespoke
            facials, holistic massage and advanced skin treatments — designed
            around how you want to feel.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-cta-book"
              onClick={() => scrollToId("contact")}
              className="inline-flex items-center gap-3 rounded-full bg-[#2C2A29] text-white px-8 py-4 text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-colors duration-500"
            >
              Book your session <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              data-testid="hero-cta-services"
              onClick={() => scrollToId("services")}
              className="inline-flex items-center gap-3 rounded-full border border-[#2C2A29]/30 text-[#2C2A29] px-8 py-4 text-[12px] uppercase tracking-[0.24em] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors"
            >
              View services
            </button>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
                  strokeWidth={1.5}
                />
              ))}
              <span className="ml-2 text-[12px] uppercase tracking-[0.2em] text-[#5C5A59]">
                5-star rated by 200+ clients
              </span>
            </div>
            <div className="h-4 w-px bg-[#E5E1D8] hidden sm:block" />
            <p className="text-[12px] uppercase tracking-[0.2em] text-[#5C5A59]">
              Founded by {BRAND.founder.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:flex justify-end">
          {/* Decorative emblem card */}
          <div className="relative w-[360px] aspect-[3/4] rounded-3xl overflow-hidden border border-[#E5E1D8] bg-white/40 backdrop-blur-md shadow-[0_30px_80px_-40px_rgba(44,42,41,0.25)]">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
              alt="Spa candles"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-7 text-white">
              <p className="font-script text-3xl leading-none">With care,</p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.32em]">
                {BRAND.founder}
              </p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/70">
                {BRAND.founderTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[#5C5A59]">
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
}
