import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { ABOUT_STATEMENT, STATS } from "../lib/content";
import { Eyebrow } from "./ui";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    // statement lights up word by word while scrolling
    gsap.to(".about__statement .w", {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: ".about__statement", start: "top 80%", end: "bottom 40%", scrub: true },
    });
    // counters
    root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, {
        v: Number(el.dataset.count), duration: 2.2, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => { el.textContent = String(Math.round(o.v)); },
      });
    });
  }, { scope: root });

  return (
    <section className="about section" id="about" ref={root}>
      <div className="container">
        <Eyebrow index="02">About the Studio</Eyebrow>
        <p className="about__statement">
          {ABOUT_STATEMENT.map((seg, si) =>
            seg.t.split(" ").map((w, wi) =>
              seg.em
                ? <em className="w" key={`${si}-${wi}`}>{w}</em>
                : <span className="w" key={`${si}-${wi}`}>{w}</span>,
            ),
          )}
        </p>

        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" data-reveal key={s.label}>
              <span className="stat__num"><b data-count={s.value}>0</b>{s.suffix}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
