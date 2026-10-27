# IMENIT Technologies — website audit & redesign notes

## 1. What was there before (v2)

| Area | Finding |
| --- | --- |
| Stack | React 19, TypeScript, Vite 8, GSAP + ScrollTrigger, Lenis smooth scroll, three.js / React Three Fiber / drei |
| Deployment | GitHub Pages, "Deploy from a branch → `main` / root". `npm run build` writes the built site to the repo root; a workflow rebuilds on source changes |
| Structure | ~20 components, 3 stacked stylesheets (`global.css`, `premium.css`, `human.css`, ~1,100 lines) overriding each other |
| JavaScript | ~1.4 MB (976 KB three.js scene chunk + 413 KB main) |
| Loading | 3–5 s decorative preloader before any content; continuous WebGL render loop (CPU/battery) |
| Scrolling | Lenis smooth-scroll (scroll hijacking), custom cursor removed earlier |
| Content integrity | Invented statistics (50+ projects, 98 % satisfaction), fictional case studies (Nova Ledger, Pulse Care…), fictional blog posts, placeholder email `hello@imenit.com` and phone, social links pointing at platform home pages, a founder quote with a placeholder name |
| Forms | Newsletter form showed "Thanks — you're on the list" and discarded the address; contact form claimed success after opening a mail link |
| SEO | No canonical URL, no share image, no robots.txt or sitemap, no structured data; content only rendered by JavaScript |
| Accessibility | Reasonable focus styles; content hidden until JS animations ran |

## 2. Kept

- React + TypeScript + Vite (well suited; no reason to migrate).
- GitHub Pages branch deployment and the rebuild workflow (proven to work).
- The IMENIT logo and its three-bar E — rebuilt as the same HTML/CSS mark.
- Link handling that never navigates away from the page unexpectedly.
- Error boundary, reduced-motion support, project-image pipeline, the light "Process" section idea.
- The chrome ribbon visual — but as a single 11 KB pre-rendered image instead of a live 1 MB WebGL scene.

## 3. Replaced or removed

- GSAP, Lenis, three.js, R3F, drei → removed. Motion is CSS + one IntersectionObserver.
- Preloader → removed. The home page is **pre-rendered to static HTML at build time** and hydrated.
- All invented content → replaced with real projects and facts from the project repositories
  (OTAKUVA, InvestIQ, LangGraph Universe, Green, plus four smaller projects) and Atul Swain's portfolio.
- Fake forms → one honest enquiry form: validates, has a honeypot, and either posts to a configured
  form service (shows success only after a 2xx response) or hands off to the visitor's email app without claiming anything was sent.
- Three stylesheets → one tokenised design system (`src/styles/main.css`).
- Project "panels" → dedicated, refresh-safe case-study pages at `#/work/<slug>`.

## 4. Results (lab measurements, production build)

| | Before (approx.) | After |
| --- | --- | --- |
| JavaScript | ~1.4 MB | 269 KB (84 KB gzip) |
| CSS | 60 KB | 25 KB, inlined (6 KB gzip) |
| Hero visual | live WebGL | 11 KB WebP (5 KB on mobile) |
| Lighthouse mobile (gzip, as on Pages) | — | Performance 98–99 · Accessibility 100 · Best practices 100 · SEO 100 |
| LCP / CLS / TBT (mobile lab) | — | 1.9–2.3 s / 0 / 10–20 ms |
| Lighthouse desktop | — | 99 · 100 · 100 · 100 |

Lab scores are diagnostics; real-user Core Web Vitals should be confirmed after launch (e.g. in Search Console).

## 5. Verified

- Production build served from a `/Imenit-Technology-Studio/` sub-folder (as on GitHub Pages): no console errors, no failed requests, no hydration warnings.
- Deep links and refresh: `#/work/investiq`, `#services` etc.
- No horizontal overflow at 320, 375, 414, 768, 1024 and 1280 px.
- Mobile menu: keyboard open, focus moves in, Esc closes and returns focus, links close the menu and scroll to the section.
- Form: required-field validation with messages, focus to first error, no false success state.
- JavaScript disabled: all content visible. Reduced motion: nothing hidden or animated.

## 6. Open items for the owner

- **Screenshots** for OTAKUVA (private) and Green (desktop app) — add to `src/projects/` when available.
- **Form service**: set `FORM_ENDPOINT` in `src/lib/content.ts` (e.g. a free Formspree form) to receive enquiries directly.
- **Social profiles**: only GitHub is listed because it is the only verified one. Add LinkedIn etc. in `SOCIAL`.
- **Budget ranges** in the form are a suggestion — adjust to how you price work.
