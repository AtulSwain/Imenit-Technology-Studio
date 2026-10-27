import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { PROJECTS } from "../lib/content";
import { useUI } from "../lib/ui";
import { Arrow, Eyebrow, ProjectMedia } from "./ui";

/**
 * Selected work. The first project is featured full-width; the rest flow into a
 * staggered two-column grid, so adding projects in content.ts needs no layout changes.
 * When the grid has an empty spot, an invitation card fills it.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const { openProject } = useUI();
  const [featured, ...rest] = PROJECTS;
  const showInvite = rest.length % 2 === 1;

  useGSAP(() => {
    // each visual wipes open from the bottom as it enters, then drifts slightly (parallax)
    gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
      const media = card.querySelector(".work-card__media");
      const inner = card.querySelector(".work-card__media > *");
      gsap.fromTo(media, { clipPath: "inset(18% 6% 0% 6% round 18px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
      gsap.fromTo(inner, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(card.querySelectorAll(".work-card__info > *"), {
        y: 24, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.06,
        scrollTrigger: { trigger: card, start: "top 80%", once: true },
      });
    });
  }, { scope: root });

  const card = (p: (typeof PROJECTS)[number], i: number, extra = "") => (
    <button
      type="button"
      className={`work-card ${extra}`}
      key={p.title}
      onClick={() => openProject(i)}
      aria-label={`Open case study: ${p.title}`}
    >
      <span className="work-card__media">
        <ProjectMedia image={p.image} art={p.art} alt={p.title} />
        <span className="work-card__view" aria-hidden>View case study <Arrow className="" diagonal /></span>
      </span>
      <span className="work-card__info">
        <span className="work-card__row">
          <span className="work-card__title">{p.title}</span>
          <span className="work-card__year">{p.year}</span>
        </span>
        <span className="work-card__row work-card__row--sub">
          <span>{p.category}</span>
          <span className="work-card__result">{p.results[0].value} {p.results[0].label}</span>
        </span>
      </span>
    </button>
  );

  return (
    <section className="work-sec section" id="work" ref={root}>
      <div className="container">
        <div className="work-sec__head">
          <div>
            <Eyebrow index="04">Selected work</Eyebrow>
            <h2 className="h2" data-words>
              <span className="wm"><span className="wi">Products</span></span>{" "}
              <span className="wm"><span className="wi">that</span></span>{" "}
              <span className="wm"><em className="wi">move</em></span>{" "}
              <span className="wm"><span className="wi">people.</span></span>
            </h2>
          </div>
          <p className="muted" data-reveal>
            A few things we've designed and built recently. Open any of them for the story behind it.
            <span className="work-sec__count">{String(PROJECTS.length).padStart(2, "0")} projects</span>
          </p>
        </div>

        {featured && card(featured, 0, "work-card--featured")}

        <div className="work-grid">
          {rest.map((p, i) => card(p, i + 1))}
          {showInvite && (
            <a href="#contact" className="work-invite">
              <span className="work-invite__inner">
                <small>Next up</small>
                <span className="work-invite__title">Your project<br /><em>could be here.</em></span>
                <span className="work-invite__cta">Start a conversation <Arrow className="" /></span>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
