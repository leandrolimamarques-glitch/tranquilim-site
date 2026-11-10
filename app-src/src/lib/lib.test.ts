import { describe, expect, it } from "vitest";
import { idadeEmDias, idadeTexto, mesesCompletos, somarMeses } from "./idade";
import { CALENDARIO, situacaoDasVacinas } from "./vacinas";
import { escoreZ, lmsNaIdade, normalCdf, percentil, valorNoZ } from "./oms";
import { andar, validarFluxo } from "./fluxo";
import { FEBRE } from "../conteudo/febre";
import { AMAMENTACAO } from "../conteudo/trilhas";

describe("idade", () => {
  it("conta dias e meses de calendário", () => {
    expect(idadeEmDias("2026-01-01", "2026-01-31")).toBe(30);
    expect(mesesCompletos("2026-01-31", "2026-02-28")).toBe(0);
    expect(mesesCompletos("2026-01-15", "2026-03-15")).toBe(2);
  });
  it("soma meses sem estourar o fim do mês", () => {
    expect(somarMeses("2026-01-31", 1)).toBe("2026-02-28");
    expect(somarMeses("2024-01-31", 1)).toBe("2024-02-29");
    expect(somarMeses("2026-03-10", 12)).toBe("2027-03-10");
  });
  it("escreve a idade como a família fala", () => {
    expect(idadeTexto("2026-11-01", "2026-11-05")).toBe("4 dias");
    expect(idadeTexto("2026-09-01", "2026-10-20")).toBe("7 semanas");
    expect(idadeTexto("2026-01-10", "2026-11-10")).toBe("10 meses");
    expect(idadeTexto("2024-05-10", "2026-11-10")).toBe("2 anos e 6 meses");
  });
});

describe("vacinas", () => {
  it("tem ids únicos e começa ao nascer", () => {
    const ids = CALENDARIO.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(CALENDARIO.filter((v) => v.idadeMeses === 0).map((v) => v.id)).toEqual(["bcg", "hepb-0"]);
  });
  it("marca pendentes, a próxima idade e as aplicadas", () => {
    const s = situacaoDasVacinas("2026-08-20", "2026-11-10", new Set(["bcg", "hepb-0", "penta-1"]));
    const por = (id: string) => s.find((v) => v.id === id)!.situacao;
    expect(por("bcg")).toBe("aplicada");
    expect(por("penta-1")).toBe("aplicada");
    expect(por("vip-1")).toBe("pendente");
    expect(por("menc-1")).toBe("proxima");
    expect(por("penta-2")).toBe("futura");
  });
});

describe("curvas da OMS", () => {
  it("devolve a mediana e os percentis publicados", () => {
    const { L, M, S } = lmsNaIdade("menino", "peso", 0);
    expect(M).toBeCloseTo(3.3464, 4);
    expect(valorNoZ(-2, L, M, S)).toBeCloseTo(2.459312, 3);
    expect(valorNoZ(2, L, M, S)).toBeCloseTo(4.419354, 3);
    expect(escoreZ(M, L, M, S)).toBeCloseTo(0, 6);
  });
  it("calcula percentil coerente", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(percentil("menina", "peso", 0, 3.2322)).toBeCloseTo(50, 1);
    const p = percentil("menina", "peso", 12, 6.5);
    expect(p).toBeLessThan(3);
  });
  it("recusa idade fora da curva", () => {
    expect(() => lmsNaIdade("menino", "peso", 25)).toThrow();
  });
});

describe("fluxo de febre", () => {
  it("é válido e alcança todos os desfechos", () => {
    expect(validarFluxo(FEBRE)).toEqual([]);
  });
  it("qualquer sinal de alarme leva ao pronto-socorro", () => {
    const passo = FEBRE.passos.alarme;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    for (const item of passo.itens) {
      const e = andar(FEBRE, [{ passo: "alarme", tipo: "sinais", marcados: [item.id] }]);
      expect(e.tipo === "desfecho" && e.desfecho.nivel).toBe("ps");
    }
  });
  it("bebê com menos de 3 meses e febre vai ao pronto-socorro", () => {
    const e = andar(FEBRE, [
      { passo: "alarme", tipo: "sinais", marcados: [] },
      { passo: "idade", tipo: "escolha", opcao: 0 },
      { passo: "bebe", tipo: "escolha", opcao: 0 },
    ]);
    expect(e.tipo === "desfecho" && e.desfecho.id).toBe("ps-bebe");
  });
  it("3 a 6 meses com 39 °C ou mais procura atendimento hoje", () => {
    const e = andar(FEBRE, [
      { passo: "alarme", tipo: "sinais", marcados: [] },
      { passo: "idade", tipo: "escolha", opcao: 1 },
      { passo: "tres-a-seis", tipo: "escolha", opcao: 0 },
    ]);
    expect(e.tipo === "desfecho" && e.desfecho.nivel).toBe("hoje");
  });
  it("sem nenhum sinal, cuida em casa", () => {
    const e = andar(FEBRE, [
      { passo: "alarme", tipo: "sinais", marcados: [] },
      { passo: "idade", tipo: "escolha", opcao: 2 },
      { passo: "atencao", tipo: "sinais", marcados: [] },
    ]);
    expect(e.tipo === "desfecho" && e.desfecho.nivel).toBe("casa");
  });
  it("qualquer sinal de atenção leva a atendimento hoje", () => {
    const passo = FEBRE.passos.atencao;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    for (const item of passo.itens) {
      const e = andar(FEBRE, [
        { passo: "alarme", tipo: "sinais", marcados: [] },
        { passo: "idade", tipo: "escolha", opcao: 2 },
        { passo: "atencao", tipo: "sinais", marcados: [item.id] },
      ]);
      expect(e.tipo === "desfecho" && e.desfecho.nivel).toBe("hoje");
    }
  });
  it("não fala em dose de remédio", () => {
    const texto = JSON.stringify(FEBRE).toLowerCase();
    expect(texto).not.toMatch(/\d+\s*(mg|ml|gotas)/);
  });
});

describe("trilha de amamentação", () => {
  it("tem 8 aulas com alerta", () => {
    expect(AMAMENTACAO.aulas).toHaveLength(8);
    for (const a of AMAMENTACAO.aulas) expect(a.alerta.length).toBeGreaterThan(20);
  });
});

import { codificarConvite, extrairCodigo, formatarTelefone, lerConvite, linkWhatsApp, mensagemConvite, telefoneBr, type Medico } from "./convite";
import { juntar, lerCopia, PAINEL_VAZIO } from "./painel";

describe("convite do pediatra", () => {
  const medico: Medico = { nome: "Dra. Joana Exemplo", registro: "CRM-SP 000001", titulo: "Pediatra", whatsapp: "(11) 98765-4321", local: "Rua A, 10 · São Paulo" };
  const crianca = { nome: "Ana Júlia", nascimento: "2026-09-01", sexo: "menina" as const };

  it("vai e volta pelo link sem perder acento", () => {
    const lido = lerConvite(codificarConvite(medico, crianca), "2026-11-10");
    expect(lido?.crianca).toEqual(crianca);
    expect(lido?.medico.nome).toBe("Dra. Joana Exemplo");
    expect(lido?.medico.whatsapp).toBe("11987654321");
    expect(lido?.medico.local).toBe("Rua A, 10 · São Paulo");
  });
  it("acha o convite colado junto com a mensagem", () => {
    const codigo = codificarConvite(medico, crianca);
    const msg = mensagemConvite(medico, crianca, "", `https://tranquilim.com.br/app/#/convite/${codigo}`);
    expect(extrairCodigo(msg)).toBe(codigo);
    expect(extrairCodigo("bom dia")).toBeNull();
  });
  it("só usa caracteres seguros em link", () => {
    expect(codificarConvite(medico, crianca)).toMatch(/^[A-Za-z0-9_-]+$/);
  });
  it("recusa convite cortado, adulterado ou com data impossível", () => {
    const bom = codificarConvite(medico, crianca);
    expect(lerConvite(bom.slice(0, -6), "2026-11-10")).toBeNull();
    expect(lerConvite("lixo", "2026-11-10")).toBeNull();
    expect(lerConvite(codificarConvite(medico, { ...crianca, nascimento: "2026-12-01" }), "2026-11-10")).toBeNull();
    expect(lerConvite(codificarConvite(medico, { ...crianca, nascimento: "2026-02-30" }), "2026-11-10")).toBeNull();
    expect(lerConvite(codificarConvite({ ...medico, registro: "" }, crianca), "2026-11-10")).toBeNull();
  });
  it("entende telefone brasileiro e monta o link do WhatsApp", () => {
    expect(telefoneBr("(11) 98765-4321")).toBe("5511987654321");
    expect(telefoneBr("011 3456-7890")).toBe("551134567890");
    expect(telefoneBr("+55 11 98765-4321")).toBe("5511987654321");
    expect(telefoneBr("98765-4321")).toBeNull();
    expect(formatarTelefone("11987654321")).toBe("(11) 98765-4321");
    expect(linkWhatsApp("11987654321", "Olá, tudo bem?")).toBe("https://wa.me/5511987654321?text=Ol%C3%A1%2C%20tudo%20bem%3F");
    expect(linkWhatsApp("", "oi")).toBe("https://wa.me/?text=oi");
  });
  it("a mensagem do convite leva o link e não fala em dose", () => {
    const m = mensagemConvite(medico, crianca, "Mariana Souza", "https://exemplo/app/#/convite/x");
    expect(m).toContain("Olá, Mariana!");
    expect(m).toContain("Ana Júlia");
    expect(m.endsWith("https://exemplo/app/#/convite/x")).toBe(true);
    expect(m).not.toMatch(/\d\s?(mg|ml|gotas)/i);
  });
});

describe("cópia de segurança do painel", () => {
  const p1 = { id: "a", crianca: { nome: "Ana", nascimento: "2026-01-01", sexo: "menina" as const }, responsavel: "", whatsapp: "", criadoEm: "2026-11-10" };
  const p2 = { ...p1, id: "b", crianca: { ...p1.crianca, nome: "Bia" } };
  it("lê a própria cópia e descarta paciente inválido", () => {
    const texto = JSON.stringify({ versao: 1, medico: null, pacientes: [p1, { id: "x", crianca: { nome: "X", nascimento: "ontem", sexo: "menina" } }] });
    expect(lerCopia(texto)?.pacientes.map((p) => p.id)).toEqual(["a"]);
    expect(lerCopia("{}")).toBeNull();
    expect(lerCopia("não é json")).toBeNull();
  });
  it("juntar não apaga ninguém e a cópia vence no mesmo paciente", () => {
    const atual = { ...PAINEL_VAZIO, pacientes: [p1] };
    const importado = { ...PAINEL_VAZIO, pacientes: [{ ...p1, responsavel: "Mãe" }, p2] };
    const r = juntar(atual, importado);
    expect(r.pacientes.map((p) => p.id).sort()).toEqual(["a", "b"]);
    expect(r.pacientes.find((p) => p.id === "a")?.responsavel).toBe("Mãe");
  });
});
