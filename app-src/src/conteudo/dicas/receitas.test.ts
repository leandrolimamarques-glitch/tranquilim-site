import { describe, expect, it } from "vitest";
import { RECEITAS } from "./receitas";
import type { Dica } from "./tipos";

const tudo = (r: Dica) =>
  [r.titulo, r.resumo, ...(r.ingredientes ?? []), ...r.simples, ...r.aprofundado, r.atencao ?? ""].join("\n");

const antesDe2Anos = (r: Dica) => r.ateMeses <= 24 || r.deMeses < 24;
const antesDe1Ano = (r: Dica) => r.deMeses < 12;

describe("receitas", () => {
  it("tem pelo menos 40 receitas, com ids únicos e prefixo rc-", () => {
    expect(RECEITAS.length).toBeGreaterThanOrEqual(40);
    const ids = RECEITAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of RECEITAS) {
      expect(r.id.startsWith("rc-")).toBe(true);
      expect(r.categoria).toBe("receitas");
    }
  });

  it("cobre todas as faixas de idade", () => {
    const conta = (de: number, ate: number) => RECEITAS.filter((r) => r.deMeses === de && r.ateMeses === ate).length;
    expect(conta(6, 8)).toBeGreaterThanOrEqual(12);
    expect(conta(9, 11)).toBeGreaterThanOrEqual(10);
    expect(conta(12, 24)).toBeGreaterThanOrEqual(10);
    expect(conta(24, 72)).toBeGreaterThanOrEqual(10);
  });

  it("toda receita tem ingredientes, 3 a 7 passos, 2 a 4 parágrafos e fontes", () => {
    for (const r of RECEITAS) {
      expect(r.ingredientes?.length ?? 0, r.id).toBeGreaterThan(0);
      expect(r.simples.length, r.id).toBeGreaterThanOrEqual(3);
      expect(r.simples.length, r.id).toBeLessThanOrEqual(7);
      expect(r.aprofundado.length, r.id).toBeGreaterThanOrEqual(2);
      expect(r.aprofundado.length, r.id).toBeLessThanOrEqual(4);
      expect(r.fontes.length, r.id).toBeGreaterThan(0);
      expect(r.deMeses, r.id).toBeLessThan(r.ateMeses);
    }
  });

  it("antes de 2 anos: nada de açúcar, mel, achocolatado ou leite condensado nos ingredientes", () => {
    for (const r of RECEITAS.filter(antesDe2Anos)) {
      for (const i of r.ingredientes ?? []) {
        expect(i, r.id).not.toMatch(/açúcar|mel\b|achocolatado|leite condensado/i);
      }
    }
  });

  it("antes de 1 ano: sem sal nos ingredientes", () => {
    for (const r of RECEITAS.filter(antesDe1Ano)) {
      for (const i of r.ingredientes ?? []) {
        expect(i, r.id).not.toMatch(/\bsal\b/i);
      }
    }
  });

  it("nenhuma receita cita ultraprocessados", () => {
    for (const r of RECEITAS) {
      expect(tudo(r), r.id).not.toMatch(/caldo (pronto|em cubo|tablete)|salsicha|presunto|salgadinho|suco de caixinha/i);
    }
  });

  it("nenhuma receita traz dose (mg, mL, gotas)", () => {
    for (const r of RECEITAS) {
      expect(tudo(r) + r.fontes.join("\n"), r.id).not.toMatch(/\d\s?(mg|ml|gotas)/i);
    }
  });

  it("menores de 4 anos: nada de pipoca, amendoim ou castanha como ingrediente", () => {
    for (const r of RECEITAS.filter((x) => x.deMeses < 48)) {
      for (const i of r.ingredientes ?? []) {
        expect(i, r.id).not.toMatch(/pipoca|amendoim|castanha|nozes/i);
      }
    }
  });

  it("uva sempre aparece com o corte no comprimento", () => {
    for (const r of RECEITAS) {
      if (/\buvas?\b(?!-passa)/i.test((r.ingredientes ?? []).join(" "))) {
        expect(tudo(r), r.id).toMatch(/comprimento/i);
      }
    }
  });
});
