import type { Project } from "../lib/content";

/**
 * A project's visual. Real screenshots sit in a quiet browser frame; products without
 * public screenshots get their own brand mark or a typographic cover — never decoration.
 */
export function ProjectCover({ project, eager = false }: { project: Project; eager?: boolean }) {
  const { coverStyle, cover, name, category } = project;

  if (coverStyle === "screenshot" && cover) {
    return (
      <span className="cover cover--shot">
        <span className="cover__chrome" aria-hidden><i /><i /><i /></span>
        <img src={cover.src} alt={cover.alt} width={1440} height={900} loading={eager ? "eager" : "lazy"} decoding="async" />
      </span>
    );
  }

  if (coverStyle === "mark" && cover) {
    return (
      <span className="cover cover--mark">
        <img src={cover.src} alt={cover.alt} width={480} height={376} loading={eager ? "eager" : "lazy"} decoding="async" />
        <span className="cover__name" aria-hidden>{name}</span>
      </span>
    );
  }

  return (
    <span className="cover cover--type" aria-hidden>
      <span className="cover__mono mono">{category}</span>
      <span className="cover__big">{name}</span>
      <span className="cover__lines"><i /><i /><i /></span>
    </span>
  );
}
