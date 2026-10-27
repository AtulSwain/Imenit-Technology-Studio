import { useEffect, useState } from "react";

/**
 * Tiny hash router — works on GitHub Pages (no server rewrites needed),
 * survives refreshes and direct links.
 *   #/work/<slug>  → case study page
 *   #<section-id>  → home page, scrolled to that section
 *   (empty)        → home page
 */
export type Route = { page: "home"; section?: string } | { page: "case"; slug: string };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, "");
  const m = h.match(/^\/work\/([\w-]+)\/?$/);
  if (m) return { page: "case", slug: m[1] };
  return { page: "home", section: h && !h.startsWith("/") ? h : undefined };
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? { page: "home" } : parseHash(window.location.hash),
  );
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export const caseHref = (slug: string) => `#/work/${slug}`;

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll to a section on the home page, accounting for the sticky header. */
export function scrollToSection(id: string, instant = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: Math.max(0, top), behavior: instant || reduceMotion() ? "auto" : "smooth" });
  return true;
}
