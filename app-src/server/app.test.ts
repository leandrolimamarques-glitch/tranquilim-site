import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { bancoMemoria, migrar, type Banco } from "./banco";
import { criarApp } from "./app";
import type { LeituraCarteira } from "./leitura";
import { ehEmergencia, validarResposta, corpoDeReferencia } from "./pergunta";
import { gravar } from "../src/lib/sinc";
import { docParaVista } from "../src/lib/familia";

let banco: Banco;
let servidor: Server;
let base = "";
let leituras = 0;
let perguntas = 0;

const leituraFalsa: LeituraCarteira = {
  legivel: true,
  observacao: "",
  registros: [{ calendarioId: "bcg", nomeNaCarteira: "BCG", data: "2026-01-02", confianca: "alta", nota: "" }],
};

beforeAll(async () => {
  banco = await bancoMemoria();
  expect(await migrar(banco)).toBeGreaterThan(0);
  expect(await migrar(banco)).toBe(0);
  const app = criarApp({
    banco,
    cookieSeguro: false,
    limitePerguntas: 3,
    leitor: async () => (leituras++, leituraFalsa),
    assistente: async () => (perguntas++, { tipo: "orientacao", resposta: "ok", fluxo: "" }),
  });
  servidor = app.listen(0);
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
}, 30_000);

afterAll(async () => {
  servidor?.close();
  await banco?.fechar();
});

/** Cliente com pote de cookies, como um navegador. */
function navegador() {
  const pote = new Map<string, string>();
  return async (metodo: string, rota: string, corpo?: unknown, tipo = "application/json") => {
    const r = await fetch(base + rota, {
      method: metodo,
      headers: { "content-type": tipo, cookie: [...pote].map(([k, v]) => `${k}=${v}`).join("; ") },
      body: corpo === undefined ? undefined : tipo === "application/json" ? JSON.stringify(corpo) : (corpo as BodyInit),
    });
    for (const c of r.headers.getSetCookie()) {
      const [par] = c.split(";");
      const [k, v] = par.split("=");
      if (c.includes("Expires=Thu, 01 Jan 1970")) pote.delete(k);
      else pote.set(k, v);
    }
    const texto = await r.text();
    return { status: r.status, corpo: texto ? JSON.parse(texto) : null };
  };
}

describe("contas, crianças e pediatras", () => {
  const dono = navegador();
  const chicao = navegador();
  const mae = navegador();
  const pai = navegador();
  const estranho = navegador();
  let joao = "";
  let chicaoId = "";

  it("a primeira conta é o dono; as outras são família", async () => {
    expect((await dono("POST", "/api/conta/cadastro", { nome: "Leandro", email: "dono@x.com", senha: "123" })).status).toBe(400);
    expect((await dono("POST", "/api/conta/cadastro", { nome: "Leandro", email: "Dono@X.com", senha: "segredo123" })).status).toBe(200);
    const eu = (await dono("GET", "/api/conta")).corpo.conta;
    expect(eu.dono).toBe(true);
    expect(eu.pediatra).toBe(true);
    await chicao("POST", "/api/conta/cadastro", { nome: "Chicão", email: "chicao@x.com", senha: "segredo123" });
    const c = (await chicao("GET", "/api/conta")).corpo.conta;
    chicaoId = c.id;
    expect(c.dono).toBe(false);
    expect(c.pediatra).toBe(false);
    expect((await chicao("POST", "/api/conta/cadastro", { nome: "Xavier", email: "chicao@x.com", senha: "segredo123" })).status).toBe(409);
    expect((await estranho("POST", "/api/conta/entrar", { email: "chicao@x.com", senha: "errada123" })).status).toBe(401);
  });

  it("só o dono ativa pediatra; antes disso não há painel", async () => {
    expect((await chicao("GET", "/api/pediatra/pacientes")).status).toBe(403);
    expect((await chicao("GET", "/api/admin/contas")).status).toBe(403);
    const lista = (await dono("GET", "/api/admin/contas?busca=chic")).corpo.contas;
    expect(lista).toHaveLength(1);
    await dono("PUT", `/api/admin/contas/${chicaoId}`, { pediatra: true, registro: "CRM-SP 1" });
    expect((await chicao("GET", "/api/pediatra/pacientes")).status).toBe(200);
    expect((await chicao("GET", "/api/pediatras?busca=chi")).corpo.pediatras[0].nome).toBe("Chicão");
  });

  it("família cadastra criança e escolhe o pediatra da rede; ele passa a ver", async () => {
    await mae("POST", "/api/conta/cadastro", { nome: "Mariana", email: "mae@x.com", senha: "segredo123" });
    joao = (await mae("POST", "/api/criancas", { crianca: { nome: "João", nascimento: "2026-01-01", sexo: "menino" } })).corpo.id;
    expect((await mae("GET", "/api/conta")).corpo.criancas[0].crianca.nome).toBe("João");
    expect((await chicao("GET", `/api/criancas/${joao}/doc`)).status).toBe(404);
    await mae("POST", `/api/criancas/${joao}/pediatra`, { pediatraId: chicaoId });
    const pac = (await chicao("GET", "/api/pediatra/pacientes")).corpo.pacientes;
    expect(pac[0].crianca.nome).toBe("João");
    expect(pac[0].responsaveis).toBe("Mariana");
    expect((await mae("GET", "/api/conta")).corpo.criancas[0].pediatras[0].nome).toBe("Chicão");
  });

  it("pediatra pede pelo e-mail; só entra depois que a família aceita", async () => {
    const irma = (await mae("POST", "/api/criancas", { crianca: { nome: "Bia", nascimento: "2024-05-01", sexo: "menina" } })).corpo.id;
    expect((await dono("POST", "/api/pediatra/pedidos", { email: "mae@x.com" })).corpo.temConta).toBe(true);
    expect((await dono("GET", `/api/criancas/${irma}/doc`)).status).toBe(404);
    const pedidos = (await mae("GET", "/api/conta")).corpo.pedidos;
    expect(pedidos[0].pediatra.nome).toBe("Leandro");
    expect((await estranho("POST", `/api/conta/pedidos/${pedidos[0].id}/aceitar`, { criancas: [irma] })).status).toBe(401);
    await mae("POST", `/api/conta/pedidos/${pedidos[0].id}/aceitar`, { criancas: [irma] });
    expect((await dono("GET", `/api/criancas/${irma}/doc`)).status).toBe(200);
    expect((await dono("GET", `/api/criancas/${joao}/doc`)).status).toBe(404);
    expect((await mae("GET", "/api/conta")).corpo.pedidos).toHaveLength(0);
  });

  it("pai entra como outro responsável; mãe, pai e pediatra escrevem juntos sem perder nada", async () => {
    await pai("POST", "/api/conta/cadastro", { nome: "Paulo", email: "pai@x.com", senha: "segredo123" });
    expect((await mae("POST", `/api/criancas/${joao}/responsaveis`, { email: "ninguem@x.com" })).status).toBe(404);
    await mae("POST", `/api/criancas/${joao}/responsaveis`, { email: "pai@x.com" });
    const t = Date.now();
    await Promise.all([
      mae("PUT", `/api/criancas/${joao}/doc`, { doc: gravar({}, "diario", { id: "d1", tipo: "mamada", quando: "2026-11-10T03:00:00Z" }, t) }),
      pai("PUT", `/api/criancas/${joao}/doc`, { doc: gravar({}, "diario", { id: "d2", tipo: "xixi", quando: "2026-11-10T03:10:00Z" }, t) }),
      chicao("PUT", `/api/criancas/${joao}/doc`, { doc: gravar({}, "medidas", { id: "m1", data: "2026-11-10", pesoKg: 7.2, origem: "consulta" }, t) }),
    ]);
    const v = docParaVista((await pai("GET", `/api/criancas/${joao}/doc`)).corpo.doc);
    expect(v.diario.map((d) => d.id).sort()).toEqual(["d1", "d2"]);
    expect(v.medidas[0].pesoKg).toBe(7.2);
    expect(v.crianca?.nome).toBe("João");
    expect((await estranho("GET", `/api/criancas/${joao}/doc`)).status).toBe(401);
  });

  it("pediatra não edita o cadastro da criança; desativado, perde o acesso", async () => {
    expect((await chicao("PUT", `/api/criancas/${joao}`, { crianca: { nome: "Outro", nascimento: "2026-01-01", sexo: "menino" } })).status).toBe(403);
    await dono("PUT", `/api/admin/contas/${chicaoId}`, { pediatra: false });
    expect((await chicao("GET", `/api/criancas/${joao}/doc`)).status).toBe(404);
    await dono("PUT", `/api/admin/contas/${chicaoId}`, { pediatra: true });
    expect((await chicao("GET", `/api/criancas/${joao}/doc`)).status).toBe(200);
  });

  it("carteira: família envia, lê em segundo plano, pediatra vê", async () => {
    const env = await mae("POST", `/api/carteira?crianca=${joao}`, new Uint8Array([0xff, 0xd8, 0xff, 1]), "image/jpeg");
    expect(env.status).toBe(200);
    await new Promise((r) => setTimeout(r, 100));
    const lista = (await chicao("GET", `/api/carteira?crianca=${joao}`)).corpo.carteiras;
    expect(lista[0].leitura.registros[0].calendarioId).toBe("bcg");
    expect(lista[0].enviadoPor).toBe("familia");
    expect(leituras).toBe(1);
    expect((await estranho("GET", `/api/carteira?crianca=${joao}`)).status).toBe(401);
  });

  it("perguntas: emergência sem IA, limite por dia, pediatra vê", async () => {
    expect((await mae("POST", `/api/pergunta?crianca=${joao}`, { pergunta: "ele convulsionou agora" })).corpo.tipo).toBe("emergencia");
    expect(perguntas).toBe(0);
    expect((await mae("POST", `/api/pergunta?crianca=${joao}`, { pergunta: "quando começar a papinha?" })).corpo.resposta).toBe("ok");
    await mae("POST", `/api/pergunta?crianca=${joao}`, { pergunta: "outra dúvida" });
    expect((await mae("POST", `/api/pergunta?crianca=${joao}`, { pergunta: "mais uma" })).status).toBe(429);
    expect((await chicao("GET", `/api/perguntas?crianca=${joao}`)).corpo.perguntas).toHaveLength(3);
  });

  it("financeiro é de cada pediatra; administrador redefine senha", async () => {
    const doc = gravar({}, "fontes", { id: "f1", nome: "Convênio A", tipo: "convenio" });
    expect((await chicao("PUT", "/api/pediatra/financeiro", { doc })).corpo.doc.fontes.f1.nome).toBe("Convênio A");
    expect((await dono("GET", "/api/pediatra/financeiro")).corpo.doc).toEqual({});
    expect((await mae("GET", "/api/pediatra/financeiro")).status).toBe(403);
    await dono("PUT", `/api/admin/contas/${chicaoId}/senha`, { senha: "provisoria1" });
    expect((await chicao("GET", "/api/conta")).status).toBe(401);
    expect((await chicao("POST", "/api/conta/entrar", { email: "chicao@x.com", senha: "provisoria1" })).status).toBe(200);
  });

  it("sair encerra a sessão", async () => {
    await mae("POST", "/api/conta/sair");
    expect((await mae("GET", "/api/conta")).status).toBe(401);
  });
});

describe("assistente", () => {
  it("emergência é barrada antes da IA e dose escapada vira pediatra", () => {
    expect(ehEmergencia("meu filho está roxo e não respira")).toBe(true);
    expect(ehEmergencia("Ele engoliu uma pilha de relógio")).toBe(true);
    expect(ehEmergencia("como fazer introdução alimentar")).toBe(false);
    expect(validarResposta({ tipo: "orientacao", resposta: "Dê 10 gotas de dipirona", fluxo: "" }).tipo).toBe("medico");
    expect(validarResposta({ tipo: "fluxo", resposta: "Veja o fluxo.", fluxo: "inventado" }).fluxo).toBe("");
    expect(corpoDeReferencia()).toContain("Engasgo");
  });
});
