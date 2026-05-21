import { useEffect, useRef } from "react";

/**
 * Wraps each character of children text in a <span class="ltr">
 * and animates them in via .letter-reveal.is-visible CSS rules.
 * Pass an array of strings (lines) — each line is rendered on its own line.
 */
export default function LetterReveal({ lines = [], className = "", delayStep = 24, baseDelay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let counter = 0;
  return (
    <span ref={ref} className={`letter-reveal ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {Array.from(line).map((ch, i) => {
            const idx = counter++;
            return (
              <span
                key={`${li}-${i}`}
                className="ltr"
                style={{ transitionDelay: `${baseDelay + idx * delayStep}ms` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
