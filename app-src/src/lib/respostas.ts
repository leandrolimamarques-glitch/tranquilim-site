// Resposta rápida: para mãe ou pai apavorado, sem questionário. Cada tema mostra
// primeiro os sinais de perigo (os mesmos da 1ª pergunta do fluxo do "Vai ao PS?"),
// depois o que fazer em casa: a orientação escrita pelo pediatra da criança, se ele
// publicou, ou a do app (desfecho "casa" do fluxo, com as mesmas fontes). As
// perguntas do fluxo continuam a um toque, para quem não tem certeza.

import { FLUXOS } from "../conteudo";
import type { Desfecho, Fluxo, PassoSinais } from "./fluxo";

export type Tema = { id: string; titulo: string; fluxoId: string };

export const TEMAS_RAPIDOS: readonly Tema[] = [
  { id: "febre", titulo: "Febre", fluxoId: "febre" },
  { id: "respiratorio", titulo: "Tosse, nariz escorrendo, chiado", fluxoId: "respiratorio" },
  { id: "vomito-diarreia", titulo: "Vômito ou diarreia", fluxoId: "vomito-diarreia" },
  { id: "queda-cabeca", titulo: "Queda ou batida na cabeça", fluxoId: "queda-cabeca" },
  { id: "manchas-pele", titulo: "Manchas na pele", fluxoId: "manchas-pele" },
];

export const temaDoFluxo = (fluxoId: string) => TEMAS_RAPIDOS.find((t) => t.fluxoId === fluxoId) ?? null;
export const fluxoDoTema = (t: Tema): Fluxo => FLUXOS.find((f) => f.id === t.fluxoId)!;

/** Sinais que mandam para o 192 ou PS: a primeira pergunta do fluxo. */
export function sinaisDePerigo(f: Fluxo): string[] {
  const p = f.passos[f.inicio] as PassoSinais;
  return p?.tipo === "sinais" ? p.itens.map((i) => i.texto) : [];
}

export function cuidadosEmCasa(f: Fluxo): Desfecho | null {
  return f.desfechos.casa ?? null;
}

/** Febre antes dos 3 meses: sempre avaliação no mesmo dia (SBP 2021; NICE NG143). */
export function avisoDaIdade(f: Fluxo, mesesIdade: number | null): Desfecho | null {
  if (f.id === "febre" && mesesIdade !== null && mesesIdade < 3) return f.desfechos["ps-bebe"] ?? null;
  return null;
}

/** Texto inicial que o pediatra edita: as orientações de casa do app. */
export function rascunhoDoTema(t: Tema): string {
  const casa = cuidadosEmCasa(fluxoDoTema(t));
  return casa ? casa.oQueFazer.join("\n") : "";
}

/** O pediatra escreve orientação, nunca dose (regra do app). */
export const TEM_DOSE = /\d\s?(mg|ml|gotas?|comprimidos?)\b|\bgotas?\b.*\bkg\b|de \d+ em \d+ horas|\d+\s?\/\s?\d+\s?h\b/i;
