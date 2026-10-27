import { useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP, hasFinePointer, prefersReducedMotion } from "../lib/gsap";
import { SCENE_POSES } from "../lib/content";
import { sceneState } from "../lib/sceneState";
import { scramble } from "../lib/scramble";

// sections without their own nav item highlight the closest one
const NAV_ALIAS: Record<string, string> = { why: "about", process: "work", cta: "contact" };

/**
 * Page-wide motion that spans sections. Rendered LAST so its ScrollTriggers are
 * created after the pinned Work section and account for its pin spacing.
 */
export function ScrollDirector({ onActive }: { onActive: (id: string) => void }) {
  useGSAP(() => {
    // generic reveals
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
      gsap.from(el.querySelectorAll(".wi"), {
        yPercent: 110, rotate: 4, duration: 1.3, ease: "expo.out", stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    // scroll progress bar
    gsap.to(".scroll-progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    // active nav link
    gsap.utils.toArray<HTMLElement>("main section[id]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: "top 50%", end: "bottom 50%",
        onToggle: (self) => { if (self.isActive) onActive(NAV_ALIAS[sec.id] ?? sec.id); },
      });
    });

    // 3D ribbon choreography: one scrubbed timeline across the page,
    // with a keyframe wherever a section with a pose begins.
    let sceneTl: gsap.core.Timeline | null = null;
    const build = () => {
      sceneTl?.scrollTrigger?.kill();
      sceneTl?.kill();
      const secs = gsap.utils.toArray<HTMLElement>("main section[id]").filter((s) => SCENE_POSES[s.id]);
      const max = ScrollTrigger.maxScroll(window) || 1;
      Object.assign(sceneState.target, SCENE_POSES.top);
      sceneTl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { start: 0, end: "max", scrub: 1.4 } });
      sceneTl.set(sceneState.target, { ...SCENE_POSES.top }, 0);
      let prev = 0;
      secs.slice(1).forEach((sec) => {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        const at = Math.max(prev + 0.001, Math.min(1, (top - window.innerHeight * 0.35) / max));
        sceneTl!.to(sceneState.target, { ...SCENE_POSES[sec.id], duration: at - prev }, prev);
        prev = at;
      });
      if (prev < 1) sceneTl.to({}, { duration: 1 - prev }, prev);
    };
    let busy = false;
    const onRefresh = () => {
      if (busy) return;
      busy = true;
      build();
      ScrollTrigger.update();
      busy = false;
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
    build();
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      sceneTl?.scrollTrigger?.kill();
      sceneTl?.kill();
    };
  }, []);

  // hover-only effects: scramble text + magnetic elements
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      const host = el.closest<HTMLElement>("a, button") ?? el;
      const fn = () => scramble(el, 480);
      host.addEventListener("mouseenter", fn);
      cleanups.push(() => host.removeEventListener("mouseenter", fn));
    });

    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const strength = el.classList.contains("cta__circle") ? 0.45 : 0.3;
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
