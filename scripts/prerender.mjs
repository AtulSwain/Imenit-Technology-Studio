// Pre-renders the home page into index.html after the client build, so the first paint
// (and search engines / link previews) get real content without waiting for JavaScript.
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const ssrOut = path.join(root, ".ssr");

await build({
  configFile: path.join(root, "vite.config.ts"),
  logLevel: "warn",
  build: { ssr: "entry-server.tsx", outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
});

const { render } = await import(pathToFileURL(path.join(ssrOut, "entry-server.js")).href);
const indexPath = path.join(root, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
if (!html.includes("<!--app-->")) throw new Error("index.html is missing the <!--app--> placeholder");
// The SSR build emits root-absolute asset URLs ("/assets/…"); the site is served from a
// sub-folder on GitHub Pages, so make them relative like the client build.
const appHtml = render().replace(/(^|[\s"'(,])\/assets\//g, "$1./assets/");
// Inline the (small) stylesheet so it doesn't block the first paint with an extra request.
// Font URLs inside it are relative to assets/, so re-point them from the page root.
let page = html.replace("<!--app-->", appHtml);
page = page.replace(/<link rel="stylesheet"[^>]*href="\.\/assets\/([^"]+\.css)"[^>]*>/, (tag, file) => {
  const css = fs.readFileSync(path.join(root, "assets", file), "utf8").replace(/url\(\.\//g, "url(./assets/");
  return `<style>${css}</style>`;
});
fs.writeFileSync(indexPath, page);
fs.rmSync(ssrOut, { recursive: true, force: true });
console.log("✓ pre-rendered home page into index.html");
