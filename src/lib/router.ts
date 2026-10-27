import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

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
  const current = useRef(route);
  current.current = route;

  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash);
      const prev = current.current;
      const pageChanged = prev.page !== next.page || (prev.page === "case" && next.page === "case" && prev.slug !== next.slug);

      // Swap the page and set its scroll position in one step, so a transition captures the final state.
      const apply = () => {
        flushSync(() => setRoute(next));
        if (next.page === "case") window.scrollTo(0, 0);
        else if (next.section) scrollToSection(next.section, true);
        else if (pageChanged) window.scrollTo(0, 0);
      };

      // Smooth page transition (View Transitions API) where supported; instant otherwise.
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      if (pageChanged && doc.startViewTransition && !reduceMotion()) doc.startViewTransition(apply);
      else apply();
    };
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
