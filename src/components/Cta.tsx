import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { CONTACT_EMAIL } from "../lib/content";
import { Arrow, SplitChars } from "./ui";

export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".cta__title .char", {
      yPercent: 120, rotate: 8, opacity: 0, ease: "expo.out", duration: 1.4, stagger: 0.025,
      scrollTrigger: { trigger: ".cta__title", start: "top 80%", once: true },
    });
  }, { scope: root });

  return (
    <section className="cta" id="contact" ref={root}>
      <div className="container cta__inner">
        <p className="eyebrow" data-reveal>Have an idea?</p>
        <h2 className="cta__title">
          <span className="line"><SplitChars className="line__inner" text="Let's build" /></span>
          <span className="line"><span className="line__inner"><em><SplitChars text="what's next." /></em></span></span>
        </h2>
        <a href={`mailto:${CONTACT_EMAIL}`} className="cta__circle" data-magnetic data-cursor="Say hi">
          <span className="cta__circle-text">
            <svg viewBox="0 0 200 200" aria-hidden>
              <defs><path id="circlePath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#circlePath" textLength="488" lengthAdjust="spacing">START A PROJECT • LET'S TALK • </textPath></text>
            </svg>
          </span>
          <Arrow className="cta__circle-arrow" diagonal />
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} className="cta__mail" data-reveal><span data-scramble>{CONTACT_EMAIL}</span></a>
      </div>
    </section>
  );
}
