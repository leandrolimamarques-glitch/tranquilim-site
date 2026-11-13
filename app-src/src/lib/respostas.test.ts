import { describe, expect, it } from "vitest";
import { TEMAS_RAPIDOS, TEM_DOSE, avisoDaIdade, cuidadosEmCasa, fluxoDoTema, rascunhoDoTema, sinaisDePerigo } from "./respostas";

describe("resposta rápida", () => {
  it("todo tema tem sinais de perigo e cuidados em casa vindos do fluxo", () => {
    for (const t of TEMAS_RAPIDOS) {
      const f = fluxoDoTema(t);
      expect(sinaisDePerigo(f).length, t.id).toBeGreaterThan(3);
      expect(cuidadosEmCasa(f)?.oQueFazer.length, t.id).toBeGreaterThan(0);
    }
  });
  it("o rascunho que o pediatra recebe não tem dose (senão ele não conseguiria salvar)", () => {
    for (const t of TEMAS_RAPIDOS) expect(TEM_DOSE.test(rascunhoDoTema(t)), t.id).toBe(false);
  });
  it("barra dose escrita pelo pediatra", () => {
    for (const x of ["5 ml", "10 gotas", "1 gota por kg", "de 6 em 6 horas", "6/6h", "200mg"]) expect(TEM_DOSE.test(x), x).toBe(true);
    expect(TEM_DOSE.test("Antitérmico na dose da receita, se estiver desconfortável.")).toBe(false);
  });
  it("febre antes dos 3 meses: só o aviso de ir ao pronto-socorro", () => {
    const febre = fluxoDoTema(TEMAS_RAPIDOS[0]);
    expect(avisoDaIdade(febre, 2)?.nivel).toBe("ps");
    expect(avisoDaIdade(febre, 4)).toBeNull();
    expect(avisoDaIdade(fluxoDoTema(TEMAS_RAPIDOS[1]), 1)).toBeNull();
  });
});
