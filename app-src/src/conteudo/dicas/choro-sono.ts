import type { Dica } from "./tipos";

// Choro e sono: acalmar, cólica, sono por idade, segurança de quem cuida.
// Sem remédio e sem dose: qualquer remédio só com o pediatra.

const SBP_DGIF =
  "Sociedade Brasileira de Pediatria, Departamento de Gastroenterologia. Distúrbios gastrointestinais funcionais no lactente e na criança abaixo de 4 anos: um guia para a prática diária. 2022.";
const SBP_COLICA =
  "Sociedade Brasileira de Pediatria, Departamento de Gastroenterologia. Perguntas complementares sobre cólica do lactente (Pediatria para Famílias). 2025.";
const AAP_SONO =
  "American Academy of Pediatrics. Sleep-Related Infant Deaths: Updated 2022 Recommendations for Reducing Infant Deaths in the Sleep Environment. Pediatrics, 2022.";
const AAP_AHT = "American Academy of Pediatrics. Abusive Head Trauma in Infants and Children (relatório clínico). Pediatrics, 2020.";
const SBP_HIGIENE_SONO =
  "Sociedade Brasileira de Pediatria, Departamento de Medicina do Sono. Higiene do sono: atualização 2021. Documento científico nº 5, 2021.";
const SBP_PARASSONIAS = "Sociedade Brasileira de Pediatria, Departamento de Medicina do Sono. Parassonias: atualização 2022. Documento científico, 2022.";
const OMS_SONO =
  "Organização Mundial da Saúde. Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age. 2019.";
const AASM =
  "American Academy of Sleep Medicine. Recommended amount of sleep for pediatric populations (consenso). Journal of Clinical Sleep Medicine, 2016.";
const CADERNETA = "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023; 7ª edição, 2024.";
const HUGH = "Hugh SC et al. Infant sleep machines and hazardous sound pressure levels. Pediatrics, 2014.";
const SBP_TELAS = "Sociedade Brasileira de Pediatria. Manual de Orientação #Menos Telas #Mais Saúde. Atualização 2024.";

export const CHORO_SONO: Dica[] = [
  {
    id: "cs-checklist-choro",
    categoria: "choro-sono",
    titulo: "Bebê chorando: o que conferir",
    resumo: "Uma lista rápida para descobrir o que o bebê está pedindo.",
    deMeses: 0,
    ateMeses: 12,
    simples: [
      "Fome? Ofereça o peito ou a mamada.",
      "Fralda suja ou molhada? Troque.",
      "Frio ou calor? Toque a nuca: deve estar morna, sem suor.",
      "Quer colo? Pegue. Colo não deixa o bebê mal-acostumado.",
      "Sono? Ambiente calmo, pouca luz, balanço suave.",
      "Confira se nada aperta: roupa, etiqueta, fio de cabelo enrolado no dedo.",
    ],
    aprofundado: [
      "Chorar é o jeito que o bebê tem de se comunicar. Nas primeiras semanas, o choro aumenta e costuma chegar ao máximo por volta de 6 a 8 semanas de vida, melhorando bastante entre 3 e 4 meses. Muitos bebês choram mais no fim da tarde e à noite.",
      "Na dúvida, a fome é a primeira hipótese: a amamentação é em livre demanda, sem horário fixo. Sinais de fome aparecem antes do choro, como levar a mão à boca e virar a cabeça procurando o peito.",
      "Um detalhe que pouca gente conhece: um fio de cabelo pode se enrolar num dedo da mão, do pé ou no pênis e apertar. Se o choro é forte e diferente, olhe dedo por dedo.",
      "Atender o bebê quando ele chora não estraga o bebê. Responder aos sinais dele dá segurança, e bebês seguros tendem a se acalmar com mais facilidade com o tempo.",
    ],
    atencao:
      "Se o choro vem com febre, moleza, gemido, vômitos repetidos, dificuldade para respirar ou recusa para mamar, veja a dica de choro como sinal de alerta e procure atendimento.",
    fontes: [SBP_COLICA, CADERNETA],
  },
  {
    id: "cs-colica",
    categoria: "choro-sono",
    titulo: "Cólica: o que ajuda de verdade",
    resumo: "Cólica é comum, passa sozinha e não é doença. Veja o que acalma e o que evitar.",
    deMeses: 0,
    ateMeses: 5,
    simples: [
      "Cólica é choro forte, quase sempre no fim da tarde, num bebê que mama e cresce bem.",
      "Ela passa sozinha, quase sempre até os 4 ou 5 meses.",
      "Colo, balanço suave e contato pele a pele acalmam muitos bebês.",
      "Massagem leve na barriga e dobrar as perninhas também podem ajudar.",
      "Não dê remédio, chá ou simpatia sem falar com o pediatra.",
      "Se você estiver no limite, peça ajuda. Nunca sacuda o bebê.",
    ],
    aprofundado: [
      "A cólica do lactente é um distúrbio funcional: o intestino é normal, mas o sistema digestivo e o nervoso do bebê ainda estão amadurecendo. Ela começa nas primeiras semanas, piora por volta de 6 a 8 semanas e quase sempre some antes dos 5 meses. O diagnóstico é feito pelo pediatra, pela história e pelo exame, sem precisar de exames.",
      "O que dizem os estudos: nenhuma medida cura a cólica. Colo, balanço, massagem, posição de bruços no colo (acordado e com você segurando), banho morno e ruído contínuo baixo acalmam alguns bebês e não fazem mal se feitos com segurança. Vale testar e ficar com o que funciona para o seu.",
      "Chás e simpatias podem fazer mal ao bebê pequeno e atrapalhar a amamentação. Remédios para cólica só com indicação do pediatra. A Sociedade Brasileira de Pediatria lembra que sintomas de barriga não são motivo para parar o aleitamento materno.",
      "Cuidar de um bebê que chora muito é cansativo. Revezar com outra pessoa, dormir quando o bebê dorme e conversar sobre o que sente fazem parte do cuidado.",
    ],
    atencao:
      "Procure o pediatra se houver sangue nas fezes, febre, vômitos frequentes, recusa para mamar, pouco ganho de peso, ou se o choro continuar forte depois dos 4 meses.",
    fontes: [SBP_COLICA, SBP_DGIF],
  },
  {
    id: "cs-cinco-s",
    categoria: "choro-sono",
    titulo: "Técnica dos 5 S, com sono seguro",
    resumo: "Cinco gestos que acalmam muitos bebês, com os cuidados para não arriscar o sono.",
    deMeses: 0,
    ateMeses: 4,
    simples: [
      "Enrolar: cueiro firme nos braços e solto nos quadris e pernas.",
      "De lado ou de bruços: só no seu colo, acordado. Para dormir, sempre de barriga para cima.",
      "Shhh: faça \"shhh\" perto do ouvido, ou um som contínuo baixinho.",
      "Balançar: movimentos curtos e suaves, nunca chacoalhar.",
      "Sugar: peito ou dedo limpo de um adulto.",
      "Pare de enrolar quando o bebê começar a tentar rolar.",
    ],
    aprofundado: [
      "Os \"5 S\" foram popularizados por um pediatra americano a partir das iniciais, em inglês, de enrolar, posição de lado ou de bruços, fazer shhh, balançar e sugar. Eles imitam o ambiente do útero. Há estudos mostrando que acalmam bebês após vacinas, mas a evidência para cólica é limitada.",
      "Enrolar (cueiro): só nos primeiros meses e só até o bebê mostrar sinais de que quer rolar, o que pode acontecer a partir dos 2 meses. Bebê enrolado que vira de bruços corre risco de sufocação. As pernas devem ficar soltas e dobradas, como de sapinho, para proteger o quadril. No calor, cuidado com excesso de roupa.",
      "As posições de lado e de bruços servem apenas para acalmar no colo, com o bebê acordado. Quando ele dormir, coloque no berço de barriga para cima, sem travesseiro, protetor, cobertor solto ou bichinhos.",
      "Balançar é diferente de sacudir: o movimento é curto, suave e com a cabeça sempre apoiada. Se usar aparelho de ruído, deixe longe do berço e no volume mais baixo que funcione.",
    ],
    atencao: "Nunca sacuda o bebê. Se ele ficar mole, sonolento demais, vomitar ou tiver convulsão depois de um tranco, ligue 192.",
    fontes: [AAP_SONO, HUGH, SBP_DGIF],
  },
  {
    id: "cs-choro-alerta",
    categoria: "choro-sono",
    titulo: "Quando o choro é sinal de alerta",
    resumo: "Choro diferente, com outros sintomas, pede avaliação médica.",
    deMeses: 0,
    ateMeses: 24,
    simples: [
      "Choro muito diferente do normal, agudo ou gemido, merece atenção.",
      "Bebê com menos de 3 meses e febre: pronto-socorro.",
      "Choro com vômitos verdes, barriga dura ou sangue nas fezes: pronto-socorro.",
      "Moleza, sonolência demais ou não querer mamar: pronto-socorro.",
      "Respiração difícil, lábios roxos, convulsão ou não acorda: ligue 192.",
    ],
    aprofundado: [
      "A maior parte do choro tem causa simples, mas alguns sinais mostram que pode haver doença. O mais importante é a mudança: você conhece o seu bebê, e um choro que não parece com nenhum outro deve ser levado a sério.",
      "Fique atento também a: moleira estufada, manchas roxas ou vermelhas que não somem ao apertar a pele, inchaço duro na virilha ou no saco escrotal, dor ao mexer um braço ou uma perna, poucas fraldas molhadas, e choro que não para com nada por horas.",
      "Em bebês com menos de 3 meses, febre é sempre motivo para atendimento no mesmo dia, mesmo que ele pareça bem. Veja a dica de febre do app para saber como medir.",
    ],
    atencao:
      "Ligue 192 se o bebê não respira bem, está roxo, tem convulsão, não acorda ou está muito mole. Nos outros sinais de alerta, vá ao pronto-socorro.",
    fontes: [SBP_COLICA, CADERNETA, "Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021."],
  },
  {
    id: "cs-nunca-sacudir",
    categoria: "choro-sono",
    titulo: "Chegou ao limite? Nunca sacuda",
    resumo: "Sentir raiva com o choro é humano. Saiba o que fazer para proteger o bebê e você.",
    deMeses: 0,
    ateMeses: 24,
    simples: [
      "Nunca sacuda o bebê. Nem de leve, nem para brincar.",
      "Se você sentir raiva ou desespero, coloque o bebê no berço, de barriga para cima.",
      "Saia do quarto por alguns minutos. Respire fundo, beba água.",
      "Ligue para alguém de confiança e peça para vir ajudar.",
      "Volte para olhar o bebê a cada poucos minutos.",
      "Chorar no berço por um tempo não faz mal ao bebê. Sacudir pode matar.",
    ],
    aprofundado: [
      "Sacudir um bebê pode romper vasos dentro da cabeça e causar lesão cerebral grave, cegueira, convulsões e morte, mesmo sem nenhuma marca por fora. É a chamada síndrome do bebê sacudido, uma forma de trauma craniano. O choro que não para é o gatilho mais comum.",
      "O choro costuma ser maior entre 2 semanas e 4 meses. Saber que isso é esperado, e que vai passar, ajuda. Combine com todas as pessoas que cuidam do bebê, inclusive babá, avós e o outro responsável, o plano: berço, sair do quarto, respirar, pedir ajuda.",
      "Cansaço extremo, falta de sono e tristeza que não passa podem ser sinais de depressão pós-parto, que tem tratamento. Fale com sua equipe de saúde. Em momento de crise emocional, o CVV atende de graça pelo 188, a qualquer hora.",
    ],
    atencao:
      "Se o bebê foi sacudido ou sofreu um tranco forte e está mole, sonolento demais, vomitando, com convulsão ou respirando mal: ligue 192 na hora e conte o que aconteceu.",
    fontes: [AAP_AHT, SBP_COLICA, "Sociedade Brasileira de Pediatria e Colégio Brasileiro de Radiologia. Nota de Alerta: Critérios diagnósticos da violência física ou trauma intencional contra crianças e adolescentes. 2024."],
  },
  {
    id: "cs-cuidar-de-quem-cuida",
    categoria: "choro-sono",
    titulo: "Cuidar de quem cuida",
    resumo: "Pais descansados cuidam melhor. Pequenas ajudas fazem diferença.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Durma quando o bebê dormir, sempre que puder.",
      "Aceite ajuda com comida, roupa e casa.",
      "Reveze as noites com outro adulto, se possível.",
      "Coma, beba água e saia um pouco de casa, nem que seja na calçada.",
      "Tristeza que não passa ou vontade de sumir: fale com a equipe de saúde.",
    ],
    aprofundado: [
      "Os primeiros meses com um bebê mexem com sono, corpo e emoções. Ficar irritado, cansado e chorar às vezes é comum. Quando a tristeza dura mais de duas semanas, tira o prazer das coisas ou vem com culpa intensa, pode ser depressão pós-parto, que atinge mães e também pais, e tem tratamento.",
      "Dividir tarefas é proteção para o bebê: um adulto exausto tem mais chance de cochilar com o bebê no sofá, o que é perigoso, ou de perder a paciência. Se precisar descansar, coloque o bebê no berço, de barriga para cima.",
      "A unidade básica de saúde acompanha a família, não só a criança. Leve suas dúvidas e seu cansaço para as consultas.",
    ],
    atencao:
      "Se você pensa em se machucar ou machucar o bebê, peça ajuda agora: deixe o bebê em lugar seguro, chame alguém e ligue 188 (CVV) ou 192. Isso tem tratamento.",
    fontes: [AAP_SONO, AAP_AHT, CADERNETA],
  },
  {
    id: "cs-sono-por-idade",
    categoria: "choro-sono",
    titulo: "Quanto sono por idade",
    resumo: "As horas de sono que a maioria das crianças precisa, somando noite e cochilos.",
    deMeses: 0,
    ateMeses: 72,
    simples: [
      "Até 3 meses: cerca de 14 a 17 horas por dia, em vários sonos.",
      "De 4 meses a 1 ano: cerca de 12 a 16 horas, com cochilos.",
      "De 1 a 2 anos: cerca de 11 a 14 horas, com cochilos.",
      "De 3 a 5 anos: cerca de 10 a 13 horas.",
      "Cada criança é diferente. Se ela está bem durante o dia, o sono está bom.",
    ],
    aprofundado: [
      "Essas faixas são da Organização Mundial da Saúde e da Academia Americana de Medicina do Sono e somam o sono da noite e dos cochilos. No recém-nascido, o sono é espalhado pelo dia e pela noite, porque o relógio biológico ainda não está pronto. Ele vai se organizando nos primeiros meses.",
      "Luz do dia e atividade durante o dia, e escuro e calma à noite, ajudam esse relógio a se ajustar. Horários parecidos para dormir e acordar, todos os dias, também ajudam.",
      "O melhor sinal de que o sono está suficiente é o comportamento durante o dia: criança disposta, sem irritação e sonolência excessivas.",
    ],
    atencao:
      "Fale com o pediatra se a criança ronca alto quase toda noite, para de respirar dormindo, respira de boca aberta sempre ou vive sonolenta durante o dia.",
    fontes: [OMS_SONO, AASM, SBP_HIGIENE_SONO],
  },
  {
    id: "cs-rotina-sono",
    categoria: "choro-sono",
    titulo: "Rotina para dormir",
    resumo: "Os mesmos passos todas as noites avisam ao corpo que é hora de dormir.",
    deMeses: 3,
    ateMeses: 72,
    simples: [
      "Escolha um horário fixo para dormir.",
      "Repita os mesmos passos: banho, pijama, dentes, história, luz baixa.",
      "Sem telas pelo menos 1 hora antes de deitar.",
      "Coloque no berço ou na cama sonolento, mas ainda acordado.",
      "Quarto escuro, silencioso e fresco.",
    ],
    aprofundado: [
      "A rotina é uma sequência curta e previsível, de 20 a 30 minutos. O cérebro da criança aprende que aqueles passos vêm antes do sono e começa a desacelerar sozinho. Esse é o centro da higiene do sono, recomendada pela Sociedade Brasileira de Pediatria.",
      "Colocar a criança no berço ainda acordada, mas sonolenta, ajuda ela a aprender a pegar no sono sozinha. Assim, quando acordar de madrugada, terá mais chance de voltar a dormir sem precisar de colo ou mamada para isso.",
      "Telas antes de dormir atrasam o sono: a luz e o conteúdo estimulam o cérebro. A Sociedade Brasileira de Pediatria orienta desligar de 1 a 2 horas antes de deitar. Para bebês até 1 ano, o berço segue as regras do sono seguro: de barriga para cima e sem objetos soltos.",
    ],
    fontes: [SBP_HIGIENE_SONO, SBP_TELAS, AAP_SONO],
  },
  {
    id: "cs-despertares",
    categoria: "choro-sono",
    titulo: "Acorda muito à noite",
    resumo: "Acordar à noite é normal em bebês. Veja o que esperar e como ajudar.",
    deMeses: 0,
    ateMeses: 36,
    simples: [
      "Bebê pequeno acorda à noite para mamar. Isso é normal e necessário.",
      "À noite, fale baixo, luz fraca, sem brincadeira.",
      "Espere um pouquinho antes de pegar: às vezes ele volta a dormir sozinho.",
      "Mantenha a mesma forma de acalmar todas as noites.",
      "Com o tempo, os despertares vão diminuindo.",
    ],
    aprofundado: [
      "O sono do bebê tem ciclos curtos e, entre um ciclo e outro, todo mundo acorda rapidamente, inclusive os adultos. O bebê pequeno ainda está aprendendo a emendar esses ciclos e a dormir de novo sozinho.",
      "Nos primeiros meses, as mamadas noturnas são esperadas, e o leite materno noturno é importante para a amamentação. Com o crescimento, muitos bebês passam a dormir trechos maiores, mas acordar algumas vezes até os 2 ou 3 anos ainda é comum.",
      "Fases de saltos de desenvolvimento, dentes, doenças e mudanças na rotina podem aumentar os despertares por alguns dias. Manter a rotina ajuda a voltar ao normal.",
    ],
    atencao:
      "Fale com o pediatra se os despertares vêm com ronco, pausas na respiração, coceira, dor, ou se a família está esgotada e precisa de orientação.",
    fontes: [SBP_HIGIENE_SONO, CADERNETA],
  },
  {
    id: "cs-cochilos",
    categoria: "choro-sono",
    titulo: "Cochilos: quando mudam",
    resumo: "A quantidade de cochilos diminui com a idade. Veja como fazer a transição.",
    deMeses: 3,
    ateMeses: 72,
    simples: [
      "Bebês pequenos fazem vários cochilos por dia.",
      "Perto de 1 ano, muitos fazem 2 cochilos.",
      "Entre 1 ano e meio e 2 anos, muitos passam para 1 cochilo.",
      "Entre 3 e 5 anos, o cochilo costuma sumir.",
      "Na transição, adiante um pouco a hora de dormir à noite.",
    ],
    aprofundado: [
      "Os cochilos fazem parte do total de sono do dia. Conforme a criança cresce, ela aguenta ficar mais tempo acordada e os cochilos se juntam. As idades acima são aproximadas: cada criança tem seu ritmo.",
      "Sinais de que está na hora de tirar um cochilo: a criança demora muito para dormir nele, ou o cochilo atrapalha o sono da noite. Sinais de que ainda precisa: fica muito irritada ou dorme em qualquer lugar no fim da tarde.",
      "Cochilo muito perto da hora de dormir à noite pode atrasar o sono. Na creche, os horários podem ser diferentes de casa; vale combinar com a equipe.",
    ],
    fontes: [SBP_HIGIENE_SONO, AASM],
  },
  {
    id: "cs-pesadelo-terror-noturno",
    categoria: "choro-sono",
    titulo: "Pesadelo ou terror noturno?",
    resumo: "São diferentes, e o jeito de ajudar também muda.",
    deMeses: 24,
    ateMeses: 72,
    simples: [
      "Pesadelo: a criança acorda com medo, lembra do sonho e quer colo. Acalme e fique junto.",
      "Terror noturno: grita, se debate, de olhos abertos, mas não está acordada.",
      "No terror noturno, não tente acordar. Fique perto e proteja de se machucar.",
      "Ela volta a dormir e não lembra de nada de manhã.",
      "Rotina e sono suficiente diminuem os dois.",
    ],
    aprofundado: [
      "O pesadelo acontece mais na segunda metade da noite, num sono com sonhos. A criança acorda, consegue contar o que sonhou e se acalma com a presença do adulto. Conversar no dia seguinte e evitar histórias e vídeos assustadores ajuda.",
      "O terror noturno é um despertar parcial de um sono profundo, mais comum nas primeiras horas da noite. A criança parece apavorada, pode suar e gritar, mas não reconhece quem está perto. Segundo a Sociedade Brasileira de Pediatria, tentar acordar costuma prolongar o episódio. Ele dura alguns minutos e a criança não lembra depois.",
      "Os dois são comuns e costumam melhorar com a idade. Cansaço e sono atrasado aumentam os episódios, por isso a higiene do sono é a base do cuidado. Deixe o quarto seguro, sem objetos em que ela possa bater, e portões na escada.",
    ],
    atencao:
      "Fale com o pediatra se os episódios são muito frequentes, se a criança se machuca, faz movimentos repetidos e iguais, morde a língua, faz xixi durante o episódio ou fica sonolenta durante o dia.",
    fontes: [SBP_PARASSONIAS, SBP_HIGIENE_SONO],
  },
  {
    id: "cs-nao-quer-dormir",
    categoria: "choro-sono",
    titulo: "Criança que não quer dormir",
    resumo: "Combinados claros e calma ajudam a hora de dormir a deixar de ser uma briga.",
    deMeses: 18,
    ateMeses: 72,
    simples: [
      "Avise antes: \"Mais uma história e vamos deitar.\"",
      "Deixe a criança escolher pequenas coisas: o pijama, o livro.",
      "Mantenha o horário, mesmo no fim de semana, com pouca variação.",
      "Se ela levantar, leve de volta com calma e poucas palavras.",
      "Nada de tela, açúcar ou bagunça agitada perto da hora de dormir.",
    ],
    aprofundado: [
      "Entre 2 e 5 anos, testar limites na hora de dormir é muito comum. A criança pede mais água, mais um abraço, mais uma história. Combinar antes, com uma rotina previsível, e responder sempre da mesma forma, sem bronca e sem conversa longa, costuma resolver em algumas semanas.",
      "Às vezes a criança resiste porque está com pouco sono: cochilo longo ou tardio, pouca atividade no dia. Outras vezes está cansada demais, e o corpo fica agitado. Ajustar o horário de dormir pode ajudar nos dois casos.",
      "Medo do escuro é comum: uma luz fraca, um objeto de apego e ficar um pouco perto até ela dormir são estratégias aceitáveis. Evite usar o quarto ou a cama como castigo.",
    ],
    atencao:
      "Fale com o pediatra se a dificuldade para dormir é muito intensa, dura meses, ou vem com ronco, agitação nas pernas, ou mudanças de comportamento durante o dia.",
    fontes: [SBP_HIGIENE_SONO, SBP_TELAS],
  },
  {
    id: "cs-sono-seguro-lembrete",
    categoria: "choro-sono",
    titulo: "Lembrete: sono seguro do bebê",
    resumo: "As regras que protegem o bebê contra a morte súbita, em cada sono.",
    deMeses: 0,
    ateMeses: 12,
    simples: [
      "Sempre de barriga para cima, em todos os sonos.",
      "Berço só com colchão firme e lençol bem preso.",
      "Nada de travesseiro, protetor, cobertor solto ou bichinhos no berço.",
      "Berço no quarto dos pais, mas cada um no seu lugar.",
      "Nunca dormir com o bebê no sofá ou na poltrona.",
      "Casa e carro sem fumaça de cigarro.",
    ],
    aprofundado: [
      "A posição de barriga para cima diminuiu muito as mortes súbitas de bebês no mundo. Bebê saudável que dorme de barriga para cima não engasga mais com o próprio vômito: o corpo protege a via aérea.",
      "Dividir o quarto, com o bebê no próprio berço, protege. Dividir a cama aumenta o risco, principalmente com bebês pequenos, adultos muito cansados, que fumam, que beberam ou que usaram remédios que dão sono. Sofá e poltrona são os lugares mais perigosos.",
      "Amamentar protege contra a morte súbita. Não use cunhas, posicionadores ou elevar o colchão, a menos que o pediatra indique. Evite agasalhar demais: o bebê não deve suar.",
    ],
    atencao: "Se encontrar o bebê sem respirar, roxo ou mole: ligue 192 e siga as orientações do atendente.",
    fontes: [AAP_SONO, CADERNETA],
  },
];
