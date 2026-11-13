import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import type { Reconhecedor } from "../../lib/ditado";
import { MSG_TECLADO, iniciarDitado } from "../../lib/voz";
import { dataBr, hojeIso, idadeTexto } from "../../lib/idade";
import { compartilharPdf } from "../../lib/pdf";

// Prontuário do pediatra: só ele vê. Atendimento é rascunho até finalizar; depois só
// adendo. Documentos saem em PDF para imprimir e assinar.

type PacienteP = {
  id: string; criancaId: string | null; nome: string; nascimento: string; sexo: "menina" | "menino"; responsavel: string; telefone: string;
  alergias: string; antecedentes: string; semanasGestacao?: number; ultimoAtendimento: string | null;
};
type ConteudoAt = { motivo: string; historia: string; exame: string; hipotese: string; conduta: string; pesoKg?: number; comprimentoCm?: number; perimetroCefalicoCm?: number; temperaturaC?: number };
type Registro = { id: string; tipo: "atendimento" | "adendo"; referenteA: string | null; data: string; conteudo: ConteudoAt & { texto?: string }; criadoEm: string; finalizadoEm: string | null };
type TipoDoc = "receita" | "atestado" | "comparecimento" | "exame";
type DocP = { id: string; tipo: TipoDoc; conteudo: Record<string, unknown>; criadoEm: string; enviadoEm: string | null };
type Ficha = { paciente: PacienteP; noApp: boolean; registros: Registro[]; documentos: DocP[] };

const ROTULO_DOC: Record<TipoDoc, string> = { receita: "Receita", atestado: "Atestado", comparecimento: "Declaração de comparecimento", exame: "Pedido de exames" };
const hora = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Campo de texto com botão de ditado (no iPhone, abre o teclado com o microfone). */
function CampoDitado({ rotulo, valor, mudar, linhas = 3, dica }: { rotulo: string; valor: string; mudar: (v: string) => void; linhas?: number; dica?: string }) {
  const [ouvindo, setOuvindo] = useState(false);
  const [aviso, setAviso] = useState("");
  const rec = useRef<Reconhecedor | null>(null);
  const campo = useRef<HTMLTextAreaElement | null>(null);
  const ditar = () => {
    if (ouvindo) {
      rec.current?.stop();
      return;
    }
    setAviso("");
    const r = iniciarDitado({
      antes: valor,
      continuo: true,
      aoTexto: mudar,
      aoFim: () => setOuvindo(false),
      aoErro: (m) => {
        setAviso(m);
        campo.current?.focus();
      },
    });
    if (!r) {
      campo.current?.focus();
      setAviso(MSG_TECLADO);
      return;
    }
    rec.current = r;
    setOuvindo(true);
  };
  return (
    <label className="campo">
      <span className="linha" style={{ alignItems: "center" }}>
        <span>{rotulo}</span>
        <button type="button" className={`btn ${ouvindo ? "ps" : "contorno"}`} style={{ minHeight: 40, padding: "4px 12px", fontSize: 14 }} onClick={ditar} aria-pressed={ouvindo}>
          {ouvindo ? "■ Parar" : "🎤 Ditar"}
        </button>
      </span>
      <textarea ref={campo} rows={linhas} value={valor} onChange={(e) => mudar(e.target.value)} onBlur={() => setAviso("")} placeholder={dica} />
      {aviso && <span className="pequeno" role="status" style={{ fontWeight: 600 }}>{aviso}</span>}
    </label>
  );
}

// ---------------- lista ----------------

export function Prontuario({ abrirId, limparAbrir }: { abrirId: string | null; limparAbrir: () => void }) {
  const [aberto, setAberto] = useState<string | null>(abrirId);
  useEffect(() => {
    if (abrirId) {
      setAberto(abrirId);
      limparAbrir();
    }
  }, [abrirId, limparAbrir]);
  if (aberto) return <FichaPaciente id={aberto} voltar={() => setAberto(null)} />;
  return <ListaProntuario abrir={setAberto} />;
}

function ListaProntuario({ abrir }: { abrir: (id: string) => void }) {
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState<PacienteP[] | null>(null);
  const [novo, setNovo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      api.get<{ pacientes: PacienteP[] }>(`/api/prontuario/pacientes?busca=${encodeURIComponent(busca)}`).then((r) => setLista(r.pacientes)).catch(() => setLista([]));
    }, 250);
    return () => clearTimeout(t);
  }, [busca]);
  const hoje = hojeIso();
  if (novo) return <CadastroPaciente fechar={(id) => { setNovo(false); if (id) abrir(id); }} />;
  return (
    <>
      <h1 style={{ fontSize: 26 }}>Prontuário</h1>
      <p className="muted">Só você vê. Para pacientes que usam o Tranquilim, abra pela aba Pacientes: os dados da família vêm junto.</p>
      <button className="btn bloco" onClick={() => setNovo(true)}>+ Novo paciente</button>
      <label className="campo">Buscar<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome do paciente ou do responsável" /></label>
      {lista === null && <p className="muted" role="status">Carregando…</p>}
      {lista?.length === 0 && <p className="muted">Nenhum paciente {busca ? "com esse nome" : "ainda"}.</p>}
      {lista?.map((p) => (
        <button key={p.id} className="opcao" onClick={() => abrir(p.id)}>
          {p.nome}
          <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>
            {idadeTexto(p.nascimento, hoje)}{p.responsavel ? ` · ${p.responsavel}` : ""}{p.criancaId ? " · usa o app" : ""}
          </span>
          <span className="muted pequeno" style={{ display: "block" }}>{p.ultimoAtendimento ? `Último atendimento: ${dataBr(p.ultimoAtendimento)}` : "Sem atendimento ainda"}</span>
        </button>
      ))}
    </>
  );
}

function CadastroPaciente({ inicial, fechar }: { inicial?: PacienteP; fechar: (id?: string) => void }) {
  const [f, setF] = useState({
    nome: inicial?.nome ?? "", nascimento: inicial?.nascimento ?? "", sexo: inicial?.sexo ?? "", responsavel: inicial?.responsavel ?? "",
    telefone: inicial?.telefone ?? "", alergias: inicial?.alergias ?? "", antecedentes: inicial?.antecedentes ?? "", semanas: inicial?.semanasGestacao ? String(inicial.semanasGestacao) : "",
  });
  const [erro, setErro] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const valido = f.nome.trim() && f.nascimento && f.sexo;
  const salvar = async () => {
    setErro("");
    const corpo = { ...f, semanasGestacao: f.semanas ? Number(f.semanas) : null };
    try {
      if (inicial) {
        await api.put(`/api/prontuario/pacientes/${inicial.id}`, corpo);
        fechar(inicial.id);
      } else fechar((await api.post<{ id: string }>("/api/prontuario/pacientes", corpo)).id);
    } catch (e) {
      setErro((e as Error).message);
    }
  };
  return (
    <>
      <button className="voltar" onClick={() => fechar()}>‹ Voltar</button>
      <h1 style={{ fontSize: 26 }}>{inicial ? "Editar cadastro" : "Novo paciente"}</h1>
      <div className="card">
        <label className="campo">Nome<input value={f.nome} onChange={(e) => set("nome")(e.target.value)} /></label>
        <label className="campo">Nascimento<input type="date" value={f.nascimento} max={hojeIso()} onChange={(e) => set("nascimento")(e.target.value)} /></label>
        <div className="campo">Sexo
          <div className="segmento">
            <button type="button" className={f.sexo === "menina" ? "ativa" : ""} onClick={() => set("sexo")("menina")}>Menina</button>
            <button type="button" className={f.sexo === "menino" ? "ativa" : ""} onClick={() => set("sexo")("menino")}>Menino</button>
          </div>
        </div>
        <label className="campo">Responsável<input value={f.responsavel} onChange={(e) => set("responsavel")(e.target.value)} /></label>
        <label className="campo">Telefone<input value={f.telefone} inputMode="tel" onChange={(e) => set("telefone")(e.target.value)} /></label>
        <label className="campo">Prematuro? Semanas ao nascer
          <select value={f.semanas} onChange={(e) => set("semanas")(e.target.value)}>
            <option value="">Não informado / a termo</option>
            {Array.from({ length: 15 }, (_, i) => 22 + i).map((n) => <option key={n} value={n}>{n} semanas</option>)}
          </select>
        </label>
        <CampoDitado rotulo="Alergias" valor={f.alergias} mudar={set("alergias")} linhas={2} />
        <CampoDitado rotulo="Antecedentes" valor={f.antecedentes} mudar={set("antecedentes")} linhas={4} dica="Gestação e parto, internações, doenças, cirurgias, medicamentos de uso contínuo, família" />
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" disabled={!valido} onClick={() => void salvar()}>Salvar</button>
      </div>
    </>
  );
}

// ---------------- ficha ----------------

type Tela = { qual: "ficha" } | { qual: "atendimento"; registro?: Registro } | { qual: "documento"; tipo: TipoDoc } | { qual: "cadastro" };

function FichaPaciente({ id, voltar }: { id: string; voltar: () => void }) {
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [erro, setErro] = useState("");
  const [tela, setTela] = useState<Tela>({ qual: "ficha" });
  const carregar = useCallback(async () => {
    try {
      setFicha(await api.get<Ficha>(`/api/prontuario/pacientes/${id}`));
    } catch (e) {
      setErro((e as Error).message);
    }
  }, [id]);
  useEffect(() => {
    void carregar();
  }, [carregar]);
  const voltarFicha = () => {
    setTela({ qual: "ficha" });
    void carregar();
    window.scrollTo(0, 0);
  };

  if (erro) return <><button className="voltar" onClick={voltar}>‹ Prontuário</button><p className="muted">{erro}</p></>;
  if (!ficha) return <p className="muted" role="status">Carregando…</p>;
  const p = ficha.paciente;
  if (tela.qual === "cadastro") return <CadastroPaciente inicial={p} fechar={voltarFicha} />;
  if (tela.qual === "atendimento") return <EditorAtendimento paciente={p} noApp={ficha.noApp} registro={tela.registro} fechar={voltarFicha} />;
  if (tela.qual === "documento") return <EditorDocumento paciente={p} tipo={tela.tipo} fechar={voltarFicha} />;

  const hoje = hojeIso();
  const rascunho = ficha.registros.find((g) => g.tipo === "atendimento" && !g.finalizadoEm);
  const atendimentos = ficha.registros.filter((g) => g.tipo === "atendimento" && g.finalizadoEm);
  const adendos = (rid: string) => ficha.registros.filter((g) => g.tipo === "adendo" && g.referenteA === rid).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Prontuário</button>
      <div className="linha"><h1 style={{ fontSize: 26 }}>{p.nome}</h1><span className="chip">{idadeTexto(p.nascimento, hoje)}</span></div>
      <p className="muted">
        {dataBr(p.nascimento)}{p.semanasGestacao ? ` · nasceu com ${p.semanasGestacao} semanas` : ""}{p.responsavel ? ` · ${p.responsavel}` : ""}{p.telefone ? ` · ${p.telefone}` : ""}
        {ficha.noApp ? " · usa o app" : ""}
      </p>
      {p.alergias && <div className="alerta"><b>Alergias:</b> {p.alergias}</div>}
      {p.antecedentes && <div className="card"><h3>Antecedentes</h3><p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{p.antecedentes}</p></div>}
      <button className="btn contorno bloco" onClick={() => setTela({ qual: "cadastro" })}>Editar cadastro, alergias e antecedentes</button>

      {rascunho ? (
        <button className="btn bloco" onClick={() => setTela({ qual: "atendimento", registro: rascunho })}>Continuar atendimento de {dataBr(rascunho.data)} (rascunho)</button>
      ) : (
        <button className="btn bloco" onClick={() => setTela({ qual: "atendimento" })}>+ Novo atendimento</button>
      )}
      <div className="grade2">
        {(Object.keys(ROTULO_DOC) as TipoDoc[]).map((t) => (
          <button key={t} className="btn sec" onClick={() => setTela({ qual: "documento", tipo: t })}>{t === "comparecimento" ? "Comparecimento" : ROTULO_DOC[t]}</button>
        ))}
      </div>

      {ficha.documentos.length > 0 && (
        <div className="card">
          <h3>Documentos emitidos</h3>
          {ficha.documentos.map((d) => <LinhaDocumento key={d.id} d={d} nomePaciente={p.nome} noApp={ficha.noApp} atualizar={carregar} />)}
        </div>
      )}

      <h2 style={{ marginTop: 8 }}>Atendimentos</h2>
      {atendimentos.length === 0 && <p className="muted">Nenhum atendimento finalizado.</p>}
      {atendimentos.map((g) => <CartaoAtendimento key={g.id} g={g} adendos={adendos(g.id)} atualizar={carregar} />)}
    </>
  );
}

function CartaoAtendimento({ g, adendos, atualizar }: { g: Registro; adendos: Registro[]; atualizar: () => Promise<void> }) {
  const [abrindo, setAbrindo] = useState(false);
  const [texto, setTexto] = useState("");
  const c = g.conteudo;
  const medidas = [
    c.pesoKg && `${c.pesoKg.toLocaleString("pt-BR")} kg`, c.comprimentoCm && `${c.comprimentoCm.toLocaleString("pt-BR")} cm`,
    c.perimetroCefalicoCm && `PC ${c.perimetroCefalicoCm.toLocaleString("pt-BR")} cm`, c.temperaturaC && `${c.temperaturaC.toLocaleString("pt-BR")} °C`,
  ].filter(Boolean).join(" · ");
  const bloco = (rot: string, v: string) => v ? <p style={{ whiteSpace: "pre-wrap", margin: "4px 0" }}><b>{rot}:</b> {v}</p> : null;
  return (
    <div className="card">
      <div className="linha"><h3>{dataBr(g.data)}</h3><span className="muted pequeno">finalizado {dataBr(g.finalizadoEm!.slice(0, 10))} {hora(g.finalizadoEm!)}</span></div>
      {bloco("Motivo", c.motivo)}
      {bloco("História", c.historia)}
      {medidas && <p style={{ margin: "4px 0" }}><b>Medidas:</b> {medidas}</p>}
      {bloco("Exame físico", c.exame)}
      {bloco("Hipótese diagnóstica", c.hipotese)}
      {bloco("Conduta", c.conduta)}
      {adendos.map((a) => (
        <p key={a.id} className="pequeno" style={{ whiteSpace: "pre-wrap", borderLeft: "3px solid var(--luz)", paddingLeft: 8, margin: "6px 0" }}>
          <b>Adendo {dataBr(a.criadoEm.slice(0, 10))} {hora(a.criadoEm)}:</b> {a.conteudo.texto}
        </p>
      ))}
      {!abrindo ? (
        <button className="btn contorno" style={{ minHeight: 44 }} onClick={() => setAbrindo(true)}>+ Adendo</button>
      ) : (
        <>
          <CampoDitado rotulo="Adendo (fica registrado com data e hora; o atendimento não muda)" valor={texto} mudar={setTexto} />
          <div className="grade2">
            <button className="btn sec" onClick={() => { setAbrindo(false); setTexto(""); }}>Cancelar</button>
            <button className="btn" disabled={!texto.trim()} onClick={async () => { await api.post(`/api/prontuario/registros/${g.id}/adendo`, { texto }); setAbrindo(false); setTexto(""); await atualizar(); }}>Salvar adendo</button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- atendimento ----------------

const VAZIO: ConteudoAt = { motivo: "", historia: "", exame: "", hipotese: "", conduta: "" };

function EditorAtendimento({ paciente, noApp, registro, fechar }: { paciente: PacienteP; noApp: boolean; registro?: Registro; fechar: () => void }) {
  const [id, setId] = useState<string | null>(registro?.id ?? null);
  const idRef = useRef<string | null>(registro?.id ?? null);
  const [data, setData] = useState(registro?.data ?? hojeIso());
  const [c, setC] = useState<ConteudoAt>({ ...VAZIO, ...(registro?.conteudo ?? {}) });
  const [estado, setEstado] = useState<"salvo" | "salvando" | "erro" | "">(registro ? "salvo" : "");
  const [levar, setLevar] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const primeira = useRef(true);
  const criando = useRef<Promise<string> | null>(null);

  // Salva sozinho, 1,5 s depois de parar de escrever.
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    setEstado("salvando");
    const t = setTimeout(async () => {
      try {
        if (!idRef.current) {
          criando.current ??= api.post<{ id: string }>(`/api/prontuario/pacientes/${paciente.id}/atendimentos`, { data, conteudo: c }).then((r) => r.id);
          idRef.current = await criando.current;
          setId(idRef.current);
        } else await api.put(`/api/prontuario/registros/${idRef.current}`, { data, conteudo: c });
        setEstado("salvo");
      } catch {
        setEstado("erro");
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [c, data, paciente.id]);

  const set = (k: keyof ConteudoAt) => (v: string) => setC({ ...c, [k]: v });
  const setNum = (k: "pesoKg" | "comprimentoCm" | "perimetroCefalicoCm" | "temperaturaC") => (v: string) => {
    const n = Number(v.replace(",", "."));
    setC({ ...c, [k]: v.trim() && Number.isFinite(n) && n > 0 ? n : undefined });
  };
  const temMedida = !!(c.pesoKg || c.comprimentoCm || c.perimetroCefalicoCm);
  const finalizar = async () => {
    let rid = id ?? (criando.current ? await criando.current : null);
    if (!rid) rid = (await api.post<{ id: string }>(`/api/prontuario/pacientes/${paciente.id}/atendimentos`, { data, conteudo: c })).id;
    else await api.put(`/api/prontuario/registros/${rid}`, { data, conteudo: c });
    await api.post(`/api/prontuario/registros/${rid}/finalizar`, { levarMedidas: noApp && levar });
    fechar();
  };
  const descartar = async () => {
    if (id) await api.del(`/api/prontuario/registros/${id}`);
    fechar();
  };
  const num = (v?: number) => (v === undefined ? "" : String(v).replace(".", ","));

  return (
    <>
      <button className="voltar" onClick={fechar}>‹ {paciente.nome}</button>
      <div className="linha">
        <h1 style={{ fontSize: 24 }}>Atendimento</h1>
        <span className="muted pequeno" role="status">{{ salvo: "salvo", salvando: "salvando…", erro: "sem conexão: não salvou", "": "" }[estado]}</span>
      </div>
      {paciente.alergias && <div className="alerta"><b>Alergias:</b> {paciente.alergias}</div>}
      <div className="card">
        <label className="campo">Data<input type="date" value={data} max={hojeIso()} onChange={(e) => setData(e.target.value)} /></label>
        <CampoDitado rotulo="Motivo da consulta" valor={c.motivo} mudar={set("motivo")} linhas={2} />
        <CampoDitado rotulo="História" valor={c.historia} mudar={set("historia")} linhas={6} />
        <div className="grade2">
          <label className="campo">Peso (kg)<input inputMode="decimal" defaultValue={num(c.pesoKg)} onChange={(e) => setNum("pesoKg")(e.target.value)} /></label>
          <label className="campo">Comprimento (cm)<input inputMode="decimal" defaultValue={num(c.comprimentoCm)} onChange={(e) => setNum("comprimentoCm")(e.target.value)} /></label>
          <label className="campo">Perímetro cefálico (cm)<input inputMode="decimal" defaultValue={num(c.perimetroCefalicoCm)} onChange={(e) => setNum("perimetroCefalicoCm")(e.target.value)} /></label>
          <label className="campo">Temperatura (°C)<input inputMode="decimal" defaultValue={num(c.temperaturaC)} onChange={(e) => setNum("temperaturaC")(e.target.value)} /></label>
        </div>
        <CampoDitado rotulo="Exame físico" valor={c.exame} mudar={set("exame")} linhas={6} />
        <CampoDitado rotulo="Hipótese diagnóstica" valor={c.hipotese} mudar={set("hipotese")} linhas={2} />
        <CampoDitado rotulo="Conduta e orientações" valor={c.conduta} mudar={set("conduta")} linhas={5} />
      </div>
      {noApp && temMedida && (
        <label className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
          <input type="checkbox" checked={levar} onChange={(e) => setLevar(e.target.checked)} />
          <span>Levar as medidas para a curva no app da família</span>
        </label>
      )}
      {!confirmando ? (
        <button className="btn bloco" onClick={() => setConfirmando(true)}>Finalizar atendimento</button>
      ) : (
        <div className="card" style={{ borderColor: "var(--luz)", borderWidth: 2 }}>
          <p>Depois de finalizado, o atendimento não muda mais. Correções entram como adendo, com data e hora.</p>
          <div className="grade2">
            <button className="btn sec" onClick={() => setConfirmando(false)}>Voltar</button>
            <button className="btn" onClick={() => void finalizar()}>Finalizar</button>
          </div>
        </div>
      )}
      <button className="btn contorno bloco" onClick={() => void descartar()}>Descartar rascunho</button>
    </>
  );
}

// ---------------- documentos ----------------

function LinhaDocumento({ d, nomePaciente, noApp, atualizar }: { d: DocP; nomePaciente: string; noApp: boolean; atualizar: () => Promise<void> }) {
  const [msg, setMsg] = useState("");
  const nome = `${d.tipo}-${nomePaciente.split(" ")[0]}-${d.criadoEm.slice(0, 10)}.pdf`;
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
      <span><b style={{ fontWeight: 600 }}>{ROTULO_DOC[d.tipo]}</b> <span className="muted pequeno">· {dataBr(d.criadoEm.slice(0, 10))} {hora(d.criadoEm)}{d.enviadoEm ? " · enviado ao app da família" : ""}</span></span>
      <div className="grade2">
        <button className="btn sec" style={{ minHeight: 44 }} onClick={() => void compartilharPdf(`/api/prontuario/documentos/${d.id}/pdf`, nome).catch((e: Error) => setMsg(e.message))}>Imprimir ou enviar</button>
        {noApp && !d.enviadoEm ? (
          <button className="btn contorno" style={{ minHeight: 44 }} onClick={async () => {
            try {
              await api.post(`/api/prontuario/documentos/${d.id}/enviar`);
              await atualizar();
            } catch (e) {
              setMsg((e as Error).message);
            }
          }}>Mandar para o app</button>
        ) : <span />}
      </div>
      {msg && <p className="pequeno" style={{ color: "var(--ps)", margin: 0 }}>{msg}</p>}
    </div>
  );
}

function EditorDocumento({ paciente, tipo, fechar }: { paciente: PacienteP; tipo: TipoDoc; fechar: () => void }) {
  const hoje = hojeIso();
  const [itens, setItens] = useState([{ medicamento: "", quantidade: "", posologia: "" }]);
  const [orientacoes, setOrientacoes] = useState("");
  const [antimicrobiano, setAntimicrobiano] = useState(false);
  const [at, setAt] = useState({ finalidade: "afastamento das atividades escolares", dias: "1", aPartirDe: hoje, observacao: "", cid: "", cidAutorizado: false });
  const [comp, setComp] = useState({ responsavel: paciente.responsavel, data: hoje, horaInicio: "", horaFim: "" });
  const [exames, setExames] = useState("");
  const [indicacao, setIndicacao] = useState("");
  const [erro, setErro] = useState("");
  const [emitido, setEmitido] = useState<string | null>(null);

  const corpo = () => {
    if (tipo === "receita") return { tipo, itens, orientacoes, antimicrobiano };
    if (tipo === "atestado") return { tipo, ...at, dias: Number(at.dias) };
    if (tipo === "comparecimento") return { tipo, ...comp };
    return { tipo, itens: exames.split("\n").map((x) => x.trim()).filter(Boolean), indicacao };
  };
  const emitir = async () => {
    setErro("");
    try {
      setEmitido((await api.post<{ id: string }>(`/api/prontuario/pacientes/${paciente.id}/documentos`, corpo())).id);
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  if (emitido) {
    return (
      <>
        <button className="voltar" onClick={fechar}>‹ {paciente.nome}</button>
        <h1 style={{ fontSize: 24 }}>Documento emitido</h1>
        <p className="muted">Imprima e assine, ou compartilhe o PDF. Ele também fica na ficha do paciente.</p>
        <button className="btn bloco" onClick={() => void compartilharPdf(`/api/prontuario/documentos/${emitido}/pdf`, `${tipo}-${paciente.nome.split(" ")[0]}-${hoje}.pdf`).catch((e: Error) => setErro(e.message))}>Imprimir ou enviar</button>
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn sec bloco" onClick={fechar}>Voltar à ficha</button>
      </>
    );
  }

  return (
    <>
      <button className="voltar" onClick={fechar}>‹ {paciente.nome}</button>
      <h1 style={{ fontSize: 24 }}>{ROTULO_DOC[tipo]}</h1>
      {paciente.alergias && tipo === "receita" && <div className="alerta"><b>Alergias:</b> {paciente.alergias}</div>}
      <div className="card">
        {tipo === "receita" && (
          <>
            {itens.map((it, i) => (
              <div key={i} style={{ borderTop: i ? "1px solid var(--line)" : undefined, paddingTop: i ? 8 : 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="campo">Medicamento {i + 1}<input value={it.medicamento} onChange={(e) => setItens(itens.map((x, j) => (j === i ? { ...x, medicamento: e.target.value } : x)))} placeholder="nome, concentração e forma" /></label>
                <label className="campo">Quantidade<input value={it.quantidade} onChange={(e) => setItens(itens.map((x, j) => (j === i ? { ...x, quantidade: e.target.value } : x)))} placeholder="ex.: 1 frasco" /></label>
                <CampoDitado rotulo="Como usar" valor={it.posologia} mudar={(v) => setItens(itens.map((x, j) => (j === i ? { ...x, posologia: v } : x)))} linhas={2} />
                {itens.length > 1 && <button className="btn contorno" style={{ minHeight: 40 }} onClick={() => setItens(itens.filter((_, j) => j !== i))}>Tirar este item</button>}
              </div>
            ))}
            <button className="btn sec bloco" onClick={() => setItens([...itens, { medicamento: "", quantidade: "", posologia: "" }])}>+ Medicamento</button>
            <CampoDitado rotulo="Orientações" valor={orientacoes} mudar={setOrientacoes} linhas={3} />
            <label className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
              <input type="checkbox" checked={antimicrobiano} onChange={(e) => setAntimicrobiano(e.target.checked)} />
              <span>Tem antimicrobiano (sai em duas vias, RDC 471/2021)</span>
            </label>
            <p className="muted pequeno">Medicamento de controle especial (receita azul ou amarela, notificação) não sai por aqui: use o receituário oficial.</p>
          </>
        )}
        {tipo === "atestado" && (
          <>
            <label className="campo">Para fins de<input value={at.finalidade} onChange={(e) => setAt({ ...at, finalidade: e.target.value })} /></label>
            <div className="grade2">
              <label className="campo">Dias<input inputMode="numeric" value={at.dias} onChange={(e) => setAt({ ...at, dias: e.target.value.replace(/\D/g, "") })} /></label>
              <label className="campo">A partir de<input type="date" value={at.aPartirDe} onChange={(e) => setAt({ ...at, aPartirDe: e.target.value })} /></label>
            </div>
            <CampoDitado rotulo="Observação (opcional)" valor={at.observacao} mudar={(v) => setAt({ ...at, observacao: v })} linhas={2} />
            <label className="campo">CID (opcional)<input value={at.cid} onChange={(e) => setAt({ ...at, cid: e.target.value })} /></label>
            {at.cid && (
              <label className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
                <input type="checkbox" checked={at.cidAutorizado} onChange={(e) => setAt({ ...at, cidAutorizado: e.target.checked })} />
                <span>O responsável autorizou incluir o diagnóstico (Res. CFM 1.658/2002)</span>
              </label>
            )}
          </>
        )}
        {tipo === "comparecimento" && (
          <>
            <label className="campo">Responsável que acompanhou<input value={comp.responsavel} onChange={(e) => setComp({ ...comp, responsavel: e.target.value })} /></label>
            <label className="campo">Data<input type="date" value={comp.data} onChange={(e) => setComp({ ...comp, data: e.target.value })} /></label>
            <div className="grade2">
              <label className="campo">Das<input type="time" value={comp.horaInicio} onChange={(e) => setComp({ ...comp, horaInicio: e.target.value })} /></label>
              <label className="campo">Às<input type="time" value={comp.horaFim} onChange={(e) => setComp({ ...comp, horaFim: e.target.value })} /></label>
            </div>
          </>
        )}
        {tipo === "exame" && (
          <>
            <CampoDitado rotulo="Exames (um por linha)" valor={exames} mudar={setExames} linhas={5} />
            <CampoDitado rotulo="Indicação clínica" valor={indicacao} mudar={setIndicacao} linhas={2} />
          </>
        )}
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" onClick={() => void emitir()}>Emitir</button>
        <p className="muted pequeno">Sai em PDF para imprimir e assinar. O documento emitido fica guardado na ficha e não muda; para corrigir, emita outro.</p>
      </div>
    </>
  );
}
