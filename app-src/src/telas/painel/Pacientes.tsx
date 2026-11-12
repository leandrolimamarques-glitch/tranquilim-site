import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type { Medico } from "../../lib/convite";
import { aplicarVista, docParaVista, type Crianca } from "../../lib/familia";
import { dataBr, hojeIso, idadeTexto } from "../../lib/idade";
import { gravar } from "../../lib/sinc";
import { novoId, type Atualizar, type Dados } from "../../lib/store";
import { useDocRemoto } from "../../lib/useDocRemoto";
import { lerFinanceiro, ROTULO_TIPO, valorBruto, type Lancamento } from "../../lib/financeiro";
import { reais } from "../../lib/dinheiro";
import type { Alerta } from "../../lib/alertas";
import { Caderneta, type SecaoCaderneta } from "../Caderneta";

type DocRemoto = ReturnType<typeof useDocRemoto>;

type Paciente = { id: string; crianca: Crianca; responsaveis: string; email: string; desde: string | null; atualizadoEm: string | null; alertas: Alerta[] };
type PedidoEnviado = { id: string; email: string; criadoEm: string };

export function Pacientes({ medico, financeiro }: { medico: Medico; financeiro: DocRemoto }) {
  const [lista, setLista] = useState<Paciente[] | null>(null);
  const [pedidos, setPedidos] = useState<PedidoEnviado[]>([]);
  const [erro, setErro] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const r = await api.get<{ pacientes: Paciente[]; pedidos: PedidoEnviado[] }>("/api/pediatra/pacientes");
      setLista(r.pacientes);
      setPedidos(r.pedidos);
      setErro("");
    } catch (e) {
      setErro((e as Error).message);
    }
  }, []);
  useEffect(() => {
    void carregar();
  }, [carregar]);

  const p = lista?.find((x) => x.id === aberto);
  if (p) return <VerPaciente key={p.id} p={p} medico={medico} financeiro={financeiro} voltar={() => { setAberto(null); void carregar(); window.scrollTo(0, 0); }} />;
  return <Lista lista={lista} pedidos={pedidos} erro={erro} abrir={(id) => { setAberto(id); window.scrollTo(0, 0); }} recarregar={carregar} />;
}

function Lista({ lista, pedidos, erro, abrir, recarregar }: { lista: Paciente[] | null; pedidos: PedidoEnviado[]; erro: string; abrir: (id: string) => void; recarregar: () => Promise<void> }) {
  const [busca, setBusca] = useState("");
  const [soAviso, setSoAviso] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const hoje = hojeIso();
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const comAviso = (x: Paciente) => x.alertas.some((a) => a.nivel === "atencao");
  const visiveis = (lista ?? []).filter((x) => (!termo || `${x.crianca.nome} ${x.responsaveis}`.toLocaleLowerCase("pt-BR").includes(termo)) && (!soAviso || comAviso(x)));

  const pedir = async () => {
    setMsg("");
    try {
      const r = await api.post<{ temConta: boolean }>("/api/pediatra/pedidos", { email });
      setMsg(r.temConta ? "Pedido enviado. Assim que a família aceitar no app, a criança aparece aqui." : "Esse e-mail ainda não tem conta. Peça para a família criar a conta em tranquilim.com.br com este e-mail: o pedido estará esperando quando ela entrar.");
      setEmail("");
      await recarregar();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Meus pacientes</h1>
      {lista && (
        <div className="grade2">
          <div className="contador"><b>{lista.length}</b><span>acompanhando</span></div>
          <div className="contador"><b style={{ color: lista.some(comAviso) ? "var(--ps)" : undefined }}>{lista.filter(comAviso).length}</b><span>com aviso</span></div>
        </div>
      )}
      <div className="card">
        <h3>Adicionar paciente</h3>
        <p className="muted">Digite o e-mail que a família usa no Tranquilim. Ela recebe o pedido no app e escolhe quais filhos você vai acompanhar. A família também pode escolher você na lista de pediatras.</p>
        <div className="grade2">
          <label className="campo">E-mail da família<input id="email-familia" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <button className="btn" style={{ alignSelf: "end" }} disabled={!email.includes("@")} onClick={() => void pedir()}>Pedir</button>
        </div>
        {msg && <p className="pequeno">{msg}</p>}
        {pedidos.length > 0 && (
          <>
            <p className="muted pequeno" style={{ fontWeight: 700 }}>Aguardando a família aceitar</p>
            {pedidos.map((d) => (
              <div key={d.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
                <span className="pequeno">{d.email} <span className="muted">· {dataBr(d.criadoEm.slice(0, 10))}</span></span>
                <button className="btn contorno" style={{ minHeight: 36, padding: "4px 10px" }} onClick={() => void api.del(`/api/pediatra/pedidos/${d.id}`).then(recarregar)}>Cancelar</button>
              </div>
            ))}
          </>
        )}
      </div>
      {erro && <p className="alerta">{erro}</p>}
      {lista && lista.length > 5 && <label className="campo">Buscar<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome da criança ou do responsável" /></label>}
      {lista && lista.some(comAviso) && (
        <label className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
          <input type="checkbox" checked={soAviso} onChange={(e) => setSoAviso(e.target.checked)} />
          <span>Só quem tem aviso</span>
        </label>
      )}
      {visiveis.length > 0 && (
        <div className="card" style={{ gap: 0, padding: "4px 16px" }}>
          {visiveis.map((x, i) => {
            const n = x.alertas.filter((a) => a.nivel === "atencao").length;
            return (
              <button key={x.id} className="item-lista" style={{ borderBottom: i < visiveis.length - 1 ? "1px solid var(--line)" : 0 }} onClick={() => abrir(x.id)}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ display: "block" }}>{x.crianca.nome}</b>
                  <span className="muted pequeno">{idadeTexto(x.crianca.nascimento, hoje)}{x.responsaveis ? ` · ${x.responsaveis}` : ""}</span>
                </span>
                {n > 0 ? <span className="chip" style={{ background: "var(--ps-soft)", color: "var(--ps)" }}>{n} aviso{n > 1 ? "s" : ""}</span> : <span className="chip aplicada">em dia</span>}
              </button>
            );
          })}
        </div>
      )}
      {lista && lista.length === 0 && <p className="muted">Nenhum paciente ainda.</p>}
    </>
  );
}

function VerPaciente({ p, medico, financeiro, voltar }: { p: Paciente; medico: Medico; financeiro: DocRemoto; voltar: () => void }) {
  const remoto = useDocRemoto(`/api/criancas/${p.id}/doc`);
  const [secao, setSecao] = useState<SecaoCaderneta>("vacinas");
  const [saindo, setSaindo] = useState(false);
  const hoje = hojeIso();
  void medico;

  const vista = useMemo(() => docParaVista(remoto.doc), [remoto.doc]);
  const base = (doc: typeof remoto.doc): Dados => {
    const v = docParaVista(doc);
    return { ...v, crianca: p.crianca ?? v.crianca, criancaId: p.id, medico: null, vinculo: null, sincronia: "ok" };
  };
  const dados: Dados = { ...vista, crianca: p.crianca ?? vista.crianca, criancaId: p.id, medico: null, vinculo: null, sincronia: remoto.estado };
  const atualizar: Atualizar = (f) => remoto.mudar((doc) => aplicarVista(doc, base(doc), f(base(doc))));

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
  const parar = async () => {
    const r = await api.get<{ conta: { id: string } }>("/api/conta");
    await api.del(`/api/criancas/${p.id}/pediatra/${r.conta.id}`);
    voltar();
  };

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Pacientes</button>
      <div className="linha">
        <h1 style={{ fontSize: 26 }}>{p.crianca.nome}</h1>
        <span className="chip">{idadeTexto(p.crianca.nascimento, hoje)}</span>
      </div>
      <p className="muted">{dataBr(p.crianca.nascimento)} · {p.crianca.sexo}{p.responsaveis && ` · ${p.responsaveis}`}{p.email && ` · ${p.email}`}</p>
      {p.alertas.length > 0 && (
        <div className="card" style={{ borderColor: p.alertas.some((a) => a.nivel === "atencao") ? "var(--ps)" : "var(--line)" }}>
          <h3>Avisos</h3>
          {p.alertas.map((a) => <p key={a.id} className={a.nivel === "info" ? "muted" : ""}>{a.nivel === "atencao" ? "● " : "○ "}{a.texto}</p>)}
        </div>
      )}
      {remoto.estado === "carregando" && <p className="muted" role="status">Carregando…</p>}
      {remoto.estado === "sem-conexao" && <p className="alerta">Sem conexão. O que você mudar aqui vai quando a internet voltar.</p>}
      <Caderneta dados={dados} atualizar={atualizar} secao={secao} setSecao={setSecao} modo={{ quem: "medico", carteira: true, pacienteId: p.id }} />

      <PerguntasDaFamilia criancaId={p.id} />

      <div className="card">
        <h3>Atendimentos</h3>
        {fontesConsultorio.length === 0 ? (
          <p className="muted">Cadastre um convênio ou o particular em Perfil para registrar consultas com valor.</p>
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

      {!saindo ? (
        <button className="btn contorno bloco" onClick={() => setSaindo(true)}>Parar de acompanhar</button>
      ) : (
        <div className="card">
          <p>Parar de acompanhar {p.crianca.nome}? A família continua com tudo; só você deixa de ver.</p>
          <div className="grade2">
            <button className="btn sec" onClick={() => setSaindo(false)}>Cancelar</button>
            <button className="btn ps" onClick={() => void parar()}>Parar</button>
          </div>
        </div>
      )}
    </>
  );
}

function PerguntasDaFamilia({ criancaId }: { criancaId: string }) {
  const [lista, setLista] = useState<{ pergunta: string; tipo: string; resposta: string; criadoEm: string }[] | null>(null);
  useEffect(() => {
    api.get<{ perguntas: NonNullable<typeof lista> }>(`/api/perguntas?crianca=${criancaId}`).then((r) => setLista(r.perguntas)).catch(() => setLista([]));
  }, [criancaId]);
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
