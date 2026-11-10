import { describe, expect, it } from "vitest";
import { andar, validarFluxo } from "../../lib/fluxo";
import type { Desfecho, Fluxo, Nivel, Resposta } from "../../lib/fluxo";
import { QUEDA_CABECA } from "./queda-cabeca";
import { MANCHAS_PELE } from "./manchas-pele";
import { ENGASGO } from "./engasgo";

// Fluxos B: queda e batida na cabeça, manchas na pele, engasgo e objeto engolido.
// Decisões e fontes de cada passo: revisao/fluxos-b.md.

const FLUXOS: Fluxo[] = [QUEDA_CABECA, MANCHAS_PELE, ENGASGO];

const sinais = (passo: string, marcados: string[] = []): Resposta => ({ passo, tipo: "sinais", marcados });
const escolha = (passo: string, opcao: number): Resposta => ({ passo, tipo: "escolha", opcao });

function desfecho(fluxo: Fluxo, respostas: Resposta[]): Desfecho {
  const e = andar(fluxo, respostas);
  if (e.tipo !== "desfecho") throw new Error(`O fluxo ${fluxo.id} parou no passo ${e.passo.id}, não num desfecho`);
  return e.desfecho;
}

/** Índice da opção cujo texto bate com o padrão, para os testes não dependerem da ordem das opções. */
function opcao(fluxo: Fluxo, passo: string, padrao: RegExp): number {
  const p = fluxo.passos[passo];
  if (!p || p.tipo !== "escolha") throw new Error(`${passo} não é um passo de escolha`);
  const i = p.opcoes.findIndex((o) => padrao.test(o.texto));
  if (i < 0) throw new Error(`Nenhuma opção de ${passo} bate com ${padrao}`);
  return i;
}

function itens(fluxo: Fluxo, passo: string) {
  const p = fluxo.passos[passo];
  if (!p || p.tipo !== "sinais") throw new Error(`${passo} não é um passo de sinais`);
  return p.itens;
}

/** Níveis de todos os desfechos alcançáveis a partir do início, andando pelo grafo. */
function niveisAlcancaveis(fluxo: Fluxo): Set<Nivel> {
  const niveis = new Set<Nivel>();
  const vistos = new Set<string>();
  const fila = [fluxo.inicio];
  while (fila.length) {
    const atual = fila.shift()!;
    if (vistos.has(atual)) continue;
    vistos.add(atual);
    const d = fluxo.desfechos[atual];
    if (d) {
      niveis.add(d.nivel);
      continue;
    }
    const p = fluxo.passos[atual];
    if (!p) continue;
    fila.push(...(p.tipo === "sinais" ? [p.seAlgum, p.seNenhum] : p.opcoes.map((o) => o.vai)));
  }
  return niveis;
}

describe.each(FLUXOS.map((f) => [f.id, f] as const))("fluxo %s", (_id, fluxo) => {
  it("passa no validador: todo destino existe e todo passo e desfecho é alcançável", () => {
    expect(validarFluxo(fluxo)).toEqual([]);
  });

  it("não fala em dose de remédio", () => {
    expect(JSON.stringify(fluxo)).not.toMatch(/\d\s?(mg|ml|mL|gotas)/i);
  });

  it("não cita serviço pelo nome: o número de emergência é o 192", () => {
    expect(JSON.stringify(fluxo)).not.toMatch(/hospital|samu|ciatox|disque/i);
    expect(JSON.stringify(fluxo)).toContain("192");
  });

  it("alcança o pronto-socorro e também atendimento hoje e cuidado em casa", () => {
    // Os três fluxos têm os três níveis. No engasgo, "casa" só existe quando o engasgo passou
    // sozinho, com tosse, sem manobras e sem nenhum sinal depois (SBP, Guia Prático nº 222, 2025).
    const niveis = niveisAlcancaveis(fluxo);
    expect(niveis.has("ps")).toBe(true);
    expect(niveis.has("hoje")).toBe(true);
    expect(niveis.has("casa")).toBe(true);
  });

  it("todo desfecho de hoje ou de casa diz quando voltar e lembra o 192", () => {
    for (const d of Object.values(fluxo.desfechos)) {
      if (d.nivel === "ps") continue;
      expect(d.volteSe?.length, d.id).toBeGreaterThan(0);
      expect(d.volteSe!.some((t) => t.includes("192")), d.id).toBe(true);
    }
  });

  it("tem fontes, todas com ano", () => {
    expect(fluxo.fontes.length).toBeGreaterThan(0);
    for (const f of fluxo.fontes) expect(f).toMatch(/(19|20)\d{2}/);
  });

  it("não repete id de item nem texto de opção dentro de um passo", () => {
    for (const p of Object.values(fluxo.passos)) {
      const chaves = p.tipo === "sinais" ? p.itens.map((i) => i.id) : p.opcoes.map((o) => o.texto);
      expect(new Set(chaves).size, p.id).toBe(chaves.length);
    }
  });
});

describe("alarme: o primeiro passo leva ao pronto-socorro", () => {
  for (const fluxo of [QUEDA_CABECA, MANCHAS_PELE]) {
    it(`${fluxo.id}: qualquer sinal de alarme leva a ps`, () => {
      const inicio = fluxo.passos[fluxo.inicio];
      expect(inicio.tipo).toBe("sinais");
      for (const item of itens(fluxo, fluxo.inicio)) {
        expect(desfecho(fluxo, [sinais(fluxo.inicio, [item.id])]).nivel, item.texto).toBe("ps");
      }
    });
  }

  it("engasgo: o primeiro passo é uma escolha, e não tossir, chorar ou falar, ou desmaiar, leva a ps", () => {
    // O engasgo começa com uma pergunta de uma só resposta (um toque), não com uma lista de sinais.
    expect(ENGASGO.passos[ENGASGO.inicio].tipo).toBe("escolha");
    const naoTosse = desfecho(ENGASGO, [escolha("agora", opcao(ENGASGO, "agora", /não consegue tossir/))]);
    expect(naoTosse.id).toBe("ps-engasgo");
    const desmaiou = desfecho(ENGASGO, [escolha("agora", opcao(ENGASGO, "agora", /Desmaiou/))]);
    expect(desmaiou.id).toBe("ps-inconsciente");
  });
});

describe("queda e batida na cabeça", () => {
  const ate = (faixa: RegExp) => [sinais("alarme"), sinais("mecanismo"), escolha("idade", opcao(QUEDA_CABECA, "idade", faixa))];

  it("mecanismo grave leva a ps, em qualquer idade", () => {
    for (const item of itens(QUEDA_CABECA, "mecanismo")) {
      expect(desfecho(QUEDA_CABECA, [sinais("alarme"), sinais("mecanismo", [item.id])]).nivel, item.texto).toBe("ps");
    }
  });

  it("separa menores e maiores de 2 anos pela altura da queda (PECARN)", () => {
    const textos = itens(QUEDA_CABECA, "mecanismo").map((i) => i.texto).join(" ");
    expect(textos).toContain("90 cm");
    expect(textos).toContain("1,5 m");
  });

  it("bebê com menos de 3 meses sem nenhum sinal vai a avaliação hoje, nunca para casa", () => {
    expect(desfecho(QUEDA_CABECA, [...ate(/Menos de 3 meses/), sinais("bebe")]).id).toBe("hoje-bebe");
  });

  it("bebê com menos de 3 meses com galo, vômito, corte ou batida que ninguém viu vai a ps", () => {
    for (const item of itens(QUEDA_CABECA, "bebe")) {
      expect(desfecho(QUEDA_CABECA, [...ate(/Menos de 3 meses/), sinais("bebe", [item.id])]).nivel, item.texto).toBe("ps");
    }
  });

  it("de 3 meses a 2 anos: galo fora da testa leva a atendimento hoje; sem nada, casa", () => {
    const galo = itens(QUEDA_CABECA, "menor-2").find((i) => /fora da testa/.test(i.texto))!;
    expect(desfecho(QUEDA_CABECA, [...ate(/3 meses a 1 ano/), sinais("menor-2", [galo.id])]).nivel).toBe("hoje");
    expect(desfecho(QUEDA_CABECA, [...ate(/3 meses a 1 ano/), sinais("menor-2")]).nivel).toBe("casa");
  });

  it("2 anos ou mais sem nenhum sinal fica em casa", () => {
    expect(desfecho(QUEDA_CABECA, [...ate(/2 anos ou mais/), sinais("maior-2")]).nivel).toBe("casa");
  });

  it("vomitar mais de uma vez é alarme; uma vez só é atendimento hoje", () => {
    expect(itens(QUEDA_CABECA, "alarme").some((i) => /mais de uma vez/.test(i.texto))).toBe(true);
    const umaVez = itens(QUEDA_CABECA, "maior-2").find((i) => /Vomitou uma vez/.test(i.texto))!;
    expect(desfecho(QUEDA_CABECA, [...ate(/2 anos ou mais/), sinais("maior-2", [umaVez.id])]).nivel).toBe("hoje");
  });

  it("o desfecho em casa orienta as 24 horas e diz que pode dormir", () => {
    const texto = QUEDA_CABECA.desfechos.casa.oQueFazer.join(" ");
    expect(texto).toMatch(/24/);
    expect(texto).toMatch(/pode dormir/);
    expect(texto).toMatch(/Não precisa acordá-la de hora em hora/);
  });
});

describe("manchas na pele", () => {
  it("o alarme tem o teste do copo", () => {
    expect(itens(MANCHAS_PELE, "alarme").some((i) => /copo de vidro/.test(i.texto))).toBe(true);
  });

  it("menos de 3 meses com febre vai a ps", () => {
    const r = [sinais("alarme"), escolha("febre", opcao(MANCHAS_PELE, "febre", /menos de 3 meses/))];
    expect(desfecho(MANCHAS_PELE, r).id).toBe("ps-bebe");
  });

  it("febre com sinais de Kawasaki, sarampo ou desidratação leva a atendimento hoje", () => {
    const base = [sinais("alarme"), escolha("febre", opcao(MANCHAS_PELE, "febre", /3 meses ou mais/))];
    for (const item of itens(MANCHAS_PELE, "febre-sinais")) {
      expect(desfecho(MANCHAS_PELE, [...base, sinais("febre-sinais", [item.id])]).nivel, item.texto).toBe("hoje");
    }
  });

  it("urticária sem outros sinais, brotoeja e picadas ficam em casa", () => {
    const tipo = (padrao: RegExp) => [sinais("alarme"), escolha("febre", opcao(MANCHAS_PELE, "febre", /^Não$/)), escolha("tipo", opcao(MANCHAS_PELE, "tipo", padrao))];
    expect(desfecho(MANCHAS_PELE, [...tipo(/Vergões/), sinais("urticaria")]).id).toBe("casa-urticaria");
    expect(desfecho(MANCHAS_PELE, tipo(/calor ou muita roupa/)).id).toBe("casa-brotoeja");
    expect(desfecho(MANCHAS_PELE, [...tipo(/picadas/), sinais("picadas")]).id).toBe("casa-picadas");
  });
});

describe("engasgo e objeto engolido", () => {
  const engoliu = (padrao: RegExp) => [
    escolha("agora", opcao(ENGASGO, "agora", /Engoliu um objeto/)),
    escolha("objeto", opcao(ENGASGO, "objeto", padrao)),
  ];

  it("a manobra de engasgo grave vem por idade, com 192 e sem varrer a boca às cegas", () => {
    const texto = ENGASGO.desfechos["ps-engasgo"].oQueFazer.join(" ");
    expect(texto).toMatch(/menos de 1 ano/);
    expect(texto).toMatch(/5 tapas/);
    expect(texto).toMatch(/5 compressões firmes no meio do peito/);
    expect(texto).toMatch(/não aperte a barriga/);
    expect(texto).toMatch(/1 ano ou mais/);
    expect(texto).toMatch(/Heimlich/);
    expect(texto).toMatch(/192/);
    expect(texto).toMatch(/Não coloque o dedo às cegas/);
  });

  it("quem tosse forte não recebe tapas: a orientação é deixar tossir", () => {
    const p = ENGASGO.passos.tossindo;
    expect(p.ajuda).toMatch(/não bata nas costas/);
  });

  it("bateria de botão vai a ps sem perguntar sintoma", () => {
    expect(desfecho(ENGASGO, engoliu(/Bateria de botão/)).id).toBe("ps-bateria");
  });

  it("ímã, objeto pontudo e remédio ou produto vão a ps", () => {
    expect(desfecho(ENGASGO, engoliu(/Ímã/)).nivel).toBe("ps");
    expect(desfecho(ENGASGO, engoliu(/pontudo/)).nivel).toBe("ps");
    expect(desfecho(ENGASGO, engoliu(/Remédio/)).nivel).toBe("ps");
  });

  it("moeda sem sintomas vai a atendimento hoje; com qualquer sintoma, ps", () => {
    expect(desfecho(ENGASGO, [...engoliu(/Moeda/), sinais("objeto-sinais")]).id).toBe("hoje-objeto");
    for (const item of itens(ENGASGO, "objeto-sinais")) {
      expect(desfecho(ENGASGO, [...engoliu(/Moeda/), sinais("objeto-sinais", [item.id])]).nivel, item.texto).toBe("ps");
    }
  });

  it("depois do engasgo: qualquer sinal vai a ps; quem precisou de manobras vai hoje; sem nada, casa", () => {
    const passou = escolha("agora", opcao(ENGASGO, "agora", /já passou/));
    for (const item of itens(ENGASGO, "depois")) {
      expect(desfecho(ENGASGO, [passou, sinais("depois", [item.id])]).nivel, item.texto).toBe("ps");
    }
    expect(desfecho(ENGASGO, [passou, sinais("depois"), escolha("manobras", opcao(ENGASGO, "manobras", /^Sim/))]).id).toBe("hoje-manobras");
    expect(desfecho(ENGASGO, [passou, sinais("depois"), escolha("manobras", opcao(ENGASGO, "manobras", /sozinha/))]).nivel).toBe("casa");
  });

  it("engasgo com líquido tem caminho próprio, sem tapas", () => {
    const r = [escolha("agora", opcao(ENGASGO, "agora", /líquido/)), escolha("liquido", opcao(ENGASGO, "liquido", /Parou de respirar/))];
    const d = desfecho(ENGASGO, r);
    expect(d.id).toBe("ps-liquido");
    expect(d.oQueFazer.join(" ")).not.toMatch(/tapas/);
  });

  it("não orienta mel (exigiria dose e é decisão do pediatra)", () => {
    expect(JSON.stringify(ENGASGO)).not.toMatch(/\bmel\b/i);
  });
});
