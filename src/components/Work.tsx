import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { PROJECTS } from "../lib/content";
import { useUI } from "../lib/ui";
import { Arrow, Art } from "./ui";

/** Pinned section that scrolls sideways on desktop; stacks vertically on small screens. */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const { openProject } = useUI();
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: root.current, start: "top top", end: () => `+=${dist()}`,
          pin: ".work__pin", scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      gsap.utils.toArray<HTMLElement>(".project").forEach((p) => {
        gsap.fromTo(p.querySelector(".art"), { xPercent: -8 }, {
          xPercent: 8, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
        gsap.from(p, {
          opacity: 0.2, scale: 0.92, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "left 60%", scrub: true },
        });
      });
    });
    mm.add("(max-width: 900px)", () => {
      gsap.utils.toArray<HTMLElement>(".project").forEach((p) => {
        gsap.from(p, { y: 80, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
      });
    });
    gsap.from(".work__intro > *", {
      y: 50, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.1,
      scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
    });
  }, { scope: root });

  return (
    <section className="work" id="work" ref={root}>
      <div className="work__pin">
        <div className="work__track" ref={track}>
          <div className="work__intro">
            <p className="eyebrow eyebrow--index"><span className="eyebrow__i">(04)</span><span className="eyebrow__line" aria-hidden /><span>Selected Work</span></p>
            <h2 className="h2 work__title">Products that <em>move</em> people.</h2>
            <p className="muted">A glimpse of what we have designed, engineered and launched. Open any project for the full case study.</p>
            <div className="work__drag"><span /> Scroll to explore</div>
          </div>
          {PROJECTS.map((p, i) => (
            <button className="project" type="button" data-cursor="Open" key={p.title} onClick={() => openProject(i)} aria-label={`Open case study: ${p.title}`}>
              <span className="project__media">
                <Art kind={p.art} />
                <span className="project__badge">{p.results[0].value} <small>{p.results[0].label}</small></span>
                <span className="project__open" aria-hidden>View case study <Arrow className="" diagonal /></span>
              </span>
              <span className="project__meta"><span>{String(i + 1).padStart(2, "0")} — {p.year}</span><span>{p.category}</span></span>
              <span className="project__title">{p.title}</span>
              <span className="project__summary">{p.summary}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
