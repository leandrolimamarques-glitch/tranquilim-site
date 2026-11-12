import type { Dica } from "./tipos";

// Telas: limites por idade e como colocá-los em prática sem briga.
// Base: SBP #Menos Telas #Mais Saúde (atualização 2024); OMS 2019; AAP 2016.

const SBP_TELAS = "Sociedade Brasileira de Pediatria. Manual de Orientação #Menos Telas #Mais Saúde. Atualização 2024.";
const SBP_10Q =
  "Sociedade Brasileira de Pediatria, GT Saúde na Era Digital. 10 questões para o uso saudável da internet para crianças, adolescentes e famílias. 2024.";
const OMS =
  "Organização Mundial da Saúde. Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age. 2019.";
const AAP_MIDIA = "American Academy of Pediatrics. Media and Young Minds (declaração de política). Pediatrics, 2016.";
const SBP_HIGIENE_SONO =
  "Sociedade Brasileira de Pediatria, Departamento de Medicina do Sono. Higiene do sono: atualização 2021. Documento científico nº 5, 2021.";
const GUIA_MENOR2 = "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019.";

export const TELAS: Dica[] = [
  {
    id: "tl-tempo-por-idade",
    categoria: "telas",
    titulo: "Quanto tempo de tela por idade",
    resumo: "Os limites recomendados pela Sociedade Brasileira de Pediatria para cada idade.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Até 2 anos: nenhuma tela. Nem desenho no celular, nem TV ligada de fundo.",
      "De 2 a 5 anos: no máximo 1 hora por dia, com um adulto junto.",
      "A partir de 6 anos: no máximo 1 a 2 horas por dia, com supervisão.",
      "Nunca nas refeições e nunca antes de dormir.",
      "Menos é melhor. O tempo livre é para brincar, conversar e se mexer.",
    ],
    aprofundado: [
      "A Sociedade Brasileira de Pediatria, no manual #Menos Telas #Mais Saúde (atualização de 2024), orienta evitar telas antes dos 2 anos, mesmo de forma passiva, como a TV ligada enquanto a criança brinca. De 2 a 5 anos, o limite é de até 1 hora por dia, sempre com supervisão. A Organização Mundial da Saúde tem orientação parecida para menores de 5 anos.",
      "O motivo: nos primeiros anos, o cérebro aprende principalmente pela interação com pessoas e pelo brincar com o corpo e as mãos. Muito tempo de tela está ligado a atraso na fala, pior sono, menos atenção, menos atividade física e mais risco de obesidade.",
      "A Academia Americana de Pediatria considera que chamada de vídeo com familiares, com um adulto junto, é diferente de assistir vídeos, porque há conversa de verdade. Mesmo assim, deve ser curta e acompanhada.",
    ],
    fontes: [SBP_TELAS, SBP_10Q, OMS, AAP_MIDIA],
  },
  {
    id: "tl-tirar-sem-briga",
    categoria: "telas",
    titulo: "Como tirar a tela sem briga",
    resumo: "Avisar antes, combinar e oferecer outra coisa reduz as birras na hora de desligar.",
    deMeses: 24,
    ateMeses: 72,
    simples: [
      "Combine antes de ligar: \"Um episódio e depois desliga.\"",
      "Avise alguns minutos antes de acabar.",
      "Prefira algo que termina, como um episódio, em vez de vídeos sem fim.",
      "Na hora, desligue com calma e firmeza, sem negociar.",
      "Tenha a próxima atividade pronta: lanche, banho, brincadeira.",
      "Se vier a birra, fique perto, acolha o choro e mantenha o combinado.",
    ],
    aprofundado: [
      "Vídeos curtos em sequência e reprodução automática são feitos para prender a atenção e não têm um fim natural. Por isso, desligar no meio parece uma perda enorme para a criança. Conteúdos com começo, meio e fim, como um episódio, tornam o encerramento mais previsível.",
      "Crianças pequenas ainda não controlam bem a frustração. Choro e birra ao desligar são esperados, principalmente nas primeiras vezes. Se o adulto cede, a criança aprende que chorar funciona, e as birras aumentam. Ser firme e carinhoso ao mesmo tempo é o que funciona: \"Eu sei que você queria mais. Agora acabou. Vamos ao banho?\"",
      "Fica mais fácil quando a tela tem hora e lugar fixos, e não é usada como prêmio, castigo ou forma de acalmar todo choro. Desativar a reprodução automática ajuda muito.",
    ],
    fontes: [SBP_TELAS, AAP_MIDIA],
  },
  {
    id: "tl-refeicoes-sem-tela",
    categoria: "telas",
    titulo: "Refeição sem tela",
    resumo: "Comer sem celular ou TV ajuda a criança a perceber a fome, a saciedade e o sabor.",
    deMeses: 6,
    ateMeses: 72,
    simples: [
      "Desligue a TV e guarde os celulares, inclusive o dos adultos.",
      "Coma junto com a criança, à mesa, sempre que possível.",
      "Converse sobre a comida: cor, cheiro, gosto.",
      "Se ela não quiser comer, não use vídeo para distrair.",
      "Respeite quando ela disser que está satisfeita.",
    ],
    aprofundado: [
      "Distraída com a tela, a criança come no automático: não percebe o gosto, nem quando está satisfeita. Isso pode levar a comer demais ou a recusar comidas novas, e está ligado a mais risco de obesidade.",
      "O Guia Alimentar para Crianças Menores de 2 Anos, do Ministério da Saúde, orienta oferecer as refeições num ambiente calmo, sem TV ou celular, com a família, porque comer junto é também momento de aprendizado e vínculo. A Sociedade Brasileira de Pediatria orienta nada de telas nas refeições, em todas as idades.",
      "No começo, sem o vídeo, a criança pode comer menos por alguns dias. Mantenha a calma: o apetite se ajusta. Quem mostra se ela está comendo o suficiente é o crescimento, acompanhado nas consultas.",
    ],
    atencao:
      "Fale com o pediatra se a criança só aceita comer com tela há muito tempo, está perdendo peso ou aceita pouquíssimos alimentos.",
    fontes: [GUIA_MENOR2, SBP_TELAS],
  },
  {
    id: "tl-telas-e-sono",
    categoria: "telas",
    titulo: "Telas e sono",
    resumo: "Telas perto da hora de dormir atrasam o sono e pioram a qualidade da noite.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Desligue as telas de 1 a 2 horas antes de dormir.",
      "Nada de celular, tablet ou TV no quarto da criança.",
      "Troque a tela por banho, história e conversa.",
      "Carregue os celulares da casa fora dos quartos.",
      "Vídeo não é jeito de fazer a criança dormir.",
    ],
    aprofundado: [
      "A luz das telas e, principalmente, o conteúdo estimulante deixam o cérebro alerta, o que atrasa o início do sono. Crianças com TV ou aparelhos no quarto dormem menos e pior, segundo a Sociedade Brasileira de Pediatria.",
      "Usar vídeo para fazer a criança dormir cria uma dependência: ela passa a precisar da tela para pegar no sono, e o sono fica mais leve e fragmentado. Uma rotina de sono sem telas funciona melhor com o tempo.",
      "Conteúdos assustadores, mesmo que pareçam inofensivos para adultos, podem aumentar pesadelos em crianças pequenas.",
    ],
    fontes: [SBP_TELAS, SBP_HIGIENE_SONO, OMS],
  },
  {
    id: "tl-restaurante-viagem",
    categoria: "telas",
    titulo: "Restaurante e viagem sem tela",
    resumo: "Ideias simples para esperar e passar o tempo sem recorrer ao celular.",
    deMeses: 12,
    ateMeses: 72,
    simples: [
      "Leve uma bolsinha com papel, giz de cera e um livrinho.",
      "Brinque de \"eu vejo uma coisa de cor...\" ou de adivinhar sons.",
      "Inclua a criança na conversa e no pedido da comida.",
      "Em viagem, cante, conte histórias e faça paradas para ela se mexer.",
      "Escolha horários em que ela não esteja com fome ou sono demais.",
    ],
    aprofundado: [
      "Esperar é difícil para crianças pequenas, e é uma habilidade que se aprende com prática. Com objetos simples e um adulto disponível, a maioria das crianças consegue se distrair por um bom tempo.",
      "Uma bolsinha de \"surpresas\" que só aparece nessas ocasiões, com adesivos, um carrinho, massinha comprada com indicação para a idade ou um livro novo, chama mais a atenção do que os brinquedos de sempre. Lembre do risco de engasgo com peças pequenas em menores de 3 anos.",
      "Em viagens longas, paradas para correr um pouco ajudam. No carro, a criança vai sempre na cadeirinha adequada para a idade e o tamanho, no banco de trás.",
    ],
    fontes: [SBP_TELAS, AAP_MIDIA],
  },
  {
    id: "tl-conteudo-de-qualidade",
    categoria: "telas",
    titulo: "Conteúdo de qualidade",
    resumo: "Para maiores de 2 anos, o que assistir e como assistir faz diferença.",
    deMeses: 24,
    ateMeses: 72,
    simples: [
      "Assista junto e converse sobre o que aparece.",
      "Prefira programas calmos, com ritmo lento e linguagem clara.",
      "Evite vídeos curtos em sequência e propagandas.",
      "Desative a reprodução automática.",
      "Confira a classificação indicativa de idade.",
    ],
    aprofundado: [
      "Crianças pequenas aprendem mais com a tela quando um adulto assiste junto e conecta o conteúdo com a vida real: \"Olha, igual ao nosso gato!\". Sozinhas, elas entendem e guardam bem menos.",
      "Programas com cortes rápidos, muitos efeitos e barulho prendem a atenção, mas cansam e agitam. Conteúdos mais lentos, com histórias e personagens que conversam com a criança, são melhores. Vídeos com propaganda disfarçada, como crianças abrindo brinquedos, estimulam o consumo.",
      "A Sociedade Brasileira de Pediatria orienta usar a Classificação Indicativa do Ministério da Justiça, ativar controles parentais e não publicar fotos e vídeos das crianças em perfis abertos.",
    ],
    fontes: [SBP_TELAS, SBP_10Q, AAP_MIDIA],
  },
  {
    id: "tl-exemplo-dos-pais",
    categoria: "telas",
    titulo: "O exemplo dos pais",
    resumo: "A criança aprende o uso da tela olhando como os adultos usam.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Guarde o celular quando estiver com a criança, sempre que puder.",
      "Na amamentação e nas refeições, olhe para ela, não para a tela.",
      "Crie momentos sem tela para a família toda, como o jantar.",
      "Quando precisar usar, explique: \"Vou responder a vovó e já volto.\"",
      "Desconectar é um exercício para a casa toda.",
    ],
    aprofundado: [
      "Crianças imitam o que veem. Se os adultos ficam sempre no celular, a criança entende que aquilo é o mais interessante da casa. A Sociedade Brasileira de Pediatria lembra que desconectar deve ser um exercício da família, não só da criança.",
      "Quando o adulto está distraído com a tela, ele conversa menos e responde menos aos sinais da criança. Essas pequenas trocas do dia a dia são justamente o que mais estimula a linguagem e o vínculo.",
      "Não é preciso ser perfeito. Combinar momentos e lugares sem tela, como a mesa e a hora de dormir, já faz grande diferença.",
    ],
    fontes: [SBP_TELAS, AAP_MIDIA],
  },
  {
    id: "tl-sinais-excesso",
    categoria: "telas",
    titulo: "Sinais de uso excessivo",
    resumo: "Comportamentos que mostram que a tela está ocupando espaço demais.",
    deMeses: 12,
    ateMeses: 72,
    simples: [
      "Pede a tela o tempo todo e só se acalma com ela.",
      "Birras muito fortes sempre que a tela é desligada.",
      "Perdeu o interesse por brinquedos, outras crianças e brincadeiras fora.",
      "Dorme pior ou mais tarde.",
      "Fala pouco para a idade ou olha pouco nos olhos.",
      "Se viu esses sinais, reduza aos poucos e converse com o pediatra.",
    ],
    aprofundado: [
      "A Sociedade Brasileira de Pediatria associa o excesso de telas a problemas de sono, atenção, comportamento e linguagem, além de sedentarismo e obesidade. Em crianças pequenas expostas muito tempo, os atrasos na fala e na interação social são mais frequentes.",
      "Para reduzir, troque o tempo de tela por atividades com você, combine horários fixos e tire os aparelhos dos quartos e da mesa. A primeira semana costuma ser a mais difícil; depois a criança se reorganiza.",
      "Atraso na fala ou pouca interação podem ter outras causas além das telas, como problemas de audição ou do desenvolvimento. Por isso, vale sempre a avaliação do pediatra, que pode aplicar o M-CHAT da Caderneta da Criança.",
    ],
    atencao:
      "Procure o pediatra se a criança não fala, não aponta, não atende pelo nome, não olha nos olhos ou perdeu habilidades que já tinha.",
    fontes: [SBP_TELAS, SBP_10Q, "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 7ª edição, 2024."],
  },
];
