import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "../lib/sceneState";

const TWO_PI = Math.PI * 2;
const R = 2.25;

/** Procedural "brushed concrete" texture used for bump + roughness. */
function makeBumpTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 9000; i++) {
    const v = Math.floor(90 + Math.random() * 90);
    ctx.fillStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.4})`;
    ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 3, 1 + Math.random() * 2);
  }
  for (let j = 0; j < 140; j++) {
    const g = Math.floor(60 + Math.random() * 140);
    ctx.strokeStyle = `rgba(${g},${g},${g},0.25)`;
    ctx.lineWidth = Math.random() * 1.4;
    const y = Math.random() * c.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(c.width, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 1);
  return t;
}

/**
 * A chrome band that loops around with a half twist (Möbius-like).
 * It is wide on one side and razor-thin on the other, and every vertex is
 * recomputed each frame so the shape keeps flowing and ripples with scroll speed.
 */
export function Ribbon({ small }: { small: boolean }) {
  const SEG = small ? 360 : 640;
  const ACROSS = small ? 12 : 20;

  const geometry = useMemo(() => {
    const count = (SEG + 1) * (ACROSS + 1);
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const indices: number[] = [];
    for (let i = 0; i <= SEG; i++) {
      for (let j = 0; j <= ACROSS; j++) {
        const k = i * (ACROSS + 1) + j;
        uvs[k * 2] = i / SEG;
        uvs[k * 2 + 1] = j / ACROSS;
        if (i < SEG && j < ACROSS) {
          const a = k, b = k + ACROSS + 1, c = b + 1, d = a + 1;
          indices.push(a, b, d, b, c, d);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(indices);
    return g;
  }, [SEG, ACROSS]);

  const bump = useMemo(makeBumpTexture, []);
  const spinner = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const vel = THREE.MathUtils.clamp(sceneState.velocity || 0, -60, 60);
    const wave = Math.min(0.5, Math.abs(vel) * 0.012);
    const p = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i <= SEG; i++) {
      const u = (i / SEG) * TWO_PI;
      const cu = Math.cos(u), su = Math.sin(u);
      const cx = R * cu;
      const cy = R * 0.9 * su;
      const cz = (0.22 + wave) * Math.sin(2 * u + t * 0.45) + 0.12 * Math.sin(3 * u - t * 0.3);
      const tw = u * 0.5 + t * 0.12; // half twist that slowly flows
      const ct = Math.cos(tw), st = Math.sin(tw);
      const wv = 0.5 + 0.5 * Math.sin(u + 0.9 + t * 0.18);
      const width = 0.05 + 0.62 * wv * wv;
      const dx = cu * ct, dy = su * ct, dz = st;
      for (let j = 0; j <= ACROSS; j++) {
        const v = (j / ACROSS - 0.5) * width;
        const k = (i * (ACROSS + 1) + j) * 3;
        p[k] = cx + dx * v;
        p[k + 1] = cy + dy * v;
        p[k + 2] = cz + dz * v;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    spin.current += Math.min(delta, 0.05) * 0.12 + vel * 0.0009;
    if (spinner.current) spinner.current.rotation.z = spin.current;
  });

  return (
    <group ref={spinner}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={1}
          roughness={0.32}
          envMapIntensity={1.25}
          bumpMap={bump}
          bumpScale={0.012}
          roughnessMap={bump}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
