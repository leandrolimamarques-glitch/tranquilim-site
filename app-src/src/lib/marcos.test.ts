import { describe, expect, it } from "vitest";
import { FAIXAS, ID_REGRESSAO, MARCOS, faixaDaIdade, marcosParaMostrar, resumoMarcos, situacaoMarco } from "./marcos";
import { alertasDaCrianca } from "./alertas";
import { VISTA_VAZIA, aplicarVista, docParaVista } from "./familia";

const marco = (id: string) => MARCOS.find((m) => m.id === id)!;

describe("marcos do desenvolvimento (Caderneta da Criança, MS)", () => {
  it("68 marcos, 4 por faixa, faixas contíguas do nascimento aos 72 meses, ids únicos", () => {
    expect(MARCOS).toHaveLength(68);
    expect(new Set(MARCOS.map((m) => m.id)).size).toBe(68);
    expect(FAIXAS).toHaveLength(17);
    for (const f of FAIXAS) expect(MARCOS.filter((m) => m.faixa.de === f.de)).toHaveLength(4);
    expect(FAIXAS[0].de).toBe(0);
    for (let i = 1; i < FAIXAS.length; i++) expect(FAIXAS[i].de).toBe(FAIXAS[i - 1].ate);
    expect(FAIXAS[FAIXAS.length - 1].ate).toBe(72);
  });

  it("mostra a faixa atual e a anterior", () => {
    const r = marcosParaMostrar(10);
    expect(r.atual).toEqual({ de: 9, ate: 12 });
    expect(r.anterior).toEqual({ de: 6, ate: 9 });
    expect(r.marcos).toHaveLength(8);
    expect(marcosParaMostrar(0.5).anterior).toBeNull();
    expect(faixaDaIdade(80)).toEqual({ de: 66, ate: 72 });
  });

  it("ainda não na faixa atual = estimular; faixa já passada = conversar; no 1º mês já é conversar", () => {
    const nao = { faz: false, data: "2026-01-01" };
    expect(situacaoMarco(marco("m09-imita"), 10, nao)).toBe("ainda-na-idade");
    expect(situacaoMarco(marco("m06-senta"), 10, nao)).toBe("conversar");
    expect(situacaoMarco(marco("m00-rosto"), 0.5, nao)).toBe("conversar");
    expect(situacaoMarco(marco("m06-senta"), 10, { faz: true, data: "2026-01-01" })).toBe("faz");
    expect(situacaoMarco(marco("m06-senta"), 10, undefined)).toBe("sem-resposta");
  });

  it("vira aviso para a família e o pediatra; sem resposta não alarma", () => {
    const crianca = { nome: "Ana", nascimento: "2026-01-01", sexo: "menina" as const };
    const hoje = "2026-11-01"; // 10 meses
    const base = { ...VISTA_VAZIA, crianca, medidas: [{ id: "m", data: "2026-10-20", pesoKg: 8.5 }] };
    expect(alertasDaCrianca(base, hoje).some((a) => a.id.startsWith("marcos"))).toBe(false);
    const v = { ...base, marcos: { "m06-senta": { faz: false, data: hoje }, "m09-imita": { faz: false, data: hoje }, [ID_REGRESSAO]: { faz: true, data: hoje } } };
    const a = alertasDaCrianca(v, hoje);
    expect(a.find((x) => x.id === "marcos-atraso")?.nivel).toBe("atencao");
    expect(a.find((x) => x.id === "marcos-atraso")?.texto).toContain("senta-se sem apoio");
    expect(a.find((x) => x.id === "marcos-alerta")?.nivel).toBe("info");
    expect(a.find((x) => x.id === "marcos-perda")?.nivel).toBe("atencao");
    expect(resumoMarcos(crianca.nascimento, hoje, v.marcos).conversar.map((m) => m.id)).toEqual(["m06-senta"]);
  });

  it("respostas vão para o documento sincronizado e voltam iguais", () => {
    const depois = { ...VISTA_VAZIA, marcos: { "m06-senta": { faz: true, data: "2026-11-01" } } };
    const doc = aplicarVista({}, VISTA_VAZIA, depois, 1);
    expect(docParaVista(doc).marcos).toEqual(depois.marcos);
    const desmarcado = aplicarVista(doc, depois, VISTA_VAZIA, 2);
    expect(docParaVista(desmarcado).marcos).toEqual({});
  });
});
