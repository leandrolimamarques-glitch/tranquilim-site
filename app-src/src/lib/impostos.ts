// Estimativa de impostos do médico. É estimativa para planejar o mês e conversar
// com o contador, não apuração. Valores em centavos.
//
// Fontes (conferidas em 11/2026):
// - Simples Nacional: LC 123/2006, Anexos III e V (redação da LC 155/2016);
//   medicina vai ao Anexo III com fator R ≥ 28% (art. 18, §5º-J e §5º-M).
// - Lucro presumido, serviços médicos: presunção de 32% para IRPJ e CSLL
//   (Lei 9.249/1995, art. 15 e 20); IRPJ 15% + adicional de 10% sobre o lucro
//   presumido acima de R$ 20.000/mês; CSLL 9%; PIS 0,65%; COFINS 3%; ISS municipal.
// - Pessoa física: tabela progressiva mensal da Lei 15.191/2025 com a redução da
//   Lei 15.270/2025 (zera o imposto até R$ 5.000 e diminui até R$ 7.350).
// - INSS 2026: teto R$ 8.475,55 (Portaria Interministerial MPS/MF nº 13/2026);
//   contribuinte individual 20% (11% quando presta serviço a empresa, retido por ela).

export type Regime = "simples" | "presumido" | "pf" | "manual";

type Faixa = { ate: number; aliquota: number; deduzir: number };

const ANEXO_III: Faixa[] = [
  { ate: 180_000_00, aliquota: 0.06, deduzir: 0 },
  { ate: 360_000_00, aliquota: 0.112, deduzir: 9_360_00 },
  { ate: 720_000_00, aliquota: 0.135, deduzir: 17_640_00 },
  { ate: 1_800_000_00, aliquota: 0.16, deduzir: 35_640_00 },
  { ate: 3_600_000_00, aliquota: 0.21, deduzir: 125_640_00 },
  { ate: 4_800_000_00, aliquota: 0.33, deduzir: 648_000_00 },
];

const ANEXO_V: Faixa[] = [
  { ate: 180_000_00, aliquota: 0.155, deduzir: 0 },
  { ate: 360_000_00, aliquota: 0.18, deduzir: 4_500_00 },
  { ate: 720_000_00, aliquota: 0.195, deduzir: 9_900_00 },
  { ate: 1_800_000_00, aliquota: 0.205, deduzir: 17_100_00 },
  { ate: 3_600_000_00, aliquota: 0.23, deduzir: 62_100_00 },
  { ate: 4_800_000_00, aliquota: 0.305, deduzir: 540_000_00 },
];

/** Alíquota efetiva do Simples: (RBT12 × nominal − parcela a deduzir) ÷ RBT12. */
export function aliquotaSimples(rbt12: number, anexo: "III" | "V"): number {
  const tabela = anexo === "III" ? ANEXO_III : ANEXO_V;
  if (rbt12 <= 0) return tabela[0].aliquota;
  const f = tabela.find((x) => rbt12 <= x.ate) ?? tabela[tabela.length - 1];
  return Math.max(0, (rbt12 * f.aliquota - f.deduzir) / rbt12);
}

/** Fator R = folha dos últimos 12 meses (pró-labore + encargos) ÷ receita dos últimos 12 meses. */
export function anexoPeloFatorR(folha12: number, rbt12: number): "III" | "V" {
  if (rbt12 <= 0) return folha12 > 0 ? "III" : "V";
  return folha12 / rbt12 >= 0.28 ? "III" : "V";
}

export function impostoPresumido(receitaMes: number, issPct: number): { total: number; partes: Record<string, number> } {
  const lucro = receitaMes * 0.32;
  const partes = {
    IRPJ: lucro * 0.15 + Math.max(0, lucro - 20_000_00) * 0.1,
    CSLL: lucro * 0.09,
    PIS: receitaMes * 0.0065,
    COFINS: receitaMes * 0.03,
    ISS: receitaMes * (issPct / 100),
  };
  const r = Object.fromEntries(Object.entries(partes).map(([k, v]) => [k, Math.round(v)]));
  return { total: Object.values(r).reduce((a, b) => a + b, 0), partes: r };
}

export const TETO_INSS_2026 = 8_475_55;

const IRPF_MENSAL: Faixa[] = [
  { ate: 2_428_80, aliquota: 0, deduzir: 0 },
  { ate: 2_826_65, aliquota: 0.075, deduzir: 182_16 },
  { ate: 3_751_05, aliquota: 0.15, deduzir: 394_16 },
  { ate: 4_664_68, aliquota: 0.225, deduzir: 675_49 },
  { ate: Infinity, aliquota: 0.275, deduzir: 908_73 },
];

export const DESCONTO_SIMPLIFICADO_MENSAL = 607_20;

/**
 * IRPF mensal (carnê-leão ou retenção) com a redução de 2026.
 * A faixa da redução usa o rendimento tributável; a base desconta o maior entre as
 * deduções informadas (INSS, livro-caixa) e o desconto simplificado mensal.
 */
export function irpfMensal(rendimento: number, deducoes = 0): number {
  if (rendimento <= 0) return 0;
  const base = Math.max(0, rendimento - Math.max(deducoes, DESCONTO_SIMPLIFICADO_MENSAL));
  const f = IRPF_MENSAL.find((x) => base <= x.ate)!;
  const tabela = Math.max(0, base * f.aliquota - f.deduzir);
  let reducao = 0;
  if (rendimento <= 5_000_00) reducao = 312_89;
  else if (rendimento <= 7_350_00) reducao = Math.max(0, 978_62 - 0.133145 * rendimento);
  return Math.round(Math.max(0, tabela - reducao));
}

/** INSS de contribuinte individual: 20% (ou 11% retido por empresa), limitado ao teto. */
export function inssIndividual(remuneracao: number, aliquota: 0.2 | 0.11): number {
  return Math.round(Math.min(Math.max(0, remuneracao), TETO_INSS_2026) * aliquota);
}

export type ConfigFiscal = {
  regime: Regime;
  /** Simples: anexo escolhido, ou "auto" pelo fator R. */
  anexo: "auto" | "III" | "V";
  proLaboreMensal: number;
  rbt12Manual: number;
  issPct: number;
  aliquotaManual: number;
};

export const CONFIG_FISCAL_PADRAO: ConfigFiscal = { regime: "simples", anexo: "auto", proLaboreMensal: 0, rbt12Manual: 0, issPct: 2, aliquotaManual: 0 };

export type ImpostoMes = {
  /** Imposto da empresa sobre o que entrou como PJ. */
  pj: number;
  /** IR + INSS sobre o que entrou como pessoa física. */
  pf: number;
  total: number;
  detalhe: string[];
};

/**
 * Estima os impostos de um mês.
 * - receitaPj: o que a empresa faturou no mês (nota fiscal).
 * - receitaPf: o que entrou na pessoa física (RPA de plantão, recibo de particular).
 * - pfRetidoEmpresa: parte da receitaPf paga por empresa (RPA): INSS de 11% retido.
 * - despesasDedutiveis: livro-caixa do consultório, abate a base do carnê-leão.
 * - rbt12: receita PJ dos últimos 12 meses (para o Simples).
 */
export function estimarImpostos(
  cfg: ConfigFiscal,
  m: { receitaPj: number; receitaPf: number; pfRetidoEmpresa: number; despesasDedutiveis: number; rbt12: number },
): ImpostoMes {
  const detalhe: string[] = [];
  let pj = 0;
  const pct = (x: number) => `${(x * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
  if (m.receitaPj > 0) {
    if (cfg.regime === "simples") {
      const rbt12 = cfg.rbt12Manual > 0 ? cfg.rbt12Manual : m.rbt12;
      const anexo = cfg.anexo === "auto" ? anexoPeloFatorR(cfg.proLaboreMensal * 12, rbt12) : cfg.anexo;
      const aliq = aliquotaSimples(rbt12, anexo);
      pj = Math.round(m.receitaPj * aliq);
      detalhe.push(`Simples, Anexo ${anexo}: alíquota efetiva ${pct(aliq)}`);
    } else if (cfg.regime === "presumido") {
      const p = impostoPresumido(m.receitaPj, cfg.issPct);
      pj = p.total;
      detalhe.push(`Lucro presumido: ${pct(p.total / m.receitaPj)} (IRPJ, CSLL, PIS, COFINS e ISS ${cfg.issPct}%)`);
    } else if (cfg.regime === "manual") {
      pj = Math.round(m.receitaPj * (cfg.aliquotaManual / 100));
      detalhe.push(`Alíquota informada: ${cfg.aliquotaManual}%`);
    } else {
      // Sem empresa: o que veio como "PJ" é tratado como pessoa física.
    }
  }
  const basePf = cfg.regime === "pf" ? m.receitaPf + m.receitaPj : m.receitaPf;
  let pf = 0;
  if (basePf > 0) {
    const retido = Math.min(m.pfRetidoEmpresa, basePf);
    const inssEmpresa = inssIndividual(retido, 0.11);
    const restante = Math.max(0, Math.min(basePf - retido, TETO_INSS_2026 - Math.min(retido, TETO_INSS_2026)));
    const inssProprio = inssIndividual(restante, 0.2);
    const inss = inssEmpresa + inssProprio;
    const ir = irpfMensal(basePf, inss + m.despesasDedutiveis);
    pf = inss + ir;
    detalhe.push(`Pessoa física: INSS estimado e IR pela tabela mensal de 2026 com a redução da Lei 15.270`);
  }
  return { pj, pf, total: pj + pf, detalhe };
}
