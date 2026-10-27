import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { PRINCIPLES } from "../lib/content";
import { Eyebrow } from "./ui";

/** A plain, editorial list of how the studio works — deliberately quiet. */
export function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".principle").forEach((row) => {
      gsap.fromTo(row.querySelector(".principle__rule"), { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: "expo.inOut",
        scrollTrigger: { trigger: row, start: "top 88%", once: true },
      });
      gsap.from(row.querySelectorAll(".principle__num, .principle__title, .principle__text"), {
        y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.15,
        scrollTrigger: { trigger: row, start: "top 88%", once: true },
      });
    });
  }, { scope: root });

  return (
    <section className="approach section" id="approach" ref={root}>
      <div className="container">
        <div className="approach__head">
          <Eyebrow index="03">What we believe</Eyebrow>
          <h2 className="h2" data-words>
            <span className="wm"><span className="wi">A</span></span>{" "}
            <span className="wm"><span className="wi">few</span></span>{" "}
            <span className="wm"><span className="wi">things</span></span>{" "}
            <span className="wm"><em className="wi">we&nbsp;don't&nbsp;bend&nbsp;on.</em></span>
          </h2>
        </div>
        <ol className="principles">
          {PRINCIPLES.map((p, i) => (
            <li className="principle" key={p.title}>
              <span className="principle__rule" aria-hidden />
              <span className="principle__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="principle__title">{p.title}</h3>
              <p className="principle__text">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
