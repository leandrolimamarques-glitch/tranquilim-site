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
