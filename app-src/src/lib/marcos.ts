// Marcos do desenvolvimento, do nascimento aos 6 anos.
// Fonte: Ministério da Saúde. Caderneta da Criança: passaporte da cidadania, 6ª edição, 2023,
// págs. 79 a 85 (Instrumento de Vigilância do Desenvolvimento). As págs. 80 e 81 são iguais na
// 7ª edição (2024), conforme material oficial do MS de 2025.
//
// Regra da caderneta (págs. 79 e 80): ao fim da faixa etária, a criança deve ter todos os marcos
// dela. Ausência de marco da faixa atual = "alerta" (orientar estimulação, retorno em 30 dias);
// ausência de marco da faixa anterior = "provável atraso" (avaliação). No 1º mês, ausência já é
// provável atraso. Aqui quem marca é a família (relato), e a classificação fica com o pediatra:
// o app só diz "converse com o pediatra".
//
// Perda de habilidade em qualquer idade é sinal de alerta: Sociedade Brasileira de Pediatria,
// Manual de Orientação nº 5, Transtorno do Espectro do Autismo, 2019.

import { idadeParaAvaliacao } from "./idade";
import type { RespostaMarco } from "./familia";

export const FONTE_MARCOS =
  "Ministério da Saúde. Caderneta da Criança: passaporte da cidadania, 6ª edição, 2023 (Instrumento de Vigilância do Desenvolvimento).";
export const FONTE_REGRESSAO = "Sociedade Brasileira de Pediatria. Manual de Orientação nº 5: Transtorno do Espectro do Autismo. 2019.";
export const FONTE_MCHAT = "Sociedade Brasileira de Pediatria. Manual de Orientação nº 150: Triagem precoce para autismo, M-CHAT-R/F. 2024.";

export type Faixa = { de: number; ate: number };
export type Marco = { id: string; faixa: Faixa; nome: string; texto: string };

const F = (de: number, ate: number): Faixa => ({ de, ate });

/** nome = como está na caderneta; texto = o que a família observa. */
export const MARCOS: readonly Marco[] = [
  { id: "m00-postura", faixa: F(0, 1), nome: "Postura: pernas e braços fletidos, cabeça lateralizada", texto: "Deitado de costas, fica com braços e pernas dobrados e a cabeça virada para um lado" },
  { id: "m00-rosto", faixa: F(0, 1), nome: "Observa um rosto", texto: "Olha para o seu rosto quando você chega a uns 30 cm dele" },
  { id: "m00-som", faixa: F(0, 1), nome: "Reage ao som", texto: "Reage a palmas ou chocalho perto da orelha: mexe os olhos ou muda a expressão" },
  { id: "m00-cabeca", faixa: F(0, 1), nome: "Eleva a cabeça", texto: "De bruços, acordado, levanta a cabeça e desencosta o queixo" },

  { id: "m01-sorri", faixa: F(1, 2), nome: "Sorri quando estimulada", texto: "Sorri quando você sorri e conversa com ele, sem cócegas" },
  { id: "m01-maos", faixa: F(1, 2), nome: "Abre as mãos", texto: "Às vezes abre as mãos sozinho" },
  { id: "m01-sons", faixa: F(1, 2), nome: "Emite sons", texto: "Faz algum som que não seja choro" },
  { id: "m01-membros", faixa: F(1, 2), nome: "Movimenta os membros", texto: "Mexe bem os braços e as pernas" },

  { id: "m02-social", faixa: F(2, 4), nome: "Responde ativamente ao contato social", texto: "Quando você conversa, responde com sorriso e sons, como se estivesse conversando" },
  { id: "m02-segura", faixa: F(2, 4), nome: "Segura objetos", texto: "Segura por alguns segundos um objeto encostado na mão dele" },
  { id: "m02-ri", faixa: F(2, 4), nome: "Emite sons, ri alto", texto: "Faz sons (gugu, eeee) e dá gargalhada" },
  { id: "m02-antebracos", faixa: F(2, 4), nome: "Levanta a cabeça e apoia-se nos antebraços, de bruços", texto: "De bruços, levanta a cabeça apoiado nos antebraços" },

  { id: "m04-busca", faixa: F(4, 6), nome: "Busca ativa de objetos", texto: "Tenta alcançar um objeto perto dele" },
  { id: "m04-boca", faixa: F(4, 6), nome: "Leva objetos à boca", texto: "Leva à boca o objeto que você dá" },
  { id: "m04-localiza", faixa: F(4, 6), nome: "Localiza o som", texto: "Vira a cabeça para o lado de um barulho suave, dos dois lados" },
  { id: "m04-rola", faixa: F(4, 6), nome: "Muda de posição (rola)", texto: "Deitado de costas, vira de bruços" },

  { id: "m06-esconde", faixa: F(6, 9), nome: "Brinca de esconde-achou", texto: "Procura você quando você se esconde atrás de um pano (\"cadê? achou!\")" },
  { id: "m06-transfere", faixa: F(6, 9), nome: "Transfere objetos de uma mão para outra", texto: "Passa um objeto de uma mão para a outra" },
  { id: "m06-silabas", faixa: F(6, 9), nome: "Duplica sílabas", texto: "Fala \"papá\", \"dadá\" ou \"mamã\"" },
  { id: "m06-senta", faixa: F(6, 9), nome: "Senta-se sem apoio", texto: "Fica sentado sem apoiar as mãos" },

  { id: "m09-imita", faixa: F(9, 12), nome: "Imita gestos", texto: "Imita bater palmas ou dar tchau" },
  { id: "m09-pinca", faixa: F(9, 12), nome: "Faz pinça", texto: "Pega uma bolinha de papel com a ponta do polegar e do indicador" },
  { id: "m09-jargao", faixa: F(9, 12), nome: "Produz \"jargão\"", texto: "Faz uma \"conversa\" com sons, mesmo sem palavras que dê para entender" },
  { id: "m09-anda-apoio", faixa: F(9, 12), nome: "Anda com apoio", texto: "Dá alguns passos segurando em algo ou em alguém" },

  { id: "m12-mostra", faixa: F(12, 15), nome: "Mostra o que quer", texto: "Mostra o que quer sem chorar: com palavra, som, apontando ou esticando a mão" },
  { id: "m12-caneca", faixa: F(12, 15), nome: "Coloca blocos na caneca", texto: "Põe pelo menos um bloquinho dentro de uma caneca e solta" },
  { id: "m12-palavra", faixa: F(12, 15), nome: "Diz uma palavra", texto: "Diz uma palavra que não seja nome de alguém da família ou do bicho de estimação" },
  { id: "m12-anda", faixa: F(12, 15), nome: "Anda sem apoio", texto: "Anda bem, com equilíbrio, sem se apoiar" },

  { id: "m15-colher", faixa: F(15, 18), nome: "Usa colher ou garfo", texto: "Come com colher ou garfo, derramando pouco" },
  { id: "m15-torre2", faixa: F(15, 18), nome: "Constrói torre de 2 cubos", texto: "Põe um bloquinho em cima do outro sem cair" },
  { id: "m15-3palavras", faixa: F(15, 18), nome: "Fala 3 palavras", texto: "Diz três palavras que não sejam nomes de pessoas da família ou do bicho de estimação" },
  { id: "m15-tras", faixa: F(15, 18), nome: "Anda para trás", texto: "Dá dois passos para trás sem cair (por exemplo, ao abrir uma gaveta)" },

  { id: "m18-tira-roupa", faixa: F(18, 24), nome: "Tira roupa", texto: "Tira sozinho alguma peça: sapato, casaco, calça ou camiseta" },
  { id: "m18-torre3", faixa: F(18, 24), nome: "Constrói torre de 3 cubos", texto: "Empilha três bloquinhos" },
  { id: "m18-figuras", faixa: F(18, 24), nome: "Aponta 2 figuras", texto: "Entre cinco figuras conhecidas, aponta pelo menos duas que você pede" },
  { id: "m18-chuta", faixa: F(18, 24), nome: "Chuta bola", texto: "Chuta a bola sem se apoiar" },

  { id: "m24-veste", faixa: F(24, 30), nome: "Veste-se com supervisão", texto: "Veste alguma peça: calcinha ou cueca, meia, sapato ou casaco" },
  { id: "m24-torre6", faixa: F(24, 30), nome: "Constrói torre de 6 cubos", texto: "Empilha seis bloquinhos" },
  { id: "m24-frases", faixa: F(24, 30), nome: "Frases com 2 palavras", texto: "Junta duas palavras com ideia de ação: \"quer água\", \"chuta bola\"" },
  { id: "m24-pula", faixa: F(24, 30), nome: "Pula com ambos os pés", texto: "Pula com os dois pés juntos, saindo do chão" },

  { id: "m30-brinca", faixa: F(30, 36), nome: "Brinca com outras crianças", texto: "Participa de brincadeiras com crianças da idade dele" },
  { id: "m30-linha", faixa: F(30, 36), nome: "Imita o desenho de uma linha", texto: "Depois de ver você fazer, risca no papel uma linha de uns 5 cm" },
  { id: "m30-acoes", faixa: F(30, 36), nome: "Reconhece 2 ações", texto: "Em figuras de bichos, aponta a certa quando você pergunta \"quem mia?\", \"quem late?\"" },
  { id: "m30-arremessa", faixa: F(30, 36), nome: "Arremessa bola", texto: "Joga a bola por cima, com o braço acima do ombro" },

  { id: "m36-camiseta", faixa: F(36, 42), nome: "Veste uma camiseta", texto: "Veste camiseta ou casaco sem botão e sem zíper, sem ajuda" },
  { id: "m36-polegar", faixa: F(36, 42), nome: "Move o polegar com a mão fechada", texto: "Depois de ver você, faz \"joia\" mexendo só o polegar" },
  { id: "m36-adjetivos", faixa: F(36, 42), nome: "Compreende 2 adjetivos", texto: "Responde com sentido a \"o que você faz quando está com fome? e com frio? e cansado?\"" },
  { id: "m36-um-pe", faixa: F(36, 42), nome: "Equilibra-se em cada pé 1 segundo", texto: "Fica num pé só por 1 segundo, com cada pé" },

  { id: "m42-cores", faixa: F(42, 48), nome: "Emparelha cores", texto: "Junta objetos da mesma cor" },
  { id: "m42-circulo", faixa: F(42, 48), nome: "Copia círculos", texto: "Copia um círculo" },
  { id: "m42-fala", faixa: F(42, 48), nome: "Fala clara e compreensível", texto: "Fala de um jeito que outras pessoas entendem" },
  { id: "m42-pula-pe", faixa: F(42, 48), nome: "Pula em um pé só", texto: "Pula num pé só duas vezes ou mais" },

  { id: "m48-veste", faixa: F(48, 54), nome: "Veste-se sem ajuda", texto: "Veste-se sozinho" },
  { id: "m48-cruz", faixa: F(48, 54), nome: "Copia cruz", texto: "Copia uma cruz: duas linhas que se cruzam perto do meio" },
  { id: "m48-preposicoes", faixa: F(48, 54), nome: "Compreende 4 preposições", texto: "Põe um brinquedo em cima, embaixo, na frente e atrás de algo quando você pede" },
  { id: "m48-pe3", faixa: F(48, 54), nome: "Equilibra-se em cada pé 3 segundos", texto: "Fica num pé só por 3 segundos, com cada pé" },

  { id: "m54-dentes", faixa: F(54, 60), nome: "Escova dentes sem ajuda", texto: "Escova os dentes sozinho, inclusive os de trás (se já foi ensinado)" },
  { id: "m54-linha", faixa: F(54, 60), nome: "Aponta a linha mais comprida", texto: "Entre duas linhas desenhadas lado a lado, aponta a mais comprida" },
  { id: "m54-define5", faixa: F(54, 60), nome: "Define 5 palavras", texto: "Explica o que é uma coisa (para que serve, como é, do que é feita), como \"o que é uma bola?\", em pelo menos 5 de 7 palavras" },
  { id: "m54-pe5", faixa: F(54, 60), nome: "Equilibra-se em um pé 5 segundos", texto: "Fica num pé só por 5 segundos" },

  { id: "m60-faz-de-conta", faixa: F(60, 66), nome: "Brinca de fazer de conta com outras crianças", texto: "Brinca de casinha, escola ou outro faz de conta com outras crianças" },
  { id: "m60-pessoa", faixa: F(60, 66), nome: "Desenha pessoa com 6 partes", texto: "Desenha uma pessoa com seis partes (cabeça, olhos, braços, pernas…)" },
  { id: "m60-analogia", faixa: F(60, 66), nome: "Faz analogia", texto: "Completa frases como \"se o cavalo é grande, o rato é…\"" },
  { id: "m60-ponta-calcanhar", faixa: F(60, 66), nome: "Marcha ponta-calcanhar", texto: "Anda em linha reta encostando o calcanhar na ponta do outro pé, por 4 passos" },

  { id: "m66-regras", faixa: F(66, 72), nome: "Aceita e segue regras nos jogos de mesa", texto: "Aceita e segue as regras de jogos de tabuleiro ou de cartas" },
  { id: "m66-quadrado", faixa: F(66, 72), nome: "Copia um quadrado", texto: "Copia um quadrado" },
  { id: "m66-define7", faixa: F(66, 72), nome: "Define 7 palavras", texto: "Explica o que é uma coisa, como em \"o que é uma bola?\", em 7 palavras" },
  { id: "m66-pe7", faixa: F(66, 72), nome: "Equilibra-se em cada pé por 7 segundos", texto: "Fica num pé só por 7 segundos, com cada pé" },
];

/** Marcado pela família quando a criança deixou de fazer algo que já fazia. */
export const ID_REGRESSAO = "perdeu-habilidade";

export const FAIXAS: readonly Faixa[] = [...new Map(MARCOS.map((m) => [`${m.faixa.de}-${m.faixa.ate}`, m.faixa])).values()];

export function rotuloFaixa(f: Faixa): string {
  const r = (m: number) => (m < 24 ? `${m} ${m === 1 ? "mês" : "meses"}` : m % 12 === 0 ? `${m / 12} anos` : `${Math.floor(m / 12)} anos e ${m % 12} meses`);
  if (f.de === 0) return `do nascimento a 1 mês`;
  return `de ${r(f.de)} a ${r(f.ate)}`;
}

/** Faixa em que a criança está (depois dos 6 anos, fica na última). */
export function faixaDaIdade(meses: number): Faixa {
  return FAIXAS.find((f) => meses >= f.de && meses < f.ate) ?? FAIXAS[FAIXAS.length - 1];
}

export type SituacaoMarco = "faz" | "sem-resposta" | "ainda-na-idade" | "conversar";

/**
 * "ainda-na-idade": a família marcou "ainda não" e a criança está na faixa do marco (alerta da caderneta:
 * estimular). "conversar": faixa já passou, ou é o 1º mês (provável atraso da caderneta: avaliar).
 */
export function situacaoMarco(m: Marco, mesesIdade: number, r: RespostaMarco | undefined): SituacaoMarco {
  if (!r) return "sem-resposta";
  if (r.faz) return "faz";
  const atual = faixaDaIdade(mesesIdade);
  const naFaixa = atual.de === m.faixa.de;
  return naFaixa && m.faixa.de !== 0 ? "ainda-na-idade" : "conversar";
}

/** O que mostrar: a faixa atual e a anterior (a caderneta manda conferir a anterior). */
export function marcosParaMostrar(mesesIdade: number): { atual: Faixa; anterior: Faixa | null; marcos: Marco[] } {
  const atual = faixaDaIdade(mesesIdade);
  const i = FAIXAS.findIndex((f) => f.de === atual.de);
  const anterior = i > 0 ? FAIXAS[i - 1] : null;
  return { atual, anterior, marcos: MARCOS.filter((m) => m.faixa.de === atual.de || (anterior && m.faixa.de === anterior.de)) };
}

export type ResumoMarcos = { conversar: Marco[]; aindaNaIdade: Marco[]; perdeuHabilidade: boolean };

export function resumoMarcos(nascimento: string, hoje: string, respostas: Record<string, RespostaMarco>, semanasGestacao?: number): ResumoMarcos {
  const meses = Math.max(0, idadeParaAvaliacao(nascimento, hoje, semanasGestacao));
  const { marcos } = marcosParaMostrar(meses);
  return {
    conversar: marcos.filter((m) => situacaoMarco(m, meses, respostas[m.id]) === "conversar"),
    aindaNaIdade: marcos.filter((m) => situacaoMarco(m, meses, respostas[m.id]) === "ainda-na-idade"),
    perdeuHabilidade: respostas[ID_REGRESSAO]?.faz === true,
  };
}

/** Janela da triagem de autismo (M-CHAT-R/F): 16 a 30 meses; SBP indica nas consultas de 18 e 24 meses. */
export const naJanelaMchat = (meses: number) => meses >= 16 && meses < 30;
