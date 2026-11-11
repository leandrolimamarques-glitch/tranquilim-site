import express, { type NextFunction, type Request, type Response } from "express";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import type { Banco } from "./banco";
import type { LeitorCarteira } from "./leitura";
import { docValido, juntarDocs, type Doc } from "../src/lib/sinc";
import { docInicial, docParaVista, type Crianca } from "../src/lib/familia";
import { situacaoDasVacinas } from "../src/lib/vacinas";
import { hojeIso } from "../src/lib/idade";
import { dataValida, telefoneBr } from "../src/lib/convite";

export type Opcoes = {
  banco: Banco;
  leitor?: LeitorCarteira;
  cookieSeguro: boolean;
  pastaPublica?: string;
  cadastroAberto: boolean;
};

type Sessao = { tipo: "medico" | "familia"; medicoId: string | null; pacienteId: string | null };
type Req = Request & { sessao?: Sessao };

const COOKIE = { medico: "tq_med", familia: "tq_fam" } as const;
const DIAS = { medico: 30, familia: 365 } as const;
const MIMES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const token = (n = 24) => randomBytes(n).toString("base64url");
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : typeof v === "string" ? v : null);
/** jsonb pode chegar como texto (registros antigos gravados entre aspas): devolve sempre o objeto. */
const comoJson = <T>(v: unknown): T => (typeof v === "string" ? (JSON.parse(v) as T) : (v as T));
const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

class Erro extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
  }
}

function lerCookies(req: Request): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const parte of (req.headers.cookie ?? "").split(";")) {
    const i = parte.indexOf("=");
    if (i > 0) saida[parte.slice(0, i).trim()] = decodeURIComponent(parte.slice(i + 1).trim());
  }
  return saida;
}

function validarCrianca(c: Partial<Crianca> | undefined): Crianca {
  const nome = texto(c?.nome, 60);
  if (!nome) throw new Erro(400, "Informe o nome da criança.");
  if (!dataValida(c?.nascimento)) throw new Erro(400, "Data de nascimento inválida.");
  if (c?.sexo !== "menina" && c?.sexo !== "menino") throw new Erro(400, "Informe menina ou menino.");
  return { nome, nascimento: c.nascimento as string, sexo: c.sexo };
}

function validarTelefone(v: unknown): string {
  const t = texto(v, 30);
  if (t && !telefoneBr(t)) throw new Erro(400, "Telefone com DDD e número.");
  return t;
}

export function criarApp(o: Opcoes) {
  const { banco } = o;
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);

  // ---------- sessões ----------
  async function abrirSessao(res: Response, tipo: Sessao["tipo"], ids: { medicoId?: string; pacienteId?: string }) {
    const t = token(32);
    const expira = new Date(Date.now() + DIAS[tipo] * 86400_000);
    await banco.q(`insert into sessoes (hash, tipo, medico_id, paciente_id, expira_em) values ($1,$2,$3,$4,$5)`, [
      sha(t),
      tipo,
      ids.medicoId ?? null,
      ids.pacienteId ?? null,
      expira.toISOString(),
    ]);
    res.cookie(COOKIE[tipo], t, { httpOnly: true, secure: o.cookieSeguro, sameSite: "lax", path: "/", expires: expira });
  }

  async function sessaoDe(req: Request, tipo: Sessao["tipo"]): Promise<Sessao | null> {
    const t = lerCookies(req)[COOKIE[tipo]];
    if (!t) return null;
    const [s] = await banco.q<{ tipo: string; medico_id: string | null; paciente_id: string | null }>(
      `select s.tipo, s.medico_id, s.paciente_id from sessoes s
         left join pacientes p on p.id = s.paciente_id
        where s.hash = $1 and s.tipo = $2 and s.expira_em > now() and (s.paciente_id is null or p.removido_em is null)`,
      [sha(t), tipo],
    );
    return s ? { tipo: tipo, medicoId: s.medico_id, pacienteId: s.paciente_id } : null;
  }

  const exigir = (tipo: Sessao["tipo"]) => async (req: Req, _res: Response, next: NextFunction) => {
    try {
      const s = await sessaoDe(req, tipo);
      if (!s) throw new Erro(401, tipo === "medico" ? "Entre de novo no painel." : "Este celular não está mais ligado ao consultório.");
      req.sessao = s;
      next();
    } catch (e) {
      next(e);
    }
  };

  const rota =
    (f: (req: Req, res: Response) => Promise<unknown>) =>
    (req: Req, res: Response, next: NextFunction) => {
      f(req, res)
        .then((r) => {
          if (!res.headersSent) res.json(r ?? { ok: true });
        })
        .catch(next);
    };

  // ---------- documentos sincronizados ----------
  async function lerDoc(chave: string): Promise<Doc> {
    const [r] = await banco.q<{ doc: Doc }>(`select doc from documentos where chave = $1`, [chave]);
    return r?.doc ? comoJson<Doc>(r.doc) : {};
  }

  async function juntarDoc(chave: string, entrada: Doc): Promise<Doc> {
    for (let tentativa = 0; tentativa < 6; tentativa++) {
      const [r] = await banco.q<{ doc: Doc; versao: number }>(`select doc, versao from documentos where chave = $1`, [chave]);
      const atual = r ? comoJson<Doc>(r.doc) : {};
      const junto = juntarDocs(atual, entrada);
      if (r && JSON.stringify(junto) === JSON.stringify(atual) && typeof r.doc !== "string") return junto;
      const linhas = r
        ? await banco.q(`update documentos set doc = $1::text::jsonb, versao = versao + 1, atualizado_em = now() where chave = $2 and versao = $3 returning chave`, [
            JSON.stringify(junto),
            chave,
            r.versao,
          ])
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

  // ---------- leitura de dados públicos do médico ----------
  type LinhaMedico = { id: string; nome: string; registro: string; titulo: string | null; whatsapp: string | null; telefone: string | null; local: string | null; email?: string };
  const medicoPublico = (m: LinhaMedico) => {
    const saida: Record<string, string> = { nome: m.nome, registro: m.registro };
    if (m.titulo) saida.titulo = m.titulo;
    if (m.whatsapp) saida.whatsapp = m.whatsapp;
    if (m.telefone) saida.telefone = m.telefone;
    if (m.local) saida.local = m.local;
    return saida;
  };

  async function pacienteDoMedico(medicoId: string, pacienteId: string) {
    const [p] = await banco.q<Record<string, unknown>>(
      `select id, nome, nascimento::text as nascimento, sexo, responsavel, whatsapp, convite_token, convite_em, ativado_em, consentimento_em, criado_em
         from pacientes where id = $1 and medico_id = $2 and removido_em is null`,
      [pacienteId, medicoId],
    );
    if (!p) throw new Erro(404, "Paciente não encontrado.");
    return p;
  }

  const json = express.json({ limit: "3mb" });

  // ---------- saúde ----------
  // Saúde do processo, sem tocar no banco: o Neon pode dormir quando ninguém usa.
  app.get("/api/saude", (_req, res) => {
    res.json({ ok: true });
  });

  // ---------- médico: conta ----------
  const tentativas = new Map<string, { n: number; ate: number }>();
  function limitar(chave: string) {
    const agora = Date.now();
    const t = tentativas.get(chave);
    if (t && t.ate > agora && t.n >= 8) throw new Erro(429, "Muitas tentativas. Espere 15 minutos.");
    tentativas.set(chave, t && t.ate > agora ? { n: t.n + 1, ate: t.ate } : { n: 1, ate: agora + 15 * 60_000 });
  }

  function perfilDoCorpo(b: Record<string, unknown>) {
    const nome = texto(b.nome, 80);
    const registro = texto(b.registro, 40);
    if (nome.length < 3) throw new Erro(400, "Informe o nome como as famílias veem.");
    if (registro.length < 4) throw new Erro(400, "Informe o registro (CRM).");
    return { nome, registro, titulo: texto(b.titulo, 40) || null, whatsapp: validarTelefone(b.whatsapp) || null, telefone: validarTelefone(b.telefone) || null, local: texto(b.local, 120) || null };
  }

  app.post("/api/medico/cadastro", json, rota(async (req, res) => {
    if (!o.cadastroAberto) throw new Erro(403, "Cadastro fechado.");
    const b = req.body as Record<string, unknown>;
    const email = texto(b.email, 120).toLowerCase();
    const senha = typeof b.senha === "string" ? b.senha : "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Erro(400, "E-mail inválido.");
    if (senha.length < 8) throw new Erro(400, "A senha precisa de pelo menos 8 caracteres.");
    const perfil = perfilDoCorpo(b);
    const [existe] = await banco.q(`select 1 from medicos where email = $1`, [email]);
    if (existe) throw new Erro(409, "Já existe uma conta com este e-mail.");
    const id = randomUUID();
    await banco.q(`insert into medicos (id, email, senha_hash, nome, registro, titulo, whatsapp, telefone, local) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [
      id, email, await bcrypt.hash(senha, 10), perfil.nome, perfil.registro, perfil.titulo, perfil.whatsapp, perfil.telefone, perfil.local,
    ]);
    await abrirSessao(res, "medico", { medicoId: id });
    return { medico: { ...medicoPublico({ id, ...perfil }), email } };
  }));

  app.post("/api/medico/entrar", json, rota(async (req, res) => {
    const b = req.body as Record<string, unknown>;
    const email = texto(b.email, 120).toLowerCase();
    limitar(`${req.ip}|${email}`);
    const [m] = await banco.q<LinhaMedico & { senha_hash: string }>(`select * from medicos where email = $1`, [email]);
    if (!m || !(await bcrypt.compare(typeof b.senha === "string" ? b.senha : "", m.senha_hash))) throw new Erro(401, "E-mail ou senha não conferem.");
    tentativas.delete(`${req.ip}|${email}`);
    await abrirSessao(res, "medico", { medicoId: m.id });
    return { medico: { ...medicoPublico(m), email: m.email } };
  }));

  app.post("/api/sair", json, rota(async (req, res) => {
    const tipo = (req.body as { tipo?: string })?.tipo === "familia" ? "familia" : "medico";
    const t = lerCookies(req)[COOKIE[tipo]];
    if (t) await banco.q(`delete from sessoes where hash = $1`, [sha(t)]);
    res.clearCookie(COOKIE[tipo], { path: "/" });
    return { ok: true };
  }));

  const medico = express.Router();
  medico.use(exigir("medico"));
  medico.use(json);

  medico.get("/eu", rota(async (req) => {
    const [m] = await banco.q<LinhaMedico>(`select * from medicos where id = $1`, [req.sessao!.medicoId]);
    if (!m) throw new Erro(401, "Conta não encontrada.");
    return { medico: { ...medicoPublico(m), email: m.email } };
  }));

  medico.put("/perfil", rota(async (req) => {
    const p = perfilDoCorpo(req.body as Record<string, unknown>);
    await banco.q(`update medicos set nome=$1, registro=$2, titulo=$3, whatsapp=$4, telefone=$5, local=$6 where id=$7`, [p.nome, p.registro, p.titulo, p.whatsapp, p.telefone, p.local, req.sessao!.medicoId]);
    return { medico: medicoPublico({ id: req.sessao!.medicoId!, ...p }) };
  }));

  // ---------- médico: pacientes ----------
  medico.get("/pacientes", rota(async (req) => {
    const linhas = await banco.q<Record<string, unknown>>(
      `select p.id, p.nome, p.nascimento::text as nascimento, p.sexo, p.responsavel, p.whatsapp, p.convite_token, p.convite_em, p.ativado_em, p.criado_em,
              d.doc, d.atualizado_em
         from pacientes p left join documentos d on d.chave = 'crianca:' || p.id::text
        where p.medico_id = $1 and p.removido_em is null
        order by p.nome`,
      [req.sessao!.medicoId],
    );
    const hoje = hojeIso();
    return {
      pacientes: linhas.map((p) => {
        const vista = docParaVista(p.doc ? comoJson<Doc>(p.doc) : {});
        const vacinas = situacaoDasVacinas(String(p.nascimento), hoje, new Set(vista.vacinasAplicadas));
        const ultima = vista.medidas[vista.medidas.length - 1];
        const ultimoDiario = vista.diario[0];
        return {
          id: p.id,
          crianca: { nome: p.nome, nascimento: p.nascimento, sexo: p.sexo },
          responsavel: p.responsavel,
          whatsapp: p.whatsapp,
          convite: p.convite_token,
          conviteEm: iso(p.convite_em),
          ativadoEm: iso(p.ativado_em),
          criadoEm: iso(p.criado_em),
          atualizadoEm: iso(p.atualizado_em),
          resumo: {
            vacinasPendentes: vacinas.filter((v) => v.situacao === "pendente").length,
            vacinasConfirmadas: vista.vacinasAplicadas.length,
            ultimaMedida: ultima ?? null,
            ultimoDiario: ultimoDiario?.quando ?? null,
          },
        };
      }),
    };
  }));

  medico.post("/pacientes", rota(async (req) => {
    const b = req.body as Record<string, unknown>;
    const crianca = validarCrianca(b.crianca as Partial<Crianca>);
    const id = randomUUID();
    await banco.q(`insert into pacientes (id, medico_id, nome, nascimento, sexo, responsavel, whatsapp, convite_token) values ($1,$2,$3,$4,$5,$6,$7,$8)`, [
      id, req.sessao!.medicoId, crianca.nome, crianca.nascimento, crianca.sexo, texto(b.responsavel, 80), validarTelefone(b.whatsapp), token(),
    ]);
    await juntarDoc(`crianca:${id}`, docInicial(crianca));
    return { id };
  }));

  medico.put("/pacientes/:id", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    const b = req.body as Record<string, unknown>;
    const crianca = validarCrianca(b.crianca as Partial<Crianca>);
    await banco.q(`update pacientes set nome=$1, nascimento=$2, sexo=$3, responsavel=$4, whatsapp=$5 where id=$6`, [
      crianca.nome, crianca.nascimento, crianca.sexo, texto(b.responsavel, 80), validarTelefone(b.whatsapp), req.params.id,
    ]);
    await juntarDoc(`crianca:${req.params.id}`, docInicial(crianca));
    return { ok: true };
  }));

  medico.delete("/pacientes/:id", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    await banco.q(`update pacientes set removido_em = now() where id = $1`, [req.params.id]);
    await banco.q(`delete from sessoes where paciente_id = $1`, [req.params.id]);
    return { ok: true };
  }));

  medico.post("/pacientes/:id/convite-enviado", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    await banco.q(`update pacientes set convite_em = now() where id = $1`, [req.params.id]);
    return { ok: true };
  }));

  medico.post("/pacientes/:id/novo-link", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    const t = token();
    await banco.q(`update pacientes set convite_token = $1 where id = $2`, [t, req.params.id]);
    return { convite: t };
  }));

  medico.get("/pacientes/:id/doc", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    return { doc: await lerDoc(`crianca:${req.params.id}`) };
  }));

  medico.put("/pacientes/:id/doc", rota(async (req) => {
    await pacienteDoMedico(req.sessao!.medicoId!, req.params.id);
    return { doc: await juntarDoc(`crianca:${req.params.id}`, docDoCorpo(req)) };
  }));

  // ---------- médico: financeiro (documento próprio) ----------
  medico.get("/financeiro", rota(async (req) => ({ doc: await lerDoc(`financeiro:${req.sessao!.medicoId}`) })));
  medico.put("/financeiro", rota(async (req) => ({ doc: await juntarDoc(`financeiro:${req.sessao!.medicoId}`, docDoCorpo(req)) })));

  app.use("/api/medico", medico);

  // ---------- convite (família) ----------
  async function pacientePorConvite(t: string) {
    const [p] = await banco.q<Record<string, unknown>>(
      `select p.id, p.nome, p.nascimento::text as nascimento, p.sexo, m.id as medico_id, m.nome as m_nome, m.registro, m.titulo, m.whatsapp, m.telefone, m.local
         from pacientes p join medicos m on m.id = p.medico_id
        where p.convite_token = $1 and p.removido_em is null`,
      [t],
    );
    if (!p) throw new Erro(404, "Este convite não vale mais. Peça um novo link ao consultório.");
    return p;
  }

  app.get("/api/convite/:token", rota(async (req) => {
    const p = await pacientePorConvite(req.params.token);
    return {
      medico: medicoPublico({ id: String(p.medico_id), nome: String(p.m_nome), registro: String(p.registro), titulo: p.titulo as string | null, whatsapp: p.whatsapp as string | null, telefone: p.telefone as string | null, local: p.local as string | null }),
      crianca: { nome: p.nome, nascimento: p.nascimento, sexo: p.sexo },
    };
  }));

  app.post("/api/convite/:token/aceitar", json, rota(async (req, res) => {
    const p = await pacientePorConvite(req.params.token);
    const b = req.body as { consentimento?: boolean; doc?: unknown };
    if (b.consentimento !== true) throw new Erro(400, "Para ligar ao consultório, é preciso autorizar.");
    await banco.q(`update pacientes set ativado_em = coalesce(ativado_em, now()), consentimento_em = now() where id = $1`, [p.id]);
    await abrirSessao(res, "familia", { pacienteId: String(p.id) });
    const doc = b.doc !== undefined && docValido(b.doc) ? await juntarDoc(`crianca:${p.id}`, b.doc) : await lerDoc(`crianca:${p.id}`);
    return {
      pacienteId: p.id,
      medico: medicoPublico({ id: String(p.medico_id), nome: String(p.m_nome), registro: String(p.registro), titulo: p.titulo as string | null, whatsapp: p.whatsapp as string | null, telefone: p.telefone as string | null, local: p.local as string | null }),
      doc,
    };
  }));

  const familia = express.Router();
  familia.use(exigir("familia"));
  familia.use(json);

  familia.get("/", rota(async (req) => {
    const id = req.sessao!.pacienteId!;
    const [m] = await banco.q<LinhaMedico>(`select m.* from medicos m join pacientes p on p.medico_id = m.id where p.id = $1`, [id]);
    return { pacienteId: id, medico: m ? medicoPublico(m) : null, doc: await lerDoc(`crianca:${id}`) };
  }));

  familia.put("/doc", rota(async (req) => ({ doc: await juntarDoc(`crianca:${req.sessao!.pacienteId}`, docDoCorpo(req)) })));

  app.use("/api/familia", familia);

  // ---------- carteira de vacinação ----------
  async function pacienteDaRequisicao(req: Request): Promise<{ id: string; nascimento: string; quem: "familia" | "medico" }> {
    const fam = await sessaoDe(req, "familia");
    const alvo = typeof req.query.paciente === "string" ? req.query.paciente : null;
    if (fam && (!alvo || alvo === fam.pacienteId)) {
      const [p] = await banco.q<{ nascimento: string }>(`select nascimento::text as nascimento from pacientes where id = $1`, [fam.pacienteId]);
      return { id: fam.pacienteId!, nascimento: p.nascimento, quem: "familia" };
    }
    const med = await sessaoDe(req, "medico");
    if (med && alvo) {
      const p = await pacienteDoMedico(med.medicoId!, alvo);
      return { id: alvo, nascimento: String(p.nascimento), quem: "medico" };
    }
    throw new Erro(401, "Sem acesso a esta criança.");
  }

  async function lerCarteira(id: string, pacienteId: string, nascimento: string, mime: string, bytes: Buffer) {
    try {
      if (!o.leitor) throw new Error("Leitura automática não configurada.");
      const leitura = await o.leitor({ mime, bytes }, { nascimento });
      await banco.q(`update carteiras set leitura = $1::text::jsonb, erro = null where id = $2 and paciente_id = $3`, [JSON.stringify(leitura), id, pacienteId]);
    } catch (e) {
      console.error("leitura da carteira falhou", e);
      await banco.q(`update carteiras set erro = $1 where id = $2`, [e instanceof Error ? e.message.slice(0, 200) : "Falha na leitura.", id]);
    }
  }

  app.post("/api/carteira", express.raw({ type: MIMES, limit: "12mb" }), rota(async (req) => {
    const alvo = await pacienteDaRequisicao(req);
    const mime = String(req.headers["content-type"] ?? "").split(";")[0];
    if (!MIMES.includes(mime) || !Buffer.isBuffer(req.body) || req.body.length === 0) throw new Erro(400, "Envie uma foto (JPG, PNG) ou um PDF.");
    const id = randomUUID();
    await banco.q(`insert into carteiras (id, paciente_id, enviado_por, mime, bytes, tamanho) values ($1,$2,$3,$4,$5,$6)`, [id, alvo.id, alvo.quem, mime, req.body, req.body.length]);
    void lerCarteira(id, alvo.id, alvo.nascimento, mime, req.body);
    return { id };
  }));

  app.get("/api/carteira", rota(async (req) => {
    const alvo = await pacienteDaRequisicao(req);
    const linhas = await banco.q<Record<string, unknown>>(`select id, enviado_por, mime, tamanho, leitura, erro, criado_em from carteiras where paciente_id = $1 order by criado_em desc`, [alvo.id]);
    return { carteiras: linhas.map((c) => ({ id: c.id, enviadoPor: c.enviado_por, mime: c.mime, tamanho: c.tamanho, leitura: c.leitura ? comoJson(c.leitura) : null, erro: c.erro ?? null, criadoEm: iso(c.criado_em) })) };
  }));

  app.get("/api/carteira/:id/arquivo", async (req, res, next) => {
    try {
      const alvo = await pacienteDaRequisicao(req);
      const [c] = await banco.q<{ mime: string; bytes: Uint8Array }>(`select mime, bytes from carteiras where id = $1 and paciente_id = $2`, [req.params.id, alvo.id]);
      if (!c) throw new Erro(404, "Arquivo não encontrado.");
      res.setHeader("Content-Type", c.mime);
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(Buffer.from(c.bytes));
    } catch (e) {
      next(e);
    }
  });

  app.delete("/api/carteira/:id", rota(async (req) => {
    const alvo = await pacienteDaRequisicao(req);
    await banco.q(`delete from carteiras where id = $1 and paciente_id = $2`, [req.params.id, alvo.id]);
    return { ok: true };
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

  // ---------- erros ----------
  app.use((e: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (e instanceof Erro) return res.status(e.status).json({ erro: e.message });
    const status = (e as { status?: number; type?: string })?.type === "entity.too.large" ? 413 : 500;
    if (status === 500) console.error(e);
    res.status(status).json({ erro: status === 413 ? "Arquivo grande demais (máximo 12 MB)." : "Erro no servidor. Tente de novo." });
  });

  return app;
}
