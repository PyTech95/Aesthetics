import { Award, Sparkles, HeartHandshake } from "lucide-react";
import { BRAND } from "@/lib/content";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80";

const HIGHLIGHTS = [
  {
    Icon: Award,
    label: "Certified Esthetician",
    desc: "Advanced training in clinical facials and skin science.",
  },
  {
    Icon: Sparkles,
    label: "10+ years of practice",
    desc: "A decade refining a thoughtful, results-led approach.",
  },
  {
    Icon: HeartHandshake,
    label: "Bespoke, never templated",
    desc: "Every ritual is shaped around your skin, body and mood.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative bg-[#FAF9F6] py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14 lg:gap-20 items-center">
        {/* Image side */}
        <div className="lg:col-span-5 reveal">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] aspect-[4/5]">
              <img
                src={ABOUT_IMG}
                alt="Founder portrait"
                className="absolute inset-0 h-full w-full object-cover kenburns"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-8 -right-4 lg:-right-10 bg-white rounded-2xl border border-[#E5E1D8] shadow-[0_24px_60px_-32px_rgba(44,42,41,0.18)] px-6 py-5 max-w-[230px]">
              <p className="font-script text-2xl text-[#B8932E] leading-none">
                Cinthia
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[#5C5A59]">
                {BRAND.founderTitle}
              </p>
              <div className="gold-rule my-3" />
              <p className="text-[12px] text-[#5C5A59] leading-relaxed">
                “Beauty is the quietest form of confidence — we help you feel it.”
              </p>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="lg:col-span-7 reveal">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
              About CLA
            </span>
          </div>
          <h2 className="font-serif-display font-light text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29] mt-5">
            A quiet sanctuary, devoted to{" "}
            <em className="italic text-[#B8932E]">visible care</em>.
          </h2>
          <p className="mt-7 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light max-w-2xl">
            CLA Aesthetics & Wellness was born from a simple belief: how you
            care for your skin is how you care for yourself. Founded by{" "}
            {BRAND.founder}, our studio blends advanced clinical techniques with
            the slow, sensorial rituals of a true spa — so you leave looking
            luminous and feeling deeply restored.
          </p>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(({ Icon, label, desc }) => (
              <div
                key={label}
                data-testid={`about-highlight-${label.replace(/\s+/g, "-").toLowerCase()}`}
                className="rounded-2xl border border-[#E5E1D8] bg-white/80 px-5 py-6 hover-lift"
              >
                <Icon
                  className="h-5 w-5 text-[#D4AF37]"
                  strokeWidth={1.4}
                />
                <p className="mt-4 font-serif-display text-xl text-[#2C2A29]">
                  {label}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5C5A59]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
