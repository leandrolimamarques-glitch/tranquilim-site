import type { Fluxo } from "../../lib/fluxo";

// Queda e batida na cabeça: rascunho para revisão médica (pediatra e médico de emergência/UTI) antes de divulgar.
// Regra de decisão: PECARN (Kuppermann e cols., Lancet 2009), separada em menores e maiores de 2 anos, traduzida
// em sinais que a família consegue ver. Alturas de 0,9 m e 1,5 m e mecanismo grave: PECARN e SBP, Guia Prático
// Trauma Cranioencefálico (2017). Sinais de alarme, sono e cuidados em casa: SBP, TCE leve na infância (2025).
// Quando encaminhar ao pronto-socorro a partir de um contato remoto: NICE NG232 (2023). Pescoço: AHA e Cruz
// Vermelha Americana, primeiros socorros (2024). Cada ponto de decisão com a fonte: revisao/fluxos-b.md.

const SINAIS_DE_ALARME = [
  "Desmaiou ou ficou \"apagada\" depois da batida, mesmo que por poucos segundos",
  "Teve uma convulsão: ficou dura ou se debatendo, ou com o olhar parado sem responder",
  "Está muito sonolenta e difícil de acordar, ou confusa: não reconhece você ou o lugar, repete as mesmas perguntas ou não lembra do que aconteceu",
  "Não está agindo como de costume, chora sem parar e não se acalma nem no colo, ou recusa mamar ou comer",
  "Vomitou mais de uma vez",
  "Sai sangue ou um líquido claro, como água, pelo nariz ou pelo ouvido, ou apareceram manchas roxas em volta dos olhos ou atrás da orelha",
  "Tem um afundamento na cabeça, ou, no bebê, a moleira ficou estufada",
  "Fraqueza ou dificuldade para mexer um braço ou uma perna, para andar ou para falar, visão dupla ou olhos se mexendo de um jeito estranho",
  "Dor de cabeça forte, ou que vai piorando",
  "Dor no pescoço, ou não consegue mexer o pescoço",
  "Um corte que não para de sangrar, mesmo apertando com um pano limpo por 10 minutos",
];

const VOLTE_SE_ALARME = SINAIS_DE_ALARME.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`);

export const QUEDA_CABECA: Fluxo = {
  id: "queda-cabeca",
  titulo: "Queda e batida na cabeça",
  resumo: "Caiu, levou uma pancada ou bateu a cabeça.",
  inicio: "alarme",
  passos: {
    alarme: {
      id: "alarme",
      tipo: "sinais",
      pergunta: "Depois da batida, a criança teve ou tem algum destes sinais?",
      ajuda: "Marque tudo o que aconteceu desde a batida, mesmo que já tenha passado. Se não teve nenhum, toque em \"Nenhum destes\".",
      itens: SINAIS_DE_ALARME.map((texto, i) => ({ id: `alarme-${i + 1}`, texto })),
      seAlgum: "ps",
      seNenhum: "mecanismo",
    },
    mecanismo: {
      id: "mecanismo",
      tipo: "sinais",
      pergunta: "Como foi a batida? Marque se aconteceu algum destes.",
      ajuda: "Uma batida forte pode machucar por dentro mesmo quando a criança parece bem no começo.",
      itens: [
        {
          id: "mecanismo-1",
          texto: "Tem menos de 2 anos e caiu de mais de 90 cm, mais ou menos a altura da cintura de um adulto: do trocador, do colo de alguém em pé, de uma mesa",
        },
        {
          id: "mecanismo-2",
          texto: "Tem 2 anos ou mais e caiu de mais de 1,5 m, mais ou menos a altura do ombro de um adulto: da cama de cima do beliche, de um muro, de uma janela",
        },
        { id: "mecanismo-3", texto: "Rolou escada abaixo, mais de 5 degraus, inclusive dentro do andador" },
        { id: "mecanismo-4", texto: "Foi atropelada, ou foi atingida por carro ou moto quando estava de bicicleta, patinete ou similar" },
        {
          id: "mecanismo-5",
          texto: "Estava num acidente de carro ou moto em que o veículo capotou, ela foi jogada para fora, ou alguém se feriu gravemente",
        },
        {
          id: "mecanismo-6",
          texto: "Um objeto pesado caiu na cabeça dela, como TV, móvel ou portão, ou ela levou uma pancada forte com algo duro, como taco, pedra ou balanço",
        },
      ],
      seAlgum: "ps",
      seNenhum: "idade",
    },
    idade: {
      id: "idade",
      tipo: "escolha",
      pergunta: "Quantos anos a criança tem?",
      opcoes: [
        { texto: "Menos de 3 meses", vai: "bebe" },
        { texto: "De 3 meses a 1 ano e 11 meses", vai: "menor-2" },
        { texto: "2 anos ou mais", vai: "maior-2" },
      ],
    },
    bebe: {
      id: "bebe",
      tipo: "sinais",
      pergunta: "E o bebê tem algum destes?",
      ajuda: "Nessa idade, os sinais de lesão na cabeça são mais difíceis de perceber. Por isso, qualquer um destes já pede médico agora.",
      itens: [
        { id: "bebe-1", texto: "Tem um galo (inchaço) em qualquer parte da cabeça" },
        { id: "bebe-2", texto: "Vomitou uma vez" },
        { id: "bebe-3", texto: "Tem um corte na cabeça" },
        { id: "bebe-4", texto: "Ninguém viu como foi a batida" },
      ],
      seAlgum: "ps",
      seNenhum: "hoje-bebe",
    },
    "menor-2": {
      id: "menor-2",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "menor-2-1", texto: "Galo grande ou mole do lado, atrás ou em cima da cabeça (fora da testa)" },
        { id: "menor-2-2", texto: "Vomitou uma vez" },
        { id: "menor-2-3", texto: "Tem um corte aberto na cabeça, com as bordas separadas" },
        { id: "menor-2-4", texto: "Ninguém viu como foi a batida, e você não sabe se ela desmaiou" },
        { id: "menor-2-5", texto: "Você sente que tem algo errado, mesmo sem saber explicar" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa",
    },
    "maior-2": {
      id: "maior-2",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "maior-2-1", texto: "Vomitou uma vez" },
        { id: "maior-2-2", texto: "Dor de cabeça que não passa" },
        { id: "maior-2-3", texto: "Está tonta ou enjoada" },
        { id: "maior-2-4", texto: "Tem um corte aberto na cabeça, com as bordas separadas" },
        { id: "maior-2-5", texto: "Ninguém viu como foi a batida, e ela não consegue contar o que aconteceu" },
        { id: "maior-2-6", texto: "Você sente que tem algo errado, mesmo sem saber explicar" },
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
        "Se ela não acorda, não respira normalmente ou está tendo convulsão, ligue 192 agora.",
        "Se a batida foi forte e ela tem dor no pescoço, ou não mexe braços ou pernas, não a levante nem vire o pescoço dela: ligue 192 e espere a ambulância.",
        "Se ela vomitar, vire o corpo todo de lado de uma vez, junto com a cabeça.",
        "Se tiver um corte sangrando, aperte com um pano limpo, sem soltar.",
        "Não dê remédio sem orientação do médico que for avaliar.",
        "Leve a caderneta da criança e conte ao médico como foi a batida e de que altura ela caiu.",
      ],
    },
    "hoje-bebe": {
      id: "hoje-bebe",
      nivel: "hoje",
      titulo: "Bebê com menos de 3 meses que bateu a cabeça: leve para avaliação médica hoje",
      oQueFazer: [
        "Nessa idade, os sinais de lesão na cabeça são mais difíceis de perceber. Mesmo que o bebê pareça bem, ele precisa ser examinado hoje, nas próximas horas: pronto atendimento, UBS ou pediatra.",
        "Até lá, fique com o bebê por perto e observe como ele mama, chora e reage a você.",
        "Não dê remédio sem orientação médica.",
        "Conte ao médico como foi a batida e de que altura o bebê caiu.",
      ],
      volteSe: VOLTE_SE_ALARME,
    },
    hoje: {
      id: "hoje",
      nivel: "hoje",
      titulo: "Leve para avaliação médica hoje, nas próximas horas",
      oQueFazer: [
        "Procure atendimento nas próximas horas: pronto atendimento, UBS ou pediatra. Não deixe para amanhã.",
        "A maioria das crianças com batida leve na cabeça não precisa de tomografia. Muitas vezes o médico prefere observar a criança por algumas horas.",
        "Até lá, fique junto dela e observe. Ofereça líquidos e comida leve, se ela quiser.",
        "Remédio para dor, só o que o médico já indicou para ela.",
        "Se tiver um corte, cubra com um pano limpo e aperte se sangrar. Corte aberto pode precisar de pontos.",
      ],
      volteSe: [...VOLTE_SE_ALARME, "Ela vomitar de novo: vá ao pronto-socorro."],
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "Pode cuidar em casa, de olho nas próximas 24 a 48 horas",
      oQueFazer: [
        "As primeiras 24 a 48 horas são as mais importantes. Um adulto deve ficar com a criança e estar pronto para sair com ela, se precisar.",
        "Ela pode dormir, inclusive a soneca de sempre. Não precisa acordá-la de hora em hora.",
        "Quando ela acordar, veja se age como de costume, se reconhece você e o lugar e se responde como sempre.",
        "Se ela dormir fora do horário ou você ficar em dúvida, acorde-a com calma: ela deve despertar e reconhecer você. Se não conseguir acordá-la, ligue 192.",
        "No galo, faça compressa fria por 10 a 20 minutos, algumas vezes nos dois primeiros dias. Enrole o gelo num pano: nunca encoste o gelo direto na pele.",
        "Remédio para dor, só o que o pediatra já indicou para o peso dela. Não dê outros remédios sem orientação, principalmente os que dão sono.",
        "Nos próximos dias, evite brincadeiras de impacto, pula-pula e situações em que ela possa cair de novo.",
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Ela vomitar, ou a dor de cabeça não passar: procure atendimento hoje.",
        "Você ficar mais preocupado do que antes: procure atendimento.",
      ],
    },
  },
  fontes: [
    "Sociedade Brasileira de Pediatria. Traumatismo cranioencefálico leve na infância. Pediatria para Famílias, Departamento Científico de Emergência, 2025.",
    "Sociedade Brasileira de Pediatria. Trauma cranioencefálico. Guia Prático de Atualização nº 1, Departamento Científico de Terapia Intensiva, 2017.",
    "Kuppermann N e cols. (PECARN). Identification of children at very low risk of clinically-important brain injuries after head trauma. Lancet, 2009.",
    "NICE NG232. Head injury: assessment and early management. 2023.",
    "American Heart Association e Cruz Vermelha Americana. Guidelines for First Aid. 2024.",
  ],
};
