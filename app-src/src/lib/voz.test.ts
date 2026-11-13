import { describe, expect, it } from "vitest";
import { emFrases, mensagemDeErroDitado } from "./voz";

describe("voz", () => {
  it("divide respostas longas em frases curtas para a leitura não ser cortada", () => {
    const longo = "Primeira frase curta. " + "Uma frase bem comprida que continua por bastante tempo para passar do limite. ".repeat(5) + "Fim!";
    const f = emFrases(longo);
    expect(f.length).toBeGreaterThan(2);
    expect(f.every((x) => x.length <= 300)).toBe(true);
    expect(f.join(" ").replace(/\s+/g, " ")).toBe(longo.replace(/\s+/g, " ").trim());
    expect(emFrases("Sem ponto final")).toEqual(["Sem ponto final"]);
  });
  it("erro de microfone orienta usar o teclado", () => {
    expect(mensagemDeErroDitado("service-not-allowed")).toContain("teclado");
    expect(mensagemDeErroDitado("no-speech")).toContain("Não ouvi");
  });
});
