import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles/main.css";
import App from "./App";
import { parseHash } from "./lib/router";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The home page is pre-rendered at build time. Hydrate it when that's what we're showing;
// for a case-study link (#/work/…) render fresh instead.
if (root.firstElementChild && parseHash(window.location.hash).page === "home") {
  hydrateRoot(root, app);
} else {
  root.textContent = "";
  createRoot(root).render(app);
}
