import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CodeXml } from "lucide-react";
import { PROJECTS, SITE } from "../lib/content";
import { caseHref } from "../lib/router";
import { ProjectCover } from "./ProjectCover";
import { vt } from "./Work";
import { CountUp } from "./CountUp";

/** A dedicated case-study page at #/work/<slug>. Sections appear only when there is real content for them. */
export function CaseStudy({ slug }: { slug: string }) {
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const p = PROJECTS[index];

  useEffect(() => {
    document.title = p ? `${p.name} — Case study · ${SITE.name}` : `Project not found · ${SITE.name}`;
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
    return () => { document.title = `${SITE.name} — Independent Technology Studio`; };
  }, [p]);

  if (!p) {
    return (
      <section className="section case-missing">
        <div className="container">
          <h1 className="h2">That project couldn't be found.</h1>
          <p><a className="link" href="#work"><ArrowLeft aria-hidden size={16} /> Back to all work</a></p>
        </div>
      </section>
    );
  }

  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <article className="case" aria-labelledby="case-title">
      <header className="container case__head">
        <a className="link link--quiet case__back" href="#work"><ArrowLeft aria-hidden size={16} strokeWidth={1.6} /> All work</a>
        <p className="mono case__kicker">
          <span>{p.category}</span><span>{p.year}</span>
          <span className={`status${p.status !== "In development" ? " status--live" : ""}`}>{p.status}</span>
        </p>
        <h1 id="case-title" className="case__title">{p.name}</h1>
        <p className="case__summary">{p.summary}</p>
        <div className="case__actions">
          {p.links.live && (
            <a className="btn btn--solid" href={p.links.live} target="_blank" rel="noopener noreferrer">
              Visit live site <ArrowUpRight aria-hidden size={18} strokeWidth={1.6} /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {p.links.code && (
            <a className="btn btn--outline" href={p.links.code} target="_blank" rel="noopener noreferrer">
              <CodeXml aria-hidden size={17} strokeWidth={1.6} /> Source code<span className="sr-only"> on GitHub (opens in a new tab)</span>
            </a>
          )}
          {p.note && <p className="case__note">{p.note}</p>}
        </div>
      </header>

      <div className="container case__media"><div style={vt(p.slug)}><ProjectCover project={p} eager /></div></div>

      <div className="container">
        <dl className="case__facts">
          <div><dt className="mono">Role</dt><dd>{p.role}</dd></div>
          <div><dt className="mono">Status</dt><dd>{p.status}</dd></div>
          <div><dt className="mono">Stack</dt><dd>{p.stack.join(", ")}</dd></div>
          {p.facts?.map((f) => <div key={f.label}><dt className="mono">{f.label}</dt><dd className="case__num"><CountUp value={f.value} /></dd></div>)}
        </dl>

        <div className="case__sections">
          <CaseBlock n="01" title="The problem">{p.problem}</CaseBlock>
          <CaseBlock n="02" title="Objective">{p.objective}</CaseBlock>
          <CaseBlock n="03" title="Design and engineering approach">{p.approach}</CaseBlock>
          <section className="case__block" data-reveal>
            <h2 className="case__h"><span className="mono">04</span> Key features</h2>
            <ul className="case__list">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
          <section className="case__block" data-reveal>
            <h2 className="case__h"><span className="mono">05</span> Technologies</h2>
            <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
          <CaseBlock n="06" title="Challenges and trade-offs">{p.tradeoffs}</CaseBlock>
          {p.next && <CaseBlock n="07" title="What's next">{p.next}</CaseBlock>}
        </div>

        {p.gallery && (
          <section className="case__gallery" aria-label="Screenshots">
            {p.gallery.map((g) => (
              <figure key={g.src} data-reveal>
                <img src={g.src} alt={g.alt} width={1440} height={900} loading="lazy" decoding="async" />
                {g.caption && <figcaption>{g.caption}</figcaption>}
              </figure>
            ))}
          </section>
        )}

        <nav className="case__next" aria-label="Next project">
          <a href={caseHref(next.slug)}>
            <span className="mono">Next project</span>
            <span className="case__next-name">{next.name} <ArrowRight aria-hidden size={28} strokeWidth={1.3} /></span>
          </a>
        </nav>
      </div>
    </article>
  );
}

function CaseBlock({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <section className="case__block" data-reveal>
      <h2 className="case__h"><span className="mono">{n}</span> {title}</h2>
      <p>{children}</p>
    </section>
  );
}
