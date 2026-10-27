import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "lenis/dist/lenis.css";
import "./styles/global.css";
import "./styles/premium.css";
import "./styles/human.css";
import App from "./App";

// enables the JS-gated "hidden until revealed" styles
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
