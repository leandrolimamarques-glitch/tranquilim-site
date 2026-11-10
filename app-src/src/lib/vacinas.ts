import { somarMeses } from "./idade";

// Calendário Nacional de Vacinação 2026, criança (Ministério da Saúde / PNI),
// conferido nas versões publicadas pelas secretarias estaduais de RR (maio/2026)
// e ES (junho/2026). Em 2026 a pneumocócica está em transição da 10 para a
// 20-valente; por isso o app mostra a dose sem fixar a versão.

export type Vacina = {
  id: string;
  idadeMeses: number;
  nome: string;
  dose: string;
  nota?: string;
};

export const FONTE_CALENDARIO =
  "Calendário Nacional de Vacinação 2026, Ministério da Saúde. Confirme sempre na UBS e na caderneta da criança.";

export const CALENDARIO: readonly Vacina[] = [
  { id: "bcg", idadeMeses: 0, nome: "BCG", dose: "dose única" },
  { id: "hepb-0", idadeMeses: 0, nome: "Hepatite B", dose: "dose ao nascer" },

  { id: "penta-1", idadeMeses: 2, nome: "Pentavalente (DTP + Hib + hepatite B)", dose: "1ª dose" },
  { id: "vip-1", idadeMeses: 2, nome: "Poliomielite inativada (VIP)", dose: "1ª dose" },
  { id: "rota-1", idadeMeses: 2, nome: "Rotavírus", dose: "1ª dose", nota: "Só pode ser aplicada até 11 meses e 29 dias. Não deixe passar." },
  { id: "pneumo-1", idadeMeses: 2, nome: "Pneumocócica conjugada", dose: "1ª dose", nota: "Em 2026 o SUS está trocando a 10-valente pela 20-valente. A UBS aplica a disponível." },

  { id: "menc-1", idadeMeses: 3, nome: "Meningocócica C", dose: "1ª dose" },

  { id: "penta-2", idadeMeses: 4, nome: "Pentavalente (DTP + Hib + hepatite B)", dose: "2ª dose" },
  { id: "vip-2", idadeMeses: 4, nome: "Poliomielite inativada (VIP)", dose: "2ª dose" },
  { id: "rota-2", idadeMeses: 4, nome: "Rotavírus", dose: "2ª dose", nota: "Só pode ser aplicada até 23 meses e 29 dias." },
  { id: "pneumo-2", idadeMeses: 4, nome: "Pneumocócica conjugada", dose: "2ª dose", nota: "Durante a transição, esta dose pode ser da 10-valente." },

  { id: "menc-2", idadeMeses: 5, nome: "Meningocócica C", dose: "2ª dose" },

  { id: "penta-3", idadeMeses: 6, nome: "Pentavalente (DTP + Hib + hepatite B)", dose: "3ª dose" },
  { id: "vip-3", idadeMeses: 6, nome: "Poliomielite inativada (VIP)", dose: "3ª dose" },
  { id: "flu-1", idadeMeses: 6, nome: "Influenza (gripe)", dose: "1ª dose", nota: "Todo ano, dos 6 meses até antes dos 6 anos. No primeiro ano são 2 doses com 30 dias de intervalo." },
  { id: "covid-1", idadeMeses: 6, nome: "Covid-19", dose: "1ª dose" },

  { id: "covid-2", idadeMeses: 7, nome: "Covid-19", dose: "2ª dose" },

  { id: "fa-1", idadeMeses: 9, nome: "Febre amarela", dose: "1 dose" },
  { id: "covid-3", idadeMeses: 9, nome: "Covid-19", dose: "3ª dose", nota: "Só para quem tomou a vacina Pfizer (Comirnaty). Com a Spikevax, o esquema é de 2 doses." },

  { id: "scr-1", idadeMeses: 12, nome: "Tríplice viral (sarampo, caxumba, rubéola)", dose: "1ª dose" },
  { id: "pneumo-r", idadeMeses: 12, nome: "Pneumocócica conjugada", dose: "reforço" },
  { id: "acwy", idadeMeses: 12, nome: "Meningocócica ACWY", dose: "1 dose" },

  { id: "dtp-r1", idadeMeses: 15, nome: "DTP (tríplice bacteriana)", dose: "1º reforço" },
  { id: "vip-r", idadeMeses: 15, nome: "Poliomielite inativada (VIP)", dose: "reforço" },
  { id: "hepa", idadeMeses: 15, nome: "Hepatite A", dose: "1 dose" },
  { id: "scrv", idadeMeses: 15, nome: "Tríplice viral 2ª dose + varicela 1ª dose", dose: "ou tetraviral (SCRV), conforme a UBS" },

  { id: "dtp-r2", idadeMeses: 48, nome: "DTP (tríplice bacteriana)", dose: "2º reforço" },
  { id: "fa-r", idadeMeses: 48, nome: "Febre amarela", dose: "reforço" },
  { id: "vari-2", idadeMeses: 48, nome: "Varicela", dose: "2ª dose" },

  { id: "hpv", idadeMeses: 108, nome: "HPV quadrivalente", dose: "dose única (9 a 14 anos)" },
];

export type SituacaoVacina = "aplicada" | "pendente" | "proxima" | "futura";

export type VacinaComSituacao = Vacina & { dataPrevista: string; situacao: SituacaoVacina };

/**
 * Pendente: a idade já chegou e a família não marcou como aplicada.
 * Próxima: o primeiro grupo de idade que ainda não chegou.
 */
export function situacaoDasVacinas(
  nascimento: string,
  hoje: string,
  aplicadas: ReadonlySet<string>,
): VacinaComSituacao[] {
  const lista = CALENDARIO.map((v) => ({ ...v, dataPrevista: somarMeses(nascimento, v.idadeMeses) }));
  const futuras = lista.filter((v) => !aplicadas.has(v.id) && v.dataPrevista > hoje);
  const proximaData = futuras.length ? futuras.reduce((a, v) => (v.dataPrevista < a ? v.dataPrevista : a), futuras[0].dataPrevista) : null;
  return lista.map((v) => {
    let situacao: SituacaoVacina;
    if (aplicadas.has(v.id)) situacao = "aplicada";
    else if (v.dataPrevista <= hoje) situacao = "pendente";
    else if (v.dataPrevista === proximaData) situacao = "proxima";
    else situacao = "futura";
    return { ...v, situacao };
  });
}
