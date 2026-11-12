import { describe, expect, it } from "vitest";
import type { CategoriaDica, Dica } from "./tipos";
import { INTESTINO } from "./intestino";
import { PELE } from "./pele";
import { CUIDADOS } from "./cuidados";

const GRUPOS: { nome: CategoriaDica; dicas: Dica[]; prefixo: string; minimo: number }[] = [
  { nome: "intestino", dicas: INTESTINO, prefixo: "in-", minimo: 10 },
  { nome: "pele", dicas: PELE, prefixo: "pe-", minimo: 14 },
  { nome: "cuidados", dicas: CUIDADOS, prefixo: "cu-", minimo: 12 },
];
const TODAS = GRUPOS.flatMap((g) => g.dicas);
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;

function textos(d: Dica): string[] {
  return [d.titulo, d.resumo, ...d.simples, ...d.aprofundado, d.atencao ?? "", ...d.fontes, ...(d.ingredientes ?? [])];
}

describe("dicas de intestino, pele e cuidados", () => {
  it.each(GRUPOS.map((g) => [g.nome, g] as const))("%s tem o mínimo de dicas", (_n, g) => {
    expect(g.dicas.length).toBeGreaterThanOrEqual(g.minimo);
  });

  it.each(GRUPOS.map((g) => [g.nome, g] as const))("%s: categoria e prefixo do id", (_n, g) => {
    for (const d of g.dicas) {
      expect(d.categoria).toBe(g.nome);
      expect(d.id.startsWith(g.prefixo)).toBe(true);
    }
  });

  it("ids são únicos", () => {
    const ids = TODAS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(TODAS.map((d) => [d.id, d] as const))("%s respeita o formato", (_id, d) => {
    expect(d.simples.length).toBeGreaterThanOrEqual(3);
    expect(d.simples.length).toBeLessThanOrEqual(7);
    for (const s of d.simples) {
      expect(s.trim().length).toBeGreaterThan(0);
      expect(s.length).toBeLessThanOrEqual(160);
    }
    expect(d.aprofundado.length).toBeGreaterThanOrEqual(2);
    expect(d.aprofundado.length).toBeLessThanOrEqual(4);
    expect(d.atencao?.trim().length ?? 0).toBeGreaterThan(0);
    expect(d.fontes.length).toBeGreaterThan(0);
    expect(d.deMeses).toBeGreaterThanOrEqual(0);
    expect(d.deMeses).toBeLessThan(d.ateMeses);
    expect(d.ateMeses).toBeLessThanOrEqual(72);
  });

  it.each(TODAS.map((d) => [d.id, d] as const))("%s não traz dose de remédio", (_id, d) => {
    for (const t of textos(d)) expect(t).not.toMatch(DOSE);
  });
});
