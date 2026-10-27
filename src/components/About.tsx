import { ABOUT } from "../lib/content";
import { SectionHead } from "./SectionHead";

export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="03" label="About the studio" id="about-title" title="Small by design. Serious about the work." />

        <div className="about__grid">
          <blockquote className="about__statement" data-reveal>
            <p>{ABOUT.statement}</p>
          </blockquote>
          <div className="about__body" data-reveal>
            {ABOUT.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>

        <ul className="values">
          {ABOUT.values.map((v, i) => (
            <li className="value" key={v.title} data-reveal style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
              <h3 className="value__title">{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
