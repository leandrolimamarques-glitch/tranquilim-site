# Revisão médica: fluxos "Tosse e falta de ar" e "Vômito e diarreia"

Rascunho para o pediatra e para o médico de emergência/UTI. Código em
`src/conteudo/fluxos/respiratorio.ts` e `src/conteudo/fluxos/vomito-diarreia.ts`; testes em
`src/conteudo/fluxos/fluxos-a.test.ts`.

Como foi feito: cada fonte abaixo foi aberta e o trecho usado foi lido no documento original (PDF ou
página oficial) em novembro de 2026. Nenhum texto do app traz dose, volume, gotas ou nome comercial. O
único número de telefone é o 192.

Desfechos: `ps` = ligue 192 ou vá ao pronto-socorro agora; `hoje` = procure atendimento hoje (UBS,
pediatra ou pronto atendimento); `casa` = cuide em casa, com a lista de quando voltar.

---

## 1. Tosse e falta de ar (`RESPIRATORIO`)

Estrutura: alarme → idade → contagem da respiração por 1 minuto (limite por idade) → (menos de 3 meses:
sinais do bebê) ou (3 meses ou mais: sinais de atenção) → desfecho.

Desfechos: `ps`, `ps-bebe` (ps), `hoje-bebe`, `hoje-rapida`, `hoje`, `casa`.

### 1.1 Passo `alarme`: qualquer item → `ps`

| Item (texto para os pais) | Fonte |
|---|---|
| Pausas na respiração | NICE NG9, 1.2.1 (apneia observada ou relatada → emergência); 1.1.5 lembra que menores de 6 semanas podem ter só apneia |
| Lábios, língua ou rosto roxos ou acinzentados | NICE NG9, 1.2.1 (cianose central); OMS 2013, tabela 7 (pneumonia grave) |
| A pele afunda embaixo das costelas, entre elas ou na base do pescoço | MS AIDPI 2017: tiragem subcostal = PNEUMONIA GRAVE, referir urgentemente; NICE NG9 (tiragem acentuada); NICE NG143 1.2.5 (tiragem moderada/grave = alto risco) |
| Geme ao soltar o ar, ou narinas abrem e fecham | MS AIDPI 2017, 1.2: "batimento de asa do nariz e/ou gemência" é sinal geral de perigo; NICE NG9 (gemido) |
| Barulho alto e áspero ao puxar o ar, mesmo calma | MS AIDPI 2017: estridor em repouso = PNEUMONIA GRAVE OU DOENÇA MUITO GRAVE; SBP Crupe 2017 (estridor em repouso = risco de falência respiratória) |
| Tanta falta de ar que não fala ou não chora direito | MS AIDPI 2017, sibilância grave ("fala frases incompletas; no lactente, choro curto ou não consegue chorar") |
| Não consegue mamar, comer ou beber, ou vomita tudo | MS AIDPI 2017, sinais gerais de perigo |
| Muito sonolenta, difícil de acordar, molinha, ou agitada sem se acalmar | MS AIDPI 2017 (letárgica; sibilância grave: "letargia ou sempre agitada"); NICE NG9 (exaustão) |
| Convulsão | MS AIDPI 2017, sinais gerais de perigo |
| 12 horas ou mais sem xixi | NICE NG9, 1.6.1 (sinal de alerta para os pais: "no wet nappy for 12 hours") |
| Engasgou e continua tossindo, com chiado ou falta de ar | SBP, Guia Prático nº 222 (2025): suspeita de aspiração de corpo estranho, sintomática e estável, vai a serviço hospitalar para radiografia |

### 1.2 Passo `idade` e contagem

| Ponto | Destino | Fonte |
|---|---|---|
| Menos de 3 meses: 60 ou mais por minuto | `ps-bebe` | OMS 2013, 3.6 (sinais de perigo no lactente jovem: respiração ≥ 60) |
| Menos de 3 meses: menos de 60, ou não conseguiu contar | passo `bebe` | ver 1.3 |
| 3 a 11 meses: 50 a 59 | `hoje-rapida` | MS AIDPI 2017 e OMS 2013: ≥ 50 em 2 a 11 meses = respiração rápida (PNEUMONIA, tratamento ambulatorial, retorno em 2 dias) |
| 1 ano ou mais: 40 a 59 | `hoje-rapida` | MS AIDPI 2017 e OMS 2013: ≥ 40 de 1 a 5 anos |
| 60 ou mais, em qualquer idade | `ps` | NICE NG143, 1.2.5 (FR > 60 = grupo de alto risco); NICE NG9, 1.2.2 (FR > 60: considerar encaminhar ao hospital; > 70: emergência) |
| Não conseguiu contar (3 meses ou mais) | `atencao` | escolha de desenho: não trava o fluxo; o passo de atenção tem os sinais de esforço |

Instrução de contagem (texto do app): criança calma, de preferência dormindo, roupa levantada, 1 minuto
inteiro, não contar chorando ou mamando, repetir se houver dúvida. Fonte: MS AIDPI 2017, 1.3 (contar
durante 1 minuto, repetir se a criança estava agitada).

### 1.3 Passo `bebe` (menos de 3 meses): qualquer item → `ps-bebe`; nenhum → `hoje-bebe`

| Item | Fonte |
|---|---|
| Mama bem menos, ou se cansa e para no meio da mamada | OMS 2013, 3.6 ("not feeding well" é sinal de perigo no lactente jovem); NICE NG9, 1.2.2 |
| Febre (axila acima de 37,3 °C) | SBP, Manejo da Febre Aguda (2021) e coerência com o fluxo de febre (menos de 3 meses com febre → PS) |
| Crises de tosse que deixam o rosto vermelho ou roxo, ou terminam em vômito ou som agudo | MS, Guia de Vigilância em Saúde 6ª ed. (2023), coqueluche: menores de 6 meses têm formas graves, com cianose, apneia e vômitos |
| Nenhum dos itens → `hoje-bebe` | NICE NG9, 1.2.3 (idade abaixo de 3 meses é fator de risco de bronquiolite grave). Ver ponto P1 |

### 1.4 Passo `atencao` (3 meses ou mais): qualquer item → `hoje`; nenhum → `casa`

| Item | Fonte |
|---|---|
| Chiado no peito | MS AIDPI 2017: sibilância deve ser avaliada e tratada antes de classificar a tosse |
| Tosse rouca, de cachorro | SBP Crupe 2017: até o crupe leve recebe corticoide em dose única antes da alta |
| Crises de tosse com som agudo (guincho) ou vômito | MS, Guia de Vigilância em Saúde (2023), coqueluche: tosse paroxística, guincho, vômito pós-tosse |
| Mama, come ou bebe cerca de metade do normal | NICE NG9, 1.2.2 e 1.6.1 (ingestão de 50 a 75% do habitual) |
| Bem menos xixi | NICE NG9, 1.2.2 (desidratação clínica); NICE NG143, 1.2.6 (diurese reduzida) |
| Febre que apareceu depois, ou que piora | MS AIDPI 2017, 2.11 (retornar imediatamente se "aparecimento ou piora da febre") |
| Doença do coração ou do pulmão, baixa imunidade, ou prematura com menos de 2 anos | NICE NG9, 1.2.3 (fatores de risco de bronquiolite grave) |
| Está piorando, ou "você sente que tem algo errado" | Piora: MS AIDPI 2017, 2.11 ("piora do estado geral"). Preocupação dos pais: sem fonte específica, mantido por coerência com o fluxo de febre |

### 1.5 Cuidados em casa (`casa`) e quando voltar

| Orientação | Fonte |
|---|---|
| Oferecer o peito mais vezes; líquidos para quem já come | MS AIDPI 2017, "aliviar a tosse com medidas caseiras" (para menor de 6 meses em aleitamento exclusivo, só o peito) |
| Lavar o nariz com soro fisiológico, sem força | SBP, Lavagem nasal, Guia Prático nº 120 (2023): sintomas das rinites virais "parecem responder muito bem"; MS AIDPI 2017: no nariz, nada além de soro fisiológico |
| Não dar xarope, expectorante, descongestionante, antigripal, anti-inflamatório | MS AIDPI 2017: "remédios nocivos a desencorajar" |
| Não dar mel antes de 2 anos; antes de 1 ano, risco de botulismo | MS, Guia Alimentar para Crianças Brasileiras Menores de 2 Anos (2019), p. 104. Ver ponto P8 |
| Menor de 1 ano: barriga para cima, colchão firme e reto, não inclinar o berço | SBP, Nota de Alerta nº 56 (2023), resumo da AAP 2022 (superfície rígida e não inclinada; não elevar a cabeceira) |
| Ninguém fuma em casa | NICE NG9, 1.6.1 |
| Tosse melhora em 1 a 2 semanas, pode durar até 3; passou de 2 semanas → consulta | MS AIDPI 2017 (resfriado melhora em 1 a 2 semanas; tosse > 14 dias → investigar); NICE NG9, 1.1.2 (tosse some em 90% em até 3 semanas) |

A cabeceira elevada, citada no pedido como controversa, ficou de fora de propósito: para menores de 1 ano
a SBP (2023, com a AAP 2022) recomenda superfície não inclinada; para maiores não achei recomendação
brasileira nem internacional a favor.

---

## 2. Vômito e diarreia (`VOMITO_DIARREIA`)

Estrutura: alarme → idade → (menos de 3 meses: sinais do bebê → diarreia ou golfada) ou (3 meses ou
mais: sinais de desidratação → sinais de alerta do Plano A) → desfecho.

Desfechos: `ps`, `ps-bebe` (ps), `hoje-bebe`, `hoje-desidratacao`, `hoje`, `casa`, `casa-golfada` (casa).

### 2.1 Passo `alarme`: qualquer item → `ps`

| Item | Fonte |
|---|---|
| Muito molinha, difícil de acordar, não reage | MS, Manejo do paciente com diarreia (2023): "comatoso, hipotônico, letárgico" (coluna C); MS AIDPI 2017; NICE CG84, tabela 1 |
| Não consegue mamar ou beber, ou vomita tudo | MS AIDPI 2017, sinais gerais de perigo; MS 2023 ("não é capaz de beber") |
| Vômito verde ou verde-amarelado, ou com sangue | NICE CG84, 1.1.1.4 (vômito bilioso); NICE NG1, tabela 1 (bile = possível obstrução, cirurgia pediátrica; hematêmese) |
| Barriga muito inchada ou dura, dor forte que não passa | NICE CG84, 1.1.1.4 (dor intensa ou localizada, distensão, descompressão dolorosa) |
| Mãos e pés frios, pele pálida, manchada ou acinzentada | NICE CG84, tabela 1 (sinais de choque); MS 2023 (pulso fraco ou ausente) |
| Respira muito rápido ou com esforço | NICE CG84, 1.1.1.4 e tabela 1 (taquipneia) |
| Convulsão | MS AIDPI 2017, sinais gerais de perigo; NICE CG84, 1.2.1.4 (suspeita de hipernatremia) |
| 12 horas ou mais sem xixi | NICE NG9, 1.6.1 (o mesmo corte do fluxo respiratório). Ver ponto V8 |
| Manchas que não somem com o copo de vidro | NICE CG84, 1.1.1.4 |
| Moleira estufada, ou dor forte ao dobrar o pescoço | NICE CG84, 1.1.1.4 |
| Começou a vomitar depois de bater a cabeça | NICE NG232, 1.2.3 (serviço remoto encaminha ao pronto-socorro se houve qualquer vômito desde a batida). Ver ponto V9 |
| Pode ter engolido pilha pequena e redonda ou ímã | SBP, Ingestão de corpos estranhos (2022): bateria no esôfago exige retirada em até 2 horas |

### 2.2 Menores de 3 meses

| Ponto | Destino | Fonte |
|---|---|---|
| Vomitou várias vezes (não é golfada) | `ps-bebe` | Pedido do projeto; NICE CG84, 1.2.1.2 (menor de 6 meses tem mais risco de desidratação) |
| Vômito em jato | `ps-bebe` | NICE NG1, tabela 1 (vômito em jato até 2 meses sugere estenose hipertrófica de piloro) |
| Febre (axila acima de 37,3 °C) | `ps-bebe` | NICE CG84, 1.1.1.4 (≥ 38 °C abaixo de 3 meses sugere outra doença); coerência com o fluxo de febre |
| Mama bem menos | `ps-bebe` | OMS 2013, 3.6 |
| Menos xixi, boca seca ou moleira afundada | `ps-bebe` | NICE CG84, tabela 1; AAP, HealthyChildren (moleira afundada) |
| Diarreia, ou vomitou uma vez | `hoje-bebe` | NICE CG84, 1.2.1.2. Ver ponto V2 |
| Só golfadas, bebê bem | `casa-golfada` | NICE NG1, 1.1.1 a 1.1.4 (golfada é comum, começa antes de 8 semanas, some em 90% até 1 ano, não precisa de exame nem tratamento) |

A ajuda do passo explica que cocô mole e frequente do bebê em aleitamento exclusivo não é diarreia
(SBP, Diarreia aguda infecciosa, 2023).

### 2.3 Passo `desidratacao` (3 meses ou mais): qualquer item → `hoje-desidratacao`; nenhum → `atencao`

| Item | Fonte |
|---|---|
| Bem menos xixi, fralda seca por mais tempo | MS 2023 (sinal de alerta: diminuição da diurese); NICE CG84, tabela 1 |
| Chora sem lágrimas | MS 2023 (lágrimas ausentes) |
| Boca e língua secas | MS 2023; NICE CG84, tabela 1 |
| Olhos fundos | MS 2023; MS AIDPI 2017; NICE CG84 |
| Moleira afundada | AAP, Signs of Dehydration in Infants & Children (HealthyChildren.org, atualizado em 2019). Não está no cartaz do MS |
| Muita sede, bebe com pressa | MS 2023 ("sedento, bebe rápido e avidamente") |
| Irritada ou inquieta, não se acalma | MS 2023 ("irritado, intranquilo"); MS AIDPI 2017 |

`hoje-desidratacao` corresponde ao Plano B (reidratação oral supervisionada no serviço de saúde) do MS
2023: o texto pede atendimento "de preferência nas próximas horas" e soro de reidratação oral em goles
enquanto isso, esperando 10 minutos se vomitar (MS AIDPI 2017, Plano A).

### 2.4 Passo `atencao`: qualquer item → `hoje`; nenhum → `casa`

| Item | Fonte |
|---|---|
| Vômitos se repetindo | MS 2023, sinais de alerta do Plano A |
| Diarreia piorando | MS 2023 |
| Sangue no cocô | MS 2023; MS AIDPI 2017 (disenteria); NICE CG84 |
| Recusa comer | MS 2023 ("recusa de alimentos") |
| Febre de 39 °C ou mais | MS 2023, D.4.1 (investigar outra causa); NICE CG84, 1.1.1.4 |
| 2 dias sem melhora | MS 2023 ("não melhorar em 2 dias"); SBP 2023 |
| Parece mais doente, piora, ou "algo errado" | NICE CG84, tabela 1 ("appears to be unwell or deteriorating"); preocupação dos pais por coerência com o fluxo de febre |

### 2.5 Cuidados em casa (`casa`, Plano A) e golfadas (`casa-golfada`)

| Orientação | Fonte |
|---|---|
| Mais líquido que o normal, goles pequenos, depois de cada cocô líquido ou vômito: SRO, água, sopa, caldo | MS 2023, A.1.1; MS AIDPI 2017, Plano A |
| Em aleitamento exclusivo, só o peito e o SRO | MS 2023, A.2.2 |
| SRO preparado como diz a embalagem; preparar a cada dia | MS AIDPI 2017 (jogar fora o que sobrou do dia anterior); NICE CG84, 1.8.1.2 |
| Se vomitar, esperar 10 minutos e oferecer devagar | MS AIDPI 2017, Plano A |
| Manter o peito e a comida de sempre, sem jejum nem dieta | MS 2023, A.2.1; SBP 2023 |
| Sem refrigerante nem suco industrializado; não adoçar chá ou suco | MS 2023, A.1.2; MS AIDPI 2017; NICE CG84, 1.8.1.2 |
| Sem remédio para parar diarreia ou vômito, nem antibiótico sem receita | MS 2023 ("antidiarreicos não devem ser usados"; antiemético só no Plano B, no serviço); MS AIDPI 2017; NICE CG84 |
| Lavar as mãos, não dividir toalhas | MS 2023, A.4.3; NICE CG84, 1.8.2 |
| Duração esperada; creche ou escola só 48 horas depois do último episódio | NICE CG84, 1.1.1.3 e 1.8.2 |
| Golfada: não usar posição inclinada para dormir | NICE NG1, 1.2.1; SBP Nota de Alerta nº 56 (2023) |
| Golfada: voltar se jato, verde, sangue, sofrimento nas mamadas, não ganhar peso, ou depois de 1 ano | NICE NG1, 1.1.4 |

---

## 3. Pontos para o pediatra decidir

Respiratório

- **P1. Todo bebê com menos de 3 meses e tosse vai a `hoje`, mesmo sem nenhum sinal.** É a opção
  conservadora. A NICE NG9 trata a idade abaixo de 3 meses como fator de risco, não como indicação de
  consulta no mesmo dia. Alternativa: mandar a `casa` com volta rápida quando for só nariz entupido.
- **P2. Batimento de asa do nariz está no alarme (`ps`) aqui, mas no fluxo de febre está em atenção
  (`hoje`).** O AIDPI 2017 brasileiro trata como sinal geral de perigo; a NICE NG143 como risco
  intermediário. Os dois fluxos precisam dizer a mesma coisa.
- **P3. Tiragem subcostal leva a `ps`.** O AIDPI 2017 mantém como pneumonia grave; a OMS 2013 passou a
  tiragem isolada para "pneumonia" com tratamento em casa. Seguimos o MS e o padrão mais seguro, porque os
  pais não graduam tiragem.
- **P4. Cortes de frequência respiratória.** "60 ou mais" leva a `ps` em todas as idades (NICE usa
  "acima de 60"; a NG9 manda para emergência só acima de 70). De 5 a 6 anos usamos o corte de 40, que a
  OMS e o AIDPI definem até 5 anos.
- **P5. 12 horas sem xixi leva a `ps`.** A NG9 lista como sinal de alerta que pede "ajuda imediata", sem
  dizer se é emergência. Pode virar `hoje`.
- **P6. Febre junto com tosse.** O pedido sugeria "febre há mais de 3 dias". Não achei fonte para esse
  corte. Ficou "febre que apareceu depois ou está piorando" (AIDPI 2017); a duração de 5 dias está no
  fluxo de febre (NICE NG143). Decidir se entra um corte de 3 dias.
- **P7. Prematuridade.** A NG9 destaca nascidos com menos de 32 semanas. O texto diz "prematura e menos
  de 2 anos", sem idade gestacional, para os pais conseguirem responder.
- **P8. Mel.** O AIDPI 2017 aceita mel a partir de 1 ano como medida caseira para a tosse; o Guia Alimentar
  do MS (2019) não recomenda mel antes de 2 anos. O texto segue o Guia (mais recente e mais restritivo).
- **P9. "Você sente que tem algo errado".** Sem fonte específica nos dois fluxos; mantido por coerência com
  o fluxo de febre.

Vômito e diarreia

- **V1. Um só sinal de desidratação já leva a `hoje-desidratacao`.** O MS e o AIDPI pedem dois ou mais
  sinais para classificar "com desidratação". Escolhemos um sinal porque os pais avaliam pior que o
  profissional; isso aumenta as idas à UBS (sede sozinha, por exemplo).
- **V2. Menores de 3 meses.** Vômitos repetidos levam a `ps` (pedido do projeto, sem corte numérico em
  diretriz); diarreia ou um vômito leva a `hoje`; só golfadas, a `casa`. Confirmar se "vômitos repetidos"
  precisa de número (ex.: 2 ou mais em 24 horas).
- **V3. 3 a 6 meses não têm tratamento especial.** A NICE CG84 diz que menores de 6 meses desidratam mais.
  Pode entrar um item "tem menos de 6 meses" no passo de atenção.
- **V4. Sangue no cocô leva a `hoje`, não a `ps`** (MS e AIDPI: disenteria é tratada na unidade). A
  invaginação intestinal (crises de choro com as pernas encolhidas, cocô em geleia) não tem item próprio;
  hoje depende de "dor forte" ou "barriga inchada ou dura" no alarme. Decidir se merece item.
- **V5. "2 dias sem melhorar" (MS 2023) leva a `hoje`.** A NICE dá prazos maiores (vômito até 3 dias,
  diarreia 5 a 7 dias). Seguimos o MS.
- **V6. Zinco.** MS 2023 e SBP 2023 indicam zinco para menores de 5 anos com diarreia (Plano A). O app não
  cita porque é remédio com dose; decidir se os desfechos `hoje` dizem "pergunte ao médico sobre o zinco".
- **V7. Soro caseiro.** O MS ainda lista soro caseiro entre os líquidos do Plano A. Não ensinamos a
  receita (teria quantidades); o texto manda usar SRO da UBS ou da farmácia.
- **V8. 12 horas sem xixi leva a `ps`** (mesma decisão de P5), além de "bem menos xixi" levar a
  `hoje-desidratacao`.
- **V9. Vômito depois de batida na cabeça leva a `ps` aqui; o fluxo `queda-cabeca.ts` manda a `ps` só
  com mais de um vômito.** A NG232, 1.2.3 (aconselhamento à distância) pede pronto-socorro com qualquer
  vômito; a 1.2.4 deixa ao julgamento clínico em menores de 12 anos. Os dois fluxos precisam combinar.
- **V10. Pilha e ímã no alarme.** É ingestão, não gastroenterite; entrou porque o vômito pode ser o
  primeiro sinal. Talvez caiba num fluxo próprio de engasgo e ingestão.
- **V11. Doença crônica** (diabetes, doença renal, desnutrição) não tem item. A NICE CG84 cita desnutrição
  como risco de desidratação; vômito em criança com diabetes tipo 1 é emergência.

## 4. Onde a evidência é fraca

- Lavagem nasal: a própria SBP (2023) diz que a literatura é grande, mas de baixa qualidade.
- Cortes de frequência respiratória contados pelos pais: os limites da OMS foram validados com
  profissionais treinados. Não achei estudo de contagem feita pelos pais.
- "12 horas sem xixi" vem de material da NICE para bronquiolite; não há corte em horas no MS nem na NICE
  CG84.
- "Moleira afundada" só aparece em material da AAP para famílias, não no cartaz do MS nem na NICE CG84.
- Desfecho `hoje` para todo menor de 3 meses com tosse ou diarreia é decisão conservadora, não regra de
  diretriz.

## 5. Fontes conferidas

- Ministério da Saúde, OPAS, UNICEF. Manual AIDPI Criança: 2 meses a 5 anos. Brasília, 2017. ISBN
  978-85-334-2501-9. Registro: https://portaldeboaspraticas.iff.fiocruz.br/biblioteca/manual-de-quadros-de-procedimentos-aidpi-crianca-2-meses-a-5-anos/
- Ministério da Saúde. Manejo do paciente com diarreia: avaliação do estado de hidratação do paciente
  (cartaz). Brasília, 2023. https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dda/publicacoes/manejo-do-paciente-com-diarreia-avaliacao-do-estado-de-hidratacao-do-paciente
- Ministério da Saúde. Guia de Vigilância em Saúde, 6ª ed., vol. 1 (coqueluche). Brasília, 2023.
- Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. Brasília, 2019 (p. 104, mel).
- SBP, Departamento de Gastroenterologia. Diarreia aguda infecciosa. Guia Prático de Atualização nº 74, 6 jun. 2023.
  https://www.sbp.com.br/fileadmin/user_upload/24048g-GPA-Diarreia_Aguda_Infecciosa.pdf
- SBP, Departamento de Otorrinolaringologia. Lavagem nasal. Guia Prático de Atualização nº 120, 30 nov. 2023.
  https://www.sbp.com.br/fileadmin/user_upload/24053f-GPA_ISBN_-_Lavagem_Nasal.pdf
- SBP, Departamento de Emergências. Crupe viral e bacteriano. Guia Prático de Conduta nº 1, jan. 2017.
  https://www.sbp.com.br/fileadmin/user_upload/2017/01/Emergncia-Crupe-Viral-e-Bacteriano.pdf
- SBP, Departamento de Medicina do Sono. Recomendações da AAP sobre sono seguro em menores de um ano.
  Nota de Alerta nº 56, 24 mar. 2023. https://www.sbp.com.br/fileadmin/user_upload/23990b-NotaAlerta-Recomend_AAP_SonoSeguro_1ano.pdf
- SBP, Curso de Suporte Básico de Vida. Obstrução de vias aéreas por corpo estranho e engasgo por
  líquidos. Guia Prático de Atualização nº 222, 1º ago. 2025.
  https://www.sbp.com.br/fileadmin/user_upload/24912c-GPA_-_Obstrucao_ViasAereas_CorpoEstranho_e_EngasgoLiquidos.pdf
- SBP, Departamento de Gastroenterologia. Ingestão de corpos estranhos. Manual, 2022.
  https://www.sbp.com.br/fileadmin/user_upload/Manual_Ingestao_de_Corpos_Estranhos_versao_site.pdf
- SBP, Pediatria Ambulatorial e Infectologia. Manejo da Febre Aguda. Documento Científico, out. 2021.
- OMS. Pocket book of hospital care for children, 2ª ed. Genebra, 2013. https://www.who.int/publications/i/item/978-92-4-154837-3
- NICE NG9. Bronchiolitis in children: diagnosis and management. 2015, atualizada em 9 ago. 2021.
- NICE NG143. Fever in under 5s: assessment and initial management. 2019, atualizada em 26 nov. 2021.
- NICE CG84. Diarrhoea and vomiting caused by gastroenteritis in under 5s: diagnosis and management. 2009.
- NICE NG1. Gastro-oesophageal reflux disease in children and young people. 2015, atualizada em 9 out. 2019.
- NICE NG232. Head injury: assessment and early management. 2023.
- American Academy of Pediatrics. Signs of Dehydration in Infants & Children. HealthyChildren.org,
  atualizado em 24 set. 2019 (de Caring for Your Baby and Young Child, 6ª ed., 2015).
