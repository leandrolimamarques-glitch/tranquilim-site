// Dicas de cuidados do dia a dia: temperatura, nariz, unhas, banho, orelha, dentes, sol, repelente,
// roupa, carro, remédio e farmácia de casa. Nenhuma dose: quantidade de remédio é sempre do pediatra.
import type { Dica } from "./tipos";

const SBP_PELE_RN =
  "Sociedade Brasileira de Pediatria, Departamentos Científicos de Dermatologia e Neonatologia. Cuidados com a pele e anexos do recém-nascido: da higienização e hidratação ao tratamento. Guia Prático de Atualização nº 140, 2024.";
const SBP_FEBRE = "Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021.";
const SBP_SAUDE_ORAL =
  "Sociedade Brasileira de Pediatria, GT de Saúde Oral. Cuidados com a saúde oral nos primeiros mil dias de vida (Pediatria para Famílias). 2026.";
const MS_SAUDE_BUCAL =
  "Ministério da Saúde. Saúde bucal na primeira infância. Saúde de A a Z, gov.br, consultado em 2026.";
const SBP_ACIDENTES =
  "Sociedade Brasileira de Pediatria. Manual de Orientação nº 4: Os acidentes são evitáveis e, na maioria das vezes, o perigo está dentro de casa. 2020.";
const SBP_INTOXICACOES =
  "Sociedade Brasileira de Pediatria. Intoxicações agudas na infância. Pediatria para Famílias, Departamento Científico de Toxicologia e Saúde Ambiental, 2025.";
const CADERNETA = "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023.";
const AAP_SONO =
  "American Academy of Pediatrics. Sleep-Related Infant Deaths: Updated 2022 Recommendations for Reducing Infant Deaths in the Sleep Environment. Pediatrics, 2022.";

export const CUIDADOS: Dica[] = [
  {
    id: "cu-medir-temperatura",
    categoria: "cuidados",
    titulo: "Como medir a temperatura",
    resumo: "Termômetro digital na axila: acima de 37,3 °C é febre.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Use termômetro digital. Não use o de mercúrio: se quebrar, é perigoso.",
      "Seque a axila e coloque a ponta do termômetro bem no meio dela.",
      "Abaixe o braço da criança e segure junto do corpo até o termômetro apitar.",
      "Acima de 37,3 °C na axila é febre.",
      "Se a criança estava muito agasalhada ou saiu do banho, espere 15 minutos e meça de novo.",
      "Bebê com menos de 3 meses e febre: pronto-socorro.",
    ],
    aprofundado: [
      "A Sociedade Brasileira de Pediatria considera febre a temperatura na axila acima de 37,3 °C. A axila é o local mais prático e seguro em casa. O termômetro digital é barato, rápido e não tem mercúrio. Os termômetros de coluna de mercúrio foram proibidos para venda no Brasil pela Anvisa, e se quebrarem liberam vapor tóxico.",
      "A mão na testa engana: serve para desconfiar, não para confirmar. Termômetros de testa e de ouvido podem variar mais conforme a técnica. Se usar, siga a instrução do fabricante e, na dúvida, confirme na axila.",
      "Mais importante que o número é como a criança está. Uma criança com febre que, quando a temperatura baixa, volta a brincar e a se alimentar costuma estar bem. Criança muito abatida, difícil de acordar ou com respiração difícil precisa de atendimento, qualquer que seja a temperatura. Antitérmico é para conforto e só na dose orientada pelo pediatra.",
    ],
    atencao:
      "Bebê com menos de 3 meses com temperatura acima de 37,3 °C na axila: pronto-socorro. Em qualquer idade, ligue 192 ou vá ao pronto-socorro se houver convulsão, dificuldade para respirar, manchas roxas que não somem ao apertar, criança muito mole ou difícil de acordar. Febre que dura 5 dias ou mais, criança bebendo bem menos ou fazendo pouco xixi: pediatra.",
    fontes: [
      SBP_FEBRE,
      "NICE NG143. Fever in under 5s: assessment and initial management. 2019, atualizada em 2021.",
      "Anvisa. Resolução RDC nº 145/2017, que proíbe termômetros e esfigmomanômetros com coluna de mercúrio (substituída pela RDC nº 922/2024).",
    ],
  },
  {
    id: "cu-nariz-entupido",
    categoria: "cuidados",
    titulo: "Nariz entupido: lavagem com soro fisiológico",
    resumo: "Como lavar o nariz com segurança, sem engasgar.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Use soro fisiológico. Nunca água da torneira.",
      "O soro deve estar em temperatura ambiente, nunca gelado.",
      "Bebê no colo, sentado, com a cabeça um pouco para a frente. Nunca deitado reto.",
      "Aponte o jato para o lado de fora da narina, não para o meio do nariz.",
      "Aperte devagar e com suavidade, uma narina de cada vez.",
      "Quanto usar e quantas vezes ao dia: pergunte ao pediatra.",
    ],
    aprofundado: [
      "A lavagem nasal com soro fisiológico é segura, barata e recomendada pela Sociedade Brasileira de Pediatria para resfriados e rinite. Ela solta o catarro e ajuda a criança a respirar e a mamar melhor. Pode ser feita com conta-gotas, spray ou seringa sem agulha; o tipo de frasco e a quantidade variam com a idade, por isso peça ao pediatra para mostrar.",
      "A posição evita engasgo. Com a criança sentada no colo e a cabeça levemente para a frente, o adulto apoia a mão no queixo e encosta a bochecha na dela para segurar firme. No bebê pequeno, pode ser também deitado com a cabeceira bem elevada e a cabeça virada para o lado, lavando a narina de cima. O jato vai para o lado de fora da narina, com pressão suave, nunca com força.",
      "Depois de aberto, o frasco de soro deve ficar fechado e na geladeira, e ser tirado antes para voltar à temperatura ambiente. Antes de lavar, teste a temperatura. Não use descongestionante nasal em criança sem receita: em crianças pequenas pode causar intoxicação.",
    ],
    atencao:
      "Procure o pediatra se o bebê não conseguir mamar por causa do nariz, se houver febre por mais de 3 dias, catarro com sangue ou cheiro forte de um lado só (pode ser objeto no nariz). Vá ao pronto-socorro se a criança respirar muito rápido, afundar as costelas ou o pescoço para respirar, ficar com lábios roxos ou tiver pausas na respiração.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Lavagem nasal. Guia Prático de Atualização nº 120, 2023.",
      "NICE NG9. Bronchiolitis in children: diagnosis and management. 2015, atualizada em 2021.",
    ],
  },
  {
    id: "cu-unhas",
    categoria: "cuidados",
    titulo: "Cortar as unhas",
    resumo: "Unhas curtas e retas evitam arranhões e unha encravada.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Corte quando o bebê estiver dormindo ou bem calmo, com boa luz.",
      "Use tesourinha de ponta redonda ou lixa de unha macia.",
      "Corte reto, sem arredondar os cantos, principalmente nos pés.",
      "Segure o dedinho e afaste a pontinha da pele antes de cortar.",
      "Não arranque nem morda a unha do bebê.",
    ],
    aprofundado: [
      "As unhas do recém-nascido são finas, moles e crescem rápido. Podem ser compridas ao nascer e arranhar o rosto e os olhos. Nos primeiros dias, quando estão muito grudadas na pele, lixar é mais seguro que cortar.",
      "O corte reto, pouco profundo, é o mais adequado. Arredondar os cantos, principalmente das unhas dos pés, é a causa mais comum de unha encravada. Se cortar a pele sem querer, aperte com um pano limpo até parar de sangrar.",
      "Unhas curtas e limpas também ajudam a evitar feridas quando a criança coça e a passagem de vermes da mão para a boca.",
    ],
    atencao:
      "Procure o pediatra se o canto da unha ficar vermelho, inchado, dolorido ou com pus, se a vermelhidão se espalhar pelo dedo ou se a criança tiver febre.",
    fontes: [SBP_PELE_RN],
  },
  {
    id: "cu-banho",
    categoria: "cuidados",
    titulo: "Banho do bebê",
    resumo: "Banho curto, água morna e atenção total do adulto.",
    deMeses: 0,
    ateMeses: 24,
    simples: [
      "Separe tudo antes: toalha, roupa, fralda. Nunca deixe o bebê sozinho, nem por um segundo.",
      "Teste a água com o cotovelo ou o pulso. Tem que estar morna, nunca quente.",
      "Banho curto, de 5 a 10 minutos.",
      "Sabonete suave de bebê, pouca quantidade. Lave bem as dobrinhas.",
      "Seque com toques leves, sem esfregar, principalmente as dobras.",
      "Não use secador de cabelo no bebê.",
    ],
    aprofundado: [
      "O banho de banheira (imersão) é o mais indicado para o bebê, porque ele perde menos calor e fica mais tranquilo. Enrolar o recém-nascido num pano dentro da água e ir soltando aos poucos deixa o banho mais calmo. O banho deve durar de 5 a 10 minutos, com água morna. Termômetro de banheira ajuda; sem ele, teste com o cotovelo.",
      "O banho pode ser diário ou feito algumas vezes na semana, desde que as dobras, o coto umbilical e a região da fralda sejam limpos todos os dias. Prefira sabonetes líquidos suaves, próprios para bebê, sem perfume forte. O cabelo do bebê não deve ser esfregado, e secador é contraindicado porque pode queimar a pele.",
      "Afogamento acontece em segundos, em pouca água e sem barulho. Se precisar sair, enrole o bebê na toalha e leve junto. Assento de banho não substitui a mão do adulto.",
    ],
    atencao:
      "Se o bebê escorregar e ficar com a cabeça embaixo da água, tirar e ele não reagir, não chorar ou não respirar: ligue 192 e comece a reanimação. Queimadura com água quente: água corrente em temperatura ambiente sobre a área e procure atendimento.",
    fontes: [
      SBP_PELE_RN,
      "Shenoi RP et al. Prevention of Drowning: Policy Statement (AAP). Pediatrics, 2026.",
      SBP_ACIDENTES,
    ],
  },
  {
    id: "cu-orelha",
    categoria: "cuidados",
    titulo: "Limpeza da orelha",
    resumo: "Limpe só por fora; a cera protege o ouvido.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Limpe só a parte de fora da orelha, com a ponta da toalha ou um pano macio.",
      "Não coloque cotonete dentro do ouvido.",
      "Nada de grampo, palito, dedo ou gotas caseiras no ouvido.",
      "A cera é normal e protege. Ela sai sozinha.",
      "Seque atrás da orelha depois do banho.",
    ],
    aprofundado: [
      "A cera do ouvido é uma proteção natural: segura sujeira, protege contra água e micróbios e sai sozinha com o movimento da mastigação. O canal do ouvido se limpa sozinho.",
      "A haste com algodão empurra a cera para o fundo, pode formar uma rolha e pode até machucar ou furar o tímpano. A Sociedade Brasileira de Pediatria alerta para o número de crianças atendidas em pronto-socorro por uso errado do cotonete. Se houver excesso de cera, quem retira é o médico.",
    ],
    atencao:
      "Procure o pediatra se sair secreção, pus ou sangue do ouvido, se a criança tiver dor de ouvido, febre, parecer não escutar bem, ou se colocou algum objeto no ouvido. Não tente tirar o objeto em casa.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Uso incorreto do cotonete leva 34 crianças por dia ao pronto-socorro: estudo faz alerta. 2017.",
      "Schwartz SR e cols. Clinical Practice Guideline (Update): Earwax (Cerumen Impaction). Otolaryngology–Head and Neck Surgery, 2017.",
    ],
  },
  {
    id: "cu-dentes",
    categoria: "cuidados",
    titulo: "Escovar os dentes",
    resumo: "Escova desde o primeiro dente, creme dental com flúor na quantidade certa.",
    deMeses: 6,
    ateMeses: 72,
    simples: [
      "Escove desde o primeiro dente, com escova pequena e cerdas macias.",
      "Use creme dental com flúor.",
      "Até uns 3 anos: só um grão de arroz cru de creme dental na escova.",
      "Depois, quando já sabe cuspir: um grão de ervilha.",
      "Escove pelo menos duas vezes por dia. A escovação antes de dormir é a mais importante.",
      "O adulto escova ou termina a escovação até a criança ter firmeza na mão.",
    ],
    aprofundado: [
      "O flúor do creme dental fortalece o esmalte e reduz a cárie desde o primeiro dente. O Ministério da Saúde recomenda creme dental com flúor (pelo menos 1.000 ppm, informação que vem na embalagem). O cuidado é com a quantidade: muito creme engolido por muito tempo pode manchar os dentes que ainda vão nascer (fluorose). Por isso o tamanho de um grão de arroz cru para os pequenos e de uma ervilha quando a criança já cospe.",
      "Quando os dentes nascem, a escovação entra na rotina, principalmente depois da última refeição da noite. Depois de escovar à noite, não ofereça mais leite, suco ou mamadeira. Dormir mamando na mamadeira com leite ou suco favorece a cárie.",
      "Criança pequena ainda não tem coordenação para escovar sozinha. Deixe ela tentar e depois o adulto escova de novo. Passe o fio dental quando os dentes ficarem encostados.",
    ],
    atencao:
      "Procure o dentista ou o pediatra se aparecerem manchas brancas opacas ou marrons nos dentes, buraquinhos, dor, gengiva inchada ou sangrando, ou se a criança engolir uma grande quantidade de creme dental.",
    fontes: [MS_SAUDE_BUCAL, SBP_SAUDE_ORAL, CADERNETA],
  },
  {
    id: "cu-dentista",
    categoria: "cuidados",
    titulo: "Primeira ida ao dentista",
    resumo: "Leve quando nascer o primeiro dente, ou até 1 ano de idade.",
    deMeses: 4,
    ateMeses: 36,
    simples: [
      "Leve ao dentista quando nascer o primeiro dente.",
      "Se nenhum dente nascer, leve até o primeiro aniversário.",
      "A unidade básica de saúde tem dentista e atende bebês pelo SUS.",
      "Fale bem do dentista em casa. Não use o dentista como ameaça.",
      "Depois, volte nas datas que o dentista indicar.",
    ],
    aprofundado: [
      "A primeira consulta é de prevenção. O dentista olha a boca, a gengiva e os dentes que estão nascendo, ensina a escovação, a quantidade de creme dental e orienta sobre mamadeira, chupeta, açúcar e hábitos que influenciam a mordida.",
      "Começar cedo faz a criança se acostumar com o consultório antes de qualquer problema, e a cárie descoberta no início é muito mais simples de tratar. O dente de leite importa: ele guarda o lugar do dente permanente e ajuda a mastigar e a falar.",
    ],
    atencao:
      "Procure o dentista antes da data se a criança bater a boca e o dente ficar mole, escurecer, quebrar ou sair, se houver dor, inchaço no rosto, bolinha de pus na gengiva ou manchas nos dentes. Dente permanente que caiu inteiro numa queda: segure pela coroa, sem esfregar a raiz, guarde no leite ou na saliva e procure atendimento na hora.",
    fontes: [SBP_SAUDE_ORAL, MS_SAUDE_BUCAL],
  },
  {
    id: "cu-sol",
    categoria: "cuidados",
    titulo: "Sol e protetor solar",
    resumo: "Antes de 6 meses, sombra e roupa; depois, protetor também.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Bebê com menos de 6 meses não deve ficar no sol direto nem usar protetor solar.",
      "Proteja com sombra, guarda-sol, chapéu de aba e roupa leve que cubra braços e pernas.",
      "Depois dos 6 meses, use protetor infantil, de preferência o mineral (físico), FPS 30 ou mais.",
      "Passe antes de sair e reaplique a cada 2 horas e depois de água ou suor.",
      "Evite o sol forte do meio do dia, mais ou menos das 10h às 16h.",
      "Banho de sol para tratar icterícia não é recomendado.",
    ],
    aprofundado: [
      "A pele do bebê é mais fina, tem menos melanina e queima com facilidade. Queimaduras de sol na infância aumentam o risco de câncer de pele no futuro. A Sociedade Brasileira de Pediatria orienta evitar a exposição direta ao sol antes dos 6 meses e não usar filtro solar nessa idade, por falta de estudos de segurança.",
      "Entre 6 meses e 2 anos, os filtros minerais (físicos), que vêm indicados assim na embalagem, são os preferidos. Depois dos 2 anos podem ser usados os filtros infantis em geral. O protetor deve cobrir bem toda a pele exposta, inclusive orelhas, nuca e peito do pé. Se for usar repelente, passe o protetor primeiro e o repelente depois; produtos que juntam os dois não são recomendados.",
      "Tomar sol para produzir vitamina D ou para tratar icterícia não é recomendado. A vitamina D do bebê vem do suplemento indicado pelo pediatra, e a icterícia é avaliada e tratada pela equipe de saúde.",
    ],
    atencao:
      "Procure o pediatra se a pele ficar com bolhas, muito vermelha e dolorida, ou se a criança tiver febre, vômitos ou ficar abatida depois de tomar sol. Vá ao pronto-socorro se a criança ficar muito sonolenta, confusa ou parar de urinar depois de muito calor.",
    fontes: [
      "Sociedade Brasileira de Pediatria. Uso da vitamina D e fotoproteção: ainda se indica banho de sol em lactentes? Pediatria para Famílias, 2024.",
      "Sociedade Brasileira de Pediatria. Fotoproteção na criança. Pediatria para Famílias, Departamento Científico de Dermatologia, 2018.",
      SBP_PELE_RN,
      "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Repelentes e outras medidas protetoras contra insetos na infância. Guia Prático de Atualização nº 7, 2020.",
    ],
  },
  {
    id: "cu-repelente",
    categoria: "cuidados",
    titulo: "Repelente: a partir de quando",
    resumo: "Antes de 2 meses, só barreira; depois, repelente próprio para a idade.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Antes de 2 meses: nada de repelente na pele. Use mosquiteiro no berço e no carrinho e roupa comprida.",
      "De 2 a 6 meses: repelente só se houver muito mosquito e não der para evitar.",
      "Depois: escolha repelente com a idade certa no rótulo. Os ativos indicados são icaridina, IR3535 e DEET.",
      "Passe primeiro na sua mão e depois na pele da criança. Não ponha nas mãos dela.",
      "Não passe perto dos olhos e da boca, nem em feridas.",
      "Tire com banho quando voltar para casa.",
    ],
    aprofundado: [
      "A Sociedade Brasileira de Pediatria recomenda como ativos repelentes para crianças a icaridina (picaridina), o IR3535 e o DEET, sempre respeitando a idade mínima e a forma de uso escritas no rótulo, que variam de produto para produto. A Anvisa libera o DEET só a partir dos 2 anos. Citronela, óleos naturais, pulseiras, adesivos e aparelhos de ultrassom não protegem de verdade.",
      "Em bebês com menos de 2 meses, só barreiras físicas: mosquiteiro com elástico no berço e no carrinho, telas nas janelas e roupas que cubram braços e pernas. Entre 2 e 6 meses, repelente só em situações de exposição intensa e inevitável, pesando risco e benefício. Abaixo de 1 ano, no máximo uma aplicação por dia.",
      "Aplique na pele exposta, não por baixo da roupa. Se usar protetor solar, ele vai primeiro e o repelente depois. Guarde o repelente longe das crianças e não deixe que elas mesmas apliquem.",
    ],
    atencao:
      "Lave a pele com água e sabão e procure o pediatra se aparecer vermelhidão, coceira forte ou bolhas onde passou o repelente. Se a criança engolir repelente ou passar mal depois de usar, ligue para o Disque-Intoxicação 0800 722 6001 ou vá ao pronto-socorro levando a embalagem. Convulsão ou criança desacordada: 192.",
    fontes: [
      "Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Repelentes e outras medidas protetoras contra insetos na infância. Guia Prático de Atualização nº 7, 2020.",
    ],
  },
  {
    id: "cu-roupa-temperatura",
    categoria: "cuidados",
    titulo: "Roupa certa para o clima",
    resumo: "Nem frio, nem calor demais: como saber se o bebê está bem agasalhado.",
    deMeses: 0,
    ateMeses: 24,
    simples: [
      "Vista o bebê com, no máximo, uma peça a mais do que você está usando.",
      "Para saber se está com frio ou calor, toque na nuca ou nas costas, não nas mãos e pés.",
      "Suor na nuca, cabelo molhado e bochecha muito vermelha: tire uma peça.",
      "Para dormir, nada de touca, cobertor solto ou excesso de roupa.",
      "No calor, roupa leve de algodão e ambiente ventilado.",
    ],
    aprofundado: [
      "O bebê pequeno regula pior a temperatura do corpo, tanto para o frio quanto para o calor. Mãos e pés frios são normais e não indicam frio. O que vale é a temperatura da nuca, do peito e das costas.",
      "O excesso de roupa e de cobertas durante o sono aumenta o risco de morte súbita do bebê. A Academia Americana de Pediatria recomenda vestir o bebê com, no máximo, uma camada a mais do que um adulto usaria no mesmo ambiente, sem touca para dormir dentro de casa. Em vez de cobertor, prefira um pijama mais quente ou saco de dormir próprio para a idade.",
      "Roupa demais também causa brotoeja e pode fazer o termômetro marcar mais alto. Se o bebê estava muito agasalhado, tire o excesso e meça de novo depois de 15 minutos.",
    ],
    atencao:
      "Procure atendimento se o bebê estiver com o peito e as costas frios, pálido ou arroxeado, muito quieto e sonolento, ou se, mesmo sem excesso de roupa, a temperatura na axila passar de 37,3 °C. Bebê com menos de 3 meses com febre: pronto-socorro.",
    fontes: [
      AAP_SONO,
      "Sociedade Brasileira de Pediatria. Recomendações da AAP sobre sono seguro em menores de um ano. Nota de Alerta nº 56, 2023.",
      SBP_FEBRE,
    ],
  },
  {
    id: "cu-cadeirinha",
    categoria: "cuidados",
    titulo: "Bebê no carro: a cadeirinha",
    resumo: "Dicas rápidas para usar bem o bebê conforto e a cadeirinha.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Desde a saída da maternidade, sempre na cadeirinha. Nunca no colo, nem em trajeto curto.",
      "Sempre no banco de trás.",
      "Bebê conforto de costas para o movimento, pelo maior tempo que o fabricante permitir.",
      "Cinto da cadeirinha justo: não deve dar para beliscar a fita na altura do ombro.",
      "Tire o casaco grosso antes de afivelar. Cubra com a manta por cima do cinto.",
      "Nunca deixe a criança sozinha no carro, nem por um minuto.",
    ],
    aprofundado: [
      "O Código de Trânsito determina que criança com menos de 10 anos que ainda não alcançou 1,45 m viaje no banco de trás, em dispositivo adequado à idade, peso e altura. O bebê conforto ou a cadeira conversível ficam de costas para o movimento do carro, porque assim a cabeça e o pescoço, ainda frágeis, ficam apoiados numa batida.",
      "Casaco grosso deixa folga no cinto e, numa batida, a criança pode escapar. A trava do peito fica na altura das axilas. Leia o manual da cadeirinha e o do carro para instalar, e confira se ela fica firme, sem balançar para os lados ou para a frente.",
      "Dentro do carro fechado a temperatura sobe muito rápido, mesmo em dia nublado. Deixe um objeto seu, como a bolsa, no banco de trás, para não esquecer a criança. A cadeirinha é para o carro: se o bebê dormir no caminho, passe para o berço ao chegar.",
    ],
    atencao:
      "Depois de qualquer batida, mesmo leve, procure atendimento se a criança vomitar, ficar sonolenta, chorar sem parar ou tiver dor. Criança esquecida no carro: tire imediatamente, refresque e ligue 192.",
    fontes: [
      "Código de Trânsito Brasileiro, art. 64, com redação da Lei 14.071/2020.",
      "Conselho Nacional de Trânsito (CONTRAN). Resolução nº 819, de 17 de março de 2021.",
      "Durbin DR, Hoffman BD. Child Passenger Safety (AAP). Pediatrics, 2018.",
    ],
  },
  {
    id: "cu-dar-remedio",
    categoria: "cuidados",
    titulo: "Como dar remédio sem engasgar",
    resumo: "Técnica para dar o remédio que o pediatra receitou, com segurança.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Dê só o remédio que o pediatra receitou, na quantidade e no horário da receita.",
      "Meça com a seringa ou o copinho que vem com o remédio. Nunca com colher de cozinha.",
      "Deixe a criança sentada ou bem inclinada no colo. Nunca deitada.",
      "Coloque a seringa no canto da boca, por dentro da bochecha, e aperte devagar.",
      "Dê aos pouquinhos e espere engolir. Não aperte o nariz.",
      "Se vomitar logo depois, pergunte ao pediatra antes de dar de novo.",
    ],
    aprofundado: [
      "Colheres de cozinha têm tamanhos muito diferentes e levam a erro de quantidade. A seringa dosadora é o jeito mais preciso. Se o remédio não veio com medidor, peça um na farmácia. Lave a seringa depois de usar e guarde junto com o remédio certo, para não trocar.",
      "Jogar o líquido direto no fundo da garganta faz a criança engasgar ou cuspir. No canto da boca, por dentro da bochecha, o remédio escorre devagar e ela engole melhor. Com bebê pequeno, pode-se deixar ele sugar o líquido da seringa aos poucos.",
      "Não misture o remédio na mamadeira cheia ou num prato de comida: se ela não terminar, não recebe a quantidade certa. Pergunte ao pediatra ou ao farmacêutico se pode misturar com um pouquinho de alimento. Não chame remédio de bala ou doce, e não use remédio de outra pessoa, de adulto ou que sobrou de outra vez.",
    ],
    atencao:
      "Se a criança engasgar e não conseguir respirar, chorar ou tossir, ligue 192 e faça as manobras de desengasgo. Ligue para o Disque-Intoxicação 0800 722 6001 ou vá ao pronto-socorro se ela tomar remédio a mais, remédio errado ou de outra pessoa, mesmo sem sintomas. Manchas na pele, inchaço no rosto ou falta de ar depois do remédio: 192.",
    fontes: [
      "American Academy of Pediatrics. Using Liquid Medicines. HealthyChildren.org.",
      "Great Ormond Street Hospital (NHS). How to give your child liquid medicines.",
      SBP_INTOXICACOES,
    ],
  },
  {
    id: "cu-farmacia-casa",
    categoria: "cuidados",
    titulo: "Farmácia de casa segura",
    resumo: "Como guardar remédios e produtos para evitar intoxicação.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Guarde remédios no alto, numa caixa com tampa ou trancada, longe da vista da criança.",
      "Nada de remédio na bolsa, na mesa de cabeceira ou na gaveta baixa.",
      "Mantenha cada remédio na caixa original, com a bula e a receita.",
      "Confira a validade. Leve os vencidos ou que sobraram a um ponto de coleta na farmácia.",
      "Anote em lugar fácil: Disque-Intoxicação 0800 722 6001 e 192.",
    ],
    aprofundado: [
      "Remédios estão entre as principais causas de intoxicação de crianças pequenas. A criança imita o adulto, abre embalagens e confunde comprimido colorido com bala. Tampas com trava de segurança ajudam, mas não substituem guardar fora do alcance. Produtos de limpeza, inseticidas e repelentes também devem ficar no alto e trancados, sempre na embalagem original.",
      "Ter muitos remédios em casa aumenta o risco. Sobras de antibiótico, xarope aberto há muito tempo e remédios de adulto não devem ser guardados para usar depois. O Decreto 10.388/2020 prevê pontos de coleta em farmácias para devolver medicamentos vencidos ou que não serão usados. Não jogue no lixo comum, na pia ou no vaso.",
      "Em casa de visitas, na casa dos avós e em viagens, o cuidado é o mesmo: bolsas e malas costumam guardar remédios ao alcance da criança.",
    ],
    atencao:
      "Suspeita de que a criança engoliu remédio ou produto, mesmo sem sintoma nenhum: ligue já para o 0800 722 6001 ou vá ao pronto-socorro levando a embalagem. Não provoque vômito e não dê leite ou outra coisa sem orientação. Criança desacordada, com convulsão ou dificuldade para respirar: 192.",
    fontes: [
      SBP_ACIDENTES,
      SBP_INTOXICACOES,
      "Decreto nº 10.388, de 5 de junho de 2020 (logística reversa de medicamentos domiciliares vencidos ou em desuso).",
    ],
  },
];
