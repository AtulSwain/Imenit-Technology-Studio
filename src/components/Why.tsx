import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "../lib/gsap";
import { WHY, type BentoKind } from "../lib/content";
import { Eyebrow, SplitWords } from "./ui";

/** Small live visual inside each bento tile. */
function Visual({ kind }: { kind: BentoKind }) {
  const [typed, setTyped] = useState("");
  const full = "Summarise this contract and flag the risks.";

  useEffect(() => {
    if (kind !== "ai") return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % (full.length + 30); // pause at the end, then restart
      setTyped(full.slice(0, Math.min(i, full.length)));
    }, 70);
    return () => window.clearInterval(id);
  }, [kind]);

  switch (kind) {
    case "scale":
      return (
        <div className="viz viz--scale" aria-hidden>
          {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${-i * 0.18}s` }} />)}
          <span className="viz__badge"><b>99.99%</b> uptime</span>
        </div>
      );
    case "ai":
      return (
        <div className="viz viz--ai" aria-hidden>
          <div className="viz__bubble viz__bubble--me">{typed}<i className="viz__caret" /></div>
          <div className="viz__bubble viz__bubble--ai"><span /><span /><span /></div>
        </div>
      );
    case "design":
      return (
        <div className="viz viz--design" aria-hidden>
          <div className="viz__frame"><i /><i /><i /><i /></div>
          <div className="viz__guides" />
        </div>
      );
    case "secure":
      return (
        <div className="viz viz--secure" aria-hidden>
          <svg viewBox="0 0 64 64"><path d="M32 6 10 14v16c0 14 9.5 24 22 28 12.5-4 22-14 22-28V14L32 6Z" /><path d="m22 32 7 7 13-14" /></svg>
          <span className="viz__ring" /><span className="viz__ring viz__ring--2" />
        </div>
      );
    case "speed":
      return (
        <div className="viz viz--speed" aria-hidden>
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
            <div className="viz__row" key={d}><span>{d}</span><i style={{ animationDelay: `${i * 0.25}s` }} /></div>
          ))}
        </div>
      );
  }
}

/** "Why IMENIT" bento grid: glass tiles with live mini-visuals and a pointer spotlight. */
export function Why() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".bento__tile", {
      y: 70, opacity: 0, scale: 0.96, duration: 1.3, ease: "expo.out", stagger: 0.08,
      scrollTrigger: { trigger: ".bento", start: "top 82%", once: true },
    });
  }, { scope: root });

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const grid = root.current!.querySelector<HTMLElement>(".bento")!;
    const move = (e: PointerEvent) => {
      grid.querySelectorAll<HTMLElement>(".bento__tile").forEach((t) => {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    grid.addEventListener("pointermove", move);
    return () => grid.removeEventListener("pointermove", move);
  }, []);

  return (
    <section className="why section" id="why" ref={root}>
      <div className="container">
        <div className="section-head">
          <Eyebrow index="03">Why IMENIT</Eyebrow>
          <h2 className="h2" data-words><SplitWords text="Built different," /> <span className="wm"><em className="wi">on purpose.</em></span></h2>
        </div>
        <div className="bento">
          {WHY.map((w, i) => (
            <article className={`bento__tile bento__tile--${i + 1}`} key={w.kind}>
              <Visual kind={w.kind} />
              <div className="bento__text">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
