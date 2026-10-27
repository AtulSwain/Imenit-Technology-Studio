import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "../lib/gsap";

/** Dot + trailing ring cursor. Shows a label over [data-cursor] elements and "Drag" over [data-drag]. */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const el = root.current!, r = ring.current!;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const setLabel = (text: string) => {
      label.current!.textContent = text;
      el.classList.add("is-label");
      el.classList.remove("is-hover");
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) setLabel(labelled.dataset.cursor ?? "");
      else if (t.closest("a, button, input")) { el.classList.add("is-hover"); el.classList.remove("is-label"); }
      else if (t.closest("[data-drag]")) setLabel("Drag");
      else el.classList.remove("is-hover", "is-label");
    };
    const down = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to(el, { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden>
      <div className="cursor__ring" ref={ring}><span className="cursor__label" ref={label} /></div>
      <div className="cursor__dot" ref={dot} />
    </div>
  );
}
