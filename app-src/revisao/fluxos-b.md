# Revisão médica: fluxos "Queda e batida na cabeça", "Manchas na pele" e "Engasgo e objeto engolido"

Rascunho para o pediatra e para o médico de emergência/UTI. Código em
`src/conteudo/fluxos/queda-cabeca.ts`, `src/conteudo/fluxos/manchas-pele.ts` e
`src/conteudo/fluxos/engasgo.ts`; testes em `src/conteudo/fluxos/fluxos-b.test.ts`.

Como foi feito: cada fonte abaixo foi aberta e o trecho usado foi lido no documento original (PDF,
página oficial ou registro do PubMed) em novembro de 2026. Nenhum texto do app traz dose, volume, gotas
ou nome comercial. O único número de telefone é o 192. Os fluxos ainda não estão ligados à tela
(`src/telas/VaiAoPS.tsx` não foi alterado, porque outra pessoa está mexendo no app).

Desfechos: `ps` = ligue 192 ou vá ao pronto-socorro agora; `hoje` = procure atendimento hoje (UBS,
pediatra ou pronto atendimento); `casa` = cuide em casa, com a lista de quando voltar.

---

## 1. Queda e batida na cabeça (`QUEDA_CABECA`)

Estrutura: alarme → mecanismo → idade → (menos de 3 meses: `bebe`) ou (3 meses a 1 ano e 11 meses:
`menor-2`) ou (2 anos ou mais: `maior-2`) → desfecho.

Desfechos: `ps`, `hoje-bebe` (hoje), `hoje`, `casa`.

Lógica geral: os fatores de alto risco e de risco intermediário do PECARN (Kuppermann 2009) que a família
consegue ver vão para `ps`, junto com os sinais de alarme da SBP (2025) e os critérios de envio ao
pronto-socorro da NICE NG232 (1.2.2 e 1.2.3). Ficam em `hoje` só os achados isolados que o próprio PECARN
estudou e que têm risco muito baixo de lesão importante (vômito único, galo fora da testa em menores de 2
anos), porque a conduta para eles é observar no serviço de saúde, não em casa. Abaixo de 3 meses, nada vai
para `casa`.

### 1.1 Passo `alarme`: qualquer item → `ps`

| Item (texto para os pais) | Fonte |
|---|---|
| Desmaiou ou ficou "apagada", mesmo por poucos segundos | SBP 2025 ("perda de consciência, mesmo breve"); PECARN (perda de consciência ≥ 5 s em < 2 anos, qualquer em ≥ 2 anos); NICE NG232 1.2.3 |
| Convulsão | SBP 2025; NICE NG232 1.2.2 (vai de ambulância) |
| Muito sonolenta, difícil de acordar, ou confusa, repete perguntas, não lembra | PECARN (estado mental alterado: sonolência, agitação, perguntas repetidas, resposta lenta); SBP 2017 e 2025; NICE NG232 1.2.3 (amnésia) |
| Não age como de costume, choro inconsolável, recusa mamar ou comer | PECARN < 2 anos ("not acting normally per parent"); SBP 2025 (< 2 anos: choro inconsolável, recusa alimentar, mudança de comportamento); NICE NG232 1.2.3 (irritabilidade em < 5 anos) |
| Vomitou mais de uma vez | PECARN ≥ 2 anos (vômito); SBP 2017 ("mais de dois episódios") e SBP 2025 ("três ou mais"). O corte em "mais de uma vez" é mais conservador que a SBP. Ver ponto P1 |
| Sangue ou líquido claro pelo nariz ou ouvido, manchas roxas em volta dos olhos ou atrás da orelha | PECARN ≥ 2 anos (sinais de fratura de base de crânio); SBP 2017 e 2025; NICE NG232, glossário |
| Afundamento na cabeça, ou moleira estufada | PECARN < 2 anos (fratura palpável); SBP 2025 (fratura visível ou palpável; fontanela abaulada) |
| Fraqueza, dificuldade para andar ou falar, visão dupla, olhos com movimento estranho | SBP 2025; NICE NG232 1.2.2 (déficit focal) |
| Dor de cabeça forte ou piorando | PECARN ≥ 2 anos (cefaleia intensa); NICE NG232 1.2.3 (cefaleia persistente) |
| Dor no pescoço, ou não mexe o pescoço | NICE NG232 (avaliação da coluna cervical); AHA e Cruz Vermelha Americana 2024 (restrição de movimento da coluna pelo leigo) |
| Corte que não para de sangrar após 10 minutos de pressão | AHA e Cruz Vermelha Americana 2024 (controle de sangramento por pressão direta). Não é critério do PECARN; entrou por segurança |

### 1.2 Passo `mecanismo`: qualquer item → `ps`

| Item | Fonte |
|---|---|
| < 2 anos e queda de mais de 90 cm | PECARN (> 3 pés em < 2 anos); SBP 2017 (> 0,9 m); SBP 2025 |
| ≥ 2 anos e queda de mais de 1,5 m | PECARN (> 5 pés em ≥ 2 anos); SBP 2017 e 2025 |
| Rolou mais de 5 degraus | NICE NG232, glossário (lesão de alta energia: queda de mais de 1 m ou mais de 5 degraus). Não está no PECARN |
| Atropelada, ou atingida por veículo de bicicleta ou patinete | PECARN; SBP 2017; NICE NG232 |
| Acidente com capotamento, ejeção ou alguém gravemente ferido | PECARN usa "morte de outro passageiro"; o texto diz "alguém se feriu gravemente", mais amplo, para não falar em morte com a família. Ver P2 |
| Objeto pesado caiu na cabeça, ou pancada forte com algo duro | PECARN e SBP 2017 ("cabeça atingida por objeto de alto impacto") |

As referências de altura (cintura e ombro de um adulto, trocador, colo de alguém em pé, beliche) são
aproximações escritas para leigos. Não vêm de fonte.

### 1.3 Passos por idade

| Passo | Item | Destino | Fonte |
|---|---|---|---|
| `bebe` (< 3 meses) | Galo em qualquer lugar; vomitou uma vez; corte; ninguém viu a batida | `ps` | PECARN: idade < 3 meses é fator a favor de tomografia entre os achados intermediários; Dayan 2014b (galo isolado: menor idade associada a lesão na tomografia); NICE NG232 1.2.3 (preocupação de proteção da criança) |
| `bebe` | nenhum | `hoje-bebe` | escolha de desenho conservadora: em < 3 meses nada vai para casa. Ver P3 |
| `menor-2` | Galo grande ou mole fora da testa | `hoje` | PECARN < 2 anos (hematoma não frontal = risco intermediário); Dayan 2014b: galo isolado, lesão clinicamente importante em 0,4%, nenhuma neurocirurgia; observação é opção |
| `menor-2` e `maior-2` | Vomitou uma vez | `hoje` | Dayan 2014a: vômito isolado, lesão clinicamente importante em 0,2%; "observação no pronto-socorro antes de decidir a tomografia parece apropriada". NICE manda ao pronto-socorro com qualquer vômito. Ver P1 |
| `maior-2` | Dor de cabeça que não passa; tonta ou enjoada | `hoje` | NICE NG232 1.2.3 (cefaleia persistente) e glossário (sintomas de concussão) |
| ambos | Corte aberto | `hoje` | precisa de sutura em horas; não é critério de lesão cerebral |
| ambos | Ninguém viu a batida | `hoje` | sem fonte direta; se ninguém viu, não dá para excluir perda de consciência (PECARN) |
| ambos | "Você sente que tem algo errado" | `hoje` | NICE NG232 1.2.5 (preocupação contínua da família) |
| ambos | nenhum | `casa` | PECARN: sem nenhum preditor, risco muito baixo e tomografia dispensável |

### 1.4 Conteúdo dos desfechos

| Orientação | Fonte |
|---|---|
| Pescoço: não levantar nem virar, esperar a ambulância | AHA e Cruz Vermelha Americana 2024 (restrição de movimento da coluna) |
| Maioria não precisa de tomografia; médico pode observar por algumas horas | SBP 2025 ("a maioria das crianças com TCE leve não precisa de tomografia"); SBP 2017 (observação mínima de 4 h, até 6 a 8 h) |
| 24 a 48 horas de observação, com um adulto pronto para sair | SBP 2025 ("as primeiras 24 a 48 horas são as mais críticas") |
| Pode dormir, não precisa acordar de hora em hora; ao acordar, deve agir como de costume e reconhecer o lugar | SBP 2025 (literal: "Não é necessário acordá-lo a cada hora") |
| Se dormir fora de hora ou houver dúvida, acordar com calma e ver se reconhece você | AAP, HealthyChildren, Head injury (o médico pode orientar checar a cada 2 a 3 h se a criança acorda o bastante para reconhecer os pais) |
| Compressa fria por 10 a 20 minutos nos dois primeiros dias | SBP 2025 |
| Só remédio indicado pelo médico, nada que dê sono | SBP 2025 ("administrar apenas os medicamentos orientados por um médico") |
| Evitar impacto e novas quedas nos próximos dias | SBP 2025 |

---

## 2. Manchas na pele (`MANCHAS_PELE`)

Estrutura: alarme → febre? → (febre e < 3 meses: `ps-bebe`) ou (febre e ≥ 3 meses: `febre-sinais`) →
`tipo` → `urticaria` / brotoeja / `picadas` / `mao-pe-boca` / `outras` → desfecho.

Desfechos: `ps`, `ps-bebe` (ps), `hoje`, `casa-urticaria`, `casa-brotoeja`, `casa-picadas`,
`casa-mao-pe-boca`, `casa`.

### 2.1 Passo `alarme`: qualquer item → `ps`

| Item | Quadro | Fonte |
|---|---|---|
| Manchas roxas ou vermelho-escuras, sem pancada que explique, que não somem no teste do copo | Doença meningocócica; com ou sem febre | MS, Meningite (gov.br): "manchas vermelhas ou arroxeadas na pele" são sinal de gravidade, atendimento imediato; NICE NG240 1.1.9 e 1.1.13 (exantema petequial ou purpúrico que não some → transferência de emergência); NICE NG143 (exantema que não some = vermelho). Sem febre: NICE NG12 1.10.2 (petéquias sem explicação → avaliação especializada imediata) |
| Falta de ar, chiado, rouquidão, voz diferente, dificuldade para engolir | Anafilaxia | SBP Anafilaxia 2021 e WAO 2020 (critérios: pele e respiratório) |
| Inchaço de lábios, língua ou em volta dos olhos | Angioedema / anafilaxia | SBP Anafilaxia 2021 (angioedema). Inchaço isolado das pálpebras sem outro sinal não é anafilaxia pelos critérios; entrou por pedido do projeto e por segurança. Ver P6 |
| Começou de repente, com vômitos sem parar ou dor de barriga forte | Anafilaxia | WAO 2020 (sintomas gastrintestinais graves após exposição provável) |
| Desmaio, muito molinha, pálida ou acinzentada, mãos e pés gelados | Choque (anafilaxia ou sepse) | WAO 2020; NICE NG240, tabela 3 (mãos e pés frios, cor anormal da pele); MS, Meningite |
| Convulsão, tremores, trancos repetidos, perda de equilíbrio | Meningite, encefalite (inclusive mão-pé-boca grave) | MS, Meningite (convulsões = gravidade); SBP Síndrome Mão-Pé-Boca 2019 (mioclonia, tremores, ataxia = sinal de alerta) |
| Bolhas grandes ou pele saindo em placas | Stevens-Johnson / necrólise epidérmica tóxica, pele escaldada | BAD 2018 (descolamento da epiderme) |
| Feridas na boca e nos lábios, com crostas ou sangue, e olhos vermelhos e doloridos | Stevens-Johnson | BAD 2018 (mucosite em dois ou mais locais, pródromo com febre, remédio novo nas últimas semanas) |

Teste do copo (texto de ajuda): "aperte a lateral de um copo de vidro transparente e olhe através dele".
O fluxo de febre já usa o mesmo teste, citando a NICE. Não achei texto do MS ou da SBP que descreva o
teste do copo em si; as fontes oficiais falam em manchas que "não somem à pressão". Ver P7.

### 2.2 Passos de febre

| Ponto | Destino | Fonte |
|---|---|---|
| Febre (axila > 37,3 °C) e < 3 meses | `ps-bebe` | SBP, Manejo da Febre Aguda 2021; NICE NG143; igual ao fluxo de febre |
| Febre há 5 dias ou mais | `hoje` | NICE NG143 (amarelo); SBP Kawasaki 2019 e AHA 2024 (febre ≥ 5 dias é o critério principal) |
| Olhos vermelhos sem remela; lábios rachados ou língua em morango; mãos e pés inchados ou descascando; íngua de um lado do pescoço | `hoje` | SBP Kawasaki 2019, critérios: hiperemia conjuntival bilateral sem exsudato, alterações de lábios e "língua em framboesa ou morango", edema de dorso de mãos e pés e descamação periungueal, linfonodo cervical ≥ 1,5 cm; AHA 2024 |
| Manchas que começam no rosto e atrás das orelhas e descem, com tosse ou nariz escorrendo | `hoje` | MS, Sarampo (gov.br): manchas no rosto e atrás das orelhas, depois no corpo, com tosse, coriza ou conjuntivite; "procure um serviço de saúde" |
| Bebendo ou fazendo xixi bem menos; bem mais quieta mesmo sem febre | `hoje` | NICE NG143 (amarelo) |
| nenhum | `tipo` | segue para identificar o tipo de mancha |

Kawasaki ficou em `hoje`, não em `ps`: o tratamento é no hospital, mas a janela é de dias (AHA 2024), e os
sinais de choque já estão no alarme. Ver P5.

### 2.3 Tipos de mancha

| Passo | Item | Destino | Fonte |
|---|---|---|---|
| `urticaria` | Começou logo após alimento, remédio ou picada de abelha, vespa ou formiga | `hoje` | SBP Urticária e angioedema 2023 (causas); SBP Anafilaxia 2021 (encaminhar ao especialista após reação alérgica); risco de evoluir para anafilaxia |
| `urticaria` | Juntas inchadas ou doloridas, não quer andar | `hoje` | sem fonte específica verificada; pensado para reação tipo doença do soro após antibiótico e para vasculite. Ver P8 |
| `urticaria` | Coceira impede dormir ou comer, ou piorando | `hoje` | SBP Urticária 2023 (sintomas mais graves ou refratários → avaliação) |
| `urticaria` | nenhum | `casa-urticaria` | SBP Urticária 2023 |
| `tipo` | Brotoeja | `casa-brotoeja` direto | AAP Heat rash 2024 (alarme e febre já foram perguntados antes) |
| `picadas` | Vermelhidão quente que aumenta; pus ou crosta cor de mel; coceira que impede dormir | `hoje` | SBP Picadas 2022 (reação local intensa pode imitar celulite); infecção secundária |
| `picadas` | nenhum | `casa-picadas` | SBP Picadas 2022 |
| `mao-pe-boca` | Bebe pouco, faz pouco xixi, não aceita líquido pela dor; muito quieta ou irritada | `hoje` | SBP Síndrome Mão-Pé-Boca 2019 (desidratação é a complicação mais frequente) |
| `mao-pe-boca` | nenhum | `casa-mao-pe-boca` | SBP Nota de Alerta nº 219, 2025 |
| `outras` | Mancha quente e dolorida que cresce; pus ou crosta cor de mel; após remédio novo; espalhando rápido; coceira que atrapalha o sono; "algo errado" | `hoje` | BAD 2018 (reação a remédio pode começar como mancha simples); demais itens por prudência, sem fonte específica |
| `outras` | nenhum | `casa` | NICE NG240 1.1.12 (orientar a família a observar se a mancha passa a não sumir) |

### 2.4 Conteúdo dos desfechos

| Orientação | Fonte |
|---|---|
| Com manchas que não somem e febre, sair agora sem esperar a febre baixar | NICE NG240 1.1.13; MS, Meningite |
| Anafilaxia: deitar de barriga para cima com as pernas elevadas; sentada se respira melhor; não ficar de pé nem andar | SBP Anafilaxia 2021 ("decúbito dorsal com membros inferiores elevados"; "levantar-se ou sentar-se subitamente estão associados a desfechos fatais"); WAO 2020 |
| Se já tem adrenalina autoinjetável receitada, aplicar na coxa por cima da roupa | SBP Anafilaxia 2021 (face anterolateral da coxa, por cima da roupa); AHA e Cruz Vermelha Americana 2024. O texto não dá dose. A SBP registra que o autoinjetor não era vendido no Brasil em 2021. Ver P6 |
| Levar a lista de remédios das últimas semanas | BAD 2018 (história de exposição a medicamentos) |
| Kawasaki tem tratamento e precisa ser reconhecida cedo | AHA 2024; SBP 2019 |
| Avisar na chegada que tem febre e manchas (sarampo passa fácil) | MS, Sarampo |
| Urticária: vergões mudam de lugar; em criança muitas vezes vem com virose; evitar o gatilho; remédio só o indicado | SBP Urticária e angioedema 2023 (infecções, alimentos, remédios e picadas como causas; anti-histamínico prescrito pelo pediatra) |
| Brotoeja: refrescar, secar, roupa leve de algodão, ventilador ou ar-condicionado, sem pomada grossa; voltar se febre, pus, comer menos, sem melhora em 3 dias ou piora em 24 h | AAP, Heat rash 2024 (todos os pontos) |
| Picadas: evitar novas picadas com roupa, mosquiteiro e telas; repelente só próprio para a idade; estrófulo dura semanas | SBP Picadas 2022 (os "3 P": prevenção, prurido e paciência; tabela de repelentes com idade permitida) |
| Mão-pé-boca: dura 7 a 10 dias; hidratação; antibiótico não ajuda; afastar da creche até as feridas secarem e a febre passar; vírus nas fezes por até 4 semanas | SBP Nota de Alerta nº 219, 2025 (todos os pontos); SBP 2019 |

---

## 3. Engasgo e objeto engolido (`ENGASGO`)

Estrutura: `agora` (escolha de um toque) →
- não tosse, não chora, não fala → `ps-engasgo` (manobras);
- desmaiou → `ps-inconsciente` (reanimação);
- engasgo com líquido → `liquido` → `depois`, `ps-sintomas` ou `ps-liquido`;
- tossindo → `tossindo` → `ps-engasgo`, `ps-inconsciente`, `ps-tosse` ou `depois`;
- já passou → `depois` (sinais → `ps-sintomas`) → `manobras` → `hoje-manobras` ou `casa`;
- engoliu algo → `objeto` → `ps-bateria`, `ps-objeto`, `ps-substancia` ou `objeto-sinais` (sinais →
  `ps-objeto`; nenhum → `hoje-objeto`).

Desfechos `ps`: `ps-engasgo`, `ps-inconsciente`, `ps-tosse`, `ps-liquido`, `ps-sintomas`, `ps-bateria`,
`ps-objeto`, `ps-substancia`. `hoje`: `hoje-manobras`, `hoje-objeto`. `casa`: `casa`.

O primeiro passo é uma escolha, não uma lista de sinais: em engasgo grave, um toque é mais rápido que
marcar e confirmar. O teste trava que as opções "não consegue tossir" e "desmaiou" levam a `ps`. O fluxo
alcança `casa` só quando o engasgo passou sozinho, com tosse, sem manobras e sem nenhum sinal depois.

### 3.1 Decisões

| Ponto | Destino | Fonte |
|---|---|---|
| Não tosse, não chora, não fala, não respira (comida, objeto ou desconhecido) | `ps-engasgo` | SBP nº 222, 2025 (obstrução completa: dificuldade para falar ou tossir, respiração ruidosa, palidez ou cianose, mãos no pescoço → manobras) |
| Desmaiou | `ps-inconsciente` | SBP nº 222, 2025 (perda de consciência: acionar o serviço de emergência e iniciar reanimação); AHA/AAP 2025 |
| Tossindo: deixar tossir, sem tapas e sem dedo na boca | passo `tossindo` | SBP nº 222, 2025 (obstrução parcial: manobras não indicadas, risco de deslocar o corpo estranho; varredura às cegas desestimulada; estimular a tosse) |
| Tosse fica fraca ou sem som | `ps-engasgo` | SBP nº 222 (tosse inefetiva → tapas nas costas antes das manobras); AHA/AAP 2025 (obstrução grave) |
| Continua tossindo, sem melhorar | `ps-tosse` | SBP nº 222 (sintomático com suspeita de aspiração → serviço hospitalar para radiografia). Ver P10 |
| Engasgo com líquido: sentar, limpar a boca, observar | passo `liquido` | SBP nº 222, 2025, conduta no engasgo por líquidos (passos 1 a 3) |
| Líquido: continua com falta de ar, chiado, desconforto | `ps-sintomas` | SBP nº 222 (item B: "leve-a a um Serviço de Emergência") |
| Líquido: parou de respirar | `ps-liquido` | SBP nº 222 (item C: estimular as costas esfregando, a maioria se recupera; item D: sem respiração e inconsciente, reanimação) |
| Depois: tosse persistente, chiado, esforço, rouquidão, baba, roxo, sensação de algo preso | `ps-sintomas` | SBP nº 222 (sintomático e estável → serviço hospitalar, radiografia; radiografia normal não exclui) |
| Depois, sem sinais, mas recebeu manobras | `hoje-manobras` | SBP nº 222 ("toda criança que foi submetida às manobras de desengasgo deve ser encaminhada para exame médico e de imagem") |
| Depois, sem sinais, sem manobras | `casa` | SBP nº 222 (corpo estranho retido por semanas pode causar inflamação e infecção → orientar retorno com tosse, chiado ou febre) |
| Bateria de botão, mesmo sem sintomas | `ps-bateria` | SBP Corpos Estranhos 2022 (lesão grave se não retirada em até 2 h; bateria no esôfago: retirada imediata); ESPGHAN 2021 (retirada preferencialmente em < 2 h); NASPGHAN 2015 |
| Ímã, mesmo um só | `ps-objeto` | SBP 2022 (um ímã no esôfago ou estômago: retirada urgente; dois ou mais: risco de fístula, perfuração, volvo); NASPGHAN 2015 |
| Pontudo, cortante ou comprido | `ps-objeto` | SBP 2022, tabela 1 (objetos longos, perfurantes ou cortantes: retirada imediata, < 2 h) |
| Remédio, produto ou planta | `ps-substancia` | SBP Intoxicações agudas na infância 2025 ("procure assistência médica imediatamente"; levar a embalagem; "nunca provoque vômito sem orientação médica") |
| Moeda ou objeto liso, ou não sabe, com qualquer sintoma | `ps-objeto` | SBP 2022 (disfagia, odinofagia, sialorreia, recusa alimentar, vômitos, saliva com sangue, dor torácica ou abdominal; tosse) |
| Moeda ou objeto liso, sem sintoma | `hoje-objeto` | SBP 2022 (radiografia diferencia moeda de bateria; moeda no esôfago assintomática: retirada em até 24 h; 70 a 80% passam sozinhos); NASPGHAN 2015 |

### 3.2 Manobras (texto de `ps-engasgo`)

| Orientação | Fonte |
|---|---|
| Bebê < 1 ano: de bruços no antebraço apoiado na coxa, cabeça mais baixa, segurando o queixo | SBP nº 222 (antebraço, mão segurando a face, cabeça mais baixa que o corpo) |
| 5 tapas entre as omoplatas com a base da mão | SBP nº 222 ("calcanhar da mão" entre as escápulas); AHA/AAP 2025 |
| Virar e fazer 5 compressões no meio do peito, abaixo da linha dos mamilos | SBP nº 222; AHA/AAP 2025 (ciclos de 5 tapas alternados com 5 compressões no peito) |
| Em bebê, não apertar a barriga | AHA/AAP 2025 ("abdominal thrusts are not recommended in infants") |
| Criança ≥ 1 ano: 5 tapas nas costas, depois 5 compressões na barriga (Heimlich), repetindo | AHA/AAP 2025 (ciclos de 5 tapas alternados com 5 compressões abdominais). A SBP (agosto de 2025, antes da AHA) indica a manobra de Heimlich e tapas nas costas quando a tosse fica inefetiva. Ver P9 |
| Técnica do Heimlich: atrás, mão fechada acima do umbigo, outra por cima, puxar para dentro e para cima | SBP nº 222 (entre o umbigo e o apêndice xifoide, para dentro e para cima) |
| Tirar da boca só o que estiver vendo | SBP nº 222 (varredura às cegas desestimulada) |
| Se desmaiar: chão, 192 no viva-voz, compressões | SBP nº 222; AHA/AAP 2025 |
| Examinar no mesmo dia mesmo se resolveu | SBP nº 222 |

### 3.3 Reanimação (`ps-inconsciente`)

Compressões a um terço do peito, 100 a 120 por minuto; no bebê, base de uma mão ou dois polegares (a
técnica de dois dedos saiu); na criança, uma ou duas mãos; 2 sopros a cada 30 compressões se souber,
senão só compressões; olhar a boca antes de soprar e tirar o objeto só se estiver vendo. Fonte: AHA/AAP,
Part 6: Pediatric Basic Life Support, 2025.

### 3.4 Mel na bateria de botão

Não está no texto do app. A SBP (Corpos Estranhos, 2022) e a ESPGHAN (2021) aceitam mel em maiores de 1
ano, quando a ingestão foi há 12 horas ou menos e a retirada vai demorar, sem atrasar a endoscopia. Mas as
duas dão a orientação com quantidade e intervalo, e este app não dá dose. O texto diz "não dê comida nem
bebida, a não ser que o 192 ou o médico oriente", o que deixa a decisão para quem regula o caso. O jejum
segue a SBP 2022 (retirada urgente "espera-se o tempo de jejum"). O teste trava a palavra "mel" no
fluxo. Ver P4.

---

## Pontos para o pediatra decidir

- **P1. Vômito depois da batida.** O app manda ao pronto-socorro agora com mais de um vômito e a
  atendimento hoje com um vômito só. A SBP para famílias (2025) usa "três ou mais" como alarme; a NICE
  NG232 manda ao pronto-socorro com qualquer vômito; o PECARN conta qualquer vômito em ≥ 2 anos. Manter
  "mais de uma vez" como alarme? Vômito único vai a `hoje` ou a `ps`?
- **P2. Mecanismo de acidente.** O PECARN usa "morte de outro passageiro". O texto diz "alguém se feriu
  gravemente", que é mais amplo e evita falar em morte. Aceitável?
- **P3. Bebê com menos de 3 meses sem nenhum sinal.** Hoje vai a `hoje-bebe` (avaliação em horas). Deve
  ir a `ps`? Também: bebê que ainda não rola e "caiu" levanta suspeita de lesão não acidental (NICE
  NG232 cita preocupação de proteção). O texto não fala disso com a família. Deve falar?
- **P4. Mel na bateria de botão** (ver 3.4). Incluir orientação de mel para maiores de 1 ano, sem
  quantidade, ou deixar só para o 192?
- **P5. Kawasaki em `hoje`.** Febre ≥ 5 dias com sinais de Kawasaki vai a `hoje`. Aceitável, ou `ps`?
- **P6. Inchaço só nas pálpebras e autoinjetor.** Inchaço em volta dos olhos sozinho vai a `ps` (pedido do
  projeto). Manter? E a frase sobre adrenalina autoinjetável receitada: manter, sabendo que o produto tem
  pouca disponibilidade no Brasil?
- **P7. Teste do copo.** Não há texto oficial brasileiro sobre o copo. Manter o nome "teste do copo"?
- **P8. Urticária com juntas inchadas.** Item sem fonte específica verificada (pensado para reação tipo
  doença do soro e vasculite). Manter em `hoje`?
- **P9. Manobra em maiores de 1 ano.** O app segue a AHA/AAP 2025 (5 tapas nas costas alternadas com 5
  compressões na barriga). A SBP (agosto de 2025) descreve a manobra de Heimlich, com tapas antes quando
  a tosse fica inefetiva. Confirmar que o texto deve seguir a AHA/AAP 2025 até a SBP atualizar.
  Também: compressão no peito do bebê. A SBP 2025 fala em dois dedos; a AHA/AAP 2025 tirou os dois dedos
  da reanimação do bebê (base de uma mão ou dois polegares). O texto de `ps-engasgo` não diz com o quê
  apertar. Especificar?
- **P10. Criança que continua tossindo.** Vai a `ps-tosse` (192 ou pronto-socorro). Alternativa:
  observar alguns minutos em casa e só então decidir. Qual?
- **P11. Intoxicação.** O app manda ligar 192 ou ir ao pronto-socorro. A SBP (2025) aponta também os
  Centros de Informação Toxicológica, que são regionais; o Disque-Intoxicação da Anvisa é nacional
  (número não conferido nesta revisão). A regra do projeto proíbe nome de serviço regional. Incluir o
  número nacional?
- **P12. Fontes com "câncer" no título.** A NICE NG12 (petéquias sem explicação → avaliação imediata)
  sustenta o item de manchas sem febre, mas ficou fora da lista de fontes mostrada às famílias, para não
  assustar. Está aqui. Concordam?

## Onde a evidência é fraca

- **Tradução do PECARN para os pais.** O PECARN foi feito com médico examinando, não com pais
  respondendo. "Estado mental alterado", "hematoma não frontal" e "fratura palpável" viraram frases
  leigas; ninguém validou que os pais as reconhecem.
- **Alturas em objetos do dia a dia** (trocador, beliche, cintura e ombro de adulto): aproximação nossa.
- **`hoje` no trauma de crânio.** Nenhuma diretriz tem um nível "hoje, nas próximas horas" para batida na
  cabeça. A NICE manda tudo que não é casa ao pronto-socorro. O nível `hoje` foi usado para os achados
  isolados de risco muito baixo (Dayan 2014a e 2014b), e o texto diz "nas próximas horas, não deixe
  para amanhã".
- **Acordar a criança à noite.** A SBP 2025 diz que não precisa acordar de hora em hora; a AAP diz que o
  médico pode pedir para checar a cada 2 a 3 horas. O texto ficou no meio: deixa dormir e acorda se
  houver dúvida.
- **Engasgo com líquido** é tratado de forma diferente pela SBP (sem tapas) e não é separado pela AHA. O
  app segue a SBP. Há pouca evidência publicada (a própria SBP diz que os dados são escassos).
- **Itens sem fonte específica:** "ninguém viu a batida", "corte aberto", itens do passo `outras` das
  manchas, "juntas inchadas" na urticária, cuidados de prevenção de engasgo além da lista da SBP
  (cortar em pedaços pequenos, comer sentado). São prudência clínica, não diretriz.
- **Brotoeja:** não achei documento da SBP ou do MS; a fonte é a AAP (2024).

## Fontes verificadas

Brasileiras:

1. Sociedade Brasileira de Pediatria, Departamento Científico de Emergência. Traumatismo cranioencefálico
   leve na infância. Pediatria para Famílias, publicado/atualizado em outubro de 2025.
   https://www.sbp.com.br/pediatria-para-familias/seguranca-e-prevencao/traumatismo-cranioencefalico-leve-na-infancia/
2. Sociedade Brasileira de Pediatria, Departamento Científico de Terapia Intensiva. Trauma
   cranioencefálico. Guia Prático de Atualização nº 1, abril de 2017. (Cita o PECARN; alturas de 0,9 m e
   1,5 m.)
3. Sociedade Brasileira de Pediatria, Curso de Suporte Básico de Vida. Obstrução de vias aéreas por corpo
   estranho e engasgo por líquidos: o que fazer? Guia Prático de Atualização nº 222, 1º de agosto de 2025.
4. Sociedade Brasileira de Pediatria, Departamento Científico de Gastroenterologia. Ingestão de Corpos
   Estranhos. 2022.
5. Sociedade Brasileira de Pediatria, Departamento Científico de Toxicologia e Saúde Ambiental.
   Intoxicações agudas na infância. Pediatria para Famílias, setembro de 2025.
6. Sociedade Brasileira de Pediatria, Departamento Científico de Alergia. Anafilaxia: atualização 2021.
   Guia Prático de Atualização nº 6, 31 de maio de 2021.
7. Sociedade Brasileira de Pediatria, Departamento Científico de Alergia. Urticária e angioedema.
   Pediatria para Famílias, maio de 2023.
8. Sociedade Brasileira de Pediatria, Departamento Científico de Dermatologia. Picadas de inseto: prurigo
   estrófulo ou urticária papular, atualização. Documento Científico nº 12, 8 de fevereiro de 2022.
9. Sociedade Brasileira de Pediatria, Departamento Científico de Reumatologia. Doença de Kawasaki.
   Documento Científico nº 6, novembro de 2019.
10. Sociedade Brasileira de Pediatria, Departamentos Científicos de Dermatologia e de Infectologia.
    Síndrome mão-pé-boca. Documento Científico, setembro de 2019.
11. Sociedade Brasileira de Pediatria, Departamentos Científicos de Dermatologia e de Infectologia.
    Tratamento da doença mão-pé-boca em crianças. Nota de Alerta nº 219, 15 de julho de 2025.
12. Sociedade Brasileira de Pediatria. Manejo da Febre Aguda. Documento científico, 2021 (já usado no
    fluxo de febre).
13. Ministério da Saúde. Meningite. Saúde de A a Z, gov.br (consultado em novembro de 2026).
    https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/m/meningite
14. Ministério da Saúde. Sarampo. Saúde de A a Z, gov.br (consultado em novembro de 2026).
    https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/sarampo

Internacionais:

15. Kuppermann N, Holmes JF, Dayan PS e cols. Identification of children at very low risk of
    clinically-important brain injuries after head trauma: a prospective cohort study. Lancet
    2009;374(9696):1160-70. https://doi.org/10.1016/S0140-6736(09)61558-0
16. Dayan PS, Holmes JF, Atabaki S e cols. Association of traumatic brain injuries with vomiting in
    children with blunt head trauma. Ann Emerg Med 2014;63(6):657-65 (Dayan 2014a).
    https://doi.org/10.1016/j.annemergmed.2014.01.009
17. Dayan PS, Holmes JF, Schutzman S e cols. Risk of traumatic brain injuries in children younger than 24
    months with isolated scalp hematomas. Ann Emerg Med 2014;64(2):153-62 (Dayan 2014b).
    https://doi.org/10.1016/j.annemergmed.2014.02.003
18. NICE NG232. Head injury: assessment and early management. Publicada em 18 de maio de 2023.
19. NICE NG240. Meningitis (bacterial) and meningococcal disease: recognition, diagnosis and management.
    Publicada em 19 de março de 2024.
20. NICE NG12. Suspected cancer: recognition and referral. 2015, atualizada em abril de 2026
    (recomendação 1.10.2). Fora da lista mostrada às famílias; ver P12.
21. NICE NG143. Fever in under 5s: assessment and initial management. 2019 (já usada no fluxo de febre).
22. Joyner BL, Dewan M, Bavare A e cols. Part 6: Pediatric Basic Life Support: 2025 American Heart
    Association and American Academy of Pediatrics Guidelines for Cardiopulmonary Resuscitation and
    Emergency Cardiovascular Care. Circulation 2025;152(16 supl. 2):S424-S447.
    https://doi.org/10.1161/CIR.0000000000001370
23. Hewett Brumberg EK, Douma MJ, Alibertis K e cols. 2024 American Heart Association and American Red
    Cross Guidelines for First Aid. Circulation 2024;150(24):e519-e579.
    https://doi.org/10.1161/CIR.0000000000001281
24. Mubarak A, Benninga MA, Broekaert I e cols. Diagnosis, management, and prevention of button battery
    ingestion in childhood: a European Society for Paediatric Gastroenterology Hepatology and Nutrition
    position paper. J Pediatr Gastroenterol Nutr 2021;73(1):129-36.
    https://doi.org/10.1097/MPG.0000000000003048
25. Kramer RE, Lerner DG, Lin T e cols. Management of ingested foreign bodies in children: a clinical
    report of the NASPGHAN Endoscopy Committee. J Pediatr Gastroenterol Nutr 2015;60(4):562-74.
    https://doi.org/10.1097/MPG.0000000000000729
26. Cardona V, Ansotegui IJ, Ebisawa M e cols. World Allergy Organization anaphylaxis guidance 2020. World
    Allergy Organ J 2020;13(10):100472. https://doi.org/10.1016/j.waojou.2020.100472
27. McPherson T, Exton LS, Biswas S e cols. British Association of Dermatologists' guidelines for the
    management of Stevens-Johnson syndrome/toxic epidermal necrolysis in children and young people, 2018.
    Br J Dermatol 2019;181(1):37-54. https://doi.org/10.1111/bjd.17841
28. Jone PN, Tremoulet A, Choueiter N e cols. Update on diagnosis and management of Kawasaki disease: a
    scientific statement from the American Heart Association. Circulation 2024;150(23):e481-e500.
    https://doi.org/10.1161/CIR.0000000000001295
29. American Academy of Pediatrics, Section on Dermatology. Heat rash (prickly heat) in babies & young
    children. HealthyChildren.org, atualizado em 12 de setembro de 2024.
30. American Academy of Pediatrics. Head injury in children: how to know if it's minor or serious.
    HealthyChildren.org, atualizado em 10 de dezembro de 2024 (usado só para a orientação de checar se a
    criança acorda; fora da lista mostrada às famílias).

Os metadados dos artigos 15 a 17 e 22 a 28 foram conferidos no PubMed.
