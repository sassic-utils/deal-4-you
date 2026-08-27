import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Prerendered listing pages (scripts/prerender-listings.ts) ship a static
// content block for crawlers that don't run JS; drop it once React takes over.
document.getElementById("prerendered")?.remove();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);