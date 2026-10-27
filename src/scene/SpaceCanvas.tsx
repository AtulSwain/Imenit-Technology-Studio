import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { sceneState } from "../lib/sceneState";
import { Ribbon } from "./Ribbon";
import { Orbits } from "./Orbits";
import { StarField } from "./StarField";

// resting pose: the loop is seen at an angle, like the brand hero image
const BASE = { x: -0.95, y: 0.55, z: 0.55 };

type Drag = { active: boolean; lastX: number; lastY: number; vx: number; vy: number; rotX: number; rotY: number };

/** Pointer parallax + "grab and spin" on any element marked [data-drag]. */
function useSceneInput(drag: React.RefObject<Drag>) {
  useEffect(() => {
    const d = drag.current;
    const move = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!d.active) return;
      d.vx = (e.clientX - d.lastX) * 0.006;
      d.vy = (e.clientY - d.lastY) * 0.006;
      d.rotY += d.vx;
      d.rotX += d.vy;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    };
    const down = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const zone = target.closest?.("[data-drag]");
      if (!zone || target.closest("a, button, input, textarea, select, label") || e.pointerType === "touch") return;
      d.active = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      zone.classList.add("is-dragging");
    };
    const up = () => {
      if (!d.active) return;
      d.active = false;
      document.querySelector("[data-drag].is-dragging")?.classList.remove("is-dragging");
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      sceneState.pointer.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      sceneState.pointer.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("deviceorientation", tilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, [drag]);
}

/** Moves the whole object toward the scroll-driven pose, plus pointer parallax, drag spin and an intro zoom. */
function Rig({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const key = useRef<THREE.PointLight>(null);
  const drag = useRef<Drag>({ active: false, lastX: 0, lastY: 0, vx: 0, vy: 0, rotX: 0, rotY: 0 });
  const cur = useRef({ ...sceneState.target, s: 0.001 });
  const pm = useRef({ x: 0, y: 0 });
  const intro = useRef(0);
  const lastDim = useRef(-1);
  const { size, gl } = useThree();
  useSceneInput(drag);

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = clock.elapsedTime;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
    const c = cur.current, st = sceneState.target, d = drag.current;

    c.x += (st.x - c.x) * k * 0.9;
    c.y += (st.y - c.y) * k * 0.9;
    c.s += (st.s - c.s) * k * 0.9;
    c.rx += (st.rx - c.rx) * k * 0.9;
    c.dim += (st.dim - c.dim) * k;
    pm.current.x += (sceneState.pointer.x - pm.current.x) * k * 0.35;
    pm.current.y += (sceneState.pointer.y - pm.current.y) * k * 0.35;
    if (sceneState.ready) intro.current += (1 - intro.current) * k * 0.5;

    if (!d.active) {
      d.vx *= 0.94; d.vy *= 0.94;
      d.rotY += d.vx; d.rotX += d.vy;
      d.rotY *= 0.992; d.rotX *= 0.992; // slowly spring back to the resting pose
    }

    const aspect = size.width / size.height;
    const xf = Math.min(1, aspect / 1.55); // keep offsets on-screen on narrow screens
    const sf = aspect < 1 ? 0.62 : aspect < 1.3 ? 0.82 : 1;

    root.current?.position.set(c.x * xf + pm.current.x * 0.22, c.y - pm.current.y * 0.14, 0);
    root.current?.scale.setScalar(Math.max(0.001, c.s * sf * (0.6 + 0.4 * intro.current)));
    tilt.current?.rotation.set(
      BASE.x + c.rx + pm.current.y * 0.22 + d.rotX,
      BASE.y + pm.current.x * 0.32 + d.rotY + (1 - intro.current) * 1.2,
      BASE.z + Math.sin(t * 0.15) * 0.06,
    );
    key.current?.position.set(4 * Math.cos(t * 0.3) + pm.current.x * 5, 3 * Math.sin(t * 0.22) - pm.current.y * 4, 6);

    const dim = Math.round(c.dim * 100) / 100;
    if (dim !== lastDim.current) {
      gl.domElement.style.opacity = String(dim);
      lastDim.current = dim;
    }
  });

  return (
    <>
      <pointLight ref={key} intensity={40} distance={30} decay={2} />
      <group ref={root}>
        <group ref={tilt}>{children}</group>
      </group>
    </>
  );
}

export default function SpaceCanvas() {
  const small = typeof window !== "undefined" && window.innerWidth < 800;
  return (
    <Canvas
      className="space"
      dpr={[1, small ? 1.5 : 2]}
      camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMappingExposure = 1.15; }}
      eventSource={undefined}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <fogExp2 attach="fog" args={["#050505", 0.035]} />
      <ambientLight intensity={0.08} />

      {/* Studio lighting baked into an environment map: a black room with softboxes, for chrome reflections */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#020202"]} />
        <Lightformer form="rect" intensity={6} scale={[18, 4, 1]} position={[0, 11, 3]} />
        <Lightformer form="rect" intensity={4.5} scale={[3, 20, 1]} position={[-12, 0, 4]} />
        <Lightformer form="rect" intensity={3.2} scale={[2, 18, 1]} position={[12, 3, -5]} />
        <Lightformer form="rect" intensity={2.2} scale={[12, 1.6, 1]} position={[3, -11, 7]} />
        <Lightformer form="rect" intensity={1.4} scale={[8, 8, 1]} position={[0, 0, 14]} />
        <Lightformer form="rect" intensity={0.6} scale={[9, 9, 1]} position={[0, -2, -16]} />
      </Environment>

      <Rig>
        <Ribbon small={small} />
        <Orbits />
      </Rig>

      <StarField count={small ? 1400 : 3200} rMin={3} rMax={26} size={0.05} opacity={0.55} drift={0.008} parallax={0.06} warp />
      <StarField count={small ? 120 : 260} rMin={6} rMax={30} size={0.16} opacity={0.9} drift={0.004} parallax={0.1} />
    </Canvas>
  );
}
