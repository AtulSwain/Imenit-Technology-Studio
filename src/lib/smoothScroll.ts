import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { sceneState } from "./sceneState";

type ScrollListener = (y: number, velocity: number) => void;

let lenis: Lenis | null = null;
const listeners = new Set<ScrollListener>();

/** Start Lenis smooth scrolling, wired into GSAP's ticker and ScrollTrigger. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) {
    // native scroll fallback still reports velocity
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      sceneState.velocity = (y - last) * 0.5;
      last = y;
      listeners.forEach((l) => l(y, sceneState.velocity));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }

  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on("scroll", (e: Lenis) => {
    ScrollTrigger.update();
    sceneState.velocity = e.velocity;
    listeners.forEach((l) => l(e.scroll, e.velocity));
  });
  const raf = (time: number) => lenis?.raf(time * 1000);
  const decay = () => { sceneState.velocity *= 0.92; };
  gsap.ticker.add(raf);
  gsap.ticker.add(decay);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    gsap.ticker.remove(decay);
    lenis?.destroy();
    lenis = null;
  };
}

export function onScroll(fn: ScrollListener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function stopScroll() { lenis?.stop(); document.body.style.overflow = lenis ? "" : "hidden"; }
export function startScroll() { lenis?.start(); document.body.style.overflow = ""; }

export function scrollToTarget(target: string | number | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}
