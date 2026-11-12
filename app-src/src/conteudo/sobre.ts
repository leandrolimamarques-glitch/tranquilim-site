// Aba "Quem somos". Texto institucional: segue as regras de publicidade médica do
// CFM (Resolução 2.336/2023): nome com CRM, sem anunciar especialidade sem RQE,
// sem superlativos nem promessa de resultado. Edite à vontade, mantendo isso.

export type Medico = { nome: string; apelido?: string; linha: string; registro: string; texto: string[] };

export const SOBRE = {
  titulo: "Por que criamos o Tranquilim",
  abertura: [
    "Nunca houve tanta informação sobre crianças, e nunca foi tão difícil saber em qual acreditar. Vídeo no celular, grupo da família, conselho de vizinha, resposta de inteligência artificial que fala com toda a certeza e às vezes erra. No meio disso tudo, uma mãe ou um pai com o filho no colo, às três da manhã, tentando decidir o que fazer.",
    "O Tranquilim nasceu para duas coisas. A primeira é aproximar o médico da família: o pediatra acompanha a carteira de vacinas, o peso e as dúvidas da criança entre uma consulta e outra, e a família sabe que do outro lado tem alguém que conhece o seu filho. A segunda é filtrar: separar, de tudo o que se fala por aí, o que de fato importa para cuidar bem, explicado de um jeito que qualquer pessoa entende.",
  ],
  medicos: [
    {
      nome: "Dr. Francisco Martiniano",
      apelido: "Chicão",
      linha: "Médico formado em 2018 pela Universidade de Marília · pós-graduação em pediatria, em geriatria e em autismo infantil",
      registro: "CRM-SP 199456",
      texto: [
        "O Chicão cuida de crianças e de famílias. No consultório, ouve todos os dias as mesmas perguntas: é febre ou não é, por que ele chora tanto, essa vacina pode atrasar, o peso está bom, quando começar a comida, ele já devia estar falando. Perguntas simples para quem é médico e enormes para quem está vivendo aquilo pela primeira vez.",
        "A pós-graduação em autismo infantil trouxe um olhar atento para o desenvolvimento: perceber cedo o que merece atenção, sem alarmar e sem deixar passar. A formação em geriatria, curiosamente, ensinou a mesma coisa que a pediatria: cuidar bem é cuidar da família inteira, não só de quem está na maca.",
        "Pai do João Francisco, sabe na pele que a dúvida não escolhe horário. É ele quem acompanha as famílias no app, com a carteira de vacinas, a curva de crescimento e as perguntas à vista.",
      ],
    },
    {
      nome: "Dr. Leandro L. Marques",
      linha: "Médico formado em 2020 pela Universidade de Marília · atuação em UTI e emergência · pós-graduação em medicina de emergência",
      registro: "CRM-SP 216.200",
      texto: [
        "O Leandro trabalha onde a medicina é mais grave: na UTI e na sala vermelha. Ali, cada minuto pesa, e ele vê os dois lados de uma dúvida mal resolvida: a criança que chega tarde, depois de horas tentando entender o que estava acontecendo, e a família que passa a madrugada no pronto-socorro por algo que poderia ser cuidado em casa.",
        "Dessa rotina veio o coração do Tranquilim: o \"Vai ao PS, liga ou espera?\", que faz uma pergunta por vez e termina numa resposta clara, ir agora, procurar atendimento hoje ou cuidar em casa, sempre com os sinais de alerta para não esperar demais.",
        "Também criou o Ductus, aplicativo de apoio à decisão usado por médicos de plantão, e trouxe para cá o mesmo cuidado: tudo com fonte, nada de achismo.",
      ],
    },
  ] as Medico[],
  juntos: "Os dois se formaram na mesma faculdade e seguiram caminhos diferentes da medicina: um no cuidado do dia a dia, outro na urgência. O Tranquilim junta os dois olhares, o de quem acompanha a criança crescer e o de quem sabe quando não dá para esperar.",
  compromissos: [
    "Tudo o que está no app tem fonte: Ministério da Saúde e Sociedade Brasileira de Pediatria em primeiro lugar.",
    "Linguagem simples para todo mundo, e um \"Entender melhor\" para quem quer saber mais.",
    "Nada de dose de remédio no app. Remédio é com o pediatra que examina a criança.",
    "A inteligência artificial do app responde com filtros definidos por nós: emergência vai para o 192, remédio e diagnóstico vão para o pediatra.",
    "Seus dados são seus: só você, quem você incluir e o pediatra que você escolher veem.",
    "O Tranquilim orienta e não substitui a consulta. Em emergência, ligue 192.",
  ],
};
