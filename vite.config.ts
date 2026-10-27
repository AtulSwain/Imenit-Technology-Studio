import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Source lives in src/ (src/index.html is the entry).
// The production build is written to the repository ROOT (index.html + assets/),
// so GitHub Pages "Deploy from a branch → main / (root)" serves the finished site directly.
export default defineConfig({
  root: "src",
  publicDir: false,
  plugins: [react()],
  // relative paths so the site works at https://<user>.github.io/<repo>/ or any sub-folder
  base: "./",
  build: {
    outDir: "..",
    emptyOutDir: false, // never wipe the repository; package.json cleans assets/ before each build
    assetsDir: "assets",
    // the 3D scene chunk (three.js) is lazy-loaded behind the preloader, so a larger chunk is expected
    chunkSizeWarningLimit: 1100,
  },
});
