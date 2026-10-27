import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { ABOUT_STATEMENT, FOUNDER_NOTE, STATS } from "../lib/content";
import { Eyebrow } from "./ui";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    // statement lights up word by word while scrolling
    gsap.to(".about__statement .w", {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: ".about__statement", start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });
    // the note's underline draws in like a pen stroke
    gsap.fromTo(".note__stroke path", { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut",
      scrollTrigger: { trigger: ".note", start: "top 80%", once: true },
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
        <Eyebrow index="02">About the studio</Eyebrow>
        <p className="about__statement">
          {ABOUT_STATEMENT.map((seg, si) =>
            seg.t.split(" ").map((w, wi) =>
              seg.em
                ? <em className="w" key={`${si}-${wi}`}>{w}</em>
                : <span className="w" key={`${si}-${wi}`}>{w}</span>,
            ),
          )}
        </p>

        <div className="about__lower">
          <figure className="note" data-reveal>
            <blockquote>“{FOUNDER_NOTE.text}”</blockquote>
            <figcaption>
              <span className="note__name">{FOUNDER_NOTE.name}</span>
              <svg className="note__stroke" viewBox="0 0 160 14" aria-hidden>
                <path pathLength={1} d="M2 9c18-5 34-6 52-3s30 4 48 0 34-6 56-1" />
              </svg>
              <span className="note__role">{FOUNDER_NOTE.role}</span>
            </figcaption>
          </figure>

          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" data-reveal key={s.label}>
                <span className="stat__num"><b data-count={s.value}>0</b>{s.suffix}</span>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
