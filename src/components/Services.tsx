import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "../lib/gsap";
import { SERVICES } from "../lib/content";
import { Arrow, ServiceIconSvg, SplitWords } from "./ui";

/** Spotlight that follows the pointer + subtle 3D tilt. */
function useCardFx(card: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = card.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    gsap.set(el, { transformPerspective: 900 });
    const rX = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const rY = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      rX((0.5 - py) * 10);
      rY((px - 0.5) * 12);
    };
    const leave = () => { rX(0); rY(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [card]);
}

function Card({ s, i, active, onSelect }: { s: (typeof SERVICES)[number]; i: number; active: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useCardFx(ref);
  return (
    <article ref={ref} className={`card${active ? " is-active" : ""}`} onClick={onSelect}>
      <span className="card__num">{String(i + 1).padStart(2, "0")}</span>
      <ServiceIconSvg icon={s.icon} />
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <ul className="card__tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
    </article>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0 });
  const idxRef = useRef(idx);
  idxRef.current = idx;
  const total = SERVICES.length;

  const go = useCallback((i: number) => setIdx(Math.max(0, Math.min(total - 1, i))), [total]);

  const slideTo = useCallback((i: number, instant = false) => {
    const t = track.current, v = viewport.current;
    if (!t || !v) return;
    const card = t.children[i] as HTMLElement;
    const maxShift = Math.max(0, t.scrollWidth - v.clientWidth + 40);
    gsap.to(t, { x: -Math.min(card.offsetLeft, maxShift), duration: instant ? 0 : 1.1, ease: "expo.out" });
  }, []);

  useEffect(() => {
    slideTo(idx);
    gsap.fromTo(counter.current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
    const onResize = () => slideTo(idx, true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [idx, slideTo]);

  // drag / swipe
  useEffect(() => {
    const v = viewport.current!, d = drag.current;
    const down = (e: PointerEvent) => {
      Object.assign(d, { active: true, moved: false, startX: e.clientX, startY: e.clientY, baseX: Number(gsap.getProperty(track.current, "x")) });
    };
    const move = (e: PointerEvent) => {
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - d.startY)) d.moved = true;
      if (d.moved) gsap.set(track.current, { x: d.baseX + dx * 0.9 });
    };
    const up = (e: PointerEvent) => {
      if (!d.active) return;
      d.active = false;
      const dx = e.clientX - d.startX;
      if (d.moved) {
        if (Math.abs(dx) > 50) setIdx((cur) => Math.max(0, Math.min(total - 1, cur + (dx < 0 ? 1 : -1))));
        else slideTo(idxRef.current);
      }
      setTimeout(() => { d.moved = false; }, 0);
    };
    v.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      v.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [slideTo, total]);

  useGSAP(() => {
    gsap.from(".card", {
      y: 80, opacity: 0, rotateY: -12, duration: 1.4, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: viewport.current, start: "top 85%", once: true },
    });
  }, { scope: root });

  return (
    <section className="services section" id="services" ref={root}>
      <div className="container services__grid">
        <div className="services__intro">
          <p className="eyebrow" data-reveal>Our Services</p>
          <h2 className="h2" data-words><SplitWords text="What We Do" /></h2>
          <p className="muted" data-reveal>From idea to execution, we craft technology that solves real problems and drives meaningful results.</p>
          <a href="#contact" className="link-arrow" data-reveal data-magnetic>
            <span data-scramble>Discuss your idea</span><Arrow className="" />
          </a>
        </div>

        <div className="services__slider">
          <div className="slider__head" data-reveal>
            <div className="slider__count">
              <b className="slider__current" ref={counter}>{String(idx + 1).padStart(2, "0")}</b> / <span>{String(total).padStart(2, "0")}</span>
            </div>
            <div className="slider__arrows">
              <button className="slider__btn" aria-label="Previous service" disabled={idx === 0} onClick={() => go(idx - 1)} data-magnetic>
                <svg viewBox="0 0 24 24"><path d="M20 12H5m6-6-6 6 6 6" /></svg>
              </button>
              <button className="slider__btn" aria-label="Next service" disabled={idx === total - 1} onClick={() => go(idx + 1)} data-magnetic>
                <svg viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
              </button>
            </div>
          </div>
          <div className="slider__viewport" ref={viewport} data-cursor="Drag">
            <div className="slider__track" ref={track}>
              {SERVICES.map((s, i) => (
                <Card key={s.title} s={s} i={i} active={i === idx} onSelect={() => { if (!drag.current.moved) go(i); }} />
              ))}
            </div>
          </div>
          <div className="slider__progress"><span style={{ transform: `scaleX(${(idx + 1) / total})` }} /></div>
        </div>
      </div>
    </section>
  );
}
