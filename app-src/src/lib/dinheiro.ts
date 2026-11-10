/** R$ 1.234,56 a partir de centavos. */
export function reais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "1.234,56", "1234.5", "150" → centavos; vazio ou inválido → null. */
export function paraCentavos(texto: string): number | null {
  let t = texto.replace(/[R$\s]/g, "");
  if (!t) return null;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
}

export function centavosParaTexto(c: number): string {
  return c ? (c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "";
}

export function nomeDoMes(mes: string): string {
  const [a, m] = mes.split("-").map(Number);
  const nome = new Date(Date.UTC(a, m - 1, 1)).toLocaleDateString("pt-BR", { month: "long", timeZone: "UTC" });
  return `${nome[0].toUpperCase()}${nome.slice(1)} de ${a}`;
}
