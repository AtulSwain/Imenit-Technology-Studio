import { useEffect, useRef, useState } from "react";
import { NAV } from "../lib/content";
import { onScroll } from "../lib/smoothScroll";
import { Arrow, LogoE } from "./ui";

type Props = { active: string; menuOpen: boolean; onToggleMenu: () => void };

export function Header({ active, menuOpen, onToggleMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => onScroll((y) => {
    setScrolled(y > 40);
    setHidden(y > last.current && y > 300);
    last.current = y;
  }), []);

  const cls = ["header", scrolled && "is-scrolled", hidden && !menuOpen && "is-hidden"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <div className="container header__inner">
          <a className="logo" href="#top" aria-label="IMENIT Technologies — home">
            <span className="logo__word">IM<LogoE />NIT</span>
            <span className="logo__sub">Technologies</span>
          </a>

          <nav className="nav" aria-label="Main">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`nav__link${active === n.id ? " is-active" : ""}`} data-scramble>
                {n.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn btn--ghost header__cta" data-magnetic>
            <span className="btn__label" data-scramble>Get Started</span>
            <Arrow />
          </a>

          <button className="burger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={onToggleMenu}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className="menu" aria-hidden={!menuOpen}>
        <nav className="menu__nav">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} tabIndex={menuOpen ? 0 : -1}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <p className="menu__foot">Ideas × Technology × Impact</p>
      </div>
    </>
  );
}
