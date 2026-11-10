import { describe, expect, it } from "vitest";
import { AMAMENTACAO, type Trilha } from "../trilhas";
import { PRIMEIROS_DIAS } from "./primeiros-dias";
import { SONO_SEGURO } from "./sono-seguro";
import { INTRODUCAO_ALIMENTAR } from "./introducao-alimentar";

const NOVAS: readonly Trilha[] = [PRIMEIROS_DIAS, SONO_SEGURO, INTRODUCAO_ALIMENTAR];

// Nenhuma dose ou quantidade de remédio no texto para pais.
const DOSE = /\d\s?(mg|ml|mL|gotas)/i;

function textos(t: Trilha): string[] {
  return [
    t.titulo,
    t.faixa,
    ...t.fontes,
    ...t.aulas.flatMap((a) => [a.titulo, a.gancho, a.alerta, ...a.pontos]),
  ];
}

describe("trilhas de aulas (lote A)", () => {
  it.each(NOVAS.map((t) => [t.id, t] as const))("%s tem de 6 a 8 aulas", (_id, t) => {
    expect(t.aulas.length).toBeGreaterThanOrEqual(6);
    expect(t.aulas.length).toBeLessThanOrEqual(8);
  });

  it("ids de aula são únicos nas três trilhas e na de amamentação", () => {
    const ids = [AMAMENTACAO, ...NOVAS].flatMap((t) => t.aulas.map((a) => a.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids de trilha são únicos", () => {
    const ids = [AMAMENTACAO, ...NOVAS].map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("toda aula tem gancho, pontos e alerta preenchidos", () => {
    for (const t of NOVAS) {
      for (const a of t.aulas) {
        expect(a.titulo.trim(), a.id).not.toBe("");
        expect(a.gancho.trim(), a.id).not.toBe("");
        expect(a.alerta.trim(), a.id).not.toBe("");
        expect(a.pontos.length, a.id).toBeGreaterThanOrEqual(3);
        expect(a.pontos.length, a.id).toBeLessThanOrEqual(6);
        for (const p of a.pontos) expect(p.trim(), a.id).not.toBe("");
      }
    }
  });

  it("toda trilha tem fontes e faixa de idade coerente", () => {
    for (const t of NOVAS) {
      expect(t.fontes.length, t.id).toBeGreaterThan(0);
      expect(t.ateMeses, t.id).toBeGreaterThan(t.deMeses);
    }
  });

  it("nenhum texto traz dose em mg, mL ou gotas", () => {
    for (const t of NOVAS) {
      for (const texto of textos(t)) {
        expect(texto, `${t.id}: ${texto}`).not.toMatch(DOSE);
      }
    }
  });
});
