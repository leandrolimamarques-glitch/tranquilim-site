import type { Fluxo } from "../lib/fluxo";

// Febre: rascunho para revisão médica (Leandro e Chicão) antes de divulgar.
// Definição de febre e conduta em casa: SBP, Manejo da Febre Aguda (2021).
// Sinais de alarme e de atenção: NICE NG143, tabela semáforo (2019, mantida na revisão de 2025).

const SINAIS_DE_ALARME = [
  "Não acorda, ou acorda e não consegue ficar acordada",
  "Respira com muito esforço: gemendo, com a pele afundando entre as costelas, ou muito rápido",
  "Lábios, língua ou pele roxos, acinzentados ou manchados",
  "Teve uma convulsão",
  "Manchas roxas ou vermelho-escuras que não somem quando você aperta um copo de vidro em cima",
  "Moleira estufada, ou dor forte ao dobrar o pescoço",
  "Está muito molinha e não reage a você, ou tem um choro fraco e agudo que não para",
];

export const FEBRE: Fluxo = {
  id: "febre",
  titulo: "Febre",
  resumo: "Temperatura na axila acima de 37,3 °C, medida com termômetro digital.",
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
        { texto: "De 3 a 6 meses", vai: "tres-a-seis" },
        { texto: "Mais de 6 meses", vai: "atencao" },
      ],
    },
    bebe: {
      id: "bebe",
      tipo: "escolha",
      pergunta: "A temperatura na axila passou de 37,3 °C?",
      ajuda: "Use termômetro digital na axila. Se o bebê estava muito agasalhado, tire o excesso de roupa e meça de novo depois de 15 minutos.",
      opcoes: [
        { texto: "Sim, passou de 37,3 °C", vai: "ps-bebe" },
        { texto: "Não passou", vai: "atencao" },
      ],
    },
    "tres-a-seis": {
      id: "tres-a-seis",
      tipo: "escolha",
      pergunta: "A temperatura na axila chegou a 39 °C ou mais?",
      opcoes: [
        { texto: "Sim, 39 °C ou mais", vai: "hoje" },
        { texto: "Não, ficou abaixo de 39 °C", vai: "atencao" },
      ],
    },
    atencao: {
      id: "atencao",
      tipo: "sinais",
      pergunta: "E algum destes?",
      ajuda: "Pense em como a criança está entre os picos de febre, não só no número do termômetro.",
      itens: [
        { id: "atencao-1", texto: "Está bem mais quieta que o normal: não sorri, não brinca, só acorda com muito estímulo" },
        { id: "atencao-2", texto: "Está mamando, comendo ou bebendo bem menos que o normal" },
        { id: "atencao-3", texto: "Está fazendo bem menos xixi que o normal (fraldas mais secas)" },
        { id: "atencao-4", texto: "Respira mais rápido que o normal, ou as narinas abrem e fecham a cada respiração" },
        { id: "atencao-5", texto: "A febre já dura 5 dias ou mais" },
        { id: "atencao-6", texto: "Treme muito de frio quando a febre sobe" },
        { id: "atencao-7", texto: "Tem inchaço em braço, perna ou junta, ou não quer apoiar ou mexer um braço ou uma perna" },
        { id: "atencao-8", texto: "Você sente que tem algo errado, mesmo sem saber explicar" },
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
        "Se a criança não respira, não acorda ou está roxa, ligue 192 agora.",
        "Não espere o antitérmico fazer efeito para sair.",
        "Leve a caderneta da criança e a lista dos remédios que ela usa.",
      ],
    },
    "ps-bebe": {
      id: "ps-bebe",
      nivel: "ps",
      titulo: "Bebê com menos de 3 meses e febre: vá ao pronto-socorro agora",
      oQueFazer: [
        "Nessa idade, toda febre precisa ser avaliada por um médico no mesmo dia, mesmo que o bebê pareça bem.",
        "Antes de dar qualquer remédio, siga a orientação do médico que for avaliar.",
        "Leve a caderneta do bebê.",
      ],
    },
    hoje: {
      id: "hoje",
      nivel: "hoje",
      titulo: "Procure atendimento hoje",
      oQueFazer: [
        "Não precisa ser em minutos, mas precisa ser hoje: UBS, pediatra ou pronto atendimento.",
        "Se não conseguir na UBS ou com o pediatra, vá a um pronto atendimento.",
        "Enquanto isso, ofereça o peito ou líquidos com frequência.",
      ],
      volteSe: SINAIS_DE_ALARME.map((s) => `${s}: ligue 192 ou vá ao pronto-socorro.`),
    },
    casa: {
      id: "casa",
      nivel: "casa",
      titulo: "Pode cuidar em casa, de olho nos sinais",
      oQueFazer: [
        "Ofereça o peito ou líquidos com frequência.",
        "Deixe com roupa leve. Banho frio, álcool e compressas não são recomendados.",
        "Antitérmico só se a criança estiver desconfortável (chorosa, irritada, sem querer brincar ou comer), na dose que o pediatra indicou para o peso dela.",
        "Não alterne nem misture antitérmicos diferentes, e nunca dê AAS (aspirina) a criança.",
        "O número do termômetro, sozinho, não diz a gravidade. O mais importante é como a criança está entre os picos.",
      ],
      volteSe: [
        "Aparecer qualquer sinal da primeira lista: ligue 192 ou vá ao pronto-socorro.",
        "A febre durar 5 dias ou mais.",
        "Ela mamar, comer ou beber bem menos, ou fizer bem menos xixi.",
        "Você ficar mais preocupado do que antes.",
      ],
    },
  },
  fontes: [
    "Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021.",
    "NICE NG143. Fever in under 5s: assessment and initial management. 2019, mantida em 2025.",
  ],
};
