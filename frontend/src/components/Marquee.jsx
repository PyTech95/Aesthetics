import { Star } from "lucide-react";

const ITEMS = [
  "Bespoke Facials",
  "Holistic Massage",
  "Advanced Skin",
  "Body Sculpt",
  "Monthly Memberships",
  "Couple's Retreat",
  "Aromatherapy",
  "Microneedling",
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-hidden
      data-testid="marquee-strip"
      className="relative bg-[#2C2A29] text-white py-6 overflow-hidden border-y border-[#3a3736]"
    >
      <div className="marquee-track flex items-center gap-12 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-12 shrink-0">
            <span className="font-serif-display italic text-2xl md:text-3xl text-shimmer">
              {item}
            </span>
            <Star
              className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]"
              strokeWidth={1.2}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
