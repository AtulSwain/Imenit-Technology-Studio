const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";
const running = new WeakMap<HTMLElement, number>();

/** Decode effect: random glyphs resolve left-to-right into the element's text. */
export function scramble(el: HTMLElement, duration = 600) {
  const final = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = final;
  const prev = running.get(el);
  if (prev) cancelAnimationFrame(prev);
  const lower = final === final.toLowerCase();
  const start = performance.now();

  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const revealed = Math.floor(p * final.length);
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      if (i < revealed || ch === " " || ch === "@" || ch === ".") out += ch;
      else {
        const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        out += lower ? g.toLowerCase() : g;
      }
    }
    el.textContent = out;
    if (p < 1) running.set(el, requestAnimationFrame(tick));
    else { el.textContent = final; running.delete(el); }
  };
  running.set(el, requestAnimationFrame(tick));
  // guarantee the final text even if animation frames are throttled (background tab, slow device)
  setTimeout(() => {
    if (performance.now() - start >= duration && running.has(el)) {
      cancelAnimationFrame(running.get(el)!);
      running.delete(el);
      el.textContent = final;
    }
  }, duration + 80);
}
