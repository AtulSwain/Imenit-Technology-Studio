import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, hasFinePointer } from "../lib/gsap";
import { POSTS, type ArtKind } from "../lib/content";
import { Arrow, Art, SplitWords } from "./ui";

/** Floating preview that follows the cursor while hovering a post. */
function usePreview(preview: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = preview.current;
    if (!el || !hasFinePointer()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [preview]);
}

export function Blog() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [art, setArt] = useState<ArtKind>("rings");
  usePreview(preview);

  const show = (kind: ArtKind) => {
    setArt(kind);
    gsap.to(preview.current, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
  };
  const hide = () => gsap.to(preview.current, { opacity: 0, scale: 0.6, duration: 0.5, ease: "expo.out" });

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".post").forEach((p, i) => {
      gsap.from(p, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", delay: i * 0.06, scrollTrigger: { trigger: p, start: "top 92%", once: true } });
    });
  }, { scope: root });

  return (
    <section className="blog section" id="blog" ref={root}>
      <div className="container">
        <div className="blog__head">
          <div>
            <p className="eyebrow" data-reveal>Insights</p>
            <h2 className="h2" data-words><SplitWords text="Latest from the Blog" /></h2>
          </div>
          <a href="#blog" className="link-arrow" data-reveal data-magnetic>
            <span data-scramble>All articles</span><Arrow className="" />
          </a>
        </div>

        <ul className="posts">
          {POSTS.map((p) => (
            <li key={p.title}>
              <a className="post" href="#blog" data-cursor="Read" onPointerEnter={() => show(p.art)} onPointerLeave={hide}>
                <span className="post__date">{p.date}</span>
                <span className="post__title">{p.title}</span>
                <span className="post__cat">{p.category}</span>
                <Arrow className="post__arrow" diagonal />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="preview" ref={preview} aria-hidden>
        <div className="preview__inner"><Art kind={art} /></div>
      </div>
    </section>
  );
}
