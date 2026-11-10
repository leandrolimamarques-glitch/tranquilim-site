import { describe, expect, it } from "vitest";
import { andar, validarFluxo, type Desfecho, type Fluxo, type Resposta } from "../../lib/fluxo";
import { RESPIRATORIO } from "./respiratorio";
import { VOMITO_DIARREIA } from "./vomito-diarreia";

/** Percorre todos os caminhos pelo motor (nenhum ou um sinal marcado; cada opção) e devolve onde cada um termina. */
function todosOsCaminhos(fluxo: Fluxo): { respostas: Resposta[]; desfecho: Desfecho }[] {
  const fim: { respostas: Resposta[]; desfecho: Desfecho }[] = [];
  const visitar = (respostas: Resposta[]) => {
    const e = andar(fluxo, respostas);
    if (e.tipo === "desfecho") {
      fim.push({ respostas, desfecho: e.desfecho });
      return;
    }
    const p = e.passo;
    if (p.tipo === "sinais") {
      visitar([...respostas, { passo: p.id, tipo: "sinais", marcados: [] }]);
      visitar([...respostas, { passo: p.id, tipo: "sinais", marcados: [p.itens[0].id] }]);
    } else {
      p.opcoes.forEach((_, i) => visitar([...respostas, { passo: p.id, tipo: "escolha", opcao: i }]));
    }
  };
  visitar([]);
  return fim;
}

function desfechoDe(fluxo: Fluxo, respostas: Resposta[]): Desfecho {
  const e = andar(fluxo, respostas);
  if (e.tipo !== "desfecho") throw new Error(`parou no passo ${e.passo.id}`);
  return e.desfecho;
}

const nenhum = (passo: string): Resposta => ({ passo, tipo: "sinais", marcados: [] });
const opcao = (passo: string, i: number): Resposta => ({ passo, tipo: "escolha", opcao: i });

for (const fluxo of [RESPIRATORIO, VOMITO_DIARREIA]) {
  describe(`fluxo ${fluxo.id}: regras comuns`, () => {
    it("é válido: todo destino existe e tudo é alcançável", () => {
      expect(validarFluxo(fluxo)).toEqual([]);
    });

    it("qualquer sinal de alarme do primeiro passo leva ao pronto-socorro", () => {
      const passo = fluxo.passos[fluxo.inicio];
      if (passo.tipo !== "sinais") throw new Error("o primeiro passo tem de ser a lista de alarme");
      expect(passo.itens.length).toBeGreaterThan(0);
      for (const item of passo.itens) {
        const d = desfechoDe(fluxo, [{ passo: passo.id, tipo: "sinais", marcados: [item.id] }]);
        expect(d.nivel, item.texto).toBe("ps");
      }
    });

    it("não fala em dose de remédio nem em volume", () => {
      const texto = JSON.stringify(fluxo);
      expect(texto).not.toMatch(/\d\s?(mg|ml|mL|gotas)/i);
      expect(texto.toLowerCase()).not.toMatch(/\d+\s*(mg|ml|gotas)/);
    });

    it("algum caminho chega a cada nível: ps, hoje e casa", () => {
      const niveis = new Set(todosOsCaminhos(fluxo).map((c) => c.desfecho.nivel));
      expect([...niveis].sort()).toEqual(["casa", "hoje", "ps"]);
    });

    it("todo desfecho é alcançado pelo motor", () => {
      const alcancados = new Set(todosOsCaminhos(fluxo).map((c) => c.desfecho.id));
      expect([...alcancados].sort()).toEqual(Object.keys(fluxo.desfechos).sort());
    });

    it("desfecho de pronto-socorro cita o 192; hoje e casa dizem quando voltar", () => {
      for (const d of Object.values(fluxo.desfechos)) {
        if (d.nivel === "ps") expect(d.oQueFazer.join(" "), d.id).toContain("192");
        else expect(d.volteSe?.length ?? 0, d.id).toBeGreaterThan(0);
      }
    });

    it("ids de itens são únicos em cada passo", () => {
      for (const p of Object.values(fluxo.passos)) {
        if (p.tipo !== "sinais") continue;
        const ids = p.itens.map((i) => i.id);
        expect(new Set(ids).size, p.id).toBe(ids.length);
      }
    });
  });
}

describe("fluxo respiratório: caminhos", () => {
  const F = RESPIRATORIO;

  it("respiração de 60 ou mais por minuto vai ao pronto-socorro em qualquer idade", () => {
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 0), opcao("contar-bebe", 1)]).nivel).toBe("ps");
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 1), opcao("contar-lactente", 2)]).nivel).toBe("ps");
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 2), opcao("contar-crianca", 2)]).nivel).toBe("ps");
  });

  it("respiração rápida para a idade (OMS) procura atendimento hoje", () => {
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 1), opcao("contar-lactente", 1)]).id).toBe("hoje-rapida");
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 2), opcao("contar-crianca", 1)]).id).toBe("hoje-rapida");
  });

  it("bebê com menos de 3 meses nunca fica em casa", () => {
    const daqui = todosOsCaminhos(F).filter((c) =>
      c.respostas.some((r) => r.passo === "idade" && r.tipo === "escolha" && r.opcao === 0),
    );
    expect(daqui.length).toBeGreaterThan(0);
    for (const c of daqui) expect(c.desfecho.nivel).not.toBe("casa");
    expect(desfechoDe(F, [nenhum("alarme"), opcao("idade", 0), opcao("contar-bebe", 0), nenhum("bebe")]).id).toBe("hoje-bebe");
  });

  it("qualquer sinal do bebê pequeno leva ao pronto-socorro", () => {
    const passo = F.passos.bebe;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    for (const item of passo.itens) {
      const d = desfechoDe(F, [
        nenhum("alarme"),
        opcao("idade", 0),
        opcao("contar-bebe", 0),
        { passo: "bebe", tipo: "sinais", marcados: [item.id] },
      ]);
      expect(d.nivel, item.texto).toBe("ps");
    }
  });

  it("não conseguir contar não encerra o fluxo: segue para os sinais de atenção", () => {
    const e = andar(F, [nenhum("alarme"), opcao("idade", 2), opcao("contar-crianca", 3)]);
    expect(e.tipo === "passo" && e.passo.id).toBe("atencao");
  });

  it("qualquer sinal de atenção leva a atendimento hoje; nenhum, a cuidar em casa", () => {
    const passo = F.passos.atencao;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    const base = [nenhum("alarme"), opcao("idade", 2), opcao("contar-crianca", 0)];
    for (const item of passo.itens) {
      const d = desfechoDe(F, [...base, { passo: "atencao", tipo: "sinais", marcados: [item.id] }]);
      expect(d.nivel, item.texto).toBe("hoje");
    }
    expect(desfechoDe(F, [...base, nenhum("atencao")]).nivel).toBe("casa");
  });
});

describe("fluxo de vômito e diarreia: caminhos", () => {
  const F = VOMITO_DIARREIA;

  it("bebê com menos de 3 meses e vômitos repetidos vai ao pronto-socorro", () => {
    const d = desfechoDe(F, [nenhum("alarme"), opcao("idade", 0), { passo: "bebe", tipo: "sinais", marcados: ["bebe-1"] }]);
    expect(d.id).toBe("ps-bebe");
  });

  it("bebê com menos de 3 meses com diarreia procura atendimento hoje; só golfada fica em casa", () => {
    const base = [nenhum("alarme"), opcao("idade", 0), nenhum("bebe")];
    expect(desfechoDe(F, [...base, opcao("bebe-o-que", 0)]).id).toBe("hoje-bebe");
    expect(desfechoDe(F, [...base, opcao("bebe-o-que", 1)]).id).toBe("casa-golfada");
  });

  it("qualquer sinal de desidratação leva a atendimento nas próximas horas", () => {
    const passo = F.passos.desidratacao;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    for (const item of passo.itens) {
      const d = desfechoDe(F, [nenhum("alarme"), opcao("idade", 1), { passo: "desidratacao", tipo: "sinais", marcados: [item.id] }]);
      expect(d.id, item.texto).toBe("hoje-desidratacao");
    }
  });

  it("sinais de alerta do Plano A levam a atendimento hoje; nenhum, a cuidar em casa", () => {
    const passo = F.passos.atencao;
    if (passo.tipo !== "sinais") throw new Error("passo errado");
    const base = [nenhum("alarme"), opcao("idade", 1), nenhum("desidratacao")];
    for (const item of passo.itens) {
      const d = desfechoDe(F, [...base, { passo: "atencao", tipo: "sinais", marcados: [item.id] }]);
      expect(d.nivel, item.texto).toBe("hoje");
    }
    expect(desfechoDe(F, [...base, nenhum("atencao")]).id).toBe("casa");
  });

  it("não recomenda remédio para vômito ou diarreia", () => {
    const texto = JSON.stringify(F).toLowerCase();
    expect(texto).not.toMatch(/ondansetrona|loperamida|racecadotril|probi[óo]tico|zinco/);
  });
});
