import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // relative base so the build works on GitHub Pages or any sub-folder
  base: "./",
  // the 3D scene chunk (three.js) is lazy-loaded behind the preloader, so a larger chunk is expected
  build: { chunkSizeWarningLimit: 1100 },
});
