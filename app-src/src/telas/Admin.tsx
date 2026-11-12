import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { dataBr } from "../lib/idade";

type ContaAdm = { id: string; nome: string; email: string; dono: boolean; pediatra: boolean; registro: string | null; criancas: number; pacientes: number; criadoEm: string };

export function Admin({ voltar, euId }: { voltar: () => void; euId: string }) {
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState<ContaAdm[] | null>(null);
  const [aberta, setAberta] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const carregar = useCallback(async () => {
    setLista((await api.get<{ contas: ContaAdm[] }>(`/api/admin/contas?busca=${encodeURIComponent(busca)}`)).contas);
  }, [busca]);
  useEffect(() => {
    const t = setTimeout(() => void carregar(), 250);
    return () => clearTimeout(t);
  }, [carregar]);

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Ajustes</button>
      <h1 style={{ fontSize: 26 }}>Administração</h1>
      <p className="muted">Quem criou conta. Para liberar a função de pediatra, abra a pessoa e ative.</p>
      <Painel />
      <TesteEmail />
      <RegrasIA />
      <h2 style={{ marginTop: 8 }}>Contas</h2>
      <label className="campo">Buscar<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome ou e-mail" /></label>
      {aviso && <div className="card" role="status"><p>{aviso}</p></div>}
      {lista?.map((c) => (
        <div key={c.id} className="card" style={{ gap: 6 }}>
          <button className="item-lista" style={{ padding: 0, minHeight: 44 }} onClick={() => setAberta(aberta === c.id ? null : c.id)}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: "block" }}>{c.nome}</b>
              <span className="muted pequeno">{c.email} · desde {dataBr(c.criadoEm.slice(0, 10))}</span>
            </span>
            {c.dono ? <span className="chip proxima">dono</span> : c.pediatra ? <span className="chip aplicada">pediatra</span> : <span className="chip">família</span>}
          </button>
          {aberta === c.id && <EditarConta c={c} eu={c.id === euId} pronto={(m) => { setAviso(m); void carregar(); }} />}
        </div>
      ))}
      {lista && lista.length === 0 && <p className="muted">Ninguém encontrado.</p>}
    </>
  );
}

function EditarConta({ c, eu, pronto }: { c: ContaAdm; eu: boolean; pronto: (m: string) => void }) {
  const [registro, setRegistro] = useState(c.registro ?? "");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const salvar = async (corpo: Record<string, unknown>, msg: string) => {
    setErro("");
    try {
      await api.put(`/api/admin/contas/${c.id}`, corpo);
      pronto(msg);
    } catch (e) {
      setErro((e as Error).message);
    }
  };
  return (
    <>
      <p className="muted pequeno">{c.criancas} {c.criancas === 1 ? "criança" : "crianças"} na família · {c.pacientes} {c.pacientes === 1 ? "paciente" : "pacientes"}</p>
      {!c.pediatra ? (
        <>
          <label className="campo">CRM (e RQE, se tiver)<input value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="CRM-SP 000000" /></label>
          <button className="btn bloco" disabled={registro.trim().length < 4} onClick={() => void salvar({ pediatra: true, registro }, `${c.nome} agora é pediatra.`)}>Ativar como pediatra</button>
        </>
      ) : (
        !eu && <button className="btn contorno bloco" onClick={() => void salvar({ pediatra: false }, `${c.nome} voltou a ser só família.`)}>Desativar pediatra</button>
      )}
      {!c.dono && c.pediatra && <button className="btn sec bloco" onClick={() => void salvar({ dono: true }, `${c.nome} agora também administra.`)}>Tornar administrador</button>}
      <div className="grade2">
        <label className="campo">Senha provisória<input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="8+ caracteres" /></label>
        <button className="btn sec" style={{ alignSelf: "end" }} disabled={senha.length < 8} onClick={async () => {
          try {
            await api.put(`/api/admin/contas/${c.id}/senha`, { senha });
            pronto(`Senha de ${c.nome} trocada. Passe a senha provisória para a pessoa.`);
            setSenha("");
          } catch (e) {
            setErro((e as Error).message);
          }
        }}>Trocar senha</button>
      </div>
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
    </>
  );
}

type PerguntaAdm = { pergunta: string; tipo: string; resposta: string; crianca: string; criadoEm: string };

function RegrasIA() {
  const [regras, setRegras] = useState<string | null>(null);
  const [perguntas, setPerguntas] = useState<PerguntaAdm[]>([]);
  const [msg, setMsg] = useState("");
  const [verTodas, setVerTodas] = useState(false);
  useEffect(() => {
    api.get<{ regras: string; perguntas: PerguntaAdm[] }>("/api/admin/ia").then((r) => { setRegras(r.regras); setPerguntas(r.perguntas); }).catch(() => setRegras(""));
  }, []);
  if (regras === null) return null;
  const ROT: Record<string, string> = { orientacao: "respondeu", fluxo: "mandou ao fluxo", medico: "mandou ao pediatra", emergencia: "192", fora: "fora do conteúdo" };
  return (
    <div className="card">
      <h3>IA: regras dos médicos</h3>
      <p className="muted pequeno">O "Pergunte ao Tranquilim" já usa o conteúdo do app e os filtros fixos (emergência vai ao 192; remédio, dose e diagnóstico vão ao pediatra). Aqui vocês acrescentam orientações próprias, uma por linha. Valem na próxima pergunta.</p>
      <textarea className="area-texto" rows={6} value={regras} onChange={(e) => setRegras(e.target.value)} placeholder={"Ex.: Em dúvidas sobre sono, sempre lembrar que o bebê dorme de barriga para cima.\nEx.: Não falar sobre homeopatia; dizer que é para conversar com o pediatra."} />
      <button className="btn bloco" onClick={async () => { await api.put("/api/admin/ia", { regras }); setMsg("Regras salvas."); }}>Salvar regras</button>
      {msg && <p className="pequeno">{msg}</p>}
      <h3 style={{ marginTop: 8 }}>Últimas perguntas das famílias</h3>
      {perguntas.length === 0 && <p className="muted">Ninguém perguntou ainda.</p>}
      {(verTodas ? perguntas : perguntas.slice(0, 8)).map((q, i) => (
        <div key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <div className="linha"><b style={{ fontWeight: 600 }}>{q.pergunta}</b><span className="chip">{ROT[q.tipo] ?? q.tipo}</span></div>
          <p className="muted pequeno">{q.crianca} · {dataBr(q.criadoEm.slice(0, 10))} · {q.resposta}</p>
        </div>
      ))}
      {perguntas.length > 8 && !verTodas && <button className="voltar" onClick={() => setVerTodas(true)}>Ver todas ({perguntas.length})</button>}
    </div>
  );
}

function TesteEmail() {
  const [msg, setMsg] = useState("");
  return (
    <div className="card">
      <h3>E-mail</h3>
      <p className="muted pequeno">Manda um e-mail de teste para você. Se der erro, aparece aqui o motivo.</p>
      <button className="btn sec bloco" onClick={async () => {
        setMsg("Enviando…");
        try {
          const r = await api.post<{ ok: boolean; erro?: string }>("/api/admin/teste-email");
          setMsg(r.ok ? "Enviado. Veja a caixa de entrada e o spam." : `Não enviou: ${r.erro}`);
        } catch (e) {
          setMsg((e as Error).message);
        }
      }}>Mandar e-mail de teste</button>
      {msg && <p className="pequeno">{msg}</p>}
    </div>
  );
}

type PainelDados = {
  numeros: Record<string, number>;
  porTipo: { tipo: string; n: number }[];
  sugestoes: { texto: string; nome: string; email: string; em: string }[];
  erros: { mensagem: string; onde: string; pilha: string; navegador: string; email: string; em: string }[];
};

const ROTULO_TIPO: Record<string, string> = { orientacao: "orientação", fluxo: "mandou ao Vai ao PS?", medico: "é com o pediatra", emergencia: "emergência (192)", fora: "fora do conteúdo" };

function quando(iso: string) {
  const d = new Date(iso);
  return `${dataBr(iso.slice(0, 10))} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Painel() {
  const [d, setD] = useState<PainelDados | null>(null);
  const [erro, setErro] = useState("");
  const [ver, setVer] = useState<"" | "sugestoes" | "erros">("");
  useEffect(() => {
    api.get<PainelDados>("/api/admin/painel").then(setD).catch((e: Error) => setErro(e.message));
  }, []);
  if (erro) return <div className="card"><p className="muted">{erro}</p></div>;
  if (!d) return <div className="card"><p className="muted">Carregando números…</p></div>;
  const n = d.numeros;
  const linhas: [string, string][] = [
    ["Contas", `${n.contas} (${n.contas7} nesta semana)`],
    ["Famílias com criança", String(n.familias)],
    ["Crianças", `${n.criancas} (${n.acompanhadas} com pediatra)`],
    ["Pediatras ativos", String(n.pediatras)],
    ["Perguntas à IA", `${n.perguntas} (${n.perguntas7} nesta semana)`],
    ["Erros no aparelho (7 dias)", String(n.erros7)],
  ];
  return (
    <div className="card">
      <h3>Números</h3>
      {linhas.map(([k, v]) => (
        <div key={k} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 4 }}><span className="muted">{k}</span><b>{v}</b></div>
      ))}
      {d.porTipo.length > 0 && (
        <p className="muted pequeno">Respostas da IA: {d.porTipo.map((t) => `${ROTULO_TIPO[t.tipo] ?? t.tipo} ${t.n}`).join(" · ")}</p>
      )}
      <div className="grade2">
        <button className={`btn ${ver === "sugestoes" ? "" : "sec"}`} onClick={() => setVer(ver === "sugestoes" ? "" : "sugestoes")}>Sugestões ({n.sugestoes})</button>
        <button className={`btn ${ver === "erros" ? "" : "sec"}`} onClick={() => setVer(ver === "erros" ? "" : "erros")}>Erros recentes</button>
      </div>
      {ver === "sugestoes" && (d.sugestoes.length === 0 ? <p className="muted">Nenhuma sugestão ainda.</p> : d.sugestoes.map((x, i) => (
        <div key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{x.texto}</p>
          <p className="muted pequeno" style={{ margin: 0 }}>{x.nome} · {x.email} · {quando(x.em)}</p>
        </div>
      )))}
      {ver === "erros" && (d.erros.length === 0 ? <p className="muted">Nenhum erro registrado.</p> : d.erros.map((x, i) => (
        <details key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <summary style={{ minHeight: 44, cursor: "pointer" }}>{x.mensagem} <span className="muted pequeno">· {quando(x.em)}</span></summary>
          <p className="muted pequeno" style={{ margin: 0 }}>{x.onde} · {x.email || "sem conta"} · {x.navegador}</p>
          <pre style={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0 }}>{x.pilha}</pre>
        </details>
      )))}
    </div>
  );
}
