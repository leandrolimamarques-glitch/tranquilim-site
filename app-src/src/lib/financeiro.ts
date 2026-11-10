// Financeiro do médico: consultório (convênio e particular) e plantão no mesmo lugar.
// Dinheiro sempre em centavos. Datas como AAAA-MM-DD (dia de trabalho, sem fuso).
// Os dados ficam num documento sincronizado (sinc.ts), coleções: fontes,
// lancamentos, despesas, config.

import { vivos, type Doc } from "./sinc";
import { CONFIG_FISCAL_PADRAO, estimarImpostos, type ConfigFiscal, type ImpostoMes } from "./impostos";

export type TipoFonte = "convenio" | "particular" | "plantao" | "outro";
/** pj: nota da sua empresa · pf-empresa: RPA/recibo pago por empresa (INSS 11% retido) · pf-pessoa: recibo de paciente particular. */
export type ComoRecebe = "pj" | "pf-empresa" | "pf-pessoa";
export type Pagamento =
  | { modo: "na-hora" }
  | { modo: "dias"; dias: number }
  | { modo: "ciclo"; dia: number; mesesDepois: number; cicloInicio: number; cicloFim: number };

export type Fonte = {
  id: string;
  nome: string;
  tipo: TipoFonte;
  cor: string;
  comoRecebe: ComoRecebe;
  pagamento: Pagamento;
  /** Glosa média esperada, em %. */
  glosaPct: number;
  valorConsulta: number;
  valorRetorno: number;
  valorHora: number;
  valorPlantao: number;
  ativo: boolean;
};

export type TipoLancamento = "consulta" | "retorno" | "procedimento" | "plantao" | "outro";

export type Lancamento = {
  id: string;
  fonteId: string;
  tipo: TipoLancamento;
  data: string;
  inicio?: string;
  horas?: number;
  quantidade: number;
  valorUnit: number;
  pacienteId?: string;
  descricao?: string;
  recebidoEm?: string;
  valorRecebido?: number;
  glosado?: boolean;
  serieId?: string;
};

export type Despesa = { id: string; data: string; descricao: string; categoria: string; valor: number; dedutivel: boolean };
export type Contador = { nome: string; email: string; whatsapp: string };

export type Financeiro = {
  fontes: Fonte[];
  lancamentos: Lancamento[];
  despesas: Despesa[];
  config: ConfigFiscal & { contador: Contador };
};

export const CONTADOR_VAZIO: Contador = { nome: "", email: "", whatsapp: "" };

export function lerFinanceiro(doc: Doc): Financeiro {
  const cfg = doc.config?.["_"];
  const { id: _i, em: _e, removido: _r, ...resto } = (cfg && !cfg.removido ? cfg : {}) as Record<string, unknown>;
  return {
    fontes: vivos<Fonte>(doc, "fontes").sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    lancamentos: vivos<Lancamento>(doc, "lancamentos").sort((a, b) => a.data.localeCompare(b.data) || (a.inicio ?? "").localeCompare(b.inicio ?? "")),
    despesas: vivos<Despesa>(doc, "despesas").sort((a, b) => a.data.localeCompare(b.data)),
    config: { ...CONFIG_FISCAL_PADRAO, contador: CONTADOR_VAZIO, ...(resto as Partial<Financeiro["config"]>) },
  };
}

// ---------- datas ----------

function ultimoDia(ano: number, mes: number): number {
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}

function partes(iso: string): [number, number, number] {
  const [a, m, d] = iso.split("-").map(Number);
  return [a, m, d];
}

function montar(a: number, m: number, d: number): string {
  // normaliza mês fora de 1..12
  const ano = a + Math.floor((m - 1) / 12);
  const mes = ((((m - 1) % 12) + 12) % 12) + 1;
  const dia = Math.min(d, ultimoDia(ano, mes));
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

export function somarDias(iso: string, dias: number): string {
  const [a, m, d] = partes(iso);
  const t = new Date(Date.UTC(a, m - 1, d + dias));
  return t.toISOString().slice(0, 10);
}

export function mesDe(iso: string): string {
  return iso.slice(0, 7);
}

export function somarMesesAoMes(mes: string, n: number): string {
  return montar(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)) + n, 1).slice(0, 7);
}

/** Quando o dinheiro deve entrar. */
export function dataPrevista(l: Lancamento, f: Fonte | undefined): string {
  if (!f) return l.data;
  const p = f.pagamento;
  if (p.modo === "na-hora") return l.data;
  if (p.modo === "dias") return somarDias(l.data, Math.max(0, Math.round(p.dias)));
  const [a, m, d] = partes(l.data);
  const inicio = Math.min(Math.max(1, p.cicloInicio || 1), 31);
  const fim = Math.min(Math.max(1, p.cicloFim || 31), 31);
  const cruza = inicio > fim;
  // Mês do ciclo: se o ciclo cruza o mês (21 a 20), o trabalho a partir do dia de início
  // pertence ao ciclo que fecha no mês seguinte.
  let mesCiclo = m;
  if (cruza && d >= inicio) mesCiclo = m + 1;
  return montar(a, mesCiclo + Math.max(0, p.mesesDepois), p.dia || 1);
}

export function valorBruto(l: Lancamento): number {
  return Math.round(l.valorUnit * (l.quantidade || 1));
}

/** Valor que se espera receber, já descontada a glosa média da fonte. */
export function valorEsperado(l: Lancamento, f: Fonte | undefined): number {
  if (l.glosado) return 0;
  if (l.valorRecebido !== undefined) return l.valorRecebido;
  return Math.round(valorBruto(l) * (1 - (f?.glosaPct ?? 0) / 100));
}

export type Situacao = "recebido" | "glosado" | "atrasado" | "a-receber";

export function situacao(l: Lancamento, f: Fonte | undefined, hoje: string): Situacao {
  if (l.glosado) return "glosado";
  if (l.recebidoEm) return "recebido";
  return dataPrevista(l, f) < hoje ? "atrasado" : "a-receber";
}

export const ROTULO_SITUACAO: Record<Situacao, string> = { recebido: "Recebido", glosado: "Glosado", atrasado: "Atrasado", "a-receber": "A receber" };
export const ROTULO_TIPO: Record<TipoLancamento, string> = { consulta: "Consulta", retorno: "Retorno", procedimento: "Procedimento", plantao: "Plantão", outro: "Outro" };
export const ROTULO_FONTE: Record<TipoFonte, string> = { convenio: "Convênio", particular: "Particular", plantao: "Plantão", outro: "Outro" };
export const ROTULO_RECEBE: Record<ComoRecebe, string> = { pj: "Nota da minha empresa (PJ)", "pf-empresa": "Pessoa física, pago por empresa (RPA)", "pf-pessoa": "Pessoa física, pago pelo paciente (recibo)" };

// ---------- repetição de plantão ----------

export function gerarSerie(base: Omit<Lancamento, "id" | "serieId">, repeticao: "semanal" | "quinzenal" | "mensal", vezes: number, novoId: () => string): Lancamento[] {
  const serieId = novoId();
  const n = Math.min(Math.max(1, Math.round(vezes)), 104);
  const [a, m, d] = partes(base.data);
  return Array.from({ length: n }, (_, i) => {
    const data = repeticao === "mensal" ? montar(a, m + i, d) : somarDias(base.data, i * (repeticao === "semanal" ? 7 : 14));
    return { ...base, id: novoId(), serieId, data };
  });
}

// ---------- resumos ----------

export type LinhaFonte = { fonte: Fonte; bruto: number; quantidade: number; horas: number; porHora: number | null };

export type ResumoMes = {
  mes: string;
  bruto: number;
  consultorio: number;
  plantao: number;
  consultas: number;
  horasPlantao: number;
  plantoes: number;
  glosaEstimada: number;
  porFonte: LinhaFonte[];
  recebidoNoMes: number;
  despesas: number;
  impostos: ImpostoMes;
  liquido: number;
};

const ehPlantao = (l: Lancamento, f?: Fonte) => l.tipo === "plantao" || f?.tipo === "plantao";

/** Receita PJ dos 12 meses anteriores ao mês; com menos histórico, proporcional (média × 12). */
export function receita12Meses(fin: Financeiro, mes: string): number {
  const fontes = new Map(fin.fontes.map((f) => [f.id, f]));
  const inicio = somarMesesAoMes(mes, -12);
  const pj = fin.lancamentos.filter((l) => fontes.get(l.fonteId)?.comoRecebe === "pj");
  const janela = pj.filter((l) => mesDe(l.data) >= inicio && mesDe(l.data) < mes);
  const total = janela.reduce((s, l) => s + valorBruto(l), 0);
  const primeiro = pj.length ? mesDe(pj[0].data) : mes;
  if (primeiro >= mes) {
    // Primeiro mês com movimento: projeta o próprio mês × 12.
    return pj.filter((l) => mesDe(l.data) === mes).reduce((s, l) => s + valorBruto(l), 0) * 12;
  }
  const meses = Math.min(12, mesesEntre(primeiro > inicio ? primeiro : inicio, mes));
  return meses >= 12 ? total : Math.round((total / Math.max(1, meses)) * 12);
}

function mesesEntre(de: string, ate: string): number {
  return (Number(ate.slice(0, 4)) - Number(de.slice(0, 4))) * 12 + Number(ate.slice(5, 7)) - Number(de.slice(5, 7));
}

export function resumoMes(fin: Financeiro, mes: string, hoje: string): ResumoMes {
  const fontes = new Map(fin.fontes.map((f) => [f.id, f]));
  const doMes = fin.lancamentos.filter((l) => mesDe(l.data) === mes);
  let bruto = 0, consultorio = 0, plantao = 0, consultas = 0, horasPlantao = 0, plantoes = 0, glosaEstimada = 0;
  const porFonte = new Map<string, LinhaFonte>();
  let receitaPj = 0;
  for (const l of doMes) {
    const f = fontes.get(l.fonteId);
    const v = valorBruto(l);
    bruto += v;
    glosaEstimada += v - valorEsperado(l, f);
    if (ehPlantao(l, f)) {
      plantao += v;
      plantoes += l.quantidade || 1;
      horasPlantao += (l.horas ?? 0) * (l.quantidade || 1);
    } else {
      consultorio += v;
      if (l.tipo === "consulta" || l.tipo === "retorno") consultas += l.quantidade || 1;
    }
    if (f?.comoRecebe === "pj") receitaPj += v;
    if (f) {
      const lf = porFonte.get(f.id) ?? { fonte: f, bruto: 0, quantidade: 0, horas: 0, porHora: null };
      lf.bruto += v;
      lf.quantidade += l.quantidade || 1;
      lf.horas += (l.horas ?? 0) * (l.quantidade || 1);
      porFonte.set(f.id, lf);
    }
  }
  for (const lf of porFonte.values()) lf.porHora = lf.horas > 0 ? Math.round(lf.bruto / lf.horas) : null;

  // Pessoa física: regime de caixa (o que entra no mês, recebido ou previsto).
  let receitaPf = 0, pfRetidoEmpresa = 0, recebidoNoMes = 0;
  for (const l of fin.lancamentos) {
    const f = fontes.get(l.fonteId);
    const entrada = l.recebidoEm ?? dataPrevista(l, f);
    if (l.recebidoEm && mesDe(l.recebidoEm) === mes) recebidoNoMes += valorEsperado(l, f);
    if (mesDe(entrada) !== mes || !f || f.comoRecebe === "pj") continue;
    const v = valorEsperado(l, f);
    receitaPf += v;
    if (f.comoRecebe === "pf-empresa") pfRetidoEmpresa += v;
  }
  const despesasMes = fin.despesas.filter((d) => mesDe(d.data) === mes);
  const despesas = despesasMes.reduce((s, d) => s + d.valor, 0);
  const despesasDedutiveis = despesasMes.filter((d) => d.dedutivel).reduce((s, d) => s + d.valor, 0);
  const impostos = estimarImpostos(fin.config, { receitaPj, receitaPf, pfRetidoEmpresa, despesasDedutiveis, rbt12: receita12Meses(fin, mes) });
  void hoje;
  return {
    mes,
    bruto,
    consultorio,
    plantao,
    consultas,
    horasPlantao,
    plantoes,
    glosaEstimada,
    porFonte: [...porFonte.values()].sort((a, b) => b.bruto - a.bruto),
    recebidoNoMes,
    despesas,
    impostos,
    liquido: bruto - glosaEstimada - impostos.total - despesas,
  };
}

export type ItemReceber = { lancamento: Lancamento; fonte: Fonte | undefined; previsto: string; valor: number; situacao: Situacao };

/** O que ainda não entrou: atrasados e os próximos meses, por data prevista. */
export function aReceber(fin: Financeiro, hoje: string, meses = 3): { atrasados: ItemReceber[]; porMes: { mes: string; total: number; itens: ItemReceber[] }[] } {
  const fontes = new Map(fin.fontes.map((f) => [f.id, f]));
  const limite = somarMesesAoMes(mesDe(hoje), meses);
  const itens: ItemReceber[] = fin.lancamentos
    .filter((l) => !l.recebidoEm && !l.glosado)
    .map((l) => {
      const f = fontes.get(l.fonteId);
      return { lancamento: l, fonte: f, previsto: dataPrevista(l, f), valor: valorEsperado(l, f), situacao: situacao(l, f, hoje) };
    })
    .sort((a, b) => a.previsto.localeCompare(b.previsto));
  const atrasados = itens.filter((i) => i.situacao === "atrasado");
  const futuros = itens.filter((i) => i.situacao === "a-receber" && mesDe(i.previsto) < limite);
  const porMes = new Map<string, { mes: string; total: number; itens: ItemReceber[] }>();
  for (const i of futuros) {
    const m = mesDe(i.previsto);
    const g = porMes.get(m) ?? { mes: m, total: 0, itens: [] };
    g.total += i.valor;
    g.itens.push(i);
    porMes.set(m, g);
  }
  return { atrasados, porMes: [...porMes.values()] };
}

// ---------- planilha para o contador ----------

const reais = (c: number) => (c / 100).toFixed(2).replace(".", ",");
const dataBr = (iso?: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "");
const celula = (s: string) => (/[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/** CSV com ponto e vírgula e vírgula decimal, como o Excel em português abre direto. */
export function csvDoMes(fin: Financeiro, mes: string, hoje: string): string {
  const fontes = new Map(fin.fontes.map((f) => [f.id, f]));
  const linhas: string[][] = [["Data", "Tipo", "Fonte", "Como recebe", "Quantidade", "Valor unitário", "Bruto", "Previsto para", "Recebido em", "Valor recebido", "Situação", "Descrição"]];
  for (const l of fin.lancamentos.filter((x) => mesDe(x.data) === mes)) {
    const f = fontes.get(l.fonteId);
    linhas.push([
      dataBr(l.data),
      ROTULO_TIPO[l.tipo],
      f?.nome ?? "",
      f ? ROTULO_RECEBE[f.comoRecebe] : "",
      String(l.quantidade || 1),
      reais(l.valorUnit),
      reais(valorBruto(l)),
      dataBr(dataPrevista(l, f)),
      dataBr(l.recebidoEm),
      l.valorRecebido !== undefined ? reais(l.valorRecebido) : "",
      ROTULO_SITUACAO[situacao(l, f, hoje)],
      l.descricao ?? "",
    ]);
  }
  const despesas = fin.despesas.filter((d) => mesDe(d.data) === mes);
  if (despesas.length) {
    linhas.push([], ["Despesas"], ["Data", "Categoria", "Descrição", "Valor", "Dedutível (livro-caixa)"]);
    for (const d of despesas) linhas.push([dataBr(d.data), d.categoria, d.descricao, reais(d.valor), d.dedutivel ? "sim" : "não"]);
  }
  const r = resumoMes(fin, mes, hoje);
  linhas.push(
    [],
    ["Resumo do mês"],
    ["Produzido (bruto)", reais(r.bruto)],
    ["Consultório", reais(r.consultorio)],
    ["Plantão", reais(r.plantao)],
    ["Glosa estimada", reais(r.glosaEstimada)],
    ["Recebido no mês", reais(r.recebidoNoMes)],
    ["Despesas", reais(r.despesas)],
    ["Impostos estimados", reais(r.impostos.total)],
    ["Líquido estimado", reais(r.liquido)],
    ["Estimativa gerada pelo Tranquilim; a apuração oficial é do contador."],
  );
  return "﻿" + linhas.map((l) => l.map(celula).join(";")).join("\r\n");
}
