import type { Fluxo } from "../../lib/fluxo";

// Engasgo e objeto engolido: rascunho para revisão médica (pediatra e médico de emergência/UTI) antes de divulgar.
// Manobras: AHA e AAP, Pediatric Basic Life Support (2025): bebê, 5 tapas nas costas alternadas com 5 compressões
// no peito, sem compressão na barriga; criança, 5 tapas nas costas alternadas com 5 compressões na barriga.
// SBP, Guia Prático nº 222 (2025): manobras só se não consegue tossir ou falar; não varrer a boca às cegas;
// engasgo com líquido tem outra conduta; toda criança que recebeu manobras deve ser examinada.
// Objeto engolido: SBP, Ingestão de Corpos Estranhos (2022), ESPGHAN (2021) e NASPGHAN (2015).
// Remédio ou produto: SBP, Intoxicações agudas na infância (2025). Mel na bateria de botão: fica fora do texto
// (exigiria dose e é decisão do pediatra; ver revisao/fluxos-b.md, onde está cada ponto de decisão com a fonte).

const BEBE_MANOBRA =
  "Bebê com menos de 1 ano: 5 tapas nas costas e 5 compressões no meio do peito, com o bebê de bruços no seu antebraço e a cabeça mais baixa que o corpo. Em bebê, não aperte a barriga.";
const CRIANCA_MANOBRA =
  "Criança de 1 ano ou mais: 5 tapas nas costas e 5 compressões na barriga, abraçando por trás (manobra de Heimlich).";

const SINAIS_DEPOIS = [
  "Tosse que não passa, ou que volta em crises",
  "Chiado ou barulho no peito ao respirar",
  "Respira rápido ou com esforço, com a pele afundando entre as costelas",
  "Voz rouca ou diferente, ou choro fraco",
  "Baba muito, ou tem dor ou dificuldade para engolir",
  "Lábios arroxeados, ou está molinha ou sonolenta",
  "Diz que ainda tem algo preso na garganta",
];

const SINAIS_OBJETO = [
  "Baba muito ou não consegue engolir a saliva",
  "Dor ou dificuldade para engolir, ou recusa comer e beber",
  "Vômito ou ânsia de vômito",
  "Dor no pescoço, no peito ou na barriga",
  "Sangue na saliva, no vômito ou no cocô",
  "Tosse, chiado ou falta de ar",
  "Barriga inchada, dura ou muito dolorida",
];

export const ENGASGO: Fluxo = {
  id: "engasgo",
  titulo: "Engasgo e objeto engolido",
  resumo: "Engasgou agora, engasgou e já passou, ou engoliu um objeto.",
  inicio: "agora",
  passos: {
    agora: {
      id: "agora",
      tipo: "escolha",
      pergunta: "O que está acontecendo agora?",
      ajuda: "Se ela engasgou com comida ou objeto e não consegue tossir, chorar nem falar, toque na primeira opção e comece já.",
      opcoes: [
        {
          texto: "Engasgou com comida ou objeto (ou você não sabe com o quê) e não consegue tossir, chorar, falar ou respirar",
          vai: "ps-engasgo",
        },
        { texto: "Desmaiou ou não responde", vai: "ps-inconsciente" },
        { texto: "Engasgou com leite, água ou outro líquido", vai: "liquido" },
        { texto: "Engasgou com comida ou objeto e está tossindo, chorando ou falando", vai: "tossindo" },
        { texto: "Engasgou, mas já passou", vai: "depois" },
        { texto: "Engoliu um objeto ou outra coisa, mas não está engasgada", vai: "objeto" },
      ],
    },
    tossindo: {
      id: "tossindo",
      tipo: "escolha",
      pergunta: "Deixe tossir e fique junto. Como ela está agora?",
      ajuda:
        "A tosse forte é a melhor forma de pôr o objeto para fora. Enquanto ela tosse com força, não bata nas costas e não coloque o dedo na boca.",
      opcoes: [
        { texto: "A tosse ficou fraca ou sem som, ou ela não consegue mais respirar, chorar ou falar", vai: "ps-engasgo" },
        { texto: "Desmaiou ou não responde", vai: "ps-inconsciente" },
        { texto: "Continua tossindo, sem melhorar", vai: "ps-tosse" },
        { texto: "Parou de tossir e respira normal", vai: "depois" },
      ],
    },
    liquido: {
      id: "liquido",
      tipo: "escolha",
      pergunta: "Sente a criança, ou deixe o bebê meio sentado, e limpe o leite ou o líquido da boca com um pano. Como ela está agora?",
      ajuda:
        "No engasgo com leite ou outro líquido, tossir e até vomitar é a defesa do corpo. Tapas e compressões são para engasgo com comida ou objeto.",
      opcoes: [
        { texto: "Tossiu ou vomitou e já respira normal", vai: "depois" },
        { texto: "Continua com falta de ar, chiado, desconforto ou choro sem parar", vai: "ps-sintomas" },
        { texto: "Parou de respirar, ficou roxa ou molinha", vai: "ps-liquido" },
      ],
    },
    depois: {
      id: "depois",
      tipo: "sinais",
      pergunta: "O engasgo passou. Agora ela tem algum destes?",
      ajuda: "Se não tiver nenhum, toque em \"Nenhum destes\".",
      itens: SINAIS_DEPOIS.map((texto, i) => ({ id: `depois-${i + 1}`, texto })),
      seAlgum: "ps-sintomas",
      seNenhum: "manobras",
    },
    manobras: {
      id: "manobras",
      tipo: "escolha",
      pergunta: "Alguém precisou dar tapas nas costas ou fazer compressões no peito ou na barriga?",
      opcoes: [
        { texto: "Sim", vai: "hoje-manobras" },
        { texto: "Não, ela resolveu sozinha, tossindo", vai: "casa" },
      ],
    },
    objeto: {
      id: "objeto",
      tipo: "escolha",
      pergunta: "O que ela engoliu?",
      ajuda: "Se houver qualquer chance de ter sido uma bateria de botão ou um ímã, escolha essa opção.",
      opcoes: [
        { texto: "Bateria de botão: pilha redonda e chata, de relógio, controle, balança ou brinquedo", vai: "ps-bateria" },
        { texto: "Ímã, mesmo pequeno: de brinquedo, enfeite ou geladeira", vai: "ps-objeto" },
        {
          texto: "Algo pontudo, cortante ou comprido: alfinete, agulha, prego, caco de vidro, espinha, osso, palito ou grampo",
          vai: "ps-objeto",
        },
        { texto: "Remédio, produto de limpeza, planta ou outra substância", vai: "ps-substancia" },
        { texto: "Moeda ou outro objeto pequeno e liso: botão, bolinha, pedrinha, peça de brinquedo", vai: "objeto-sinais" },
        { texto: "Não sei o que foi", vai: "objeto-sinais" },
      ],
    },
    "objeto-sinais": {
      id: "objeto-sinais",
      tipo: "sinais",
      pergunta: "Ela tem algum destes agora?",
      ajuda: "Se não tiver nenhum, toque em \"Nenhum destes\".",
      itens: SINAIS_OBJETO.map((texto, i) => ({ id: `objeto-sinais-${i + 1}`, texto })),
      seAlgum: "ps-objeto",
      seNenhum: "hoje-objeto",
    },
  },
  desfechos: {
    "ps-engasgo": {
      id: "ps-engasgo",
      nivel: "ps",
      titulo: "Engasgo grave: comece as manobras agora e peça para alguém ligar 192",
      oQueFazer: [
        "Grite por ajuda e peça para alguém ligar 192. Se estiver sozinho, comece as manobras e ligue 192 no viva-voz assim que puder.",
        "Bebê com menos de 1 ano: deite o bebê de bruços sobre o seu antebraço, apoiado na sua coxa, com a cabeça mais baixa que o corpo. Segure o queixo com a mão, sem apertar o pescoço.",
        "Dê 5 tapas firmes nas costas do bebê, no meio, entre as omoplatas, com a base da outra mão.",
        "Vire o bebê de barriga para cima sobre o outro antebraço, ainda com a cabeça mais baixa, e faça 5 compressões firmes no meio do peito, logo abaixo da linha dos mamilos.",
        "Repita 5 tapas e 5 compressões até o objeto sair ou o bebê voltar a chorar, tossir ou respirar. Em bebê, não aperte a barriga.",
        "Criança de 1 ano ou mais: fique atrás dela, de joelhos se ela for pequena, com o corpo dela um pouco inclinado para a frente. Dê 5 tapas firmes nas costas, entre as omoplatas, com a base da mão.",
        "Depois, abrace a criança por trás, feche uma mão logo acima do umbigo, cubra com a outra mão e puxe com força para dentro e para cima, 5 vezes (manobra de Heimlich).",
        "Repita 5 tapas e 5 compressões até o objeto sair ou ela voltar a tossir, chorar, falar ou respirar.",
        "Só tire o objeto da boca se estiver vendo. Não coloque o dedo às cegas: isso pode empurrar o objeto mais para dentro.",
        "Se ela desmaiar: deite de costas no chão, ligue 192 no viva-voz e comece compressões fortes e rápidas no meio do peito. O atendente do 192 orienta você.",
        "Mesmo que tudo se resolva, ela precisa ser examinada por um médico hoje: as manobras podem machucar por dentro.",
      ],
    },
    "ps-inconsciente": {
      id: "ps-inconsciente",
      nivel: "ps",
      titulo: "Não responde: ligue 192 e comece a reanimação",
      oQueFazer: [
        "Ligue 192 agora, no viva-voz, ou peça para alguém ligar. O atendente orienta você pelo telefone.",
        "Deite a criança de costas numa superfície firme, como o chão.",
        "Comece compressões no meio do peito: fortes, afundando mais ou menos um terço do peito, e rápidas, de 100 a 120 por minuto.",
        "No bebê, use a base de uma mão ou os dois polegares. Na criança, use uma ou as duas mãos.",
        "Se você souber, faça 2 sopros a cada 30 compressões. Antes de soprar, olhe dentro da boca e tire o objeto só se estiver vendo.",
        "Se não souber fazer os sopros, faça só as compressões, sem parar.",
        "Continue até a ambulância chegar ou até ela voltar a respirar, se mexer ou chorar.",
      ],
    },
    "ps-tosse": {
      id: "ps-tosse",
      nivel: "ps",
      titulo: "Continua tossindo: ligue 192 ou vá ao pronto-socorro",
      oQueFazer: [
        "Pode haver um pedaço preso no caminho do ar. Ela precisa ser vista por um médico agora.",
        "Deixe ela tossir, na posição em que ficar mais confortável, geralmente sentada ou no colo.",
        "Enquanto ela tosse com força, não bata nas costas e não coloque o dedo na boca.",
        "Se a tosse ficar fraca ou sem som, ou ela não conseguir respirar, chorar ou falar, comece as manobras e ligue 192:",
        BEBE_MANOBRA,
        CRIANCA_MANOBRA,
      ],
    },
    "ps-liquido": {
      id: "ps-liquido",
      nivel: "ps",
      titulo: "Parou de respirar depois de engasgar com líquido: ligue 192",
      oQueFazer: [
        "Ligue 192 ou peça para alguém ligar.",
        "Deixe o bebê meio sentado ou de lado, limpe a boca e esfregue as costas dele com delicadeza. A maioria volta a respirar logo.",
        "Se não voltar a respirar e não responder, deite de costas numa superfície firme e comece compressões fortes e rápidas no meio do peito. O atendente do 192 orienta você.",
        "Mesmo que volte a respirar bem, leve ao pronto-socorro para ser examinado.",
      ],
    },
    "ps-sintomas": {
      id: "ps-sintomas",
      nivel: "ps",
      titulo: "Ainda tem sinais depois do engasgo: vá ao pronto-socorro agora",
      oQueFazer: [
        "Se ela respira com muito esforço, fica roxa ou muito molinha, ligue 192.",
        "Deixe ela na posição em que respira melhor, geralmente sentada ou no colo.",
        "Pode ter ficado um pedaço no caminho do ar, ou o líquido pode ter ido para o pulmão. Às vezes isso só aparece no exame.",
        "Conte ao médico com o que ela engasgou, quando foi e quanto tempo durou.",
      ],
    },
    "hoje-manobras": {
      id: "hoje-manobras",
      nivel: "hoje",
      titulo: "Precisou de manobras: leve para avaliação médica hoje",
      oQueFazer: [
        "Mesmo que ela esteja bem, toda criança que recebeu tapas e compressões precisa ser examinada: as manobras podem machucar por dentro, e um pedaço pode ter ficado no caminho do ar.",
        "Procure atendimento ainda hoje, num pronto atendimento ou pronto-socorro onde possam fazer exame de imagem, se o médico achar necessário.",
        "Conte ao médico com o que ela engasgou e quais manobras foram feitas.",
      ],
      volteSe: SINAIS_DEPOIS.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`),
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "O engasgo passou: pode ficar em casa, de olho nos próximos dias",
      oQueFazer: [
        "Ela pôs para fora tossindo e agora respira, fala ou chora e brinca normalmente. Fique por perto nas próximas horas.",
        "Às vezes um pedacinho fica no pulmão e dá sinais só dias ou semanas depois: tosse que não passa, chiado ou febre.",
        "Para prevenir: uva, salsicha, cenoura crua e maçã em pedaços bem pequenos. Pipoca, amendoim, castanhas e balas duras longe das crianças pequenas.",
        "Criança come sentada, sem correr nem brincar com comida na boca.",
        "Balões de festa (bexigas) estão entre as maiores causas de engasgo grave em menores de 6 anos: não deixe a criança brincar sozinha com eles.",
      ],
      volteSe: [
        "Respirar com esforço, ficar com lábios roxos, babar ou não conseguir engolir: ligue 192 ou vá ao pronto-socorro.",
        "Tosse que não passa, chiado no peito, febre ou falta de ar nos próximos dias ou semanas: procure atendimento e conte que ela engasgou.",
      ],
    },
    "ps-bateria": {
      id: "ps-bateria",
      nivel: "ps",
      titulo: "Bateria de botão: vá ao pronto-socorro agora, mesmo que ela pareça bem",
      oQueFazer: [
        "A bateria pode causar lesão grave por dentro em poucas horas, mesmo sem nenhum sintoma. Ela precisa de raio-x agora, e a bateria pode ter de ser retirada com urgência, de preferência em até 2 horas.",
        "Se ela tiver dificuldade para respirar, ligue 192.",
        "Não provoque vômito.",
        "Não dê comida nem bebida, a não ser que o 192 ou o médico oriente.",
        "Se puder, leve a embalagem ou uma bateria igual: ajuda a saber o tamanho e o tipo.",
        "Avise se ela também pode ter engolido um ímã: os dois juntos são ainda mais perigosos.",
      ],
    },
    "ps-objeto": {
      id: "ps-objeto",
      nivel: "ps",
      titulo: "Vá ao pronto-socorro agora",
      oQueFazer: [
        "Ímãs, objetos pontudos, cortantes ou compridos, e qualquer objeto que cause sintomas precisam de avaliação agora. Alguns precisam ser retirados com urgência.",
        "Se ela tiver dificuldade para respirar, ligue 192.",
        "Não provoque vômito.",
        "Não dê comida nem bebida, a não ser que o 192 ou o médico oriente.",
        "Se puder, leve um objeto igual ou a embalagem.",
      ],
    },
    "ps-substancia": {
      id: "ps-substancia",
      nivel: "ps",
      titulo: "Engoliu remédio ou produto: ligue 192 ou vá ao pronto-socorro agora",
      oQueFazer: [
        "Procure atendimento agora, mesmo que ela pareça bem. Se ela estiver sonolenta, com falta de ar ou convulsão, ligue 192.",
        "Não provoque vômito.",
        "Leve a embalagem, o frasco ou um pedaço da planta: ajuda a equipe a escolher o tratamento.",
      ],
    },
    "hoje-objeto": {
      id: "hoje-objeto",
      nivel: "hoje",
      titulo: "Leve para avaliação médica hoje",
      oQueFazer: [
        "Mesmo sem sintomas, ela precisa ser examinada hoje. Muitas vezes o médico pede raio-x: ele mostra onde está um objeto de metal e diferencia uma moeda de uma bateria.",
        "Procure um pronto atendimento ou pronto-socorro onde possam fazer raio-x.",
        "A maioria dos objetos pequenos e lisos sai sozinha no cocô, mas quem decide isso é o médico, depois do exame.",
      ],
      volteSe: SINAIS_OBJETO.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`),
    },
  },
  fontes: [
    "Sociedade Brasileira de Pediatria. Obstrução de vias aéreas por corpo estranho e engasgo por líquidos: o que fazer? Guia Prático de Atualização nº 222, 2025.",
    "Sociedade Brasileira de Pediatria. Ingestão de Corpos Estranhos. Departamento Científico de Gastroenterologia, 2022.",
    "Sociedade Brasileira de Pediatria. Intoxicações agudas na infância. Pediatria para Famílias, Departamento Científico de Toxicologia e Saúde Ambiental, 2025.",
    "American Heart Association e American Academy of Pediatrics. Part 6: Pediatric Basic Life Support. Circulation, 2025.",
    "ESPGHAN. Diagnosis, management, and prevention of button battery ingestion in childhood. Position paper, 2021.",
    "NASPGHAN. Management of ingested foreign bodies in children. Clinical report, 2015.",
  ],
};
