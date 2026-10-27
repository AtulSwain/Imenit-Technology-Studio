import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; r: number; a: number; tw: number; ph: number };
type Streak = { x: number; y: number; vx: number; vy: number; life: number; max: number };

/**
 * The animated "space" background: a lightweight 2D-canvas star field in three depth
 * layers that drifts, twinkles, parallaxes with the pointer and scroll, and occasionally
 * shows a shooting star. ~2 KB of code instead of a 3D engine.
 * Pauses when the tab is hidden; draws a single still frame for reduced-motion users.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, stars: Star[] = [];
    const streaks: Streak[] = [];
    let px = 0, py = 0, tpx = 0, tpy = 0, raf = 0, last = 0, nextStreak = 4000;

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (w * h) / 6500));
      stars = Array.from({ length: count }, () => {
        const z = Math.random() < 0.6 ? 0.25 : Math.random() < 0.75 ? 0.55 : 1; // far, mid, near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (0.35 + Math.random() * 0.75) * (0.6 + z * 0.8),
          a: 0.25 + Math.random() * 0.55 * z + 0.15,
          tw: 0.4 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (t: number) => {
      const dt = Math.min(64, t - (last || t));
      last = t;
      px += (tpx - px) * 0.05;
      py += (tpy - py) * 0.05;
      const sy = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        if (!reduce) {
          s.x -= 0.006 * s.z * dt;           // slow drift to the left
          s.y -= 0.002 * s.z * dt;
          if (s.x < -4) s.x += w + 8;
          if (s.y < -4) s.y += h + 8;
        }
        // parallax: nearer stars move more with pointer and scroll
        let x = s.x - px * 24 * s.z;
        let y = s.y - py * 18 * s.z - ((sy * 0.12 * s.z) % (h + 8));
        if (y < -4) y += h + 8;
        if (x < -4) x += w + 8;
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * s.tw + s.ph);
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        nextStreak -= dt;
        if (nextStreak <= 0) {
          nextStreak = 6000 + Math.random() * 9000;
          const angle = Math.PI * (0.78 + Math.random() * 0.12);
          const speed = 0.9 + Math.random() * 0.6;
          streaks.push({ x: w * (0.4 + Math.random() * 0.6), y: h * Math.random() * 0.45, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * -1 * -1, life: 0, max: 900 });
        }
        for (let i = streaks.length - 1; i >= 0; i--) {
          const k = streaks[i];
          k.life += dt;
          k.x += k.vx * dt;
          k.y += Math.abs(k.vy) * dt * 0.45;
          const p = k.life / k.max;
          if (p >= 1) { streaks.splice(i, 1); continue; }
          const len = 90;
          const grad = ctx.createLinearGradient(k.x, k.y, k.x - k.vx * len, k.y - Math.abs(k.vy) * len * 0.45);
          grad.addColorStop(0, `rgba(255,255,255,${0.7 * Math.sin(Math.PI * p)})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(k.x, k.y);
          ctx.lineTo(k.x - k.vx * len, k.y - Math.abs(k.vy) * len * 0.45);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduce) { last = 0; raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const onResize = () => { build(); if (reduce) draw(0); };
    const onMove = (e: PointerEvent) => {
      tpx = e.clientX / w - 0.5;
      tpy = e.clientY / h - 0.5;
    };
    const onScrollStill = () => draw(performance.now());
    const onVisibility = () => (document.hidden ? stop() : start());

    build();
    canvas.classList.add("is-ready");
    if (reduce) {
      draw(0);
      window.addEventListener("scroll", onScrollStill, { passive: true });
    } else {
      start();
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScrollStill);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="starfield" aria-hidden />;
}
