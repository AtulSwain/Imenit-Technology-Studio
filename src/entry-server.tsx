import { renderToString } from "react-dom/server";
import App from "./App";

/** Used at build time only: renders the home page to static HTML (see scripts/prerender.mjs). */
export function render() {
  return renderToString(<App />);
}
