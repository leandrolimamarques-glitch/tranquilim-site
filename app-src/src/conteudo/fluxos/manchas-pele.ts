import type { Fluxo } from "../../lib/fluxo";

// Manchas na pele: rascunho para revisão médica (pediatra e médico de emergência/UTI) antes de divulgar.
// Manchas que não somem à pressão: MS, Meningite (gov.br) e NICE NG240 (2024); sem febre, NICE NG12 (2015,
// atualizada em 2026). Anafilaxia e posição: SBP, Anafilaxia: atualização 2021, e WAO (2020). Bolhas, pele soltando
// e feridas na boca com olhos vermelhos: diretriz pediátrica de Stevens-Johnson da British Association of
// Dermatologists (2018). Kawasaki: SBP (2019) e AHA (2024). Sarampo: MS (gov.br). Febre em menor de 3 meses e
// febre por 5 dias: SBP, Manejo da Febre Aguda (2021), e NICE NG143. Urticária: SBP (2023). Picadas: SBP (2022).
// Brotoeja: AAP (2024). Mão-pé-boca: SBP (2019 e 2025). Cada ponto de decisão com a fonte: revisao/fluxos-b.md.

const SINAIS_DE_ALARME = [
  "Manchas roxas ou vermelho-escuras, em pontinhos ou maiores, que apareceram sem uma pancada que explique e não somem quando você aperta um copo de vidro transparente em cima",
  "Falta de ar, chiado no peito, rouquidão, voz ou choro diferente, ou dificuldade para engolir",
  "Inchaço nos lábios, na língua ou no rosto, em volta dos olhos",
  "Começou de repente e ela vomita sem parar ou tem dor de barriga forte",
  "Desmaiou, está muito molinha ou difícil de acordar, ou ficou pálida ou acinzentada, com mãos e pés gelados",
  "Teve convulsão, ou tem tremores, trancos repetidos ou perdeu o equilíbrio",
  "Bolhas grandes, ou a pele está saindo em placas, como numa queimadura",
  "Feridas na boca e nos lábios, com crostas ou sangue, junto com olhos vermelhos e doloridos",
];

const VOLTE_SE_ALARME = SINAIS_DE_ALARME.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`);

export const MANCHAS_PELE: Fluxo = {
  id: "manchas-pele",
  titulo: "Manchas na pele",
  resumo: "Manchas, vergões, pontinhos ou bolhas na pele, com ou sem febre.",
  inicio: "alarme",
  passos: {
    alarme: {
      id: "alarme",
      tipo: "sinais",
      pergunta: "A criança tem algum destes sinais agora?",
      ajuda:
        "Para fazer o teste do copo, aperte a lateral de um copo de vidro transparente contra as manchas e olhe através dele. Se elas continuam aparecendo, não somem. Olhe o corpo todo, sem roupa. Se não tiver nenhum sinal, toque em \"Nenhum destes\".",
      itens: SINAIS_DE_ALARME.map((texto, i) => ({ id: `alarme-${i + 1}`, texto })),
      seAlgum: "ps",
      seNenhum: "febre",
    },
    febre: {
      id: "febre",
      tipo: "escolha",
      pergunta: "A criança está com febre agora, ou teve febre nos últimos dias?",
      ajuda: "Febre é temperatura na axila acima de 37,3 °C, medida com termômetro digital.",
      opcoes: [
        { texto: "Sim, e tem menos de 3 meses", vai: "ps-bebe" },
        { texto: "Sim, e tem 3 meses ou mais", vai: "febre-sinais" },
        { texto: "Não", vai: "tipo" },
      ],
    },
    "febre-sinais": {
      id: "febre-sinais",
      tipo: "sinais",
      pergunta: "Junto com a febre, ela tem algum destes?",
      ajuda: "Pense nos últimos dias, não só em agora.",
      itens: [
        { id: "febre-sinais-1", texto: "A febre já dura 5 dias ou mais" },
        { id: "febre-sinais-2", texto: "Olhos vermelhos, sem remela" },
        { id: "febre-sinais-3", texto: "Lábios muito vermelhos, secos ou rachados, ou língua muito vermelha, parecendo um morango" },
        { id: "febre-sinais-4", texto: "Mãos ou pés inchados ou muito vermelhos, ou a pele dos dedos descascando" },
        { id: "febre-sinais-5", texto: "Íngua (caroço) de um lado do pescoço" },
        {
          id: "febre-sinais-6",
          texto: "Manchas vermelhas que começaram no rosto e atrás das orelhas e foram descendo pelo corpo, com tosse ou nariz escorrendo",
        },
        { id: "febre-sinais-7", texto: "Está bebendo ou fazendo xixi bem menos que o normal" },
        { id: "febre-sinais-8", texto: "Está bem mais quieta que o normal, mesmo quando a febre baixa" },
      ],
      seAlgum: "hoje",
      seNenhum: "tipo",
    },
    tipo: {
      id: "tipo",
      tipo: "escolha",
      pergunta: "Como são as manchas?",
      opcoes: [
        { texto: "Vergões ou placas vermelhas em relevo, que coçam e mudam de lugar em poucas horas", vai: "urticaria" },
        { texto: "Pontinhos vermelhos bem pequenos no pescoço, no peito, nas costas ou nas dobras, depois de calor ou muita roupa", vai: "casa-brotoeja" },
        { texto: "Bolinhas vermelhas que coçam muito, em braços, pernas ou outras partes descobertas, como picadas", vai: "picadas" },
        { texto: "Bolhinhas ou pontinhos nas mãos, nos pés ou no bumbum, com feridinhas na boca", vai: "mao-pe-boca" },
        { texto: "Outro tipo, ou não sei dizer", vai: "outras" },
      ],
    },
    urticaria: {
      id: "urticaria",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "urticaria-1", texto: "Começou logo depois de comer um alimento, tomar um remédio ou levar uma picada de abelha, vespa ou formiga" },
        { id: "urticaria-2", texto: "Juntas inchadas ou doloridas, ou não quer andar" },
        { id: "urticaria-3", texto: "A coceira não a deixa dormir ou comer, ou as manchas estão piorando" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa-urticaria",
    },
    picadas: {
      id: "picadas",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "picadas-1", texto: "Uma picada ficou vermelha, quente, inchada e dolorida, e a vermelhidão está aumentando" },
        { id: "picadas-2", texto: "Tem pus, ou crostas cor de mel" },
        { id: "picadas-3", texto: "A coceira não a deixa dormir" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa-picadas",
    },
    "mao-pe-boca": {
      id: "mao-pe-boca",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "mao-pe-boca-1", texto: "Está bebendo ou fazendo xixi bem menos que o normal" },
        { id: "mao-pe-boca-2", texto: "Não aceita nada para beber por causa da dor na boca" },
        { id: "mao-pe-boca-3", texto: "Está bem mais quieta ou mais irritada que o normal" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa-mao-pe-boca",
    },
    outras: {
      id: "outras",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "outras-1", texto: "Uma mancha vermelha, quente, inchada e dolorida, que está crescendo" },
        { id: "outras-2", texto: "Feridas com pus, ou crostas cor de mel" },
        { id: "outras-3", texto: "As manchas apareceram depois de começar um remédio novo" },
        { id: "outras-4", texto: "Estão se espalhando rápido ou piorando" },
        { id: "outras-5", texto: "Coçam tanto que atrapalham o sono" },
        { id: "outras-6", texto: "Você sente que tem algo errado, mesmo sem saber explicar" },
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
        "Se ela não respira bem, não acorda ou está roxa, ligue 192 agora.",
        "Manchas que não somem no copo, principalmente com febre, podem ser uma infecção grave: saia agora. Não espere a febre baixar nem as manchas mudarem.",
        "Se começou de repente depois de um alimento, remédio ou picada, e ela tem falta de ar, inchaço ou vômitos: deite-a de barriga para cima com as pernas elevadas. Se ela respira melhor sentada, deixe sentada. Não a deixe ficar de pé nem andar.",
        "Se ela já tem adrenalina autoinjetável receitada pelo médico, aplique na coxa, por cima da roupa, e ligue 192.",
        "Leve a caderneta e a lista dos remédios que ela tomou nas últimas semanas.",
      ],
    },
    "ps-bebe": {
      id: "ps-bebe",
      nivel: "ps",
      titulo: "Bebê com menos de 3 meses e febre: vá ao pronto-socorro agora",
      oQueFazer: [
        "Nessa idade, toda febre precisa ser avaliada por um médico no mesmo dia, mesmo que o bebê pareça bem.",
        "Antes de dar qualquer remédio, siga a orientação do médico que for avaliar.",
        "Leve a caderneta do bebê.",
      ],
    },
    hoje: {
      id: "hoje",
      nivel: "hoje",
      titulo: "Procure atendimento hoje",
      oQueFazer: [
        "Não precisa ser em minutos, mas precisa ser hoje: UBS, pediatra ou pronto atendimento.",
        "Tire fotos das manchas com boa luz. Elas mudam ao longo do dia, e as fotos ajudam o médico.",
        "Conte ao médico há quantos dias está a febre e o que você viu nos olhos, na boca, nas mãos e nos pés. Febre por vários dias com esses sinais pode ser doença de Kawasaki, que tem tratamento e precisa ser reconhecida cedo.",
        "Ao chegar, avise que a criança tem febre e manchas: algumas doenças com manchas, como o sarampo, passam fácil para outras pessoas.",
        "Enquanto isso, ofereça o peito ou líquidos com frequência.",
      ],
      volteSe: VOLTE_SE_ALARME,
    },
    "casa-urticaria": {
      id: "casa-urticaria",
      nivel: "casa",
      titulo: "Parece urticária comum: pode cuidar em casa, de olho nos sinais",
      oQueFazer: [
        "Na urticária, os vergões aparecem e somem e mudam de lugar. Isso é esperado.",
        "Em criança, a urticária muitas vezes vem junto com uma virose. Também pode vir de alimento, remédio ou picada.",
        "Pense no que mudou nas últimas horas: alimento novo, remédio novo, picada, sabonete ou creme. Evite repetir e conte ao pediatra.",
        "Roupa leve, de algodão, e unhas curtas, para ela não se machucar ao coçar.",
        "Remédio para coceira, só o que o pediatra indicou para ela.",
      ],
      volteSe: [
        "Falta de ar, chiado, rouquidão, inchaço nos lábios, na língua ou em volta dos olhos, vômitos ou desmaio: ligue 192 ou vá ao pronto-socorro.",
        "Manchas roxas que não somem no copo: ligue 192 ou vá ao pronto-socorro.",
        "Aparecer febre ou juntas inchadas: procure atendimento hoje.",
        "A urticária voltar muitas vezes: converse com o pediatra.",
      ],
    },
    "casa-brotoeja": {
      id: "casa-brotoeja",
      nivel: "casa",
      titulo: "Parece brotoeja: pode cuidar em casa",
      oQueFazer: [
        "A brotoeja vem do suor preso na pele. O tratamento é deixar a pele fresca e seca.",
        "Tire o excesso de roupa e, quando der, deixe a área descoberta.",
        "Refresque com banho fresco ou pano úmido e depois seque bem, inclusive nas dobrinhas do pescoço, das axilas e das pernas.",
        "Roupas leves e soltas, de algodão. Ventilador ou ar-condicionado ajudam.",
        "Não passe pomadas ou cremes grossos e oleosos: eles tampam o suor e pioram a brotoeja.",
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Aparecer febre: procure atendimento hoje.",
        "As bolinhas ficarem com pus, quentes ou doloridas: procure atendimento hoje.",
        "Ela mamar ou comer menos, ou ficar mais quieta: procure atendimento hoje.",
        "Não melhorar em 3 dias de cuidado em casa, ou piorar em 24 horas: procure o pediatra.",
      ],
    },
    "casa-picadas": {
      id: "casa-picadas",
      nivel: "casa",
      titulo: "Parecem picadas de inseto: pode cuidar em casa",
      oQueFazer: [
        "Lave com água e sabão. Compressa fria alivia a coceira.",
        "Unhas curtas e limpas, para ela não ferir a pele ao coçar.",
        "Em algumas crianças, as picadas viram bolinhas que coçam e duram dias ou semanas, e novas aparecem mesmo depois de poucas picadas. Isso se chama estrófulo e é comum: converse com o pediatra.",
        "O melhor tratamento é evitar novas picadas: roupas compridas e leves, mosquiteiro na cama e telas nas janelas.",
        "Repelente, só um próprio para a idade dela, com orientação do pediatra.",
        "Remédio ou pomada para coceira, só o que o pediatra indicou.",
      ],
      volteSe: [
        "Falta de ar, inchaço nos lábios, na língua ou em volta dos olhos, vômitos ou desmaio depois de uma picada: ligue 192 ou vá ao pronto-socorro.",
        "Manchas roxas que não somem no copo: ligue 192 ou vá ao pronto-socorro.",
        "Uma picada ficar vermelha, quente, inchada e dolorida, com a vermelhidão aumentando, ou com pus: procure atendimento hoje.",
        "Aparecer febre: procure atendimento hoje.",
      ],
    },
    "casa-mao-pe-boca": {
      id: "casa-mao-pe-boca",
      nivel: "casa",
      titulo: "Parece doença mão-pé-boca: pode cuidar em casa, de olho na hidratação",
      oQueFazer: [
        "É uma virose comum em crianças pequenas. Costuma durar de 7 a 10 dias e passa sozinha.",
        "O mais importante é ela beber bem. Ofereça o peito ou líquidos com frequência.",
        "Antibiótico não ajuda, nem em xarope nem em pomada: a doença é causada por vírus.",
        "Para dor ou febre, só o remédio que o pediatra já indicou para o peso dela.",
        "Ela deve ficar fora da creche ou escola até as feridas secarem e a febre passar.",
        "O vírus continua saindo no cocô por até 4 semanas: lave bem as mãos depois de trocar fraldas.",
      ],
      volteSe: [
        "Tremores, trancos repetidos, perder o equilíbrio, ficar muito sonolenta ou respirar rápido: ligue 192 ou vá ao pronto-socorro.",
        "Manchas roxas que não somem no copo: ligue 192 ou vá ao pronto-socorro.",
        "Ela beber pouco ou fizer bem menos xixi: procure atendimento hoje.",
        "A febre durar 5 dias ou mais: procure atendimento hoje.",
      ],
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "Pode observar em casa, de olho nas manchas",
      oQueFazer: [
        "Tire fotos das manchas com boa luz, para comparar depois e mostrar ao pediatra.",
        "Repita o teste do copo de vez em quando: uma mancha que sumia pode passar a não sumir.",
        "Se as manchas não melhorarem em alguns dias, ou se você ficar em dúvida, marque uma consulta com o pediatra.",
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Aparecer febre: procure atendimento hoje.",
        "As manchas se espalharem rápido, ficarem quentes e doloridas ou com pus: procure atendimento hoje.",
      ],
    },
  },
  fontes: [
    "Ministério da Saúde. Meningite e Sarampo. Saúde de A a Z, gov.br, consultado em 2026.",
    "Sociedade Brasileira de Pediatria. Anafilaxia: atualização 2021. Guia Prático de Atualização nº 6, Departamento Científico de Alergia, 2021.",
    "Sociedade Brasileira de Pediatria. Doença de Kawasaki. Documento Científico nº 6, Departamento Científico de Reumatologia, 2019.",
    "Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021.",
    "Sociedade Brasileira de Pediatria. Urticária e angioedema. Pediatria para Famílias, Departamento Científico de Alergia, 2023.",
    "Sociedade Brasileira de Pediatria. Picadas de inseto: prurigo estrófulo ou urticária papular. Documento Científico nº 12, 2022.",
    "Sociedade Brasileira de Pediatria. Síndrome mão-pé-boca. Documento Científico, 2019; e Tratamento da doença mão-pé-boca em crianças. Nota de Alerta nº 219, 2025.",
    "NICE NG240. Meningitis (bacterial) and meningococcal disease: recognition, diagnosis and management. 2024.",
    "NICE NG143. Fever in under 5s: assessment and initial management. 2019, mantida em 2025.",
    "World Allergy Organization. Anaphylaxis guidance 2020.",
    "British Association of Dermatologists. Guidelines for the management of Stevens-Johnson syndrome/toxic epidermal necrolysis in children and young people. 2018.",
    "American Heart Association. Update on diagnosis and management of Kawasaki disease. Scientific statement, 2024.",
    "American Academy of Pediatrics. Heat rash (prickly heat) in babies and young children. HealthyChildren, 2024.",
  ],
};
