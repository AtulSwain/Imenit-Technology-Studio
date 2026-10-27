import type { MouseEvent } from "react";
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

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="label hero__label">
            <span className="dot" aria-hidden /> {SITE.descriptor}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">Engineering</span>
            <span className="hero__line">what's next.</span>
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
              Explore our work <ArrowRight aria-hidden size={18} strokeWidth={1.6} />
            </a>
            <a className="btn btn--outline" href="#contact" onClick={jump("contact")}>
              Start a project
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden>
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

      <div className="container hero__meta">
        <span className="mono">Web · AI · Software</span>
        <span className="mono">{SITE.location}</span>
        <a className="hero__scroll mono" href="#work" onClick={jump("work")}>
          Selected work <ArrowDown aria-hidden size={14} strokeWidth={1.6} />
        </a>
      </div>
    </section>
  );
}
