// Aba "Quem somos". Texto institucional: segue as regras de publicidade médica do
// CFM (Resolução 2.336/2023): nome com CRM, sem anunciar especialidade sem RQE,
// sem superlativos nem promessa de resultado. Edite à vontade, mantendo isso.

export type Medico = { nome: string; apelido?: string; linha: string; registro: string; texto: string[] };

export const SOBRE = {
  titulo: "Por que criamos o Tranquilim",
  abertura: [
    "Somos dois médicos e amigos, formados pela mesma faculdade. Um cuida de crianças e famílias no dia a dia; o outro trabalha onde a medicina é mais grave. Os dois vivem a mesma cena: a dúvida que aparece de madrugada e não encontra resposta confiável.",
    "Sem saber o que fazer, a família pesquisa na internet, pergunta no grupo, ouve opiniões. Às vezes corre ao pronto-socorro por algo que poderia ser cuidado em casa. Às vezes espera demais por algo que não podia esperar.",
  ],
  medicos: [
    {
      nome: "Dr. Francisco Martiniano",
      apelido: "Chicão",
      linha: "Médico formado em 2018 pela Universidade de Marília · pós-graduação em pediatria, em geriatria e em autismo infantil",
      registro: "CRM-SP 199456",
      texto: [
        "O Chicão passa os dias respondendo às perguntas que toda mãe e todo pai fazem: febre, cólica, vacina, peso, sono, comida, desenvolvimento. Pai do João Francisco, sabe na pele que a dúvida não escolhe horário.",
        "É ele quem acompanha as famílias no app, com a caderneta de vacinas e a curva de crescimento à vista.",
      ],
    },
    {
      nome: "Dr. Leandro L. Marques",
      linha: "Médico formado em 2020 pela Universidade de Marília · atuação em UTI e emergência · pós-graduação em medicina de emergência",
      registro: "CRM-SP 216.200",
      texto: [
        "Na UTI e na sala vermelha, o Leandro vê o que acontece quando a dúvida não tem resposta a tempo. Foi dessa rotina que veio o jeito do Tranquilim de separar o que é para ir agora, o que é para hoje e o que dá para cuidar em casa.",
        "Também criou o Ductus, aplicativo de apoio à decisão para médicos de plantão.",
      ],
    },
  ] as Medico[],
  compromissos: [
    "Tudo o que está no app tem fonte: Ministério da Saúde e Sociedade Brasileira de Pediatria em primeiro lugar.",
    "Linguagem simples para todo mundo, e um \"Entender melhor\" para quem quer saber mais.",
    "Nada de dose de remédio no app. Remédio é com o pediatra que examina a criança.",
    "Seus dados são seus: só você, quem você incluir e o pediatra que você escolher veem.",
    "O Tranquilim orienta e não substitui a consulta. Em emergência, ligue 192.",
  ],
};
