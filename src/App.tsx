import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "./lib/gsap";
import { initSmoothScroll, scrollToTarget, startScroll, stopScroll } from "./lib/smoothScroll";
import { sceneState } from "./lib/sceneState";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { Process } from "./components/Process";
import { Blog } from "./components/Blog";
import { Cta } from "./components/Cta";
import { Footer } from "./components/Footer";
import { ScrollDirector } from "./components/ScrollDirector";

// The 3D scene is code-split so the page shell paints first (the preloader covers the load).
const SpaceCanvas = lazy(() => import("./scene/SpaceCanvas"));

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function App() {
  const reduce = prefersReducedMotion();
  const [loading, setLoading] = useState(!reduce);
  const [ready, setReady] = useState(reduce);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [hasGL] = useState(webglAvailable);

  // smooth scrolling, locked while the preloader is up
  useEffect(() => {
    const cleanup = initSmoothScroll();
    if (!reduce) stopScroll();
    else sceneState.ready = true;
    return cleanup;
  }, [reduce]);

  useEffect(() => {
    document.body.classList.toggle("is-loading", loading);
  }, [loading]);

  // smooth in-page anchor links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!a || !id || id.length < 2) return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      setMenuOpen(false);
      scrollToTarget(id === "#top" ? 0 : el);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // mobile menu locks scrolling
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (loading) return;
    if (menuOpen) stopScroll();
    else startScroll();
  }, [menuOpen, loading]);

  const handleSceneReady = useCallback(() => { sceneState.ready = true; }, []);
  const handleReveal = useCallback(() => setReady(true), []);
  const handleDone = useCallback(() => {
    setLoading(false);
    startScroll();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      {loading && <Preloader onSceneReady={handleSceneReady} onReveal={handleReveal} onDone={handleDone} />}

      {hasGL ? (
        <Suspense fallback={null}>
          <SpaceCanvas />
        </Suspense>
      ) : (
        <div className="space is-fallback" aria-hidden />
      )}
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
      <div className="grid-lines" aria-hidden><span /><span /><span /><span /></div>
      <div className="scroll-progress" aria-hidden><span /></div>
      <Cursor />

      <Header active={active} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />

      <main>
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <About />
        <Work />
        <Process />
        <Blog />
        <Cta />
      </main>
      <Footer />

      <ScrollDirector onActive={setActive} />
    </>
  );
}
