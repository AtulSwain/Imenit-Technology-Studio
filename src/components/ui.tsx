import type { ArtKind, ServiceIcon } from "../lib/content";
import { projectImage } from "../lib/projectImages";

/** Renders text as .word > .char spans so each character can be animated. */
export function SplitChars({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden>
          <span className="word">
            {Array.from(w).map((ch, ci) => (
              <span className="char" key={ci}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/** Renders text as masked words (.wm > .wi) for line-style reveals. */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="wm"><span className="wi">{w}</span></span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Numbered section label, e.g. "(01) — Our Services". */
export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow eyebrow--index" data-reveal>
      {index && <span className="eyebrow__i">({index})</span>}
      {index && <span className="eyebrow__line" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}

export function Arrow({ className = "btn__arrow", diagonal = false }: { className?: string; diagonal?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d={diagonal ? "M6 18 18 6M8 6h10v10" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}

export function LogoE() {
  return (
    <span className="logo__e" aria-hidden>
      <i /><i /><i />
    </span>
  );
}

const ICON_PATHS: Record<ServiceIcon, React.ReactNode> = {
  code: <path d="M17 14 7 24l10 10M31 14l10 10-10 10M27 9l-6 30" />,
  mobile: <><rect x="14" y="5" width="20" height="38" rx="4" /><path d="M21 37h6" /></>,
  ai: <path d="M24 8v32M24 8c-4-4-12-2-12 5-5 1-6 8-2 11-3 4 0 10 5 10 1 5 7 7 9 6M24 8c4-4 12-2 12 5 5 1 6 8 2 11 3 4 0 10-5 10-1 5-7 7-9 6M17 18h7M24 28h7M17 32h4" />,
  design: <><circle cx="24" cy="24" r="17" /><path d="M24 7v34M7 24h34M12 12l24 24" /></>,
};

export function ServiceIconSvg({ icon }: { icon: ServiceIcon }) {
  return <svg className="card__icon" viewBox="0 0 48 48" aria-hidden>{ICON_PATHS[icon]}</svg>;
}

/** A project's visual: its screenshot if one is set, otherwise the monochrome art. */
export function ProjectMedia({ image, art, alt = "" }: { image?: string; art: ArtKind; alt?: string }) {
  const src = projectImage(image);
  if (src) return <img className="media-img" src={src} alt={alt} loading="lazy" decoding="async" />;
  return <Art kind={art} />;
}

const ART_ITEMS: Record<ArtKind, number> = { rings: 5, grid: 1, bars: 9, orb: 2 };

/** CSS-generated monochrome visual (stand-in for project imagery). */
export function Art({ kind }: { kind: ArtKind }) {
  return (
    <div className={`art art--${kind}`}>
      {Array.from({ length: ART_ITEMS[kind] }, (_, i) => <i key={i} />)}
    </div>
  );
}
