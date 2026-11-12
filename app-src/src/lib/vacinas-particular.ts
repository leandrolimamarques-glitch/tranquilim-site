import type { Vacina } from "./vacinas";

// Vacinas da rede particular: o que o Calendário SBIm Criança 2026/2027
// (atualizado em 17/06/2026) e o Calendário de Vacinação da SBP 2025/2026
// recomendam além do que o SUS aplica na mesma idade, ou com outro produto.
// Só entra aqui o que não está coberto pelo item do SUS em CALENDARIO.
// Covid-19, BCG, hepatite B, febre amarela e tríplice viral não entram:
// a recomendação das sociedades coincide com a do SUS.

const PARTICULAR = "Não está no SUS para todas as crianças; disponível em clínicas particulares. Converse com o pediatra.";

export const FONTE_PARTICULAR =
  "Calendário de Vacinação SBIm Criança 2026/2027 (Sociedade Brasileira de Imunizações, atualizado em 17/06/2026) e Calendário de Vacinação da SBP, atualização 2025/2026 (Sociedade Brasileira de Pediatria, out/2025).";

export const NOTA_PARTICULAR =
  "Estas vacinas são recomendadas pelas sociedades médicas (SBIm e SBP), mas são pagas na rede particular; decida com o pediatra quais fazem sentido para o seu filho.";

export const CALENDARIO_PARTICULAR: readonly Vacina[] = [
  {
    id: "p-nirsevimabe",
    idadeMeses: 0,
    nome: "Nirsevimabe (anticorpo contra o vírus sincicial respiratório, VSR)",
    dose: "dose única no primeiro ano de vida",
    nota: `Não é vacina: é um anticorpo pronto que protege contra a bronquiolite pelo VSR. A SBIm e a SBP recomendam para bebês com menos de 12 meses, de preferência ainda na maternidade, principalmente se a mãe não tomou a vacina do VSR na gestação. O SUS aplica só em prematuros menores de 6 meses e em crianças até 2 anos com algumas doenças. ${PARTICULAR}`,
  },
  {
    id: "p-acelular",
    idadeMeses: 2,
    nome: "Hexavalente ou pentavalente acelular",
    dose: "alternativa às doses de 2, 4 e 6 meses",
    nota: `Não é uma vacina a mais: substitui a pentavalente e a pólio (VIP) do SUS aos 2, 4 e 6 meses. A versão acelular costuma dar menos febre e reação no local. Escolha um dos caminhos (SUS ou clínica) para cada dose, não os dois. ${PARTICULAR}`,
  },
  {
    id: "p-menb-1",
    idadeMeses: 3,
    nome: "Meningocócica B",
    dose: "1ª dose",
    nota: `Protege contra a meningite pelo meningococo B, que nenhuma vacina do SUS cobre. Pode começar a partir dos 2 meses; o ideal é aos 3 meses. ${PARTICULAR}`,
  },
  {
    id: "p-acwy-1",
    idadeMeses: 3,
    nome: "Meningocócica ACWY",
    dose: "1ª dose",
    nota: `A SBIm e a SBP preferem a ACWY, que protege contra mais tipos de meningococo, no lugar da meningocócica C do SUS. Se fizer a ACWY, ela substitui a C desta idade; não precisa das duas. O número de doses no primeiro ano depende da marca. ${PARTICULAR}`,
  },
  {
    id: "p-menb-2",
    idadeMeses: 5,
    nome: "Meningocócica B",
    dose: "2ª dose",
    nota: `Pelo menos 2 meses depois da 1ª dose. ${PARTICULAR}`,
  },
  {
    id: "p-acwy-2",
    idadeMeses: 5,
    nome: "Meningocócica ACWY",
    dose: "2ª dose",
    nota: `Substitui a 2ª dose da meningocócica C do SUS; não precisa das duas. ${PARTICULAR}`,
  },
  {
    id: "p-rota5-3",
    idadeMeses: 6,
    nome: "Rotavírus pentavalente",
    dose: "3ª dose",
    nota: `Só para quem começou com a vacina pentavalente da clínica: ela tem 3 doses (2, 4 e 6 meses) e as de 2 e 4 meses substituem as do SUS. Quem tomou a vacina do SUS (2 doses) não precisa desta. ${PARTICULAR}`,
  },
  {
    id: "p-pneumo-3",
    idadeMeses: 6,
    nome: "Pneumocócica conjugada 20 ou 15-valente",
    dose: "3ª dose",
    nota: `A SBIm e a SBP recomendam 3 doses (2, 4 e 6 meses) e um reforço aos 12 meses, de preferência com a 20 ou a 15-valente. O SUS faz 2 doses e o reforço. Criança que tomou a 10-valente pode precisar de doses extras até os 5 anos. ${PARTICULAR}`,
  },
  {
    id: "p-menb-r",
    idadeMeses: 12,
    nome: "Meningocócica B",
    dose: "reforço (entre 12 e 15 meses)",
    nota: PARTICULAR,
  },
  {
    id: "p-hib-r",
    idadeMeses: 15,
    nome: "Haemophilus influenzae b (Hib)",
    dose: "reforço (entre 15 e 18 meses)",
    nota: `O SUS não faz este reforço. É recomendado principalmente quando as doses do primeiro ano foram com vacinas acelulares da clínica. Costuma vir junto na hexa ou penta acelular, que então substitui o reforço da DTP e da VIP do SUS nesta idade. ${PARTICULAR}`,
  },
  {
    id: "p-varicela-2",
    idadeMeses: 18,
    nome: "Varicela (catapora)",
    dose: "2ª dose antecipada",
    nota: `A SBIm e a SBP recomendam a 2ª dose a partir dos 15 meses, pelo menos 3 meses depois da 1ª, de preferência com a tetraviral. O SUS faz a 2ª dose só aos 4 anos. Quem tomar esta dose não precisa repetir aos 4 anos: são 2 doses no total. ${PARTICULAR}`,
  },
  {
    id: "p-hepa-2",
    idadeMeses: 21,
    nome: "Hepatite A",
    dose: "2ª dose",
    nota: `O SUS faz dose única aos 15 meses; a SBIm e a SBP recomendam 2 doses, com 6 meses de intervalo. Na clínica, a 1ª pode ser aos 12 meses e a 2ª aos 18 meses. ${PARTICULAR}`,
  },
  {
    id: "p-dengue-1",
    idadeMeses: 48,
    nome: "Dengue (vacina atenuada tetravalente)",
    dose: "1ª dose",
    nota: `Liberada a partir dos 4 anos, mesmo para quem nunca teve dengue. O SUS oferece só para algumas idades e cidades. Não pode ser usada por crianças com a imunidade baixa. ${PARTICULAR}`,
  },
  {
    id: "p-vip-r2",
    idadeMeses: 48,
    nome: "Poliomielite inativada (VIP)",
    dose: "2º reforço (entre 4 e 6 anos)",
    nota: `O SUS faz um único reforço aos 15 meses; a SBIm e a SBP recomendam um 2º reforço entre 4 e 6 anos, de preferência na vacina combinada com a tríplice bacteriana acelular, que substitui o 2º reforço da DTP do SUS. ${PARTICULAR}`,
  },
  {
    id: "p-dengue-2",
    idadeMeses: 51,
    nome: "Dengue (vacina atenuada tetravalente)",
    dose: "2ª dose",
    nota: `3 meses depois da 1ª dose. ${PARTICULAR}`,
  },
  {
    id: "p-acwy-r2",
    idadeMeses: 60,
    nome: "Meningocócica ACWY",
    dose: "2º reforço (entre 5 e 6 anos)",
    nota: `A proteção cai alguns anos depois do reforço de 12 meses; por isso a SBIm e a SBP recomendam outro reforço entre 5 e 6 anos. O SUS volta a aplicar só dos 11 aos 14 anos. ${PARTICULAR}`,
  },
  {
    id: "p-influenza",
    idadeMeses: 72,
    nome: "Influenza (gripe)",
    dose: "dose anual (a partir dos 6 anos)",
    nota: `A SBIm e a SBP recomendam a vacina da gripe todo ano para todas as crianças. Na rotina do SUS ela vai até antes dos 6 anos; depois, só para grupos de risco. Na clínica há também a versão quadrivalente. ${PARTICULAR}`,
  },
  {
    id: "p-hpv9-1",
    idadeMeses: 108,
    nome: "HPV nonavalente (HPV9)",
    dose: "1ª dose",
    nota: `O SUS aplica a HPV quadrivalente em dose única dos 9 aos 14 anos. A SBIm e a SBP preferem a nonavalente, que protege contra mais tipos, em 2 doses com 6 meses de intervalo. Se já tomou a do SUS, o pediatra define o intervalo. ${PARTICULAR}`,
  },
  {
    id: "p-dtpa-9",
    idadeMeses: 108,
    nome: "Tríplice bacteriana acelular do tipo adulto (dTpa)",
    dose: "reforço (entre 9 e 11 anos)",
    nota: `Reforço contra difteria, tétano e coqueluche cinco anos depois do reforço dos 4 a 6 anos. ${PARTICULAR}`,
  },
  {
    id: "p-hpv9-2",
    idadeMeses: 114,
    nome: "HPV nonavalente (HPV9)",
    dose: "2ª dose",
    nota: `6 meses depois da 1ª dose. ${PARTICULAR}`,
  },
];
