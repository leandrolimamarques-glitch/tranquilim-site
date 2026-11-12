import type { Dica } from "./tipos";
import { RECEITAS } from "./receitas";
import { ESTIMULAR } from "./estimular";
import { CHORO_SONO } from "./choro-sono";
import { TELAS } from "./telas";

/** Todas as dicas e receitas (cada arquivo de categoria entra aqui). */
export const DICAS: readonly Dica[] = [...RECEITAS, ...ESTIMULAR, ...CHORO_SONO, ...TELAS];
