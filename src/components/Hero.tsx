import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { scramble } from "../lib/scramble";
import { HERO_WORDS } from "../lib/content";
import { Arrow, SplitChars } from "./ui";

/** Last word of the headline cycles through HERO_WORDS, resizing smoothly. */
function Rotator({ start }: { start: boolean }) {
  const box = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLSpanElement>(null);
  const words = [...HERO_WORDS, HERO_WORDS[0]]; // repeat first word for a seamless loop

  useGSAP(() => {
    if (!start || !list.current || !box.current) return;
    const items = Array.from(list.current.children) as HTMLElement[];
    gsap.set(box.current, { width: items[0].offsetWidth });
    const tl = gsap.timeline({ repeat: -1 });
    items.slice(1).forEach((item, idx) => {
      const n = idx + 1;
      tl.to({}, { duration: 2.2 })
        .to(box.current, { width: item.offsetWidth, duration: 0.8, ease: "expo.inOut" })
        .to(list.current, { yPercent: -(100 / items.length) * n, duration: 0.9, ease: "expo.inOut" }, "<");
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

  // initial hidden state + scroll-away effect
  useGSAP(() => {
    gsap.set(".char", { yPercent: 115, rotate: 6 });
    gsap.set(".rotator", { yPercent: 115, opacity: 0 });
    gsap.to(".hero__inner", {
      yPercent: -18, opacity: 0, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero__bottom", {
      opacity: 0, y: -40, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top top", end: "30% top", scrub: true },
    });
  }, { scope: root });

  // intro once the preloader lifts
  useGSAP(() => {
    if (!ready) return;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.set(".hero__eyebrow", { opacity: 1 }, 0);
    root.current!.querySelectorAll<HTMLElement>("[data-type]").forEach((el, i) => {
      tl.call(() => scramble(el, 650), undefined, i * 0.18);
    });
    tl.to(".char", { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.022 }, 0.1)
      .to(".rotator", { yPercent: 0, opacity: 1, duration: 1.4 }, 0.55)
      .fromTo("[data-hero-fade]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12 }, 0.7)
      .from(document.querySelectorAll(".header__inner > *"), { y: -30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.3)
      .from(".hero__side", { opacity: 0, duration: 1.5 }, 1);
  }, { scope: root, dependencies: [ready] });

  return (
    <section className="hero" id="top" ref={root} data-drag>
      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow">
          <span data-type>Ideas</span><b>×</b><span data-type>Technology</span><b>×</b><span data-type>Impact</span>
        </p>

        <h1 className="hero__title" aria-label={`We Build Digital Solutions for a Smarter ${HERO_WORDS[0]}`}>
          <span className="line"><SplitChars className="line__inner" text="We Build Digital" /></span>
          <span className="line"><SplitChars className="line__inner" text="Solutions for a" /></span>
          <span className="line">
            <span className="line__inner"><SplitChars text="Smarter" /> <Rotator start={ready} /></span>
          </span>
        </h1>

        <p className="hero__lead" data-hero-fade>
          IMENIT Technologies is a modern technology studio focused on building scalable web, mobile and AI
          solutions that help businesses grow, innovate and stay ahead.
        </p>

        <div className="hero__actions" data-hero-fade>
          <a href="#contact" className="btn btn--solid" data-magnetic>
            <span className="btn__label" data-scramble>Start a Project</span>
            <Arrow />
          </a>
          <a href="#work" className="link-arrow" data-magnetic>
            <span data-scramble>Our Work</span>
            <Arrow className="" />
          </a>
        </div>
      </div>

      <div className="container hero__bottom">
        <div className="hero__status" data-hero-fade><i className="pulse" /> Available for new projects</div>
        <div className="hero__hint" data-hero-fade><span className="hero__hint-icon" /> Drag to move the space</div>
        <a href="#services" className="hero__scroll" aria-label="Scroll down" data-hero-fade><span>Scroll</span><i /></a>
      </div>

      <div className="hero__side" aria-hidden>
        <span>Est. Digital Studio</span><i /><span>Web · Mobile · AI</span>
      </div>
    </section>
  );
}
