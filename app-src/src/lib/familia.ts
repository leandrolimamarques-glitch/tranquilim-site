// Ponte entre o documento sincronizado da criança (sinc.ts) e a forma que as
// telas usam (listas simples). As telas continuam trabalhando com listas; aqui
// a diferença entre o antes e o depois vira gravações e remoções no documento.

import { gravar, remover, vivos, type Doc, type Item } from "./sinc";
import type { Sexo } from "./oms";

export type Crianca = { nome: string; nascimento: string; sexo: Sexo };
export type Medida = { id: string; data: string; pesoKg?: number; comprimentoCm?: number; perimetroCefalicoCm?: number; origem?: "familia" | "consulta" };
export type TipoRegistro = "mamada" | "xixi" | "coco" | "sono";
export type Registro = { id: string; tipo: TipoRegistro; quando: string };
export type OrigemVacina = "familia" | "medico" | "carteira";
export type InfoVacina = { data?: string; origem?: OrigemVacina };
export type OutraVacina = { id: string; nome: string; data?: string; origem?: OrigemVacina };
/** Resposta da família a um marco do desenvolvimento: faz ou ainda não, e quando marcou. */
export type RespostaMarco = { faz: boolean; data: string };

export type Vista = {
  crianca: Crianca | null;
  vacinasAplicadas: string[];
  vacinaInfo: Record<string, InfoVacina>;
  outrasVacinas: OutraVacina[];
  medidas: Medida[];
  diario: Registro[];
  aulasVistas: string[];
  marcos: Record<string, RespostaMarco>;
};

export const VISTA_VAZIA: Vista = { crianca: null, vacinasAplicadas: [], vacinaInfo: {}, outrasVacinas: [], medidas: [], diario: [], aulasVistas: [], marcos: {} };

function semControle<T>(i: Item): T {
  const { em: _em, removido: _r, ...resto } = i;
  return resto as T;
}

export function docParaVista(doc: Doc): Vista {
  const c = doc.crianca?.["_"];
  const crianca = c && !c.removido ? { nome: String(c.nome), nascimento: String(c.nascimento), sexo: c.sexo as Sexo } : null;
  const vacinas = vivos(doc, "vacinas");
  const vacinaInfo: Record<string, InfoVacina> = {};
  for (const v of vacinas) {
    const info: InfoVacina = {};
    if (typeof v.data === "string") info.data = v.data;
    if (typeof v.origem === "string") info.origem = v.origem as OrigemVacina;
    vacinaInfo[v.id] = info;
  }
  return {
    crianca,
    vacinasAplicadas: vacinas.map((v) => v.id).sort(),
    vacinaInfo,
    outrasVacinas: vivos(doc, "outrasVacinas").map((i) => semControle<OutraVacina>(i)).sort((a, b) => (a.data ?? "").localeCompare(b.data ?? "")),
    medidas: vivos(doc, "medidas").map((i) => semControle<Medida>(i)).sort((a, b) => a.data.localeCompare(b.data)),
    diario: vivos(doc, "diario").map((i) => semControle<Registro>(i)).sort((a, b) => b.quando.localeCompare(a.quando)),
    aulasVistas: vivos(doc, "aulas").map((a) => a.id).sort(),
    marcos: Object.fromEntries(vivos(doc, "marcos").map((m) => [m.id, { faz: m.faz === true, data: String(m.data ?? "") }])),
  };
}

function porId<T extends { id: string }>(lista: T[]): Map<string, T> {
  return new Map(lista.map((x) => [x.id, x]));
}

function aplicarLista<T extends { id: string }>(doc: Doc, colecao: string, antes: T[], depois: T[], agora: number): Doc {
  const a = porId(antes);
  const d = porId(depois);
  let saida = doc;
  for (const [id, item] of d) {
    const velho = a.get(id);
    if (!velho || JSON.stringify(velho) !== JSON.stringify(item)) saida = gravar(saida, colecao, { ...item }, agora);
  }
  for (const id of a.keys()) if (!d.has(id)) saida = remover(saida, colecao, id, agora);
  return saida;
}

/** Transforma a mudança feita pela tela (antes → depois) em gravações no documento. */
export function aplicarVista(doc: Doc, antes: Vista, depois: Vista, agora: number = Date.now()): Doc {
  let saida = doc;
  if (JSON.stringify(antes.crianca) !== JSON.stringify(depois.crianca)) {
    saida = depois.crianca ? gravar(saida, "crianca", { id: "_", ...depois.crianca }, agora) : remover(saida, "crianca", "_", agora);
  }
  const vacinaComoItem = (v: Vista) => v.vacinasAplicadas.map((id) => ({ id, ...(v.vacinaInfo[id] ?? {}) }));
  saida = aplicarLista(saida, "vacinas", vacinaComoItem(antes), vacinaComoItem(depois), agora);
  saida = aplicarLista(saida, "outrasVacinas", antes.outrasVacinas, depois.outrasVacinas, agora);
  saida = aplicarLista(saida, "medidas", antes.medidas, depois.medidas, agora);
  saida = aplicarLista(saida, "diario", antes.diario, depois.diario, agora);
  const aulas = (v: Vista) => v.aulasVistas.map((id) => ({ id }));
  saida = aplicarLista(saida, "aulas", aulas(antes), aulas(depois), agora);
  const marcos = (v: Vista) => Object.entries(v.marcos ?? {}).map(([id, r]) => ({ id, ...r }));
  saida = aplicarLista(saida, "marcos", marcos(antes), marcos(depois), agora);
  return saida;
}

/** Documento inicial de um paciente cadastrado pelo médico. */
export function docInicial(crianca: Crianca, agora: number = Date.now()): Doc {
  return gravar({}, "crianca", { id: "_", ...crianca }, agora);
}
