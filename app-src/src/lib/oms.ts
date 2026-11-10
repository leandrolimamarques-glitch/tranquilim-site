import { COMPRIMENTO_MENINA, COMPRIMENTO_MENINO, PESO_MENINA, PESO_MENINO, type LinhaLMS } from "./omsDados";

export type Sexo = "menina" | "menino";
export type Indicador = "peso" | "comprimento";

export const IDADE_MAXIMA_CURVA_MESES = 24;

function tabela(sexo: Sexo, indicador: Indicador): readonly LinhaLMS[] {
  if (indicador === "peso") return sexo === "menina" ? PESO_MENINA : PESO_MENINO;
  return sexo === "menina" ? COMPRIMENTO_MENINA : COMPRIMENTO_MENINO;
}

/** L, M e S na idade em meses, por interpolação linear entre os meses inteiros. */
export function lmsNaIdade(sexo: Sexo, indicador: Indicador, meses: number): { L: number; M: number; S: number } {
  const t = tabela(sexo, indicador);
  if (meses < 0 || meses > IDADE_MAXIMA_CURVA_MESES) throw new RangeError("Curva da OMS disponível de 0 a 24 meses");
  const i = Math.min(Math.floor(meses), t.length - 2);
  const f = meses - i;
  const [, L0, M0, S0] = t[i];
  const [, L1, M1, S1] = t[i + 1];
  return { L: L0 + (L1 - L0) * f, M: M0 + (M1 - M0) * f, S: S0 + (S1 - S0) * f };
}

export function escoreZ(valor: number, L: number, M: number, S: number): number {
  if (Math.abs(L) < 1e-9) return Math.log(valor / M) / S;
  return (Math.pow(valor / M, L) - 1) / (L * S);
}

export function valorNoZ(z: number, L: number, M: number, S: number): number {
  if (Math.abs(L) < 1e-9) return M * Math.exp(S * z);
  return M * Math.pow(1 + L * S * z, 1 / L);
}

/** Função de distribuição normal padrão (aproximação de Abramowitz e Stegun 7.1.26). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

export function percentil(sexo: Sexo, indicador: Indicador, meses: number, valor: number): number {
  const { L, M, S } = lmsNaIdade(sexo, indicador, meses);
  return normalCdf(escoreZ(valor, L, M, S)) * 100;
}

/** Escores z das linhas desenhadas no gráfico (percentis 3, 15, 50, 85 e 97). */
export const LINHAS_PERCENTIL: readonly { rotulo: string; z: number }[] = [
  { rotulo: "P3", z: -1.8808 },
  { rotulo: "P15", z: -1.0364 },
  { rotulo: "P50", z: 0 },
  { rotulo: "P85", z: 1.0364 },
  { rotulo: "P97", z: 1.8808 },
];

export function curva(sexo: Sexo, indicador: Indicador, z: number, ateMeses = IDADE_MAXIMA_CURVA_MESES): { meses: number; valor: number }[] {
  const pontos: { meses: number; valor: number }[] = [];
  for (let m = 0; m <= ateMeses; m += 0.5) {
    const { L, M, S } = lmsNaIdade(sexo, indicador, m);
    pontos.push({ meses: m, valor: valorNoZ(z, L, M, S) });
  }
  return pontos;
}

export function descreverPercentil(p: number): string {
  if (p < 3) return "abaixo da faixa esperada";
  if (p > 97) return "acima da faixa esperada";
  return "dentro da faixa esperada";
}
