import { useState } from "react";
import { useDados } from "./lib/store";
import { Onboarding } from "./telas/Onboarding";
import { Inicio } from "./telas/Inicio";
import { VaiAoPS } from "./telas/VaiAoPS";
import { Trilhas } from "./telas/Trilhas";
import { Caderneta, type SecaoCaderneta } from "./telas/Caderneta";
import { Ajustes } from "./telas/Ajustes";

export type Aba = "inicio" | "ps" | "trilhas" | "caderneta" | "ajustes";

export type Navegar = (aba: Aba, opcoes?: { secao?: SecaoCaderneta }) => void;

const ABAS: { id: Aba; rotulo: string; icone: string }[] = [
  { id: "inicio", rotulo: "Início", icone: "⌂" },
  { id: "ps", rotulo: "Vai ao PS?", icone: "✚" },
  { id: "trilhas", rotulo: "Trilhas", icone: "▶" },
  { id: "caderneta", rotulo: "Caderneta", icone: "✓" },
];

export function App() {
  const [dados, atualizar] = useDados();
  const [aba, setAba] = useState<Aba>("inicio");
  const [secao, setSecao] = useState<SecaoCaderneta>("vacinas");

  const navegar: Navegar = (destino, opcoes) => {
    if (opcoes?.secao) setSecao(opcoes.secao);
    setAba(destino);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <div className="faixa">
        <span>Beta · conteúdo em revisão médica</span>
        <a href="tel:192" aria-label="Ligar para o SAMU, 192">Emergência 192</a>
      </div>
      {!dados.crianca ? (
        <main className="conteudo">
          <Onboarding onSalvar={(crianca) => atualizar((d) => ({ ...d, crianca }))} />
        </main>
      ) : (
        <>
          <main className="conteudo">
            {aba === "inicio" && <Inicio dados={dados} atualizar={atualizar} navegar={navegar} />}
            {aba === "ps" && <VaiAoPS />}
            {aba === "trilhas" && <Trilhas dados={dados} atualizar={atualizar} />}
            {aba === "caderneta" && <Caderneta dados={dados} atualizar={atualizar} secao={secao} setSecao={setSecao} />}
            {aba === "ajustes" && <Ajustes dados={dados} atualizar={atualizar} navegar={navegar} />}
          </main>
          <nav className="abas" aria-label="Seções do app">
            <div>
              {ABAS.map((a) => (
                <button key={a.id} className={aba === a.id ? "ativa" : ""} onClick={() => navegar(a.id)} aria-current={aba === a.id ? "page" : undefined}>
                  <span className="ic" aria-hidden="true">{a.icone}</span>
                  {a.rotulo}
                </button>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
