import type { Fluxo } from "../../lib/fluxo";

// Tosse e falta de ar: rascunho para revisão médica (pediatra e médico de emergência) antes de divulgar.
// Sinais gerais de perigo, tiragem, estridor, chiado e respiração rápida: Ministério da Saúde, Manual AIDPI
// Criança: 2 meses a 5 anos (2017). Limites de respiração rápida, inclusive abaixo de 2 meses: OMS, Pocket
// book of hospital care for children, 2ª ed. (2013). Apneia, gemido, ingestão, xixi e fatores de risco:
// NICE NG9 (2015, atualizada em 2021). Frequência acima de 60 como alto risco: NICE NG143 (2019, atualizada
// em 2021). Crupe: SBP (2017). Coqueluche: MS, Guia de Vigilância em Saúde (2023). Engasgo: SBP (2025).
// Cuidados em casa: AIDPI (2017), SBP Lavagem nasal (2023), SBP Nota de Alerta sono seguro (2023),
// MS Guia Alimentar menores de 2 anos (2019). Cada ponto de decisão com a fonte: revisao/fluxos-a.md.

const SINAIS_DE_ALARME = [
  "Para de respirar por alguns segundos, ou faz pausas na respiração",
  "Lábios, língua ou rosto roxos ou acinzentados",
  "A pele afunda embaixo das costelas, entre elas ou na base do pescoço a cada respiração",
  "Geme toda vez que solta o ar",
  "Faz um barulho alto e áspero ao puxar o ar, mesmo quando está calma",
  "Está com tanta falta de ar que não consegue falar ou chorar direito",
  "Não consegue mamar, comer ou beber, ou vomita tudo o que toma",
  "Está muito sonolenta, difícil de acordar ou muito molinha, ou agitada sem conseguir se acalmar",
  "Teve uma convulsão",
  "Está há 12 horas ou mais sem fazer xixi",
  "Engasgou com comida ou com um objeto e continua tossindo, com chiado ou com falta de ar",
];

const COMO_CONTAR =
  "Com a criança calma, de preferência dormindo, levante a roupa e olhe a barriga ou o peito. " +
  "Conte quantas vezes sobe durante 1 minuto inteiro, no relógio do celular. " +
  "Não conte com ela chorando ou mamando. Se ficar em dúvida, conte de novo.";

const VOLTE_SE_ALARME = SINAIS_DE_ALARME.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`);

export const RESPIRATORIO: Fluxo = {
  id: "respiratorio",
  titulo: "Tosse e falta de ar",
  resumo: "Tosse, chiado, nariz entupido ou respiração diferente do normal.",
  inicio: "alarme",
  passos: {
    alarme: {
      id: "alarme",
      tipo: "sinais",
      pergunta: "A criança tem algum destes sinais agora?",
      ajuda:
        "Para ver a respiração, levante a roupa da criança. Marque tudo o que estiver acontecendo. Se não tiver nenhum, toque em \"Nenhum destes\".",
      itens: SINAIS_DE_ALARME.map((texto, i) => ({ id: `alarme-${i + 1}`, texto })),
      seAlgum: "ps",
      seNenhum: "idade",
    },
    idade: {
      id: "idade",
      tipo: "escolha",
      pergunta: "Quantos meses a criança tem?",
      opcoes: [
        { texto: "Menos de 3 meses", vai: "contar-bebe" },
        { texto: "De 3 a 11 meses", vai: "contar-lactente" },
        { texto: "1 ano ou mais", vai: "contar-crianca" },
      ],
    },
    "contar-bebe": {
      id: "contar-bebe",
      tipo: "escolha",
      pergunta: "Conte as respirações do bebê por 1 minuto. Quantas foram?",
      ajuda: COMO_CONTAR,
      opcoes: [
        { texto: "Menos de 60", vai: "bebe" },
        { texto: "60 ou mais", vai: "ps-bebe" },
        { texto: "Não consegui contar", vai: "bebe" },
      ],
    },
    bebe: {
      id: "bebe",
      tipo: "sinais",
      pergunta: "E o bebê tem algum destes?",
      itens: [
        { id: "bebe-1", texto: "Está mamando bem menos que o normal, ou se cansa e para no meio da mamada" },
        { id: "bebe-2", texto: "Tem febre: temperatura na axila acima de 37,3 °C" },
        { id: "bebe-4", texto: "As narinas abrem e fecham a cada respiração" },
        {
          id: "bebe-3",
          texto: "Tem crises de tosse que deixam o rosto vermelho ou roxo, ou que terminam em vômito ou com um som agudo ao puxar o ar",
        },
      ],
      seAlgum: "ps-bebe",
      seNenhum: "hoje-bebe",
    },
    "contar-lactente": {
      id: "contar-lactente",
      tipo: "escolha",
      pergunta: "Conte as respirações por 1 minuto. Quantas foram?",
      ajuda: COMO_CONTAR,
      opcoes: [
        { texto: "Menos de 50", vai: "atencao" },
        { texto: "De 50 a 59", vai: "hoje-rapida" },
        { texto: "60 ou mais", vai: "ps" },
        { texto: "Não consegui contar", vai: "atencao" },
      ],
    },
    "contar-crianca": {
      id: "contar-crianca",
      tipo: "escolha",
      pergunta: "Conte as respirações por 1 minuto. Quantas foram?",
      ajuda: COMO_CONTAR,
      opcoes: [
        { texto: "Menos de 40", vai: "atencao" },
        { texto: "De 40 a 59", vai: "hoje-rapida" },
        { texto: "60 ou mais", vai: "ps" },
        { texto: "Não consegui contar", vai: "atencao" },
      ],
    },
    atencao: {
      id: "atencao",
      tipo: "sinais",
      pergunta: "E algum destes?",
      ajuda: "Pense em como a criança está agora e nas últimas horas.",
      itens: [
        { id: "atencao-1", texto: "Chiado no peito: um assobio quando ela solta o ar" },
        { id: "atencao-2", texto: "Tosse rouca, parecida com latido de cachorro" },
        {
          id: "atencao-3",
          texto: "Crises de tosse seguidas, sem conseguir parar, que terminam com um som agudo ao puxar o ar ou com vômito",
        },
        { id: "atencao-4", texto: "Está mamando, comendo ou bebendo bem menos que o normal, mais ou menos a metade" },
        { id: "atencao-5", texto: "Está fazendo bem menos xixi que o normal" },
        { id: "atencao-6", texto: "Apareceu febre depois de alguns dias de tosse, ou a febre está piorando" },
        {
          id: "atencao-7",
          texto: "Tem doença do coração ou do pulmão, ou baixa imunidade, ou nasceu prematura e ainda tem menos de 2 anos",
        },
        { id: "atencao-9", texto: "As narinas abrem e fecham a cada respiração" },
        { id: "atencao-8", texto: "Está piorando, ou você sente que tem algo errado, mesmo sem saber explicar" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa",
    },
  },
  desfechos: {
    ps: {
      id: "ps",
      nivel: "ps",
      titulo: "Ligue 192 ou vá ao pronto-socorro agora",
      oQueFazer: [
        "Se a criança não respira, não acorda, está roxa ou engasgou e não consegue tossir nem chorar, ligue 192 agora.",
        "Deixe a criança no colo, na posição em que ela respira melhor, e tente mantê-la calma.",
        "Leve a caderneta da criança e a lista dos remédios que ela usa.",
      ],
    },
    "ps-bebe": {
      id: "ps-bebe",
      nivel: "ps",
      titulo: "Bebê com menos de 3 meses: vá ao pronto-socorro agora",
      oQueFazer: [
        "Nessa idade, respiração rápida, febre, dificuldade para mamar ou crises de tosse precisam de médico agora.",
        "Se o bebê parar de respirar, ficar roxo ou não acordar, ligue 192.",
        "Leve a caderneta do bebê.",
      ],
    },
    "hoje-bebe": {
      id: "hoje-bebe",
      nivel: "hoje",
      titulo: "Bebê com menos de 3 meses e tosse: procure atendimento hoje",
      oQueFazer: [
        "Bebês pequenos pioram mais rápido e podem ter pausas na respiração. Mesmo que pareça bem, ele precisa ser visto por um médico hoje: UBS, pediatra ou pronto atendimento.",
        "Enquanto isso, ofereça o peito mais vezes.",
        "Se o nariz estiver entupido, limpe com soro fisiológico antes das mamadas.",
        "Não dê xarope, chá, mel nem remédio para tosse.",
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Ele mamar bem menos, tiver febre ou crises de tosse: vá ao pronto-socorro.",
      ],
    },
    "hoje-rapida": {
      id: "hoje-rapida",
      nivel: "hoje",
      titulo: "Respiração rápida para a idade: procure atendimento hoje",
      oQueFazer: [
        "Respiração rápida pode ser sinal de pneumonia. A criança precisa ser examinada por um médico hoje, de preferência nas próximas horas: UBS, pediatra ou pronto atendimento.",
        "Enquanto isso, ofereça o peito ou líquidos com frequência.",
        "Não dê xarope nem remédio para tosse por conta própria.",
      ],
      volteSe: VOLTE_SE_ALARME,
    },
    hoje: {
      id: "hoje",
      nivel: "hoje",
      titulo: "Procure atendimento hoje",
      oQueFazer: [
        "Não precisa ser em minutos, mas precisa ser hoje: UBS, pediatra ou pronto atendimento.",
        "Chiado, tosse de cachorro e crises de tosse com som agudo costumam precisar de um tratamento que só o médico pode indicar.",
        "Enquanto isso, ofereça o peito ou líquidos com frequência e limpe o nariz com soro fisiológico.",
      ],
      volteSe: VOLTE_SE_ALARME,
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "Pode cuidar em casa, de olho nos sinais",
      oQueFazer: [
        "Ofereça o peito mais vezes. Se a criança já come e bebe outras coisas, ofereça água e líquidos com frequência.",
        "Limpe o nariz com soro fisiológico, sem força, principalmente antes de mamar, comer e dormir, do jeito que o pediatra ensinou.",
        "Não dê xarope para tosse, expectorante, descongestionante, antigripal nem anti-inflamatório sem orientação do pediatra.",
        "Não dê mel a criança com menos de 2 anos. Antes de 1 ano, o mel pode causar botulismo, uma doença grave.",
        "Bebê com menos de 1 ano dorme sempre de barriga para cima, em colchão firme e reto, sem travesseiro. Não incline o berço, mesmo com o nariz entupido.",
        "Ninguém deve fumar dentro de casa nem perto da criança.",
        "A tosse do resfriado costuma melhorar em 1 a 2 semanas, mas pode durar até 3. Se passar de 2 semanas, marque uma consulta com o pediatra.",
      ],
      volteSe: [
        "Aparecer qualquer sinal da primeira lista: ligue 192 ou vá ao pronto-socorro.",
        "A respiração ficar mais rápida ou aparecer chiado.",
        "Ela mamar, comer ou beber bem menos, ou fizer bem menos xixi.",
        "Aparecer febre, ou a febre piorar.",
        "Ela piorar, ou você ficar mais preocupado do que antes.",
      ],
    },
  },
  fontes: [
    "Ministério da Saúde. Manual AIDPI Criança: 2 meses a 5 anos. 2017.",
    "Ministério da Saúde. Guia de Vigilância em Saúde, 6ª ed., vol. 1 (coqueluche). 2023.",
    "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019.",
    "Sociedade Brasileira de Pediatria. Crupe viral e bacteriano. Guia Prático de Conduta, 2017.",
    "Sociedade Brasileira de Pediatria. Lavagem nasal. Guia Prático de Atualização nº 120, 2023.",
    "Sociedade Brasileira de Pediatria. Recomendações da AAP sobre sono seguro em menores de um ano. Nota de Alerta nº 56, 2023.",
    "Sociedade Brasileira de Pediatria. Obstrução de vias aéreas por corpo estranho e engasgo por líquidos. Guia Prático de Atualização nº 222, 2025.",
    "OMS. Pocket book of hospital care for children, 2ª ed. 2013.",
    "NICE NG9. Bronchiolitis in children: diagnosis and management. 2015, atualizada em 2021.",
    "NICE NG143. Fever in under 5s: assessment and initial management. 2019, atualizada em 2021.",
  ],
};
