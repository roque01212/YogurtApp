import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { YogurApp } from "./YogurApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <YogurApp />
  </StrictMode>,
);
