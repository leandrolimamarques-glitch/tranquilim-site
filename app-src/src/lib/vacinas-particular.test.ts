import { describe, expect, it } from "vitest";
import { CALENDARIO } from "./vacinas";
import { CALENDARIO_PARTICULAR, FONTE_PARTICULAR, NOTA_PARTICULAR } from "./vacinas-particular";

describe("calendário particular", () => {
  it("tem ids únicos com prefixo p-", () => {
    const ids = CALENDARIO_PARTICULAR.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("p-")).toBe(true);
  });

  it("não repete ids do calendário do SUS", () => {
    const sus = new Set(CALENDARIO.map((v) => v.id));
    for (const v of CALENDARIO_PARTICULAR) expect(sus.has(v.id)).toBe(false);
  });

  it("idades entre 0 e 120 meses, em ordem crescente", () => {
    const idades = CALENDARIO_PARTICULAR.map((v) => v.idadeMeses);
    for (const m of idades) {
      expect(Number.isInteger(m)).toBe(true);
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(120);
    }
    expect(idades).toEqual([...idades].sort((a, b) => a - b));
  });

  it("todo item tem nome, dose e nota, sem dose em mL ou mg", () => {
    for (const v of CALENDARIO_PARTICULAR) {
      expect(v.nome.trim()).not.toBe("");
      expect(v.dose.trim()).not.toBe("");
      expect(v.nota?.trim()).toBeTruthy();
      expect(`${v.dose} ${v.nota}`).not.toMatch(/\d\s*(mL|mg)\b/i);
    }
  });

  it("fonte com ano e nota para a família", () => {
    expect(FONTE_PARTICULAR).toMatch(/20\d\d/);
    expect(NOTA_PARTICULAR.trim()).not.toBe("");
  });
});
