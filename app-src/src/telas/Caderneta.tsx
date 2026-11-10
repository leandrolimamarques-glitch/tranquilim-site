import { useState } from "react";
import { dataBr, hojeIso, idadeEmMesesDecimal } from "../lib/idade";
import { curva, descreverPercentil, IDADE_MAXIMA_CURVA_MESES, LINHAS_PERCENTIL, percentil, type Indicador, type Sexo } from "../lib/oms";
import { novoId, type Atualizar, type Dados, type Medida, type Registro, type TipoRegistro } from "../lib/store";
import { FONTE_CALENDARIO, situacaoDasVacinas, type VacinaComSituacao } from "../lib/vacinas";
import { Carteira } from "./Carteira";

export type SecaoCaderneta = "vacinas" | "crescimento" | "diario";

export const ROTULOS_REGISTRO: Record<TipoRegistro, string> = { mamada: "Mamada", xixi: "Xixi", coco: "Cocô", sono: "Sono" };

export function contarHoje(diario: readonly Registro[], hoje: string): Record<TipoRegistro, number> {
  const c: Record<TipoRegistro, number> = { mamada: 0, xixi: 0, coco: 0, sono: 0 };
  for (const r of diario) if (hojeIso(new Date(r.quando)) === hoje) c[r.tipo] += 1;
  return c;
}

export type ModoCaderneta = { quem: "familia" | "medico"; carteira: boolean; pacienteId?: string };

type Props = { dados: Dados; atualizar: Atualizar; secao: SecaoCaderneta; setSecao: (s: SecaoCaderneta) => void; modo?: ModoCaderneta };

const MODO_FAMILIA: ModoCaderneta = { quem: "familia", carteira: false };

export function Caderneta({ dados, atualizar, secao, setSecao, modo = MODO_FAMILIA }: Props) {
  return (
    <>
      {modo.quem === "familia" && <h1 style={{ fontSize: 28 }}>Caderneta</h1>}
      <div className="segmento" role="tablist">
        <button className={secao === "vacinas" ? "ativa" : ""} onClick={() => setSecao("vacinas")}>Vacinas</button>
        <button className={secao === "crescimento" ? "ativa" : ""} onClick={() => setSecao("crescimento")}>Crescimento</button>
        <button className={secao === "diario" ? "ativa" : ""} onClick={() => setSecao("diario")}>Diário</button>
      </div>
      {secao === "vacinas" && <Vacinas dados={dados} atualizar={atualizar} modo={modo} />}
      {secao === "crescimento" && <Crescimento dados={dados} atualizar={atualizar} modo={modo} />}
      {secao === "diario" && <Diario dados={dados} atualizar={atualizar} modo={modo} />}
    </>
  );
}

const ROTULO_SITUACAO = { aplicada: "aplicada", pendente: "conferir", proxima: "próxima", futura: "" } as const;

function rotuloIdade(m: number): string {
  if (m === 0) return "Ao nascer";
  if (m < 24) return `${m} meses`;
  return `${Math.floor(m / 12)} anos`;
}

const ORIGEM = { familia: "marcada pela família", medico: "marcada pelo consultório", carteira: "lida da carteira" } as const;

function Vacinas({ dados, atualizar, modo }: { dados: Dados; atualizar: Atualizar; modo: ModoCaderneta }) {
  const c = dados.crianca!;
  const lista = situacaoDasVacinas(c.nascimento, hojeIso(), new Set(dados.vacinasAplicadas));
  const grupos = new Map<number, VacinaComSituacao[]>();
  for (const v of lista) grupos.set(v.idadeMeses, [...(grupos.get(v.idadeMeses) ?? []), v]);
  const pendentes = lista.filter((v) => v.situacao === "pendente");
  const alternar = (id: string) =>
    atualizar((d) => {
      if (d.vacinasAplicadas.includes(id)) {
        const { [id]: _fora, ...vacinaInfo } = d.vacinaInfo;
        return { ...d, vacinasAplicadas: d.vacinasAplicadas.filter((x) => x !== id), vacinaInfo };
      }
      return { ...d, vacinasAplicadas: [...d.vacinasAplicadas, id], vacinaInfo: { ...d.vacinaInfo, [id]: { origem: modo.quem } } };
    });
  const apagarOutra = (id: string) => atualizar((d) => ({ ...d, outrasVacinas: d.outrasVacinas.filter((o) => o.id !== id) }));

  return (
    <>
      {modo.carteira && <Carteira dados={dados} atualizar={atualizar} pacienteId={modo.pacienteId} />}
      {pendentes.length > 0 && (
        <div className="alerta">
          <b>{pendentes.length === 1 ? "1 vacina para conferir: " : `${pendentes.length} vacinas para conferir: `}</b>
          {pendentes.slice(0, 4).map((v) => `${v.nome} (${v.dose})`).join(", ")}{pendentes.length > 4 ? ` e mais ${pendentes.length - 4}` : ""}. A idade já chegou e não estão marcadas.
        </div>
      )}
      <p className="muted">{modo.carteira ? "Ou marque à mão as vacinas que já estão na caderneta física." : "Marque as vacinas que já estão na caderneta física. O app avisa as que faltam e as próximas."}</p>
      {[...grupos.entries()].map(([idade, vs]) => (
        <div className="card" key={idade}>
          <div className="linha"><h3>{rotuloIdade(idade)}</h3><span className="muted pequeno">{dataBr(vs[0].dataPrevista)}</span></div>
          <div className="tabela-vacina">
            {vs.map((v) => (
              <label key={v.id}>
                <input type="checkbox" checked={v.situacao === "aplicada"} onChange={() => alternar(v.id)} />
                <span>
                  <b style={{ fontWeight: 600 }}>{v.nome}</b> <span className="muted">· {v.dose}</span>
                  {dados.vacinaInfo[v.id]?.origem && (
                    <span className="muted pequeno" style={{ display: "block" }}>
                      {dados.vacinaInfo[v.id].data ? `Aplicada em ${dataBr(dados.vacinaInfo[v.id].data!)} · ` : ""}{ORIGEM[dados.vacinaInfo[v.id].origem!]}
                    </span>
                  )}
                  {v.nota && v.situacao !== "aplicada" && <span className="muted pequeno" style={{ display: "block" }}>{v.nota}</span>}
                </span>
                {ROTULO_SITUACAO[v.situacao] && <span className={`chip ${v.situacao}`}>{ROTULO_SITUACAO[v.situacao]}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}
      {dados.outrasVacinas.length > 0 && (
        <div className="card">
          <h3>Outras vacinas</h3>
          <p className="muted pequeno">Fora do calendário do SUS (clínica particular, campanhas, doses extras).</p>
          {dados.outrasVacinas.map((o) => (
            <div key={o.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
              <span>{o.nome}<span className="muted pequeno" style={{ display: "block" }}>{o.data ? dataBr(o.data) : "sem data"}</span></span>
              <button className="icone-btn" aria-label={`Apagar ${o.nome}`} onClick={() => apagarOutra(o.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <p className="fontes">{FONTE_CALENDARIO}</p>
    </>
  );
}

function numero(texto: string): number | undefined {
  const n = Number(texto.replace(",", ".").trim());
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function Crescimento({ dados, atualizar, modo }: { dados: Dados; atualizar: Atualizar; modo: ModoCaderneta }) {
  const c = dados.crianca!;
  const [indicador, setIndicador] = useState<Indicador>("peso");
  const [data, setData] = useState(hojeIso());
  const [peso, setPeso] = useState("");
  const [comprimento, setComprimento] = useState("");
  const pesoN = numero(peso);
  const compN = numero(comprimento);
  const pesoForaDaFaixa = pesoN !== undefined && (pesoN < 0.5 || pesoN > 40);
  const compForaDaFaixa = compN !== undefined && (compN < 30 || compN > 140);
  const podeSalvar = (pesoN !== undefined || compN !== undefined) && !pesoForaDaFaixa && !compForaDaFaixa && data >= c.nascimento && data <= hojeIso();

  const salvar = () => {
    const m: Medida = { id: novoId(), data, pesoKg: pesoN, comprimentoCm: compN, origem: modo.quem === "medico" ? "consulta" : "familia" };
    atualizar((d) => ({ ...d, medidas: [...d.medidas, m] }));
    setPeso("");
    setComprimento("");
  };
  const apagar = (id: string) => atualizar((d) => ({ ...d, medidas: d.medidas.filter((m) => m.id !== id) }));
  const medidas = [...dados.medidas].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <>
      <div className="card">
        <h3>Nova medida</h3>
        <label className="campo">Data<input id="data-medida" type="date" value={data} min={c.nascimento} max={hojeIso()} onChange={(e) => setData(e.target.value)} /></label>
        <div className="grade2">
          <label className="campo">Peso (kg)<input id="peso" inputMode="decimal" placeholder="ex.: 4,6" value={peso} onChange={(e) => setPeso(e.target.value)} /></label>
          <label className="campo">Comprimento (cm)<input id="comprimento" inputMode="decimal" placeholder="ex.: 56" value={comprimento} onChange={(e) => setComprimento(e.target.value)} /></label>
        </div>
        {pesoForaDaFaixa && <p className="alerta">Confira o peso: use quilos, com vírgula (ex.: 4,6).</p>}
        {compForaDaFaixa && <p className="alerta">Confira o comprimento: use centímetros (ex.: 56).</p>}
        <button className="btn bloco" disabled={!podeSalvar} onClick={salvar}>Salvar medida</button>
      </div>

      <div className="segmento">
        <button className={indicador === "peso" ? "ativa" : ""} onClick={() => setIndicador("peso")}>Peso</button>
        <button className={indicador === "comprimento" ? "ativa" : ""} onClick={() => setIndicador("comprimento")}>Comprimento</button>
      </div>
      <Grafico sexo={c.sexo} indicador={indicador} nascimento={c.nascimento} medidas={dados.medidas} />

      {medidas.length > 0 && (
        <div className="card">
          <h3>Medidas</h3>
          {medidas.map((m) => {
            const meses = idadeEmMesesDecimal(c.nascimento, m.data);
            const naCurva = meses >= 0 && meses <= IDADE_MAXIMA_CURVA_MESES;
            return (
              <div key={m.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                <span>
                  <b>{dataBr(m.data)}</b>{m.origem === "consulta" && <span className="chip" style={{ marginLeft: 6 }}>consulta</span>}
                  <span className="muted pequeno" style={{ display: "block" }}>
                    {m.pesoKg !== undefined && `${m.pesoKg.toLocaleString("pt-BR")} kg${naCurva ? ` (${descreverPercentil(percentil(c.sexo, "peso", meses, m.pesoKg))})` : ""}`}
                    {m.pesoKg !== undefined && m.comprimentoCm !== undefined && " · "}
                    {m.comprimentoCm !== undefined && `${m.comprimentoCm.toLocaleString("pt-BR")} cm${naCurva ? ` (${descreverPercentil(percentil(c.sexo, "comprimento", meses, m.comprimentoCm))})` : ""}`}
                  </span>
                </span>
                <button className="icone-btn" aria-label={`Apagar medida de ${dataBr(m.data)}`} onClick={() => apagar(m.id)}>✕</button>
              </div>
            );
          })}
          {modo.quem === "familia" && <p className="muted pequeno">Fora da faixa esperada não quer dizer doença: mostre a curva ao pediatra na próxima consulta.</p>}
        </div>
      )}
      <p className="fontes">Curvas: padrões de crescimento da OMS (2006), do nascimento aos 2 anos.</p>
    </>
  );
}

function Grafico({ sexo, indicador, nascimento, medidas }: { sexo: Sexo; indicador: Indicador; nascimento: string; medidas: Medida[] }) {
  const pontos = medidas
    .map((m) => ({ meses: idadeEmMesesDecimal(nascimento, m.data), valor: indicador === "peso" ? m.pesoKg : m.comprimentoCm }))
    .filter((p): p is { meses: number; valor: number } => p.valor !== undefined && p.meses >= 0 && p.meses <= IDADE_MAXIMA_CURVA_MESES)
    .sort((a, b) => a.meses - b.meses);
  // Eixo do tempo acompanha a idade da criança: mínimo de 6 meses, máximo de 24.
  const idadeHoje = idadeEmMesesDecimal(nascimento, hojeIso());
  const ultimoPonto = pontos.length ? pontos[pontos.length - 1].meses : 0;
  const xMax = Math.min(IDADE_MAXIMA_CURVA_MESES, Math.max(6, Math.ceil(Math.max(idadeHoje, ultimoPonto) + 2)));
  const linhas = LINHAS_PERCENTIL.map((l) => ({ ...l, pontos: curva(sexo, indicador, l.z, xMax) }));
  const valores = [...linhas.flatMap((l) => l.pontos.map((p) => p.valor)), ...pontos.map((p) => p.valor)];
  const passoY = indicador === "peso" ? (xMax <= 8 ? 1 : 2) : (xMax <= 8 ? 5 : 10);
  const yMin = Math.floor(Math.min(...valores) / passoY) * passoY;
  const yMax = Math.ceil(Math.max(...valores) / passoY) * passoY;
  const W = 340, H = 220, ml = 30, mr = 30, mt = 10, mb = 26;
  const x = (m: number) => ml + (m / xMax) * (W - ml - mr);
  const y = (v: number) => mt + (1 - (v - yMin) / (yMax - yMin)) * (H - mt - mb);
  const passoX = xMax <= 8 ? 1 : xMax <= 12 ? 2 : 3;
  const ticksX: number[] = [];
  for (let m = 0; m <= xMax; m += passoX) ticksX.push(m);
  const ticksY: number[] = [];
  for (let v = Math.ceil(yMin / passoY) * passoY; v <= yMax; v += passoY) ticksY.push(v);

  return (
    <div className="card grafico">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Curva de ${indicador} da OMS com as medidas da criança`}>
        {ticksY.map((v) => (
          <g key={v}>
            <line x1={ml} x2={W - mr} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="0.6" />
            <text x={ml - 4} y={y(v) + 3} fontSize="8" textAnchor="end" fill="var(--muted)">{v}</text>
          </g>
        ))}
        {ticksX.map((m) => (
          <text key={m} x={x(m)} y={H - 10} fontSize="8" textAnchor="middle" fill="var(--muted)">{m}m</text>
        ))}
        {linhas.map((l) => (
          <g key={l.rotulo}>
            <polyline
              points={l.pontos.map((p) => `${x(p.meses).toFixed(1)},${y(p.valor).toFixed(1)}`).join(" ")}
              fill="none"
              stroke={l.z === 0 ? "var(--folha)" : "var(--muted)"}
              strokeWidth={l.z === 0 ? 1.6 : 0.8}
              strokeDasharray={Math.abs(l.z) > 1.5 ? "3 3" : undefined}
            />
            <text x={W - mr + 3} y={y(l.pontos[l.pontos.length - 1].valor) + 3} fontSize="7.5" fill="var(--muted)">{l.rotulo}</text>
          </g>
        ))}
        {pontos.length > 1 && (
          <polyline points={pontos.map((p) => `${x(p.meses).toFixed(1)},${y(p.valor).toFixed(1)}`).join(" ")} fill="none" stroke="var(--luz)" strokeWidth="2" />
        )}
        {pontos.map((p, i) => <circle key={i} cx={x(p.meses)} cy={y(p.valor)} r="3.4" fill="var(--luz)" stroke="var(--card)" strokeWidth="1.2" />)}
      </svg>
      <p className="muted pequeno">
        {indicador === "peso" ? "Peso (kg)" : "Comprimento (cm)"} por idade. Linhas: percentis 3, 15, 50, 85 e 97. {pontos.length === 0 && "Registre uma medida para ver o ponto da criança."}
      </p>
    </div>
  );
}

function Diario({ dados, atualizar, modo }: { dados: Dados; atualizar: Atualizar; modo: ModoCaderneta }) {
  const hoje = hojeIso();
  const contagem = contarHoje(dados.diario, hoje);
  const registrar = (tipo: TipoRegistro) =>
    atualizar((d) => ({ ...d, diario: [{ id: novoId(), tipo, quando: new Date().toISOString() }, ...d.diario] }));
  const apagar = (id: string) => atualizar((d) => ({ ...d, diario: d.diario.filter((r) => r.id !== id) }));
  const recentes = dados.diario.slice(0, 30);

  return (
    <>
      {modo.quem === "medico" ? (
        <ResumoDiario diario={dados.diario} />
      ) : (
      <div className="card">
        <h3>Registrar agora</h3>
        <div className="grade4">
          {(Object.keys(ROTULOS_REGISTRO) as TipoRegistro[]).map((t) => (
            <button key={t} className="contador" style={{ border: 0, cursor: "pointer" }} onClick={() => registrar(t)}>
              <b>{contagem[t]}</b>
              <span>{ROTULOS_REGISTRO[t]} +</span>
            </button>
          ))}
        </div>
        <p className="muted pequeno">Números de hoje. A partir do quinto dia de vida, seis ou mais fraldas bem molhadas por dia é um bom sinal de que o bebê está mamando o suficiente.</p>
      </div>
      )}
      {recentes.length > 0 && (
        <div className="card">
          <h3>Últimos registros</h3>
          {recentes.map((r) => {
            const d = new Date(r.quando);
            return (
              <div key={r.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
                <span>{ROTULOS_REGISTRO[r.tipo]} <span className="muted pequeno">· {dataBr(hojeIso(d))} {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></span>
                {modo.quem === "familia" && <button className="icone-btn" aria-label="Apagar registro" onClick={() => apagar(r.id)}>✕</button>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/** Para o médico: média por dia nos últimos 7 dias. */
function ResumoDiario({ diario }: { diario: Registro[] }) {
  const hoje = hojeIso();
  const dias = Array.from({ length: 7 }, (_, i) => hojeIso(new Date(Date.now() - i * 86400_000)));
  const conta: Record<TipoRegistro, number> = { mamada: 0, xixi: 0, coco: 0, sono: 0 };
  let comRegistro = 0;
  for (const d of dias) {
    const c = contarHoje(diario, d);
    if (Object.values(c).some((n) => n > 0)) comRegistro++;
    for (const t of Object.keys(conta) as TipoRegistro[]) conta[t] += c[t];
  }
  return (
    <div className="card">
      <h3>Últimos 7 dias</h3>
      {comRegistro === 0 ? (
        <p className="muted">A família não registrou nada nesta semana.</p>
      ) : (
        <>
          <div className="grade4">
            {(Object.keys(ROTULOS_REGISTRO) as TipoRegistro[]).map((t) => (
              <div key={t} className="contador"><b>{(conta[t] / comRegistro).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}</b><span>{ROTULOS_REGISTRO[t]}/dia</span></div>
            ))}
          </div>
          <p className="muted pequeno">Média nos {comRegistro} {comRegistro === 1 ? "dia" : "dias"} com registro (até {dataBr(hoje)}).</p>
        </>
      )}
    </div>
  );
}
