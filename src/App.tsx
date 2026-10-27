import { useEffect, useState } from "react";
import { NAV } from "./lib/content";
import { scrollToSection, useRoute } from "./lib/router";
import { useReveal } from "./lib/reveal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Ticker } from "./components/Ticker";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Process } from "./components/Process";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CaseStudy } from "./components/CaseStudy";

/** Highlights the nav item for the section currently in view. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!enabled) { setActive(""); return; }
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => { if (window.scrollY < window.innerHeight * 0.4) setActive(""); };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onTop); };
  }, [enabled]);
  return active;
}

function Site() {
  const route = useRoute();
  const isHome = route.page === "home";
  const active = useActiveSection(isHome);
  useReveal([route]);

  // arriving at #section (direct link, refresh, or from a case study) → jump there once rendered
  useEffect(() => {
    if (route.page === "home" && route.section) {
      requestAnimationFrame(() => scrollToSection(route.section!, true));
    }
  }, [route]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header route={route} active={active} />
      <main id="main" tabIndex={-1}>
        {route.page === "case" ? (
          <CaseStudy slug={route.slug} />
        ) : (
          <>
            <Hero />
            <Ticker />
            <Work />
            <Services />
            <About />
            <Process />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <div className="progress" aria-hidden />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Site />
    </ErrorBoundary>
  );
}
