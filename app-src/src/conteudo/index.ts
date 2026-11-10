// Catálogo do conteúdo que aparece no app. Conteúdo novo entra aqui.
import type { Fluxo } from "../lib/fluxo";
import type { Trilha } from "./trilhas";
import { AMAMENTACAO } from "./trilhas";
import { FEBRE } from "./febre";
import { RESPIRATORIO } from "./fluxos/respiratorio";
import { VOMITO_DIARREIA } from "./fluxos/vomito-diarreia";
import { QUEDA_CABECA } from "./fluxos/queda-cabeca";
import { MANCHAS_PELE } from "./fluxos/manchas-pele";
import { ENGASGO } from "./fluxos/engasgo";
import { PRIMEIROS_DIAS } from "./aulas/primeiros-dias";
import { SONO_SEGURO } from "./aulas/sono-seguro";
import { INTRODUCAO_ALIMENTAR } from "./aulas/introducao-alimentar";
import { DESENVOLVIMENTO } from "./aulas/desenvolvimento";
import { SEGURANCA } from "./aulas/seguranca";
import { ROTINA_TELAS } from "./aulas/rotina-telas";

/** Engasgo primeiro: é o único em que cada segundo conta. */
export const FLUXOS: readonly Fluxo[] = [ENGASGO, FEBRE, RESPIRATORIO, VOMITO_DIARREIA, QUEDA_CABECA, MANCHAS_PELE];

export const TRILHAS: readonly Trilha[] = [PRIMEIROS_DIAS, AMAMENTACAO, SONO_SEGURO, INTRODUCAO_ALIMENTAR, DESENVOLVIMENTO, SEGURANCA, ROTINA_TELAS];

/** Trilhas da fase da criança, das mais específicas (faixa menor) para as gerais. */
export function trilhasDaIdade(meses: number): Trilha[] {
  return TRILHAS.filter((t) => meses >= t.deMeses && meses <= t.ateMeses).sort((a, b) => a.ateMeses - a.deMeses - (b.ateMeses - b.deMeses));
}
