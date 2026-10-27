import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { STEPS } from "../lib/content";
import { Eyebrow, SplitWords } from "./ui";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".step").forEach((step, i) => {
      const st = { trigger: ".steps", start: "top 80%", once: true };
      gsap.to(step.querySelector(".step__line i"), { scaleX: 1, duration: 1.6, ease: "expo.inOut", delay: i * 0.15, scrollTrigger: st });
      gsap.from(Array.from(step.children).slice(1), {
        y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, delay: 0.3 + i * 0.15, scrollTrigger: st,
      });
    });
  }, { scope: root });

  return (
    <section className="process section" id="process" ref={root}>
      <div className="container">
        <div className="process__head">
          <Eyebrow index="05">How We Work</Eyebrow>
          <h2 className="h2" data-words><SplitWords text="From spark to" /> <span className="wm"><em className="wi">scale.</em></span></h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__line"><i /></span>
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
