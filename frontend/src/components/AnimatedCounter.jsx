import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  end = 200,
  duration = 1800,
  suffix = "",
  prefix = "",
  className = "",
}) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTs = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - startTs) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(Math.round(end * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
