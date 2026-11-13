// PDF A4 dos documentos do prontuário: receita, atestado, declaração de comparecimento e
// pedido de exames. Identidade do Tranquilim (coruja, Fredoka e Figtree, azul-noite e
// âmbar), pensado para imprimir bem em preto e branco. Sai para imprimir e assinar à mão
// (assinatura digital ICP-Brasil é etapa futura). Não calcula dose: o que está escrito é o
// que o médico digitou.

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import fontkit from "@pdf-lib/fontkit";
import { LineCapStyle, PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

export type ItemReceita = { medicamento: string; quantidade: string; posologia: string };
export type ConteudoDocumento =
  | { tipo: "receita"; itens: ItemReceita[]; orientacoes: string; antimicrobiano: boolean }
  | { tipo: "atestado"; finalidade: string; dias: number; aPartirDe: string; observacao: string; cid: string; cidAutorizado: boolean }
  | { tipo: "comparecimento"; responsavel: string; data: string; horaInicio: string; horaFim: string }
  | { tipo: "exame"; itens: string[]; indicacao: string };

export type MedicoPdf = { nome: string; titulo: string | null; registro: string | null; local: string | null; telefone: string | null };
export type PacientePdf = { nome: string; nascimento: string; responsavel: string };

const TITULOS: Record<ConteudoDocumento["tipo"], string> = {
  receita: "Receituário",
  atestado: "Atestado médico",
  comparecimento: "Declaração de comparecimento",
  exame: "Solicitação de exames",
};

// Cores da marca (styles.css).
const hex = (h: string): RGB => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const NOITE = hex("#1E2A47");
const LUZ = hex("#F2A93B");
const PLUMA = hex("#F6EFE4");
const CREME = hex("#FBF7F0");
const LINHA = hex("#E2DACB");
const MUDO = hex("#5D6378");
const BRANCO = rgb(1, 1, 1);

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const dataBr = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : iso);
const dataExtenso = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d === 1 ? "1º" : d} de ${MESES[m - 1]} de ${a}`;
};
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

// ---------- fontes (as mesmas do app) ----------
const requerer = createRequire(import.meta.url);
const arquivoFonte = (familia: string, peso: number) => readFileSync(requerer.resolve(`@fontsource/${familia}/files/${familia}-latin-${peso}-normal.woff`));
let fontesCache: Record<string, Uint8Array> | null = null;
function bytesFontes() {
  fontesCache ??= {
    texto: arquivoFonte("figtree", 400),
    medio: arquivoFonte("figtree", 600),
    forte: arquivoFonte("figtree", 700),
    marca: arquivoFonte("fredoka", 600),
  };
  return fontesCache;
}
type Fontes = { texto: PDFFont; medio: PDFFont; forte: PDFFont; marca: PDFFont };

// ---------- coruja (mesmo desenho do Coruja.tsx, em vetor) ----------
function coruja(page: PDFPage, x: number, yTopo: number, tamanho: number, opacidade = 1) {
  const s = tamanho / 120;
  const o = { x, y: yTopo, scale: s, opacity: opacidade, borderOpacity: opacidade };
  const c = (cx: number, cy: number, r: number, cor: RGB) => page.drawCircle({ x: x + cx * s, y: yTopo - cy * s, size: r * s, color: cor, opacity: opacidade });
  const traco = (d: string, largura: number) => page.drawSvgPath(d, { ...o, borderColor: NOITE, borderWidth: largura * s, borderLineCap: LineCapStyle.Round });
  page.drawSvgPath("M24 46 C22 32 25 22 29 12 L44 27 C52 24 62 24 70 27 L85 12 C89 22 92 32 90 46 C96 62 94 84 80 98 C70 108 44 108 34 98 C20 84 18 62 24 46 Z", { ...o, color: NOITE });
  c(44, 52, 13, BRANCO);
  c(70, 52, 13, BRANCO);
  traco("M36.5 52 Q44 59.5 51.5 52", 3.6);
  traco("M62.5 52 Q70 59.5 77.5 52", 3.6);
  page.drawSvgPath("M53.5 64 L60.5 64 L57 71 Z", { ...o, color: LUZ });
  page.drawSvgPath("M73 82 C72 76 74 72 76 68 L82 74 C85 73 89 73 92 74 L98 68 C100 72 102 76 101 82 C104 90 102 99 95 104 C90 108 83 108 78 104 C71 99 70 90 73 82 Z", { ...o, color: LUZ, borderColor: PLUMA, borderWidth: 3.5 * s });
  c(82, 86, 5, BRANCO);
  c(92, 86, 5, BRANCO);
  traco("M79 86 Q82 89.5 85 86", 2);
  traco("M89 86 Q92 89.5 95 86", 2);
  page.drawSvgPath("M85.5 92 L88.5 92 L87 95 Z", { ...o, color: NOITE });
  page.drawSvgPath("M104 14 A11 11 0 1 0 112 30 A8.5 8.5 0 1 1 104 14 Z", { ...o, color: LUZ });
}

// ---------- página ----------
const L = 595.28;
const A = 841.89;
const M = 48;
const LARGURA = L - 2 * M;
const BASE_ASSINATURA = 150; // altura reservada para assinatura + rodapé

function quebrar(t: string, fonte: PDFFont, tam: number, largura: number): string[] {
  const saida: string[] = [];
  for (const paragrafo of t.split("\n")) {
    let atual = "";
    for (const palavra of paragrafo.split(/\s+/).filter(Boolean)) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(teste, tam) > largura && atual) {
        saida.push(atual);
        atual = palavra;
      } else atual = teste;
    }
    saida.push(atual);
  }
  return saida;
}

class Documento {
  page!: PDFPage;
  y = 0;
  readonly paginas: PDFPage[] = [];
  constructor(
    private pdf: PDFDocument,
    readonly f: Fontes,
    private medico: MedicoPdf,
    private titulo: string,
    private via: string,
    private codigo: string,
    private emitido: string,
  ) {}

  /** Cabeçalho completo (1ª página) ou compacto (continuação). */
  nova(compacta = false) {
    this.page = this.pdf.addPage([L, A]);
    this.paginas.push(this.page);
    const p = this.page;
    // Marca d'água: coruja grande e bem clara.
    coruja(p, L / 2 - 150, A / 2 + 130, 300, 0.028);
    // Faixa superior.
    p.drawRectangle({ x: 0, y: A - 6, width: L, height: 6, color: NOITE });
    p.drawRectangle({ x: 0, y: A - 6, width: 120, height: 6, color: LUZ });

    let y = A - 34;
    coruja(p, M, y + 6, 44);
    p.drawText("Tranquilim", { x: M + 50, y: y - 18, size: 15, font: this.f.marca, color: NOITE });
    p.drawText("saúde infantil", { x: M + 50, y: y - 31, size: 8, font: this.f.medio, color: MUDO });

    // Médico, à direita.
    const direita = (t: string, yy: number, fonte: PDFFont, tam: number, cor: RGB) =>
      p.drawText(t, { x: L - M - fonte.widthOfTextAtSize(t, tam), y: yy, size: tam, font: fonte, color: cor });
    direita(this.medico.nome, y - 12, this.f.marca, 15, NOITE);
    direita([this.medico.titulo, this.medico.registro].filter(Boolean).join("  ·  ") || "Médico", y - 26, this.f.medio, 9.5, NOITE);
    const contato = [this.medico.local, this.medico.telefone].filter(Boolean).join("  ·  ");
    if (contato) direita(contato, y - 38, this.f.texto, 8.5, MUDO);
    y -= 58;
    p.drawLine({ start: { x: M, y }, end: { x: L - M, y }, thickness: 0.6, color: LINHA });
    y -= compacta ? 26 : 40;

    // Título do documento.
    p.drawText(this.titulo, { x: M, y, size: compacta ? 15 : 24, font: this.f.marca, color: NOITE });
    if (!compacta) p.drawRectangle({ x: M, y: y - 9, width: 36, height: 3, color: LUZ });
    const meta = `Nº ${this.codigo}  ·  ${dataBr(this.emitido)}`;
    p.drawText(meta, { x: L - M - this.f.texto.widthOfTextAtSize(meta, 8.5), y: y + 4, size: 8.5, font: this.f.texto, color: MUDO });
    if (this.via) {
      const tam = 7.5;
      const w = this.f.forte.widthOfTextAtSize(this.via, tam) + 16;
      p.drawRectangle({ x: L - M - w, y: y - 14, width: w, height: 14, color: LUZ, borderColor: LUZ, borderWidth: 0 });
      p.drawText(this.via, { x: L - M - w + 8, y: y - 10, size: tam, font: this.f.forte, color: NOITE });
    }
    this.y = y - (compacta ? 22 : 34);
  }

  garantir(altura: number) {
    if (this.y - altura < M + BASE_ASSINATURA) this.nova(true);
  }

  rotulo(t: string) {
    this.garantir(30);
    this.page.drawText(t.toUpperCase(), { x: M, y: this.y, size: 8, font: this.f.forte, color: MUDO, opacity: 1 });
    this.y -= 14;
  }

  paragrafo(t: string, o: { tam?: number; fonte?: PDFFont; recuo?: number; cor?: RGB; entre?: number; depois?: number } = {}) {
    const tam = o.tam ?? 11;
    const fonte = o.fonte ?? this.f.texto;
    const alt = tam * (o.entre ?? 1.5);
    for (const l of quebrar(t, fonte, tam, LARGURA - (o.recuo ?? 0))) {
      this.garantir(alt);
      this.page.drawText(l, { x: M + (o.recuo ?? 0), y: this.y - tam, size: tam, font: fonte, color: o.cor ?? NOITE });
      this.y -= alt;
    }
    this.y -= o.depois ?? 6;
  }

  /** Caixa creme com os dados do paciente. */
  paciente(p: PacientePdf) {
    const h = 54;
    const y0 = this.y - h;
    this.page.drawRectangle({ x: M, y: y0, width: LARGURA, height: h, color: CREME, borderColor: LINHA, borderWidth: 0.8 });
    this.page.drawRectangle({ x: M, y: y0, width: 3, height: h, color: LUZ });
    const cols = [
      { r: "Paciente", v: p.nome, w: 0.46 },
      { r: "Nascimento", v: `${dataBr(p.nascimento)} (${idade(p.nascimento, this.emitido)})`, w: 0.28 },
      { r: "Responsável", v: p.responsavel || "—", w: 0.26 },
    ];
    let x = M + 16;
    for (const c of cols) {
      const largura = LARGURA * c.w - 16;
      this.page.drawText(c.r.toUpperCase(), { x, y: this.y - 18, size: 7.5, font: this.f.forte, color: MUDO });
      const linhas = quebrar(c.v, this.f.medio, c === cols[0] ? 12 : 10, largura).slice(0, 2);
      linhas.forEach((l, i) => this.page.drawText(l, { x, y: this.y - 33 - i * 12, size: c === cols[0] ? 12 : 10, font: this.f.medio, color: NOITE }));
      x += LARGURA * c.w;
    }
    this.y = y0 - 26;
  }

  /** Bloco com filete âmbar à esquerda (orientações, indicação). */
  destaque(rotulo: string, texto: string) {
    const tam = 10.5;
    const linhas = quebrar(texto, this.f.texto, tam, LARGURA - 28);
    const h = 26 + linhas.length * tam * 1.5;
    this.garantir(h + 10);
    const y0 = this.y - h;
    this.page.drawRectangle({ x: M, y: y0, width: LARGURA, height: h, color: CREME });
    this.page.drawRectangle({ x: M, y: y0, width: 3, height: h, color: LUZ });
    this.page.drawText(rotulo.toUpperCase(), { x: M + 14, y: this.y - 16, size: 7.5, font: this.f.forte, color: MUDO });
    linhas.forEach((l, i) => this.page.drawText(l, { x: M + 14, y: this.y - 30 - i * tam * 1.5, size: tam, font: this.f.texto, color: NOITE }));
    this.y = y0 - 16;
  }

  assinatura() {
    const p = this.page;
    const yLinha = M + 70;
    const cidade = this.medico.local ? `${this.medico.local.split(/[·,-]/)[0].trim()}, ` : "";
    p.drawText(`${cidade}${dataExtenso(this.emitido)}`, { x: M, y: yLinha + 4, size: 10, font: this.f.texto, color: NOITE });
    const w = 220;
    const x0 = L - M - w;
    p.drawLine({ start: { x: x0, y: yLinha }, end: { x: L - M, y: yLinha }, thickness: 0.8, color: NOITE });
    const centro = (t: string, yy: number, fonte: PDFFont, tam: number, cor: RGB) =>
      p.drawText(t, { x: x0 + (w - fonte.widthOfTextAtSize(t, tam)) / 2, y: yy, size: tam, font: fonte, color: cor });
    centro(this.medico.nome, yLinha - 14, this.f.medio, 10.5, NOITE);
    centro([this.medico.titulo, this.medico.registro].filter(Boolean).join("  ·  ") || "Médico", yLinha - 26, this.f.texto, 9, NOITE);
    centro("assinatura e carimbo", yLinha - 38, this.f.texto, 7.5, MUDO);
  }
}

/** Rodapé com a numeração dentro de cada via. */
function rodapes(grupos: PDFPage[][], f: Fontes, codigo: string) {
  for (const paginas of grupos) paginas.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: 40 }, end: { x: L - M, y: 40 }, thickness: 0.5, color: LINHA });
    coruja(p, M, 33, 12);
    p.drawText("Emitido pelo Tranquilim  ·  Válido com a assinatura do médico", { x: M + 16, y: 24, size: 7.5, font: f.texto, color: MUDO });
    const dir = `Nº ${codigo}  ·  página ${i + 1} de ${paginas.length}`;
    p.drawText(dir, { x: L - M - f.texto.widthOfTextAtSize(dir, 7.5), y: 24, size: 7.5, font: f.texto, color: MUDO });
  });
}

export async function gerarPdfDocumento(c: ConteudoDocumento, paciente: PacientePdf, medico: MedicoPdf, emitidoEm: string, id = ""): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`${TITULOS[c.tipo]} - ${paciente.nome}`);
  pdf.setAuthor(medico.nome);
  pdf.setCreator("Tranquilim");
  pdf.setProducer("Tranquilim");
  const b = bytesFontes();
  const f: Fontes = {
    texto: await pdf.embedFont(b.texto, { subset: true }),
    medio: await pdf.embedFont(b.medio, { subset: true }),
    forte: await pdf.embedFont(b.forte, { subset: true }),
    marca: await pdf.embedFont(b.marca, { subset: true }),
  };
  const codigo = (id.replace(/-/g, "").slice(0, 8) || "00000000").toUpperCase();
  const vias = c.tipo === "receita" && c.antimicrobiano ? ["1ª VIA  ·  RETENÇÃO DA FARMÁCIA", "2ª VIA  ·  PACIENTE"] : [""];

  const grupos: PDFPage[][] = [];
  for (const via of vias) {
    const d = new Documento(pdf, f, medico, TITULOS[c.tipo], via, codigo, emitidoEm);
    grupos.push(d.paginas);
    d.nova();
    d.paciente(paciente);

    if (c.tipo === "receita") {
      if (c.antimicrobiano) d.paragrafo("Receita de antimicrobiano, em duas vias (RDC Anvisa nº 471/2021).", { tam: 8.5, cor: MUDO, depois: 10 });
      d.rotulo("Prescrição");
      c.itens.forEach((it, i) => {
        const linhasPos = quebrar(it.posologia, f.texto, 10.5, LARGURA - 34);
        d.garantir(30 + linhasPos.length * 16);
        const p = d.page;
        // Número num círculo âmbar.
        p.drawCircle({ x: M + 9, y: d.y - 8, size: 9, color: LUZ });
        const n = String(i + 1);
        p.drawText(n, { x: M + 9 - f.forte.widthOfTextAtSize(n, 9.5) / 2, y: d.y - 11.3, size: 9.5, font: f.forte, color: NOITE });
        // Medicamento ......... quantidade
        const tam = 12;
        const qtd = it.quantidade;
        const wQ = qtd ? f.medio.widthOfTextAtSize(qtd, 10.5) : 0;
        const larguraNome = LARGURA - 34 - (qtd ? wQ + 24 : 0);
        const nome = quebrar(it.medicamento, f.forte, tam, larguraNome);
        nome.forEach((l, j) => p.drawText(l, { x: M + 28, y: d.y - 12 - j * 15, size: tam, font: f.forte, color: NOITE }));
        if (qtd) {
          const yq = d.y - 12 - (nome.length - 1) * 15;
          const fimNome = M + 28 + f.forte.widthOfTextAtSize(nome[nome.length - 1], tam) + 6;
          const iniQ = L - M - wQ;
          for (let x = fimNome; x < iniQ - 6; x += 4) p.drawCircle({ x, y: yq + 2, size: 0.55, color: MUDO });
          p.drawText(qtd, { x: iniQ, y: yq, size: 10.5, font: f.medio, color: NOITE });
        }
        d.y -= 12 + (nome.length - 1) * 15 + 8;
        linhasPos.forEach((l) => {
          p.drawText(l, { x: M + 28, y: d.y - 10.5, size: 10.5, font: f.texto, color: NOITE });
          d.y -= 16;
        });
        d.y -= 12;
        if (i < c.itens.length - 1) {
          p.drawLine({ start: { x: M + 28, y: d.y + 6 }, end: { x: L - M, y: d.y + 6 }, thickness: 0.4, color: LINHA });
          d.y -= 6;
        }
      });
      if (c.orientacoes) {
        d.y -= 4;
        d.destaque("Orientações", c.orientacoes);
      }
    } else if (c.tipo === "atestado") {
      const dias = Math.max(1, Math.round(c.dias));
      d.paragrafo(
        `Atesto, para fins de ${c.finalidade || "afastamento das atividades"}, que ${paciente.nome} esteve sob meus cuidados nesta data e necessita de ${dias} (${extenso(dias)}) ${dias === 1 ? "dia" : "dias"} de afastamento, a partir de ${dataExtenso(c.aPartirDe)}.`,
        { tam: 13, entre: 1.65, depois: 14 },
      );
      if (c.observacao) d.destaque("Observação", c.observacao);
      if (c.cid && c.cidAutorizado) d.paragrafo(`Diagnóstico (CID-10): ${c.cid}. Incluído a pedido e com autorização do responsável.`, { tam: 9.5, cor: MUDO });
    } else if (c.tipo === "comparecimento") {
      const horario = c.horaInicio ? `, das ${c.horaInicio}${c.horaFim ? ` às ${c.horaFim}` : ""}` : "";
      d.paragrafo(
        `Declaro, para os devidos fins, que ${c.responsavel || "o(a) responsável"} esteve presente em ${dataExtenso(c.data)}${horario}, acompanhando ${paciente.nome} em consulta médica.`,
        { tam: 13, entre: 1.65, depois: 14 },
      );
    } else {
      d.rotulo("Exames");
      c.itens.forEach((it) => {
        d.garantir(18);
        d.page.drawRectangle({ x: M + 2, y: d.y - 10, width: 8, height: 8, borderColor: NOITE, borderWidth: 0.8 });
        const linhas = quebrar(it, f.medio, 11, LARGURA - 24);
        linhas.forEach((l, j) => d.page.drawText(l, { x: M + 20, y: d.y - 10 - j * 15, size: 11, font: f.medio, color: NOITE }));
        d.y -= 10 + linhas.length * 15 + 2;
      });
      if (c.indicacao) {
        d.y -= 10;
        d.destaque("Indicação clínica", c.indicacao);
      }
    }
    d.assinatura();
  }
  rodapes(grupos, f, codigo);
  return pdf.save();
}
