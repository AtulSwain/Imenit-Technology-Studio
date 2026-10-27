import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { PROJECTS } from "../lib/content";
import { Art } from "./ui";

/** Pinned section that scrolls sideways on desktop; stacks vertically on small screens. */
export function Work() {
  const root = useRef<HTMLElement>(null);
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
            <p className="eyebrow">Selected Work</p>
            <h2 className="h2 work__title">Products that <em>move</em> people.</h2>
            <p className="muted">A glimpse of what we have designed, engineered and launched.</p>
            <div className="work__drag"><span /> Scroll to explore</div>
          </div>
          {PROJECTS.map((p, i) => (
            <a className="project" href="#contact" data-cursor="View" key={p.title}>
              <div className="project__media"><Art kind={p.art} /></div>
              <div className="project__meta"><span>{String(i + 1).padStart(2, "0")}</span><span>{p.category}</span></div>
              <h3 className="project__title">{p.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
