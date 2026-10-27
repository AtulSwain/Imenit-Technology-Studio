import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { SITE } from "../lib/content";
import { scrollToSection } from "../lib/router";
import sculpture1400 from "../assets/sculpture-1400.webp";
import sculpture800 from "../assets/sculpture-800.webp";

const jump = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
  if (scrollToSection(id)) {
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
  }
};

/**
 * Pointer + scroll parallax for the hero visual. Writes two CSS variables on the hero;
 * the actual movement is done by CSS transforms (GPU-composited, no layout work).
 */
function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, px = 0, py = 0, sy = 0;
    const write = () => {
      raf = 0;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
      el.style.setProperty("--sy", sy.toFixed(3));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(write); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      queue();
    };
    const onScroll = () => {
      sy = Math.min(1, window.scrollY / Math.max(1, el.offsetHeight));
      queue();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref]);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroParallax(ref);

  return (
    <section className="hero" aria-labelledby="hero-title" ref={ref}>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="label hero__label">
            <span className="dot" aria-hidden /> {SITE.descriptor}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__mask"><span className="hero__line">Engineering</span></span>
            <span className="hero__mask"><span className="hero__line">what's next.</span></span>
          </h1>
          <p className="hero__sub">
            We build digital products, intelligent software, and technology that moves ideas forward.
          </p>
          <p className="hero__text">
            IMENIT Technologies is an independent technology studio focused on thoughtful digital experiences,
            software products and intelligent solutions for real-world problems.
          </p>
          <div className="hero__actions">
            <a className="btn btn--solid" href="#work" onClick={jump("work")}>
              <span>Explore our work</span> <ArrowRight aria-hidden size={18} strokeWidth={1.6} />
            </a>
            <a className="btn btn--outline" href="#contact" onClick={jump("contact")}>
              <span>Start a project</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden>
          <div className="hero__stage">
            <svg className="hero__orbits" viewBox="0 0 600 600" fill="none">
              <ellipse cx="300" cy="300" rx="286" ry="118" />
              <ellipse cx="300" cy="300" rx="292" ry="200" />
              <circle className="hero__sat" cx="586" cy="300" r="3" />
            </svg>
            <img
              src={sculpture1400}
              srcSet={`${sculpture800} 800w, ${sculpture1400} 1400w`}
              sizes="(max-width: 959px) 90vw, 50vw"
              width={1400}
              height={1400}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="container hero__meta">
        <span className="mono">Ideas × Technology × Impact</span>
        <span className="mono">{SITE.location}</span>
        <a className="hero__scroll mono" href="#work" onClick={jump("work")}>
          Selected work <ArrowDown aria-hidden size={14} strokeWidth={1.6} />
        </a>
      </div>
    </section>
  );
}
