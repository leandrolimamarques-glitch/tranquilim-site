// Dicas de pele: marcas de nascença, pele do recém-nascido e problemas comuns da infância.
// Sem pomada nem remédio indicado: quem prescreve é o pediatra ou o dermatologista.
import type { Dica } from "./tipos";

const SBP_PELE_RN =
  "Sociedade Brasileira de Pediatria, Departamentos Científicos de Dermatologia e Neonatologia. Cuidados com a pele e anexos do recém-nascido: da higienização e hidratação ao tratamento. Guia Prático de Atualização nº 140, 2024.";
const SBP_HEMANGIOMA_2016 =
  "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Hemangioma da infância: conceito, classificação, diagnóstico e atualização terapêutica. 2016.";
const SBP_HEMANGIOMA_FAMILIAS =
  "Sociedade Brasileira de Pediatria. Hemangioma da infância. Pediatria para Famílias, Grupo de Trabalho de Cirurgia Pediátrica, 2025.";
const SBP_FRALDAS =
  "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Dermatite de fraldas: diagnósticos diferenciais. Guia Prático de Atualização nº 14, 2022.";
const SBP_DA_FAMILIAS =
  "Sociedade Brasileira de Pediatria. Dermatite atópica na infância: um guia essencial para pais. Pediatria para Famílias, Departamento Científico de Dermatologia, 2026.";

export const PELE: Dica[] = [
  {
    id: "pe-mancha-mongolica",
    categoria: "pele",
    titulo: "Mancha mongólica (mancha azulada)",
    resumo: "Mancha azul-acinzentada de nascença, comum nas costas baixas e no bumbum.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "É uma mancha azul ou cinza, lisa, que já vem de nascença.",
      "Aparece mais nas costas baixas e no bumbum.",
      "Não dói, não coça e não faz mal.",
      "Vai clareando com os anos e quase sempre some na infância.",
      "Peça ao pediatra para anotar na Caderneta. Assim ninguém confunde com roxo de pancada.",
    ],
    aprofundado: [
      "O nome técnico é melanocitose dérmica. Durante a gestação, células que produzem pigmento migram para a pele; algumas ficam numa camada mais profunda, e vista de fora a cor parece azulada. É muito comum em bebês de pele morena, negra, indígena e de origem asiática, e acontece em cerca de 6 a 7 de cada 10 recém-nascidos no Brasil, pela mistura de origens.",
      "A maioria clareia ao longo de meses ou anos. Algumas, principalmente na nuca, podem durar até a vida adulta, sem problema para a saúde.",
      "Como a cor lembra um hematoma, é útil que o pediatra registre a mancha, com local e tamanho, logo nas primeiras consultas. Isso evita confusão em creche, escola ou atendimento de emergência.",
    ],
    atencao:
      "Mostre ao pediatra se a mancha for muito grande e espalhada, se estiver em lugares menos comuns (como rosto, braços e pernas) junto com outras manchas, se aparecer depois do nascimento, se mudar de cor ou se doer ao toque, porque aí pode ser um machucado.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "pe-mancha-salmao",
    categoria: "pele",
    titulo: "Mancha salmão (\"beijo do anjo\" e \"bicada da cegonha\")",
    resumo: "Manchinha rosada na testa, pálpebras ou nuca que fica mais forte no choro.",
    deMeses: 0,
    ateMeses: 36,
    simples: [
      "É uma mancha rosada, de borda apagada, na testa, nas pálpebras ou na nuca.",
      "Fica mais vermelha quando o bebê chora ou faz força.",
      "Se você apertar de leve, ela clareia.",
      "Não dói e não precisa de tratamento.",
      "As do rosto somem até os 3 anos. A da nuca pode ficar, escondida pelo cabelo.",
    ],
    aprofundado: [
      "O nome técnico é nevo simples. São pequenos vasos da pele que ainda mantêm o padrão de antes do nascimento. É a marca vascular mais comum do recém-nascido. No meio da testa recebe o apelido de beijo do anjo; na nuca, de bicada da cegonha.",
      "Conforme o sistema que controla esses vasos amadurece, a mancha vai clareando. As do rosto costumam desaparecer entre o primeiro e o terceiro ano de vida. A da nuca pode permanecer, sem trazer problema.",
      "A mancha salmão é diferente da mancha vinho do Porto, que é mais escura, tem borda bem marcada, costuma ficar de um lado só do corpo e não clareia com o tempo.",
    ],
    atencao:
      "Mostre ao pediatra se a mancha for escura, arroxeada ou de um lado só do rosto, se não clarear com o tempo, ou se estiver no meio das costas baixas junto com tufo de pelos, covinha funda, caroço ou desvio do rego do bumbum.",
    fontes: [SBP_PELE_RN, SBP_HEMANGIOMA_2016],
  },
  {
    id: "pe-vinho-do-porto",
    categoria: "pele",
    titulo: "Mancha vinho do Porto",
    resumo: "Mancha vermelho-escura de nascença que não some e merece avaliação.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "É uma mancha vermelha ou arroxeada, de borda bem marcada, que já vem de nascença.",
      "Ela não some sozinha e cresce junto com a criança.",
      "Mostre ao pediatra nas primeiras consultas.",
      "Mancha no rosto, perto do olho ou da testa, precisa de avaliação logo.",
      "Existe tratamento com laser, que funciona melhor quando começa cedo.",
    ],
    aprofundado: [
      "A mancha vinho do Porto é uma malformação dos pequenos vasos da pele (malformação capilar). Ao contrário da mancha salmão, ela não clareia. Com os anos, pode escurecer e ficar mais grossa.",
      "Quando fica no rosto, principalmente na testa e em volta do olho, pode estar ligada à síndrome de Sturge-Weber, que afeta também o olho (risco de glaucoma) e o cérebro (risco de convulsões). Por isso o bebê com mancha nessa região deve ser avaliado cedo pelo pediatra, que encaminha ao oftalmologista e ao neurologista quando indicado.",
      "O tratamento da mancha é feito com laser por dermatologista com experiência em crianças. Os resultados são melhores quando as sessões começam nos primeiros meses de vida.",
    ],
    atencao:
      "Procure o pediatra logo se a mancha estiver na testa, na pálpebra ou em volta do olho, se o olho do bebê parecer maior, embaçado ou lacrimejar muito, ou se a mancha ocupar uma perna ou braço inteiro. Convulsão: ligue 192.",
    fontes: [
      SBP_HEMANGIOMA_FAMILIAS,
      "Sabeti S e cols. Consensus statement for the management and treatment of port-wine birthmarks in Sturge-Weber syndrome. JAMA Dermatology, 2021.",
    ],
  },
  {
    id: "pe-hemangioma",
    categoria: "pele",
    titulo: "Hemangioma (\"moranguinho\")",
    resumo: "Mancha ou caroço vermelho que cresce nos primeiros meses e depois regride.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Pode aparecer nas primeiras semanas como mancha clara ou vermelhinha e crescer rápido.",
      "Fica vermelho vivo, em relevo, parecendo um morango, ou azulado se for mais fundo.",
      "Cresce mais até uns 5 meses e depois vai murchando devagar, ao longo de anos.",
      "Perto do olho, nariz, boca, orelha ou na região da fralda: pediatra logo.",
      "Vários hemangiomas pelo corpo também precisam de avaliação.",
      "Tire fotos com uma régua do lado para mostrar o crescimento.",
    ],
    aprofundado: [
      "O hemangioma infantil é um tumor benigno de vasos sanguíneos, o mais comum da infância. Muitas vezes não aparece ao nascimento, ou aparece só como uma mancha clara ou uma área com vasinhos. Nas semanas seguintes cresce rapidamente, com o crescimento mais forte entre 1 e 3 meses, e a maioria já cresceu quase tudo aos 5 meses. Depois se estabiliza e regride lentamente.",
      "A maioria não precisa de tratamento. Mas alguns precisam ser avaliados cedo, de preferência no primeiro mês de vida, porque o tratamento funciona melhor antes do crescimento: os que ficam perto do olho (podem atrapalhar a visão), no nariz, nos lábios e na orelha (deformam e ulceram), na região da fralda e nas dobras (ferem com facilidade), os grandes no rosto e os que formam uma faixa.",
      "Cinco ou mais hemangiomas pequenos pelo corpo podem indicar hemangiomas em órgãos internos, como o fígado. Hemangioma no meio das costas baixas pode estar ligado a alterações da coluna. Nesses casos o pediatra pede exames.",
      "O tratamento, quando indicado, é com remédio receitado e acompanhado pelo médico. Não use pomadas, gelo ou produtos caseiros sobre o hemangioma.",
    ],
    atencao:
      "Procure o pediatra logo, sem esperar a próxima consulta, se o hemangioma estiver perto do olho, no nariz, nos lábios, na orelha, no pescoço, na região da fralda ou nas dobras, se for grande ou em faixa no rosto, se houver cinco ou mais, se crescer muito rápido ou se abrir uma ferida. Se sangrar, aperte com um pano limpo por 10 minutos e procure atendimento. Bebê com hemangioma no queixo ou pescoço que fica rouco ou com respiração barulhenta: pronto-socorro.",
    fontes: [
      SBP_HEMANGIOMA_2016,
      SBP_PELE_RN,
      "Krowchuk DP e cols. Clinical Practice Guideline for the Management of Infantile Hemangiomas (AAP). Pediatrics, 2019.",
    ],
  },
  {
    id: "pe-cafe-com-leite",
    categoria: "pele",
    titulo: "Manchas café com leite",
    resumo: "Uma ou duas são comuns; seis ou mais pedem avaliação.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "São manchas lisas, cor de café com leite, de borda bem definida.",
      "Ter uma ou duas é comum e não é problema.",
      "Conte as manchas de vez em quando, no banho.",
      "Seis ou mais manchas, ou sardinhas na axila ou na virilha: mostre ao pediatra.",
    ],
    aprofundado: [
      "Manchas café com leite são áreas com mais pigmento na pele. Podem estar presentes ao nascimento ou surgir nos primeiros anos. Muitas crianças saudáveis têm uma ou duas.",
      "Seis ou mais manchas maiores que meio centímetro (5 mm) antes da puberdade são um dos critérios da neurofibromatose tipo 1, uma condição genética que pode afetar a pele, os nervos, os olhos e os ossos. Sardas na axila ou na virilha são outro sinal. A avaliação é feita pelo pediatra, que pode encaminhar ao geneticista, ao dermatologista e ao oftalmologista.",
      "Ter as manchas não fecha o diagnóstico: o pediatra avalia o conjunto e acompanha a criança ao longo do tempo. O diagnóstico precoce permite acompanhar o crescimento, a visão, a pressão e o desenvolvimento escolar.",
    ],
    atencao:
      "Mostre ao pediatra se a criança tiver seis ou mais manchas café com leite, sardas na axila ou na virilha, caroços na pele, se alguém da família tiver neurofibromatose, ou se uma mancha for muito grande e de forma irregular.",
    fontes: [
      "Legius E e cols. Revised diagnostic criteria for neurofibromatosis type 1 and Legius syndrome: an international consensus recommendation. Genetics in Medicine, 2021.",
    ],
  },
  {
    id: "pe-nevo-congenito",
    categoria: "pele",
    titulo: "Pinta de nascença (nevo congênito)",
    resumo: "Pintas pequenas são comuns; pintas grandes precisam de dermatologista.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "É uma pinta marrom ou preta que já vem de nascença. Pode ter pelos.",
      "Pintas pequenas são comuns e quase sempre tranquilas.",
      "Pinta grande, ou muitas pintas espalhadas, precisa de dermatologista.",
      "Proteja a pinta do sol, como o resto da pele.",
      "Tire fotos de vez em quando para comparar.",
    ],
    aprofundado: [
      "O nevo melanocítico congênito é um acúmulo de células de pigmento presente desde o nascimento. Ele cresce na mesma proporção que a criança. Os pequenos têm risco muito baixo de virar câncer e não precisam ser retirados por isso.",
      "Os grandes, chamados gigantes, são raros. No recém-nascido, considera-se grande a pinta com 6 cm ou mais no corpo ou 9 cm ou mais na cabeça, porque ela vai chegar a 20 cm ou mais na vida adulta. Esses nevos têm risco maior de melanoma, e muitas vezes vêm com várias pintas menores espalhadas. Precisam de acompanhamento com dermatologista desde cedo, e às vezes de exames.",
      "Mudanças que pedem avaliação: crescimento muito mais rápido que a criança, caroço novo dentro da pinta, ferida que não cicatriza, sangramento ou mudança de cor.",
    ],
    atencao:
      "Procure o pediatra para encaminhar ao dermatologista se a pinta for grande, se houver muitas pintas pelo corpo, se ficar na cabeça ou nas costas sobre a coluna, ou se aparecer caroço, ferida, sangramento ou mudança rápida.",
    fontes: [
      "Viana ACL, Gontijo B, Bittencourt FV. Nevo melanocítico congênito gigante. Anais Brasileiros de Dermatologia, 2013.",
      SBP_PELE_RN,
    ],
  },
  {
    id: "pe-milium",
    categoria: "pele",
    titulo: "Pontinhos brancos no nariz (milium)",
    resumo: "Pontinhos brancos ou amarelos no rosto do recém-nascido somem sozinhos.",
    deMeses: 0,
    ateMeses: 3,
    simples: [
      "São pontinhos brancos ou amarelinhos, bem pequenos, no nariz, testa e bochechas.",
      "Metade dos recém-nascidos tem.",
      "Não aperte, não esprema e não passe pomada.",
      "Lave com água no banho, como o resto do rosto.",
      "Somem sozinhos nas primeiras semanas.",
    ],
    aprofundado: [
      "O milium (ou mília) são pequenos cistos de queratina, a proteína da camada mais externa da pele, presos logo abaixo da superfície. Aparecem em cerca de metade dos recém-nascidos, isolados ou agrupados, principalmente na testa, no nariz e nas bochechas.",
      "Não precisam de tratamento e desaparecem sozinhos. Espremer pode machucar e infeccionar a pele do bebê. Às vezes são confundidos com acne neonatal, que tem bolinhas vermelhas, e com a hiperplasia sebácea, que forma pontinhos amarelados no nariz e também some sozinha.",
    ],
    atencao:
      "Mostre ao pediatra se os pontinhos ficarem vermelhos, com pus, se espalharem pelo corpo, se o bebê tiver febre ou se continuarem depois dos 3 meses.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "pe-eritema-toxico",
    categoria: "pele",
    titulo: "Manchinhas vermelhas com pontinho no meio (eritema tóxico)",
    resumo: "Erupção muito comum nos primeiros dias de vida, que some sozinha.",
    deMeses: 0,
    ateMeses: 1,
    simples: [
      "Aparece entre o 1º e o 3º dia de vida: manchas vermelhas com um pontinho branco ou amarelo no meio.",
      "Pode surgir no rosto, no peito, nas costas e nos braços. Não aparece na palma da mão nem na sola do pé.",
      "O bebê fica bem, mama bem e não tem febre.",
      "Não precisa de pomada nem de remédio.",
      "Some sozinha em poucos dias.",
    ],
    aprofundado: [
      "Apesar do nome assustador, o eritema tóxico neonatal não tem nada de tóxico. É uma reação benigna da pele ainda imatura, que aparece em cerca de metade dos bebês nascidos a termo. As manchas mudam de lugar de um dia para o outro.",
      "As lesões duram de dois a três dias e não passam de duas semanas. O principal é diferenciar de infecção: no eritema tóxico o bebê está bem, sem febre, mamando e ativo.",
    ],
    atencao:
      "Leve ao pediatra no mesmo dia se aparecerem bolhas com pus, bolinhas agrupadas com líquido, pele descascando em placas ou manchas que surgem depois da segunda semana. Bebê com menos de 3 meses com febre, mole, mamando mal ou com pele acinzentada: pronto-socorro.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "pe-acne-neonatal",
    categoria: "pele",
    titulo: "Espinhas no rosto do bebê (acne neonatal)",
    resumo: "Bolinhas vermelhas no rosto nas primeiras semanas, pelos hormônios.",
    deMeses: 0,
    ateMeses: 3,
    simples: [
      "Bolinhas vermelhas no nariz, testa e bochechas nas primeiras semanas são comuns.",
      "Lave o rosto com água no banho e seque com toques leves.",
      "Não passe óleo, creme, loção nem pomada no rosto.",
      "Não esprema as bolinhas.",
      "Melhora sozinha em 1 a 3 meses.",
    ],
    aprofundado: [
      "Os hormônios que o bebê recebeu da mãe e os que ele mesmo produz estimulam as glândulas de gordura da pele, que formam as bolinhas. A acne neonatal começa nas primeiras semanas, fica principalmente no rosto e melhora sozinha em um a três meses, conforme essas glândulas voltam ao normal.",
      "Óleos, cremes e loções podem piorar as lesões. A maioria dos casos é leve e só precisa de limpeza com água ou sabonete próprio para bebê. Quando as lesões são inflamadas e persistentes, o pediatra avalia se há necessidade de tratamento.",
    ],
    atencao:
      "Mostre ao pediatra se as bolinhas tiverem pus, se espalharem para o corpo e o couro cabeludo, se o bebê tiver febre, ou se as espinhas começarem depois dos 3 meses ou durarem mais que isso, porque aí pode ser outro tipo de acne que precisa de avaliação.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "pe-crosta-lactea",
    categoria: "pele",
    titulo: "Crosta láctea (casquinhas na cabeça)",
    resumo: "Casquinhas amareladas no couro cabeludo que melhoram com cuidado simples.",
    deMeses: 0,
    ateMeses: 12,
    simples: [
      "São casquinhas amareladas e oleosas na cabeça do bebê. Não é falta de higiene.",
      "Lave a cabeça com xampu suave de bebê.",
      "Com o cabelo molhado, passe uma escovinha macia, com delicadeza.",
      "Não arranque as casquinhas com a unha.",
      "Melhora sozinha até 1 ano de idade.",
    ],
    aprofundado: [
      "A crosta láctea é a forma da dermatite seborreica no couro cabeludo do bebê. Começa por volta das 3 semanas de vida, é mais intensa perto dos 3 meses e some até o primeiro ano. Pode aparecer também atrás das orelhas, nas sobrancelhas, no pescoço e nas dobras da fralda, como manchas rosadas com escamas.",
      "Não coça nem incomoda o bebê, e o tratamento é mais para conforto e aparência. Lavar a cabeça com mais frequência, com xampu suave, e soltar as casquinhas com escova macia costuma bastar. Arrancar com a unha machuca e pode infeccionar.",
      "Produtos com remédio, como xampus e cremes medicamentosos, só com indicação do pediatra.",
    ],
    atencao:
      "Procure o pediatra se a pele ficar muito vermelha, inchada, com secreção ou mau cheiro, se as lesões se espalharem pelo corpo, coçarem muito, sangrarem, ou se não melhorarem com os cuidados de casa.",
    fontes: [
      SBP_FRALDAS,
      "American Academy of Pediatrics. Cradle Cap. HealthyChildren.org.",
    ],
  },
  {
    id: "pe-assadura",
    categoria: "pele",
    titulo: "Assadura (dermatite de fralda)",
    resumo: "Como prevenir e cuidar, e quando pode ser fungo.",
    deMeses: 0,
    ateMeses: 36,
    simples: [
      "Troque a fralda com frequência, logo depois do cocô.",
      "Limpe com água e algodão, sem esfregar. Seque bem as dobrinhas.",
      "Deixe o bumbum sem fralda um pouco, ao ar.",
      "Passe uma camada de creme de barreira a cada troca enquanto estiver vermelho.",
      "Evite lenço com perfume ou álcool.",
      "Vermelho vivo com bolinhas em volta e nas dobras pode ser fungo: fale com o pediatra.",
    ],
    aprofundado: [
      "A assadura comum é uma irritação: urina e cocô em contato com a pele abafada, mais o atrito da fralda, inflamam a pele. Quase toda criança tem pelo menos uma vez até os 2 anos. A prevenção é a melhor arma: troca frequente, limpeza suave, pele exposta ao ar e o creme de barreira que o pediatra indicar, que forma uma película protetora.",
      "Não é preciso tirar todo o creme a cada troca se não houver cocô por cima. Lenços umedecidos podem ser usados se forem sem álcool, sem perfume e sem óleos essenciais. A pele da região da fralda absorve mais os produtos, por isso quanto mais simples, melhor.",
      "Quando a área fica vermelho vivo, brilhante, de borda bem definida, pegando as dobras da virilha, com bolinhas vermelhas soltas em volta (lesões satélites), pode ser candidíase, que é um fungo. É mais comum depois de uso de antibiótico e pode vir com sapinho na boca. Esse caso precisa de avaliação e tratamento indicado pelo pediatra.",
      "Não use pomada com corticoide ou antibiótico por conta própria.",
    ],
    atencao:
      "Procure o pediatra se a assadura não melhorar em 2 a 3 dias de cuidado, se tiver bolinhas em volta, pegar as dobras, tiver placas brancas na boca, feridas abertas, bolhas, pus, ou se o bebê tiver febre ou chorar muito ao fazer xixi.",
    fontes: [SBP_PELE_RN, SBP_FRALDAS],
  },
  {
    id: "pe-brotoeja",
    categoria: "pele",
    titulo: "Brotoeja (miliária)",
    resumo: "Bolinhas de calor no pescoço, peito e costas; o tratamento é refrescar.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "São bolinhas pequenas, vermelhas ou transparentes, no pescoço, peito, costas e dobras.",
      "Aparecem com calor e suor.",
      "Tire o excesso de roupa. Use roupa leve de algodão.",
      "Deixe o ambiente fresco e ventilado. Um banho em água fresca ajuda.",
      "Não passe creme grosso ou óleo: tampa o suor e piora.",
    ],
    aprofundado: [
      "A brotoeja acontece quando os canais que levam o suor até a superfície da pele ficam entupidos. Nos bebês esses canais ainda são imaturos, por isso é tão comum. Calor, umidade, roupa demais, cobertor e febre favorecem. Há uma forma com bolinhas transparentes, como gotinhas de água, e outra com bolinhas vermelhas que podem coçar.",
      "O tratamento é diminuir o suor: ambiente fresco, roupas leves e soltas, menos camadas, banho em água fresca. Cremes espessos e óleos devem ser evitados, porque podem fechar ainda mais os poros. Na maioria das vezes melhora sozinha em poucos dias.",
    ],
    atencao:
      "Procure o pediatra se as bolinhas tiverem pus, se a pele ficar quente, dolorida e muito vermelha, se não melhorar em alguns dias com o ambiente fresco, ou se a criança tiver febre. Bebê com menos de 3 meses com febre: pronto-socorro.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "pe-dermatite-atopica",
    categoria: "pele",
    titulo: "Dermatite atópica (eczema)",
    resumo: "Pele seca que coça e fica vermelha; hidratar todo dia é a base do cuidado.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Banho curto, de 5 a 10 minutos, com água morna. Nunca quente.",
      "Use sabonete suave, só onde precisa. Nada de bucha ou esponja.",
      "Seque com toques leves e passe hidratante sem perfume logo depois.",
      "Hidrate pelo menos duas vezes por dia, mesmo quando a pele estiver boa.",
      "Roupa de algodão. Evite lã, tecido sintético e amaciante.",
      "Unhas curtas para não ferir ao coçar.",
    ],
    aprofundado: [
      "Na dermatite atópica a barreira da pele é mais frágil: perde água com facilidade e deixa entrar irritantes. A pele fica seca, áspera, coça e forma placas vermelhas. No bebê aparece mais no rosto e na parte de fora de braços e pernas; na criança maior, nas dobras de cotovelos e joelhos. A doença vai e volta, com fases de crise.",
      "A hidratação diária é a base do tratamento, como escovar os dentes. O melhor momento é logo depois do banho, nos primeiros minutos, com a pele ainda levemente úmida. Lave as roupas com sabão suave, sem amaciante e sem perfume, enxágue bem e tire as etiquetas. Calor com suor, ar muito seco, perfumes e produtos de limpeza costumam piorar.",
      "Nas crises, o pediatra pode receitar pomadas ou outros tratamentos, que devem ser usados exatamente como orientado. Não corte alimentos da dieta por conta própria: na maioria das crianças isso não melhora a pele e pode atrapalhar o crescimento.",
    ],
    atencao:
      "Procure o pediatra se a coceira atrapalhar o sono, se as placas se espalharem ou não melhorarem com a hidratação, ou se aparecer crosta amarelada, pus ou mau cheiro. Vá ao pronto-socorro se surgirem muitas bolinhas com líquido ou feridinhas redondas dolorosas sobre o eczema, principalmente com febre ou a criança abatida.",
    fontes: [
      SBP_DA_FAMILIAS,
      "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Dermatite atópica: o que o pediatra deve saber. 2015.",
    ],
  },
  {
    id: "pe-picadas-estrofulo",
    categoria: "pele",
    titulo: "Picadas de inseto e estrófulo",
    resumo: "Por que algumas crianças reagem tanto às picadas e como proteger.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Estrófulo é uma alergia às picadas: surgem caroços que coçam muito, às vezes com bolha.",
      "Lave com água e sabão e use compressa fria para aliviar.",
      "Corte as unhas para evitar feridas ao coçar.",
      "Use tela nas janelas, mosquiteiro no berço e roupa comprida ao entardecer.",
      "Repelente só com idade certa e seguindo o rótulo. Veja a dica sobre repelente.",
    ],
    aprofundado: [
      "O estrófulo, também chamado prurigo estrófulo ou urticária papular, é uma reação de hipersensibilidade às picadas de mosquito, pulga e outros insetos. É mais comum entre 1 e 7 anos. Cada picada vira um caroço vermelho e duro que coça muito, às vezes com bolha no meio, e pode durar dias. Novas picadas podem reativar as antigas.",
      "A principal medida é evitar as picadas: telas, mosquiteiro, roupas que cubram braços e pernas, controle de pulgas em animais e na casa. Com o tempo, a maioria das crianças fica menos sensível. Coçar pode infeccionar as lesões, por isso unhas curtas e limpas são importantes.",
      "Quando a coceira é muito forte, o pediatra pode indicar tratamento. Não passe pasta de dente, álcool, vinagre ou produtos caseiros sobre as picadas.",
    ],
    atencao:
      "Ligue 192 se, depois de uma picada, a criança tiver inchaço no rosto, nos lábios ou na língua, falta de ar, chiado, vômitos repetidos ou ficar mole. Procure o pediatra se as lesões tiverem pus, se a vermelhidão se espalhar e ficar quente, ou se a criança tiver febre.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Picadas de inseto: prurigo estrófulo ou urticária papular. Documento Científico nº 12, 2022.",
      "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Repelentes e outras medidas protetoras contra insetos na infância. Guia Prático de Atualização nº 7, 2020.",
      "Sociedade Brasileira de Pediatria. Anafilaxia: atualização 2021. Guia Prático de Atualização nº 6, Departamento Científico de Alergia, 2021.",
    ],
  },
  {
    id: "pe-pele-seca",
    categoria: "pele",
    titulo: "Pele seca",
    resumo: "Banho curto, água morna e hidratante sem perfume mantêm a pele protegida.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Banho curto e água morna. Água quente resseca.",
      "Sabonete suave só nas partes que sujam, como dobras e região da fralda.",
      "Seque sem esfregar.",
      "Passe hidratante infantil sem perfume logo depois do banho.",
      "No tempo seco ou frio, hidrate mais vezes ao dia.",
    ],
    aprofundado: [
      "A pele da criança é mais fina e perde água com mais facilidade que a do adulto. Banho longo e quente, sabonete demais e tempo seco tiram a gordura natural da pele. O resultado é pele áspera, que descama e às vezes coça.",
      "O hidratante funciona melhor quando aplicado logo depois do banho, com a pele ainda levemente úmida, porque segura a água na pele. Escolha produtos próprios para a idade, sem perfume e com poucos ingredientes. Para tirar o produto do pote, use as mãos limpas ou uma espátula, para não contaminar.",
      "Pele seca que coça muito e forma placas vermelhas pode ser dermatite atópica, e vale conversar com o pediatra.",
    ],
    atencao:
      "Procure o pediatra se a pele rachar e sangrar, se a coceira atrapalhar o sono, se aparecerem placas vermelhas, feridas ou crostas.",
    fontes: [SBP_PELE_RN, SBP_DA_FAMILIAS],
  },
  {
    id: "pe-descamacao-rn",
    categoria: "pele",
    titulo: "Pele do recém-nascido descascando",
    resumo: "Descamação nos primeiros dias é normal e passa sozinha.",
    deMeses: 0,
    ateMeses: 3,
    simples: [
      "Pele soltando lascas finas nas mãos, pés e tornozelos nos primeiros dias é normal.",
      "Bebê que nasceu depois da data costuma descascar mais.",
      "Não puxe as pelinhas.",
      "Se quiser, passe hidratante infantil sem perfume depois do banho.",
      "Some sozinha nas primeiras semanas.",
    ],
    aprofundado: [
      "Dentro do útero, a pele do bebê estava sempre em contato com líquido. Depois do nascimento, a camada mais externa se renova e solta escamas finas, a partir do segundo ou terceiro dia. A descamação costuma ser máxima entre o sexto e o décimo dia e pode durar algumas semanas. Bebês nascidos depois de 41 a 42 semanas já nascem descascando, e nos prematuros ela aparece mais tarde.",
      "Hidratantes podem ser usados desde o período neonatal, de preferência depois do banho, escolhendo produtos próprios para bebês, sem perfume.",
    ],
    atencao:
      "Mostre ao pediatra se a pele descascar em placas grandes, ficar muito grossa, rachada ou vermelha, se o bebê já nasceu com a pele como uma película brilhante, ou se a descamação vier com bolhas ou febre.",
    fontes: [SBP_PELE_RN],
  },
];
