import { describe, expect, it } from "vitest";
import type { Trilha } from "../trilhas";
import { DESENVOLVIMENTO } from "./desenvolvimento";
import { SEGURANCA } from "./seguranca";
import { ROTINA_TELAS } from "./rotina-telas";

const TRILHAS: Trilha[] = [DESENVOLVIMENTO, SEGURANCA, ROTINA_TELAS];
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;
const AULAS = TRILHAS.flatMap((t) => t.aulas.map((a) => [`${t.id}/${a.id}`, a] as const));

describe("dois níveis de leitura: desenvolvimento, segurança e rotina", () => {
  it.each(AULAS)("%s tem versão simples com 3 a 6 frases curtas", (_id, a) => {
    expect(a.simples).toBeDefined();
    const s = a.simples ?? [];
    expect(s.length).toBeGreaterThanOrEqual(3);
    expect(s.length).toBeLessThanOrEqual(6);
    for (const frase of s) {
      expect(frase.trim().length).toBeGreaterThan(0);
      expect(frase.length).toBeLessThanOrEqual(140);
    }
  });

  it.each(AULAS)("%s tem “Entender melhor” com 2 a 5 parágrafos", (_id, a) => {
    expect(a.aprofundado).toBeDefined();
    const p = a.aprofundado ?? [];
    expect(p.length).toBeGreaterThanOrEqual(2);
    expect(p.length).toBeLessThanOrEqual(5);
    for (const par of p) expect(par.trim().length).toBeGreaterThan(0);
  });

  it.each(AULAS)("%s não traz dose nem quantidade de remédio", (_id, a) => {
    for (const texto of [...(a.simples ?? []), ...(a.aprofundado ?? [])]) {
      expect(texto).not.toMatch(DOSE);
    }
  });
});
