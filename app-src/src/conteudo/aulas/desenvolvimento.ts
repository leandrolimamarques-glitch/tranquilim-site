import type { Trilha } from "../trilhas";

// Trilha: Desenvolvimento e marcos. Rascunho para revisão médica antes de divulgar.
// Marcos: Caderneta da Criança (Ministério da Saúde, 6ª ed. 2023; a 7ª ed., 2024, inclui o M-CHAT-R/F),
// conferidos com os marcos CDC/AAP revisados (Zubler et al., Pediatrics 2022).
// Autismo: SBP, Manual de Orientação nº 150 (2024) e nº 5 (2019). Telas: SBP nº 163 (2024).
// Detalhe de cada afirmação e respectiva fonte: revisao/aulas-b.md.

export const DESENVOLVIMENTO: Trilha = {
  id: "desenvolvimento",
  titulo: "Desenvolvimento e marcos",
  faixa: "do nascimento aos 6 anos",
  deMeses: 0,
  ateMeses: 72,
  aulas: [
    {
      id: "de1",
      titulo: "Do nascimento aos 6 meses: o que observar",
      gancho: "Será que ele está se desenvolvendo no tempo certo? Alguns sinais simples ajudam a responder.",
      pontos: [
        "Cada bebê tem seu ritmo. Os marcos abaixo são o que a maioria já faz por volta de cada idade. A Caderneta da Criança traz a lista completa para você acompanhar.",
        "Por volta dos 2 meses: acalma quando você fala com ele ou pega no colo, olha para o seu rosto, sorri quando você sorri e conversa, faz sons além do choro, reage a barulho alto e, de bruços, levanta a cabeça.",
        "Por volta dos 4 meses: dá risadinhas e solta sons como “aaa” e “gugu” quando você conversa, vira a cabeça na direção da sua voz, segura um brinquedo colocado na mão, leva as mãos à boca e, de bruços, se apoia nos antebraços.",
        "Por volta dos 6 meses: reconhece as pessoas da casa, dá risada, “conversa” com você revezando sons, estica o braço para pegar o que quer, leva objetos à boca, procura de onde vem um som e rola.",
        "Nasceu prematuro? Use a idade corrigida: desconte da idade dele as semanas que faltaram para completar 40 semanas de gestação.",
      ],
      alerta: "Faltou algum marco no fim da faixa de idade? Converse com o pediatra. Não sorri, não reage a sons, não sustenta a cabeça ou perdeu algo que já fazia: procure o pediatra logo, sem esperar a próxima consulta.",
    },
    {
      id: "de2",
      titulo: "De 9 a 12 meses: senta, engatinha e começa a se comunicar",
      gancho: "Ainda não fala? Antes das palavras vêm os gestos, e eles contam muito.",
      pontos: [
        "Por volta dos 9 meses: estranha pessoas desconhecidas, olha quando chamam pelo nome, ri no esconde-achou, balbucia “mamama” e “bababa”, levanta os braços para pedir colo, passa objetos de uma mão para a outra e senta sem apoio.",
        "Estranhar desconhecidos é um bom sinal: mostra que ele já sabe quem são as pessoas dele.",
        "Por volta de 1 ano: dá tchau, imita gestos como bater palmas, chama “mamã” ou “papá” (ou outro nome especial), procura o que você escondeu, pega coisas pequenas com a ponta dos dedos e fica em pé apoiado nos móveis.",
        "Andar sem apoio e falar a primeira palavra costumam aparecer entre 1 ano e 1 ano e 3 meses.",
        "Andador não, em nenhuma idade: atrapalha o andar e causa quedas graves. Chão firme e seguro é o melhor lugar para treinar.",
      ],
      alerta: "Aos 9 meses não balbucia, não senta sem apoio ou não olha quando é chamado pelo nome; com 1 ano não aponta, não dá tchau e não fica em pé com apoio: converse com o pediatra.",
    },
    {
      id: "de3",
      titulo: "De 1 ano e meio a 2 anos: andar, apontar e juntar palavras",
      gancho: "Ele entende tudo, mas fala pouco? Nessa fase é comum, até certo ponto.",
      pontos: [
        "Por volta de 1 ano e meio: anda sem apoio, rabisca, tenta usar a colher, fala pelo menos três palavras além de “mamã” e “papá”, aponta para mostrar algo interessante e atende a um pedido simples sem gesto, como “me dá”.",
        "Por volta dos 2 anos: corre, chuta bola, aponta figuras no livro quando você pergunta, mostra duas partes do corpo, junta duas palavras (“mais água”) e brinca de faz de conta simples, como dar comida para a boneca.",
        "Apontar para mostrar algo (“olha!”) e olhar para você para dividir a descoberta são marcos tão importantes quanto falar.",
        "Leve suas dúvidas às consultas de 18 e 24 meses: é nelas que o pediatra faz a triagem do desenvolvimento e do autismo.",
      ],
      alerta: "Com 1 ano e meio não anda, não fala nenhuma palavra ou não aponta para mostrar coisas; com 2 anos não junta duas palavras, não imita ou não atende a pedidos simples: converse com o pediatra.",
    },
    {
      id: "de4",
      titulo: "Dos 3 aos 5 anos: conversa, imaginação e independência",
      gancho: "Agora as conquistas são outras: conversar, brincar junto e fazer sozinho.",
      pontos: [
        "Por volta dos 3 anos: conversa com você num vaivém, faz perguntas (“o quê?”, “onde?”, “por quê?”), diz o próprio nome, fala de um jeito que pessoas de fora entendem quase sempre, brinca com outras crianças, usa o garfo e põe algumas roupas sozinho.",
        "Por volta dos 4 anos: fala frases de quatro palavras ou mais, conta algo que aconteceu no dia, brinca de ser outra pessoa (professora, super-herói), copia um círculo e desenha uma pessoa com algumas partes do corpo.",
        "Por volta dos 5 anos: conta uma história com pelo menos dois acontecimentos, conta até 10, reconhece algumas letras, segue regras e espera a vez nos jogos, pula num pé só e se veste sem ajuda.",
        "Deixe fazer sozinho, mesmo que demore: guardar os brinquedos, escolher a roupa, ajudar em tarefas simples. Elogie o esforço, não só o resultado.",
        "A partir dos 4 anos a pré-escola é obrigatória. Pergunte à professora como ele brinca, fala e se relaciona com os colegas.",
      ],
      alerta: "Aos 3 anos quase ninguém de fora entende o que ele fala, não forma frases ou não se interessa por outras crianças; aos 4 ou 5 anos não conversa, não brinca de faz de conta ou não consegue seguir regras simples: converse com o pediatra. A escola notou algo diferente? Leve à consulta.",
    },
    {
      id: "de5",
      titulo: "Brincar, conversar e ler: o estímulo que cabe na rotina",
      gancho: "Não precisa de brinquedo caro nem de aula especial: o que mais estimula é você.",
      pontos: [
        "Converse o dia todo, contando o que está fazendo: “agora vamos lavar a mão, depois o braço”. Responda aos sons e às tentativas de fala, como numa conversa.",
        "Leia todos os dias, nem que sejam dez minutos. Livro só de figuras também vale: aponte, diga o nome das coisas, invente a história.",
        "Brinque no chão: de bruços desde cedo (acordado e com você olhando), esconde-achou, empilhar potes, chutar bola, faz de conta. Panela, caixa e colher de pau são ótimos brinquedos.",
        "Fale as palavras do jeito certo. O tom carinhoso ajuda, mas a criança aprende a pronúncia do que ouve. Se ela errar, repita a forma certa, sem corrigir nem rir.",
        "Nas refeições, TV desligada e conversa. Rotina previsível de comer, tomar banho e dormir dá segurança para explorar.",
      ],
      alerta: "Estimular não substitui avaliação: se mesmo assim ela não alcança os marcos da idade, ou perde algo que já fazia, converse com o pediatra. Se você anda muito triste ou sem energia para brincar, fale disso também na consulta: cuidar de quem cuida faz parte.",
    },
    {
      id: "de6",
      titulo: "Telas e desenvolvimento: quanto e quando",
      gancho: "O vídeo acalma na hora, mas tira dela o que mais desenvolve: gente de verdade.",
      pontos: [
        "Menos de 2 anos: nenhuma tela, nem a TV ligada “de fundo”. A exceção é a chamada de vídeo com a família, com um adulto junto.",
        "De 2 a 5 anos: no máximo 1 hora por dia, sempre com um adulto por perto e com conteúdo próprio para a idade.",
        "Menos é melhor. Cada hora na tela é uma hora a menos de conversa, brincadeira e movimento, que é o que desenvolve a fala e a atenção.",
        "Nada de tela durante as refeições, e desligue tudo de 1 a 2 horas antes de dormir.",
        "O celular dos adultos também conta: na mão durante a brincadeira ou a refeição, tira a atenção de que a criança precisa.",
      ],
      alerta: "Só se acalma com a tela, fica desesperada quando ela desliga, ou a fala está atrasada: converse com o pediatra. Reduzir as telas ajuda, mas não substitui a avaliação.",
    },
    {
      id: "de7",
      titulo: "Atraso na fala: quando esperar e quando investigar",
      gancho: "“Cada criança tem seu tempo” é verdade, mas esse tempo tem limite.",
      pontos: [
        "A linguagem começa antes das palavras: sorrir, balbuciar, apontar, dar tchau. Entender vem antes de falar.",
        "Referências: a primeira palavra costuma vir entre 1 ano e 1 ano e 3 meses; umas três palavras por volta de 1 ano e meio; frases de duas palavras por volta dos 2 anos; e, entre 3 e 4 anos, uma fala que pessoas de fora entendem.",
        "Toda investigação de fala começa pela audição. Mesmo com teste da orelhinha normal, peça avaliação se a criança não reage a sons, só atende quando está olhando para você ou fala pouco.",
        "Tela não ensina a falar; conversa ensina. Fale com ela, leia junto e dê tempo para ela responder.",
        "Não vale “esperar para ver”: quanto mais cedo começa a estimulação, melhores os resultados, seja qual for a causa.",
      ],
      alerta: "Converse com o pediatra se: aos 9 meses não balbucia; com 1 ano não aponta nem dá tchau; com 1 ano e 4 meses não fala nenhuma palavra; com 2 anos não junta duas palavras; aos 3 anos quase ninguém entende o que fala. Perdeu palavras que já usava, em qualquer idade: procure logo.",
    },
    {
      id: "de8",
      titulo: "Sinais de autismo e a triagem M-CHAT",
      gancho: "Desconfiou de algo? Falar cedo com o pediatra não é exagero, é cuidado.",
      pontos: [
        "O autismo (TEA) afeta a comunicação e a interação com as pessoas, com comportamentos e interesses repetitivos. Os sinais costumam ficar mais claros entre 1 e 2 anos.",
        "Sinais para conversar com o pediatra: não olha quando é chamada pelo nome, olha pouco nos olhos, quase não sorri de volta, não aponta para mostrar coisas, não imita, prefere objetos a pessoas, enfileira ou gira objetos por muito tempo, se incomoda demais com sons ou com o toque.",
        "Nas consultas de 18 e 24 meses, o pediatra deve aplicar o M-CHAT: 20 perguntas, respondidas por você, sobre como a criança brinca e se comunica. Ele está na Caderneta da Criança. Se não for oferecido, peça.",
        "M-CHAT alterado não é diagnóstico: quer dizer que a criança precisa de uma avaliação mais detalhada. E um resultado normal não impede de voltar a conversar se a dúvida aparecer depois.",
        "Não é preciso esperar o diagnóstico para começar a estimular: a intervenção precoce ajuda, seja qual for a causa.",
      ],
      alerta: "Perda de fala, gestos, olhar ou brincadeiras que a criança já tinha nunca é normal, em nenhuma idade: procure o pediatra o quanto antes, sem esperar a consulta de rotina.",
    },
  ],
  fontes: [
    "Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania. 6ª edição, 2023; 7ª edição, 2024 (revisada em 2025), com o M-CHAT-R/F.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 150: Triagem precoce para autismo, M-CHAT-R/F. 2024.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 5: Transtorno do Espectro do Autismo. 2019.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 163: #Menos Telas #Mais Saúde, atualização 2024.",
    "Sociedade Brasileira de Pediatria. Manual de Orientação nº 4: Os acidentes são evitáveis e, na maioria das vezes, o perigo está dentro de casa. 2020.",
    "Governo Federal (Secom). Crianças, adolescentes e telas: guia sobre usos de dispositivos digitais. 2025.",
    "Zubler JM et al. Evidence-Informed Milestones for Developmental Surveillance Tools (CDC/AAP). Pediatrics, 2022.",
    "Hyman SL et al. Identification, Evaluation, and Management of Children With Autism Spectrum Disorder (AAP). Pediatrics, 2020.",
    "Organização Mundial da Saúde. Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age. 2019.",
  ],
};
