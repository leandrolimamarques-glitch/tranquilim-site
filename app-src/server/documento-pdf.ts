// PDF A4 dos documentos do prontuário: receita, atestado, declaração de comparecimento e
// pedido de exames. Sai para imprimir e assinar à mão (assinatura digital ICP-Brasil é
// etapa futura). Não calcula dose: o que está escrito é o que o médico digitou.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type ItemReceita = { medicamento: string; quantidade: string; posologia: string };
export type ConteudoDocumento =
  | { tipo: "receita"; itens: ItemReceita[]; orientacoes: string; antimicrobiano: boolean }
  | { tipo: "atestado"; finalidade: string; dias: number; aPartirDe: string; observacao: string; cid: string; cidAutorizado: boolean }
  | { tipo: "comparecimento"; responsavel: string; data: string; horaInicio: string; horaFim: string }
  | { tipo: "exame"; itens: string[]; indicacao: string };

export type MedicoPdf = { nome: string; titulo: string | null; registro: string | null; local: string | null; telefone: string | null };
export type PacientePdf = { nome: string; nascimento: string; responsavel: string };

const TITULOS: Record<ConteudoDocumento["tipo"], string> = {
  receita: "RECEITUÁRIO",
  atestado: "ATESTADO MÉDICO",
  comparecimento: "DECLARAÇÃO DE COMPARECIMENTO",
  exame: "SOLICITAÇÃO DE EXAMES",
};

const dataBr = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : iso);
const extenso = (n: number) =>
  ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze"][n] ?? String(n);

function idade(nascimento: string, em: string): string {
  const [a, m, d] = nascimento.split("-").map(Number);
  const [A, M, D] = em.split("-").map(Number);
  let meses = (A - a) * 12 + (M - m) - (D < d ? 1 : 0);
  if (meses < 0) meses = 0;
  if (meses < 1) return "menos de 1 mês";
  if (meses < 24) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12);
  const r = meses % 12;
  return `${anos} anos${r ? ` e ${r} ${r === 1 ? "mês" : "meses"}` : ""}`;
}

/** Fontes padrão do PDF (WinAnsi): troca o que não cabe nelas. */
const limpar = (s: string) =>
  s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x09\x0A\x0D\x20-\x7E -ÿ]/g, "");

class Folha {
  page!: PDFPage;
  y = 0;
  readonly M = 56;
  readonly L = 595.28;
  readonly A = 841.89;
  constructor(private pdf: PDFDocument, private f: PDFFont, private fb: PDFFont, private cabecalho: (fl: Folha) => void) {}
  nova() {
    this.page = this.pdf.addPage([this.L, this.A]);
    this.y = this.A - this.M;
    this.cabecalho(this);
  }
  garantir(altura: number) {
    if (this.y - altura < this.M + 120) this.nova();
  }
  texto(t: string, o: { tam?: number; negrito?: boolean; recuo?: number; cor?: number; centro?: boolean; espaco?: number } = {}) {
    const tam = o.tam ?? 11;
    const fonte = o.negrito ? this.fb : this.f;
    const largura = this.L - 2 * this.M - (o.recuo ?? 0);
    for (const paragrafo of limpar(t).split("\n")) {
      const linhas: string[] = [];
      let atual = "";
      for (const palavra of paragrafo.split(/\s+/)) {
        const teste = atual ? `${atual} ${palavra}` : palavra;
        if (fonte.widthOfTextAtSize(teste, tam) > largura && atual) {
          linhas.push(atual);
          atual = palavra;
        } else atual = teste;
      }
      linhas.push(atual);
      for (const l of linhas) {
        this.garantir(tam * 1.4);
        const w = fonte.widthOfTextAtSize(l, tam);
        const x = o.centro ? (this.L - w) / 2 : this.M + (o.recuo ?? 0);
        this.page.drawText(l, { x, y: this.y - tam, size: tam, font: fonte, color: rgb(o.cor ?? 0.1, o.cor ?? 0.12, o.cor ?? 0.2) });
        this.y -= tam * 1.4;
      }
    }
    this.y -= o.espaco ?? 4;
  }
  linha() {
    this.page.drawLine({ start: { x: this.M, y: this.y }, end: { x: this.L - this.M, y: this.y }, thickness: 0.6, color: rgb(0.7, 0.7, 0.75) });
    this.y -= 12;
  }
  assinatura(medico: MedicoPdf, local: string, data: string) {
    this.garantir(110);
    this.y = Math.min(this.y, this.M + 150);
    this.texto(`${local ? `${local}, ` : ""}${dataBr(data)}`, { tam: 11, espaco: 40 });
    const x0 = this.L / 2 - 120;
    this.page.drawLine({ start: { x: x0, y: this.y }, end: { x: x0 + 240, y: this.y }, thickness: 0.8, color: rgb(0.2, 0.2, 0.25) });
    this.y -= 14;
    this.texto(medico.nome, { tam: 11, negrito: true, centro: true, espaco: 0 });
    this.texto([medico.titulo, medico.registro].filter(Boolean).join(" · ") || "Médico", { tam: 10, centro: true, espaco: 0 });
    this.texto("Assinatura e carimbo", { tam: 9, centro: true, cor: 0.45 });
  }
}

export async function gerarPdfDocumento(c: ConteudoDocumento, paciente: PacientePdf, medico: MedicoPdf, emitidoEm: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${TITULOS[c.tipo]} - ${paciente.nome}`);
  pdf.setProducer("Tranquilim");
  const f = await pdf.embedFont(StandardFonts.Helvetica);
  const fb = await pdf.embedFont(StandardFonts.HelveticaBold);
  const vias = c.tipo === "receita" && c.antimicrobiano ? ["1ª via: retenção da farmácia", "2ª via: paciente"] : [""];

  for (const via of vias) {
    const fl = new Folha(pdf, f, fb, (x) => {
      x.texto(medico.nome, { tam: 14, negrito: true, espaco: 0 });
      x.texto([medico.titulo, medico.registro].filter(Boolean).join(" · ") || "Médico", { tam: 10, espaco: 0 });
      if (medico.local || medico.telefone) x.texto([medico.local, medico.telefone].filter(Boolean).join(" · "), { tam: 9, cor: 0.4, espaco: 2 });
      x.linha();
      x.texto(TITULOS[c.tipo], { tam: 13, negrito: true, centro: true, espaco: via ? 0 : 8 });
      if (via) x.texto(via, { tam: 9, centro: true, cor: 0.4, espaco: 8 });
    });
    fl.nova();
    fl.texto(`Paciente: ${paciente.nome}`, { negrito: true, espaco: 0 });
    fl.texto(`Nascimento: ${dataBr(paciente.nascimento)} (${idade(paciente.nascimento, emitidoEm)})${paciente.responsavel ? ` · Responsável: ${paciente.responsavel}` : ""}`, { tam: 10, espaco: 14 });

    if (c.tipo === "receita") {
      if (c.antimicrobiano) fl.texto("Receita de antimicrobiano (RDC Anvisa 471/2021): em duas vias.", { tam: 9, cor: 0.4, espaco: 8 });
      c.itens.forEach((it, i) => {
        fl.garantir(60);
        fl.texto(`${i + 1}. ${it.medicamento}${it.quantidade ? ` ........ ${it.quantidade}` : ""}`, { negrito: true, espaco: 2 });
        if (it.posologia) fl.texto(it.posologia, { recuo: 16, espaco: 12 });
      });
      if (c.orientacoes) {
        fl.texto("Orientações", { negrito: true, espaco: 2 });
        fl.texto(c.orientacoes, { espaco: 10 });
      }
    } else if (c.tipo === "atestado") {
      const dias = Math.max(1, Math.round(c.dias));
      fl.texto(
        `Atesto, para fins de ${c.finalidade || "afastamento das atividades"}, que ${paciente.nome} esteve sob meus cuidados e necessita de ${dias} (${extenso(dias)}) ${dias === 1 ? "dia" : "dias"} de afastamento a partir de ${dataBr(c.aPartirDe)}.`,
        { tam: 12, espaco: 12 },
      );
      if (c.observacao) fl.texto(c.observacao, { espaco: 10 });
      if (c.cid && c.cidAutorizado) fl.texto(`Diagnóstico (CID): ${c.cid}, incluído com autorização do responsável.`, { tam: 10, espaco: 10 });
    } else if (c.tipo === "comparecimento") {
      fl.texto(
        `Declaro, para os devidos fins, que ${c.responsavel || "o(a) responsável"} esteve presente nesta data, ${dataBr(c.data)}${c.horaInicio ? `, das ${c.horaInicio}` : ""}${c.horaFim ? ` às ${c.horaFim}` : ""}, acompanhando o(a) paciente ${paciente.nome} em consulta médica.`,
        { tam: 12, espaco: 12 },
      );
    } else {
      c.itens.forEach((it, i) => fl.texto(`${i + 1}. ${it}`, { espaco: 4 }));
      if (c.indicacao) {
        fl.y -= 8;
        fl.texto("Indicação clínica", { negrito: true, espaco: 2 });
        fl.texto(c.indicacao, { espaco: 10 });
      }
    }
    fl.assinatura(medico, medico.local ?? "", emitidoEm);
    fl.page.drawText(limpar("Documento emitido no Tranquilim. Válido com a assinatura do médico."), { x: fl.M, y: 30, size: 8, font: f, color: rgb(0.5, 0.5, 0.55) });
  }
  return pdf.save();
}
