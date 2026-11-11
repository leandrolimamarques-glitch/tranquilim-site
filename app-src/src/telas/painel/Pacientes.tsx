import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { formatarTelefone, linkConvite, linkWhatsApp, mensagemConvite, telefoneBr, type Medico } from "../../lib/convite";
import { aplicarVista, docParaVista, type Crianca, type Medida } from "../../lib/familia";
import { dataBr, hojeIso, idadeTexto } from "../../lib/idade";
import type { Sexo } from "../../lib/oms";
import { gravar } from "../../lib/sinc";
import { novoId, type Atualizar, type Dados } from "../../lib/store";
import { lerFinanceiro, ROTULO_TIPO, valorBruto, type Lancamento } from "../../lib/financeiro";
import { reais } from "../../lib/dinheiro";
import { Caderneta, type SecaoCaderneta } from "../Caderneta";
import { useDocRemoto } from "./useDocRemoto";

type DocRemoto = ReturnType<typeof useDocRemoto>;

export type PacienteResumo = {
  id: string;
  crianca: Crianca;
  responsavel: string;
  whatsapp: string;
  convite: string;
  conviteEm: string | null;
  ativadoEm: string | null;
  atualizadoEm: string | null;
  alertas: { id: string; nivel: "atencao" | "info"; texto: string }[];
  resumo: { vacinasPendentes: number; vacinasConfirmadas: number; ultimaMedida: Medida | null; ultimoDiario: string | null };
};

type Tela = { t: "lista" } | { t: "novo" } | { t: "editar"; id: string } | { t: "ver"; id: string };

const BASE_APP = () => `${location.origin}/`;

export function Pacientes({ medico, financeiro }: { medico: Medico; financeiro: DocRemoto }) {
  const [lista, setLista] = useState<PacienteResumo[] | null>(null);
  const [erro, setErro] = useState("");
  const [tela, setTela] = useState<Tela>({ t: "lista" });

  const carregar = useCallback(async () => {
    try {
      setLista((await api.get<{ pacientes: PacienteResumo[] }>("/api/medico/pacientes")).pacientes);
      setErro("");
    } catch (e) {
      setErro((e as Error).message);
    }
  }, []);
  useEffect(() => {
    void carregar();
  }, [carregar]);

  const ir = (t: Tela) => {
    setTela(t);
    window.scrollTo(0, 0);
    if (t.t === "lista" || t.t === "ver") void carregar();
  };

  if (tela.t === "novo" || tela.t === "editar") {
    const atual = tela.t === "editar" ? lista?.find((p) => p.id === tela.id) : undefined;
    return <FormPaciente inicial={atual} voltar={() => ir(atual ? { t: "ver", id: atual.id } : { t: "lista" })} aoSalvar={(id) => ir({ t: "ver", id })} />;
  }
  if (tela.t === "ver") {
    const p = lista?.find((x) => x.id === tela.id);
    if (p) return <VerPaciente key={p.id} p={p} medico={medico} financeiro={financeiro} ir={ir} recarregar={carregar} />;
    if (!erro) return <p className="muted" role="status">Carregando…</p>;
  }
  return <Lista lista={lista} erro={erro} ir={ir} />;
}

function Lista({ lista, erro, ir }: { lista: PacienteResumo[] | null; erro: string; ir: (t: Tela) => void }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "atrasadas" | "sem-convite">("todos");
  const hoje = hojeIso();
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const visiveis = (lista ?? []).filter(
    (p) =>
      (!termo || `${p.crianca.nome} ${p.responsavel}`.toLocaleLowerCase("pt-BR").includes(termo)) &&
      (filtro === "todos" || (filtro === "atrasadas" ? p.alertas.some((a) => a.nivel === "atencao") : !p.ativadoEm)),
  );
  const ativos = lista?.filter((p) => p.ativadoEm).length ?? 0;
  const comAtraso = lista?.filter((p) => p.ativadoEm && p.alertas.some((a) => a.nivel === "atencao")).length ?? 0;

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Pacientes</h1>
      {lista && (
        <div className="grade4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="contador"><b>{lista.length}</b><span>cadastrados</span></div>
          <div className="contador"><b>{ativos}</b><span>usando o app</span></div>
          <div className="contador"><b style={{ color: comAtraso ? "var(--ps)" : undefined }}>{comAtraso}</b><span>com aviso</span></div>
        </div>
      )}
      <button className="btn bloco" onClick={() => ir({ t: "novo" })}>+ Cadastrar paciente</button>
      {erro && <p className="alerta">{erro}</p>}
      {lista && lista.length > 0 && (
        <>
          <label className="campo">Buscar<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome da criança ou do responsável" /></label>
          <div className="segmento">
            <button className={filtro === "todos" ? "ativa" : ""} onClick={() => setFiltro("todos")}>Todos</button>
            <button className={filtro === "atrasadas" ? "ativa" : ""} onClick={() => setFiltro("atrasadas")}>Com aviso</button>
            <button className={filtro === "sem-convite" ? "ativa" : ""} onClick={() => setFiltro("sem-convite")}>Sem app</button>
          </div>
        </>
      )}
      {lista && lista.length === 0 && (
        <div className="card">
          <h3>Nenhum paciente ainda</h3>
          <p className="muted">Cadastre a criança e mande o convite pelo WhatsApp. A família abre o link, autoriza, e o que ela registrar (vacinas, medidas, diário, foto da carteira) aparece aqui.</p>
        </div>
      )}
      {visiveis.length > 0 && (
        <div className="card" style={{ gap: 0, padding: "4px 16px" }}>
          {visiveis.map((p, i) => (
            <button key={p.id} className="item-lista" style={{ borderBottom: i < visiveis.length - 1 ? "1px solid var(--line)" : 0 }} onClick={() => ir({ t: "ver", id: p.id })}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b style={{ display: "block" }}>{p.crianca.nome}</b>
                <span className="muted pequeno">{idadeTexto(p.crianca.nascimento, hoje)}{p.responsavel ? ` · ${p.responsavel}` : ""}</span>
              </span>
              {!p.ativadoEm ? (
                <span className="chip pendente">{p.conviteEm ? "convidado" : "sem convite"}</span>
              ) : p.alertas.some((a) => a.nivel === "atencao") ? (
                <span className="chip" style={{ background: "var(--ps-soft)", color: "var(--ps)" }}>{p.alertas.filter((a) => a.nivel === "atencao").length} aviso{p.alertas.filter((a) => a.nivel === "atencao").length > 1 ? "s" : ""}</span>
              ) : (
                <span className="chip aplicada">em dia</span>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function FormPaciente({ inicial, voltar, aoSalvar }: { inicial?: PacienteResumo; voltar: () => void; aoSalvar: (id: string) => void }) {
  const [nome, setNome] = useState(inicial?.crianca.nome ?? "");
  const [nascimento, setNascimento] = useState(inicial?.crianca.nascimento ?? "");
  const [sexo, setSexo] = useState<Sexo | "">(inicial?.crianca.sexo ?? "");
  const [responsavel, setResponsavel] = useState(inicial?.responsavel ?? "");
  const [whatsapp, setWhatsapp] = useState(inicial?.whatsapp ?? "");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const hoje = hojeIso();
  const zapOk = !whatsapp.trim() || !!telefoneBr(whatsapp);
  const valido = nome.trim().length > 0 && nascimento !== "" && nascimento <= hoje && sexo !== "" && zapOk;

  const salvar = async () => {
    setEnviando(true);
    setErro("");
    const corpo = { crianca: { nome: nome.trim(), nascimento, sexo }, responsavel: responsavel.trim(), whatsapp: whatsapp.trim() };
    try {
      if (inicial) {
        await api.put(`/api/medico/pacientes/${inicial.id}`, corpo);
        aoSalvar(inicial.id);
      } else aoSalvar((await api.post<{ id: string }>("/api/medico/pacientes", corpo)).id);
    } catch (e) {
      setErro((e as Error).message);
      setEnviando(false);
    }
  };

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Voltar</button>
      <h1 style={{ fontSize: 26 }}>{inicial ? "Editar paciente" : "Novo paciente"}</h1>
      <div className="card">
        <label className="campo">Nome ou apelido da criança<input id="p-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="off" /></label>
        <label className="campo">Data de nascimento<input id="p-nascimento" type="date" value={nascimento} max={hoje} onChange={(e) => setNascimento(e.target.value)} /></label>
        <div className="campo">
          Sexo (para as curvas)
          <div className="segmento">
            <button type="button" className={sexo === "menina" ? "ativa" : ""} onClick={() => setSexo("menina")}>Menina</button>
            <button type="button" className={sexo === "menino" ? "ativa" : ""} onClick={() => setSexo("menino")}>Menino</button>
          </div>
        </div>
        <label className="campo">Nome do responsável (opcional)<input id="p-resp" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} autoComplete="off" /></label>
        <label className="campo">
          WhatsApp do responsável (opcional)
          <input id="p-zap" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" placeholder="(11) 90000-0000" />
          {!zapOk && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}
        </label>
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" disabled={!valido || enviando} onClick={salvar}>Salvar</button>
      </div>
    </>
  );
}

function VerPaciente({ p, medico, financeiro, ir, recarregar }: { p: PacienteResumo; medico: Medico; financeiro: DocRemoto; ir: (t: Tela) => void; recarregar: () => Promise<void> }) {
  const remoto = useDocRemoto(`/api/medico/pacientes/${p.id}/doc`);
  const [secao, setSecao] = useState<SecaoCaderneta>("vacinas");
  const [removendo, setRemovendo] = useState(false);
  const [copiado, setCopiado] = useState<"" | "ok" | "falhou">("");
  const [convite, setConvite] = useState(p.convite);
  const hoje = hojeIso();
  const link = linkConvite(BASE_APP(), convite);
  const mensagem = mensagemConvite(medico, p.crianca, p.responsavel, link);

  const vista = useMemo(() => docParaVista(remoto.doc), [remoto.doc]);
  const dados: Dados = { ...vista, crianca: vista.crianca ?? p.crianca, medico: null, vinculo: null, sincronia: "ok" };
  const atualizar: Atualizar = (f) => remoto.mudar((doc) => {
    const antes: Dados = { ...docParaVista(doc), medico: null, vinculo: null, sincronia: "ok" };
    if (!antes.crianca) antes.crianca = p.crianca;
    return aplicarVista(doc, antes, f(antes));
  });

  const marcarEnviado = () => void api.post(`/api/medico/pacientes/${p.id}/convite-enviado`).then(recarregar);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado("ok");
      marcarEnviado();
    } catch {
      setCopiado("falhou");
    }
  };
  const novoLink = async () => setConvite((await api.post<{ convite: string }>(`/api/medico/pacientes/${p.id}/novo-link`)).convite);

  // Atendimentos deste paciente no financeiro
  const fin = lerFinanceiro(financeiro.doc);
  const atendimentos = fin.lancamentos.filter((l) => l.pacienteId === p.id).sort((a, b) => b.data.localeCompare(a.data));
  const fontesConsultorio = fin.fontes.filter((f) => f.ativo && f.tipo !== "plantao");
  const [fonteId, setFonteId] = useState(fontesConsultorio[0]?.id ?? "");
  const registrarAtendimento = (tipo: Lancamento["tipo"]) => {
    const f = fin.fontes.find((x) => x.id === fonteId);
    if (!f) return;
    const l: Lancamento = { id: novoId(), fonteId: f.id, tipo, data: hoje, quantidade: 1, valorUnit: tipo === "retorno" ? f.valorRetorno : f.valorConsulta, pacienteId: p.id };
    financeiro.mudar((d) => gravar(d, "lancamentos", l));
  };

  return (
    <>
      <button className="voltar" onClick={() => ir({ t: "lista" })}>‹ Pacientes</button>
      <div className="linha">
        <h1 style={{ fontSize: 26 }}>{p.crianca.nome}</h1>
        <span className="chip">{idadeTexto(p.crianca.nascimento, hoje)}</span>
      </div>
      <p className="muted">
        {dataBr(p.crianca.nascimento)} · {p.crianca.sexo === "menina" ? "menina" : "menino"}
        {p.responsavel && ` · ${p.responsavel}`}
        {p.whatsapp && ` · ${formatarTelefone(p.whatsapp)}`}
      </p>

      {!p.ativadoEm ? (
        <div className="card">
          <h3>Convite</h3>
          <p className="muted">{p.conviteEm ? `Enviado em ${dataBr(p.conviteEm.slice(0, 10))}, ainda não aberto.` : "A família ainda não recebeu o convite."}</p>
          <a className="btn bloco" href={linkWhatsApp(p.whatsapp, mensagem)} target="_blank" rel="noopener noreferrer" onClick={marcarEnviado}>Enviar pelo WhatsApp</a>
          <button className="btn sec bloco" onClick={copiar}>{copiado === "ok" ? "Mensagem copiada" : "Copiar mensagem com o link"}</button>
          {copiado === "falhou" && <textarea readOnly value={mensagem} rows={6} className="area-texto" onFocus={(e) => e.currentTarget.select()} />}
        </div>
      ) : (
        <div className="card">
          <div className="linha"><h3>Usando o app</h3><span className="chip aplicada">desde {dataBr(p.ativadoEm.slice(0, 10))}</span></div>
          <p className="muted pequeno">{p.atualizadoEm ? `Última atualização: ${dataBr(p.atualizadoEm.slice(0, 10))}.` : ""} A família autorizou o acompanhamento.</p>
          <div className="grade2">
            <a className="btn sec" href={linkWhatsApp(p.whatsapp, `Olá${p.responsavel ? `, ${p.responsavel.split(" ")[0]}` : ""}! Aqui é ${medico.nome}.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button className="btn sec" onClick={copiar}>{copiado === "ok" ? "Link copiado" : "Reenviar link"}</button>
          </div>
        </div>
      )}

      {remoto.estado === "carregando" && <p className="muted" role="status">Carregando…</p>}
      {remoto.estado === "sem-conexao" && <p className="alerta">Sem conexão. O que você mudar aqui vai quando a internet voltar.</p>}
      <Caderneta dados={dados} atualizar={atualizar} secao={secao} setSecao={setSecao} modo={{ quem: "medico", carteira: true, pacienteId: p.id }} />

      <div className="card">
        <h3>Atendimentos</h3>
        {fontesConsultorio.length === 0 ? (
          <p className="muted">Cadastre um convênio ou o particular em Ajustes para registrar consultas com valor.</p>
        ) : (
          <>
            <label className="campo">Como foi
              <select value={fonteId} onChange={(e) => setFonteId(e.target.value)}>
                {fontesConsultorio.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </label>
            <div className="grade2">
              <button className="btn sec" onClick={() => registrarAtendimento("consulta")}>+ Consulta hoje</button>
              <button className="btn sec" onClick={() => registrarAtendimento("retorno")}>+ Retorno hoje</button>
            </div>
          </>
        )}
        {atendimentos.slice(0, 8).map((l) => (
          <div key={l.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
            <span>{ROTULO_TIPO[l.tipo]} <span className="muted pequeno">· {dataBr(l.data)} · {fin.fontes.find((f) => f.id === l.fonteId)?.nome}</span></span>
            <span className="pequeno">{reais(valorBruto(l))}</span>
          </div>
        ))}
      </div>

      {p.alertas.length > 0 && (
        <div className="card" style={{ borderColor: p.alertas.some((a) => a.nivel === "atencao") ? "var(--ps)" : "var(--line)" }}>
          <h3>Avisos</h3>
          {p.alertas.map((a) => <p key={a.id} className={a.nivel === "info" ? "muted" : ""}>{a.nivel === "atencao" ? "● " : "○ "}{a.texto}</p>)}
        </div>
      )}
      <PerguntasDaFamilia pacienteId={p.id} />

      <div className="grade2">
        <button className="btn sec" onClick={() => ir({ t: "editar", id: p.id })}>Editar</button>
        <button className="btn contorno" onClick={() => setRemovendo(true)}>Remover</button>
      </div>
      <button className="voltar pequeno" onClick={() => void novoLink()}>Gerar link novo (o anterior para de funcionar)</button>
      {removendo && (
        <div className="card">
          <p>Remover {p.crianca.nome}? O celular da família deixa de sincronizar com você.</p>
          <div className="grade2">
            <button className="btn sec" onClick={() => setRemovendo(false)}>Cancelar</button>
            <button className="btn ps" onClick={() => void api.del(`/api/medico/pacientes/${p.id}`).then(() => ir({ t: "lista" }))}>Remover</button>
          </div>
        </div>
      )}
    </>
  );
}

function PerguntasDaFamilia({ pacienteId }: { pacienteId: string }) {
  const [lista, setLista] = useState<{ pergunta: string; tipo: string; resposta: string; criadoEm: string }[] | null>(null);
  useEffect(() => {
    api.get<{ perguntas: NonNullable<typeof lista> }>(`/api/perguntas?paciente=${pacienteId}`).then((r) => setLista(r.perguntas)).catch(() => setLista([]));
  }, [pacienteId]);
  if (!lista || lista.length === 0) return null;
  const ROT: Record<string, string> = { orientacao: "respondida", fluxo: "mandada ao Vai ao PS", medico: "encaminhada a você", emergencia: "192", fora: "fora do conteúdo" };
  return (
    <div className="card">
      <h3>Perguntas da família</h3>
      {lista.slice(0, 10).map((q, i) => (
        <div key={i} style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <div className="linha"><b style={{ fontWeight: 600 }}>{q.pergunta}</b><span className={`chip ${q.tipo === "medico" || q.tipo === "emergencia" ? "pendente" : ""}`}>{ROT[q.tipo] ?? q.tipo}</span></div>
          <p className="muted pequeno">{dataBr(q.criadoEm.slice(0, 10))} · {q.resposta}</p>
        </div>
      ))}
    </div>
  );
}
