import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./App";
import { Protecao } from "./Protecao";
import { instalarCapturaDeErros } from "./lib/erros";
// Fontes servidas pelo próprio app: funcionam sem internet e não passam o endereço de quem abre ao Google.
import "@fontsource/fredoka/latin-500.css";
import "@fontsource/fredoka/latin-600.css";
import "@fontsource/figtree/latin-400.css";
import "@fontsource/figtree/latin-500.css";
import "@fontsource/figtree/latin-600.css";
import "@fontsource/figtree/latin-700.css";
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
