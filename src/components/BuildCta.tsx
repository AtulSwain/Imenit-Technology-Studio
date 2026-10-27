import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { scrollToSection } from "../lib/router";

const go = (e: MouseEvent<HTMLAnchorElement>) => {
  if (scrollToSection("contact")) {
    e.preventDefault();
    history.replaceState(null, "", "#contact");
  }
};

/** The big closing call-to-action from the previous site: "Let's build what's next." + the spinning circle button. */
export function BuildCta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <p className="label cta__label" data-reveal>
          <span className="dot" aria-hidden /> Have an idea?
        </p>
        <h2 id="cta-title" className="cta__title" data-reveal>
          <span className="cta__mask"><span>Let's build</span></span>
          <span className="cta__mask"><em>what's next.</em></span>
        </h2>
        <a className="cta__circle" href="#contact" onClick={go} data-reveal>
          <svg className="cta__ring" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <path id="cta-ring-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text>
              <textPath href="#cta-ring-path" textLength="488" lengthAdjust="spacing">
                START A PROJECT • LET'S TALK •{" "}
              </textPath>
            </text>
          </svg>
          <ArrowUpRight className="cta__arrow" aria-hidden size={40} strokeWidth={1.3} />
          <span className="sr-only">Start a project — go to the contact form</span>
        </a>
      </div>
    </section>
  );
}
