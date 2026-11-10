import { useEffect, useState } from "react";
import { useDados } from "./lib/store";
import { Onboarding } from "./telas/Onboarding";
import { Inicio } from "./telas/Inicio";
import { VaiAoPS } from "./telas/VaiAoPS";
import { Trilhas } from "./telas/Trilhas";
import { Caderneta, type SecaoCaderneta } from "./telas/Caderneta";
import { Ajustes } from "./telas/Ajustes";
import { Painel } from "./telas/Painel";
import { Convite } from "./telas/Convite";
import { extrairCodigo, ROTA_PAINEL } from "./lib/convite";

export type Aba = "inicio" | "ps" | "trilhas" | "caderneta" | "ajustes";

export type Navegar = (aba: Aba, opcoes?: { secao?: SecaoCaderneta }) => void;

const ABAS: { id: Aba; rotulo: string; icone: string }[] = [
  { id: "inicio", rotulo: "Início", icone: "⌂" },
  { id: "ps", rotulo: "Vai ao PS?", icone: "✚" },
  { id: "trilhas", rotulo: "Trilhas", icone: "▶" },
  { id: "caderneta", rotulo: "Caderneta", icone: "✓" },
];

function useHash(): [string, () => void] {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const ouvir = () => setHash(location.hash);
    window.addEventListener("hashchange", ouvir);
    return () => window.removeEventListener("hashchange", ouvir);
  }, []);
  const limpar = () => {
    history.replaceState(null, "", location.pathname + location.search);
    setHash("");
    window.scrollTo(0, 0);
  };
  return [hash, limpar];
}

export function App() {
  const [dados, atualizar] = useDados();
  const [hash, limparHash] = useHash();
  const [aba, setAba] = useState<Aba>("inicio");
  const [secao, setSecao] = useState<SecaoCaderneta>("vacinas");

  const navegar: Navegar = (destino, opcoes) => {
    if (opcoes?.secao) setSecao(opcoes.secao);
    setAba(destino);
    window.scrollTo(0, 0);
  };

  if (hash.startsWith(ROTA_PAINEL)) {
    return (
      <div className="app">
        <main className="conteudo sem-abas"><Painel sair={limparHash} /></main>
      </div>
    );
  }

  if (hash.startsWith("#/convite/")) {
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <Convite codigo={hash.slice("#/convite/".length)} dados={dados} atualizar={atualizar} concluir={() => { setAba("inicio"); limparHash(); }} />
        </main>
      </div>
    );
  }

  if (!dados.crianca) {
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <Onboarding onSalvar={(crianca) => atualizar((d) => ({ ...d, crianca }))} />
          <ColarConvite />
          <a className="link-192" href="tel:192">Emergência: ligar 192</a>
          <a className="voltar" style={{ alignSelf: "center", textDecoration: "none", display: "inline-flex", alignItems: "center" }} href={ROTA_PAINEL}>Área do pediatra ›</a>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="conteudo">
        {aba === "inicio" && <Inicio dados={dados} atualizar={atualizar} navegar={navegar} />}
        {aba === "ps" && <VaiAoPS dados={dados} />}
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
          <a className="sos" href="tel:192" aria-label="Emergência: ligar para o SAMU, 192">
            <span className="ic" aria-hidden="true">☎</span>
            192
          </a>
        </div>
      </nav>
    </div>
  );
}

function ColarConvite() {
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState(false);
  const abrir = () => {
    const codigo = extrairCodigo(texto);
    if (!codigo) return setErro(true);
    location.hash = `#/convite/${codigo}`;
  };
  return (
    <div className="card">
      <h3>Recebeu um convite do consultório?</h3>
      <p className="muted">Se o link abriu no navegador e não aqui, copie a mensagem do WhatsApp e cole abaixo.</p>
      <label className="campo">
        Mensagem ou link
        <input id="colar-convite" value={texto} onChange={(e) => { setTexto(e.target.value); setErro(false); }} autoComplete="off" />
      </label>
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>Não achamos o convite nesse texto. Copie a mensagem inteira.</p>}
      <button className="btn sec bloco" disabled={!texto.trim()} onClick={abrir}>Abrir convite</button>
    </div>
  );
}
