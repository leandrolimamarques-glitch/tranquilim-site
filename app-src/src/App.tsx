import { useState, type ReactNode } from "react";
import { esquecerSessaoLocal, useCrianca, useSessao, type Atualizar, type CriancaDaConta, type Dados, type Sessao } from "./lib/store";
import { VISTA_VAZIA } from "./lib/familia";
import { api } from "./lib/api";
import { Entrar } from "./telas/Entrar";
import { Onboarding } from "./telas/Onboarding";
import { Inicio } from "./telas/Inicio";
import { VaiAoPS } from "./telas/VaiAoPS";
import { Trilhas } from "./telas/Trilhas";
import { Caderneta, type SecaoCaderneta } from "./telas/Caderneta";
import { Ajustes } from "./telas/Ajustes";
import { Pergunta } from "./telas/Pergunta";
import { Consultorio } from "./telas/painel/Consultorio";
import { Coruja } from "./Coruja";
import { Sobre } from "./telas/Sobre";
import { Confirmar, Redefinir } from "./telas/Senha";
import { PedirAceite } from "./telas/Legal";

export type Aba = "inicio" | "ps" | "trilhas" | "caderneta" | "ajustes" | "pergunta" | "consultorio" | "sobre";
export type Navegar = (aba: Aba, opcoes?: { secao?: SecaoCaderneta; fluxo?: string }) => void;

const CHAVE_CRIANCA = "tq:crianca";

export function App() {
  const h = location.hash;
  if (h.startsWith("#/redefinir/")) return <div className="app"><main className="conteudo sem-abas"><Redefinir token={h.slice(12)} /></main></div>;
  if (h.startsWith("#/confirmar/")) return <div className="app"><main className="conteudo sem-abas"><Confirmar token={h.slice(12)} /></main></div>;
  return <ComSessao />;
}

function ComSessao() {
  const [sessao, recarregar, erro] = useSessao();
  if (sessao === undefined) {
    if (erro) return <SemConexao erro={erro} tentar={() => void recarregar()} />;
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <p className="muted" role="status">Abrindo…</p>
          <a className="link-192" href="tel:192">Emergência: ligar 192</a>
        </main>
      </div>
    );
  }
  if (sessao === null) {
    return (
      <div className="app">
        <main className="conteudo sem-abas"><Entrar aoEntrar={() => void recarregar()} /></main>
      </div>
    );
  }
  if (sessao.termos && !sessao.termos.aceito && !erro) {
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <PedirAceite
            aceito={() => void recarregar()}
            sair={() => void api.post("/api/conta/sair").catch(() => undefined).then(() => { esquecerSessaoLocal(); location.reload(); })}
          />
        </main>
      </div>
    );
  }
  return <Logado sessao={sessao} recarregar={recarregar} semConexao={!!erro} />;
}

/** Sem internet e sem cópia da conta no aparelho: o que salva vida continua disponível. */
function SemConexao({ erro, tentar }: { erro: string; tentar: () => void }) {
  return (
    <div className="app">
      <main className="conteudo sem-abas">
        <div className="card" style={{ borderColor: "var(--luz)" }}>
          <p><b>{erro}</b></p>
          <p className="muted">O "Vai ao PS?" funciona sem internet. A ligação para o 192 também.</p>
          <button className="btn sec bloco" onClick={tentar}>Tentar de novo</button>
        </div>
        <VaiAoPS dados={DADOS_VAZIOS} />
      </main>
    </div>
  );
}

const DADOS_VAZIOS: Dados = { ...VISTA_VAZIA, criancaId: "", medico: null, vinculo: null, sincronia: "ok" };

function lerPreferida(): string | null {
  try {
    return localStorage.getItem(CHAVE_CRIANCA);
  } catch {
    return null;
  }
}

function Logado({ sessao, recarregar, semConexao }: { sessao: Sessao; recarregar: () => Promise<void>; semConexao: boolean }) {
  const [criancaId, setCriancaIdEstado] = useState<string | null>(lerPreferida);
  const c = sessao.criancas.find((k) => k.id === criancaId) ?? sessao.criancas[0] ?? null;
  const ehPediatra = sessao.conta.pediatra;
  const [aba, setAba] = useState<Aba>(() => (ehPediatra && (location.hash.startsWith("#/pediatra") || sessao.criancas.length === 0) ? "consultorio" : "inicio"));
  const [secao, setSecao] = useState<SecaoCaderneta>("vacinas");
  const [fluxoInicial, setFluxoInicial] = useState<string | null>(null);
  const [cadastrando, setCadastrando] = useState(false);

  const escolher = (id: string) => {
    setCriancaIdEstado(id);
    try {
      localStorage.setItem(CHAVE_CRIANCA, id);
    } catch {
      // sem armazenamento
    }
  };
  const navegar: Navegar = (destino, opcoes) => {
    if (opcoes?.secao) setSecao(opcoes.secao);
    setFluxoInicial(opcoes?.fluxo ?? null);
    setAba(destino);
    window.scrollTo(0, 0);
  };

  if (cadastrando || (!c && !ehPediatra)) {
    return (
      <div className="app">
        <main className="conteudo sem-abas">
          <NovaCrianca
            primeira={!c}
            cancelar={c ? () => setCadastrando(false) : undefined}
            pronto={async (id) => {
              escolher(id);
              await recarregar();
              setCadastrando(false);
              navegar("inicio");
            }}
          />
        </main>
      </div>
    );
  }

  const abas: { id: Aba; rotulo: string; icone: string }[] = [
    { id: "inicio", rotulo: "Início", icone: "⌂" },
    { id: "ps", rotulo: "Vai ao PS?", icone: "✚" },
    { id: "trilhas", rotulo: "Aprender", icone: "▶" },
    { id: "caderneta", rotulo: "Caderneta", icone: "✓" },
    ...(ehPediatra ? [{ id: "consultorio" as Aba, rotulo: "Consultório", icone: "☺" }] : []),
  ];

  const conteudo = (dados: Dados, atualizar: Atualizar, temCrianca: boolean): ReactNode => {
    const precisaCrianca = (tela: ReactNode) =>
      temCrianca ? tela : (
        <div className="card">
          <h2>Nenhuma criança cadastrada</h2>
          <p className="muted">Cadastre um filho para usar a caderneta, os avisos e o "Pergunte ao Tranquilim".</p>
          <button className="btn bloco" onClick={() => setCadastrando(true)}>Cadastrar criança</button>
        </div>
      );
    switch (aba) {
      case "consultorio":
        return (
          <>
            <Topo navegar={navegar} />
            <Consultorio conta={sessao.conta} recarregar={recarregar} />
          </>
        );
      case "ajustes":
        return <Ajustes sessao={sessao} atual={c} escolher={escolher} recarregar={recarregar} navegar={navegar} novaCrianca={() => setCadastrando(true)} />;
      case "ps":
        return <VaiAoPS key={fluxoInicial ?? "lista"} dados={dados} fluxoInicial={fluxoInicial} />;
      case "trilhas":
        return <Trilhas dados={dados} atualizar={atualizar} />;
      case "caderneta":
        return precisaCrianca(<Caderneta dados={dados} atualizar={atualizar} secao={secao} setSecao={setSecao} modo={{ quem: "familia", carteira: true, pacienteId: dados.criancaId }} />);
      case "sobre":
        return <Sobre voltar={() => navegar("inicio")} rotuloVoltar="Início" />;
      case "pergunta":
        return precisaCrianca(<Pergunta dados={dados} navegar={navegar} />);
      default:
        return (
          <>
            <Topo navegar={navegar} />
            {sessao.emailLigado && !sessao.conta.emailVerificado && <ConfirmeEmail email={sessao.conta.email} />}
            <Pedidos sessao={sessao} recarregar={recarregar} />
            {sessao.criancas.length > 1 && <Seletor criancas={sessao.criancas} atual={c?.id ?? ""} escolher={escolher} />}
            {precisaCrianca(<Inicio dados={dados} atualizar={atualizar} navegar={navegar} />)}
          </>
        );
    }
  };

  const casca = (dados: Dados, atualizar: Atualizar, temCrianca: boolean) => (
    <div className="app">
      <main className="conteudo">
        {semConexao && <p className="pequeno muted" role="status" style={{ margin: 0 }}>Sem internet: mostrando o que estava salvo neste aparelho.</p>}
        {conteudo(dados, atualizar, temCrianca)}
      </main>
      <nav className="abas" aria-label="Seções do app">
        <div style={{ gridTemplateColumns: `repeat(${abas.length}, 1fr) 0.8fr` }}>
          {abas.map((a) => (
            <button key={a.id} className={aba === a.id ? "ativa" : ""} onClick={() => navegar(a.id)} aria-current={aba === a.id ? "page" : undefined} style={abas.length > 4 ? { fontSize: 11 } : undefined}>
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

  if (!c) return casca(DADOS_VAZIOS, () => undefined, false);
  return <ComCrianca key={c.id} c={c}>{(dados, atualizar) => casca(dados, atualizar, true)}</ComCrianca>;
}

function ComCrianca({ c, children }: { c: CriancaDaConta; children: (d: Dados, a: Atualizar) => ReactNode }) {
  const [dados, atualizar] = useCrianca(c);
  return <>{children(dados, atualizar)}</>;
}

function Seletor({ criancas, atual, escolher }: { criancas: CriancaDaConta[]; atual: string; escolher: (id: string) => void }) {
  return (
    <div className="chips-rolagem">
      {criancas.map((k) => (
        <button key={k.id} className={`chip-filtro ${k.id === atual ? "ativa" : ""}`} onClick={() => escolher(k.id)}>{k.crianca.nome}</button>
      ))}
    </div>
  );
}

function NovaCrianca({ primeira, cancelar, pronto }: { primeira: boolean; cancelar?: () => void; pronto: (id: string) => Promise<void> }) {
  const [erro, setErro] = useState("");
  return (
    <>
      {cancelar && <button className="voltar" onClick={cancelar}>‹ Voltar</button>}
      <Onboarding
        titulo={primeira ? "Vamos começar pela criança" : "Cadastrar outra criança"}
        onSalvar={async (crianca) => {
          try {
            const r = await api.post<{ id: string }>("/api/criancas", { crianca });
            await pronto(r.id);
          } catch (e) {
            setErro((e as Error).message);
          }
        }}
      />
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
      <a className="link-192" href="tel:192">Emergência: ligar 192</a>
    </>
  );
}

function Pedidos({ sessao, recarregar }: { sessao: Sessao; recarregar: () => Promise<void> }) {
  const [marcadas, setMarcadas] = useState<Record<string, string[]>>({});
  if (sessao.pedidos.length === 0) return null;
  return (
    <>
      {sessao.pedidos.map((p) => {
        const sel = marcadas[p.id] ?? sessao.criancas.map((k) => k.id);
        return (
          <div key={p.id} className="card" style={{ borderColor: "var(--luz)", borderWidth: 2 }}>
            <h3>{p.pediatra.nome} quer acompanhar</h3>
            <p className="muted">{[p.pediatra.titulo, p.pediatra.registro].filter(Boolean).join(" · ")}. Ao aceitar, este pediatra vê as vacinas, medidas, diário e perguntas das crianças que você marcar.</p>
            {sessao.criancas.length === 0 && <p className="muted">Cadastre a criança primeiro, em Ajustes.</p>}
            {sessao.criancas.map((k) => (
              <label key={k.id} className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
                <input type="checkbox" checked={sel.includes(k.id)} onChange={() => setMarcadas({ ...marcadas, [p.id]: sel.includes(k.id) ? sel.filter((x) => x !== k.id) : [...sel, k.id] })} />
                <span>{k.crianca.nome}</span>
              </label>
            ))}
            <div className="grade2">
              <button className="btn sec" onClick={() => void api.post(`/api/conta/pedidos/${p.id}/recusar`).then(recarregar)}>Recusar</button>
              <button className="btn" disabled={sel.length === 0} onClick={() => void api.post(`/api/conta/pedidos/${p.id}/aceitar`, { criancas: sel }).then(recarregar)}>Aceitar</button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function Topo({ navegar }: { navegar: Navegar }) {
  return (
    <div className="topo">
      <div className="marca"><Coruja titulo="Tranquilim" /><span>Tranquilim</span></div>
      <button className="icone-btn" aria-label="Ajustes" onClick={() => navegar("ajustes")}>⚙</button>
    </div>
  );
}

function ConfirmeEmail({ email }: { email: string }) {
  const [msg, setMsg] = useState("");
  return (
    <div className="card" style={{ borderColor: "var(--luz)" }}>
      <p><b>Confirme seu e-mail.</b> Mandamos um link para {email}. Veja também a caixa de spam.</p>
      <button className="btn sec bloco" onClick={() => void api.post("/api/conta/reenviar-confirmacao").then(() => setMsg("Enviado de novo.")).catch((e: Error) => setMsg(e.message))}>Mandar de novo</button>
      {msg && <p className="pequeno">{msg}</p>}
    </div>
  );
}
