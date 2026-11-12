import type { Dica } from "./tipos";
import { RECEITAS } from "./receitas";
import { ESTIMULAR } from "./estimular";
import { CHORO_SONO } from "./choro-sono";
import { TELAS } from "./telas";
import { INTESTINO } from "./intestino";
import { PELE } from "./pele";
import { CUIDADOS } from "./cuidados";

/** Todas as dicas e receitas (cada arquivo de categoria entra aqui). */
export const DICAS: readonly Dica[] = [...RECEITAS, ...ESTIMULAR, ...CHORO_SONO, ...TELAS, ...INTESTINO, ...PELE, ...CUIDADOS];
