import { useMemo, useState, type ChangeEvent } from "react";
import { RespostasRapidas } from "./RespostasRapidas";
import { api } from "../../lib/api";
import { telefoneBr } from "../../lib/convite";
import { centavosParaTexto, paraCentavos, reais } from "../../lib/dinheiro";
import { CONTADOR_VAZIO, lerFinanceiro, ROTULO_FONTE, ROTULO_RECEBE, type ComoRecebe, type Fonte, type Pagamento, type TipoFonte } from "../../lib/financeiro";
import type { ConfigFiscal, Regime } from "../../lib/impostos";
import { gravar } from "../../lib/sinc";
import { novoId } from "../../lib/store";
import type { ContaInfo } from "../../lib/store";
import type { useDocRemoto } from "../../lib/useDocRemoto";

type DocRemoto = ReturnType<typeof useDocRemoto>;
const CORES = ["#4F8A6E", "#1E2A47", "#F2A93B", "#C0392B", "#6C5CE7", "#00897B", "#8D6E63", "#5D6378"];

export function Configuracoes({ conta, recarregar, financeiro }: { conta: ContaInfo; recarregar: () => Promise<void>; financeiro: DocRemoto }) {
  const [tela, setTela] = useState<"menu" | "perfil" | "fonte" | "impostos" | "respostas">("menu");
  const [fonteEditada, setFonteEditada] = useState<Fonte | null>(null);
  const fin = useMemo(() => lerFinanceiro(financeiro.doc), [financeiro.doc]);
  const voltar = () => { setTela("menu"); window.scrollTo(0, 0); };

  if (tela === "perfil") return <Perfil conta={conta} recarregar={recarregar} voltar={voltar} />;
  if (tela === "fonte") return <FormFonte inicial={fonteEditada} financeiro={financeiro} voltar={voltar} />;
  if (tela === "respostas") return <RespostasRapidas voltar={voltar} />;
  if (tela === "impostos") return <Impostos config={fin.config} financeiro={financeiro} voltar={voltar} />;

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Perfil e pagamentos</h1>
      <div className="card">
        <h3>{conta.nome}</h3>
        <p className="muted">{[conta.titulo, conta.registro].filter(Boolean).join(" · ")}</p>
        <p className="muted pequeno">{conta.email}</p>
        <button className="btn sec bloco" onClick={() => setTela("perfil")}>Editar perfil</button>
      </div>
      <div className="card" style={{ borderColor: "var(--luz)", borderWidth: 2 }}>
        <h3>Resposta rápida para as famílias</h3>
        <p className="muted pequeno">Febre, tosse, vômito, queda, manchas: escreva o que você orienta fazer em casa. A família vê na hora, depois dos sinais de perigo, e a IA responde com base nisso.</p>
        <button className="btn bloco" onClick={() => setTela("respostas")}>Escrever respostas</button>
      </div>
      <div className="card">
        <h3>Quem paga você</h3>
        <p className="muted pequeno">Convênios, particular e locais de plantão. Cada um com valor, prazo de pagamento e glosa média.</p>
        {fin.fontes.map((f) => (
          <button key={f.id} className="item-lista" style={{ borderTop: "1px solid var(--line)", opacity: f.ativo ? 1 : 0.5 }} onClick={() => { setFonteEditada(f); setTela("fonte"); }}>
            <i aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 6, background: f.cor, flex: "0 0 auto" }} />
            <span style={{ flex: 1 }}>
              <b style={{ display: "block", fontWeight: 600 }}>{f.nome}</b>
              <span className="muted pequeno">{ROTULO_FONTE[f.tipo]} · {f.tipo === "plantao" ? (f.valorPlantao ? `${reais(f.valorPlantao)} o plantão` : `${reais(f.valorHora)}/h`) : `${reais(f.valorConsulta)} a consulta`}</span>
            </span>
          </button>
        ))}
        <button className="btn bloco" onClick={() => { setFonteEditada(null); setTela("fonte"); }}>+ Adicionar</button>
      </div>
      <div className="card">
        <h3>Impostos e contador</h3>
        <p className="muted pequeno">{{ simples: "Simples Nacional", presumido: "Lucro presumido", pf: "Pessoa física (carnê-leão)", manual: `Alíquota própria (${fin.config.aliquotaManual}%)` }[fin.config.regime]}{fin.config.contador.nome ? ` · contador: ${fin.config.contador.nome}` : ""}</p>
        <button className="btn sec bloco" onClick={() => setTela("impostos")}>Configurar</button>
      </div>
    </>
  );
}

function Perfil({ conta, recarregar, voltar }: { conta: ContaInfo; recarregar: () => Promise<void>; voltar: () => void }) {
  const [p, setP] = useState({ nome: conta.nome, registro: conta.registro ?? "", titulo: conta.titulo ?? "", whatsapp: conta.whatsapp ?? "", telefone: conta.telefone ?? "", local: conta.local ?? "" });
  const [erro, setErro] = useState("");
  const campo = (k: keyof typeof p) => ({ value: p[k], onChange: (e: ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: e.target.value }) });
  const ok = (t: string) => !t.trim() || !!telefoneBr(t);
  const salvar = async () => {
    try {
      await api.put("/api/conta/perfil", p);
      await recarregar();
      voltar();
    } catch (e) {
      setErro((e as Error).message);
    }
  };
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Ajustes</button>
      <h1 style={{ fontSize: 26 }}>Perfil</h1>
      <p className="muted">É assim que as famílias veem você no convite e no app.</p>
      <div className="card">
        <label className="campo">Nome<input {...campo("nome")} /></label>
        <label className="campo">Registro<input {...campo("registro")} /></label>
        <label className="campo">Título<input {...campo("titulo")} placeholder="Pediatra" /><span className="muted pequeno" style={{ fontWeight: 500 }}>Especialidade só com RQE registrado (regra do CFM).</span></label>
        <label className="campo">WhatsApp do consultório<input {...campo("whatsapp")} inputMode="tel" />{!ok(p.whatsapp) && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}</label>
        <label className="campo">Telefone para ligar<input {...campo("telefone")} inputMode="tel" />{!ok(p.telefone) && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}</label>
        <label className="campo">Endereço ou horário<input {...campo("local")} /></label>
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" disabled={!ok(p.whatsapp) || !ok(p.telefone)} onClick={salvar}>Salvar</button>
      </div>
    </>
  );
}

function FormFonte({ inicial, financeiro, voltar }: { inicial: Fonte | null; financeiro: DocRemoto; voltar: () => void }) {
  const [tipo, setTipo] = useState<TipoFonte>(inicial?.tipo ?? "convenio");
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [cor, setCor] = useState(inicial?.cor ?? CORES[0]);
  const [comoRecebe, setComoRecebe] = useState<ComoRecebe>(inicial?.comoRecebe ?? "pj");
  const [consulta, setConsulta] = useState(centavosParaTexto(inicial?.valorConsulta ?? 0));
  const [retorno, setRetorno] = useState(centavosParaTexto(inicial?.valorRetorno ?? 0));
  const [plantao, setPlantao] = useState(centavosParaTexto(inicial?.valorPlantao ?? 0));
  const [hora, setHora] = useState(centavosParaTexto(inicial?.valorHora ?? 0));
  const [glosa, setGlosa] = useState(String(inicial?.glosaPct ?? 0));
  const [modo, setModo] = useState<Pagamento["modo"]>(inicial?.pagamento.modo ?? (tipo === "particular" ? "na-hora" : "dias"));
  const pg = inicial?.pagamento;
  const [dias, setDias] = useState(String(pg?.modo === "dias" ? pg.dias : 30));
  const [dia, setDia] = useState(String(pg?.modo === "ciclo" ? pg.dia : 10));
  const [mesesDepois, setMesesDepois] = useState(String(pg?.modo === "ciclo" ? pg.mesesDepois : 1));
  const [cicloInicio, setCicloInicio] = useState(String(pg?.modo === "ciclo" ? pg.cicloInicio : 1));
  const [cicloFim, setCicloFim] = useState(String(pg?.modo === "ciclo" ? pg.cicloFim : 31));
  const [ativo, setAtivo] = useState(inicial?.ativo ?? true);

  const escolherTipo = (t: TipoFonte) => {
    setTipo(t);
    if (!inicial) {
      setModo(t === "particular" ? "na-hora" : t === "plantao" ? "ciclo" : "dias");
      setComoRecebe(t === "particular" ? "pf-pessoa" : t === "plantao" ? "pf-empresa" : "pj");
    }
  };
  const n = (s: string, padrao: number) => (Number.isFinite(Number(s)) && s.trim() !== "" ? Number(s) : padrao);
  const salvar = () => {
    const pagamento: Pagamento = modo === "na-hora" ? { modo } : modo === "dias" ? { modo, dias: n(dias, 30) } : { modo, dia: n(dia, 10), mesesDepois: n(mesesDepois, 1), cicloInicio: n(cicloInicio, 1), cicloFim: n(cicloFim, 31) };
    const f: Fonte = {
      id: inicial?.id ?? novoId(),
      nome: nome.trim(),
      tipo,
      cor,
      comoRecebe,
      pagamento,
      glosaPct: Math.min(100, Math.max(0, n(glosa.replace(",", "."), 0))),
      valorConsulta: paraCentavos(consulta) ?? 0,
      valorRetorno: paraCentavos(retorno) ?? 0,
      valorPlantao: paraCentavos(plantao) ?? 0,
      valorHora: paraCentavos(hora) ?? 0,
      ativo,
    };
    financeiro.mudar((d) => gravar(d, "fontes", f));
    voltar();
  };

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Ajustes</button>
      <h1 style={{ fontSize: 26 }}>{inicial ? inicial.nome : "Quem paga"}</h1>
      <div className="card">
        <div className="segmento">
          {(["convenio", "particular", "plantao", "outro"] as TipoFonte[]).map((t) => (
            <button key={t} type="button" className={tipo === t ? "ativa" : ""} onClick={() => escolherTipo(t)} style={{ fontSize: 13 }}>{ROTULO_FONTE[t]}</button>
          ))}
        </div>
        <label className="campo">Nome<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={tipo === "plantao" ? "ex.: PS do Hospital X" : tipo === "particular" ? "Particular" : "ex.: Convênio Y"} /></label>
        <div className="campo">Cor
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CORES.map((c) => <button key={c} type="button" aria-label={`Cor ${c}`} onClick={() => setCor(c)} style={{ width: 44, height: 44, borderRadius: 22, background: c, border: cor === c ? "3px solid var(--ink)" : "1px solid var(--line)", cursor: "pointer" }} />)}
          </div>
        </div>
        {tipo === "plantao" ? (
          <div className="grade2">
            <label className="campo">Valor do plantão (R$)<input inputMode="decimal" value={plantao} onChange={(e) => setPlantao(e.target.value)} placeholder="0,00" /></label>
            <label className="campo">ou por hora (R$)<input inputMode="decimal" value={hora} onChange={(e) => setHora(e.target.value)} placeholder="0,00" /></label>
          </div>
        ) : (
          <div className="grade2">
            <label className="campo">Consulta (R$)<input inputMode="decimal" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="0,00" /></label>
            <label className="campo">Retorno (R$)<input inputMode="decimal" value={retorno} onChange={(e) => setRetorno(e.target.value)} placeholder="0,00" /></label>
          </div>
        )}
        <label className="campo">Como você recebe
          <select value={comoRecebe} onChange={(e) => setComoRecebe(e.target.value as ComoRecebe)}>
            {(Object.keys(ROTULO_RECEBE) as ComoRecebe[]).map((k) => <option key={k} value={k}>{ROTULO_RECEBE[k]}</option>)}
          </select>
        </label>
      </div>

      <div className="card">
        <h3>Quando paga</h3>
        <div className="segmento">
          <button type="button" className={modo === "na-hora" ? "ativa" : ""} onClick={() => setModo("na-hora")} style={{ fontSize: 13 }}>Na hora</button>
          <button type="button" className={modo === "dias" ? "ativa" : ""} onClick={() => setModo("dias")} style={{ fontSize: 13 }}>Em X dias</button>
          <button type="button" className={modo === "ciclo" ? "ativa" : ""} onClick={() => setModo("ciclo")} style={{ fontSize: 13 }}>Dia fixo</button>
        </div>
        {modo === "dias" && <label className="campo">Dias depois do atendimento<input inputMode="numeric" value={dias} onChange={(e) => setDias(e.target.value)} /></label>}
        {modo === "ciclo" && (
          <>
            <div className="grade2">
              <label className="campo">Paga no dia<input inputMode="numeric" value={dia} onChange={(e) => setDia(e.target.value)} /></label>
              <label className="campo">Meses depois<input inputMode="numeric" value={mesesDepois} onChange={(e) => setMesesDepois(e.target.value)} /></label>
            </div>
            <div className="grade2">
              <label className="campo">Fechamento: do dia<input inputMode="numeric" value={cicloInicio} onChange={(e) => setCicloInicio(e.target.value)} /></label>
              <label className="campo">até o dia<input inputMode="numeric" value={cicloFim} onChange={(e) => setCicloFim(e.target.value)} /></label>
            </div>
            <p className="muted pequeno">Ex.: produção de 21 a 20, paga dia 10 do mês seguinte → fechamento 21 a 20, dia 10, 1 mês depois.</p>
          </>
        )}
        {tipo !== "particular" && <label className="campo">Glosa média (%)<input inputMode="decimal" value={glosa} onChange={(e) => setGlosa(e.target.value)} /></label>}
      </div>
      {inicial && (
        <label className="sinal" style={{ borderWidth: 1 }}>
          <input type="checkbox" checked={!ativo} onChange={(e) => setAtivo(!e.target.checked)} />
          <span>Não atendo mais (some das opções, o histórico fica)</span>
        </label>
      )}
      <button className="btn bloco" disabled={nome.trim().length < 2} onClick={salvar}>Salvar</button>
    </>
  );
}

function Impostos({ config, financeiro, voltar }: { config: ConfigFiscal & { contador: typeof CONTADOR_VAZIO }; financeiro: DocRemoto; voltar: () => void }) {
  const [c, setC] = useState(config);
  const [proLabore, setProLabore] = useState(centavosParaTexto(config.proLaboreMensal));
  const [rbt12, setRbt12] = useState(centavosParaTexto(config.rbt12Manual));
  const salvar = () => {
    financeiro.mudar((d) => gravar(d, "config", { id: "_", ...c, proLaboreMensal: paraCentavos(proLabore) ?? 0, rbt12Manual: paraCentavos(rbt12) ?? 0 }));
    voltar();
  };
  const regimes: { id: Regime; rotulo: string }[] = [
    { id: "simples", rotulo: "Simples Nacional" },
    { id: "presumido", rotulo: "Lucro presumido" },
    { id: "pf", rotulo: "Sem empresa (pessoa física)" },
    { id: "manual", rotulo: "Sei minha alíquota" },
  ];
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Ajustes</button>
      <h1 style={{ fontSize: 26 }}>Impostos e contador</h1>
      <div className="card">
        <h3>Sua empresa</h3>
        {regimes.map((r) => (
          <label key={r.id} className="sinal" style={{ borderWidth: 1 }}>
            <input type="radio" name="regime" checked={c.regime === r.id} onChange={() => setC({ ...c, regime: r.id })} />
            <span>{r.rotulo}</span>
          </label>
        ))}
        {c.regime === "simples" && (
          <>
            <label className="campo">Anexo
              <select value={c.anexo} onChange={(e) => setC({ ...c, anexo: e.target.value as ConfigFiscal["anexo"] })}>
                <option value="auto">Calcular pelo fator R (pró-labore)</option>
                <option value="III">Anexo III</option>
                <option value="V">Anexo V</option>
              </select>
            </label>
            {c.anexo === "auto" && <label className="campo">Pró-labore mensal (R$)<input inputMode="decimal" value={proLabore} onChange={(e) => setProLabore(e.target.value)} /><span className="muted pequeno" style={{ fontWeight: 500 }}>Com pró-labore de pelo menos 28% do faturamento, medicina vai ao Anexo III (a partir de 6%).</span></label>}
            <label className="campo">Faturamento dos últimos 12 meses (R$, opcional)<input inputMode="decimal" value={rbt12} onChange={(e) => setRbt12(e.target.value)} placeholder="calcular pelos lançamentos" /></label>
          </>
        )}
        {c.regime === "presumido" && <label className="campo">ISS do município (%)<input inputMode="decimal" value={String(c.issPct)} onChange={(e) => setC({ ...c, issPct: Number(e.target.value.replace(",", ".")) || 0 })} /></label>}
        {c.regime === "manual" && <label className="campo">Alíquota total (%)<input inputMode="decimal" value={String(c.aliquotaManual)} onChange={(e) => setC({ ...c, aliquotaManual: Number(e.target.value.replace(",", ".")) || 0 })} /></label>}
        <p className="muted pequeno">O que entra como pessoa física (RPA de plantão, recibo de particular) é estimado com INSS e a tabela do IR de 2026, com a isenção até R$ 5 mil.</p>
      </div>
      <div className="card">
        <h3>Contador</h3>
        <label className="campo">Nome<input value={c.contador.nome} onChange={(e) => setC({ ...c, contador: { ...c.contador, nome: e.target.value } })} /></label>
        <label className="campo">WhatsApp<input inputMode="tel" value={c.contador.whatsapp} onChange={(e) => setC({ ...c, contador: { ...c.contador, whatsapp: e.target.value } })} /></label>
        <label className="campo">E-mail<input type="email" value={c.contador.email} onChange={(e) => setC({ ...c, contador: { ...c.contador, email: e.target.value } })} /></label>
      </div>
      <button className="btn bloco" onClick={salvar}>Salvar</button>
    </>
  );
}
