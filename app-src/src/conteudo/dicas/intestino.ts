// Dicas de intestino e barriga: cocô, gases, golfada, prisão de ventre, diarreia leve, vermes.
// Sem remédio e sem dose: quando precisar de remédio, quem decide é o pediatra.
import type { Dica } from "./tipos";

const SBP_GI_FUNCIONAIS =
  "Sociedade Brasileira de Pediatria, Departamento Científico de Gastroenterologia. Distúrbios gastrointestinais funcionais no lactente e na criança abaixo de 4 anos: um guia para a prática diária. 2022.";
const CADERNETA = "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023.";
const GUIA_MENORES_2 = "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019.";
const SBP_DIARREIA = "Sociedade Brasileira de Pediatria. Diarreia aguda infecciosa. Guia Prático de Atualização nº 74, 2023.";
const MS_DIARREIA = "Ministério da Saúde. Manejo do paciente com diarreia (cartaz). 2023.";
const SBP_CONSTIPACAO =
  "Sociedade Brasileira de Pediatria. Constipação intestinal. Pediatria para Famílias, Departamento Científico de Gastroenterologia, 2025.";

export const INTESTINO: Dica[] = [
  {
    id: "in-coco-normal-bebe",
    categoria: "intestino",
    titulo: "Cocô normal do bebê",
    resumo: "Como é o cocô esperado em cada fase e o que muda com o leite e a comida.",
    deMeses: 0,
    ateMeses: 12,
    simples: [
      "Nos primeiros dias o cocô é escuro e grudento. Isso é o mecônio e é normal.",
      "Depois fica amarelo, mole, às vezes com grumos. Verde e marrom também são normais.",
      "Bebê no peito pode fazer cocô várias vezes ao dia ou ficar dias sem fazer.",
      "Se o cocô sai mole e o bebê mama bem e ganha peso, está tudo certo.",
      "Cocô branco, cinza ou amarelo bem clarinho: mostre ao pediatra logo.",
    ],
    aprofundado: [
      "O primeiro cocô, o mecônio, é verde-escuro quase preto e pegajoso. Com a descida do leite ele vai clareando e, em poucos dias, fica amarelo e mole. No bebê que mama no peito, o cocô costuma ser amarelo-ouro, cremoso, com grumos que lembram semente. Com fórmula, ele tende a ser mais firme, pastoso e de cor amarelo-escura a amarronzada.",
      "A frequência varia muito. Nas primeiras semanas é comum o bebê fazer cocô a cada mamada. Depois do primeiro mês, alguns bebês em aleitamento exclusivo passam dias sem evacuar. O que vale não é o número de dias, mas o cocô sair mole, o bebê mamar bem, fazer xixi e ganhar peso.",
      "Verde, amarelo e marrom são cores normais. As cores que pedem atenção são o branco, o cinza ou o amarelo muito pálido (pode ser sinal de problema no fígado) e o vermelho ou preto depois da fase do mecônio (pode ser sangue). A Caderneta da Criança traz uma escala de cores do cocô para comparar.",
    ],
    atencao:
      "Procure o pediatra logo, no mesmo dia, se o cocô ficar branco, cinza ou amarelo bem clarinho, principalmente se o bebê estiver amarelado ou o xixi escuro. Procure também se houver sangue no cocô, se o cocô estiver duro como bolinha, se o bebê mamar mal ou não ganhar peso.",
    fontes: [
      CADERNETA,
      "Ministério da Saúde. Atenção à Saúde do Recém-Nascido: guia para os profissionais de saúde, vol. 1, Cuidados gerais, 2ª edição. 2014.",
      SBP_GI_FUNCIONAIS,
    ],
  },
  {
    id: "in-coco-claro-alerta",
    categoria: "intestino",
    titulo: "Cocô branco ou acinzentado: procure logo",
    resumo: "Cocô sem cor pode ser sinal de problema no fígado, e o tempo conta.",
    deMeses: 0,
    ateMeses: 6,
    simples: [
      "Compare o cocô com a escala de cores da Caderneta da Criança.",
      "Cocô branco, cinza, cor de massa de vidraceiro ou amarelo bem clarinho não é normal.",
      "Isso vale mais ainda se o bebê está amarelado depois de 2 semanas de vida.",
      "Xixi escuro, que mancha a fralda, também é sinal de alerta.",
      "Nesses casos, leve ao pediatra no mesmo dia. Não espere a próxima consulta.",
    ],
    aprofundado: [
      "Quando a bile não chega ao intestino, o cocô perde a cor e fica branco, acinzentado ou amarelo-palha. Isso se chama acolia (ou hipocolia, quando está só mais claro). Uma das causas é a atresia de vias biliares, doença em que os canais da bile estão fechados. O bebê costuma parecer bem, mama e cresce, e o único sinal é a icterícia que não passa.",
      "A cirurgia da atresia biliar funciona melhor quanto mais cedo for feita, de preferência nos primeiros dois meses de vida. Por isso o Ministério da Saúde e a Sociedade Brasileira de Pediatria colocaram a escala de cores do cocô na Caderneta da Criança, para que a família reconheça o sinal em casa.",
      "Icterícia (pele ou olhos amarelados) que continua depois dos 14 dias de vida sempre merece avaliação, mesmo que o cocô pareça normal. O pediatra pede um exame de sangue simples para separar a icterícia comum da que precisa de investigação.",
    ],
    atencao:
      "Cocô branco, acinzentado ou amarelo-pálido, ou icterícia depois de 2 semanas de vida: leve ao pediatra ou à unidade de saúde no mesmo dia e mostre a fralda ou uma foto do cocô.",
    fontes: [
      CADERNETA,
      "Sociedade Brasileira de Pediatria. Atresia de vias biliares. Pediatria para Famílias, 2024.",
      "Sociedade Brasileira de Pediatria. Hiperbilirrubinemia indireta no período neonatal. Manual de orientação nº 10, 2021.",
    ],
  },
  {
    id: "in-disquesia",
    categoria: "intestino",
    titulo: "Bebê faz força e chora, mas o cocô sai mole",
    resumo: "É a disquesia do lactente: o bebê ainda está aprendendo a fazer cocô.",
    deMeses: 0,
    ateMeses: 9,
    simples: [
      "O bebê fica vermelho, faz força, chora por alguns minutos e depois sai cocô mole.",
      "Isso tem nome: disquesia. Não é prisão de ventre e não é doença.",
      "Ele ainda está aprendendo a soltar o bumbum na hora de empurrar.",
      "Não use supositório, cotonete, termômetro ou dedo no bumbum para ajudar.",
      "Colo, calma e paciência. Passa sozinho nos primeiros meses.",
    ],
    aprofundado: [
      "Para fazer cocô é preciso fazer força com a barriga e, ao mesmo tempo, relaxar os músculos do bumbum. O bebê pequeno ainda não coordena as duas coisas. Ele empurra e trava ao mesmo tempo, por isso se estica, grita e fica vermelho ou arroxeado por 10 a 20 minutos, até o cocô sair. O cocô é mole, e é isso que diferencia da prisão de ventre.",
      "A disquesia acontece em cerca de 4 em cada 100 bebês, aparece antes dos 9 meses e some sozinha. Não precisa de remédio nem de laxante. A Sociedade Brasileira de Pediatria alerta justamente para evitar o estímulo do ânus com supositório, haste ou termômetro: o bebê pode passar a depender do estímulo para evacuar e a mucosa pode se machucar.",
      "Ajuda deixar o bebê de barriga para cima, com as pernas dobradas sobre a barriga, e manter a calma. Com o tempo ele aprende a relaxar sozinho.",
    ],
    atencao:
      "Procure o pediatra se o cocô estiver duro, em bolinhas ou com sangue, se a barriga ficar muito inchada, se houver vômito verde, febre, recusa das mamadas ou pouco ganho de peso. Bebê com menos de 1 mês que tem dificuldade para evacuar também deve ser avaliado.",
    fontes: [SBP_GI_FUNCIONAIS],
  },
  {
    id: "in-constipacao-bebe",
    categoria: "intestino",
    titulo: "Prisão de ventre no bebê",
    resumo: "Quando o cocô fica duro e o que ajuda em casa, sem remédio caseiro.",
    deMeses: 0,
    ateMeses: 24,
    simples: [
      "Prisão de ventre é cocô duro, em bolinhas, que dói ou sangra para sair.",
      "Ficar dias sem fazer cocô, mas mole, não é prisão de ventre no bebê que só mama.",
      "A partir dos 6 meses ofereça água e frutas, verduras, legumes e feijão todo dia.",
      "Não dê chá, óleo, supositório nem laxante por conta própria.",
      "Se o cocô continuar duro, fale com o pediatra.",
    ],
    aprofundado: [
      "No bebê que mama só no peito, a prisão de ventre é rara. O mais comum é ela aparecer quando começa a comida, perto dos 6 meses, ou quando o bebê passa para a fórmula. O que define o problema é o cocô endurecido, grosso ou em bolinhas, e o esforço com dor, às vezes com um fiozinho de sangue por uma pequena fissura no ânus.",
      "Com a comida, a água entra na rotina: ofereça em copo, várias vezes ao dia, sem açúcar. Prefira comida de verdade, com frutas (mamão, ameixa, laranja com bagaço), verduras, legumes e feijão amassado. Suco não substitui a fruta. Brincar no chão e se mexer também ajuda o intestino.",
      "Chás, óleo mineral, supositório, lavagem e laxantes não devem ser usados sem orientação. O óleo mineral pode ir para o pulmão do bebê se ele engasgar, e o estímulo com supositório ou haste pode criar dependência. Quando a mudança na comida não basta, o pediatra é quem escolhe o tratamento.",
    ],
    atencao:
      "Procure o pediatra se a prisão de ventre começou no primeiro mês de vida, se o bebê demorou mais de 48 horas para fazer o primeiro cocô depois de nascer, se a barriga estiver muito estufada, se houver vômito verde, febre, sangue no cocô sem fissura, cocô fininho como fita ou pouco ganho de peso.",
    fontes: [SBP_GI_FUNCIONAIS, GUIA_MENORES_2, SBP_CONSTIPACAO],
  },
  {
    id: "in-constipacao-crianca",
    categoria: "intestino",
    titulo: "Prisão de ventre na criança",
    resumo: "Comida, água, movimento e uma rotina de banheiro sem pressão.",
    deMeses: 24,
    ateMeses: 72,
    simples: [
      "Coloque fruta, verdura, legume e feijão no prato todo dia. Água no lugar de suco e refrigerante.",
      "Deixe a criança correr e brincar. Movimento ajuda o intestino.",
      "Depois do café da manhã ou do almoço, convide para sentar no vaso por alguns minutos.",
      "Use um apoio para os pés, com os joelhos mais altos que o bumbum.",
      "Nunca brigue nem apresse. Elogie a tentativa.",
      "Nada de chá, supositório ou laxante sem o pediatra.",
    ],
    aprofundado: [
      "Na maioria das crianças a prisão de ventre não é doença: é um ciclo. O cocô duro dói, a criança fica com medo e segura. O cocô parado no intestino perde água, fica ainda mais duro, e a próxima vez dói mais. Ela cruza as pernas, se esconde, fica na ponta dos pés. Isso é segurar, e não teimosia.",
      "A base do cuidado é tirar o medo e amolecer o cocô: comida com fibra (frutas com casca ou bagaço, verduras, legumes, feijão, grãos integrais), água ao longo do dia e atividade física. A rotina de sentar no vaso depois das refeições aproveita o reflexo natural do intestino. O apoio para os pés deixa a posição parecida com a de cócoras, que facilita a saída.",
      "O desfralde feito com pressão é um gatilho comum. Se a criança começou a segurar depois do desfralde, vale dar uma pausa e conversar com o pediatra. Escapes de cocô na calcinha ou na cueca podem ser sinal de cocô acumulado, e não de descuido.",
      "Quando as medidas de casa não bastam, o pediatra pode indicar remédio por um tempo. Quanto antes começar o tratamento, mais rápido o intestino volta ao normal.",
    ],
    atencao:
      "Procure o pediatra se a prisão de ventre durar mais de duas semanas, se houver sangue no cocô, escapes de cocô na roupa, dor forte, barriga muito estufada, vômitos, febre, perda de peso ou se a criança tiver muito medo de evacuar.",
    fontes: [
      SBP_CONSTIPACAO,
      "Sociedade Brasileira de Pediatria. Disfunção vesical e intestinal. Pediatria para Famílias, 2023.",
      "Sociedade Brasileira de Pediatria e Sociedade Brasileira de Urologia. Manual de Orientação: Treinamento esfincteriano. 2019.",
      SBP_GI_FUNCIONAIS,
    ],
  },
  {
    id: "in-gases",
    categoria: "intestino",
    titulo: "Gases e barriguinha estufada",
    resumo: "Gases fazem parte do primeiro trimestre; veja o que alivia.",
    deMeses: 0,
    ateMeses: 6,
    simples: [
      "Todo bebê tem gases. O intestino dele ainda está amadurecendo.",
      "Coloque para arrotar no meio e no fim da mamada.",
      "Confira a pega: boca bem aberta, pegando boa parte da aréola.",
      "Massagem leve na barriga e movimento de bicicleta com as perninhas ajudam.",
      "Colo, aconchego e balanço suave acalmam.",
    ],
    aprofundado: [
      "Gases e crises de choro no fim da tarde são muito comuns nos primeiros meses e costumam melhorar por volta dos 3 a 4 meses. Parte do ar vem da mamada: quando a pega no peito não é boa, ou quando o bico da mamadeira tem furo grande ou pequeno demais, o bebê engole mais ar.",
      "Ajudam: pausas para arrotar, bebê mais em pé ao mamar na mamadeira, massagem circular na barriga no sentido do relógio e as pernas dobradas sobre a barriga. Barriga para baixo só acordado e com alguém olhando. Para dormir, sempre de barriga para cima.",
      "Chás, simpatias e remédios para gases não têm benefício comprovado no bebê e alguns podem fazer mal. Se a mãe amamenta, não precisa cortar alimentos por conta própria; qualquer mudança na dieta deve ser conversada com o pediatra.",
    ],
    atencao:
      "Procure o pediatra se o choro for diferente do habitual, muito agudo ou sem consolo, se vier com febre, vômito verde ou com sangue, barriga dura e inchada, sangue no cocô ou se o bebê mamar mal e não ganhar peso. Bebê com menos de 3 meses e febre: pronto-socorro.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Pediatria para Famílias: Cólica do lactente. 2023.",
      SBP_GI_FUNCIONAIS,
      "American Academy of Pediatrics. Sleep-Related Infant Deaths: Updated 2022 Recommendations for Reducing Infant Deaths in the Sleep Environment. Pediatrics, 2022.",
    ],
  },
  {
    id: "in-golfada",
    categoria: "intestino",
    titulo: "Golfada e refluxo do bebê",
    resumo: "Leite que volta depois da mamada é comum e quase sempre não é doença.",
    deMeses: 0,
    ateMeses: 12,
    simples: [
      "Golfar é o leite voltar pela boca sem força. É muito comum no primeiro ano.",
      "Se o bebê está feliz, mama bem e ganha peso, não precisa de remédio.",
      "Deixe o bebê no colo, em pé, um tempinho depois de mamar.",
      "Para dormir, sempre de barriga para cima, no berço plano, sem travesseiro.",
      "Não aperte a barriga nem troque a fralda logo depois da mamada.",
    ],
    aprofundado: [
      "A válvula entre o estômago e o esôfago ainda é imatura e se abre sozinha várias vezes ao dia. Por isso o leite volta. Aos 4 meses, de 4 a 7 em cada 10 bebês golfam pelo menos duas vezes por dia. A golfada melhora ao longo do primeiro ano, conforme a válvula amadurece e o bebê passa mais tempo sentado.",
      "Golfada não é vômito: no vômito o leite sai com força e o bebê fica incomodado. Quando o bebê golfa mas está bem e cresce, não há doença do refluxo, e remédio para o estômago não ajuda. Também não é preciso trocar a fórmula nem a mãe cortar alimentos sem orientação.",
      "Elevar a cabeceira do berço, travesseiro e posição de lado ou de bruços para dormir não são recomendados: aumentam o risco de morte súbita e não diminuem o refluxo.",
    ],
    atencao:
      "Procure o pediatra se o bebê não ganha peso, recusa as mamadas, chora muito ao mamar, se arqueia para trás, golfa com tosse ou falta de ar, ou se a golfada começou depois dos 6 meses ou piora depois de 1 ano. Vá ao pronto-socorro se o vômito for verde, com sangue, em jato e repetido, ou se o bebê ficar mole, com febre ou com a moleira estufada.",
    fontes: [
      SBP_GI_FUNCIONAIS,
      "NICE NG1. Gastro-oesophageal reflux disease in children and young people. 2015, atualizada em 2019.",
      "Sociedade Brasileira de Pediatria. Recomendações da AAP sobre sono seguro em menores de um ano. Nota de Alerta nº 56, 2023.",
    ],
  },
  {
    id: "in-diarreia-leve",
    categoria: "intestino",
    titulo: "Diarreia leve: cuidando em casa",
    resumo: "Soro de reidratação oral, comida de sempre e atenção aos sinais de desidratação.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Continue o peito e a comida de sempre. Não deixe a criança em jejum.",
      "Depois de cada cocô líquido, ofereça soro de reidratação oral em pequenos goles.",
      "O soro pronto é de graça no posto. A quantidade, pergunte na unidade ou ao pediatra.",
      "Não dê refrigerante, isotônico nem suco ou chá com açúcar.",
      "Lave bem as mãos depois de trocar fraldas e antes de preparar comida.",
      "Remédio para parar a diarreia, só se o pediatra receitar.",
    ],
    aprofundado: [
      "A maior parte das diarreias da criança é causada por vírus e passa em poucos dias. O perigo não é a diarreia em si, mas a perda de água e sais. O soro de reidratação oral (SRO) repõe exatamente o que se perde, na proporção certa. Ele é distribuído nas unidades básicas de saúde e deve ser preparado conforme a embalagem, com água filtrada ou fervida.",
      "Manter a alimentação habitual ajuda o intestino a se recuperar mais rápido. O bebê que mama no peito deve continuar mamando, até com mais frequência. Bebidas com muito açúcar, como refrigerante, suco de caixinha e isotônico, podem piorar a diarreia.",
      "Se a criança vomitar, espere um pouco e volte a oferecer o soro aos golinhos, com colher ou copinho. Fique de olho no xixi: urinar pouco é um dos primeiros sinais de desidratação.",
    ],
    atencao:
      "Volte à unidade de saúde ou ao pediatra se não melhorar em dois dias, se a diarreia aumentar, se houver vômitos repetidos, sangue no cocô, muita sede, recusa de comida ou pouco xixi. Vá ao pronto-socorro se a criança ficar muito sonolenta ou difícil de acordar, com olhos fundos, boca seca, sem lágrimas, sem xixi por muitas horas, ou se for bebê com menos de 3 meses com diarreia ou febre.",
    fontes: [MS_DIARREIA, SBP_DIARREIA, "NICE CG84. Diarrhoea and vomiting caused by gastroenteritis in under 5s. 2009."],
  },
  {
    id: "in-sangue-coco",
    categoria: "intestino",
    titulo: "Sangue no cocô",
    resumo: "Pode ser uma fissura simples, mas sempre merece avaliação.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Sangue no cocô sempre deve ser mostrado ao pediatra.",
      "Tire uma foto ou guarde a fralda para mostrar.",
      "Um fiozinho de sangue vivo com cocô duro costuma ser uma fissura no bumbum.",
      "Beterraba, gelatina e alguns alimentos podem deixar o cocô avermelhado. Lembre o que a criança comeu.",
      "Muito sangue, cocô preto ou criança abatida: pronto-socorro.",
    ],
    aprofundado: [
      "A causa mais comum de sangue vermelho vivo no cocô da criança pequena é a fissura anal, um cortinho no ânus provocado por cocô duro. O sangue vem por fora do cocô ou no papel. Tratar a prisão de ventre faz a fissura sarar.",
      "No bebê pequeno, sangue misturado com muco no cocô, mesmo com o bebê bem, pode ser sinal de alergia à proteína do leite de vaca. Diarreia com sangue e febre pode ser infecção. Esses casos precisam de avaliação do pediatra antes de qualquer mudança na alimentação.",
      "Há também causas que pedem atendimento urgente. Uma delas é a invaginação intestinal: crises de choro forte com dor, a criança encolhe as pernas, fica pálida e mole entre as crises, vomita e pode eliminar cocô com sangue e muco, parecendo geleia de framboesa.",
    ],
    atencao:
      "Vá ao pronto-socorro se houver muito sangue, cocô preto como borra de café, vômito verde ou com sangue, barriga inchada e dura, crises de dor com a criança pálida ou mole, febre em bebê com menos de 3 meses ou sinais de desidratação. Nos demais casos, leve ao pediatra no mesmo dia ou no dia seguinte.",
    fontes: [
      SBP_GI_FUNCIONAIS,
      SBP_DIARREIA,
      "Sociedade Brasileira de Pediatria e Associação Brasileira de Alergia e Imunologia. Consenso Brasileiro sobre Alergia Alimentar. 2018.",
    ],
  },
  {
    id: "in-dor-barriga-funcional",
    categoria: "intestino",
    titulo: "Dor de barriga que vai e volta",
    resumo: "A dor funcional é real, é comum e tem sinais que pedem avaliação.",
    deMeses: 36,
    ateMeses: 72,
    simples: [
      "Muitas crianças sentem dor perto do umbigo que vai e volta, sem doença por trás.",
      "A dor é real. Acolha, ofereça colo e uma atividade calma.",
      "Veja se a criança está fazendo cocô mole todo dia. Prisão de ventre causa dor.",
      "Observe se a dor aparece em dias de escola, brigas ou mudanças.",
      "Não dê remédio sem falar com o pediatra.",
    ],
    aprofundado: [
      "A dor abdominal funcional é aquela que não tem uma causa no órgão, como infecção ou inflamação. Ela é comum em crianças e costuma ser em volta do umbigo, em crises, sem atrapalhar o crescimento. O intestino da criança é sensível e reage a estresse, sono ruim, comida e prisão de ventre.",
      "Um diário ajuda o pediatra: anote quando a dor aparece, quanto dura, o que a criança comeu, como está o cocô e o que estava acontecendo. Manter a rotina, inclusive a escola, ajuda mais do que deixar a criança em casa a cada crise.",
      "Em criança com menos de 4 anos, dor de barriga repetida deve ser avaliada pelo pediatra antes de ser considerada funcional, porque nessa idade a dor funcional é menos comum.",
    ],
    atencao:
      "Procure o pediatra se a dor acordar a criança à noite, se for longe do umbigo, vier com febre, vômitos repetidos, diarreia, sangue no cocô, perda de peso, dor para urinar ou se a criança tiver menos de 4 anos. Vá ao pronto-socorro se a dor for forte e contínua, se a barriga ficar dura, se a criança não conseguir andar por causa da dor ou se houver vômito verde.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Dor abdominal. Pediatria para Famílias, Departamento Científico de Gastroenterologia, 2024.",
      "Sociedade Brasileira de Pediatria. Dor abdominal crônica na infância e adolescência. Guia Prático de Atualização nº 6, Departamento Científico de Gastroenterologia, 2019.",
      SBP_CONSTIPACAO,
    ],
  },
  {
    id: "in-vermes",
    categoria: "intestino",
    titulo: "Vermes: como prevenir",
    resumo: "Higiene, água tratada e calçado protegem; remédio só com o pediatra.",
    deMeses: 12,
    ateMeses: 72,
    simples: [
      "Lave as mãos da criança com água e sabão depois do banheiro e antes de comer.",
      "Mantenha as unhas curtas e limpas.",
      "Dê água filtrada ou fervida. Lave bem frutas e verduras.",
      "Use calçado na terra, na areia e na rua.",
      "Coceira no bumbum à noite? Conte ao pediatra. Não dê vermífugo por conta própria.",
    ],
    aprofundado: [
      "A lombriga e outros vermes passam quando a criança engole ovos que estão em alimento mal lavado, em água sem tratamento ou nas mãos sujas. O amarelão entra pela pele quando a pessoa anda descalça em terra contaminada. Por isso as medidas de proteção são simples: mãos limpas, unhas curtas, água tratada, alimento bem lavado e calçado.",
      "O oxiúro causa coceira no bumbum, principalmente à noite, e passa facilmente entre irmãos e colegas. Trocar e lavar roupa de cama e toalhas, e manter as unhas curtas, ajuda a evitar a reinfecção.",
      "Verminose pode causar anemia, perda de peso e atrapalhar o crescimento. O pediatra decide se e quando tratar, e se o tratamento deve incluir a família. Dar vermífugo sem indicação, ou de rotina por conta própria, não substitui as medidas de higiene.",
    ],
    atencao:
      "Procure o pediatra se a criança tiver coceira no bumbum, barriga inchada, diarreia que vai e volta, perda de peso, palidez, cansaço ou se você vir vermes no cocô. Vá ao pronto-socorro se houver dor de barriga forte com vômitos e barriga estufada.",
    fontes: [
      "Ministério da Saúde. Verminoses: vamos conhecer para prevenir (folder da campanha de zoonoses). 2021.",
      CADERNETA,
    ],
  },
  {
    id: "in-coco-introducao-alimentar",
    categoria: "intestino",
    titulo: "O cocô muda quando começa a comida",
    resumo: "Cor, cheiro e consistência mudam com a introdução alimentar; o que é esperado.",
    deMeses: 6,
    ateMeses: 24,
    simples: [
      "Com a comida, o cocô fica mais firme, mais escuro e com mais cheiro. É normal.",
      "Pedacinhos de cenoura, milho ou feijão no cocô são comuns.",
      "Beterraba pode deixar o cocô e o xixi avermelhados.",
      "Ofereça água em copo várias vezes ao dia, sem açúcar.",
      "Cocô duro, em bolinhas ou com sangue: fale com o pediatra.",
    ],
    aprofundado: [
      "A partir dos 6 meses, a introdução de outros alimentos muda o cocô. Ele fica mais pastoso ou formado, com cor que pode variar de acordo com o que o bebê comeu. Restos de alimento aparecem porque a mastigação ainda está em treino e algumas fibras não são digeridas, o que não significa que o bebê não aproveitou a comida.",
      "É nessa fase que a prisão de ventre costuma aparecer. Água oferecida ao longo do dia, frutas, verduras, legumes e feijão ajudam o intestino. O Guia Alimentar para Crianças Menores de 2 Anos recomenda evitar açúcar e ultraprocessados até os 2 anos, o que também protege o intestino.",
    ],
    atencao:
      "Procure o pediatra se o cocô ficar duro ou doloroso, com sangue ou muco, se a diarreia durar mais de dois dias ou se o bebê tiver manchas na pele, inchaço ou vômitos logo depois de comer um alimento novo. Inchaço no rosto, chiado ou falta de ar depois de comer: ligue 192.",
    fontes: [
      GUIA_MENORES_2,
      SBP_GI_FUNCIONAIS,
      "Sociedade Brasileira de Pediatria e Associação Brasileira de Alergia e Imunologia. Consenso Brasileiro sobre Alergia Alimentar. 2018.",
    ],
  },
];
