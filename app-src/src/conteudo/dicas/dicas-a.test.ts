import { describe, expect, it } from "vitest";
import type { Dica } from "./tipos";
import { ESTIMULAR } from "./estimular";
import { CHORO_SONO } from "./choro-sono";
import { TELAS } from "./telas";

// Nenhuma dose ou quantidade de remédio no texto para pais.
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;

const GRUPOS: ReadonlyArray<readonly [string, Dica[], string, string, number]> = [
  ["estimular", ESTIMULAR, "estimular", "es-", 20],
  ["choro-sono", CHORO_SONO, "choro-sono", "cs-", 12],
  ["telas", TELAS, "telas", "tl-", 8],
];

const TODAS = GRUPOS.flatMap(([, lista]) => lista);

function textos(d: Dica): string[] {
  return [d.titulo, d.resumo, ...d.simples, ...d.aprofundado, d.atencao ?? "", ...d.fontes, ...(d.ingredientes ?? [])];
}

describe("dicas (lote A)", () => {
  it.each(GRUPOS)("%s tem o mínimo de dicas, categoria e prefixo certos", (_n, lista, categoria, prefixo, minimo) => {
    expect(lista.length).toBeGreaterThanOrEqual(minimo);
    for (const d of lista) {
      expect(d.categoria, d.id).toBe(categoria);
      expect(d.id.startsWith(prefixo), d.id).toBe(true);
    }
  });

  it("ids são únicos", () => {
    const ids = TODAS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("simples tem de 3 a 7 frases curtas", () => {
    for (const d of TODAS) {
      expect(d.simples.length, d.id).toBeGreaterThanOrEqual(3);
      expect(d.simples.length, d.id).toBeLessThanOrEqual(7);
      for (const s of d.simples) {
        expect(s.trim(), d.id).not.toBe("");
        expect(s.length, `${d.id}: ${s}`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("aprofundado tem de 2 a 4 parágrafos", () => {
    for (const d of TODAS) {
      expect(d.aprofundado.length, d.id).toBeGreaterThanOrEqual(2);
      expect(d.aprofundado.length, d.id).toBeLessThanOrEqual(4);
      for (const p of d.aprofundado) expect(p.trim(), d.id).not.toBe("");
    }
  });

  it("tem título, resumo e fontes", () => {
    for (const d of TODAS) {
      expect(d.titulo.trim(), d.id).not.toBe("");
      expect(d.resumo.trim(), d.id).not.toBe("");
      expect(d.fontes.length, d.id).toBeGreaterThan(0);
      for (const f of d.fontes) expect(f.trim(), d.id).not.toBe("");
    }
  });

  it("faixa de idade é válida (deMeses < ateMeses, até 6 anos)", () => {
    for (const d of TODAS) {
      expect(d.deMeses, d.id).toBeGreaterThanOrEqual(0);
      expect(d.deMeses, d.id).toBeLessThan(d.ateMeses);
      expect(d.ateMeses, d.id).toBeLessThanOrEqual(72);
    }
  });

  it("não traz dose de remédio", () => {
    for (const d of TODAS) {
      for (const t of textos(d)) expect(DOSE.test(t), `${d.id}: ${t}`).toBe(false);
    }
  });

  it("estimular cobre todas as faixas de idade de 0 a 6 anos", () => {
    const faixas: Array<[number, number]> = [
      [0, 3], [3, 6], [6, 9], [9, 12], [12, 18], [18, 24], [24, 36], [36, 48], [48, 72],
    ];
    for (const [de, ate] of faixas) {
      const cobre = ESTIMULAR.some((d) => d.deMeses <= de && d.ateMeses >= ate);
      expect(cobre, `${de}-${ate} meses`).toBe(true);
    }
  });
});
