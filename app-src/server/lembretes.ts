// Lembrete de vacina por e-mail: no máximo um a cada 28 dias por conta, só para quem
// confirmou o e-mail, tem conta há mais de 7 dias (tempo de preencher a caderneta)
// e não desligou. Cada e-mail tem link para parar de receber.

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Banco } from "./banco";
import type { Carteiro } from "./email";
import { mensagem } from "./email";
import { docParaVista } from "../src/lib/familia";
import { situacaoDasVacinas } from "../src/lib/vacinas";
import { dataBr, hojeIso, somarMeses } from "../src/lib/idade";
import type { Doc } from "../src/lib/sinc";

export type ResumoVacinas = { atrasadas: string[]; proximas: { nome: string; data: string }[] };

/** Vacinas do SUS com a idade passada e não marcadas, e as que vencem nos próximos 30 dias. */
export function resumoVacinas(nascimento: string, hoje: string, aplicadas: ReadonlySet<string>): ResumoVacinas {
  const limite = somarMeses(hoje, 1);
  const lista = situacaoDasVacinas(nascimento, hoje, aplicadas);
  const rotulo = (v: { nome: string; dose: string }) => `${v.nome}, ${v.dose}`;
  return {
    atrasadas: lista.filter((v) => v.situacao === "pendente").map(rotulo),
    proximas: lista
      .filter((v) => v.situacao !== "aplicada" && v.situacao !== "pendente" && v.dataPrevista <= limite)
      .map((v) => ({ nome: rotulo(v), data: v.dataPrevista })),
  };
}

export async function segredoLembretes(banco: Banco): Promise<string> {
  const [r] = await banco.q<{ valor: string }>(`select valor from config where chave = 'segredo_lembretes'`);
  if (r?.valor) return r.valor;
  const novo = randomBytes(32).toString("hex");
  await banco.q(`insert into config (chave, valor) values ('segredo_lembretes', $1) on conflict (chave) do nothing`, [novo]);
  const [de] = await banco.q<{ valor: string }>(`select valor from config where chave = 'segredo_lembretes'`);
  return de.valor;
}

export const assinatura = (segredo: string, contaId: string) => createHmac("sha256", segredo).update(`lembretes:${contaId}`).digest("hex").slice(0, 32);

export function assinaturaConfere(segredo: string, contaId: string, t: string): boolean {
  const certo = Buffer.from(assinatura(segredo, contaId));
  const veio = Buffer.from(String(t));
  return certo.length === veio.length && timingSafeEqual(certo, veio);
}

const comoJson = <T,>(v: unknown): T => (typeof v === "string" ? (JSON.parse(v) as T) : (v as T));

const MAX_ITENS = 8;
const cortar = (l: string[]) => (l.length > MAX_ITENS ? [...l.slice(0, MAX_ITENS), `e mais ${l.length - MAX_ITENS}`] : l);

export async function enviarLembretes(o: { banco: Banco; carteiro?: Carteiro; urlBase: string; hoje?: string }): Promise<number> {
  if (!o.carteiro) return 0;
  const hoje = o.hoje ?? hojeIso();
  const segredo = await segredoLembretes(o.banco);
  const contas = await o.banco.q<{ id: string; email: string; nome: string }>(
    `select id, email, nome from contas
      where lembretes and email_verificado_em is not null and criado_em < now() - interval '7 days'
        and (lembrete_em is null or lembrete_em < now() - interval '28 days')
        and (lembrete_verificado_em is null or lembrete_verificado_em < now() - interval '20 hours')
      limit 200`,
  );
  let enviados = 0;
  for (const c of contas) {
    // Reserva a conta (evita e-mail duplicado se houver mais de um servidor).
    const reservada = await o.banco.q(
      `update contas set lembrete_verificado_em = now() where id = $1 and (lembrete_verificado_em is null or lembrete_verificado_em < now() - interval '20 hours') returning id`,
      [c.id],
    );
    if (!reservada.length) continue;
    const ks = await o.banco.q<{ id: string; nome: string; nascimento: string; doc: unknown }>(
      `select k.id, k.nome, k.nascimento::text as nascimento, d.doc from criancas k
         join responsaveis r on r.crianca_id = k.id
         left join documentos d on d.chave = 'crianca:' || k.id::text
        where r.conta_id = $1 and k.removido_em is null and k.nascimento > $2::date - interval '7 years'`,
      [c.id, hoje],
    );
    const paragrafos: string[] = [];
    for (const k of ks) {
      const vista = docParaVista(k.doc ? comoJson<Doc>(k.doc) : {});
      const r = resumoVacinas(k.nascimento, hoje, new Set(vista.vacinasAplicadas));
      const primeiro = k.nome.split(" ")[0];
      // Caderneta ainda vazia: pedir para preencher, em vez de listar tudo como atrasado.
      if (!vista.vacinasAplicadas.length && r.atrasadas.length > 2) {
        paragrafos.push(`${primeiro}: nenhuma vacina marcada ainda na caderneta do app. Marque as que já tomou, ou mande a foto da carteira de vacinação, para os lembretes ficarem certos.`);
        continue;
      }
      if (r.atrasadas.length) paragrafos.push(`${primeiro}: com a idade passada e ainda não marcadas no app: ${cortar(r.atrasadas).join("; ")}.`);
      if (r.proximas.length) paragrafos.push(`${primeiro}: nos próximos 30 dias: ${cortar(r.proximas.map((p) => `${p.nome}, a partir de ${dataBr(p.data)}`)).join("; ")}.`);
    }
    if (!paragrafos.length) continue;
    const m = mensagem(
      "Lembrete de vacinas",
      [
        `Olá, ${c.nome.split(" ")[0]}! Pela caderneta no Tranquilim:`,
        ...paragrafos,
        "Se já tomou, marque na Caderneta do app para o lembrete ficar certo. Se não, leve a carteira de vacinação à UBS. Em caso de dúvida, fale com o pediatra.",
      ],
      { texto: "Abrir a Caderneta", url: `${o.urlBase}/` },
    );
    const parar = `${o.urlBase}/api/lembretes/parar?c=${c.id}&t=${assinatura(segredo, c.id)}`;
    try {
      await o.carteiro({
        para: c.email,
        assunto: "Lembrete de vacinas",
        texto: `${m.texto}\n\nNão quer mais receber? ${parar}`,
        html: m.html.replace("</body>", `<p style="max-width:480px;margin:0 auto 24px;padding:0 24px;font-size:13px;color:#666">Não quer mais receber lembretes? <a href="${parar}">Parar de receber</a>.</p></body>`),
      });
      await o.banco.q(`update contas set lembrete_em = now() where id = $1`, [c.id]);
      enviados++;
    } catch (e) {
      console.error("lembrete de vacina falhou", e);
    }
  }
  return enviados;
}
