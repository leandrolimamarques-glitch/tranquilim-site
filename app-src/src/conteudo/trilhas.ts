// Trilha de amamentação: texto das aulas (os vídeos entram depois).
// Os vídeos entram quando a gravação for editada.
// Fontes: Ministério da Saúde, Caderno de Atenção Básica nº 23 (2015) e Guia Alimentar
// para Crianças Brasileiras Menores de 2 Anos (2019); Rede Brasileira de Bancos de
// Leite Humano; CLT, art. 396.

export type Aula = {
  id: string;
  titulo: string;
  gancho: string;
  pontos: string[];
  alerta: string;
  /** Versão ultra simples (o que aparece primeiro): frases curtas, palavras do dia a dia. */
  simples?: string[];
  /** "Entender melhor": um pouco mais técnico, ainda em linguagem simples. Parágrafos. */
  aprofundado?: string[];
};

export type Trilha = {
  id: string;
  titulo: string;
  faixa: string;
  /** Idade em meses a partir da qual a trilha aparece no início (pode ser negativa na gestação). */
  deMeses: number;
  ateMeses: number;
  aulas: Aula[];
  fontes: string[];
};

export const AMAMENTACAO: Trilha = {
  id: "amamentacao",
  titulo: "Amamentação sem sofrimento",
  faixa: "do nascimento aos 6 meses",
  deMeses: 0,
  ateMeses: 6,
  aulas: [
    {
      id: "a1",
      titulo: "Os primeiros dias: colostro e a descida do leite",
      gancho: "Pouco leite nos primeiros dias? É exatamente o esperado.",
      pontos: [
        "Nos primeiros dias sai o colostro: pouco, amarelado e mais grosso. É a quantidade certa para o recém-nascido e protege contra infecções.",
        "Entre o segundo e o quinto dia o leite \"desce\": as mamas ficam mais cheias, pesadas e quentes.",
        "Ofereça o peito logo depois do parto e sempre que o bebê quiser. Quanto mais ele mama, mais leite vem.",
        "Até os 6 meses, só leite materno: sem água, chá ou outro leite, a não ser que o médico indique.",
      ],
      alerta: "Bebê muito sonolento que não acorda para mamar, ou mamas tão duras que ele não consegue pegar: UBS ou pediatra no mesmo dia.",
      simples: [
        "Nos primeiros dias sai pouco leite. É normal e é o suficiente.",
        "Esse primeiro leite, amarelado, protege o bebê contra doenças.",
        "Dê o peito sempre que o bebê quiser, de dia e de noite.",
        "Quanto mais ele mama, mais leite o seu corpo faz.",
        "Não dê água, chá nem outro leite sem o médico mandar.",
        "Bebê que não acorda para mamar: procure a UBS ou o pediatra hoje.",
      ],
      aprofundado: [
        "O colostro (o primeiro leite) sai em pouca quantidade porque o estômago do recém-nascido é muito pequeno. Ele é rico em anticorpos (defesas que passam da mãe para o bebê) e funciona como uma primeira proteção contra infecções. Por isso o Ministério da Saúde recomenda colocar o bebê no peito já na primeira hora de vida.",
        "A produção de leite funciona por demanda: cada vez que o bebê suga, o corpo da mãe recebe o sinal para produzir mais. Entre o segundo e o quinto dia acontece a \"descida\" do leite, quando as mamas ficam cheias e quentes. Mamadas frequentes nessa fase ajudam a evitar que a mama fique empedrada.",
        "Um erro comum é achar que o leite é fraco ou pouco e oferecer água, chá ou fórmula \"para completar\". Isso enche a barriga do bebê, ele mama menos e o peito passa a produzir menos. O Ministério da Saúde e a Sociedade Brasileira de Pediatria recomendam só leite materno até os 6 meses; outro leite, só com indicação do profissional de saúde.",
      ],
    },
    {
      id: "a2",
      titulo: "Posições para mamar",
      gancho: "Não existe posição certa. Existe a que funciona para vocês dois.",
      pontos: [
        "Em todas: bebê de frente para a mãe, barriga com barriga; cabeça e corpo em linha reta; bem apoiado; nariz na altura do mamilo.",
        "A mãe também precisa de conforto: costas apoiadas, pés no chão, almofada se ajudar.",
        "Tradicional (bebê deitado no braço), invertida (por baixo do braço, boa depois de cesárea e para gêmeos), deitada de lado (boa à noite) e cavalinho (sentado de frente).",
        "Se todas as posições doem, o problema quase sempre é a pega.",
      ],
      alerta: "Dor que não melhora mudando a posição: procure ajuda na UBS ou num banco de leite.",
      simples: [
        "Escolha a posição que fica boa para você e para o bebê.",
        "Barriga do bebê encostada na sua barriga.",
        "Cabeça e corpo do bebê retinhos, sem torcer o pescoço.",
        "Sente com as costas apoiadas. Use almofada se ajudar.",
        "Se dói em todas as posições, peça ajuda para ver a pega.",
      ],
      aprofundado: [
        "Não existe uma posição única correta. O que importa são alguns pontos que valem para todas: o corpo do bebê bem junto ao da mãe, de frente para ela, com a cabeça e o corpo alinhados (sem o pescoço virado) e o nariz na altura do mamilo. Assim ele não precisa puxar o peito nem torcer o pescoço para engolir.",
        "A posição invertida, com o bebê por baixo do braço, poupa a barriga depois da cesárea e facilita amamentar gêmeos. Deitada de lado é prática à noite; quando o bebê terminar e você sentir sono, coloque-o de volta no berço dele, de barriga para cima.",
        "Dor que aparece em qualquer posição quase sempre indica problema na pega (o jeito como a boca do bebê abocanha o peito). Só trocar de posição não resolve: vale pedir a um profissional da UBS ou do banco de leite que observe uma mamada.",
      ],
    },
    {
      id: "a3",
      titulo: "A pega certa",
      gancho: "Amamentar não deveria doer a mamada inteira. Quase sempre, é a pega.",
      pontos: [
        "Encoste o mamilo no nariz ou no lábio de cima do bebê e espere ele abrir bem a boca, como num bocejo.",
        "Traga o bebê até o peito, e não o peito até o bebê.",
        "Pega certa: boca bem aberta, lábio de baixo virado para fora, queixo encostado no peito, mais aréola aparecendo em cima da boca do que embaixo.",
        "Durante a mamada: bochechas redondas, sugadas lentas e fundas com pausas, e dá para ouvir engolir.",
        "Para tirar do peito sem machucar, coloque o dedo mínimo no canto da boca dele.",
        "Desconforto no começo pode acontecer. Dor a mamada toda não é normal: tire e refaça a pega.",
      ],
      alerta: "Mamilo machucado, sangrando, ou dor forte em toda mamada: procure ajuda para corrigir a pega (UBS, banco de leite, pediatra).",
      simples: [
        "Espere o bebê abrir bem a boca, como num bocejo.",
        "Traga o bebê até o peito, não o peito até ele.",
        "A boca pega o bico e boa parte da parte escura do peito.",
        "Lábio de baixo virado para fora e queixo encostado no peito.",
        "Doeu a mamada toda? Tire com o dedinho no canto da boca e tente de novo.",
        "Bico machucado ou sangrando: peça ajuda na UBS ou no banco de leite.",
      ],
      aprofundado: [
        "Na pega correta o bebê abocanha não só o mamilo (o bico), mas boa parte da aréola (a parte escura em volta). Assim a língua massageia a mama e tira o leite sem apertar o bico. Quando ele pega só a ponta, o bico fica espremido, machuca e sai menos leite.",
        "Sinais de boa pega: boca bem aberta, lábio de baixo virado para fora, queixo tocando o peito e mais aréola aparecendo acima da boca do que abaixo. Durante a mamada, as bochechas ficam redondas (não afundam), as sugadas são lentas e fundas, com pausas, e dá para ouvir o bebê engolir.",
        "Algum desconforto no começo da mamada pode acontecer nos primeiros dias. Dor durante a mamada inteira não é normal e não é para aguentar. Para refazer a pega sem machucar, coloque o dedo mínimo no canto da boca do bebê para soltar a sucção antes de afastá-lo.",
        "A pega errada é a principal causa de fissura (rachadura no bico) e pode fazer o bebê ganhar pouco peso, porque ele não consegue tirar o leite direito. A UBS e os bancos de leite ajudam a corrigir, de graça.",
      ],
    },
    {
      id: "a4",
      titulo: "Quantas vezes por dia? Livre demanda",
      gancho: "Não precisa de relógio. O bebê avisa quando tem fome.",
      pontos: [
        "Sinais de fome: leva a mão à boca, vira a cabeça procurando, faz movimentos de sugar. O choro é o último sinal.",
        "Nos primeiros meses é comum mamar de 8 a 12 vezes em 24 horas, inclusive de madrugada.",
        "Deixe esvaziar bem um peito antes de oferecer o outro: o leite do fim da mamada sustenta mais.",
        "Na mamada seguinte, comece pelo peito em que ele terminou.",
      ],
      alerta: "Recém-nascido que mama menos de 8 vezes por dia e vive sonolento: fale com o pediatra no mesmo dia.",
      simples: [
        "Não precisa de horário certo. Dê o peito quando o bebê pedir.",
        "Mão na boca e cabeça procurando o peito são sinais de fome.",
        "Não espere o choro: chorar é o último sinal de fome.",
        "É normal mamar muitas vezes por dia, e também de madrugada.",
        "Deixe ele terminar um peito antes de oferecer o outro.",
      ],
      aprofundado: [
        "Livre demanda quer dizer oferecer o peito sempre que o bebê mostrar fome, sem horário marcado e sem limitar o tempo da mamada. O Ministério da Saúde recomenda esse jeito porque cada bebê tem seu ritmo, e a mama produz mais quando é esvaziada com frequência.",
        "Nos primeiros meses é comum o bebê mamar de 8 a 12 vezes em 24 horas. As mamadas da madrugada fazem parte e ajudam a manter a produção de leite.",
        "O leite muda durante a mamada: o do começo tem mais água e mata a sede; o do fim tem mais gordura, sustenta mais e ajuda no ganho de peso. Por isso é melhor deixar o bebê esvaziar bem um peito antes de trocar, e começar a mamada seguinte pelo peito em que ele terminou.",
        "Um erro comum é achar que bebê que mama muitas vezes está passando fome ou que o leite é fraco. Mamar com frequência é normal. O que mostra se ele está bem alimentado são as fraldas molhadas e o ganho de peso. Recém-nascido que mama pouco e dorme demais precisa ser avaliado no mesmo dia.",
      ],
    },
    {
      id: "a5",
      titulo: "Ele está mamando o suficiente?",
      gancho: "A pergunta que toda mãe faz. E dá para responder olhando a fralda.",
      pontos: [
        "A partir do quinto dia: seis ou mais fraldas bem molhadas por dia, com xixi claro.",
        "O cocô fica amarelado no fim da primeira semana.",
        "É normal perder um pouco de peso nos primeiros dias. O bebê recupera o peso do nascimento por volta de 10 a 14 dias.",
        "Anote mamadas e fraldas no diário do app e leve à consulta.",
      ],
      alerta: "Poucas fraldas molhadas, xixi escuro, bebê muito amarelo ou muito sonolento, ou que não recuperou o peso: pediatra ou UBS no mesmo dia.",
      simples: [
        "Olhe a fralda: ela mostra se o bebê está mamando bem.",
        "Depois dos primeiros dias, ele molha muitas fraldas por dia, com xixi clarinho.",
        "No fim da primeira semana, o cocô fica amarelo.",
        "Perder um pouco de peso nos primeiros dias é normal.",
        "Xixi escuro, poucas fraldas ou bebê muito amarelo: vá à UBS hoje.",
      ],
      aprofundado: [
        "Não dá para ver quanto leite sai do peito, mas dá para ver o que sai do bebê. A partir do quinto dia, seis ou mais fraldas bem molhadas por dia, com xixi claro, indicam que ele está recebendo leite suficiente. Xixi escuro e poucas fraldas podem ser sinal de pouco leite.",
        "Nos primeiros dias o bebê perde um pouco de peso, porque elimina líquidos e o mecônio (o primeiro cocô, escuro). O esperado é que ele volte ao peso do nascimento por volta de 10 a 14 dias de vida. Por isso a pesagem nas primeiras consultas é tão importante.",
        "Choro, mamadas frequentes ou mama mais mole depois das primeiras semanas não querem dizer que o leite é pouco. Antes de oferecer outro leite, procure a UBS ou o pediatra para avaliar a mamada e o peso. Anotar mamadas e fraldas ajuda o profissional a entender o que está acontecendo.",
      ],
    },
    {
      id: "a6",
      titulo: "Dor, fissura e mama empedrada",
      gancho: "Machucou? Dá para continuar amamentando e sarar ao mesmo tempo.",
      pontos: [
        "A fissura quase sempre vem da pega. Corrigir a pega é o principal tratamento.",
        "Comece a mamada pelo peito que dói menos.",
        "Depois de mamar, passe umas gotas do próprio leite no mamilo e deixe secar ao ar. Sem sabonete, álcool ou pomada por conta própria.",
        "Mama empedrada: ofereça o peito com frequência; massageie e tire um pouco de leite antes da mamada para amolecer a aréola.",
      ],
      alerta: "Mama vermelha, quente e dolorida com febre ou mal-estar pode ser mastite: atendimento no mesmo dia. Não pare de amamentar sem orientação.",
      simples: [
        "Bico machucado quase sempre é pega errada. Corrigir a pega ajuda a sarar.",
        "Comece a mamada pelo peito que dói menos.",
        "Depois de mamar, passe um pouco do seu leite no bico e deixe secar.",
        "Não use sabonete, álcool ou pomada no bico sem orientação.",
        "Peito duro e cheio: dê o peito mais vezes e faça massagem.",
        "Peito vermelho e quente com febre: atendimento hoje. Não pare de amamentar.",
      ],
      aprofundado: [
        "A fissura (rachadura ou ferida no bico) aparece quando a boca do bebê aperta o mamilo, quase sempre por pega errada. Pomada por conta própria não resolve a causa; corrigir a pega, sim. O próprio leite passado no mamilo depois da mamada ajuda a cicatrizar, e deixar o bico secar ao ar evita que a pele fique úmida e machuque mais.",
        "Mama empedrada (ingurgitamento) é quando o leite se acumula e a mama fica dura, inchada e dolorida. É mais comum quando o leite desce ou quando as mamadas ficam espaçadas. O tratamento é tirar o leite: mamadas frequentes, massagem e ordenha de um pouco de leite antes da mamada, para amolecer a aréola e o bebê conseguir pegar.",
        "Mastite é a inflamação da mama, às vezes com infecção. Aparece uma área vermelha, quente e dolorida, com febre ou mal-estar parecido com gripe. Precisa de avaliação no mesmo dia. O Ministério da Saúde orienta manter a amamentação ou a retirada do leite, porque esvaziar a mama faz parte do tratamento.",
      ],
    },
    {
      id: "a7",
      titulo: "Tirar e guardar o leite",
      gancho: "Leite guardado do jeito certo é leite seguro.",
      pontos: [
        "Frasco de vidro com tampa de plástico, fervido por 15 minutos. Anote data e hora.",
        "Lave as mãos, prenda o cabelo e massageie a mama em movimentos circulares.",
        "Ordenha com a mão: polegar acima e indicador abaixo da aréola, aperte em direção ao corpo e depois para a frente, num ritmo. Despreze os primeiros jatos.",
        "Na geladeira, até 12 horas. No congelador ou freezer, até 15 dias.",
        "Descongele na geladeira ou em banho-maria com o fogo desligado. Nunca no micro-ondas e nunca ferva.",
        "Ofereça no copinho. O que sobrar, jogue fora.",
      ],
      alerta: "Leite com cheiro ou aspecto estranho: na dúvida, descarte. O banco de leite da região orienta de graça.",
      simples: [
        "Lave bem as mãos antes de tirar o leite.",
        "Guarde em vidro com tampa de plástico, fervido antes. Escreva a data.",
        "Na geladeira, use em até 12 horas. No congelador, em até 15 dias.",
        "Descongele na geladeira ou em água quente com o fogo desligado.",
        "Nunca ferva e nunca use micro-ondas.",
        "Dê no copinho. O que sobrar, jogue fora.",
      ],
      aprofundado: [
        "A ordenha com a mão é simples e não precisa de bombinha: com o polegar acima e o indicador abaixo da aréola, aperte em direção ao corpo e depois para a frente, num ritmo, mudando a posição dos dedos em volta da aréola. Os primeiros jatos são desprezados para diminuir a contaminação.",
        "O vidro com tampa de plástico, fervido por 15 minutos, é o recipiente orientado pela Rede Brasileira de Bancos de Leite Humano porque é fácil de limpar e de ferver. Não encha até a boca: deixe um espaço livre perto da tampa, porque o leite aumenta de volume ao congelar.",
        "O leite não pode ser fervido nem aquecido no micro-ondas: o calor forte destrói parte das defesas do leite, e o micro-ondas aquece de forma desigual e pode queimar a boca do bebê. Leite descongelado não volta para o congelador.",
        "O copinho é recomendado no lugar da mamadeira porque não atrapalha o jeito de sugar o peito. O leite que sobrou no copinho teve contato com a saliva do bebê e não deve ser guardado de novo.",
      ],
    },
    {
      id: "a8",
      titulo: "Voltar ao trabalho sem desmamar",
      gancho: "Voltar ao trabalho não precisa ser o fim da amamentação.",
      pontos: [
        "Comece a tirar e congelar leite duas a três semanas antes de voltar.",
        "Ensine quem vai cuidar do bebê a oferecer o leite no copinho.",
        "Amamente antes de sair e assim que chegar; à noite e nos fins de semana, no peito.",
        "A lei garante dois descansos de meia hora por dia para amamentar até o bebê fazer 6 meses (CLT, art. 396).",
        "O recomendado é só leite materno até 6 meses e amamentar até 2 anos ou mais, junto com a comida.",
      ],
      alerta: "Bebê que recusa o copinho e passa muitas horas sem se alimentar: converse com o pediatra.",
      simples: [
        "Comece a tirar e guardar leite algumas semanas antes de voltar.",
        "Ensine quem cuida do bebê a dar o leite no copinho.",
        "Dê o peito antes de sair e assim que chegar em casa.",
        "À noite e nos fins de semana, continue no peito.",
        "A lei garante pausas no trabalho para amamentar até o bebê fazer 6 meses.",
      ],
      aprofundado: [
        "Começar a ordenha duas a três semanas antes da volta permite formar um estoque no congelador e acostuma o corpo a produzir também com a ordenha. No trabalho, tirar o leite nos horários em que o bebê mamaria ajuda a manter a produção e evita que a mama fique cheia e dolorida.",
        "A CLT, no artigo 396, garante à mãe dois descansos especiais de meia hora cada um, durante a jornada, para amamentar o filho até ele completar 6 meses. Esse prazo pode ser estendido quando a saúde do filho exigir, e os horários são combinados com o empregador.",
        "O copinho é preferido no lugar da mamadeira porque o bebê não confunde o jeito de sugar e continua mamando bem no peito. O Ministério da Saúde recomenda só leite materno até os 6 meses e amamentar até os 2 anos ou mais, junto com a comida da família.",
      ],
    },
  ],
  fontes: [
    "Ministério da Saúde. Caderno de Atenção Básica nº 23: aleitamento materno e alimentação complementar. 2015.",
    "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019.",
    "Rede Brasileira de Bancos de Leite Humano.",
    "Consolidação das Leis do Trabalho, art. 396.",
  ],
};

