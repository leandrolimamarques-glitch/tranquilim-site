import { describe, expect, it } from "vitest";
import { AMAMENTACAO } from "../trilhas";
import type { Trilha } from "../trilhas";
import { DESENVOLVIMENTO } from "./desenvolvimento";
import { SEGURANCA } from "./seguranca";
import { ROTINA_TELAS } from "./rotina-telas";

const NOVAS: Trilha[] = [DESENVOLVIMENTO, SEGURANCA, ROTINA_TELAS];
const PREFIXO: Record<string, string> = {
  desenvolvimento: "de",
  seguranca: "sg",
  "rotina-telas": "rt",
};
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;

function textos(t: Trilha): string[] {
  return [
    t.titulo,
    t.faixa,
    ...t.fontes,
    ...t.aulas.flatMap((a) => [a.titulo, a.gancho, a.alerta, ...a.pontos]),
  ];
}

describe("trilhas de desenvolvimento, segurança e rotina", () => {
  it.each(NOVAS.map((t) => [t.id, t] as const))("%s tem de 6 a 8 aulas", (_id, t) => {
    expect(t.aulas.length).toBeGreaterThanOrEqual(6);
    expect(t.aulas.length).toBeLessThanOrEqual(8);
  });

  it("ids de aula são únicos entre as três trilhas e a de amamentação", () => {
    const ids = [AMAMENTACAO, ...NOVAS].flatMap((t) => t.aulas.map((a) => a.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids de trilha são únicos", () => {
    const ids = [AMAMENTACAO, ...NOVAS].map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada aula usa o prefixo da sua trilha", () => {
    for (const t of NOVAS) {
      for (const a of t.aulas) expect(a.id.startsWith(PREFIXO[t.id])).toBe(true);
    }
  });

  it("toda aula tem gancho, pontos e alerta preenchidos", () => {
    for (const t of NOVAS) {
      for (const a of t.aulas) {
        expect(a.titulo.trim(), a.id).not.toBe("");
        expect(a.gancho.trim(), a.id).not.toBe("");
        expect(a.alerta.trim(), a.id).not.toBe("");
        expect(a.pontos.length, a.id).toBeGreaterThan(0);
        for (const p of a.pontos) expect(p.trim(), a.id).not.toBe("");
      }
    }
  });

  it("toda trilha cita fontes e tem faixa de idade coerente", () => {
    for (const t of NOVAS) {
      expect(t.fontes.length).toBeGreaterThan(0);
      expect(t.deMeses).toBeLessThan(t.ateMeses);
    }
  });

  it("nenhum texto traz dose ou quantidade de medicamento", () => {
    for (const t of NOVAS) {
      for (const texto of textos(t)) expect(texto, `${t.id}: ${texto}`).not.toMatch(DOSE);
    }
  });
});
