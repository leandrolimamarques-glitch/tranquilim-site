// Prontuário do pediatra. Só o próprio pediatra vê. O paciente pode ou não ter conta da
// família no app; quando tem, o prontuário aponta para a criança, mas não depende dela:
// se a família excluir a conta, o prontuário continua com o pediatra (guarda mínima de
// 20 anos, Lei 13.787/2018). Atendimento é rascunho até ser finalizado; depois disso
// não muda nem se apaga, só recebe adendo. Documentos saem em PDF para imprimir e
// assinar; o pediatra decide se envia ao app da família.

import { randomUUID } from "node:crypto";
import express, { type NextFunction, type RequestHandler, type Response } from "express";
import type { Banco } from "./banco";
import { gerarPdfDocumento, type ConteudoDocumento, type ItemReceita } from "./documento-pdf";
import { gravar, type Doc } from "../src/lib/sinc";
import { dataValida } from "../src/lib/convite";
import { hojeIso } from "../src/lib/idade";

import type { Req } from "./app";
type Rota = (f: (req: Req, res: Response) => Promise<unknown>) => (req: Req, res: Response, next: NextFunction) => void;
type ErroCtor = new (status: number, mensagem: string) => Error;

export type CtxProntuario = {
  banco: Banco;
  rota: Rota;
  Erro: ErroCtor;
  logado: RequestHandler;
  soPediatra: RequestHandler;
  json: RequestHandler;
  juntarDoc: (chave: string, entrada: Doc) => Promise<Doc>;
};

const t = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const tl = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown, min: number, max: number) => (typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : undefined);
const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : typeof v === "string" ? v : null);
const comoJson = <T,>(v: unknown): T => (typeof v === "string" ? (JSON.parse(v) as T) : (v as T));
const uuid = (v: unknown) => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

type ConteudoAtendimento = {
  motivo: string; historia: string; exame: string; hipotese: string; conduta: string;
  pesoKg?: number; comprimentoCm?: number; perimetroCefalicoCm?: number; temperaturaC?: number;
};

function atendimentoDe(b: unknown): ConteudoAtendimento {
  const x = (b ?? {}) as Record<string, unknown>;
  const c: ConteudoAtendimento = {
    motivo: tl(x.motivo, 2000), historia: tl(x.historia, 20000), exame: tl(x.exame, 20000), hipotese: tl(x.hipotese, 4000), conduta: tl(x.conduta, 20000),
  };
  const p = num(x.pesoKg, 0.3, 150); if (p !== undefined) c.pesoKg = p;
  const cm = num(x.comprimentoCm, 25, 200); if (cm !== undefined) c.comprimentoCm = cm;
  const pc = num(x.perimetroCefalicoCm, 20, 70); if (pc !== undefined) c.perimetroCefalicoCm = pc;
  const tc = num(x.temperaturaC, 30, 45); if (tc !== undefined) c.temperaturaC = tc;
  return c;
}

export function documentoDe(b: unknown, Erro: ErroCtor): ConteudoDocumento {
  const x = (b ?? {}) as Record<string, unknown>;
  switch (x.tipo) {
    case "receita": {
      const itens: ItemReceita[] = (Array.isArray(x.itens) ? x.itens : []).slice(0, 20).map((i) => {
        const r = (i ?? {}) as Record<string, unknown>;
        return { medicamento: t(r.medicamento, 200), quantidade: t(r.quantidade, 80), posologia: tl(r.posologia, 1000) };
      }).filter((i) => i.medicamento);
      if (!itens.length) throw new Erro(400, "Inclua pelo menos um medicamento.");
      return { tipo: "receita", itens, orientacoes: tl(x.orientacoes, 3000), antimicrobiano: x.antimicrobiano === true };
    }
    case "atestado": {
      const dias = num(x.dias, 1, 365);
      if (!dias || !Number.isInteger(dias)) throw new Erro(400, "Informe os dias de afastamento.");
      if (!dataValida(x.aPartirDe)) throw new Erro(400, "Informe a partir de quando.");
      const cid = t(x.cid, 20);
      if (cid && x.cidAutorizado !== true) throw new Erro(400, "O diagnóstico só entra no atestado com autorização do responsável.");
      return { tipo: "atestado", finalidade: t(x.finalidade, 120), dias, aPartirDe: x.aPartirDe as string, observacao: tl(x.observacao, 1500), cid, cidAutorizado: x.cidAutorizado === true };
    }
    case "comparecimento": {
      if (!dataValida(x.data)) throw new Erro(400, "Informe a data.");
      const hora = (v: unknown) => (typeof v === "string" && /^\d{2}:\d{2}$/.test(v) ? v : "");
      return { tipo: "comparecimento", responsavel: t(x.responsavel, 120), data: x.data as string, horaInicio: hora(x.horaInicio), horaFim: hora(x.horaFim) };
    }
    case "exame": {
      const itens = (Array.isArray(x.itens) ? x.itens : []).slice(0, 40).map((i) => t(i, 200)).filter(Boolean);
      if (!itens.length) throw new Erro(400, "Inclua pelo menos um exame.");
      return { tipo: "exame", itens, indicacao: tl(x.indicacao, 2000) };
    }
    default:
      throw new Erro(400, "Tipo de documento inválido.");
  }
}

export function rotasProntuario(c: CtxProntuario) {
  const { banco, rota, Erro } = c;
  const r = express.Router();
  r.use(c.logado, c.soPediatra, c.json);

  type Pac = { id: string; pediatra_id: string; crianca_id: string | null; nome: string; nascimento: string; sexo: string; responsavel: string; telefone: string; alergias: string; antecedentes: string; semanas_gestacao: number | null };
  async function meuPaciente(req: Req, id: unknown): Promise<Pac> {
    if (!uuid(id)) throw new Erro(404, "Paciente não encontrado.");
    const [p] = await banco.q<Pac>(
      `select id, pediatra_id, crianca_id, nome, nascimento::text as nascimento, sexo, responsavel, telefone, alergias, antecedentes, semanas_gestacao
         from prontuario_pacientes where id = $1 and pediatra_id = $2`,
      [id, req.conta!.id],
    );
    if (!p) throw new Erro(404, "Paciente não encontrado.");
    return p;
  }
  const publico = (p: Pac & { ultimo?: unknown }) => ({
    id: p.id, criancaId: p.crianca_id, nome: p.nome, nascimento: p.nascimento, sexo: p.sexo, responsavel: p.responsavel, telefone: p.telefone,
    alergias: p.alergias, antecedentes: p.antecedentes, semanasGestacao: p.semanas_gestacao ?? undefined, ultimoAtendimento: p.ultimo ? String(p.ultimo) : null,
  });

  function cadastroDe(b: unknown) {
    const x = (b ?? {}) as Record<string, unknown>;
    const nome = t(x.nome, 80);
    if (!nome) throw new Erro(400, "Informe o nome.");
    if (!dataValida(x.nascimento)) throw new Erro(400, "Data de nascimento inválida.");
    if (x.sexo !== "menina" && x.sexo !== "menino") throw new Erro(400, "Informe menina ou menino.");
    const sg = x.semanasGestacao;
    if (sg !== undefined && sg !== null && !(Number.isInteger(sg) && (sg as number) >= 22 && (sg as number) <= 42)) throw new Erro(400, "Semanas de gestação: de 22 a 42.");
    return {
      nome, nascimento: x.nascimento as string, sexo: x.sexo, responsavel: t(x.responsavel, 120), telefone: t(x.telefone, 30),
      alergias: tl(x.alergias, 2000), antecedentes: tl(x.antecedentes, 8000), semanas: typeof sg === "number" ? sg : null,
    };
  }

  r.get("/pacientes", rota(async (req) => {
    const termo = `%${t(req.query.busca, 60).toLowerCase()}%`;
    const linhas = await banco.q<Pac & { ultimo: unknown }>(
      `select p.id, p.pediatra_id, p.crianca_id, p.nome, p.nascimento::text as nascimento, p.sexo, p.responsavel, p.telefone, p.alergias, p.antecedentes, p.semanas_gestacao,
              (select max(g.data)::text from prontuario_registros g where g.paciente_id = p.id and g.tipo = 'atendimento') as ultimo
         from prontuario_pacientes p where p.pediatra_id = $1 and (lower(p.nome) like $2 or lower(p.responsavel) like $2)
        order by p.nome limit 300`,
      [req.conta!.id, termo],
    );
    return { pacientes: linhas.map(publico) };
  }));

  /** Novo paciente. Com criancaId (criança do app que este pediatra acompanha), puxa os dados dela. */
  r.post("/pacientes", rota(async (req) => {
    const b = (req.body ?? {}) as Record<string, unknown>;
    let base: Record<string, unknown> = b;
    let criancaId: string | null = null;
    if (b.criancaId !== undefined && b.criancaId !== null) {
      if (!uuid(b.criancaId)) throw new Erro(404, "Criança não encontrada.");
      const [k] = await banco.q<{ id: string; nome: string; nascimento: string; sexo: string; semanas_gestacao: number | null; responsaveis: string | null }>(
        `select k.id, k.nome, k.nascimento::text as nascimento, k.sexo, k.semanas_gestacao,
                (select string_agg(c.nome, ', ') from responsaveis r join contas c on c.id = r.conta_id where r.crianca_id = k.id) as responsaveis
           from criancas k join acompanhamentos a on a.crianca_id = k.id where k.id = $1 and a.pediatra_id = $2 and k.removido_em is null`,
        [b.criancaId, req.conta!.id],
      );
      if (!k) throw new Erro(404, "Criança não encontrada entre os seus pacientes do app.");
      const [ja] = await banco.q<{ id: string }>(`select id from prontuario_pacientes where pediatra_id = $1 and crianca_id = $2`, [req.conta!.id, k.id]);
      if (ja) return { id: ja.id };
      criancaId = k.id;
      base = { ...b, nome: k.nome, nascimento: k.nascimento, sexo: k.sexo, semanasGestacao: k.semanas_gestacao ?? undefined, responsavel: t(b.responsavel, 120) || k.responsaveis || "" };
    }
    const d = cadastroDe(base);
    const id = randomUUID();
    await banco.q(
      `insert into prontuario_pacientes (id, pediatra_id, crianca_id, nome, nascimento, sexo, responsavel, telefone, alergias, antecedentes, semanas_gestacao)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, req.conta!.id, criancaId, d.nome, d.nascimento, d.sexo, d.responsavel, d.telefone, d.alergias, d.antecedentes, d.semanas],
    );
    return { id };
  }));

  r.put("/pacientes/:id", rota(async (req) => {
    const p = await meuPaciente(req, req.params.id);
    const d = cadastroDe(req.body);
    await banco.q(
      `update prontuario_pacientes set nome=$1, nascimento=$2, sexo=$3, responsavel=$4, telefone=$5, alergias=$6, antecedentes=$7, semanas_gestacao=$8, atualizado_em=now() where id=$9`,
      [d.nome, d.nascimento, d.sexo, d.responsavel, d.telefone, d.alergias, d.antecedentes, d.semanas, p.id],
    );
    return { ok: true };
  }));

  r.get("/pacientes/:id", rota(async (req) => {
    const p = await meuPaciente(req, req.params.id);
    const regs = await banco.q<Record<string, unknown>>(
      `select id, tipo, referente_a, data::text as data, conteudo, criado_em, finalizado_em from prontuario_registros where paciente_id = $1 order by data desc, criado_em desc`,
      [p.id],
    );
    const docs = await banco.q<Record<string, unknown>>(
      `select id, tipo, conteudo, criado_em, enviado_em from prontuario_documentos where paciente_id = $1 order by criado_em desc`,
      [p.id],
    );
    const vinculo = p.crianca_id
      ? (await banco.q(`select 1 from acompanhamentos where crianca_id = $1 and pediatra_id = $2`, [p.crianca_id, req.conta!.id])).length > 0
      : false;
    return {
      paciente: publico(p),
      noApp: vinculo,
      registros: regs.map((g) => ({ id: g.id, tipo: g.tipo, referenteA: g.referente_a, data: g.data, conteudo: comoJson(g.conteudo), criadoEm: iso(g.criado_em), finalizadoEm: iso(g.finalizado_em) })),
      documentos: docs.map((d) => ({ id: d.id, tipo: d.tipo, conteudo: comoJson(d.conteudo), criadoEm: iso(d.criado_em), enviadoEm: iso(d.enviado_em) })),
    };
  }));

  // ---------- atendimentos ----------
  async function meuRegistro(req: Req, id: unknown) {
    if (!uuid(id)) throw new Erro(404, "Registro não encontrado.");
    const [g] = await banco.q<{ id: string; paciente_id: string; tipo: string; finalizado_em: unknown; data: string; conteudo: unknown }>(
      `select g.id, g.paciente_id, g.tipo, g.finalizado_em, g.data::text as data, g.conteudo from prontuario_registros g
         join prontuario_pacientes p on p.id = g.paciente_id where g.id = $1 and p.pediatra_id = $2`,
      [id, req.conta!.id],
    );
    if (!g) throw new Erro(404, "Registro não encontrado.");
    return g;
  }

  /** Começa um atendimento (rascunho, salvo enquanto o pediatra escreve). */
  r.post("/pacientes/:id/atendimentos", rota(async (req) => {
    const p = await meuPaciente(req, req.params.id);
    const b = (req.body ?? {}) as Record<string, unknown>;
    const data = dataValida(b.data) ? (b.data as string) : hojeIso();
    const id = randomUUID();
    await banco.q(
      `insert into prontuario_registros (id, paciente_id, pediatra_id, tipo, data, conteudo) values ($1,$2,$3,'atendimento',$4,$5::text::jsonb)`,
      [id, p.id, req.conta!.id, data, JSON.stringify(atendimentoDe(b.conteudo))],
    );
    return { id };
  }));

  r.put("/registros/:id", rota(async (req) => {
    const g = await meuRegistro(req, req.params.id);
    if (g.finalizado_em || g.tipo !== "atendimento") throw new Erro(409, "Atendimento finalizado não muda. Use um adendo.");
    const b = (req.body ?? {}) as Record<string, unknown>;
    const data = dataValida(b.data) ? (b.data as string) : g.data;
    await banco.q(`update prontuario_registros set conteudo = $1::text::jsonb, data = $2 where id = $3 and finalizado_em is null`, [JSON.stringify(atendimentoDe(b.conteudo)), data, g.id]);
    return { ok: true };
  }));

  r.delete("/registros/:id", rota(async (req) => {
    const g = await meuRegistro(req, req.params.id);
    if (g.finalizado_em) throw new Erro(409, "Atendimento finalizado não se apaga.");
    await banco.q(`delete from prontuario_registros where id = $1 and finalizado_em is null`, [g.id]);
    return { ok: true };
  }));

  /** Finaliza. Se o paciente está no app e houve medida, ela vai para a curva da família. */
  r.post("/registros/:id/finalizar", rota(async (req) => {
    const g = await meuRegistro(req, req.params.id);
    if (g.finalizado_em) return { ok: true };
    await banco.q(`update prontuario_registros set finalizado_em = now() where id = $1`, [g.id]);
    const conteudo = comoJson<ConteudoAtendimento>(g.conteudo);
    const levar = (req.body as { levarMedidas?: unknown })?.levarMedidas === true;
    const [p] = await banco.q<{ crianca_id: string | null }>(`select crianca_id from prontuario_pacientes where id = $1`, [g.paciente_id]);
    if (levar && p?.crianca_id && (conteudo.pesoKg || conteudo.comprimentoCm || conteudo.perimetroCefalicoCm)) {
      const ok = (await banco.q(`select 1 from acompanhamentos where crianca_id = $1 and pediatra_id = $2`, [p.crianca_id, req.conta!.id])).length > 0;
      if (ok) {
        const medida: Record<string, unknown> = { id: `consulta-${g.id}`, data: g.data, origem: "consulta" };
        if (conteudo.pesoKg) medida.pesoKg = conteudo.pesoKg;
        if (conteudo.comprimentoCm) medida.comprimentoCm = conteudo.comprimentoCm;
        if (conteudo.perimetroCefalicoCm) medida.perimetroCefalicoCm = conteudo.perimetroCefalicoCm;
        await c.juntarDoc(`crianca:${p.crianca_id}`, gravar({}, "medidas", medida as { id: string }));
      }
    }
    return { ok: true };
  }));

  r.post("/registros/:id/adendo", rota(async (req) => {
    const g = await meuRegistro(req, req.params.id);
    if (!g.finalizado_em) throw new Erro(400, "O atendimento ainda é rascunho: edite direto.");
    const texto = tl((req.body as { texto?: unknown })?.texto, 8000);
    if (!texto) throw new Erro(400, "Escreva o adendo.");
    const id = randomUUID();
    await banco.q(
      `insert into prontuario_registros (id, paciente_id, pediatra_id, tipo, referente_a, data, conteudo, finalizado_em) values ($1,$2,$3,'adendo',$4,$5,$6::text::jsonb, now())`,
      [id, g.paciente_id, req.conta!.id, g.id, hojeIso(), JSON.stringify({ texto })],
    );
    return { id };
  }));

  // ---------- documentos ----------
  r.post("/pacientes/:id/documentos", rota(async (req) => {
    const p = await meuPaciente(req, req.params.id);
    const conteudo = documentoDe(req.body, Erro);
    const id = randomUUID();
    await banco.q(
      `insert into prontuario_documentos (id, paciente_id, pediatra_id, tipo, conteudo) values ($1,$2,$3,$4,$5::text::jsonb)`,
      [id, p.id, req.conta!.id, conteudo.tipo, JSON.stringify(conteudo)],
    );
    return { id };
  }));

  async function meuDocumento(req: Req, id: unknown) {
    if (!uuid(id)) throw new Erro(404, "Documento não encontrado.");
    const [d] = await banco.q<{ id: string; paciente_id: string; conteudo: unknown; criado_em: unknown; crianca_id: string | null }>(
      `select d.id, d.paciente_id, d.conteudo, d.criado_em, p.crianca_id from prontuario_documentos d join prontuario_pacientes p on p.id = d.paciente_id
        where d.id = $1 and d.pediatra_id = $2`,
      [id, req.conta!.id],
    );
    if (!d) throw new Erro(404, "Documento não encontrado.");
    return d;
  }

  r.get("/documentos/:id/pdf", rota(async (req, res) => {
    const d = await meuDocumento(req, req.params.id);
    const p = await meuPaciente(req, d.paciente_id);
    await enviarPdf(res, comoJson<ConteudoDocumento>(d.conteudo), p, req.conta!, iso(d.criado_em)!, d.id);
  }));

  /** Disponibiliza o documento no app da família (só se a criança é do app e segue com este pediatra). */
  r.post("/documentos/:id/enviar", rota(async (req) => {
    const d = await meuDocumento(req, req.params.id);
    if (!d.crianca_id) throw new Erro(400, "Este paciente não usa o Tranquilim. Imprima ou compartilhe o PDF.");
    const ok = (await banco.q(`select 1 from acompanhamentos where crianca_id = $1 and pediatra_id = $2`, [d.crianca_id, req.conta!.id])).length > 0;
    if (!ok) throw new Erro(400, "A família não compartilha mais a criança com você.");
    await banco.q(`update prontuario_documentos set enviado_em = coalesce(enviado_em, now()) where id = $1`, [d.id]);
    return { ok: true };
  }));

  return r;
}

export async function enviarPdf(
  res: Response,
  conteudo: ConteudoDocumento,
  p: { nome: string; nascimento: string; responsavel: string },
  medico: { nome: string; titulo: string | null; registro: string | null; local: string | null; telefone: string | null },
  criadoEm: string,
  id: string,
) {
  const bytes = await gerarPdfDocumento(conteudo, { nome: p.nome, nascimento: p.nascimento, responsavel: p.responsavel }, medico, criadoEm.slice(0, 10), id);
  const nome = `${conteudo.tipo}-${p.nome.split(" ")[0].normalize("NFD").replace(/[^\w]/g, "")}-${criadoEm.slice(0, 10)}.pdf`;
  res.setHeader("content-type", "application/pdf");
  res.setHeader("content-disposition", `inline; filename="${nome}"`);
  res.setHeader("cache-control", "private, no-store");
  res.end(Buffer.from(bytes));
}

/** Família: documentos que o pediatra enviou para a criança. */
export function rotasDocumentosFamilia(c: CtxProntuario & { acessoFamilia: (req: Req, criancaId: unknown) => Promise<{ id: string }> }) {
  const { banco, rota, Erro } = c;
  const r = express.Router();
  r.use(c.logado);
  r.get("/:crianca/documentos", rota(async (req) => {
    const a = await c.acessoFamilia(req, req.params.crianca);
    const docs = await banco.q<Record<string, unknown>>(
      `select d.id, d.tipo, d.criado_em, d.enviado_em, m.nome as medico from prontuario_documentos d
         join prontuario_pacientes p on p.id = d.paciente_id join contas m on m.id = d.pediatra_id
        where p.crianca_id = $1 and d.enviado_em is not null order by d.criado_em desc`,
      [a.id],
    );
    return { documentos: docs.map((d) => ({ id: d.id, tipo: d.tipo, medico: d.medico, criadoEm: iso(d.criado_em) })) };
  }));
  r.get("/:crianca/documentos/:id/pdf", rota(async (req, res) => {
    const a = await c.acessoFamilia(req, req.params.crianca);
    if (!uuid(req.params.id)) throw new Erro(404, "Documento não encontrado.");
    const [d] = await banco.q<Record<string, unknown>>(
      `select d.conteudo, d.criado_em, p.nome, p.nascimento::text as nascimento, p.responsavel, m.nome as m_nome, m.titulo, m.registro, m.local, m.telefone
         from prontuario_documentos d join prontuario_pacientes p on p.id = d.paciente_id join contas m on m.id = d.pediatra_id
        where d.id = $1 and p.crianca_id = $2 and d.enviado_em is not null`,
      [req.params.id, a.id],
    );
    if (!d) throw new Erro(404, "Documento não encontrado.");
    await enviarPdf(
      res,
      comoJson<ConteudoDocumento>(d.conteudo),
      { nome: String(d.nome), nascimento: String(d.nascimento), responsavel: String(d.responsavel ?? "") },
      { nome: String(d.m_nome), titulo: (d.titulo as string) ?? null, registro: (d.registro as string) ?? null, local: (d.local as string) ?? null, telefone: (d.telefone as string) ?? null },
      iso(d.criado_em)!,
      String(req.params.id),
    );
  }));
  return r;
}
