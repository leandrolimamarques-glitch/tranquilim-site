// Datas como "AAAA-MM-DD", sempre no fuso local, sem hora.

export function paraData(iso: string): Date {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function paraIso(data: Date): string {
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${m}-${d}`;
}

export function hojeIso(agora: Date = new Date()): string {
  return paraIso(agora);
}

export function idadeEmDias(nascimento: string, hoje: string): number {
  const ms = paraData(hoje).getTime() - paraData(nascimento).getTime();
  return Math.round(ms / 86_400_000);
}

/** Soma meses de calendário; dia 31 vira o último dia do mês de destino. */
export function somarMeses(iso: string, meses: number): string {
  const d = paraData(iso);
  const alvo = new Date(d.getFullYear(), d.getMonth() + meses, 1);
  const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
  alvo.setDate(Math.min(d.getDate(), ultimoDia));
  return paraIso(alvo);
}

/** Meses completos de calendário entre o nascimento e a data. */
export function mesesCompletos(nascimento: string, hoje: string): number {
  const n = paraData(nascimento);
  const h = paraData(hoje);
  let meses = (h.getFullYear() - n.getFullYear()) * 12 + (h.getMonth() - n.getMonth());
  if (h.getDate() < n.getDate()) meses -= 1;
  return Math.max(0, meses);
}

/** Idade em meses com fração (dias / 30,4375), usada nas curvas da OMS. */
export function idadeEmMesesDecimal(nascimento: string, data: string): number {
  return idadeEmDias(nascimento, data) / 30.4375;
}

/**
 * Idade em meses para avaliar crescimento e desenvolvimento: corrigida para prematuros
 * (nascidos com menos de 37 semanas), descontando as semanas que faltaram para 40, até
 * "ateMeses" de idade real; depois, a idade real. Vacina segue sempre a idade real.
 * Fonte: Sociedade Brasileira de Pediatria, Manual de Seguimento do Recém-nascido de Alto
 * Risco, 2ª ed., 2024 (desenvolvimento: idade corrigida nos 3 primeiros anos; peso e
 * comprimento: até 2 a 3 anos; perímetro cefálico: até 1 ano).
 */
export function idadeParaAvaliacao(nascimento: string, data: string, semanasGestacao?: number, ateMeses = 36): number {
  const real = idadeEmMesesDecimal(nascimento, data);
  if (!semanasGestacao || semanasGestacao >= 37 || real >= ateMeses) return real;
  return real - ((40 - semanasGestacao) * 7) / 30.4375;
}

export const ehPrematuro = (semanasGestacao?: number) => !!semanasGestacao && semanasGestacao < 37;

export function idadeTexto(nascimento: string, hoje: string): string {
  const dias = idadeEmDias(nascimento, hoje);
  if (dias < 0) return "ainda não nasceu";
  if (dias === 0) return "nasceu hoje";
  if (dias < 14) return dias === 1 ? "1 dia" : `${dias} dias`;
  const meses = mesesCompletos(nascimento, hoje);
  if (meses < 3) {
    const semanas = Math.floor(dias / 7);
    return `${semanas} semanas`;
  }
  if (meses < 24) return `${meses} meses`;
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const a = anos === 1 ? "1 ano" : `${anos} anos`;
  if (resto === 0) return a;
  return `${a} e ${resto === 1 ? "1 mês" : `${resto} meses`}`;
}

export function dataBr(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}
