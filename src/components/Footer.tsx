import { ArrowUpRight } from "lucide-react";
import { NAV, PROJECTS, SITE, SOCIAL } from "../lib/content";
import { caseHref } from "../lib/router";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="#"><Logo /></a>
          <p>{SITE.oneLiner}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="mono">Studio</h2>
          <ul>{NAV.map((n) => <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>)}</ul>
        </nav>

        <div className="footer__col">
          <h2 className="mono">Projects</h2>
          <ul>{PROJECTS.map((p) => <li key={p.slug}><a href={caseHref(p.slug)}>{p.name}</a></li>)}</ul>
        </div>

        <div className="footer__col">
          <h2 className="mono">Contact</h2>
          <ul>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>{SITE.location}</li>
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} <ArrowUpRight aria-hidden size={14} strokeWidth={1.6} /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__base">
        <p>© {year} {SITE.name}. All rights reserved.</p>
        <p className="mono">Designed and built in-house</p>
      </div>
    </footer>
  );
}
