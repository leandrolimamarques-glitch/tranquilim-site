import express, { type NextFunction, type Request, type Response } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import type { Banco } from "./banco";
import type { LeitorCarteira } from "./leitura";
import { mensagem, type Carteiro } from "./email";
import { emergenciaDe, type Assistente } from "./pergunta";
import { docValido, juntarDocs, type Doc } from "../src/lib/sinc";
import { docInicial, docParaVista, type Crianca } from "../src/lib/familia";
import { alertasDaCrianca } from "../src/lib/alertas";
import { hojeIso, idadeTexto } from "../src/lib/idade";
import { dataValida, telefoneBr } from "../src/lib/convite";

// Um login para todos. Toda conta é família; o dono (primeira conta criada)
// ativa quem é pediatra. Pediatra acompanha uma criança quando a família o
// escolhe na lista da rede ou aceita o pedido que ele fez pelo e-mail dela.

export type Opcoes = {
  banco: Banco;
  leitor?: LeitorCarteira;
  assistente?: Assistente;
  limitePerguntas?: number;
  cookieSeguro: boolean;
  pastaPublica?: string;
  carteiro?: Carteiro;
  /** Endereço do app nos links dos e-mails. */
  urlBase?: string;
};

type Conta = { id: string; email: string; nome: string; dono: boolean; pediatra: boolean; registro: string | null; titulo: string | null; whatsapp: string | null; telefone: string | null; local: string | null };
type Req = Request & { conta?: Conta };

const COOKIE = "tq";
const DIAS_SESSAO = 365;
const MIMES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : typeof v === "string" ? v : null);
const comoJson = <T>(v: unknown): T => (typeof v === "string" ? (JSON.parse(v) as T) : (v as T));
const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const emailDe = (v: unknown) => texto(v, 120).toLowerCase();
const emailOk = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

class Erro extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
  }
}

function lerCookie(req: Request): string | null {
  for (const parte of (req.headers.cookie ?? "").split(";")) {
    const i = parte.indexOf("=");
    if (i > 0 && parte.slice(0, i).trim() === COOKIE) return decodeURIComponent(parte.slice(i + 1).trim());
  }
  return null;
}

function validarCrianca(c: Partial<Crianca> | undefined): Crianca {
  const nome = texto(c?.nome, 60);
  if (!nome) throw new Erro(400, "Informe o nome da criança.");
  if (!dataValida(c?.nascimento)) throw new Erro(400, "Data de nascimento inválida.");
  if (c?.sexo !== "menina" && c?.sexo !== "menino") throw new Erro(400, "Informe menina ou menino.");
  return { nome, nascimento: c.nascimento as string, sexo: c.sexo };
}

function validarTelefone(v: unknown): string | null {
  const t = texto(v, 30);
  if (t && !telefoneBr(t)) throw new Erro(400, "Telefone com DDD e número.");
  return t || null;
}

/** O que outras pessoas veem de um pediatra. */
export function pediatraPublico(c: Pick<Conta, "id" | "nome" | "registro" | "titulo" | "whatsapp" | "telefone" | "local">) {
  const s: Record<string, string> = { id: c.id, nome: c.nome, registro: c.registro ?? "" };
  if (c.titulo) s.titulo = c.titulo;
  if (c.whatsapp) s.whatsapp = c.whatsapp;
  if (c.telefone) s.telefone = c.telefone;
  if (c.local) s.local = c.local;
  return s;
}

export function criarApp(o: Opcoes) {
  const { banco } = o;
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  const json = express.json({ limit: "3mb" });

  const rota =
    (f: (req: Req, res: Response) => Promise<unknown>) =>
    (req: Req, res: Response, next: NextFunction) => {
      f(req, res)
        .then((r) => {
          if (!res.headersSent) res.json(r ?? { ok: true });
        })
        .catch(next);
    };

  // ---------- sessão ----------
  async function abrirSessao(res: Response, contaId: string) {
    const t = randomBytes(32).toString("base64url");
    const expira = new Date(Date.now() + DIAS_SESSAO * 86400_000);
    await banco.q(`insert into sessoes (hash, conta_id, expira_em) values ($1,$2,$3)`, [sha(t), contaId, expira.toISOString()]);
    res.cookie(COOKIE, t, { httpOnly: true, secure: o.cookieSeguro, sameSite: "lax", path: "/", expires: expira });
  }

  async function novoToken(contaId: string, tipo: "confirmar" | "senha", horas: number): Promise<string> {
    const t = randomBytes(24).toString("base64url");
    await banco.q(`insert into tokens (hash, conta_id, tipo, expira_em) values ($1,$2,$3,$4)`, [sha(t), contaId, tipo, new Date(Date.now() + horas * 3600_000).toISOString()]);
    return t;
  }

  async function usarToken(t: unknown, tipo: "confirmar" | "senha"): Promise<string> {
    if (typeof t !== "string" || t.length < 20) throw new Erro(400, "Link inválido.");
    const [r] = await banco.q<{ conta_id: string }>(
      `update tokens set usado_em = now() where hash = $1 and tipo = $2 and usado_em is null and expira_em > now() returning conta_id`,
      [sha(t), tipo],
    );
    if (!r) throw new Erro(400, "Este link expirou ou já foi usado. Peça outro.");
    return r.conta_id;
  }

  async function enviarConfirmacao(contaId: string, email: string, nome: string) {
    if (!o.carteiro) return;
    const t = await novoToken(contaId, "confirmar", 72);
    const m = mensagem(`Olá, ${nome.split(" ")[0]}! Confirme seu e-mail`, ["Falta só um passo para usar o Tranquilim com tudo funcionando: confirmar que este e-mail é seu."], { texto: "Confirmar meu e-mail", url: `${o.urlBase ?? ""}/#/confirmar/${t}` });
    await o.carteiro({ para: email, assunto: "Confirme seu e-mail no Tranquilim", ...m }).catch((e) => console.error("e-mail de confirmação falhou", e));
  }

  async function contaDa(req: Request): Promise<Conta | null> {
    const t = lerCookie(req);
    if (!t) return null;
    const [c] = await banco.q<Conta>(
      `select c.id, c.email, c.nome, c.dono, c.pediatra, c.registro, c.titulo, c.whatsapp, c.telefone, c.local, c.email_verificado_em
         from sessoes s join contas c on c.id = s.conta_id where s.hash = $1 and s.expira_em > now()`,
      [sha(t)],
    );
    return c ?? null;
  }

  const logado = async (req: Req, _res: Response, next: NextFunction) => {
    try {
      req.conta = (await contaDa(req)) ?? undefined;
      if (!req.conta) throw new Erro(401, "Entre na sua conta.");
      next();
    } catch (e) {
      next(e);
    }
  };
  const soPediatra = (req: Req, _res: Response, next: NextFunction) => next(req.conta?.pediatra ? undefined : new Erro(403, "Função de pediatra não ativada."));
  const soDono = (req: Req, _res: Response, next: NextFunction) => next(req.conta?.dono ? undefined : new Erro(403, "Só o administrador."));

  // ---------- documentos ----------
  async function lerDoc(chave: string): Promise<Doc> {
    const [r] = await banco.q<{ doc: unknown }>(`select doc from documentos where chave = $1`, [chave]);
    return r?.doc ? comoJson<Doc>(r.doc) : {};
  }

  async function juntarDoc(chave: string, entrada: Doc): Promise<Doc> {
    for (let i = 0; i < 6; i++) {
      const [r] = await banco.q<{ doc: unknown; versao: number }>(`select doc, versao from documentos where chave = $1`, [chave]);
      const atual = r ? comoJson<Doc>(r.doc) : {};
      const junto = juntarDocs(atual, entrada);
      if (r && typeof r.doc !== "string" && JSON.stringify(junto) === JSON.stringify(atual)) return junto;
      const linhas = r
        ? await banco.q(`update documentos set doc = $1::text::jsonb, versao = versao + 1, atualizado_em = now() where chave = $2 and versao = $3 returning chave`, [JSON.stringify(junto), chave, r.versao])
        : await banco.q(`insert into documentos (chave, doc) values ($1, $2::text::jsonb) on conflict (chave) do nothing returning chave`, [chave, JSON.stringify(junto)]);
      if (linhas.length) return junto;
    }
    throw new Erro(409, "Muitas mudanças ao mesmo tempo. Tente de novo.");
  }

  const docDoCorpo = (req: Request): Doc => {
    const d = (req.body as { doc?: unknown })?.doc;
    if (!docValido(d)) throw new Erro(400, "Documento inválido.");
    if (JSON.stringify(d).length > 3_000_000) throw new Erro(413, "Documento grande demais.");
    return d;
  };

  // ---------- acesso a uma criança ----------
  type Acesso = { id: string; nome: string; nascimento: string; sexo: "menina" | "menino"; como: "familia" | "pediatra" };
  async function acessoACrianca(conta: Conta, criancaId: unknown): Promise<Acesso> {
    if (typeof criancaId !== "string" || !/^[0-9a-f-]{36}$/.test(criancaId)) throw new Erro(404, "Criança não encontrada.");
    const [c] = await banco.q<{ id: string; nome: string; nascimento: string; sexo: "menina" | "menino"; resp: boolean; ped: boolean }>(
      `select k.id, k.nome, k.nascimento::text as nascimento, k.sexo,
              exists(select 1 from responsaveis r where r.crianca_id = k.id and r.conta_id = $2) as resp,
              exists(select 1 from acompanhamentos a where a.crianca_id = k.id and a.pediatra_id = $2) as ped
         from criancas k where k.id = $1 and k.removido_em is null`,
      [criancaId, conta.id],
    );
    if (!c || (!c.resp && !(c.ped && conta.pediatra))) throw new Erro(404, "Criança não encontrada.");
    return { id: c.id, nome: c.nome, nascimento: c.nascimento, sexo: c.sexo, como: c.resp ? "familia" : "pediatra" };
  }

  // ---------- saúde ----------
  app.get("/api/saude", (_req, res) => {
    res.json({ ok: true });
  });

  // ---------- conta ----------
  const tentativas = new Map<string, { n: number; ate: number }>();
  function limitar(chave: string) {
    const agora = Date.now();
    const t = tentativas.get(chave);
    if (t && t.ate > agora && t.n >= 8) throw new Erro(429, "Muitas tentativas. Espere 15 minutos.");
    tentativas.set(chave, t && t.ate > agora ? { n: t.n + 1, ate: t.ate } : { n: 1, ate: agora + 15 * 60_000 });
  }

  app.post("/api/conta/cadastro", json, rota(async (req, res) => {
    const b = req.body as Record<string, unknown>;
    const email = emailDe(b.email);
    const nome = texto(b.nome, 80);
    const senha = typeof b.senha === "string" ? b.senha : "";
    if (nome.length < 2) throw new Erro(400, "Informe seu nome.");
    if (!emailOk(email)) throw new Erro(400, "E-mail inválido.");
    if (senha.length < 8) throw new Erro(400, "A senha precisa de pelo menos 8 caracteres.");
    if ((await banco.q(`select 1 from contas where email = $1`, [email])).length) throw new Erro(409, "Já existe uma conta com este e-mail. Use Entrar.");
    const [{ n }] = await banco.q<{ n: number }>(`select count(*)::int as n from contas`);
    const primeira = Number(n) === 0;
    const id = randomUUID();
    await banco.q(`insert into contas (id, email, senha_hash, nome, dono, pediatra) values ($1,$2,$3,$4,$5,$5)`, [id, email, await bcrypt.hash(senha, 10), nome, primeira]);
    await abrirSessao(res, id);
    void enviarConfirmacao(id, email, nome);
    return { ok: true };
  }));

  app.get("/api/publico", (_req, res) => {
    res.json({ email: !!o.carteiro });
  });

  app.post("/api/conta/confirmar", json, rota(async (req) => {
    const id = await usarToken((req.body as { token?: unknown }).token, "confirmar");
    await banco.q(`update contas set email_verificado_em = coalesce(email_verificado_em, now()) where id = $1`, [id]);
    return { ok: true };
  }));

  /** Sempre responde igual, para não revelar quem tem conta. */
  app.post("/api/conta/esqueci", json, rota(async (req) => {
    const email = emailDe((req.body as { email?: unknown }).email);
    limitar(`esqueci|${req.ip}`);
    if (!o.carteiro) throw new Erro(503, "Envio de e-mail ainda não ligado. Peça ao administrador uma senha provisória.");
    const [c] = await banco.q<{ id: string; nome: string }>(`select id, nome from contas where email = $1`, [email]);
    if (c) {
      const t = await novoToken(c.id, "senha", 2);
      const m = mensagem("Criar uma senha nova", [`Olá, ${c.nome.split(" ")[0]}. Alguém (esperamos que você) pediu para trocar a senha do Tranquilim. O link vale por 2 horas.`, "Se não foi você, é só ignorar este e-mail: nada muda."], { texto: "Criar senha nova", url: `${o.urlBase ?? ""}/#/redefinir/${t}` });
      await o.carteiro({ para: email, assunto: "Sua senha nova do Tranquilim", ...m }).catch((e) => console.error("e-mail de senha falhou", e));
    }
    return { ok: true };
  }));

  app.post("/api/conta/redefinir", json, rota(async (req, res) => {
    const b = req.body as { token?: unknown; senha?: unknown };
    if (typeof b.senha !== "string" || b.senha.length < 8) throw new Erro(400, "A senha precisa de pelo menos 8 caracteres.");
    const id = await usarToken(b.token, "senha");
    await banco.q(`update contas set senha_hash = $1, email_verificado_em = coalesce(email_verificado_em, now()) where id = $2`, [await bcrypt.hash(b.senha, 10), id]);
    await banco.q(`delete from sessoes where conta_id = $1`, [id]);
    await abrirSessao(res, id);
    return { ok: true };
  }));

  app.post("/api/conta/entrar", json, rota(async (req, res) => {
    const b = req.body as Record<string, unknown>;
    const email = emailDe(b.email);
    limitar(`${req.ip}|${email}`);
    const [c] = await banco.q<{ id: string; senha_hash: string }>(`select id, senha_hash from contas where email = $1`, [email]);
    if (!c || !(await bcrypt.compare(typeof b.senha === "string" ? b.senha : "", c.senha_hash))) throw new Erro(401, "E-mail ou senha não conferem.");
    tentativas.delete(`${req.ip}|${email}`);
    await abrirSessao(res, c.id);
    return { ok: true };
  }));

  app.post("/api/conta/sair", rota(async (req, res) => {
    const t = lerCookie(req);
    if (t) await banco.q(`delete from sessoes where hash = $1`, [sha(t)]);
    res.clearCookie(COOKIE, { path: "/" });
    return { ok: true };
  }));

  const conta = express.Router();
  conta.use(logado, json);

  /** Tudo que o app precisa ao abrir: a conta, as crianças e os pedidos pendentes. */
  conta.get("/", rota(async (req) => {
    const c = req.conta!;
    const criancas = await banco.q<Record<string, unknown>>(
      `select k.id, k.nome, k.nascimento::text as nascimento, k.sexo from criancas k
         join responsaveis r on r.crianca_id = k.id where r.conta_id = $1 and k.removido_em is null order by k.nascimento desc`,
      [c.id],
    );
    const peds = criancas.length
      ? await banco.q<Record<string, unknown>>(
          `select a.crianca_id, p.id, p.nome, p.registro, p.titulo, p.whatsapp, p.telefone, p.local from acompanhamentos a join contas p on p.id = a.pediatra_id
            where a.crianca_id = any(string_to_array($1, ',')::uuid[]) and p.pediatra`,
          [criancas.map((k) => k.id).join(",")],
        )
      : [];
    const pedidos = await banco.q<Record<string, unknown>>(
      `select d.id, p.id as pid, p.nome, p.registro, p.titulo, p.whatsapp, p.telefone, p.local, d.criado_em from pedidos d join contas p on p.id = d.pediatra_id
        where d.email = $1 and d.resolvido_em is null and p.pediatra order by d.criado_em`,
      [c.email],
    );
    return {
      emailLigado: !!o.carteiro,
      conta: { id: c.id, email: c.email, nome: c.nome, dono: c.dono, pediatra: c.pediatra, emailVerificado: !!(c as Conta & { email_verificado_em?: unknown }).email_verificado_em, registro: c.registro, titulo: c.titulo, whatsapp: c.whatsapp, telefone: c.telefone, local: c.local },
      criancas: criancas.map((k) => ({
        id: k.id,
        crianca: { nome: k.nome, nascimento: k.nascimento, sexo: k.sexo },
        pediatras: peds.filter((p) => p.crianca_id === k.id).map((p) => pediatraPublico(p as unknown as Conta)),
      })),
      pedidos: pedidos.map((d) => ({ id: d.id, pediatra: pediatraPublico({ ...(d as unknown as Conta), id: String(d.pid) }), criadoEm: iso(d.criado_em) })),
    };
  }));

  conta.post("/reenviar-confirmacao", rota(async (req) => {
    if (!o.carteiro) throw new Erro(503, "Envio de e-mail ainda não ligado.");
    await enviarConfirmacao(req.conta!.id, req.conta!.email, req.conta!.nome);
    return { ok: true };
  }));

  conta.put("/perfil", rota(async (req) => {
    const b = req.body as Record<string, unknown>;
    const nome = texto(b.nome, 80);
    if (nome.length < 2) throw new Erro(400, "Informe seu nome.");
    if (req.conta!.pediatra) {
      await banco.q(`update contas set nome=$1, registro=$2, titulo=$3, whatsapp=$4, telefone=$5, local=$6 where id=$7`, [
        nome, texto(b.registro, 40) || null, texto(b.titulo, 40) || null, validarTelefone(b.whatsapp), validarTelefone(b.telefone), texto(b.local, 120) || null, req.conta!.id,
      ]);
    } else await banco.q(`update contas set nome=$1 where id=$2`, [nome, req.conta!.id]);
    return { ok: true };
  }));

  conta.put("/senha", rota(async (req) => {
    const b = req.body as Record<string, unknown>;
    const [c] = await banco.q<{ senha_hash: string }>(`select senha_hash from contas where id = $1`, [req.conta!.id]);
    if (!(await bcrypt.compare(typeof b.atual === "string" ? b.atual : "", c.senha_hash))) throw new Erro(400, "A senha atual não confere.");
    if (typeof b.nova !== "string" || b.nova.length < 8) throw new Erro(400, "A senha nova precisa de pelo menos 8 caracteres.");
    await banco.q(`update contas set senha_hash = $1 where id = $2`, [await bcrypt.hash(b.nova, 10), req.conta!.id]);
    return { ok: true };
  }));

  // Pedido de acompanhamento feito por um pediatra: a família escolhe quais crianças.
  conta.post("/pedidos/:id/aceitar", rota(async (req) => {
    const [d] = await banco.q<{ pediatra_id: string }>(`select pediatra_id from pedidos where id = $1 and email = $2 and resolvido_em is null`, [req.params.id, req.conta!.email]);
    if (!d) throw new Erro(404, "Pedido não encontrado.");
    const ids = Array.isArray((req.body as { criancas?: unknown }).criancas) ? ((req.body as { criancas: unknown[] }).criancas) : [];
    if (!ids.length) throw new Erro(400, "Escolha pelo menos uma criança.");
    for (const id of ids) {
      const a = await acessoACrianca(req.conta!, id);
      if (a.como !== "familia") throw new Erro(404, "Criança não encontrada.");
      await banco.q(`insert into acompanhamentos (crianca_id, pediatra_id) values ($1,$2) on conflict do nothing`, [a.id, d.pediatra_id]);
    }
    await banco.q(`update pedidos set resolvido_em = now() where id = $1`, [req.params.id]);
    return { ok: true };
  }));

  conta.post("/pedidos/:id/recusar", rota(async (req) => {
    await banco.q(`update pedidos set resolvido_em = now() where id = $1 and email = $2`, [req.params.id, req.conta!.email]);
    return { ok: true };
  }));

  app.use("/api/conta", conta);

  // ---------- crianças (família) ----------
  const criancas = express.Router();
  criancas.use(logado, json);

  criancas.post("/", rota(async (req) => {
    const k = validarCrianca((req.body as { crianca?: Partial<Crianca> }).crianca);
    const id = randomUUID();
    await banco.q(`insert into criancas (id, nome, nascimento, sexo, criado_por) values ($1,$2,$3,$4,$5)`, [id, k.nome, k.nascimento, k.sexo, req.conta!.id]);
    await banco.q(`insert into responsaveis (crianca_id, conta_id) values ($1,$2)`, [id, req.conta!.id]);
    const doc = (req.body as { doc?: unknown }).doc;
    await juntarDoc(`crianca:${id}`, docValido(doc) ? juntarDocs(doc, docInicial(k)) : docInicial(k));
    return { id };
  }));

  criancas.put("/:id", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    if (a.como !== "familia") throw new Erro(403, "Só a família edita os dados da criança.");
    const k = validarCrianca((req.body as { crianca?: Partial<Crianca> }).crianca);
    await banco.q(`update criancas set nome=$1, nascimento=$2, sexo=$3 where id=$4`, [k.nome, k.nascimento, k.sexo, a.id]);
    await juntarDoc(`crianca:${a.id}`, docInicial(k));
    return { ok: true };
  }));

  /** Tira a criança desta conta (se ninguém mais for responsável, ela some). */
  criancas.delete("/:id", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    if (a.como !== "familia") throw new Erro(403, "Só a família.");
    await banco.q(`delete from responsaveis where crianca_id = $1 and conta_id = $2`, [a.id, req.conta!.id]);
    const resta = await banco.q(`select 1 from responsaveis where crianca_id = $1`, [a.id]);
    if (!resta.length) await banco.q(`update criancas set removido_em = now() where id = $1`, [a.id]);
    return { ok: true };
  }));

  criancas.get("/:id/doc", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    return { doc: await lerDoc(`crianca:${a.id}`) };
  }));

  criancas.put("/:id/doc", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    return { doc: await juntarDoc(`crianca:${a.id}`, docDoCorpo(req)) };
  }));

  /** Outro responsável (pai, mãe, avó) que já tem conta passa a ver a criança. */
  criancas.post("/:id/responsaveis", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    if (a.como !== "familia") throw new Erro(403, "Só a família.");
    const email = emailDe((req.body as { email?: unknown }).email);
    const [c] = await banco.q<{ id: string; nome: string }>(`select id, nome from contas where email = $1`, [email]);
    if (!c) throw new Erro(404, "Não há conta com este e-mail. Peça para a pessoa criar a conta no Tranquilim primeiro.");
    await banco.q(`insert into responsaveis (crianca_id, conta_id) values ($1,$2) on conflict do nothing`, [a.id, c.id]);
    return { nome: c.nome };
  }));

  /** A família escolhe um pediatra da rede. */
  criancas.post("/:id/pediatra", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    if (a.como !== "familia") throw new Erro(403, "Só a família.");
    const pid = (req.body as { pediatraId?: unknown }).pediatraId;
    const [p] = await banco.q(`select 1 from contas where id = $1 and pediatra`, [typeof pid === "string" ? pid : ""]);
    if (!p) throw new Erro(404, "Pediatra não encontrado.");
    await banco.q(`insert into acompanhamentos (crianca_id, pediatra_id) values ($1,$2) on conflict do nothing`, [a.id, pid]);
    return { ok: true };
  }));

  criancas.delete("/:id/pediatra/:pid", rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.params.id);
    if (a.como === "familia" || req.params.pid === req.conta!.id) await banco.q(`delete from acompanhamentos where crianca_id = $1 and pediatra_id = $2`, [a.id, req.params.pid]);
    else throw new Erro(403, "Sem permissão.");
    return { ok: true };
  }));

  app.use("/api/criancas", criancas);

  /** Pediatras da rede, para a família escolher. */
  app.get("/api/pediatras", logado, rota(async (req) => {
    const termo = `%${texto(req.query.busca, 60).toLowerCase()}%`;
    const linhas = await banco.q<Conta>(`select id, nome, registro, titulo, whatsapp, telefone, local from contas where pediatra and lower(nome) like $1 order by nome limit 30`, [termo]);
    return { pediatras: linhas.map(pediatraPublico) };
  }));

  // ---------- pediatra ----------
  const ped = express.Router();
  ped.use(logado, soPediatra, json);

  ped.get("/pacientes", rota(async (req) => {
    const linhas = await banco.q<Record<string, unknown>>(
      `select k.id, k.nome, k.nascimento::text as nascimento, k.sexo, a.desde, d.doc, d.atualizado_em,
              (select string_agg(c.nome, ', ') from responsaveis r join contas c on c.id = r.conta_id where r.crianca_id = k.id) as responsaveis,
              (select c.email from responsaveis r join contas c on c.id = r.conta_id where r.crianca_id = k.id order by r.criado_em limit 1) as email
         from acompanhamentos a join criancas k on k.id = a.crianca_id
         left join documentos d on d.chave = 'crianca:' || k.id::text
        where a.pediatra_id = $1 and k.removido_em is null order by k.nome`,
      [req.conta!.id],
    );
    const hoje = hojeIso();
    const pedidos = await banco.q<Record<string, unknown>>(`select id, email, criado_em from pedidos where pediatra_id = $1 and resolvido_em is null order by criado_em desc`, [req.conta!.id]);
    return {
      pacientes: linhas.map((p) => {
        const crianca = { nome: String(p.nome), nascimento: String(p.nascimento), sexo: p.sexo as "menina" | "menino" };
        const vista = docParaVista(p.doc ? comoJson<Doc>(p.doc) : {});
        return {
          id: p.id,
          crianca,
          responsaveis: p.responsaveis ?? "",
          email: p.email ?? "",
          desde: iso(p.desde),
          atualizadoEm: iso(p.atualizado_em),
          alertas: alertasDaCrianca({ ...vista, crianca }, hoje),
        };
      }),
      pedidos: pedidos.map((d) => ({ id: d.id, email: d.email, criadoEm: iso(d.criado_em) })),
    };
  }));

  /** O pediatra pede para acompanhar as crianças da família dona deste e-mail. */
  ped.post("/pedidos", rota(async (req) => {
    const email = emailDe((req.body as { email?: unknown }).email);
    if (!emailOk(email)) throw new Erro(400, "E-mail inválido.");
    if (email === req.conta!.email) throw new Erro(400, "Este é o seu e-mail. Suas crianças você vê como família.");
    const ja = await banco.q(`select 1 from pedidos where pediatra_id = $1 and email = $2 and resolvido_em is null`, [req.conta!.id, email]);
    if (!ja.length) await banco.q(`insert into pedidos (id, pediatra_id, email) values ($1,$2,$3)`, [randomUUID(), req.conta!.id, email]);
    const [c] = await banco.q(`select 1 from contas where email = $1`, [email]);
    return { temConta: !!c };
  }));

  ped.delete("/pedidos/:id", rota(async (req) => {
    await banco.q(`delete from pedidos where id = $1 and pediatra_id = $2`, [req.params.id, req.conta!.id]);
    return { ok: true };
  }));

  ped.get("/financeiro", rota(async (req) => ({ doc: await lerDoc(`financeiro:${req.conta!.id}`) })));
  ped.put("/financeiro", rota(async (req) => ({ doc: await juntarDoc(`financeiro:${req.conta!.id}`, docDoCorpo(req)) })));

  app.use("/api/pediatra", ped);

  // ---------- administração (dono) ----------
  const adm = express.Router();
  adm.use(logado, soDono, json);

  adm.get("/contas", rota(async (req) => {
    const termo = `%${texto(req.query.busca, 80).toLowerCase()}%`;
    const linhas = await banco.q<Record<string, unknown>>(
      `select c.id, c.nome, c.email, c.dono, c.pediatra, c.registro, c.criado_em,
              (select count(*)::int from responsaveis r where r.conta_id = c.id) as criancas,
              (select count(*)::int from acompanhamentos a where a.pediatra_id = c.id) as pacientes
         from contas c where lower(c.nome) like $1 or lower(c.email) like $1 order by c.criado_em desc limit 100`,
      [termo],
    );
    return { contas: linhas.map((c) => ({ ...c, criado_em: undefined, criadoEm: iso(c.criado_em) })) };
  }));

  adm.put("/contas/:id", rota(async (req) => {
    const b = req.body as Record<string, unknown>;
    if (req.params.id === req.conta!.id && b.dono === false) throw new Erro(400, "Você não pode tirar o seu próprio acesso de administrador.");
    await banco.q(
      `update contas set pediatra = coalesce($1, pediatra), dono = coalesce($2, dono), registro = coalesce($3, registro), titulo = coalesce($4, titulo) where id = $5`,
      [typeof b.pediatra === "boolean" ? b.pediatra : null, typeof b.dono === "boolean" ? b.dono : null, typeof b.registro === "string" ? texto(b.registro, 40) : null, typeof b.titulo === "string" ? texto(b.titulo, 40) || null : null, req.params.id],
    );
    return { ok: true };
  }));

  /** Sem e-mail ainda, o administrador define uma senha provisória para quem esqueceu. */
  adm.put("/contas/:id/senha", rota(async (req) => {
    const nova = (req.body as { senha?: unknown }).senha;
    if (typeof nova !== "string" || nova.length < 8) throw new Erro(400, "Senha com pelo menos 8 caracteres.");
    await banco.q(`update contas set senha_hash = $1 where id = $2`, [await bcrypt.hash(nova, 10), req.params.id]);
    await banco.q(`delete from sessoes where conta_id = $1`, [req.params.id]);
    return { ok: true };
  }));

  /** Regras que os médicos impõem à IA, e o que as famílias têm perguntado. */
  adm.get("/ia", rota(async () => {
    const [r] = await banco.q<{ valor: string }>(`select valor from config where chave = 'regras_ia'`);
    const perguntas = await banco.q<Record<string, unknown>>(
      `select p.pergunta, p.tipo, p.resposta, p.criado_em, k.nome as crianca from perguntas p join criancas k on k.id = p.crianca_id order by p.criado_em desc limit 100`,
    );
    return { regras: r?.valor ?? "", perguntas: perguntas.map((x) => ({ pergunta: x.pergunta, tipo: x.tipo, resposta: x.resposta, crianca: x.crianca, criadoEm: iso(x.criado_em) })) };
  }));

  adm.put("/ia", rota(async (req) => {
    const regras = typeof (req.body as { regras?: unknown }).regras === "string" ? ((req.body as { regras: string }).regras).slice(0, 8000) : "";
    await banco.q(`insert into config (chave, valor) values ('regras_ia', $1) on conflict (chave) do update set valor = excluded.valor, atualizado_em = now()`, [regras]);
    return { ok: true };
  }));

  app.use("/api/admin", adm);

  // ---------- carteira de vacinação ----------
  async function lerCarteira(id: string, nascimento: string, mime: string, bytes: Buffer) {
    try {
      if (!o.leitor) throw new Error("Leitura automática não configurada.");
      const leitura = await o.leitor({ mime, bytes }, { nascimento });
      await banco.q(`update carteiras set leitura = $1::text::jsonb, erro = null where id = $2`, [JSON.stringify(leitura), id]);
    } catch (e) {
      console.error("leitura da carteira falhou", e);
      await banco.q(`update carteiras set erro = $1 where id = $2`, [e instanceof Error ? e.message.slice(0, 200) : "Falha na leitura.", id]);
    }
  }

  app.post("/api/carteira", logado, express.raw({ type: MIMES, limit: "12mb" }), rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.query.crianca);
    const mime = String(req.headers["content-type"] ?? "").split(";")[0];
    if (!MIMES.includes(mime) || !Buffer.isBuffer(req.body) || req.body.length === 0) throw new Erro(400, "Envie uma foto (JPG, PNG) ou um PDF.");
    const id = randomUUID();
    await banco.q(`insert into carteiras (id, crianca_id, enviado_por, mime, bytes, tamanho) values ($1,$2,$3,$4,$5,$6)`, [id, a.id, req.conta!.id, mime, req.body, req.body.length]);
    void lerCarteira(id, a.nascimento, mime, req.body);
    return { id };
  }));

  app.get("/api/carteira", logado, rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.query.crianca);
    const linhas = await banco.q<Record<string, unknown>>(
      `select k.id, c.nome as quem, c.pediatra and exists(select 1 from acompanhamentos x where x.crianca_id = k.crianca_id and x.pediatra_id = c.id) as medico,
              k.mime, k.tamanho, k.leitura, k.erro, k.criado_em
         from carteiras k join contas c on c.id = k.enviado_por where k.crianca_id = $1 order by k.criado_em desc`,
      [a.id],
    );
    return { carteiras: linhas.map((c) => ({ id: c.id, enviadoPor: c.medico ? "medico" : "familia", quem: c.quem, mime: c.mime, tamanho: c.tamanho, leitura: c.leitura ? comoJson(c.leitura) : null, erro: c.erro ?? null, criadoEm: iso(c.criado_em) })) };
  }));

  app.get("/api/carteira/:id/arquivo", logado, async (req: Req, res, next) => {
    try {
      const a = await acessoACrianca(req.conta!, req.query.crianca);
      const [c] = await banco.q<{ mime: string; bytes: Uint8Array }>(`select mime, bytes from carteiras where id = $1 and crianca_id = $2`, [req.params.id, a.id]);
      if (!c) throw new Erro(404, "Arquivo não encontrado.");
      res.setHeader("Content-Type", c.mime);
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(Buffer.from(c.bytes));
    } catch (e) {
      next(e);
    }
  });

  app.delete("/api/carteira/:id", logado, rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.query.crianca);
    await banco.q(`delete from carteiras where id = $1 and crianca_id = $2`, [req.params.id, a.id]);
    return { ok: true };
  }));

  // ---------- Pergunte ao Tranquilim ----------
  app.post("/api/pergunta", logado, json, rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.query.crianca);
    const pergunta = texto((req.body as { pergunta?: unknown })?.pergunta, 500);
    if (pergunta.length < 3) throw new Erro(400, "Escreva a sua dúvida.");
    const [{ n }] = await banco.q<{ n: number }>(`select count(*)::int as n from perguntas where conta_id = $1 and criado_em > now() - interval '1 day'`, [req.conta!.id]);
    if (Number(n) >= (o.limitePerguntas ?? 20)) throw new Erro(429, "Chegou ao limite de perguntas de hoje. Para dúvidas sobre a criança, fale com o pediatra.");
    let r = emergenciaDe(pergunta);
    if (!r) {
      if (!o.assistente) throw new Erro(503, "O assistente não está ligado agora.");
      const [cfg] = await banco.q<{ valor: string }>(`select valor from config where chave = 'regras_ia'`);
      const [ped] = await banco.q<{ nome: string }>(`select p.nome from acompanhamentos x join contas p on p.id = x.pediatra_id where x.crianca_id = $1 and p.pediatra order by x.desde limit 1`, [a.id]);
      r = await o.assistente(pergunta, { nome: a.nome, idadeTexto: idadeTexto(a.nascimento, hojeIso()), regrasDosMedicos: cfg?.valor, pediatra: ped?.nome });
    }
    await banco.q(`insert into perguntas (id, crianca_id, conta_id, pergunta, tipo, resposta, fluxo) values ($1,$2,$3,$4,$5,$6,$7)`, [randomUUID(), a.id, req.conta!.id, pergunta, r.tipo, r.resposta, r.fluxo]);
    return r;
  }));

  app.get("/api/perguntas", logado, rota(async (req) => {
    const a = await acessoACrianca(req.conta!, req.query.crianca);
    const linhas = await banco.q<Record<string, unknown>>(`select pergunta, tipo, resposta, fluxo, criado_em from perguntas where crianca_id = $1 order by criado_em desc limit 50`, [a.id]);
    return { perguntas: linhas.map((l) => ({ pergunta: l.pergunta, tipo: l.tipo, resposta: l.resposta, fluxo: l.fluxo, criadoEm: iso(l.criado_em) })) };
  }));

  app.use("/api", (_req, _res, next) => next(new Erro(404, "Rota não encontrada.")));

  // ---------- app (arquivos do Vite) ----------
  if (o.pastaPublica && existsSync(o.pastaPublica)) {
    const pasta = o.pastaPublica;
    app.use(express.static(pasta, { index: false, maxAge: "1h", setHeaders: (res, arq) => {
      if (arq.includes(`${path.sep}assets${path.sep}`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      if (arq.endsWith("sw.js") || arq.endsWith(".webmanifest")) res.setHeader("Cache-Control", "no-cache");
    } }));
    app.get("*", (_req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(path.join(pasta, "index.html"));
    });
  }

  app.use((e: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (e instanceof Erro) return res.status(e.status).json({ erro: e.message });
    const status = (e as { type?: string })?.type === "entity.too.large" ? 413 : 500;
    if (status === 500) console.error(e);
    res.status(status).json({ erro: status === 413 ? "Arquivo grande demais (máximo 12 MB)." : "Erro no servidor. Tente de novo." });
  });

  return app;
}
