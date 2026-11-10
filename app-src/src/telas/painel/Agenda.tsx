import { useMemo, useState } from "react";
import { centavosParaTexto, nomeDoMes, paraCentavos, reais } from "../../lib/dinheiro";
import { dataPrevista, gerarSerie, lerFinanceiro, mesDe, ROTULO_SITUACAO, ROTULO_TIPO, situacao, somarMesesAoMes, valorBruto, type Fonte, type Lancamento, type TipoLancamento } from "../../lib/financeiro";
import { dataBr, hojeIso } from "../../lib/idade";
import { gravar, remover } from "../../lib/sinc";
import { novoId } from "../../lib/store";
import type { useDocRemoto } from "./useDocRemoto";

type DocRemoto = ReturnType<typeof useDocRemoto>;

const DIA_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function Agenda({ financeiro }: { financeiro: DocRemoto }) {
  const hoje = hojeIso();
  const [mes, setMes] = useState(mesDe(hoje));
  const [editando, setEditando] = useState<Lancamento | "novo" | null>(null);
  const [diaNovo, setDiaNovo] = useState(hoje);
  const fin = useMemo(() => lerFinanceiro(financeiro.doc), [financeiro.doc]);
  const fontes = new Map(fin.fontes.map((f) => [f.id, f]));

  if (editando) {
    return (
      <FormLancamento
        fin={fin.fontes}
        inicial={editando === "novo" ? undefined : editando}
        dia={diaNovo}
        financeiro={financeiro}
        fechar={() => {
          setEditando(null);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const doMes = fin.lancamentos.filter((l) => mesDe(l.data) === mes);
  const porDia = new Map<string, Lancamento[]>();
  for (const l of doMes) porDia.set(l.data, [...(porDia.get(l.data) ?? []), l]);
  const dias = [...porDia.keys()].sort();
  const total = doMes.reduce((s, l) => s + valorBruto(l), 0);
  const plantoes = doMes.filter((l) => l.tipo === "plantao" || fontes.get(l.fonteId)?.tipo === "plantao");
  const consultas = doMes.filter((l) => l.tipo === "consulta" || l.tipo === "retorno").reduce((s, l) => s + (l.quantidade || 1), 0);

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Agenda</h1>
      <div className="linha">
        <button className="icone-btn" aria-label="Mês anterior" onClick={() => setMes(somarMesesAoMes(mes, -1))}>‹</button>
        <b>{nomeDoMes(mes)}</b>
        <button className="icone-btn" aria-label="Próximo mês" onClick={() => setMes(somarMesesAoMes(mes, 1))}>›</button>
      </div>
      <div className="grade4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="contador"><b>{consultas}</b><span>consultas</span></div>
        <div className="contador"><b>{plantoes.length}</b><span>plantões</span></div>
        <div className="contador"><b style={{ fontSize: 17 }}>{reais(total).replace(",00", "")}</b><span>produzido</span></div>
      </div>
      {fin.fontes.length === 0 ? (
        <div className="card">
          <h3>Comece pelos lugares que pagam você</h3>
          <p className="muted">Em Ajustes, cadastre os convênios, o particular e os locais de plantão, com valor e prazo de pagamento. Depois é só lançar.</p>
        </div>
      ) : (
        <button className="btn bloco" onClick={() => { setDiaNovo(mes === mesDe(hoje) ? hoje : `${mes}-01`); setEditando("novo"); }}>+ Lançar consulta ou plantão</button>
      )}
      {dias.length === 0 && fin.fontes.length > 0 && <p className="muted">Nada lançado neste mês.</p>}
      {dias.map((d) => {
        const dt = new Date(`${d}T12:00:00Z`);
        return (
          <div key={d} className="card" style={{ gap: 4 }}>
            <div className="linha">
              <b>{DIA_SEMANA[dt.getUTCDay()]}, {dataBr(d).slice(0, 5)}{d === hoje ? " · hoje" : ""}</b>
              <button className="voltar pequeno" style={{ minHeight: 32 }} onClick={() => { setDiaNovo(d); setEditando("novo"); }}>+ lançar</button>
            </div>
            {porDia.get(d)!.map((l) => {
              const f = fontes.get(l.fonteId);
              const sit = situacao(l, f, hoje);
              return (
                <button key={l.id} className="item-lista" style={{ minHeight: 48, borderTop: "1px solid var(--line)" }} onClick={() => setEditando(l)}>
                  <i aria-hidden="true" style={{ width: 8, alignSelf: "stretch", borderRadius: 4, background: f?.cor ?? "var(--line)" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <b style={{ display: "block", fontWeight: 600 }}>
                      {ROTULO_TIPO[l.tipo]}{(l.quantidade || 1) > 1 ? ` ×${l.quantidade}` : ""} · {f?.nome ?? "?"}
                    </b>
                    <span className="muted pequeno">
                      {l.inicio ? `${l.inicio}${l.horas ? ` · ${l.horas}h` : ""} · ` : ""}{reais(valorBruto(l))} · {sit === "recebido" ? `recebido ${dataBr(l.recebidoEm!).slice(0, 5)}` : `${ROTULO_SITUACAO[sit].toLowerCase()} ${dataBr(dataPrevista(l, f)).slice(0, 5)}`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

const TURNOS = [
  { id: "diurno", rotulo: "Diurno 7–19h", inicio: "07:00", horas: 12 },
  { id: "noturno", rotulo: "Noturno 19–7h", inicio: "19:00", horas: 12 },
  { id: "24h", rotulo: "24 horas", inicio: "07:00", horas: 24 },
  { id: "outro", rotulo: "Outro horário", inicio: "", horas: 6 },
];

function valorSugerido(f: Fonte | undefined, tipo: TipoLancamento, horas: number): number {
  if (!f) return 0;
  if (tipo === "plantao") return f.valorPlantao || f.valorHora * horas;
  if (tipo === "retorno") return f.valorRetorno;
  if (tipo === "consulta") return f.valorConsulta;
  return 0;
}

export function FormLancamento({ fin, inicial, dia, financeiro, fechar }: { fin: Fonte[]; inicial?: Lancamento; dia: string; financeiro: DocRemoto; fechar: () => void }) {
  const ativas = fin.filter((f) => f.ativo || f.id === inicial?.fonteId);
  const [tipo, setTipo] = useState<TipoLancamento>(inicial?.tipo ?? (ativas[0]?.tipo === "plantao" ? "plantao" : "consulta"));
  const opcoes = ativas.filter((f) => (tipo === "plantao" ? f.tipo === "plantao" || f.tipo === "outro" : f.tipo !== "plantao"));
  const [fonteId, setFonteId] = useState(inicial?.fonteId ?? opcoes[0]?.id ?? "");
  const fonte = fin.find((f) => f.id === fonteId);
  const [data, setData] = useState(inicial?.data ?? dia);
  const [turno, setTurno] = useState(inicial ? (TURNOS.find((t) => t.inicio === inicial.inicio && t.horas === inicial.horas)?.id ?? "outro") : "diurno");
  const [inicio, setInicio] = useState(inicial?.inicio ?? "07:00");
  const [horas, setHoras] = useState(String(inicial?.horas ?? 12));
  const [quantidade, setQuantidade] = useState(String(inicial?.quantidade ?? 1));
  const horasN = Math.max(0, Number(horas.replace(",", ".")) || 0);
  const [valor, setValor] = useState(centavosParaTexto(inicial?.valorUnit ?? valorSugerido(fonte, tipo, horasN)));
  const [valorTocado, setValorTocado] = useState(!!inicial);
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [repeticao, setRepeticao] = useState<"nao" | "semanal" | "quinzenal" | "mensal">("nao");
  const [vezes, setVezes] = useState("4");
  const [recebidoEm, setRecebidoEm] = useState(inicial?.recebidoEm ?? "");
  const [valorRecebido, setValorRecebido] = useState(inicial?.valorRecebido !== undefined ? centavosParaTexto(inicial.valorRecebido) : "");
  const [glosado, setGlosado] = useState(!!inicial?.glosado);
  const [apagando, setApagando] = useState(false);

  const ehPlantao = tipo === "plantao";
  const sugerido = valorSugerido(fonte, tipo, horasN);
  const valorTexto = valorTocado ? valor : centavosParaTexto(sugerido);
  const valorC = paraCentavos(valorTexto);
  const qtd = Math.max(1, Math.round(Number(quantidade) || 1));
  const valido = !!fonte && /^\d{4}-\d{2}-\d{2}$/.test(data) && valorC !== null;

  const salvar = () => {
    if (!fonte || valorC === null) return;
    const turnoSel = TURNOS.find((t) => t.id === turno)!;
    const base: Omit<Lancamento, "id" | "serieId"> = {
      fonteId: fonte.id,
      tipo,
      data,
      quantidade: ehPlantao ? 1 : qtd,
      valorUnit: valorC,
      ...(ehPlantao ? { inicio: turno === "outro" ? inicio : turnoSel.inicio, horas: turno === "outro" ? horasN : turnoSel.horas } : {}),
      ...(descricao.trim() ? { descricao: descricao.trim() } : {}),
      ...(inicial?.pacienteId ? { pacienteId: inicial.pacienteId } : {}),
    };
    const recebimento = {
      ...(recebidoEm ? { recebidoEm } : {}),
      ...(recebidoEm && paraCentavos(valorRecebido) !== null ? { valorRecebido: paraCentavos(valorRecebido)! } : {}),
      ...(glosado ? { glosado: true } : {}),
    };
    financeiro.mudar((d) => {
      if (inicial) return gravar(d, "lancamentos", { ...base, ...recebimento, id: inicial.id, ...(inicial.serieId ? { serieId: inicial.serieId } : {}) });
      const novos = ehPlantao && repeticao !== "nao" ? gerarSerie(base, repeticao, Number(vezes) || 1, novoId) : [{ ...base, id: novoId() }];
      return novos.reduce((acc, l) => gravar(acc, "lancamentos", l), d);
    });
    fechar();
  };

  const apagar = (futuros: boolean) => {
    if (!inicial) return;
    financeiro.mudar((d) => {
      const alvo = futuros && inicial.serieId ? lerFinanceiro(d).lancamentos.filter((l) => l.serieId === inicial.serieId && l.data >= inicial.data) : [inicial];
      return alvo.reduce((acc, l) => remover(acc, "lancamentos", l.id), d);
    });
    fechar();
  };

  return (
    <>
      <button className="voltar" onClick={fechar}>‹ Agenda</button>
      <h1 style={{ fontSize: 26 }}>{inicial ? "Editar lançamento" : "Lançar"}</h1>
      <div className="card">
        <div className="segmento">
          {(["consulta", "retorno", "procedimento", "plantao"] as TipoLancamento[]).map((t) => (
            <button key={t} type="button" className={tipo === t ? "ativa" : ""} onClick={() => { setTipo(t); const o = ativas.filter((f) => (t === "plantao" ? f.tipo === "plantao" || f.tipo === "outro" : f.tipo !== "plantao")); if (!o.some((f) => f.id === fonteId)) setFonteId(o[0]?.id ?? ""); setValorTocado(false); }} style={{ fontSize: 13 }}>
              {ROTULO_TIPO[t]}
            </button>
          ))}
        </div>
        <label className="campo">{ehPlantao ? "Local" : "Convênio ou particular"}
          <select value={fonteId} onChange={(e) => { setFonteId(e.target.value); setValorTocado(false); }}>
            {opcoes.length === 0 && <option value="">Cadastre em Ajustes</option>}
            {opcoes.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </label>
        <label className="campo">Data<input type="date" value={data} onChange={(e) => setData(e.target.value)} /></label>
        {ehPlantao ? (
          <>
            <div className="grade2">
              {TURNOS.map((t) => (
                <button key={t.id} type="button" className={`btn ${turno === t.id ? "" : "sec"}`} style={{ minHeight: 44, fontSize: 14 }} onClick={() => { setTurno(t.id); if (t.id !== "outro") setHoras(String(t.horas)); setValorTocado(false); }}>{t.rotulo}</button>
              ))}
            </div>
            {turno === "outro" && (
              <div className="grade2">
                <label className="campo">Início<input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} /></label>
                <label className="campo">Horas<input inputMode="decimal" value={horas} onChange={(e) => { setHoras(e.target.value); setValorTocado(false); }} /></label>
              </div>
            )}
          </>
        ) : (
          <label className="campo">Quantidade (mesmo convênio, mesmo dia)<input inputMode="numeric" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} /></label>
        )}
        <label className="campo">Valor {ehPlantao ? "do plantão" : "de cada uma"} (R$)
          <input inputMode="decimal" value={valorTexto} onChange={(e) => { setValor(e.target.value); setValorTocado(true); }} placeholder="0,00" />
        </label>
        {!ehPlantao && qtd > 1 && valorC !== null && <p className="muted pequeno">Total: {reais(valorC * qtd)}</p>}
        <label className="campo">Observação (opcional)<input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder={ehPlantao ? "ex.: cobri colega" : "ex.: guia nº"} /></label>
        {ehPlantao && !inicial && (
          <div className="grade2">
            <label className="campo">Repetir
              <select value={repeticao} onChange={(e) => setRepeticao(e.target.value as typeof repeticao)}>
                <option value="nao">Não</option>
                <option value="semanal">Toda semana</option>
                <option value="quinzenal">A cada 15 dias</option>
                <option value="mensal">Todo mês</option>
              </select>
            </label>
            {repeticao !== "nao" && <label className="campo">Quantas vezes<input inputMode="numeric" value={vezes} onChange={(e) => setVezes(e.target.value)} /></label>}
          </div>
        )}
        {fonte && <p className="muted pequeno">Previsão de pagamento: {dataBr(dataPrevista({ id: "", fonteId: fonte.id, tipo, data, quantidade: 1, valorUnit: 0 }, fonte))}</p>}
      </div>

      {inicial && (
        <div className="card">
          <h3>Recebimento</h3>
          <div className="grade2">
            <label className="campo">Recebido em<input type="date" value={recebidoEm} onChange={(e) => setRecebidoEm(e.target.value)} /></label>
            <label className="campo">Valor recebido<input inputMode="decimal" value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} placeholder={valorC !== null ? centavosParaTexto(valorC * (inicial.quantidade || 1)) : ""} /></label>
          </div>
          <label className="sinal" style={{ borderWidth: 1 }}>
            <input type="checkbox" checked={glosado} onChange={(e) => setGlosado(e.target.checked)} />
            <span>Glosado (não vai ser pago)</span>
          </label>
          <p className="muted pequeno">Recebeu menos que o valor? Ponha o que entrou: a diferença aparece como glosa.</p>
        </div>
      )}

      <button className="btn bloco" disabled={!valido} onClick={salvar}>Salvar</button>
      {inicial && !apagando && <button className="btn contorno bloco" onClick={() => setApagando(true)}>Apagar</button>}
      {inicial && apagando && (
        <div className="card">
          <div className="grade2">
            <button className="btn sec" onClick={() => setApagando(false)}>Cancelar</button>
            <button className="btn ps" onClick={() => apagar(false)}>Apagar este</button>
          </div>
          {inicial.serieId && <button className="btn ps bloco" onClick={() => apagar(true)}>Apagar este e os próximos da repetição</button>}
        </div>
      )}
    </>
  );
}
