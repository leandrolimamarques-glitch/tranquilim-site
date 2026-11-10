import type { Trilha } from "../trilhas";

// Trilha "Sono do bebê e sono seguro": rascunho para revisão médica (pediatra e médico) antes de divulgar.
// Fontes conferidas em novembro de 2026. Afirmação por afirmação, com a fonte de cada uma e os
// pontos que dependem de decisão do pediatra (chupeta, rede): revisao/aulas-a.md.

export const SONO_SEGURO: Trilha = {
  id: "sono-seguro",
  titulo: "Sono do bebê e sono seguro",
  faixa: "do nascimento a 1 ano",
  deMeses: 0,
  ateMeses: 12,
  aulas: [
    {
      id: "ss1",
      titulo: "De barriga para cima, em todo sono",
      gancho: "É o gesto mais simples para proteger o bebê da morte súbita, e vale para todo sono, de dia e de noite.",
      pontos: [
        "Até 1 ano, coloque o bebê para dormir sempre de barriga para cima, nos cochilos e à noite.",
        "De lado não é seguro: dessa posição o bebê vira de bruços com facilidade.",
        "Bebê com refluxo também dorme de barriga para cima. Não use travesseiro, rolinho ou posicionador para elevar ou travar o bebê.",
        "Quando ele aprender a rolar sozinho para os dois lados, pode ficar na posição que escolher. Você continua deitando de barriga para cima.",
        "De bruços, só acordado e com um adulto olhando: esse tempo ajuda a fortalecer pescoço e costas.",
      ],
      alerta: "Bebê encontrado roxo, mole ou sem respirar: ligue 192. Se você souber, comece a reanimação até a ajuda chegar.",
    },
    {
      id: "ss2",
      titulo: "Berço vazio é berço seguro",
      gancho: "Travesseiro, protetor e bichinho de pelúcia deixam o berço bonito, mas podem tapar o nariz e a boca do bebê.",
      pontos: [
        "Colchão firme e plano, que não afunda, bem encaixado no berço, com lençol de elástico.",
        "Nada solto no berço: sem travesseiro, cobertor, edredom, almofada, pelúcia, protetor de grade ou rolinho.",
        "Grades com no máximo 6 cm de espaço entre elas.",
        "Sofá, poltrona e cama de adulto não são lugar para o bebê dormir. Dormir com o bebê no sofá é especialmente perigoso.",
        "Cadeirinha do carro, bebê-conforto e sling não servem para o sono de rotina. Se ele dormir no caminho, passe para o berço ao chegar.",
        "Sem cordões, fitas, colares ou enfeites de cabelo no bebê ou perto dele na hora de dormir.",
      ],
      alerta: "Bebê encontrado com o rosto coberto e sem reagir, roxo ou sem respirar: ligue 192 e, se souber, comece a reanimação.",
    },
    {
      id: "ss3",
      titulo: "Mesmo quarto, cama separada",
      gancho: "Ter o bebê pertinho facilita as mamadas da noite. Pertinho, mas no berço dele.",
      pontos: [
        "O lugar mais seguro é o quarto dos pais, com o bebê no próprio berço ao lado da cama: pelo menos nos primeiros 6 meses e, de preferência, até 1 ano.",
        "Dividir a cama com o bebê aumenta o risco de morte súbita e de sufocação, principalmente nos primeiros 3 meses.",
        "Pode trazer o bebê para a cama para mamar ou acalmar. Quando for voltar a dormir, devolva-o ao berço.",
        "Nunca durma com o bebê se você fumou, bebeu álcool, tomou remédio que dá sono ou usou droga, ou se está exausto.",
        "Ninho, redutor ou outro acessório para dormir junto na cama não tornam a cama segura. Gêmeos: cada um no seu berço.",
      ],
      alerta: "Se você anda adormecendo com o bebê no colo sem perceber, peça ajuda à família e fale com a equipe da UBS. Cansaço extremo, tristeza que não passa ou falta de vontade de cuidar do bebê podem ser depressão pós-parto, que tem tratamento.",
    },
    {
      id: "ss4",
      titulo: "Nem frio nem calor: roupa e temperatura",
      gancho: "Bebê não precisa de muitas camadas. Calor demais também é perigoso.",
      pontos: [
        "Vista o bebê de acordo com o clima: no máximo uma camada a mais do que um adulto usaria para ficar confortável no mesmo lugar.",
        "Aqueça com a roupa, não com cobertor. Se precisar, use um saco de dormir do tamanho certo.",
        "Sinais de calor demais: suor, pele avermelhada, peito quente ao toque.",
        "Não cubra a cabeça nem o rosto do bebê para dormir. Dentro de casa, touca não é necessária para dormir.",
        "Não há uma temperatura de quarto ideal definida: o ambiente deve ser arejado e confortável.",
        "Enrolar o bebê no cueiro não previne morte súbita. Se usar, sempre de barriga para cima, e pare assim que ele tentar rolar, o que costuma acontecer por volta dos 3 a 4 meses. Cueiro ou cobertor com peso não são seguros.",
      ],
      alerta: "Bebê quente, suado e molinho, ou com temperatura acima de 37,3 °C na axila depois de tirar o excesso de roupa: use o guia de febre do app. Com menos de 3 meses, vá ao pronto-socorro.",
    },
    {
      id: "ss5",
      titulo: "Chupeta: o que dizem as orientações",
      gancho: "Dar ou não dar chupeta? As orientações não são iguais, e vale entender por quê.",
      pontos: [
        "O Ministério da Saúde orienta evitar a chupeta, porque ela pode atrapalhar a amamentação.",
        "O documento da Sociedade Brasileira de Pediatria sobre morte súbita e a Academia Americana de Pediatria sugerem oferecer a chupeta na hora de dormir, porque ela está ligada a menor risco de morte súbita.",
        "Se a família escolher a chupeta e o bebê mama no peito, espere a amamentação estar bem estabelecida: boa pega, bastante leite e bom ganho de peso.",
        "Ofereça, mas não force. Se ela cair da boca depois que o bebê dormir, não precisa colocar de volta.",
        "Nunca pendure a chupeta no pescoço nem prenda na roupa com cordão, e nunca passe mel ou açúcar nela.",
        "Decida junto com o pediatra o que faz mais sentido para o seu bebê.",
      ],
      alerta: "Depois que começou a chupeta, o bebê passou a mamar menos, largar o peito ou não ganhar peso: fale com o pediatra ou a UBS.",
    },
    {
      id: "ss6",
      titulo: "Quanto o bebê dorme em cada idade",
      gancho: "Cada bebê tem seu ritmo, mas saber o que é esperado ajuda a não se preocupar à toa.",
      pontos: [
        "O recém-nascido dorme a maior parte do dia, em sonos curtos, e ainda não diferencia dia e noite. Ele acorda para mamar, inclusive de madrugada.",
        "Por volta dos 2 a 3 meses, o sono começa a se concentrar mais à noite, e os períodos acordado durante o dia ficam mais longos.",
        "Dos 4 aos 12 meses, o esperado é de 12 a 16 horas de sono em 24 horas, somando os cochilos.",
        "Entre 6 e 9 meses, a maioria dos bebês passa a dormir a noite inteira e faz dois ou três cochilos de dia. A maioria, não todos.",
        "Para ajudar a diferenciar dia e noite: de dia, cochilos com a claridade e os barulhos normais da casa; à noite, quarto escuro e silencioso.",
      ],
      alerta: "Recém-nascido que dorme tanto que não acorda para mamar: pediatra ou UBS no mesmo dia. Bebê muito sonolento, difícil de acordar ou molinho: pronto-socorro.",
    },
    {
      id: "ss7",
      titulo: "Rotina para a hora de dormir",
      gancho: "Bebê gosta de saber o que vem depois. Uma rotina curta e repetida ajuda o sono a chegar.",
      pontos: [
        "Repita a mesma sequência todas as noites, por exemplo: banho, troca, mamada, música baixa ou historinha, luz apagada.",
        "Rotina curta e gostosa: até uns 30 minutos.",
        "Horários parecidos para dormir e acordar todos os dias, inclusive nos fins de semana, e também para os cochilos.",
        "Desligue as telas pelo menos 1 hora antes de dormir.",
        "Aos poucos, tente colocar o bebê no berço ainda sonolento, mas acordado, para ele aprender a adormecer ali.",
        "Todos que cuidam do bebê devem fazer do mesmo jeito.",
      ],
      alerta: "Se o sono do bebê está deixando a família exausta, ou a rotina não funciona depois de semanas tentando, converse com o pediatra: há caminhos seguros para ajudar.",
    },
    {
      id: "ss8",
      titulo: "Acordar de madrugada é normal",
      gancho: "Todo bebê acorda à noite. O que muda com o tempo é a facilidade de voltar a dormir.",
      pontos: [
        "O sono do bebê vem em ciclos curtos. Entre um ciclo e outro ele desperta rapidinho, se mexe, resmunga e muitas vezes volta a dormir sozinho.",
        "Nos primeiros meses, acordar para mamar é necessário, e as mamadas da madrugada ajudam a manter a produção de leite.",
        "No bebê maior, antes de pegar no colo, espere um pouquinho e observe: às vezes ele volta a dormir sem ajuda.",
        "À noite, atenda com luz fraca, voz baixa e pouca conversa.",
        "Doença e mudanças na rotina podem trazer algumas noites piores. Costumam passar.",
        "Depois de mamar ou acalmar, devolva o bebê ao berço, de barriga para cima.",
      ],
      alerta: "Bebê que acorda chorando muito e não se acalma de jeito nenhum, ou acorda com febre, vômitos ou respiração difícil: procure atendimento. Se o cansaço dos pais estiver grande demais, peça ajuda à família e à equipe da UBS.",
    },
  ],
  fontes: [
    "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania, 6ª edição. 2023.",
    "Sociedade Brasileira de Pediatria. Síndrome da Morte Súbita do Lactente. Documento científico nº 4, Departamento de Medicina do Sono, 2018.",
    "Sociedade Brasileira de Pediatria. Higiene do Sono: Atualização 2021. Documento científico nº 5, Departamento de Sono, 2021.",
    "American Academy of Pediatrics. Sleep-Related Infant Deaths: Updated 2022 Recommendations for Reducing Infant Deaths in the Sleep Environment. Pediatrics, 2022.",
    "American Academy of Sleep Medicine. Recommended amount of sleep for pediatric populations (consenso). 2016.",
  ],
};
