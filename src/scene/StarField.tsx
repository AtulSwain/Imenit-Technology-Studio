import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { glowTexture } from "./textures";
import { sceneState } from "../lib/sceneState";

type Props = { count: number; rMin: number; rMax: number; size: number; opacity: number; drift: number; parallax: number; warp?: boolean };

/** Points scattered in a spherical shell; drift slowly, follow the pointer and warp forward on fast scroll. */
export function StarField({ count, rMin, rMax, size, opacity, drift, parallax, warp }: Props) {
  const ref = useRef<THREE.Points>(null);
  const tex = useMemo(glowTexture, []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = rMin + Math.pow(Math.random(), 0.7) * (rMax - rMin);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph) - 4;
    }
    return pos;
  }, [count, rMin, rMax]);

  const pm = useRef({ x: 0, y: 0 });
  useFrame(({ clock }, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const k = 1 - Math.pow(0.001, Math.min(delta, 0.05));
    pm.current.x += (sceneState.pointer.x - pm.current.x) * k * 0.35;
    pm.current.y += (sceneState.pointer.y - pm.current.y) * k * 0.35;
    const t = clock.elapsedTime;
    pts.rotation.y = t * drift + pm.current.x * parallax;
    pts.rotation.x = pm.current.y * parallax * 0.6;
    if (warp) pts.position.z = Math.min(3, Math.abs(sceneState.velocity || 0) * 0.03);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        fog={false}
      />
    </points>
  );
}
