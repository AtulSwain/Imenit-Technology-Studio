import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, CONTACT_EMAIL } from "../lib/content";
import { isNavigating, onScroll } from "../lib/smoothScroll";
import { Arrow, LogoE } from "./ui";

type Props = { active: string; menuOpen: boolean; onToggleMenu: () => void };

/** Glass pill navigation with an indicator that slides to the active (or hovered) link. */
export function Header({ active, menuOpen, onToggleMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const last = useRef(0);
  const nav = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  useEffect(() => onScroll((y) => {
    setScrolled(y > 40);
    if (isNavigating() || y < last.current - 2) setHidden(false);
    else if (y > last.current + 2 && y > 400) setHidden(true);
    last.current = y;
  }), []);

  // move the pill under the hovered link, otherwise the active one
  useLayoutEffect(() => {
    const place = () => {
      const target = nav.current?.querySelector<HTMLElement>(`[data-id="${hover ?? active}"]`);
      if (!target || !pill.current) return;
      pill.current.style.width = `${target.offsetWidth}px`;
      pill.current.style.transform = `translateX(${target.offsetLeft}px)`;
      pill.current.style.opacity = "1";
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active, hover]);

  const cls = ["header", scrolled && "is-scrolled", hidden && !menuOpen && "is-hidden"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <div className="container header__inner">
          <a className="logo" href="#top" aria-label="IMENIT Technologies — home">
            <span className="logo__word">IM<LogoE />NIT</span>
            <span className="logo__sub">Technologies</span>
          </a>

          <nav className="nav" aria-label="Main" ref={nav} onPointerLeave={() => setHover(null)}>
            <span className="nav__pill" ref={pill} aria-hidden />
            {NAV.map((n) => (
              <a
                key={n.id}
                data-id={n.id}
                href={`#${n.id}`}
                className={`nav__link${active === n.id ? " is-active" : ""}`}
                aria-current={active === n.id ? "true" : undefined}
                onPointerEnter={() => setHover(n.id)}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="header__right">
            <a href="#contact" className="btn btn--ghost header__cta" data-magnetic>
              <i className="pulse pulse--sm" aria-hidden />
              <span className="btn__label">Let's talk</span>
              <Arrow />
            </a>
            <button className="burger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={onToggleMenu}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" aria-hidden={!menuOpen}>
        <nav className="menu__nav">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} tabIndex={menuOpen ? 0 : -1} className={active === n.id ? "is-active" : undefined}>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <span>Ideas × Technology × Impact</span>
          <span>{CONTACT_EMAIL}</span>
        </div>
      </div>
    </>
  );
}
