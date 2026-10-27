import { PROCESS } from "../lib/content";
import { SectionHead } from "./SectionHead";

/** Light, paper-toned section — a deliberate change of rhythm in the page. */
export function Process() {
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead
          index="04"
          label="Process"
          id="process-title"
          title="How a project moves from idea to launch."
          intro="Four clear stages, so you always know what's happening and what comes next."
        />
        <ol className="steps">
          {PROCESS.map((s, i) => (
            <li className="step" key={s.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="mono step__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="step__title">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
