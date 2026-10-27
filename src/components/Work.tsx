import { ArrowUpRight, ArrowRight } from "lucide-react";
import { MORE_WORK, PROJECTS } from "../lib/content";
import { caseHref } from "../lib/router";
import { ProjectCover } from "./ProjectCover";
import { SectionHead } from "./SectionHead";

/** Shared element name: the cover morphs into the case-study header during the page transition. */
export const vt = (slug: string) => ({ viewTransitionName: `cover-${slug}` }) as React.CSSProperties;

export function Work() {
  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Selected work"
          id="work-title"
          title="Products we've designed, engineered and shipped."
          intro="A few of the platforms built at the studio — each with its own story, stack and trade-offs."
        />

        <ol className="projects">
          {PROJECTS.map((p, i) => (
            <li className={`project${i % 2 ? " project--flip" : ""}`} key={p.slug} data-reveal>
              <a className="project__media" href={caseHref(p.slug)} tabIndex={-1} aria-hidden style={vt(p.slug)}>
                <ProjectCover project={p} />
              </a>
              <div className="project__body">
                <span className="project__index" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <div className="project__meta mono">
                  <span>{p.category}</span>
                  <span className={`status${p.status !== "In development" ? " status--live" : ""}`}>{p.status}</span>
                </div>
                <h3 className="project__name">
                  <a href={caseHref(p.slug)}>{p.name}</a>
                </h3>
                <p className="project__tagline">{p.tagline}</p>
                <p className="project__summary">{p.summary}</p>
                <ul className="tags" aria-label="Built with">
                  {p.stack.slice(0, 5).map((s) => <li key={s}>{s}</li>)}
                </ul>
                <div className="project__links">
                  <a className="link" href={caseHref(p.slug)}>
                    Read the case study <ArrowRight aria-hidden size={16} strokeWidth={1.6} />
                  </a>
                  {p.links.live && (
                    <a className="link link--quiet" href={p.links.live} target="_blank" rel="noopener noreferrer">
                      Visit live site <ArrowUpRight aria-hidden size={16} strokeWidth={1.6} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="more" data-reveal>
          <h3 className="more__title label">More from the studio</h3>
          <ul className="more__list">
            {MORE_WORK.map((w) => (
              <li key={w.name}>
                <a href={w.href} target="_blank" rel="noopener noreferrer">
                  <span className="more__name">{w.name}</span>
                  <span className="more__detail">{w.detail}</span>
                  <span className="more__stack mono">{w.stack}</span>
                  <ArrowUpRight className="more__icon" aria-hidden size={18} strokeWidth={1.5} />
                  <span className="sr-only"> — source code on GitHub (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
