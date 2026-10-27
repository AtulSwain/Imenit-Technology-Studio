# IMENIT Technologies

The website of **IMENIT Technologies** — an independent technology studio building digital products,
intelligent software and the technology behind them.

**Live:** https://atulswain.github.io/Imenit-Technology-Studio/

## Stack

- **React 19 + TypeScript**, built with **Vite 8**
- Plain, tokenised CSS (`src/styles/main.css`) — no UI or animation libraries
- **lucide-react** icons, self-hosted **Inter** variable font
- Home page **pre-rendered to static HTML** at build time, then hydrated
- Hash routing (`#/work/<slug>`) so case studies work on GitHub Pages with refreshes and direct links

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check, build, pre-render → writes the site to the repo root
npm run preview   # serve the production build
```

## Deploy

GitHub Pages is set to **Deploy from a branch → `main` / (root)**. The built site lives in the repository
root (`index.html`, `assets/`, favicon, `og-image.png`, `robots.txt`, `sitemap.xml`).
`.github/workflows/deploy.yml` rebuilds it automatically whenever source changes on `main`.
Never edit the root `index.html` or `assets/` by hand — edit `src/` and build.

## Editing content

Everything — projects, services, about text, process, contact details — is in **`src/lib/content.ts`**.

- **Add a project:** copy a block in `PROJECTS`, edit it, and put images in `src/projects/`
  (import them at the top of `content.ts`). Case-study sections appear only when filled in.
- **Contact form:** set `FORM_ENDPOINT` to a form service URL (e.g. Formspree) to receive enquiries
  directly. Without it, the form opens the visitor's email app with their message filled in.
- Only publish facts you can stand behind — no invented clients, numbers or testimonials.

## Structure

```
src/
  index.html            page shell, SEO + social metadata
  main.tsx              hydrate / render
  App.tsx               layout, routing, active-section tracking
  entry-server.tsx      build-time pre-render entry
  components/           Header, Hero, Work, Services, About, Process, Contact, Footer, CaseStudy…
  lib/content.ts        all site content
  lib/router.ts         hash router + section scrolling
  lib/reveal.ts         scroll-reveal (IntersectionObserver)
  styles/main.css       design system
  assets/               hero render
  projects/             project screenshots
  public/               favicon, og-image, robots.txt, sitemap.xml
scripts/prerender.mjs   pre-renders the home page and inlines CSS
docs/AUDIT.md           audit of the previous site and redesign notes
```
