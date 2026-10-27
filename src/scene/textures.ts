import * as THREE from "three";

let cached: THREE.CanvasTexture | null = null;

/** Soft round glow used for stars and satellites. */
export function glowTexture() {
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  cached = new THREE.CanvasTexture(c);
  return cached;
}
