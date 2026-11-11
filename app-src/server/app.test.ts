import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { bancoMemoria, migrar, type Banco } from "./banco";
import { criarApp } from "./app";
import type { LeituraCarteira } from "./leitura";
import { gravar, type Doc } from "../src/lib/sinc";
import { docParaVista } from "../src/lib/familia";

let banco: Banco;
let servidor: Server;
let base = "";
let leituras = 0;

const leituraFalsa: LeituraCarteira = {
  legivel: true,
  observacao: "",
  registros: [{ calendarioId: "bcg", nomeNaCarteira: "BCG", data: "2026-01-02", confianca: "alta", nota: "" }],
};

beforeAll(async () => {
  banco = await bancoMemoria();
  expect(await migrar(banco)).toBe(3);
  expect(await migrar(banco)).toBe(0);
  const app = criarApp({ banco, cookieSeguro: false, cadastroAberto: true, leitor: async () => (leituras++, leituraFalsa) });
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

const PERFIL = { nome: "Dra. Joana Exemplo", registro: "CRM-SP 000001", whatsapp: "11987654321" };

describe("servidor", () => {
  const medico = navegador();
  const intruso = navegador();
  const mae = navegador();
  const pai = navegador();
  let pacienteId = "";
  let convite = "";

  it("cadastra o médico e recusa senha curta, e-mail repetido e senha errada", async () => {
    expect((await medico("POST", "/api/medico/cadastro", { ...PERFIL, email: "a@b.com", senha: "123" })).status).toBe(400);
    const ok = await medico("POST", "/api/medico/cadastro", { ...PERFIL, email: "Joana@Exemplo.com", senha: "segredo123" });
    expect(ok.status).toBe(200);
    expect((await medico("POST", "/api/medico/cadastro", { ...PERFIL, email: "joana@exemplo.com", senha: "segredo123" })).status).toBe(409);
    expect((await intruso("POST", "/api/medico/entrar", { email: "joana@exemplo.com", senha: "errada123" })).status).toBe(401);
    expect((await medico("GET", "/api/medico/eu")).corpo.medico.email).toBe("joana@exemplo.com");
  });

  it("cadastra paciente e só o próprio médico enxerga", async () => {
    const r = await medico("POST", "/api/medico/pacientes", { crianca: { nome: "Ana Júlia", nascimento: "2026-01-01", sexo: "menina" }, responsavel: "Mariana", whatsapp: "11912345678" });
    expect(r.status).toBe(200);
    pacienteId = r.corpo.id;
    const lista = await medico("GET", "/api/medico/pacientes");
    expect(lista.corpo.pacientes).toHaveLength(1);
    convite = lista.corpo.pacientes[0].convite;
    expect(convite.length).toBeGreaterThan(20);
    expect(lista.corpo.pacientes[0].resumo.vacinasPendentes).toBeGreaterThan(0);

    await intruso("POST", "/api/medico/cadastro", { ...PERFIL, email: "outro@x.com", senha: "segredo123" });
    expect((await intruso("GET", `/api/medico/pacientes/${pacienteId}/doc`)).status).toBe(404);
    expect((await intruso("GET", "/api/medico/pacientes")).corpo.pacientes).toHaveLength(0);
    expect((await mae("GET", "/api/medico/pacientes")).status).toBe(401);
  });

  it("convite: mostra médico e criança, exige consentimento e liga o celular", async () => {
    const info = await mae("GET", `/api/convite/${convite}`);
    expect(info.corpo.medico.nome).toBe(PERFIL.nome);
    expect(info.corpo.crianca.nome).toBe("Ana Júlia");
    expect((await mae("POST", `/api/convite/${convite}/aceitar`, {})).status).toBe(400);
    const aceito = await mae("POST", `/api/convite/${convite}/aceitar`, { consentimento: true });
    expect(aceito.status).toBe(200);
    expect(docParaVista(aceito.corpo.doc).crianca?.nome).toBe("Ana Júlia");
    expect((await medico("GET", "/api/medico/pacientes")).corpo.pacientes[0].ativadoEm).toBeTruthy();
  });

  it("mãe, pai e médico escrevem ao mesmo tempo e nada se perde", async () => {
    const t = Date.now();
    const daMae = gravar({}, "diario", { id: "d1", tipo: "mamada", quando: "2026-11-10T03:00:00Z" }, t);
    const doPai = gravar({}, "diario", { id: "d2", tipo: "xixi", quando: "2026-11-10T03:10:00Z" }, t);
    await pai("POST", `/api/convite/${convite}/aceitar`, { consentimento: true });
    const doMedico = gravar({}, "medidas", { id: "m1", data: "2026-11-10", pesoKg: 7.2, origem: "consulta" }, t);
    await Promise.all([
      mae("PUT", "/api/familia/doc", { doc: daMae }),
      pai("PUT", "/api/familia/doc", { doc: doPai }),
      medico("PUT", `/api/medico/pacientes/${pacienteId}/doc`, { doc: doMedico }),
    ]);
    const final = docParaVista((await mae("GET", "/api/familia")).corpo.doc as Doc);
    expect(final.diario.map((d) => d.id).sort()).toEqual(["d1", "d2"]);
    expect(final.medidas[0].pesoKg).toBe(7.2);
  });

  it("documento inválido é recusado", async () => {
    expect((await mae("PUT", "/api/familia/doc", { doc: { diario: { x: { id: "y", em: 1 } } } })).status).toBe(400);
  });

  it("carteira: envia foto, lê em segundo plano, médico vê e baixa", async () => {
    const foto = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
    const env = await mae("POST", "/api/carteira", foto, "image/jpeg");
    expect(env.status).toBe(200);
    await new Promise((r) => setTimeout(r, 100));
    const lista = await medico("GET", `/api/carteira?paciente=${pacienteId}`);
    expect(lista.corpo.carteiras[0].leitura.registros[0].calendarioId).toBe("bcg");
    expect(leituras).toBe(1);
    const arq = await fetch(`${base}/api/carteira/${env.corpo.id}/arquivo`);
    expect(arq.status).toBe(401);
    expect((await intruso("GET", `/api/carteira?paciente=${pacienteId}`)).status).toBe(404);
    expect((await mae("POST", "/api/carteira", "texto", "text/plain")).status).toBe(400);
  });

  it("financeiro é do médico e sincroniza", async () => {
    const doc = gravar({}, "fontes", { id: "f1", nome: "Convênio A", tipo: "convenio" });
    expect((await medico("PUT", "/api/medico/financeiro", { doc })).corpo.doc.fontes.f1.nome).toBe("Convênio A");
    expect((await intruso("GET", "/api/medico/financeiro")).corpo.doc).toEqual({});
  });

  it("novo link derruba o antigo; remover paciente desliga a família", async () => {
    const novo = await medico("POST", `/api/medico/pacientes/${pacienteId}/novo-link`);
    expect((await intruso("GET", `/api/convite/${convite}`)).status).toBe(404);
    expect((await intruso("GET", `/api/convite/${novo.corpo.convite}`)).status).toBe(200);
    expect((await mae("GET", "/api/familia")).status).toBe(200);
    await medico("DELETE", `/api/medico/pacientes/${pacienteId}`);
    expect((await mae("GET", "/api/familia")).status).toBe(401);
  });

  it("sair encerra a sessão", async () => {
    await medico("POST", "/api/sair", { tipo: "medico" });
    expect((await medico("GET", "/api/medico/eu")).status).toBe(401);
  });
});

describe("assistente", () => {
  it("emergência não passa pela IA, dose escapada vira pediatra, limite por dia", async () => {
    const { ehEmergencia, validarResposta, corpoDeReferencia } = await import("./pergunta");
    expect(ehEmergencia("meu filho está roxo e não respira")).toBe(true);
    expect(ehEmergencia("Ele engoliu uma pilha de relógio")).toBe(true);
    expect(ehEmergencia("como fazer introdução alimentar")).toBe(false);
    expect(validarResposta({ tipo: "orientacao", resposta: "Dê 10 gotas de dipirona", fluxo: "" }).tipo).toBe("medico");
    expect(validarResposta({ tipo: "fluxo", resposta: "Veja o fluxo.", fluxo: "inventado" }).fluxo).toBe("");
    expect(corpoDeReferencia()).toContain("Engasgo");

    let chamadas = 0;
    const b2 = await bancoMemoria();
    await migrar(b2);
    const app = criarApp({ banco: b2, cookieSeguro: false, cadastroAberto: true, limitePerguntas: 2, assistente: async () => (chamadas++, { tipo: "orientacao", resposta: "ok", fluxo: "" }) });
    const s = app.listen(0);
    const antigo = base;
    base = `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
    const m = navegador();
    const f = navegador();
    await m("POST", "/api/medico/cadastro", { ...PERFIL, email: "x@y.com", senha: "segredo123" });
    const { corpo } = await m("POST", "/api/medico/pacientes", { crianca: { nome: "Lia", nascimento: "2026-01-01", sexo: "menina" } });
    const conv = (await m("GET", "/api/medico/pacientes")).corpo.pacientes[0].convite;
    await f("POST", `/api/convite/${conv}/aceitar`, { consentimento: true });
    expect((await f("POST", "/api/pergunta", { pergunta: "ela convulsionou agora" })).corpo.tipo).toBe("emergencia");
    expect(chamadas).toBe(0);
    expect((await f("POST", "/api/pergunta", { pergunta: "quando começar a papinha?" })).corpo.resposta).toBe("ok");
    expect((await f("POST", "/api/pergunta", { pergunta: "mais uma" })).status).toBe(429);
    expect((await m("GET", `/api/perguntas?paciente=${corpo.id}`)).corpo.perguntas).toHaveLength(2);
    s.close();
    base = antigo;
    await b2.fechar();
  });
});
