import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Source lives in src/ (entry: src/index.html, static files: src/public/).
// The production build is written to the repository ROOT (index.html + assets/ + public files),
// because GitHub Pages is set to "Deploy from a branch → main / (root)".
export default defineConfig({
  root: "src",
  publicDir: "public",
  plugins: [react()],
  // relative paths: works at https://atulswain.github.io/Imenit-Technology-Studio/ and in any sub-folder
  base: "./",
  build: {
    outDir: "..",
    emptyOutDir: false, // never wipe the repository; package.json cleans assets/ before each build
    assetsDir: "assets",
    assetsInlineLimit: 0, // keep images as cacheable files
  },
});
