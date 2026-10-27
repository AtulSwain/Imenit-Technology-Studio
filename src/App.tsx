import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "./lib/gsap";
import { initSmoothScroll, navigateTo, startScroll, stopScroll } from "./lib/smoothScroll";
import { sceneState } from "./lib/sceneState";
import { UIProvider, useUI } from "./lib/ui";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Why } from "./components/Why";
import { Work } from "./components/Work";
import { Process } from "./components/Process";
import { Blog } from "./components/Blog";
import { Cta } from "./components/Cta";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Panels } from "./components/Panels";
import { Toast } from "./components/Toast";
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

function Site() {
  const reduce = prefersReducedMotion();
  const [loading, setLoading] = useState(!reduce);
  const [ready, setReady] = useState(reduce);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [hasGL] = useState(webglAvailable);
  const { panel, closePanel } = useUI();

  // smooth scrolling, locked while the preloader is up
  useEffect(() => {
    const cleanup = initSmoothScroll();
    if (!reduce) stopScroll();
    else sceneState.ready = true;
    // if the page was opened with a #hash, start at the top; the intro plays first
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    return cleanup;
  }, [reduce]);

  useEffect(() => {
    document.body.classList.toggle("is-loading", loading);
  }, [loading]);

  /**
   * One handler for every link on the page:
   *  - "#section" links scroll in-page and never change the URL (no reloads, no blank pages
   *    in embedded previews), "#" placeholders do nothing;
   *  - external links always open in a new tab so the site stays open.
   */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";

      if (href.startsWith("#")) {
        e.preventDefault();
        if (href.length < 2) return;
        const el = document.querySelector<HTMLElement>(href);
        if (!el) return;
        const go = () => navigateTo(href === "#top" ? 0 : el);
        if (panel) { closePanel(); window.setTimeout(go, 650); }
        else if (menuOpen) { setMenuOpen(false); window.setTimeout(go, 350); }
        else go();
        return;
      }

      if (/^https?:/i.test(href) && a.host !== window.location.host && !a.target) {
        e.preventDefault();
        window.open(a.href, "_blank", "noopener,noreferrer");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [panel, closePanel, menuOpen]);

  // mobile menu locks scrolling
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (loading || panel) return;
    if (menuOpen) stopScroll();
    else startScroll();
  }, [menuOpen, loading, panel]);

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
        <ErrorBoundary label="3d-scene" fallback={<div className="space is-fallback" aria-hidden />}>
          <Suspense fallback={null}>
            <SpaceCanvas />
          </Suspense>
        </ErrorBoundary>
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
        <Why />
        <Work />
        <Process />
        <Blog />
        <Cta />
        <Contact />
      </main>
      <Footer />

      <Panels />
      <Toast />
      <div className="curtain" aria-hidden><span className="curtain__logo">IMENIT</span></div>
      <ScrollDirector onActive={setActive} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary label="app">
      <UIProvider>
        <Site />
      </UIProvider>
    </ErrorBoundary>
  );
}
