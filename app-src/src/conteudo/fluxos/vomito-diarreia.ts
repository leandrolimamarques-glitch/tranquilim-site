import type { Fluxo } from "../../lib/fluxo";

// Vômito e diarreia: rascunho para revisão médica (pediatra e médico de emergência) antes de divulgar.
// Avaliação da hidratação, Plano A em casa e sinais de alerta para voltar: Ministério da Saúde, Manejo do
// paciente com diarreia (2023), e Manual AIDPI Criança: 2 meses a 5 anos (2017); SBP, Diarreia aguda
// infecciosa (2023). Sinais que sugerem outra doença (vômito verde, barriga distendida, choque) e duração
// esperada: NICE CG84 (2009). Golfada e vômito em jato no bebê: NICE NG1 (2015, atualizada em 2019).
// Vômito depois de bater a cabeça: NICE NG232 (2023). Pilha e ímã: SBP, Ingestão de corpos estranhos (2022).
// Cada ponto de decisão com a fonte: revisao/fluxos-a.md.

const SINAIS_DE_ALARME = [
  "Está muito molinha, difícil de acordar, ou não reage a você",
  "Não consegue mamar ou beber nada, ou vomita tudo o que toma, mesmo em goles pequenos",
  "Vômito verde ou verde-amarelado, ou vômito com sangue",
  "Barriga muito inchada ou dura, ou dor de barriga forte que não passa",
  "Mãos e pés frios, com a pele pálida, manchada ou acinzentada",
  "Respira muito rápido ou com esforço",
  "Teve uma convulsão",
  "Está há 12 horas ou mais sem fazer xixi",
  "Manchas roxas ou vermelho-escuras que não somem quando você aperta um copo de vidro em cima",
  "Moleira estufada, ou dor forte ao dobrar o pescoço",
  "Começou a vomitar depois de bater a cabeça",
  "Pode ter engolido uma pilha pequena e redonda (de relógio, controle ou brinquedo) ou um ímã",
];

const VOLTE_SE_ALARME = SINAIS_DE_ALARME.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`);

const SEM_REMEDIO = "Não dê remédio para parar o vômito ou a diarreia por conta própria.";

export const VOMITO_DIARREIA: Fluxo = {
  id: "vomito-diarreia",
  titulo: "Vômito e diarreia",
  resumo: "Vômitos, ou cocô mais aguado e mais vezes que o normal da criança.",
  inicio: "alarme",
  passos: {
    alarme: {
      id: "alarme",
      tipo: "sinais",
      pergunta: "A criança tem algum destes sinais agora?",
      ajuda: "Marque tudo o que estiver acontecendo. Se não tiver nenhum, toque em \"Nenhum destes\".",
      itens: SINAIS_DE_ALARME.map((texto, i) => ({ id: `alarme-${i + 1}`, texto })),
      seAlgum: "ps",
      seNenhum: "idade",
    },
    idade: {
      id: "idade",
      tipo: "escolha",
      pergunta: "Quantos meses a criança tem?",
      opcoes: [
        { texto: "Menos de 3 meses", vai: "bebe" },
        { texto: "3 meses ou mais", vai: "desidratacao" },
      ],
    },
    bebe: {
      id: "bebe",
      tipo: "sinais",
      pergunta: "O bebê tem algum destes?",
      ajuda:
        "Golfada é o leite que volta pela boca sem força, logo depois de mamar. Vômito sai com força e em mais quantidade.",
      itens: [
        { id: "bebe-1", texto: "Vomitou várias vezes, e não é só a golfada de sempre" },
        { id: "bebe-2", texto: "O vômito sai em jato forte, longe da boca" },
        { id: "bebe-3", texto: "Tem febre: temperatura na axila acima de 37,3 °C" },
        { id: "bebe-4", texto: "Está mamando bem menos que o normal" },
        { id: "bebe-5", texto: "Está fazendo menos xixi, a boca está seca ou a moleira está afundada" },
      ],
      seAlgum: "ps-bebe",
      seNenhum: "bebe-o-que",
    },
    "bebe-o-que": {
      id: "bebe-o-que",
      tipo: "escolha",
      pergunta: "O que está acontecendo com o bebê?",
      ajuda:
        "No bebê que mama só no peito, cocô mole, amarelado e várias vezes ao dia, logo depois das mamadas, é normal. Diarreia é quando o cocô fica, de repente, bem mais aguado ou bem mais frequente que o normal dele.",
      opcoes: [
        { texto: "Está com diarreia, ou vomitou (sem ser golfada)", vai: "hoje-bebe" },
        {
          texto: "Só golfa: o leite volta sem força depois de mamar, e o bebê está bem e mamando como sempre",
          vai: "casa-golfada",
        },
      ],
    },
    desidratacao: {
      id: "desidratacao",
      tipo: "sinais",
      pergunta: "Agora olhe a hidratação. A criança tem algum destes?",
      ajuda: "Esses sinais mostram que ela está perdendo mais líquido do que consegue repor.",
      itens: [
        { id: "desidratacao-1", texto: "Está fazendo bem menos xixi que o normal, ou a fralda fica seca por mais tempo" },
        { id: "desidratacao-2", texto: "Chora sem lágrimas" },
        { id: "desidratacao-3", texto: "A boca e a língua estão secas" },
        { id: "desidratacao-4", texto: "Os olhos estão fundos" },
        { id: "desidratacao-5", texto: "A moleira está afundada (em bebês)" },
        { id: "desidratacao-6", texto: "Está com muita sede e bebe com pressa, com vontade" },
        { id: "desidratacao-7", texto: "Está irritada ou inquieta e não se acalma" },
      ],
      seAlgum: "hoje-desidratacao",
      seNenhum: "atencao",
    },
    atencao: {
      id: "atencao",
      tipo: "sinais",
      pergunta: "E algum destes?",
      itens: [
        { id: "atencao-1", texto: "Os vômitos estão se repetindo" },
        { id: "atencao-2", texto: "A diarreia está piorando: mais vezes ou em mais quantidade" },
        { id: "atencao-3", texto: "Tem sangue no cocô" },
        { id: "atencao-4", texto: "Recusa comer" },
        { id: "atencao-5", texto: "Tem febre de 39 °C ou mais" },
        { id: "atencao-6", texto: "Já faz 2 dias e não melhorou" },
        { id: "atencao-7", texto: "Parece mais doente ou está piorando, ou você sente que tem algo errado" },
      ],
      seAlgum: "hoje",
      seNenhum: "casa",
    },
  },
  desfechos: {
    ps: {
      id: "ps",
      nivel: "ps",
      titulo: "Ligue 192 ou vá ao pronto-socorro agora",
      oQueFazer: [
        "Se a criança não acorda, não respira ou está roxa, ligue 192 agora.",
        SEM_REMEDIO,
        "Leve a caderneta da criança e a lista dos remédios que ela usa.",
      ],
    },
    "ps-bebe": {
      id: "ps-bebe",
      nivel: "ps",
      titulo: "Bebê com menos de 3 meses: vá ao pronto-socorro agora",
      oQueFazer: [
        "Nessa idade, o bebê desidrata rápido. Vômitos repetidos ou em jato, febre, mamar pouco ou menos xixi precisam de médico agora.",
        "Se o bebê não acordar, ficar roxo ou parar de respirar, ligue 192.",
        "Leve a caderneta do bebê.",
      ],
    },
    "hoje-bebe": {
      id: "hoje-bebe",
      nivel: "hoje",
      titulo: "Bebê com menos de 3 meses com diarreia ou vômito: procure atendimento hoje",
      oQueFazer: [
        "Bebês pequenos desidratam mais rápido. Mesmo que pareça bem, ele precisa ser visto por um médico hoje: UBS, pediatra ou pronto atendimento.",
        "Continue o peito e ofereça mais vezes. Se ele toma fórmula, continue preparando como sempre.",
        "Não dê chá, água com açúcar nem suco.",
        SEM_REMEDIO,
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Ele vomitar várias vezes ou em jato, tiver febre, mamar bem menos ou fizer menos xixi: vá ao pronto-socorro.",
      ],
    },
    "hoje-desidratacao": {
      id: "hoje-desidratacao",
      nivel: "hoje",
      titulo: "Sinais de desidratação: procure atendimento nas próximas horas",
      oQueFazer: [
        "A criança precisa ser avaliada hoje, de preferência nas próximas horas, numa UBS, com o pediatra ou num pronto atendimento. Lá ela pode tomar o soro com acompanhamento.",
        "Enquanto isso, ofereça soro de reidratação oral em goles pequenos, várias vezes, com copo ou colher. Se ela vomitar, espere 10 minutos e ofereça de novo, mais devagar.",
        "Se ela mama no peito, continue.",
        SEM_REMEDIO,
      ],
      volteSe: VOLTE_SE_ALARME,
    },
    hoje: {
      id: "hoje",
      nivel: "hoje",
      titulo: "Procure atendimento hoje",
      oQueFazer: [
        "Não precisa ser em minutos, mas precisa ser hoje: UBS, pediatra ou pronto atendimento.",
        "Enquanto isso, ofereça soro de reidratação oral em goles pequenos depois de cada cocô líquido ou vômito, e continue o peito.",
        SEM_REMEDIO,
      ],
      volteSe: [
        ...VOLTE_SE_ALARME,
        "Aparecer sinal de desidratação (menos xixi, choro sem lágrimas, boca seca, olhos fundos, muita sede): procure atendimento nas próximas horas.",
      ],
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "Pode cuidar em casa, de olho nos sinais",
      oQueFazer: [
        "Ofereça mais líquido que o normal, em goles pequenos e muitas vezes, principalmente depois de cada cocô líquido ou vômito: soro de reidratação oral, água, sopa ou caldo.",
        "Se o bebê mama só no peito, ofereça o peito mais vezes. Além do leite materno, o único líquido indicado é o soro de reidratação oral.",
        "Use soro de reidratação oral da UBS ou da farmácia, preparado exatamente como diz a embalagem. Prepare um novo a cada dia e jogue fora o que sobrou do dia anterior.",
        "Se ela vomitar, espere 10 minutos e ofereça de novo, mais devagar.",
        "Mantenha o peito e a comida de sempre. Não precisa de dieta especial nem de jejum.",
        "Não dê refrigerante nem suco de caixinha ou em pó, e não adoce chá ou suco.",
        "Não dê remédio para parar a diarreia ou o vômito, nem antibiótico, sem receita do médico.",
        "Lave bem as mãos com água e sabão depois de trocar a fralda ou ir ao banheiro, e antes de preparar comida. Não divida toalhas.",
        "O vômito costuma passar em 1 a 2 dias, e a diarreia em 5 a 7 dias. A criança só volta à creche ou à escola 48 horas depois do último vômito ou diarreia.",
      ],
      volteSe: [
        "Aparecer qualquer sinal da primeira lista: ligue 192 ou vá ao pronto-socorro.",
        "Aparecer sinal de desidratação: menos xixi, choro sem lágrimas, boca seca, olhos fundos ou muita sede.",
        "Os vômitos se repetirem, a diarreia piorar ou aparecer sangue no cocô.",
        "Ela recusar comer, ou tiver febre de 39 °C ou mais.",
        "Não melhorar em 2 dias.",
        "Você ficar mais preocupado do que antes.",
      ],
    },
    "casa-golfada": {
      id: "casa-golfada",
      nivel: "casa",
      titulo: "Golfadas: pode ficar em casa, de olho nos sinais",
      oQueFazer: [
        "Golfar é muito comum nos primeiros meses: o leite volta sem força, logo depois de mamar. Costuma começar antes dos 2 meses e melhorar sozinho até 1 ano.",
        "Bebê que golfa mas está bem, mama e faz xixi como sempre, não precisa de exame nem de remédio.",
        "Não dê remédio para golfada ou refluxo sem orientação do pediatra.",
        "Para dormir, sempre de barriga para cima, em colchão firme e reto, sem travesseiro. Não incline o berço nem use rolinhos por causa da golfada.",
        "Leve suas dúvidas à próxima consulta de rotina.",
      ],
      volteSe: [
        "O vômito ficar verde ou verde-amarelado, tiver sangue, ou aparecer qualquer sinal da primeira lista: ligue 192 ou vá ao pronto-socorro.",
        "O bebê tiver febre, ou o vômito sair em jato forte: vá ao pronto-socorro.",
        "Aparecer diarreia, ou ele chorar muito nas mamadas, recusar mamar ou não ganhar peso: procure atendimento hoje.",
        "As golfadas continuarem frequentes depois de 1 ano: fale com o pediatra.",
      ],
    },
  },
  fontes: [
    "Ministério da Saúde. Manejo do paciente com diarreia (cartaz). 2023.",
    "Ministério da Saúde. Manual AIDPI Criança: 2 meses a 5 anos. 2017.",
    "Sociedade Brasileira de Pediatria. Diarreia aguda infecciosa. Guia Prático de Atualização nº 74, 2023.",
    "Sociedade Brasileira de Pediatria. Ingestão de corpos estranhos. Manual do Departamento de Gastroenterologia, 2022.",
    "Sociedade Brasileira de Pediatria. Recomendações da AAP sobre sono seguro em menores de um ano. Nota de Alerta nº 56, 2023.",
    "OMS. Pocket book of hospital care for children, 2ª ed. 2013.",
    "NICE CG84. Diarrhoea and vomiting caused by gastroenteritis in under 5s. 2009.",
    "NICE NG1. Gastro-oesophageal reflux disease in children and young people. 2015, atualizada em 2019.",
    "NICE NG232. Head injury: assessment and early management. 2023.",
    "NICE NG9. Bronchiolitis in children: diagnosis and management. 2015, atualizada em 2021.",
    "American Academy of Pediatrics. Signs of dehydration in infants & children. HealthyChildren.org, 2019.",
  ],
};
