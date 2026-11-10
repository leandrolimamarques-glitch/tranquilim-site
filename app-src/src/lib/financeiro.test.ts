import { describe, expect, it } from "vitest";
import { aliquotaSimples, anexoPeloFatorR, CONFIG_FISCAL_PADRAO, estimarImpostos, impostoPresumido, inssIndividual, irpfMensal } from "./impostos";
import { aReceber, csvDoMes, dataPrevista, gerarSerie, lerFinanceiro, receita12Meses, resumoMes, situacao, type Fonte, type Lancamento } from "./financeiro";
import { gravar, type Doc } from "./sinc";

describe("impostos", () => {
  it("Simples: alíquota efetiva pelos Anexos III e V", () => {
    expect(aliquotaSimples(120_000_00, "III")).toBeCloseTo(0.06, 6);
    expect(aliquotaSimples(300_000_00, "III")).toBeCloseTo((300_000 * 0.112 - 9_360) / 300_000, 6);
    expect(aliquotaSimples(120_000_00, "V")).toBeCloseTo(0.155, 6);
    expect(anexoPeloFatorR(28_000_00, 100_000_00)).toBe("III");
    expect(anexoPeloFatorR(27_000_00, 100_000_00)).toBe("V");
  });
  it("Lucro presumido de serviço médico: 11,33% + ISS abaixo do adicional", () => {
    const r = impostoPresumido(30_000_00, 2);
    expect(r.total).toBe(Math.round(30_000_00 * (0.1133 + 0.02)));
    // Acima de R$ 62.500/mês o lucro presumido passa de R$ 20 mil e entra o adicional de 10%.
    expect(impostoPresumido(100_000_00, 0).partes.IRPJ).toBe(Math.round(32_000_00 * 0.15 + 12_000_00 * 0.1));
  });
  it("IRPF 2026: zera até R$ 5.000, reduz até R$ 7.350 (exemplo da Receita: redução de R$ 179,75 em R$ 6.000)", () => {
    expect(irpfMensal(5_000_00)).toBe(0);
    expect(irpfMensal(3_000_00)).toBe(0);
    const semReducao6000 = Math.round((6_000_00 - 607_20) * 0.275 - 908_73);
    expect(irpfMensal(6_000_00)).toBe(semReducao6000 - 179_75);
    expect(irpfMensal(10_000_00, 2_000_00)).toBe(Math.round(8_000_00 * 0.275 - 908_73));
  });
  it("INSS limitado ao teto de 2026", () => {
    expect(inssIndividual(5_000_00, 0.2)).toBe(1_000_00);
    expect(inssIndividual(20_000_00, 0.2)).toBe(Math.round(8_475_55 * 0.2));
  });
  it("estimativa junta empresa e pessoa física", () => {
    const r = estimarImpostos({ ...CONFIG_FISCAL_PADRAO, regime: "simples", anexo: "III" }, { receitaPj: 20_000_00, receitaPf: 0, pfRetidoEmpresa: 0, despesasDedutiveis: 0, rbt12: 240_000_00 });
    expect(r.pj).toBe(Math.round(20_000_00 * aliquotaSimples(240_000_00, "III")));
    expect(r.pf).toBe(0);
  });
});

const CONVENIO: Fonte = { id: "c", nome: "Convênio A", tipo: "convenio", cor: "#4F8A6E", comoRecebe: "pj", pagamento: { modo: "dias", dias: 45 }, glosaPct: 5, valorConsulta: 150_00, valorRetorno: 0, valorHora: 0, valorPlantao: 0, ativo: true };
const HOSPITAL: Fonte = { id: "h", nome: "Plantão B", tipo: "plantao", cor: "#1E2A47", comoRecebe: "pf-empresa", pagamento: { modo: "ciclo", dia: 10, mesesDepois: 1, cicloInicio: 21, cicloFim: 20 }, glosaPct: 0, valorConsulta: 0, valorRetorno: 0, valorHora: 150_00, valorPlantao: 1_800_00, ativo: true };
const PARTICULAR: Fonte = { ...CONVENIO, id: "p", nome: "Particular", tipo: "particular", comoRecebe: "pf-pessoa", pagamento: { modo: "na-hora" }, glosaPct: 0, valorConsulta: 400_00 };

describe("financeiro", () => {
  it("data prevista: dias corridos, na hora e ciclo que cruza o mês", () => {
    const l: Lancamento = { id: "1", fonteId: "c", tipo: "consulta", data: "2026-11-10", quantidade: 1, valorUnit: 150_00 };
    expect(dataPrevista(l, CONVENIO)).toBe("2026-12-25");
    expect(dataPrevista(l, PARTICULAR)).toBe("2026-11-10");
    // ciclo 21→20, paga dia 10, 1 mês depois: dia 10/11 cai no ciclo de novembro → paga 10/12
    expect(dataPrevista({ ...l, fonteId: "h", data: "2026-11-10" }, HOSPITAL)).toBe("2026-12-10");
    // dia 25/11 já é do ciclo que fecha em dezembro → paga 10/01
    expect(dataPrevista({ ...l, fonteId: "h", data: "2026-11-25" }, HOSPITAL)).toBe("2027-01-10");
    expect(dataPrevista({ ...l, fonteId: "h", data: "2026-12-25" }, HOSPITAL)).toBe("2027-02-10");
  });
  it("situação: atrasado só depois da data prevista", () => {
    const l: Lancamento = { id: "1", fonteId: "c", tipo: "consulta", data: "2026-09-01", quantidade: 1, valorUnit: 150_00 };
    expect(situacao(l, CONVENIO, "2026-10-16")).toBe("a-receber");
    expect(situacao(l, CONVENIO, "2026-10-17")).toBe("atrasado");
    expect(situacao({ ...l, recebidoEm: "2026-10-20" }, CONVENIO, "2026-11-01")).toBe("recebido");
  });
  it("plantão repetido toda semana e todo mês sem estourar o fim do mês", () => {
    let n = 0;
    const id = () => `x${n++}`;
    const base = { fonteId: "h", tipo: "plantao" as const, data: "2026-01-31", horas: 12, quantidade: 1, valorUnit: 1_800_00 };
    expect(gerarSerie(base, "mensal", 3, id).map((l) => l.data)).toEqual(["2026-01-31", "2026-02-28", "2026-03-31"]);
    expect(gerarSerie({ ...base, data: "2026-11-03" }, "semanal", 3, id).map((l) => l.data)).toEqual(["2026-11-03", "2026-11-10", "2026-11-17"]);
  });

  function doc(): Doc {
    let d: Doc = {};
    for (const f of [CONVENIO, HOSPITAL, PARTICULAR]) d = gravar(d, "fontes", f);
    const ls: Lancamento[] = [
      { id: "a", fonteId: "c", tipo: "consulta", data: "2026-11-03", quantidade: 10, valorUnit: 150_00 },
      { id: "b", fonteId: "p", tipo: "consulta", data: "2026-11-04", quantidade: 2, valorUnit: 400_00, recebidoEm: "2026-11-04" },
      { id: "c", fonteId: "h", tipo: "plantao", data: "2026-11-05", horas: 12, quantidade: 1, valorUnit: 1_800_00 },
      { id: "d", fonteId: "c", tipo: "consulta", data: "2026-08-01", quantidade: 4, valorUnit: 150_00 },
    ];
    for (const l of ls) d = gravar(d, "lancamentos", l);
    d = gravar(d, "despesas", { id: "e", data: "2026-11-01", descricao: "Aluguel do consultório", categoria: "Aluguel", valor: 2_000_00, dedutivel: true });
    return d;
  }

  it("resumo do mês separa consultório e plantão, com R$/hora e glosa", () => {
    const r = resumoMes(lerFinanceiro(doc()), "2026-11", "2026-11-10");
    expect(r.bruto).toBe(10 * 150_00 + 2 * 400_00 + 1_800_00);
    expect(r.consultorio).toBe(2_300_00);
    expect(r.plantao).toBe(1_800_00);
    expect(r.consultas).toBe(12);
    expect(r.horasPlantao).toBe(12);
    expect(r.porFonte.find((f) => f.fonte.id === "h")?.porHora).toBe(150_00);
    expect(r.glosaEstimada).toBe(Math.round(1_500_00 * 0.05));
    expect(r.recebidoNoMes).toBe(800_00);
    expect(r.despesas).toBe(2_000_00);
    expect(r.liquido).toBe(r.bruto - r.glosaEstimada - r.impostos.total - r.despesas);
  });
  it("a receber: atrasado do convênio e previsão por mês", () => {
    const { atrasados, porMes } = aReceber(lerFinanceiro(doc()), "2026-11-10");
    expect(atrasados.map((i) => i.lancamento.id)).toEqual(["d"]);
    expect(porMes.map((m) => m.mes)).toEqual(["2026-12"]);
    expect(porMes[0].total).toBe(Math.round(1_500_00 * 0.95) + 1_800_00);
  });
  it("receita dos 12 meses é proporcional quando o histórico é curto", () => {
    const fin = lerFinanceiro(doc());
    // PJ: 600 em agosto; de agosto a outubro são 3 meses → 600/3×12
    expect(receita12Meses(fin, "2026-11")).toBe(Math.round((600_00 / 3) * 12));
  });
  it("planilha do contador abre no Excel em português", () => {
    const csv = csvDoMes(lerFinanceiro(doc()), "2026-11", "2026-11-10");
    expect(csv.startsWith("﻿Data;Tipo")).toBe(true);
    expect(csv).toContain("1500,00");
    expect(csv).toContain("Aluguel do consultório");
  });
});
