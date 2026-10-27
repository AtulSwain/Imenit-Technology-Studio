import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { glowTexture } from "./textures";

type OrbitDef = { rx: number; ry: number; opacity: number; dashed: boolean; rot: [number, number, number]; sat?: { size: number; speed: number; offset: number } };

const ORBITS: OrbitDef[] = [
  { rx: 3.4, ry: 3.0, opacity: 0.16, dashed: false, rot: [0.35, 0.2, 0], sat: { size: 0.16, speed: 0.035, offset: 0 } },
  { rx: 4.3, ry: 3.6, opacity: 0.1, dashed: true, rot: [-0.5, 0.4, 0.6], sat: { size: 0.11, speed: -0.022, offset: 0.4 } },
  { rx: 5.6, ry: 4.6, opacity: 0.06, dashed: false, rot: [0.9, -0.3, 0.2] },
];

/** Thin orbit lines around the ribbon, two of them carrying glowing satellites. */
export function Orbits() {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(glowTexture, []);

  const items = useMemo(
    () =>
      ORBITS.map((o) => {
        const curve = new THREE.EllipseCurve(0, 0, o.rx, o.ry, 0, Math.PI * 2, false, 0);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(256));
        const mat = o.dashed
          ? new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: o.opacity, dashSize: 0.08, gapSize: 0.12, depthWrite: false })
          : new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: o.opacity, depthWrite: false });
        const line = new THREE.LineLoop(geo, mat);
        if (o.dashed) line.computeLineDistances();
        line.rotation.set(...o.rot);
        let sprite: THREE.Sprite | null = null;
        if (o.sat) {
          sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
          sprite.scale.setScalar(o.sat.size);
          line.add(sprite);
        }
        return { line, curve, sprite, sat: o.sat };
      }),
    [tex],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) group.current.rotation.z = -t * 0.04;
    for (const it of items) {
      if (!it.sprite || !it.sat) continue;
      const p = it.curve.getPoint((((t * it.sat.speed + it.sat.offset) % 1) + 1) % 1);
      it.sprite.position.set(p.x, p.y, 0);
    }
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <primitive key={i} object={it.line} />
      ))}
    </group>
  );
}
