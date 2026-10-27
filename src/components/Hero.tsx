import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { AVAILABILITY, HERO_WORDS, PROJECTS } from "../lib/content";
import { useUI } from "../lib/ui";
import { Arrow, ProjectMedia, SplitChars } from "./ui";
import { Clock } from "./Clock";

/** Last word of the headline cycles through HERO_WORDS, resizing smoothly. */
function Rotator({ start }: { start: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLSpanElement>(null);
  const words = [...HERO_WORDS, HERO_WORDS[0]]; // repeat first word for a seamless loop

  useGSAP(() => {
    if (!start || !list.current || !box.current) return;
    const items = Array.from(list.current.children) as HTMLElement[];
    gsap.set(box.current, { width: items[0].offsetWidth });
    const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
    items.slice(1).forEach((item, idx) => {
      const n = idx + 1;
      tl.to({}, { duration: 2.6 })
        .to(box.current, { width: item.offsetWidth, duration: 1, ease: "power3.inOut" })
        .to(list.current, { yPercent: -(100 / items.length) * n, duration: 1, ease: "power3.inOut" }, "<");
    });
    tl.set(list.current, { yPercent: 0 });
    const onResize = () => gsap.set(box.current, { width: "auto" });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, { dependencies: [start] });

  return (
    <span className="rotator" ref={box} aria-hidden>
      <span className="rotator__list" ref={list}>
        {words.map((w, i) => <span key={i}>{w}</span>)}
      </span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { openProject } = useUI();
  const featured = PROJECTS[0];

  // initial hidden state + gentle scroll-away
  useGSAP(() => {
    gsap.set(".char", { yPercent: 110 });
    gsap.set(".rotator", { yPercent: 110, opacity: 0 });
    gsap.to(".hero__inner", {
      yPercent: -10, opacity: 0, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.5 },
    });
    gsap.to(".hero__bottom, .hero__card", {
      opacity: 0, y: -30, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "35% top", scrub: 0.5 },
    });
  }, { scope: root });

  // intro once the preloader lifts — one soft wave, no gimmicks
  useGSAP(() => {
    if (!ready) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(".hero__eyebrow", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.2 }, 0)
      .to(".char", { yPercent: 0, duration: 1.5, stagger: 0.014 }, 0.05)
      .to(".rotator", { yPercent: 0, opacity: 1, duration: 1.5 }, 0.4)
      .fromTo("[data-hero-fade]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.09 }, 0.6)
      .from(document.querySelectorAll(".header__inner > *"), { y: -20, opacity: 0, duration: 1.2, stagger: 0.07 }, 0.25);
  }, { scope: root, dependencies: [ready] });

  return (
    <section className="hero" id="top" ref={root} data-drag>
      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow">
          <span>Ideas</span><b>×</b><span>Technology</span><b>×</b><span>Impact</span>
        </p>

        <h1 className="hero__title" aria-label={`We Build Digital Solutions for a Smarter ${HERO_WORDS[0]}`}>
          <span className="line"><SplitChars className="line__inner" text="We Build Digital" /></span>
          <span className="line"><SplitChars className="line__inner" text="Solutions for a" /></span>
          <span className="line">
            <span className="line__inner"><SplitChars text="Smarter" /> <Rotator start={ready} /></span>
          </span>
        </h1>

        <p className="hero__lead" data-hero-fade>
          We're a small studio of engineers and designers. We build web, mobile and AI products
          for teams who care about the details — and we stick around after launch.
        </p>

        <div className="hero__actions" data-hero-fade>
          <a href="#contact" className="btn btn--solid" data-magnetic>
            <span className="btn__label">Start a project</span>
            <Arrow />
          </a>
          <a href="#work" className="link-arrow">
            <span>See our work</span>
            <Arrow className="" />
          </a>
        </div>
      </div>

      <div className="container hero__bottom">
        <div className="hero__status" data-hero-fade><i className="pulse" /> {AVAILABILITY}</div>
        <div className="hero__time" data-hero-fade><Clock /></div>
        <a href="#services" className="hero__scroll" aria-label="Scroll down" data-hero-fade><span>Scroll</span><i /></a>
      </div>

      {featured && (
        <button className="hero__card" data-hero-fade onClick={() => openProject(0)}>
          <span className="hero__card-media"><ProjectMedia image={featured.image} art={featured.art} /></span>
          <span className="hero__card-text">
            <small>Recent work</small>
            <b>{featured.title}</b>
            <span>{featured.category}</span>
          </span>
          <Arrow className="hero__card-arrow" diagonal />
        </button>
      )}
    </section>
  );
}
