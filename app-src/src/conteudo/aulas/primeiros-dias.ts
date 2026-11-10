import type { Trilha } from "../trilhas";

// Trilha "Primeiros dias em casa": rascunho para revisão médica (pediatra e médico) antes de divulgar.
// Fontes conferidas em novembro de 2026. Afirmação por afirmação, com a fonte de cada uma e os
// pontos que dependem de decisão do pediatra: revisao/aulas-a.md.
// Febre: mesmo limite do fluxo de febre do app (SBP, Manejo da Febre Aguda, 2021).

export const PRIMEIROS_DIAS: Trilha = {
  id: "primeiros-dias",
  titulo: "Primeiros dias em casa",
  faixa: "do nascimento ao primeiro mês",
  deMeses: 0,
  ateMeses: 1,
  aulas: [
    {
      id: "pd1",
      titulo: "O umbigo: cuidar do coto até cair",
      gancho: "Medo de mexer no umbigo? Ele precisa de pouco: ficar limpo e seco.",
      pontos: [
        "O coto é o pedacinho do cordão que fica no umbigo. Ele seca, escurece e costuma cair até o fim da segunda semana de vida.",
        "Lave as mãos antes de mexer. Depois do banho, seque bem o coto e a pele em volta.",
        "Dobre a fralda abaixo do umbigo, para o coto ficar ao ar e longe do xixi.",
        "Álcool 70%: a Caderneta da Criança orienta passar só no coto, depois do banho, sem escorrer na pele. A Sociedade Brasileira de Pediatria considera que, para bebês nascidos em hospital, basta manter limpo e seco. Siga o que o pediatra do seu bebê orientar.",
        "Não coloque faixa, moeda, pomada, pó ou qualquer outra coisa sobre o coto. Isso pode causar infecção.",
      ],
      alerta: "Pele em volta do umbigo vermelha, ou secreção amarelada com pus e mau cheiro: leve o bebê para avaliação imediatamente. Se vier junto febre, bebê molinho ou mamando mal, vá ao pronto-socorro.",
    },
    {
      id: "pd2",
      titulo: "Icterícia: quando o amarelo preocupa",
      gancho: "Muitos bebês ficam amarelinhos na primeira semana. O que importa é quando começa, até onde vai e quanto dura.",
      pontos: [
        "A icterícia comum aparece depois do primeiro dia de vida, fica mais forte por volta do terceiro ao quinto dia e depois vai diminuindo.",
        "O amarelo começa no rosto e desce pelo corpo. Quanto mais para baixo ele chega (barriga, pernas, pés), mais alto tende a estar.",
        "Olhe o bebê com luz do dia, perto de uma janela, e repare também no branco dos olhos. Na pele negra e com pouca luz o amarelo é mais difícil de ver.",
        "Nem o olho do profissional é confiável para dizer quanto está alto. Na dúvida, peça para medir: com um aparelho na pele ou com exame de sangue.",
        "Mantenha as mamadas frequentes, inclusive de madrugada. Água e chá não ajudam.",
        "Banho de sol não trata icterícia. Quando precisa de tratamento, ele é a fototerapia, feita no hospital.",
      ],
      alerta: "Amarelo nas primeiras 24 horas de vida, amarelo forte que chega à barriga e às pernas, amarelo que dura mais de 2 semanas, bebê muito sonolento ou mamando mal, ou cocô claro (branco, cinza ou amarelo-pálido) com xixi escuro: atendimento com urgência, no mesmo dia.",
    },
    {
      id: "pd3",
      titulo: "Banho e pele do recém-nascido",
      gancho: "Dar o primeiro banho em casa assusta. Com água morna e mão firme, fica fácil.",
      pontos: [
        "O banho não precisa ser todo dia: pode ser diário ou duas a três vezes por semana, desde que você limpe bem as dobrinhas, o umbigo e a área da fralda.",
        "Use banheira ou bacia, num lugar sem vento. Teste a água com a mão antes de colocar o bebê: ela deve estar morna. Um banho curto, de 5 a 10 minutos, basta.",
        "Segure com firmeza: seu braço por trás das costas e a mão apoiando a cabeça. Nunca deixe o bebê sozinho na banheira ou na bacia, nem por um instante: pouca água já pode afogar.",
        "Sabonete: pouco, líquido e próprio para bebê. Seque com toalha macia, sem esfregar, principalmente as dobrinhas.",
        "Troque a fralda sempre que estiver molhada ou suja e limpe com água e algodão. Não use talco, perfume nem azeite na pele.",
      ],
      alerta: "Assadura com feridas, bolhas ou pus, ou vermelhidão que se espalha: procure o pediatra ou a UBS. Manchas roxas na pele com febre ou bebê molinho: pronto-socorro.",
    },
    {
      id: "pd4",
      titulo: "Choro e cólica",
      gancho: "Chorar é o jeito de o bebê falar. Nem todo choro é fome, e nem todo choro é cólica.",
      pontos: [
        "O bebê chora para pedir ajuda: fome, fralda suja, frio, calor, sono ou vontade de colo. Colo não vicia: bebê que se sente seguro chora menos.",
        "Cólica é quando um bebê saudável, que mama e ganha peso bem, tem crises de choro forte e difícil de acalmar. Costuma melhorar por volta dos 3 a 4 meses e quase sempre passa antes dos 5 meses.",
        "Para acalmar: colo, peito, contato pele com pele, embalar devagar, pouca luz e pouco barulho. Tente uma coisa de cada vez.",
        "Não dê remédio para gases, chá, água ou outro leite por conta própria, e não pare de amamentar por causa da cólica.",
        "Se você estiver no limite, deite o bebê no berço, de barriga para cima, saia do quarto por alguns minutos e peça ajuda. Nunca sacuda o bebê: sacudir pode causar lesão grave no cérebro.",
      ],
      alerta: "Choro diferente do normal (fraco, gemido ou agudo que não para), choro com febre, bebê que não consegue mamar, que vomita tudo ou com sangue no cocô: atendimento no mesmo dia. Bebê com menos de 3 meses e febre: pronto-socorro.",
    },
    {
      id: "pd5",
      titulo: "Cocô e xixi nos primeiros dias",
      gancho: "A fralda conta muito sobre como o bebê está. Saber o que é normal evita sustos.",
      pontos: [
        "O primeiro cocô é o mecônio: verde-escuro, quase preto e grudento. Costuma sair nas primeiras 24 a 36 horas e aparece até o terceiro ou quarto dia.",
        "Depois vem um cocô amarelo-esverdeado e mole, e no fim da primeira semana ele fica amarelo (compare com a escala de cores da Caderneta da Criança). Cocô mole ou quase líquido não é diarreia se o bebê está bem.",
        "O número de cocôs varia muito: pode ser a cada mamada ou, no bebê que só mama no peito, até dois ou três dias sem fazer, se o cocô sai mole e ele mama e molha bem as fraldas. Cocô raro, pouco e duro, junto com poucas fraldas molhadas, pode ser sinal de pouco leite.",
        "Fazer força e ficar vermelho antes de sair um cocô mole é comum. Não use supositório, chá ou laxante por conta própria.",
        "O primeiro xixi costuma sair nas primeiras 24 horas. A partir do quinto dia, espere seis ou mais fraldas bem molhadas por dia, com xixi claro.",
        "Mancha rosada ou alaranjada na fralda nos primeiros dias costuma ser cristal da urina e não faz mal. Se vier junto com poucas fraldas molhadas, avise o pediatra.",
      ],
      alerta: "Cocô muito claro (branco, cinza ou amarelo-pálido) que não escurece, ou xixi escuro: atendimento com urgência. Sangue no cocô, poucas fraldas molhadas ou vômitos repetidos: atendimento no mesmo dia.",
    },
    {
      id: "pd6",
      titulo: "Os testes: pezinho, orelhinha, olhinho, coraçãozinho e linguinha",
      gancho: "São testes rápidos, gratuitos e um direito do bebê. Feitos cedo, mudam a vida de quem tem alguma dessas doenças.",
      pontos: [
        "Pezinho: algumas gotinhas de sangue do calcanhar, de preferência entre o 3º e o 5º dia de vida, na maternidade ou na UBS. Encontra doenças que não dão sinal no começo, mas têm tratamento.",
        "Coraçãozinho: um sensor de luz na mão direita e num dos pés mede o oxigênio do sangue, na maternidade, entre 24 e 48 horas de vida. Ajuda a achar doenças graves do coração.",
        "Orelhinha: um aparelho no ouvido testa a audição, sem dor. De preferência ainda na maternidade e, no máximo, até 1 mês de vida.",
        "Olhinho: uma luz nos olhos procura catarata e outros problemas que atrapalham a visão. É feito antes da alta.",
        "Linguinha: avalia o freio da língua antes da alta (é lei desde 2014). Freio curto só precisa de corte quando atrapalha de verdade a amamentação, depois de avaliar a mamada. Na maioria das vezes, a dificuldade melhora corrigindo a pega.",
        "Confira se os resultados foram anotados na Caderneta da Criança.",
      ],
      alerta: "Algum teste não foi feito, ou chamaram para repetir: procure a UBS o quanto antes, sem esperar a próxima consulta. Alguns resultados precisam de tratamento logo nas primeiras semanas.",
    },
    {
      id: "pd7",
      titulo: "Primeiras consultas e vacinas",
      gancho: "O bebê parece bem? Mesmo assim ele precisa ir à consulta: é ali que se vê como está crescendo.",
      pontos: [
        "A primeira consulta é entre o 3º e o 5º dia de vida, na UBS ou em casa, com médico ou enfermeiro. Avalia o bebê, a mãe e a amamentação.",
        "Depois, consultas com 1, 2, 4, 6, 9 e 12 meses, mesmo sem doença. Leve sempre a Caderneta da Criança.",
        "Ao nascer, o bebê recebe duas vacinas: BCG e hepatite B, de preferência ainda na maternidade. Confira na Caderneta se as duas foram aplicadas.",
        "As próximas vacinas são aos 2 meses, de graça na UBS. Amamentar durante a vacina acalma o bebê.",
        "Suplementos, como vitamina D e ferro: o pediatra indica a suplementação, quando começar e como dar.",
        "Anote suas dúvidas e conte na consulta como estão as mamadas, o sono e as fraldas.",
      ],
      alerta: "Bebê que não teve a consulta da primeira semana, que não recebeu BCG ou hepatite B, ou que não voltou ao peso de nascimento por volta das 2 semanas: procure a UBS nesta semana.",
    },
    {
      id: "pd8",
      titulo: "Febre no recém-nascido é sempre urgência",
      gancho: "Num bebê pequeno, febre nunca é para esperar passar em casa.",
      pontos: [
        "No recém-nascido, a febre pode ser o único sinal de uma infecção grave, mesmo que ele pareça bem.",
        "Meça com termômetro digital na axila. Febre é temperatura acima de 37,3 °C. Se o bebê estava muito agasalhado, tire o excesso de roupa e meça de novo depois de 15 minutos.",
        "Temperatura baixa também é sinal de alerta: com infecção, o recém-nascido pode ficar frio em vez de ter febre. Abaixo de 36,5 °C mesmo agasalhado, procure atendimento no mesmo dia.",
        "Não dê nenhum remédio por conta própria. Vá direto ao pronto-socorro e siga a orientação do médico que avaliar.",
        "Outros sinais de perigo nos primeiros 2 meses: muito molinho, difícil de acordar, não consegue mamar, respira rápido ou com esforço, convulsão, manchas roxas na pele.",
      ],
      alerta: "Bebê com menos de 3 meses com febre (acima de 37,3 °C na axila), com temperatura de 35,5 °C ou menos, ou com qualquer sinal de perigo: pronto-socorro agora, levando a Caderneta. Se não respira, não acorda ou está roxo: ligue 192.",
    },
  ],
  fontes: [
    "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania, 6ª edição. 2023.",
    "Ministério da Saúde. Atenção à Saúde do Recém-Nascido: guia para os profissionais de saúde, vol. 1, Cuidados gerais, 2ª edição. 2014.",
    "Sociedade Brasileira de Pediatria. Atualização sobre os Cuidados com a Pele do Recém-Nascido. Documento científico nº 11, 2021.",
    "Sociedade Brasileira de Pediatria. Hiperbilirrubinemia indireta no período neonatal. Manual de orientação nº 10, 2021.",
    "Sociedade Brasileira de Pediatria. Distúrbios gastrointestinais funcionais no lactente e na criança abaixo de 4 anos: um guia para a prática diária. 2022.",
    "Sociedade Brasileira de Pediatria. Pediatria para Famílias: Cólica do lactente. 2023.",
    "Sociedade Brasileira de Pediatria. Anquiloglossia: como proceder. Guia prático de atualização nº 85, 2023.",
    "Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021.",
    "Lei nº 13.002, de 20 de junho de 2014 (avaliação do frênulo da língua antes da alta).",
    "Calendário Nacional de Vacinação 2026, Ministério da Saúde.",
    "American Academy of Pediatrics. Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant 35 or More Weeks of Gestation. Pediatrics, 2022.",
  ],
};
