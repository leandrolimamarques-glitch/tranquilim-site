// Dicas e receitas: conteúdo curto, prático, por idade, sempre em dois níveis.

export type CategoriaDica = "receitas" | "estimular" | "choro-sono" | "telas" | "intestino" | "pele" | "cuidados";

export type Dica = {
  /** Único em todo o app, com prefixo da categoria (ex.: "rc-papa-abobora"). */
  id: string;
  categoria: CategoriaDica;
  titulo: string;
  /** Uma frase que diz para que serve. */
  resumo: string;
  /** Idade em meses em que a dica faz sentido. */
  deMeses: number;
  ateMeses: number;
  /** Só receitas de comida: ingredientes com medida caseira (colher, xícara, unidade). */
  ingredientes?: string[];
  /** Versão ultra simples: passos ou frases curtas, palavras do dia a dia. */
  simples: string[];
  /** "Entender melhor": por que funciona, variações, cuidados; um pouco mais técnico, ainda simples. */
  aprofundado: string[];
  /** Quando procurar o pediatra ou o pronto-socorro (opcional). */
  atencao?: string;
  fontes: string[];
};

export const ROTULO_CATEGORIA: Record<CategoriaDica, string> = {
  receitas: "Receitas",
  estimular: "Brincar e estimular",
  "choro-sono": "Choro e sono",
  telas: "Telas",
  intestino: "Intestino e barriga",
  pele: "Pele e manchinhas",
  cuidados: "Cuidados do dia a dia",
};
