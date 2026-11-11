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
    },
  ],
  fontes: [
    "Ministério da Saúde. Caderno de Atenção Básica nº 23: aleitamento materno e alimentação complementar. 2015.",
    "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019.",
    "Rede Brasileira de Bancos de Leite Humano.",
    "Consolidação das Leis do Trabalho, art. 396.",
  ],
};

