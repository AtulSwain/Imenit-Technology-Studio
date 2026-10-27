import { useEffect, useRef, useState } from "react";

/** Counts a numeric value up when it scrolls into view (e.g. "47", "~45"). Non-numbers render as-is. */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!match || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, num, post] = match;
    const target = Number(num);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(`${pre}${Math.round(target * eased)}${post}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      setShown(`${pre}0${post}`);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref} aria-label={value}>{shown}</span>;
}
