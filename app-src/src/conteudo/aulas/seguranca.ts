import type { Trilha } from "../trilhas";

// Trilha: Segurança em casa e no carro. Rascunho para revisão médica antes de divulgar.
// Transporte: Código de Trânsito Brasileiro, art. 64 (Lei 14.071/2020), e Resolução CONTRAN nº 819/2021
// (em vigor desde 12/04/2021; conferida em novembro de 2026 sem alteração posterior).
// Prevenção: Caderneta da Criança (MS, 2023) e SBP, Manual de Orientação nº 4 (2020).
// Engasgo: SBP, Guia Prático nº 222 (2025); bateria e ímã: SBP, Ingestão de Corpos Estranhos (2022).
// Primeiros minutos: OMS, Burns (2026); SBP, Intoxicações exógenas (2024).
// Telefones conferidos: 192 (SAMU), 193 (Bombeiros), 0800 722 6001 (Disque-Intoxicação, na Caderneta e na SBP).
// Detalhe de cada afirmação e respectiva fonte: revisao/aulas-b.md.

export const SEGURANCA: Trilha = {
  id: "seguranca",
  titulo: "Segurança em casa e no carro",
  faixa: "do nascimento aos 6 anos",
  deMeses: 0,
  ateMeses: 72,
  aulas: [
    {
      id: "sg1",
      titulo: "Cadeirinha: o dispositivo certo para cada fase",
      gancho: "Colo não é lugar seguro no carro, nem num trajeto curto.",
      pontos: [
        "A lei (Código de Trânsito, art. 64) manda: criança com menos de 10 anos que ainda não chegou a 1,45 m vai no banco de trás, em dispositivo de retenção adequado à idade, ao peso e à altura.",
        "Bebê conforto ou cadeira conversível: até 1 ano ou até 13 kg, conforme o limite do fabricante, instalado de costas para o movimento do carro.",
        "Cadeirinha: de 1 a 4 anos, ou de 9 a 18 kg, conforme o limite do fabricante.",
        "Assento de elevação: de 4 a 7 anos e meio, ou até 1,45 m e de 15 a 36 kg, usado com o cinto de três pontos do carro.",
        "Dos 7 anos e meio aos 10, a resolução já permite só o cinto no banco de trás. A Academia Americana de Pediatria recomenda manter o assento de elevação até o cinto passar certo pelo ombro e pelo quadril, o que costuma acontecer perto de 1,45 m.",
        "Cada troca de fase protege um pouco menos. Só mude quando passar do limite de peso ou altura do fabricante, e mantenha o bebê de costas pelo maior tempo que o dispositivo permitir.",
      ],
      alerta: "Dispositivo virado para trás no banco da frente com airbag é proibido: o airbag pode atingir o bebê. Táxi, aplicativo e transporte escolar estão dispensados pela resolução, mas o risco numa batida é o mesmo. Acidente com criança: ligue 192.",
    },
    {
      id: "sg2",
      titulo: "Quedas: trocador, cama, janelas e escadas",
      gancho: "Ele ainda não rola? Pode rolar hoje, justamente no segundo em que você se vira.",
      pontos: [
        "Nunca deixe o bebê sozinho no trocador, na cama, no sofá ou em qualquer lugar alto, nem por um instante. Precisa sair? Leve junto ou coloque no berço ou no chão.",
        "Bebê conforto e cadeirinha de descanso: sempre com o cinto afivelado, e nunca em cima de mesa ou bancada.",
        "Janelas, sacadas e vãos de escada com tela ou grade de proteção. Afaste deles sofás, camas, cadeiras e tudo o que sirva de degrau.",
        "Escada com portão nas duas pontas, em cima e embaixo, assim que o bebê começar a engatinhar.",
        "Andador não, em nenhuma idade: causa quedas graves, inclusive de escada, e não ajuda a andar. Beliche também não é seguro nos primeiros anos.",
        "Móveis, TV, tanque e pia bem firmes: a criança escala e se pendura em tudo.",
      ],
      alerta: "Bateu a cabeça? Atendimento imediato se desmaiou (mesmo por pouco tempo), vomitou três vezes ou mais, está muito sonolenta, confusa ou irritada, teve convulsão, saiu sangue ou líquido pelo nariz ou ouvido, ou tem fraqueza ou dificuldade para andar. Em menores de 2 anos, também choro que não acalma, recusa de mamar ou comer, ou moleira estufada. Queda de mais de 90 centímetros (menores de 2 anos) ou de mais de 1,5 metro (maiores): avaliação médica mesmo que pareça bem.",
    },
    {
      id: "sg3",
      titulo: "Afogamento: balde, banheira e piscina",
      gancho: "Não precisa de piscina: alguns centímetros de água no balde bastam.",
      pontos: [
        "Afogamento é rápido e silencioso: a criança não grita nem se debate. A regra é um adulto olhando o tempo todo, ao alcance do braço.",
        "Nunca deixe a criança sozinha na banheira ou na bacia, nem para atender o telefone.",
        "Esvazie baldes, bacias e banheiras logo depois de usar, e mantenha lavanderia e banheiro fechados. Uma lâmina de 2,5 cm de água já pode afogar um bebê.",
        "Piscina em casa: cerca em toda a volta, com mais de 1,5 metro de altura, e portão com trava que fecha sozinho.",
        "Em festa com piscina, combine um adulto “vigia da água” por vez, sem celular e sem bebida alcoólica. Com muitos adultos, cada um acha que o outro está olhando.",
        "Boia de braço não protege: use colete salva-vidas do tamanho certo e, mesmo assim, com um adulto junto. Saber nadar também não dispensa a vigilância.",
      ],
      alerta: "Tirou a criança da água desacordada ou sem respirar: ligue 192 e siga as orientações da central. Se depois de um susto na água ela tossiu muito, ficou com falta de ar ou sonolenta, leve para avaliação no mesmo dia.",
    },
    {
      id: "sg4",
      titulo: "Queimaduras: cozinha, banho e tomadas",
      gancho: "A cozinha é onde acontece a maioria das queimaduras de criança.",
      pontos: [
        "Não cozinhe nem tome café, chá ou sopa quente com a criança no colo.",
        "Use as bocas de trás do fogão e vire os cabos das panelas para dentro. O ideal é a criança pequena fora da cozinha, com portão.",
        "Toalha pendurada na mesa vira alavanca: a criança puxa e derruba em si o que está em cima.",
        "No banho, ponha primeiro a água fria e depois a quente, misture bem e teste com o antebraço. A água deve ficar morna, perto da temperatura do corpo.",
        "Tomadas com protetor, fios fora do alcance, ferro de passar e chapinha longe. Álcool, fósforo e isqueiro guardados no alto.",
        "Fogos de artifício, fogueira e churrasqueira: criança longe, em qualquer idade.",
      ],
      alerta: "Queimou: água corrente fria na hora (veja a aula dos primeiros minutos). Procure atendimento se for no rosto, nas mãos, nos pés ou nos genitais, se tiver bolhas, se for maior que a palma da mão da criança, ou se for elétrica ou por produto químico. Fogo na roupa ou na casa: 193.",
    },
    {
      id: "sg5",
      titulo: "Remédios e produtos de limpeza: no alto e trancados",
      gancho: "Para a criança, comprimido colorido parece bala e produto de limpeza parece suco.",
      pontos: [
        "Guarde remédios e produtos de limpeza no alto e, se puder, trancados. Nada de remédio na bolsa, na mesa de cabeceira ou em gaveta baixa, nem nas bolsas das visitas.",
        "Nunca ponha produto de limpeza, querosene ou veneno em garrafa de refrigerante ou de água. Tudo na embalagem original.",
        "Prefira embalagens com tampa de segurança e feche logo depois de usar.",
        "Não chame remédio de bala e evite tomar remédio na frente da criança: ela imita.",
        "Veneno de rato e inseticida: evite ter em casa. Raticida em isca, pó ou grão é especialmente perigoso.",
        "Anote no celular e na geladeira o Disque-Intoxicação: 0800 722 6001, ligação gratuita.",
      ],
      alerta: "Suspeita de que engoliu remédio ou produto, mesmo sem sintoma nenhum: ligue já para o 0800 722 6001 ou vá ao pronto-socorro levando a embalagem. Desmaiada, com convulsão ou dificuldade para respirar: 192.",
    },
    {
      id: "sg6",
      titulo: "Engasgo: objetos pequenos, balões e alimentos",
      gancho: "Nessa fase tudo vai à boca, e a passagem do ar ainda é estreita.",
      pontos: [
        "Nove em cada dez engasgos com objeto acontecem antes dos 5 anos, a maioria no primeiro ano de vida.",
        "Balão de festa é a principal causa de morte por engasgo em menores de 6 anos. Balão estourado ou murcho vai para o lixo na hora, e criança pequena só brinca com balão com um adulto junto.",
        "Moedas, tampinhas, botões, brincos, bolinhas de gude e peças de brinquedo: fora do alcance. Respeite a faixa de idade indicada na caixa do brinquedo.",
        "Alimentos que mais engasgam: uva e outras frutas pequenas inteiras, salsicha em rodela, castanhas e amendoim inteiros, pipoca, bala dura, cenoura crua. Corte a uva em pedaços e tire as sementes; castanha, só triturada.",
        "Coma sempre sentada e com um adulto olhando: nada de comer correndo, brincando ou deitada.",
        "Explique aos irmãos maiores que não podem dar comida nem brinquedo pequeno para o bebê.",
      ],
      alerta: "Tosse forte: deixe tossir e não ponha o dedo na boca para tentar tirar. Não consegue tossir, chorar, falar ou respirar, ou ficou roxa: ligue 192 e faça a manobra de desengasgo (bebê: golpes nas costas e compressões no peito; acima de 1 ano: manobra de Heimlich). Depois de qualquer engasgo sério, leve para avaliação.",
    },
    {
      id: "sg7",
      titulo: "Bateria de botão e ímãs: perigo pequeno, dano grande",
      gancho: "Uma bateria do tamanho de uma moeda pode queimar o esôfago por dentro em poucas horas.",
      pontos: [
        "Baterias de botão estão em controles remotos, brinquedos e outros eletrônicos. Engolida, pode causar lesão grave; o ideal é que seja retirada em até 2 horas.",
        "Prefira aparelhos com a tampa da bateria presa por parafuso. Tampa solta: prenda com fita forte. Guarde baterias novas e usadas fora do alcance.",
        "Ímãs pequenos de brinquedo e de enfeite também são perigosos: dois ou mais engolidos se atraem através da parede do intestino e podem perfurá-lo.",
        "Muitas vezes ninguém vê a criança engolir, e no começo ela parece bem. Na dúvida, procure atendimento.",
        "Explique aos irmãos maiores que bateria e ímã não são brinquedo, e confira os brinquedos que chegam de presente.",
      ],
      alerta: "Suspeita de que engoliu bateria ou ímã, mesmo sem sintomas: vá imediatamente ao pronto-socorro, sem esperar. Não provoque vômito. Se puder, leve a embalagem ou uma bateria igual.",
    },
    {
      id: "sg8",
      titulo: "Queimadura ou intoxicação: os primeiros minutos",
      gancho: "Pasta de dente, manteiga, leite? Nos primeiros minutos, receita caseira só atrapalha.",
      pontos: [
        "Queimadura: afaste do calor e deixe a área sob água corrente fria, não gelada, por cerca de 20 minutos. Mantenha o resto do corpo aquecido.",
        "Tire anéis, pulseiras e a roupa que não grudou. Não arranque o que grudou e não estoure bolhas. Cubra com pano limpo.",
        "Não passe nada na queimadura: nem gelo, pasta de dente, manteiga, óleo, pó de café ou pomada por conta própria.",
        "Produto na pele ou nos olhos: lave com bastante água corrente e tire a roupa molhada pelo produto.",
        "Engoliu algo: não provoque vômito e não dê leite, água ou outro líquido. Ligue para o Disque-Intoxicação (0800 722 6001) e leve a embalagem, o rótulo ou a bula ao atendimento.",
      ],
      alerta: "Desmaiada, com convulsão ou dificuldade para respirar, ou queimadura grande, no rosto, nas mãos, nos pés, nos genitais, elétrica ou por produto químico: ligue 192 (SAMU), ou 193 (Bombeiros) se houver fogo, e siga as orientações da central.",
    },
  ],
  fontes: [
    "Código de Trânsito Brasileiro, art. 64, com redação da Lei 14.071/2020.",
    "Conselho Nacional de Trânsito (CONTRAN). Resolução nº 819, de 17 de março de 2021.",
    "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 4: Os acidentes são evitáveis e, na maioria das vezes, o perigo está dentro de casa. 2020.",
    "Sociedade Brasileira de Pediatria. Guia Prático de Atualização nº 222: Obstrução de vias aéreas por corpo estranho e engasgo por líquidos. 2025.",
    "Sociedade Brasileira de Pediatria, Departamento de Gastroenterologia. Ingestão de corpos estranhos. 2022.",
    "Sociedade Brasileira de Pediatria. Intoxicações exógenas (Pediatria para Famílias). 2024.",
    "Sociedade Brasileira de Pediatria. Traumatismo cranioencefálico leve na infância (Pediatria para Famílias). 2025.",
    "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019 (versão resumida, 2021).",
    "Organização Mundial da Saúde. Burns (nota descritiva). 2026.",
    "Durbin DR, Hoffman BD. Child Passenger Safety (AAP). Pediatrics, 2018.",
    "Shenoi RP et al. Prevention of Drowning: Policy Statement (AAP). Pediatrics, 2026.",
  ],
};
