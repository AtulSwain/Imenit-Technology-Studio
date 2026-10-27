# Imenit-Technology-Studio
IMENIT Technologies represents innovation, precision, and digital excellence. Its bold typography, metallic silver finish, and minimalist design reflect sophistication, reliability, and forward-thinking technology. A premium identity built on simplicity, professionalism, and a vision for the future.

## Website

A black-and-white studio website with a live 3D background, built with:

- **React 19** + **TypeScript**, bundled with **Vite 8**
- **React Three Fiber 9** + **drei** + **Three.js** for the WebGL scene
- **GSAP 3** (ScrollTrigger, `@gsap/react`) for animation
- **Lenis** for smooth scrolling

### Run

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

`dist/` is a static site: deploy it to Vercel, Netlify, GitHub Pages or any static host.

> **Seeing a white page?** This is a React app — opening `index.html` directly (double-click, or from
> GitHub's file view) shows a blank page because the code must be built and served. Use `npm run dev`
> locally, or a deployed link.

**GitHub Pages (automatic):** `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: repository **Settings → Pages → Source: GitHub Actions**.

**Vercel / Netlify:** import the repo — build command `npm run build`, output folder `dist`.

### Contact form

The form works without a server: it opens the visitor's email app with the message pre-filled.
To receive messages directly instead, create a free form endpoint (e.g. Formspree) and set
`CONTACT_FORM_ENDPOINT` in `src/lib/content.ts`.

### Structure

```
src/
  App.tsx                 page shell, preloader, menu, smooth anchor links
  components/             one file per section (Hero, Services, Work, ...)
    ScrollDirector.tsx    page-wide scroll motion + 3D choreography
  scene/                  React Three Fiber scene (lazy-loaded)
    SpaceCanvas.tsx       canvas, studio lighting, camera rig, drag-to-spin
    Ribbon.tsx            flowing chrome Möbius ribbon
    Orbits.tsx, StarField.tsx
  lib/
    content.ts            ALL site copy + 3D pose per section — edit here
    smoothScroll.ts, gsap.ts, scramble.ts, sceneState.ts
  styles/global.css       design tokens and styles
```

### Highlights

- **Moving 3D background**: a twisted chrome ribbon that keeps flowing, follows the mouse,
  can be **dragged and spun** in the hero, ripples with scroll speed and glides to a new pose for
  every section. Stars warp forward when you scroll fast. The scene is code-split and loads behind the preloader.
- Preloader counter, character-by-character headline, rotating word, scrambling text on hover.
- Custom cursor with labels, magnetic buttons, spotlight + 3D tilt cards, draggable services slider.
- Scroll-filled statement, counting stats, pinned horizontal Work gallery, cursor-following blog previews.
- Respects `prefers-reduced-motion`; falls back to a static background without WebGL.

### Links never leave the page

In-page links scroll smoothly (long jumps use a quick curtain transition) and never change the URL,
projects open a full case-study sheet, articles open a reading drawer, the email address copies
to the clipboard, and external links open in a new tab. An error boundary shows a styled
message instead of a blank page if anything fails, and the site keeps working without WebGL.

### Placeholder content to replace

Stats, case studies (names, numbers, text), blog articles, social links, phone, location and the
contact email are placeholders — update them in `src/lib/content.ts`.
