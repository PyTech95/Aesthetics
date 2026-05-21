import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import { GALLERY } from "@/lib/content";

export default function Gallery() {
  const [active, setActive] = useState(null);

  return (
    <section
      id="portfolio"
      data-testid="gallery-section"
      className="relative bg-[#FAF9F6] py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end reveal">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#D4AF37]" />
              <span className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
                Our Space & Results
              </span>
            </div>
            <h2 className="mt-5 font-serif-display font-light text-[40px] md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight text-[#2C2A29]">
              Atmosphere &{" "}
              <em className="italic text-[#B8932E]">transformations</em>.
            </h2>
          </div>
          <p className="lg:col-span-5 text-[15px] md:text-[17px] leading-relaxed text-[#5C5A59] font-light">
            A look inside the studio — warm light, hand-poured candles, calm
            corners — and the quiet, visible results that follow our rituals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-3 md:gap-4">
          {GALLERY.map((g, i) => (
            <button
              key={i}
              data-testid={`gallery-item-${i}`}
              onClick={() => setActive(g)}
              className={`group relative overflow-hidden rounded-2xl border border-[#E5E1D8] aspect-[4/5] ${g.span} reveal`}
            >
              <img
                src={g.url}
                alt={g.caption}
                className="absolute inset-0 h-full w-full object-cover kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A29]/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] uppercase tracking-[0.28em]">
                  {g.caption}
                </span>
                <Expand className="h-4 w-4" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="gallery-lightbox"
          className="max-w-4xl bg-[#FAF9F6] border-[#E5E1D8] p-0 overflow-hidden"
        >
          {active && (
            <div className="relative">
              <DialogTitle className="sr-only">{active.caption}</DialogTitle>
              <DialogDescription className="sr-only">
                Enlarged gallery image: {active.caption}
              </DialogDescription>
              <img
                src={active.url}
                alt={active.caption}
                className="w-full max-h-[80vh] object-contain bg-[#2C2A29]"
              />
              <div className="px-6 py-4 border-t border-[#E5E1D8]">
                <p className="font-serif-display text-xl text-[#2C2A29]">
                  {active.caption}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
