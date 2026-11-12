import { describe, expect, it } from "vitest";
import { AMAMENTACAO, type Trilha } from "../trilhas";
import { PRIMEIROS_DIAS } from "./primeiros-dias";
import { SONO_SEGURO } from "./sono-seguro";
import { INTRODUCAO_ALIMENTAR } from "./introducao-alimentar";

const TRILHAS: readonly Trilha[] = [AMAMENTACAO, PRIMEIROS_DIAS, SONO_SEGURO, INTRODUCAO_ALIMENTAR];

// Nenhuma dose ou quantidade de remédio no texto para pais.
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;

const aulas = TRILHAS.flatMap((t) => t.aulas.map((a) => [`${t.id}/${a.id}`, a] as const));

describe("aulas em dois níveis (lote A): simples e aprofundado", () => {
  it.each(aulas)("%s tem versão simples com 3 a 6 frases curtas", (_id, a) => {
    expect(a.simples).toBeDefined();
    const s = a.simples ?? [];
    expect(s.length).toBeGreaterThanOrEqual(3);
    expect(s.length).toBeLessThanOrEqual(6);
    for (const f of s) {
      expect(f.trim()).not.toBe("");
      expect(f.length, f).toBeLessThanOrEqual(140);
    }
  });

  it.each(aulas)("%s tem 'Entender melhor' com 2 a 5 parágrafos", (_id, a) => {
    expect(a.aprofundado).toBeDefined();
    const p = a.aprofundado ?? [];
    expect(p.length).toBeGreaterThanOrEqual(2);
    expect(p.length).toBeLessThanOrEqual(5);
    for (const x of p) expect(x.trim()).not.toBe("");
  });

  it.each(aulas)("%s não traz dose em mg, mL ou gotas", (_id, a) => {
    const textos = [a.titulo, a.gancho, a.alerta, ...a.pontos, ...(a.simples ?? []), ...(a.aprofundado ?? [])];
    for (const t of textos) expect(t, t).not.toMatch(DOSE);
  });
});
