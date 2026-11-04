import "./global.css";
import "./lib/gsap";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ScrollTrigger } from "./lib/gsap";
import { preloadCaseStudy } from "./routes";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

// Scroll is restored by usePageEnter (after pinned sections are measured), not by the browser.
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

// Direct visit to a case study: fetch its chunk in parallel with the first render.
if (window.location.pathname.startsWith("/projects/")) preloadCaseStudy();

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Web fonts change text metrics; recompute scroll positions once they are ready.
document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
