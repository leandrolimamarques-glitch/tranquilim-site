import type { Trilha } from "../trilhas";

// Trilha: Rotina, birras e telas. Rascunho para revisão médica antes de divulgar.
// Limites: Lei 13.010/2014 (Lei Menino Bernardo, art. 18-A do ECA), Lei 14.826/2024, Caderneta da Criança
// (MS, 2023) e AAP, Effective Discipline (2018). Sono: SBP, Documento Científico nº 5 (2021).
// Desfralde: SBP e SBU, Treinamento esfincteriano (2019). Telas: SBP nº 163 (2024).
// Dentes: Caderneta da Criança e SBP, GT Saúde Oral (2026). Alimentação: Guia Alimentar < 2 anos (MS, 2019).
// Detalhe de cada afirmação e respectiva fonte: revisao/aulas-b.md.

export const ROTINA_TELAS: Trilha = {
  id: "rotina-telas",
  titulo: "Rotina, birras e telas",
  faixa: "de 1 a 6 anos",
  deMeses: 12,
  ateMeses: 72,
  aulas: [
    {
      id: "rt1",
      titulo: "Birras: por que acontecem e como atravessar",
      gancho: "Ela se jogou no chão do mercado e todo mundo olhou? Birra faz parte do desenvolvimento.",
      pontos: [
        "A partir de 1 ano e meio, a criança quer fazer tudo sozinha, mas ainda não sabe lidar com o “não”, com a fome, o sono ou a frustração. Gritar, chorar e se jogar no chão são comuns nessa fase e nas seguintes.",
        "Previna o que dá para prevenir: horários certos de comer e dormir, avisar antes de mudar de atividade (“mais uma volta e vamos embora”) e oferecer escolhas pequenas (“camiseta azul ou vermelha?”).",
        "Na hora da crise: fique calmo, garanta que ela não se machuque e não ceda ao que provocou a birra. Não grite, não bata, não ameace.",
        "Quando ela se acalmar, acolha e elogie: “você conseguiu se acalmar”. Pedidos feitos sem grito, atenda quando for possível.",
        "Combine a mesma resposta com todos os adultos da casa: regra que muda conforme quem está cuidando deixa a criança confusa.",
      ],
      alerta: "Birras muito frequentes ou longas, em que ela se machuca ou machuca os outros, agressividade e desafio constantes, ou birra junto com atraso na fala: converse com o pediatra. Se você sente que vai perder o controle, isso também é motivo para pedir ajuda.",
    },
    {
      id: "rt2",
      titulo: "Limites sem violência: o que funciona",
      gancho: "“Uma palmadinha não faz mal”? Faz, e também não funciona.",
      pontos: [
        "Desde 2014, a Lei Menino Bernardo garante à criança o direito de ser educada sem castigo físico e sem tratamento cruel ou degradante: nada que machuque, humilhe, ameace gravemente ou ridicularize. Em 2024, a Lei 14.826 tornou a parentalidade positiva e o direito ao brincar políticas de prevenção da violência.",
        "Bater, gritar e envergonhar até param o comportamento na hora, mas não ensinam e, com o tempo, pioram o comportamento, o aprendizado e a saúde emocional da criança.",
        "Limite claro e curto: diga o que ela pode fazer, não só o que não pode (“a bola é para chutar no quintal”). Guarde o “não” firme, sem agressividade, para o que é perigoso.",
        "Elogie logo e com detalhe o que ela faz certo (“você guardou os carrinhos!”). Atenção para o bom comportamento faz com que ele se repita.",
        "Consequência ligada ao fato e na hora: jogou o brinquedo, o brinquedo fica guardado um tempo. Uma pausa curta para se acalmar, perto de você, também ajuda.",
        "Seu exemplo ensina mais que o sermão: a criança imita o tom de voz e as atitudes dos adultos.",
      ],
      alerta: "Se a casa vive em gritos, se alguém bate na criança ou se você tem medo de perder o controle, peça ajuda: pediatra, UBS ou CRAS. Suspeita de violência contra criança pode ser denunciada no Disque 100, de forma gratuita e anônima, ou ao Conselho Tutelar.",
    },
    {
      id: "rt3",
      titulo: "Sono da criança pequena: rotina que ajuda a dormir",
      gancho: "Hora de dormir virou batalha? Uma rotina curta, repetida todo dia, costuma resolver mais que qualquer truque.",
      pontos: [
        "Quanto dorme, somando a noite e as sonecas: de 1 a 2 anos, de 11 a 14 horas; de 3 a 5 anos, de 10 a 13 horas.",
        "Horário regular para dormir e acordar, inclusive no fim de semana.",
        "Ritual curto, de até 30 minutos, sempre na mesma ordem e gostoso: banho, pijama, escovar os dentes, uma história, luz apagada.",
        "Quarto escuro, silencioso e com temperatura agradável. O bichinho ou paninho preferido ajuda a se sentir segura na própria cama.",
        "Telas desligadas pelo menos 1 hora antes de dormir (o ideal é de 1 a 2 horas) e nada de chocolate, café ou refrigerante à noite.",
        "A soneca do dia diminui depois dos 2 anos e costuma sumir até os 5. Todos os adultos da casa devem seguir o mesmo combinado.",
      ],
      alerta: "Ronco frequente, pausas na respiração ou respiração pela boca durante o sono, ou muito sono e cansaço durante o dia: converse com o pediatra e, se puder, leve um vídeo dela dormindo. Despertares toda noite que deixam a família exausta também merecem consulta.",
    },
    {
      id: "rt4",
      titulo: "Desfralde: sinais de que ela está pronta",
      gancho: "Todo mundo pergunta quando vai tirar a fralda. A resposta está nos sinais da criança, não no calendário.",
      pontos: [
        "No Brasil, o desfralde começa em média por volta de 1 ano e 10 meses e termina perto dos 2 anos e 4 meses, e o processo leva de 6 a 12 meses. Variar disso é normal.",
        "Sinais de prontidão: fica seca por 2 horas ou mais, avisa (com palavra ou gesto) que fez ou vai fazer, se incomoda com a fralda suja, se interessa pelo banheiro dos adultos, sabe baixar e subir a roupa, entende pedidos simples e consegue ficar sentada alguns minutos.",
        "Por volta dos 2 anos, peça ao pediatra para avaliar esses sinais com você.",
        "Escolha um período tranquilo: não comece logo depois de mudança de casa ou da chegada de um irmão. Dias quentes facilitam.",
        "Se ela vai à creche, combine com a escola para começar ao mesmo tempo e do mesmo jeito nos dois lugares.",
        "Prisão de ventre atrapalha: se o cocô é duro ou dói para sair, trate antes de começar.",
      ],
      alerta: "Com 3 anos ou mais sem nenhum sinal de prontidão, 4 anos sem controle durante o dia, dor para fazer xixi ou cocô, sangue nas fezes, ou se voltou a escapar depois de meses sem fralda: converse com o pediatra.",
    },
    {
      id: "rt5",
      titulo: "Desfralde na prática: penico, elogio e paciência",
      gancho: "Escapes vão acontecer. Bronca atrasa, paciência acelera.",
      pontos: [
        "Apresente o penico antes: deixe escolher, sentar de roupa, brincar perto. Muitas crianças se sentem mais seguras no penico do que no vaso. No vaso, use redutor de assento e um banquinho para apoiar os pés.",
        "Crie horários: ao acordar, depois das refeições e antes de dormir. Sentada por 3 a 5 minutos, não mais que isso, e nunca à força.",
        "Elogie cada tentativa, mesmo quando escapou. Sem doce nem prêmio, sem castigo e sem comentário de nojo sobre o xixi e o cocô.",
        "Depois de uma semana ou mais usando o penico, troque a fralda do dia por calcinha ou cueca, e não volte para a fralda durante o dia.",
        "Meninos podem começar fazendo xixi sentados. Meninas aprendem a se limpar da frente para trás.",
        "Ela recusou ou virou briga? Pare por 1 a 3 meses e tente de novo.",
      ],
      alerta: "Segura o cocô, se esconde para fazer na fralda e fica com o intestino preso, ou o desfralde virou uma batalha diária: converse com o pediatra.",
    },
    {
      id: "rt6",
      titulo: "Telas em casa: regras que funcionam",
      gancho: "Tirar a tela vira choro? As regras ficam mais fáceis quando valem para a família toda.",
      pontos: [
        "Até 2 anos, sem telas (só chamada de vídeo com a família, com um adulto junto). De 2 a 5 anos, no máximo 1 hora por dia, com um adulto por perto.",
        "Nada de tela nas refeições nem de 1 a 2 horas antes de dormir. TV, tablet e celular fora do quarto da criança.",
        "Tela não é babá nem calmante: ofereça alternativas antes que ela peça, como brincar ao ar livre, desenhar ou ajudar numa tarefa.",
        "Quando usar, assista junto, escolha conteúdo para a idade e combine antes quando acaba (“depois deste episódio, desligamos”).",
        "Antes dos 12 anos, nada de celular próprio. E não publique fotos dos seus filhos em redes sociais abertas.",
        "O exemplo vale mais que a regra: deixe o celular de lado nas refeições e nas brincadeiras.",
      ],
      alerta: "Fica muito agressiva ou desesperada quando a tela acaba, só come ou dorme com tela, ou está atrasada na fala ou no convívio com outras crianças: converse com o pediatra.",
    },
    {
      id: "rt7",
      titulo: "Dentes: escovação e a primeira consulta no dentista",
      gancho: "Dente de leite vai cair, mas cuidar dele agora evita dor e cárie.",
      pontos: [
        "Desde o primeiro dente, escove pelo menos duas vezes por dia, sempre antes de dormir, com escova pequena e de cerdas macias.",
        "Use creme dental com flúor (pelo menos 1.000 ppm, escrito no tubo): até 3 anos e 11 meses, a quantidade de um grão de arroz; a partir dos 4 anos, a de um grão de ervilha. Ensine a cuspir a espuma.",
        "Quem escova é o adulto. Até os 5 anos, o adulto faz a escovação; depois, a criança tenta e o adulto completa e confere, até ela aprender, por volta dos 8 anos.",
        "Fio dental quando os dentes encostarem um no outro.",
        "Mamadeira à noite sem limpar a boca depois é a causa mais comum da cárie que destrói vários dentes de uma vez. Nada de açúcar ou achocolatado na mamadeira, e nenhum açúcar antes dos 2 anos.",
        "Primeira consulta no dentista: quando nascer o primeiro dente ou, no máximo, até 1 ano. Depois, consultas regulares.",
      ],
      alerta: "Manchas ou buracos nos dentes, dor, gengiva inchada, ou batida na boca com dente quebrado, mole ou fora do lugar: procure o dentista logo. Em trauma, quanto mais rápido o atendimento, maior a chance de salvar o dente.",
    },
    {
      id: "rt8",
      titulo: "“Ela não come nada!”: seletividade depois de 1 ano",
      gancho: "Comia de tudo e agora recusa? Depois de 1 ano o apetite cai mesmo, porque o crescimento desacelera.",
      pontos: [
        "A partir de 1 ano a criança cresce mais devagar, come menos e repara mais no que está no prato. Pode recusar o que antes aceitava.",
        "Respeite o apetite e os sinais de que ela está satisfeita. Sirva porções pequenas e repita se ela pedir.",
        "Não force, não chantageie, não deixe de castigo na mesa e não ofereça doce ou presente como prêmio para comer.",
        "Recusou? Ofereça de novo em outros dias, preparado de outro jeito e junto com algo de que ela já gosta. Algumas crianças precisam provar um alimento mais de oito vezes até aceitar.",
        "Comam juntos, à mesa, sem TV nem celular, com a mesma comida da família.",
        "Evite beliscos entre as refeições e ultraprocessados, como biscoito recheado, salgadinho e refrigerante: tiram o apetite para a comida de verdade.",
      ],
      alerta: "Está perdendo peso ou saindo da curva de crescimento da Caderneta, aceita pouquíssimos alimentos, engasga ou vomita com frequência ao comer, ou as refeições viraram sofrimento para todos: converse com o pediatra.",
    },
  ],
  fontes: [
    "Lei 13.010/2014 (Lei Menino Bernardo), que incluiu o art. 18-A no Estatuto da Criança e do Adolescente.",
    "Lei 14.826/2024: parentalidade positiva e direito ao brincar como estratégias de prevenção da violência contra crianças.",
    "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023.",
    "Sociedade Brasileira de Pediatria. Documento Científico nº 5: Higiene do sono, atualização 2021.",
    "Sociedade Brasileira de Pediatria e Sociedade Brasileira de Urologia. Manual de Orientação: Treinamento esfincteriano. 2019.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 163: #Menos Telas #Mais Saúde, atualização 2024.",
    "Governo Federal (Secom). Crianças, adolescentes e telas: guia sobre usos de dispositivos digitais. 2025.",
    "Sociedade Brasileira de Pediatria, GT de Saúde Oral. Cuidados com a saúde oral nos primeiros mil dias de vida; O primeiro dente de leite está chegando, e agora? (Pediatria para Famílias). 2026.",
    "Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019 (versão resumida, 2021).",
    "Ministério da Saúde. Guia Alimentar para a População Brasileira. 2ª edição, 2014.",
    "Sege RD, Siegel BS. Effective Discipline to Raise Healthy Children (AAP). Pediatrics, 2018.",
    "Sociedade Brasileira de Pediatria, Departamento de Otorrinolaringologia. Apneia do sono (Pediatria para Famílias). 2023.",
    "Paruthi S et al. Recommended Amount of Sleep for Pediatric Populations (AASM). Journal of Clinical Sleep Medicine, 2016.",
  ],
};
