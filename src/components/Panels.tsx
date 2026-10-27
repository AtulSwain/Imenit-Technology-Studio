import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { useUI } from "../lib/ui";
import { PROJECTS, POSTS } from "../lib/content";
import { scrollToTarget, startScroll, stopScroll } from "../lib/smoothScroll";
import { Arrow, Art } from "./ui";

/**
 * Full-screen detail panels. Projects open as a case-study sheet that slides up,
 * articles open as a reading drawer from the right. Nothing navigates away from the page.
 */
export function Panels() {
  const { panel, closePanel, openProject } = useUI();
  const [shown, setShown] = useState(panel); // keeps content rendered during the exit animation
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // enter / exit animation
  useEffect(() => {
    if (panel) {
      lastFocus.current = document.activeElement as HTMLElement;
      setShown(panel);
      stopScroll();
      return;
    }
    if (!shown || !root.current) return;
    const isPost = shown.type === "post";
    const tl = gsap.timeline({
      onComplete: () => {
        setShown(null);
        if (!document.body.classList.contains("menu-open")) startScroll();
        lastFocus.current?.focus?.();
      },
    });
    tl.to(root.current.querySelectorAll(".panel__reveal"), { opacity: 0, y: 20, duration: 0.25, stagger: 0.02 })
      .to(sheet.current, isPost ? { xPercent: 100, duration: 0.6, ease: "expo.in" } : { yPercent: 100, duration: 0.6, ease: "expo.in" }, 0.05)
      .to(root.current.querySelector(".panel__backdrop"), { opacity: 0, duration: 0.4 }, 0.3);
    return () => { tl.kill(); };
    // only react to the panel opening/closing; `shown` is read for the exit animation
  }, [panel]);

  useEffect(() => {
    if (!panel || !shown || !root.current) return;
    const isPost = shown.type === "post";
    const tl = gsap.timeline();
    tl.fromTo(root.current.querySelector(".panel__backdrop"), { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(sheet.current, isPost ? { xPercent: 100 } : { yPercent: 100 }, isPost ? { xPercent: 0, duration: 0.9, ease: "expo.out" } : { yPercent: 0, duration: 1, ease: "expo.out" }, 0)
      .fromTo(root.current.querySelectorAll(".panel__reveal"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 0.3);
    sheet.current?.scrollTo(0, 0);
    root.current.querySelector<HTMLElement>(".panel__close")?.focus({ preventScroll: true });
    return () => { tl.kill(); };
  }, [panel, shown]);

  // Esc closes
  useEffect(() => {
    if (!panel) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [panel, closePanel]);

  if (!shown) return null;

  const goContact = () => {
    closePanel();
    window.setTimeout(() => scrollToTarget("#contact"), 650);
  };

  if (shown.type === "project") {
    const p = PROJECTS[shown.index];
    const next = (shown.index + 1) % PROJECTS.length;
    return (
      <div className="panel panel--project" ref={root} role="dialog" aria-modal="true" aria-label={p.title}>
        <div className="panel__backdrop" onClick={closePanel} />
        <div className="panel__sheet" ref={sheet} data-lenis-prevent>
          <button className="panel__close" onClick={closePanel} aria-label="Close case study"><span /><span /></button>
          <div className="case">
            <header className="case__head container">
              <p className="eyebrow panel__reveal">Case study · {p.year}</p>
              <h2 className="case__title panel__reveal">{p.title}</h2>
              <p className="case__summary panel__reveal">{p.summary}</p>
              <div className="case__tags panel__reveal">{[p.category, ...p.services].map((t) => <span key={t}>{t}</span>)}</div>
            </header>
            <div className="case__media panel__reveal"><Art kind={p.art} /></div>
            <div className="container">
              <div className="case__results">
                {p.results.map((r) => (
                  <div className="case__result panel__reveal" key={r.label}><b>{r.value}</b><span>{r.label}</span></div>
                ))}
              </div>
              <div className="case__body">
                <div className="panel__reveal"><h3>The challenge</h3><p>{p.challenge}</p></div>
                <div className="panel__reveal"><h3>Our solution</h3><p>{p.solution}</p></div>
                <div className="panel__reveal"><h3>Built with</h3><ul className="case__stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul></div>
              </div>
              <div className="case__foot panel__reveal">
                <button className="btn btn--solid" onClick={goContact}><span className="btn__label">Start a similar project</span><Arrow /></button>
                <button className="case__next" onClick={() => openProject(next)}>
                  <small>Next project</small><span>{PROJECTS[next].title}</span><Arrow className="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const post = POSTS[shown.index];
  return (
    <div className="panel panel--post" ref={root} role="dialog" aria-modal="true" aria-label={post.title}>
      <div className="panel__backdrop" onClick={closePanel} />
      <div className="panel__sheet" ref={sheet} data-lenis-prevent>
        <button className="panel__close" onClick={closePanel} aria-label="Close article"><span /><span /></button>
        <article className="article">
          <div className="article__media panel__reveal"><Art kind={post.art} /></div>
          <p className="article__meta panel__reveal"><span>{post.category}</span><span>{post.date}</span><span>{post.read} read</span></p>
          <h2 className="article__title panel__reveal">{post.title}</h2>
          {post.body.map((para, i) => <p className="article__p panel__reveal" key={i}>{para}</p>)}
          <div className="article__cta panel__reveal">
            <p>Have a project in mind?</p>
            <button className="btn btn--solid" onClick={goContact}><span className="btn__label">Talk to us</span><Arrow /></button>
          </div>
        </article>
      </div>
    </div>
  );

}
