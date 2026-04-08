import "./index.css";
import "./i18n/config";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Home />
    </StrictMode>,
  );
}
