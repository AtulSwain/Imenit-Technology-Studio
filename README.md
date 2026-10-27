# Imenit-Technology-Studio
IMENIT Technologies represents innovation, precision, and digital excellence. Its bold typography, metallic silver finish, and minimalist design reflect sophistication, reliability, and forward-thinking technology. A premium identity built on simplicity, professionalism, and a vision for the future.

## Website

A static, black-and-white studio website with a live 3D background.

```
index.html      page markup (all sections)
css/style.css   design tokens, layout, hover/transition effects
js/scene.js     WebGL space: chrome Möbius ribbon, orbits, star field
js/main.js      smooth scroll, preloader, text effects, scroll choreography
```

### Run locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Deploy by uploading the folder to any static host (GitHub Pages, Vercel, Netlify).
Libraries (GSAP + ScrollTrigger, Lenis, Three.js) load from public CDNs.

### Highlights

- **Moving 3D background**: a twisted chrome ribbon that flows continuously, follows the mouse,
  can be **dragged and spun** in the hero, speeds up and ripples with scroll speed, and glides to a new
  position for every section. Stars warp forward when you scroll fast.
- Preloader with counter, character-by-character headline reveal, rotating word, scrambling text on hover.
- Custom cursor with labels, magnetic buttons, spotlight + 3D tilt cards, draggable services slider.
- Scroll-filled statement text, counting stats, pinned horizontal "Work" gallery, cursor-following blog previews.
- Respects `prefers-reduced-motion`; falls back to a static page if scripts can't load.

### Placeholder content to replace

Stats (50+, 98%, 12+), project names, blog posts, social links and `hello@imenit.com`
are placeholders — update them in `index.html`.
