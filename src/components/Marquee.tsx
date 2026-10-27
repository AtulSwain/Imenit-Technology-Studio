import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { sceneState } from "../lib/sceneState";
import { TECH } from "../lib/content";

type Item = { text: string; outline?: boolean };

/** Endless text band. Speeds up, reverses and skews with scroll velocity. */
function Row({ items, sep, dir }: { items: Item[]; sep: string; dir: 1 | -1 }) {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current!;
    const track = el.firstElementChild as HTMLElement;
    let x = 0;
    const tick = () => {
      const w = track.offsetWidth;
      if (!w) return;
      const v = sceneState.velocity || 0;
      const boost = 1 + Math.min(6, Math.abs(v) * 0.2);
      const sign = v < -0.5 ? -1 : 1;
      x -= 0.45 * boost * dir * sign;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      const skew = -Math.max(-5, Math.min(5, v * 0.12)) * dir;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [dir]);

  const track = (key: number) => (
    <div className="marquee__track" key={key} aria-hidden={key > 0}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "contents" }}>
          <span className={it.outline ? "o" : undefined}>{it.text}</span>
          <i>{sep}</i>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee__row${dir < 0 ? " marquee__row--rev" : ""}`} ref={row}>
      {[0, 1, 2].map(track)}
    </div>
  );
}

/** Small, continuously scrolling list of technologies (pure CSS animation, pauses on hover). */
function TechStrip() {
  return (
    <div className="tech" aria-label="Technologies we work with">
      <span className="tech__label">Our stack</span>
      <div className="tech__viewport">
        <div className="tech__track">
          {[0, 1].map((k) => (
            <div className="tech__group" key={k} aria-hidden={k > 0}>
              {TECH.map((t) => <span key={t}>{t}</span>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="marquee" aria-label="What we do">
      <TechStrip />
      <Row
        dir={1}
        sep="✦"
        items={[
          { text: "Web Development" }, { text: "Mobile Apps", outline: true }, { text: "AI & Automation" },
          { text: "UI/UX Design", outline: true }, { text: "Cloud & DevOps" },
        ]}
      />

    </section>
  );
}
