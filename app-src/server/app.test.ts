import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { bancoMemoria, migrar, type Banco } from "./banco";
import { criarApp } from "./app";
import type { LeituraCarteira } from "./leitura";
import { ehEmergencia, validarResposta, corpoDeReferencia } from "./pergunta";
import { gravar } from "../src/lib/sinc";
import { docParaVista } from "../src/lib/familia";
import { VERSAO_TERMOS } from "../src/conteudo/versao-termos";
import { enviarLembretes, resumoVacinas } from "./lembretes";

let banco: Banco;
let servidor: Server;
let base = "";
let leituras = 0;
let perguntas = 0;
let ultimoContexto: Record<string, unknown> = {};

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
    assistente: async (_p, ctx) => (perguntas++, (ultimoContexto = ctx), { tipo: "orientacao", resposta: "ok", fluxo: "" }),
  });
  servidor = app.listen(0);
  base = `http://127.0.0.1:${(servidor.address() as AddressInfo).port}`;
}, 30_000);

afterAll(async () => {
  servidor?.close();
  await banco?.fechar();
});

const base0 = () => base;

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
    expect((await dono("POST", "/api/conta/cadastro", { nome: "Leandro", email: "dono@x.com", senha: "123", aceite: VERSAO_TERMOS })).status).toBe(400);
    expect((await dono("POST", "/api/conta/cadastro", { nome: "Leandro", email: "dono@x.com", senha: "segredo123" })).status).toBe(400);
    expect((await dono("POST", "/api/conta/cadastro", { nome: "Leandro", email: "Dono@X.com", senha: "segredo123", aceite: VERSAO_TERMOS })).status).toBe(200);
    const eu = (await dono("GET", "/api/conta")).corpo.conta;
    expect(eu.dono).toBe(true);
    expect(eu.pediatra).toBe(true);
    await chicao("POST", "/api/conta/cadastro", { nome: "Chicão", email: "chicao@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const c = (await chicao("GET", "/api/conta")).corpo.conta;
    chicaoId = c.id;
    expect(c.dono).toBe(false);
    expect(c.pediatra).toBe(false);
    expect((await chicao("POST", "/api/conta/cadastro", { nome: "Xavier", email: "chicao@x.com", senha: "segredo123", aceite: VERSAO_TERMOS })).status).toBe(409);
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
    await mae("POST", "/api/conta/cadastro", { nome: "Mariana", email: "mae@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
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
    await pai("POST", "/api/conta/cadastro", { nome: "Paulo", email: "pai@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
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

  it("regras da IA: só o dono edita, e chegam à IA", async () => {
    expect((await mae("PUT", "/api/admin/ia", { regras: "x" })).status).toBe(403);
    await dono("PUT", "/api/admin/ia", { regras: "Sempre lembrar do soro de reidratação na diarreia." });
    const r = (await dono("GET", "/api/admin/ia")).corpo;
    expect(r.regras).toContain("soro");
    expect(r.perguntas.length).toBeGreaterThan(0);
  });

  it("erros do aparelho e sugestões chegam ao painel do dono", async () => {
    await mae("POST", "/api/erro", { mensagem: "TypeError: x is undefined", pilha: "at A\nat B", onde: "#/caderneta" });
    await estranho("POST", "/api/erro", { mensagem: "sem conta" });
    expect((await estranho("POST", "/api/sugestao", { texto: "oi" })).status).toBe(401);
    expect((await mae("POST", "/api/sugestao", { texto: "Faltou receita\nde sopa" })).status).toBe(200);
    expect((await mae("GET", "/api/admin/painel")).status).toBe(403);
    const p = (await dono("GET", "/api/admin/painel")).corpo;
    expect(p.numeros.contas).toBeGreaterThanOrEqual(4);
    expect(p.numeros.erros7).toBe(2);
    expect(p.sugestoes[0].texto).toBe("Faltou receita\nde sopa");
    expect(p.erros.find((e: { mensagem: string }) => e.mensagem.startsWith("TypeError")).pilha).toBe("at A\nat B");
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
    expect(ehEmergencia("tenho vontade de machucar o bebê")).toBe(true);
    expect(ehEmergencia("quero morrer, não aguento mais")).toBe(true);
    expect(validarResposta({ tipo: "orientacao", resposta: "Dê 10 gotas de dipirona", fluxo: "" }).tipo).toBe("medico");
    expect(validarResposta({ tipo: "fluxo", resposta: "Veja o fluxo.", fluxo: "inventado" }).fluxo).toBe("");
    expect(corpoDeReferencia()).toContain("Engasgo");
  });
});

describe("e-mail: confirmação e esqueci a senha", () => {
  it("manda link de confirmação e de senha nova; o link vale uma vez", async () => {
    const b2 = await bancoMemoria();
    await migrar(b2);
    const caixa: { para: string; texto: string }[] = [];
    const app = criarApp({ banco: b2, cookieSeguro: false, urlBase: "https://app.x", carteiro: async (m) => void caixa.push({ para: m.para, texto: m.texto }) });
    const s = app.listen(0);
    const antigo = base;
    base = `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
    try {
      const a = navegador();
      await a("POST", "/api/conta/cadastro", { nome: "Ana", email: "ana@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
      await new Promise((r) => setTimeout(r, 50));
      expect((await a("GET", "/api/conta")).corpo.conta.emailVerificado).toBe(false);
      const conf = caixa[0].texto.match(/#\/confirmar\/(\S+)/)![1];
      expect((await a("POST", "/api/conta/confirmar", { token: conf })).status).toBe(200);
      expect((await a("POST", "/api/conta/confirmar", { token: conf })).status).toBe(400);
      expect((await a("GET", "/api/conta")).corpo.conta.emailVerificado).toBe(true);

      const outro = navegador();
      await outro("POST", "/api/conta/esqueci", { email: "ninguem@x.com" });
      expect(caixa).toHaveLength(1);
      await outro("POST", "/api/conta/esqueci", { email: "ana@x.com" });
      const t = caixa[1].texto.match(/#\/redefinir\/(\S+)/)![1];
      expect((await outro("POST", "/api/conta/redefinir", { token: t, senha: "novasenha1" })).status).toBe(200);
      expect((await a("GET", "/api/conta")).status).toBe(401);
      expect((await outro("GET", "/api/conta")).corpo.conta.email).toBe("ana@x.com");
      expect((await outro("POST", "/api/conta/redefinir", { token: t, senha: "outra12345" })).status).toBe(400);
    } finally {
      s.close();
      base = antigo;
      await b2.fechar();
    }
  });
});

describe("LGPD: aceite, cópia dos dados e exclusão", () => {
  it("aceite fica registrado; exportar traz tudo; excluir apaga a criança sem outro responsável e preserva a compartilhada", async () => {
    const dona = navegador();
    const avo = navegador();
    await dona("POST", "/api/conta/cadastro", { nome: "Beatriz", email: "bia@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    await avo("POST", "/api/conta/cadastro", { nome: "Vó Lurdes", email: "vo@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const s = (await dona("GET", "/api/conta")).corpo;
    expect(s.termos).toEqual({ versao: VERSAO_TERMOS, aceito: true });
    const so = (await dona("POST", "/api/criancas", { crianca: { nome: "Lia", nascimento: "2025-01-10", sexo: "menina" } })).corpo.id;
    const junta = (await dona("POST", "/api/criancas", { crianca: { nome: "Davi", nascimento: "2024-05-02", sexo: "menino" } })).corpo.id;
    await dona("POST", `/api/criancas/${junta}/responsaveis`, { email: "vo@x.com" });
    await dona("POST", "/api/pergunta?crianca=" + so, { pergunta: "Quando começa a papinha?" });

    const exp = (await dona("GET", "/api/conta/exportar")).corpo;
    expect(exp.conta.email).toBe("bia@x.com");
    expect(exp.conta.consentimento_versao).toBe(VERSAO_TERMOS);
    expect(exp.conta.senha_hash).toBeUndefined();
    expect(exp.criancas.map((k: { nome: string }) => k.nome).sort()).toEqual(["Davi", "Lia"]);
    expect(exp.criancas.find((k: { nome: string }) => k.nome === "Lia").perguntas.length).toBe(1);

    expect((await dona("POST", "/api/conta/excluir", { senha: "errada" })).status).toBe(400);
    expect((await dona("POST", "/api/conta/excluir", { senha: "segredo123" })).status).toBe(200);
    expect((await dona("GET", "/api/conta")).status).toBe(401);
    expect((await dona("POST", "/api/conta/entrar", { email: "bia@x.com", senha: "segredo123" })).status).toBe(401);
    expect(await banco.q(`select 1 from criancas where id = $1`, [so])).toHaveLength(0);
    expect(await banco.q(`select 1 from perguntas where crianca_id = $1`, [so])).toHaveLength(0);
    const vo = (await avo("GET", "/api/conta")).corpo;
    expect(vo.criancas.map((k: { crianca: { nome: string } }) => k.crianca.nome)).toEqual(["Davi"]);
  });

  it("o único administrador não exclui a própria conta; termos novos pedem novo aceite", async () => {
    const d = navegador();
    await d("POST", "/api/conta/entrar", { email: "dono@x.com", senha: "segredo123" });
    expect((await d("POST", "/api/conta/excluir", { senha: "segredo123" })).status).toBe(400);
    await banco.q(`update contas set consentimento_versao = 'antiga' where email = 'dono@x.com'`);
    expect((await d("GET", "/api/conta")).corpo.termos.aceito).toBe(false);
    expect((await d("POST", "/api/conta/consentimento", { versao: "antiga" })).status).toBe(400);
    await d("POST", "/api/conta/consentimento", { versao: VERSAO_TERMOS });
    expect((await d("GET", "/api/conta")).corpo.termos.aceito).toBe(true);
  });
});

describe("lembrete de vacina por e-mail", () => {
  it("caderneta vazia pede para preencher em vez de listar tudo como atrasado", async () => {
    const f = navegador();
    await f("POST", "/api/conta/cadastro", { nome: "Rita", email: "rita@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    await f("POST", "/api/criancas", { crianca: { nome: "Bia", nascimento: "2026-01-01", sexo: "menina" } });
    await banco.q(`update contas set email_verificado_em = now(), criado_em = now() - interval '10 days' where email = 'rita@x.com'`);
    const caixa: string[] = [];
    await enviarLembretes({ banco, urlBase: "https://app.x", hoje: "2026-11-12", carteiro: async (m) => void (m.para === "rita@x.com" && caixa.push(m.texto)) });
    expect(caixa[0]).toContain("Bia: nenhuma vacina marcada");
  });

  it("resumo separa atrasadas e próximas 30 dias", () => {
    const r = resumoVacinas("2026-01-01", "2026-03-15", new Set(["bcg", "hepb-0"]));
    expect(r.atrasadas.some((v) => v.startsWith("Pentavalente"))).toBe(true);
    expect(r.atrasadas.some((v) => v.startsWith("BCG"))).toBe(false);
    expect(r.proximas.every((p) => p.data > "2026-03-15" && p.data <= "2026-04-15")).toBe(true);
  });

  it("manda no máximo um por período, só para e-mail confirmado, e o link para de mandar", async () => {
    const f = navegador();
    await f("POST", "/api/conta/cadastro", { nome: "Carla Souza", email: "carla@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const tom = (await f("POST", "/api/criancas", { crianca: { nome: "Tom", nascimento: "2026-01-01", sexo: "menino" } })).corpo.id;
    await f("PUT", `/api/criancas/${tom}/doc`, { doc: gravar(gravar({}, "vacinas", { id: "bcg" }), "vacinas", { id: "hepb-0" }) });
    const caixa: { para: string; assunto: string; texto: string }[] = [];
    const carteiro = async (m: { para: string; assunto: string; texto: string; html: string }) => void caixa.push(m);
    const base = { banco, carteiro, urlBase: "https://app.x", hoje: "2026-03-15" };
    // Conta nova e sem e-mail confirmado: nada.
    await enviarLembretes(base);
    expect(caixa.filter((m) => m.para === "carla@x.com")).toHaveLength(0);
    await banco.q(`update contas set email_verificado_em = now(), criado_em = now() - interval '10 days' where email = 'carla@x.com'`);
    await enviarLembretes(base);
    const meus = caixa.filter((m) => m.para === "carla@x.com");
    expect(meus).toHaveLength(1);
    expect(meus[0].texto).toContain("Tom: com a idade passada");
    expect(meus[0].texto).toContain("Pentavalente");
    expect(meus[0].texto).not.toContain("BCG");
    // De novo no mesmo dia: não repete.
    await banco.q(`update contas set lembrete_verificado_em = null where email = 'carla@x.com'`);
    await enviarLembretes(base);
    expect(caixa.filter((m) => m.para === "carla@x.com")).toHaveLength(1);
    // Link de parar: assinatura errada não vale; certa desliga.
    const link = meus[0].texto.match(/https:\/\/app\.x(\/api\/lembretes\/parar\?[^\s]+)/)![1];
    const r1 = await fetch(base0() + link.replace(/t=[0-9a-f]+/, "t=errado"));
    expect(await r1.text()).toContain("Link inválido");
    const r2 = await fetch(base0() + link);
    expect(await r2.text()).toContain("não vai mais receber");
    expect((await f("GET", "/api/conta")).corpo.conta.lembretes).toBe(false);
    await f("PUT", "/api/conta/lembretes", { ligado: true });
    expect((await f("GET", "/api/conta")).corpo.conta.lembretes).toBe(true);
  });
});

describe("prematuro: semanas de gestação no cadastro", () => {
  it("guarda, valida e devolve à família e ao pediatra", async () => {
    const f = navegador();
    await f("POST", "/api/conta/cadastro", { nome: "Júlia", email: "julia@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    expect((await f("POST", "/api/criancas", { crianca: { nome: "Leo", nascimento: "2026-05-01", sexo: "menino", semanasGestacao: 50 } })).status).toBe(400);
    const id = (await f("POST", "/api/criancas", { crianca: { nome: "Leo", nascimento: "2026-05-01", sexo: "menino", semanasGestacao: 31 } })).corpo.id;
    expect((await f("GET", "/api/conta")).corpo.criancas[0].crianca.semanasGestacao).toBe(31);
    await f("PUT", `/api/criancas/${id}`, { crianca: { nome: "Leo", nascimento: "2026-05-01", sexo: "menino" } });
    expect((await f("GET", "/api/conta")).corpo.criancas[0].crianca.semanasGestacao).toBeUndefined();
  });
});

describe("prontuário do pediatra", () => {
  it("só o pediatra vê; atendimento finalizado não muda; adendo; documentos; família recebe só o que for enviado", async () => {
    const adm = navegador();
    await adm("POST", "/api/conta/entrar", { email: "dono@x.com", senha: "segredo123" });
    const ped = navegador();
    await ped("POST", "/api/conta/cadastro", { nome: "Dra. Paula", email: "paula@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const outro = navegador();
    await outro("POST", "/api/conta/cadastro", { nome: "Dr. Outro", email: "outro@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const fam = navegador();
    await fam("POST", "/api/conta/cadastro", { nome: "Carol", email: "carol@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const contas = (await adm("GET", "/api/admin/contas?busca=")).corpo.contas as { id: string; email: string }[];
    for (const e of ["paula@x.com", "outro@x.com"]) await adm("PUT", `/api/admin/contas/${contas.find((c) => c.email === e)!.id}`, { pediatra: true, registro: "CRM-SP 1" });
    const paulaId = contas.find((c) => c.email === "paula@x.com")!.id;

    // Família não acessa o prontuário.
    expect((await fam("GET", "/api/prontuario/pacientes")).status).toBe(403);

    // Paciente sem conta no app.
    const avulso = (await ped("POST", "/api/prontuario/pacientes", { nome: "Bento Lima", nascimento: "2025-02-10", sexo: "menino", responsavel: "Rosa", alergias: "Dipirona" })).corpo.id;
    // Paciente do app: precisa ser acompanhado.
    const k = (await fam("POST", "/api/criancas", { crianca: { nome: "Nina", nascimento: "2025-06-01", sexo: "menina" } })).corpo.id;
    expect((await ped("POST", "/api/prontuario/pacientes", { criancaId: k })).status).toBe(404);
    await fam("POST", `/api/criancas/${k}/pediatra`, { pediatraId: paulaId });
    const nina = (await ped("POST", "/api/prontuario/pacientes", { criancaId: k })).corpo.id;
    expect((await ped("POST", "/api/prontuario/pacientes", { criancaId: k })).corpo.id).toBe(nina);
    expect((await ped("GET", "/api/prontuario/pacientes")).corpo.pacientes.map((p: { nome: string }) => p.nome)).toEqual(["Bento Lima", "Nina"]);
    expect((await outro("GET", "/api/prontuario/pacientes")).corpo.pacientes).toHaveLength(0);
    expect((await outro("GET", `/api/prontuario/pacientes/${nina}`)).status).toBe(404);

    // Atendimento: rascunho editável; finalizado não muda; medidas vão para a curva da família.
    const at = (await ped("POST", `/api/prontuario/pacientes/${nina}/atendimentos`, { data: "2026-11-10", conteudo: { motivo: "Puericultura" } })).corpo.id;
    await ped("PUT", `/api/prontuario/registros/${at}`, { conteudo: { motivo: "Puericultura", historia: "Mamando bem", pesoKg: 8.4 } });
    expect((await ped("POST", `/api/prontuario/registros/${at}/adendo`, { texto: "x" })).status).toBe(400);
    await ped("POST", `/api/prontuario/registros/${at}/finalizar`, { levarMedidas: true });
    expect((await ped("PUT", `/api/prontuario/registros/${at}`, { conteudo: { motivo: "mudou" } })).status).toBe(409);
    expect((await ped("DELETE", `/api/prontuario/registros/${at}`)).status).toBe(409);
    expect((await ped("POST", `/api/prontuario/registros/${at}/adendo`, { texto: "Corrigindo: peso aferido sem roupa." })).status).toBe(200);
    const ficha = (await ped("GET", `/api/prontuario/pacientes/${nina}`)).corpo;
    expect(ficha.noApp).toBe(true);
    expect(ficha.registros.map((g: { tipo: string }) => g.tipo).sort()).toEqual(["adendo", "atendimento"]);
    expect(ficha.registros.find((g: { tipo: string }) => g.tipo === "atendimento").conteudo.historia).toBe("Mamando bem");
    const docFam = docParaVista((await fam("GET", `/api/criancas/${k}/doc`)).corpo.doc);
    expect(docFam.medidas.find((m) => m.origem === "consulta")?.pesoKg).toBe(8.4);

    // Documentos.
    expect((await ped("POST", `/api/prontuario/pacientes/${nina}/documentos`, { tipo: "receita", itens: [] })).status).toBe(400);
    expect((await ped("POST", `/api/prontuario/pacientes/${nina}/documentos`, { tipo: "atestado", dias: 2, aPartirDe: "2026-11-10", cid: "J06.9" })).status).toBe(400);
    const rec = (await ped("POST", `/api/prontuario/pacientes/${nina}/documentos`, {
      tipo: "receita", antimicrobiano: true, itens: [{ medicamento: "Medicamento de teste", quantidade: "1 frasco", posologia: "Conforme orientação" }], orientacoes: "Voltar se piorar",
    })).corpo.id;
    const pdf = await fetch(`${base0()}/api/prontuario/documentos/${rec}/pdf`, { headers: { cookie: "" } });
    expect(pdf.status).toBe(401);
    // Família ainda não vê.
    expect((await fam("GET", `/api/criancas/${k}/documentos`)).corpo.documentos).toHaveLength(0);
    await ped("POST", `/api/prontuario/documentos/${rec}/enviar`);
    const lista = (await fam("GET", `/api/criancas/${k}/documentos`)).corpo.documentos;
    expect(lista).toHaveLength(1);
    expect(lista[0].medico).toBe("Dra. Paula");
    // Paciente sem app: não envia.
    const at2 = (await ped("POST", `/api/prontuario/pacientes/${avulso}/documentos`, { tipo: "exame", itens: ["Hemograma"], indicacao: "Palidez" })).corpo.id;
    expect((await ped("POST", `/api/prontuario/documentos/${at2}/enviar`)).status).toBe(400);

    // Família exclui a conta: o prontuário continua com a pediatra.
    await fam("POST", "/api/conta/excluir", { senha: "segredo123" });
    const depois = (await ped("GET", `/api/prontuario/pacientes/${nina}`)).corpo;
    expect(depois.paciente.criancaId).toBeNull();
    expect(depois.registros).toHaveLength(2);
    // Pediatra com prontuário não exclui a conta.
    expect((await ped("POST", "/api/conta/excluir", { senha: "segredo123" })).status).toBe(400);
    const exp = (await ped("GET", "/api/conta/exportar")).corpo;
    expect(exp.prontuario.map((p: { nome: string }) => p.nome).sort()).toEqual(["Bento Lima", "Nina"]);
  });

  it("gera PDF de cada tipo de documento", async () => {
    const { gerarPdfDocumento } = await import("./documento-pdf");
    const medico = { nome: "Dra. Paula Souza", titulo: null, registro: "CRM-SP 1", local: "Marília", telefone: "(14) 99999-0000" };
    const pac = { nome: "Nina Ávila", nascimento: "2025-06-01", responsavel: "Carol" };
    for (const c of [
      { tipo: "receita" as const, itens: [{ medicamento: "Medicamento “teste” – 1", quantidade: "1 frasco", posologia: "Conforme orientação médica" }], orientacoes: "Hidratar.", antimicrobiano: true },
      { tipo: "atestado" as const, finalidade: "afastamento escolar", dias: 3, aPartirDe: "2026-11-10", observacao: "", cid: "", cidAutorizado: false },
      { tipo: "comparecimento" as const, responsavel: "Carol", data: "2026-11-10", horaInicio: "14:00", horaFim: "15:00" },
      { tipo: "exame" as const, itens: ["Hemograma completo", "Ferritina"], indicacao: "Palidez" },
    ]) {
      const bytes = await gerarPdfDocumento(c, pac, medico, "2026-11-10");
      expect(Buffer.from(bytes).subarray(0, 5).toString()).toBe("%PDF-");
    }
  });
});

describe("resposta rápida do pediatra", () => {
  it("pediatra escreve sem dose; família dele vê só o publicado; a IA recebe", async () => {
    const adm = navegador();
    await adm("POST", "/api/conta/entrar", { email: "dono@x.com", senha: "segredo123" });
    const ped = navegador();
    await ped("POST", "/api/conta/cadastro", { nome: "Dr. Francisco", email: "francisco@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const contas = (await adm("GET", "/api/admin/contas?busca=francisco")).corpo.contas as { id: string }[];
    await adm("PUT", `/api/admin/contas/${contas[0].id}`, { pediatra: true, registro: "CRM-SP 199456" });
    const fam = navegador();
    await fam("POST", "/api/conta/cadastro", { nome: "Lu", email: "lu@x.com", senha: "segredo123", aceite: VERSAO_TERMOS });
    const k = (await fam("POST", "/api/criancas", { crianca: { nome: "Gui", nascimento: "2025-01-01", sexo: "menino" } })).corpo.id;

    expect((await ped("PUT", "/api/pediatra/respostas/febre", { texto: "Dar 10 gotas de 6 em 6 horas", publicado: true })).status).toBe(400);
    expect((await ped("PUT", "/api/pediatra/respostas/inexistente", { texto: "x", publicado: false })).status).toBe(404);
    await ped("PUT", "/api/pediatra/respostas/febre", { texto: "Antitérmico na dose da receita se estiver desconfortável. Muito líquido e roupa leve.", publicado: true });
    await ped("PUT", "/api/pediatra/respostas/respiratorio", { texto: "Lavagem nasal com soro várias vezes ao dia.", publicado: false });

    // Antes de escolher o pediatra: nada.
    expect((await fam("GET", `/api/criancas/${k}/respostas`)).corpo.pediatra).toBeNull();
    await fam("POST", `/api/criancas/${k}/pediatra`, { pediatraId: contas[0].id });
    const r = (await fam("GET", `/api/criancas/${k}/respostas`)).corpo;
    expect(r.pediatra.nome).toBe("Dr. Francisco");
    expect(Object.keys(r.respostas)).toEqual(["febre"]);

    await fam("POST", `/api/pergunta?crianca=${k}`, { pergunta: "Meu filho está com febre de 38 desde ontem, o que faço?" });
    expect(String(ultimoContexto.respostasDoPediatra)).toContain("Antitérmico na dose da receita");
    expect(String(ultimoContexto.respostasDoPediatra)).not.toContain("Lavagem nasal");
  });
});
