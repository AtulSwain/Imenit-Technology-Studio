import { SCENE_POSES, type ScenePose } from "./content";

// Mutable state shared between the DOM (scroll, pointer) and the WebGL loop.
// Kept outside React on purpose: it changes every frame and must not trigger renders.
export const sceneState = {
  target: { ...SCENE_POSES.top } as ScenePose,
  pointer: { x: 0, y: 0 },
  velocity: 0,
  ready: false,
};
