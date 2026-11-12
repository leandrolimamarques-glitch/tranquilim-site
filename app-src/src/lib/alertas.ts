// Avisos sobre a criança, a partir do que a família (ou o consultório) registrou.
// Aparecem para o pediatra no painel e, para a família, como "converse com o pediatra".

import { idadeEmDias, idadeEmMesesDecimal, idadeParaAvaliacao } from "./idade";
import { IDADE_MAXIMA_CURVA_MESES, percentil } from "./oms";
import { situacaoDasVacinas } from "./vacinas";
import type { Vista } from "./familia";
import { resumoMarcos } from "./marcos";

export type Alerta = { id: string; nivel: "atencao" | "info"; texto: string };

export function alertasDaCrianca(v: Vista, hoje: string): Alerta[] {
  const c = v.crianca;
  if (!c) return [];
  const saida: Alerta[] = [];
  const pendentes = situacaoDasVacinas(c.nascimento, hoje, new Set(v.vacinasAplicadas)).filter((x) => x.situacao === "pendente");
  if (pendentes.length) saida.push({ id: "vacinas", nivel: "atencao", texto: `${pendentes.length} ${pendentes.length === 1 ? "vacina do SUS" : "vacinas do SUS"} com a idade passada e não marcada${pendentes.length === 1 ? "" : "s"}` });

  const medidas = [...v.medidas].sort((a, b) => a.data.localeCompare(b.data));
  const naCurva = (data: string) => {
    const m = idadeParaAvaliacao(c.nascimento, data, c.semanasGestacao);
    return m >= 0 && m <= IDADE_MAXIMA_CURVA_MESES ? m : null;
  };
  for (const ind of ["peso", "comprimento"] as const) {
    const campo = ind === "peso" ? "pesoKg" : "comprimentoCm";
    const comValor = medidas.filter((m) => m[campo] !== undefined && naCurva(m.data) !== null);
    const ultima = comValor[comValor.length - 1];
    if (!ultima) continue;
    const p = percentil(c.sexo, ind, naCurva(ultima.data)!, ultima[campo]!);
    const nome = ind === "peso" ? "Peso" : "Comprimento";
    if (p < 3) saida.push({ id: `${ind}-baixo`, nivel: "atencao", texto: `${nome} abaixo do percentil 3 na última medida` });
    else if (p > 97) saida.push({ id: `${ind}-alto`, nivel: "atencao", texto: `${nome} acima do percentil 97 na última medida` });
    const anterior = comValor[comValor.length - 2];
    if (anterior) {
      const pa = percentil(c.sexo, ind, naCurva(anterior.data)!, anterior[campo]!);
      // Cruzou duas faixas de percentil para baixo (ex.: do 50 para abaixo do 15).
      const faixas = [3, 15, 50, 85, 97];
      const faixa = (x: number) => faixas.filter((f) => x >= f).length;
      if (faixa(pa) - faixa(p) >= 2) saida.push({ id: `${ind}-queda`, nivel: "atencao", texto: `${nome} caiu duas faixas de percentil entre as duas últimas medidas` });
    }
  }
  const meses = idadeEmMesesDecimal(c.nascimento, hoje);
  const ultimaData = medidas[medidas.length - 1]?.data;
  const limiteDias = meses < 6 ? 45 : meses < 24 ? 90 : 180;
  if (meses < 72 && (!ultimaData || idadeEmDias(ultimaData, hoje) > limiteDias)) {
    saida.push({ id: "sem-medida", nivel: "info", texto: ultimaData ? `Sem peso registrado há mais de ${Math.round(limiteDias / 30)} meses` : "Nenhum peso registrado ainda" });
  }

  // Marcos do desenvolvimento (relato da família; Caderneta da Criança, MS).
  const rm = resumoMarcos(c.nascimento, hoje, v.marcos ?? {}, c.semanasGestacao);
  if (rm.perdeuHabilidade) saida.push({ id: "marcos-perda", nivel: "atencao", texto: "Deixou de fazer algo que já fazia, pelo que a família marcou" });
  if (rm.conversar.length) {
    const nomes = rm.conversar.map((m) => m.nome.toLowerCase());
    const lista = nomes.length > 2 ? `${nomes.slice(0, 2).join(", ")} e mais ${nomes.length - 2}` : nomes.join(" e ");
    saida.push({ id: "marcos-atraso", nivel: "atencao", texto: `Marco do desenvolvimento ainda não alcançado, com a faixa de idade já passada: ${lista}` });
  }
  if (rm.aindaNaIdade.length) {
    saida.push({ id: "marcos-alerta", nivel: "info", texto: `${rm.aindaNaIdade.length} ${rm.aindaNaIdade.length === 1 ? "marco da idade atual ainda não alcançado" : "marcos da idade atual ainda não alcançados"} (a família está estimulando)` });
  }
  return saida;
}
