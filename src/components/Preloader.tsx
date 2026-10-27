import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { LogoE } from "./ui";

/** Counter + logo reveal; waits for fonts and page load, then wipes up and calls onDone. */
type Props = { onSceneReady: () => void; onReveal: () => void; onDone: () => void };

export function Preloader({ onSceneReady, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const counter = { v: 0 };
    const render = () => {
      if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
    };
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
      setTimeout(resolve, 4000); // never wait forever
    });

    const intro = gsap.timeline();
    intro
      .fromTo(".preloader__logo > *", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0)
      .to(counter, { v: 86, duration: 1.6, ease: "power2.inOut", onUpdate: render }, 0.1);

    const introDone = new Promise<void>((r) => intro.eventCallback("onComplete", () => r()));
    let cancelled = false;

    Promise.all([loaded, document.fonts?.ready ?? Promise.resolve(), introDone]).then(() => {
      if (cancelled) return;
      gsap.timeline()
        .to(counter, { v: 100, duration: 0.5, ease: "power2.out", onUpdate: render })
        .to(".preloader__logo > *", { yPercent: -110, duration: 0.7, stagger: 0.04, ease: "expo.in" }, "+=0.1")
        .to(".preloader__meta, .preloader__bar", { opacity: 0, duration: 0.4 }, "<")
        .call(onSceneReady)
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" })
        .call(onReveal, undefined, "-=0.7")
        .call(onDone, undefined, ">");
    });
    return () => { cancelled = true; };
  }, { scope: root });

  return (
    <div className="preloader" ref={root} aria-hidden>
      <div className="preloader__inner">
        <div className="preloader__logo">
          <span>I</span><span>M</span><LogoE /><span>N</span><span>I</span><span>T</span>
        </div>
        <div className="preloader__bar"><span ref={bar} /></div>
        <div className="preloader__meta">
          <span>Initializing space</span>
          <span className="preloader__count" ref={count}>000</span>
        </div>
      </div>
    </div>
  );
}
