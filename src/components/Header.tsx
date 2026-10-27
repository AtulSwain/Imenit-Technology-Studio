import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV } from "../lib/content";
import { scrollToSection, type Route } from "../lib/router";
import { Logo } from "./Logo";

type Props = { route: Route; active: string };

export function Header({ route, active }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // mobile menu: lock scroll, Esc to close, move focus in and back out
  useEffect(() => {
    document.body.classList.toggle("is-menu-open", open);
    if (!open) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // close the menu if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** On the home page, scroll in place; from a case study, let the hash change take us home. */
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    const wasOpen = open;
    setOpen(false);
    if (route.page !== "home" || !document.getElementById(id)) return;
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    // when the mobile menu was open, wait until the scroll lock is released
    if (wasOpen) requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
    else scrollToSection(id);
  };

  const goTop = (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (route.page !== "home") return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <header className={`header${scrolled || route.page === "case" ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <div className="container header__bar">
        <a className="header__logo" href="#" onClick={goTop}>
          <Logo />
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={go(n.id)}
              className={`nav__link${active === n.id ? " is-active" : ""}`}
              aria-current={active === n.id ? "location" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a className="btn btn--outline header__cta" href="#contact" onClick={go("contact")}>
          Start a project <ArrowUpRight aria-hidden size={16} strokeWidth={1.6} />
        </a>

        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden size={22} strokeWidth={1.6} /> : <Menu aria-hidden size={22} strokeWidth={1.6} />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open}>
        <nav className="container" aria-label="Mobile">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--solid mobile-menu__cta" href="#contact" onClick={go("contact")}>
            Start a project <ArrowUpRight aria-hidden size={18} strokeWidth={1.6} />
          </a>
        </nav>
      </div>
    </header>
  );
}
