import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./App";
import { Protecao } from "./Protecao";
import { instalarCapturaDeErros } from "./lib/erros";
import "./styles.css";

registerSW({ immediate: true });
instalarCapturaDeErros();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Protecao>
      <App />
    </Protecao>
  </StrictMode>,
);
