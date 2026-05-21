import { useEffect, useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { scrollToId } from "@/lib/hooks";
import { BRAND } from "@/lib/content";
import AnimatedCounter from "@/components/AnimatedCounter";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/21fa9d9f-67b4-4058-a89a-ebf3ae7dfc46/images/ecdfcc126cf7fb62c42b8576ebf029c48b4845c0241290f67ad3781659f042ae.png";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#FAF9F6]"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-100"
          style={{ transform: `translateY(${scrollY * 0.18}px) scale(1.08)` }}
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-[140px] sm:pt-[160px] lg:pt-[180px] pb-20 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center min-h-[100svh]">
        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`flex items-center gap-3 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            <span className="h-px w-8 bg-[#D4AF37]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#B8932E]">
              CLA Aesthetics & Wellness
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className={`font-serif-display text-[40px] xs:text-[44px] sm:text-6xl lg:text-[88px] xl:text-[96px] leading-[0.98] tracking-tight text-[#2C2A29] mt-5 sm:mt-7 font-light transition-all duration-1000 delay-150 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50' }}
          >
            Elevate your <em className="italic text-shimmer">glow.</em>
            <br />
            Restore your <span className="italic">calm.</span>
          </h1>

          <p
            className={`mt-6 sm:mt-7 max-w-xl text-[15px] sm:text-[17px] leading-relaxed font-light text-[#5C5A59] transition-all duration-1000 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            A boutique aesthetics & wellness studio in South Hempstead. Bespoke
            facials, holistic massage and advanced skin treatments — designed
            around how you want to feel.
          </p>

          <div
            className={`mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4 transition-all duration-1000 delay-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <button
              data-testid="hero-cta-book"
              onClick={() => scrollToId("contact")}
              className="group inline-flex items-center gap-3 rounded-full bg-[#2C2A29] text-white px-7 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-[12px] uppercase tracking-[0.24em] hover:bg-[#D4AF37] transition-all duration-500 magnetic"
            >
              Book your session
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </button>
            <button
              data-testid="hero-cta-services"
              onClick={() => scrollToId("services")}
              className="inline-flex items-center gap-3 rounded-full border border-[#2C2A29]/30 text-[#2C2A29] px-7 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-[12px] uppercase tracking-[0.24em] hover:border-[#D4AF37] hover:text-[#B8932E] transition-colors magnetic"
            >
              View services
            </button>
          </div>

          {/* Trust strip */}
          <div
            className={`mt-10 sm:mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 transition-all duration-1000 delay-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-[#D4AF37] text-[#D4AF37]"
                  strokeWidth={1.5}
                />
              ))}
              <span className="ml-2 text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#5C5A59]">
                5-star rated by{" "}
                <AnimatedCounter
                  end={200}
                  suffix="+"
                  className="font-serif-display text-[#2C2A29] text-[15px] normal-case"
                />{" "}
                clients
              </span>
            </div>
            <div className="h-4 w-px bg-[#E5E1D8] hidden sm:block" />
            <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#5C5A59]">
              Founded by {BRAND.founder.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:flex justify-end">
          <div className="relative w-[360px] aspect-[3/4] rounded-3xl overflow-hidden border border-[#E5E1D8] bg-white/40 backdrop-blur-md shadow-[0_30px_80px_-40px_rgba(44,42,41,0.25)] animate-float">
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
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[#5C5A59]">
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
}
