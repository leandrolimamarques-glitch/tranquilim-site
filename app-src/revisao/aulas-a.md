# Revisão das aulas, lote A

Trilhas: **Primeiros dias em casa** (`src/conteudo/aulas/primeiros-dias.ts`), **Sono do bebê e sono seguro** (`sono-seguro.ts`) e **Introdução alimentar** (`introducao-alimentar.ts`).

Situação: rascunho para revisão do pediatra e do médico. Fontes conferidas em novembro de 2026. Nenhuma dose de remédio no texto; suplementos aparecem só como "o pediatra indica a suplementação".

## Fontes e como foram conferidas

"PDF lido" quer dizer que o documento original foi baixado e o trecho citado foi conferido no texto. "Busca" quer dizer que só confirmei título e ano e li trechos por mecanismo de busca.

| Sigla | Documento | Conferência |
|---|---|---|
| CC | Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania, 6ª edição. Brasília, 2023 (distribuída a partir de 2024). Não achei 7ª edição. | PDF lido (versão menina) |
| MS-RN | Ministério da Saúde. Atenção à Saúde do Recém-Nascido: guia para os profissionais de saúde, vol. 1, Cuidados gerais, 2ª ed. 2014 | PDF lido |
| GA | Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos. 2019 | PDF lido (cópia do Portal de Boas Práticas IFF/Fiocruz) |
| SBP-pele | SBP, Deptos. de Dermatologia e Neonatologia. Atualização sobre os Cuidados com a Pele do Recém-Nascido. Documento científico nº 11, 27/05/2021 | PDF lido |
| SBP-ict | SBP, Depto. de Neonatologia. Hiperbilirrubinemia indireta no período neonatal. Manual de orientação nº 10, 29/09/2021 | PDF lido |
| SBP-GI | SBP, Depto. de Gastroenterologia. Distúrbios gastrointestinais funcionais no lactente e na criança abaixo de 4 anos: um guia para a prática diária. 2022 | PDF lido |
| SBP-cólica | SBP. Pediatria para Famílias: Cólica do lactente (atualizado em jul/2023) | Busca: o site estava fora do ar; só li o trecho "melhora até os 3 ou 4 meses e desaparece quase sempre antes dos 5 meses" |
| SBP-anq | SBP, Depto. de Aleitamento Materno. Anquiloglossia: como proceder. Guia prático de atualização nº 85, 31/07/2023 | PDF lido |
| SBP-febre | SBP, Deptos. de Pediatria Ambulatorial e Infectologia. Manejo da Febre Aguda. 2021 | PDF lido |
| SBP-SMSL | SBP, Depto. de Medicina do Sono. Síndrome da Morte Súbita do Lactente. Documento científico nº 4, out/2018 | PDF lido |
| SBP-sono | SBP, Depto. do Sono. Higiene do Sono: Atualização 2021. Documento científico nº 5, 05/11/2021 | PDF lido |
| SBP-alim | SBP, Depto. de Nutrologia. Manual de Alimentação, 5ª ed. revisada e ampliada. 2024 | PDF lido (capítulo do lactente) |
| SBP-BLW | SBP, Depto. de Nutrologia. A Alimentação Complementar e o Método BLW. Guia prático de atualização nº 3, maio/2017 | PDF lido |
| SBP-engasgo | SBP, Curso de Suporte Básico de Vida. Obstrução de vias aéreas por corpo estranho e engasgo por líquidos: o que fazer? Guia prático de atualização nº 222, 01/08/2025 | PDF lido |
| ASBAI-2018 | ASBAI e SBP. Consenso Brasileiro sobre Alergia Alimentar 2018 (Solé et al., Arq Asma Alerg Imunol) | Busca (existência e tema); texto não lido |
| AAP-sono | Moon RY, Carlin RF, Hand I. Sleep-Related Infant Deaths: Updated 2022 Recommendations. Pediatrics 2022;150(1):e2022057990 | PDF lido |
| AAP-bili | Kemper AR et al. Clinical Practice Guideline Revision: Management of Hyperbilirubinemia in the Newborn Infant ≥35 Weeks. Pediatrics 2022;150(3):e2022058859 | Busca (dados bibliográficos; "água ou soro glicosado não são recomendados") |
| AASM | Paruthi S et al. Recommended amount of sleep for pediatric populations. J Clin Sleep Med 2016 | Citado na tabela do SBP-sono; não lido direto |
| OMS-AC | WHO guideline for complementary feeding of infants and young children 6–23 months of age. 2023 | Busca (recomendações sobre açúcar, sal e suco) |
| Lei 13.002/2014 | Avaliação do frênulo lingual antes da alta | Confirmada no SBP-anq |
| Calendário 2026 | Calendário Nacional de Vacinação 2026 (MS), o mesmo de `src/lib/vacinas.ts` | Já no app |

---

## Trilha 1: Primeiros dias em casa (pd1 a pd8)

### pd1. O umbigo: cuidar do coto até cair
- Coto cai até o fim da 2ª semana: CC.
- Lavar as mãos, secar depois do banho, fralda dobrada abaixo do coto: CC; SBP-pele.
- Álcool 70% depois do banho, só no coto: CC. Para bebês nascidos em hospital, basta manter limpo e seco; antisséptico não reduz onfalite nesse contexto e pode atrasar a queda: SBP-pele (que segue a OMS).
- Nada de faixa, moeda ou outra substância: CC.
- Alerta (vermelhidão, pus, mau cheiro: levar imediatamente): CC.

**Para o pediatra decidir:** a aula dá as duas orientações (álcool 70% da CC; limpo e seco da SBP) e manda seguir o pediatra. O SBP-pele diz que cabe ao pediatra individualizar. Se a equipe preferir uma só mensagem, escolher qual.

### pd2. Icterícia: quando o amarelo preocupa
- Icterícia fisiológica aparece depois de 24 h, pico por volta do 3º ao 5º dia, depois cai: SBP-ict (história natural em RN brasileiros).
- Progressão do rosto para os pés (céfalo-caudal; zona 3 chega aos joelhos com valores mais altos): SBP-ict.
- Avaliação visual não é confiável, subestima em pele pigmentada e com pouca luz; medir por bilirrubina transcutânea ou sérica: SBP-ict.
- Água e chá não ajudam: AAP-bili (água ou soro glicosado não recomendados); CC (só leite materno até 6 meses).
- Banho de sol é contraindicado como tratamento; tratamento é fototerapia: SBP-pele.
- Alerta: amarelo nas primeiras 24 h, forte, espalhado pelo corpo ou por mais de 2 semanas exige avaliação com urgência: CC. Fezes claras e urina escura: CC (escala de cores) e SBP-ict (colestase; atresia biliar operada antes de 6 semanas tem melhor prognóstico).

**Para o pediatra decidir:** a aula usa "chega à barriga e às pernas" como sinal de urgência, que é a leitura leiga das zonas de Kramer. O SBP-ict prevê retorno em 48 a 72 h depois da alta conforme o risco; dá para acrescentar "vá ao retorno marcado pela maternidade".

### pd3. Banho e pele do recém-nascido
- Banho diário ou 2 a 3 vezes por semana, limpando dobras, coto e área da fralda; imersão; 5 a 10 minutos: SBP-pele.
- Banheira ou bacia, local sem vento, testar a água com a mão: CC. (SBP-pele cita água de 37 a 37,5 °C medida; a CC fala em 37 °C. A aula não deu número porque a família raramente tem termômetro de banho.)
- Nunca deixar sozinho na banheira ou bacia; pouca água afoga: CC (Prevenindo acidentes).
- Sabonete líquido infantil, pouco; secar sem esfregar: SBP-pele; CC (sabonete neutro em pequena quantidade).
- Trocar fralda sempre que suja, limpar com água e algodão, sem talco: CC; SBP-pele. Azeite irrita a pele: SBP-pele.

**Para o pediatra decidir:** citar ou não o creme de barreira (óxido de zinco ou petrolato) que o SBP-pele recomenda a cada troca. Ficou de fora para não induzir compra; é escolha da equipe.

### pd4. Choro e cólica
- Choro é normal; colo não vicia; evitar deixar chorando sozinho: CC.
- Definição de cólica (bebê saudável, ganho de peso normal, crises sem causa evidente, início e fim antes dos 5 meses): SBP-GI (critérios de Roma IV). Melhora aos 3 a 4 meses: SBP-cólica (só trecho de busca).
- Colo, peito e pele a pele acalmam: CC.
- Não interromper a amamentação; remédios para gases sem eficácia comprovada: SBP-cólica (trecho de busca). Sem chá ou água: CC.
- Bebê que chora muito tem mais risco de ser sacudido: SBP-GI. A tática "deite no berço, saia do quarto, peça ajuda" é prática de campanhas de prevenção do trauma craniano abusivo; **não achei fonte brasileira formal com essa frase**.
- Alerta: sinais de perigo em menores de 2 meses (não consegue mamar, sangue nas fezes, febre): CC; choro fraco e agudo: fluxo de febre do app.

**Para o pediatra decidir:** manter a tática de enfrentamento (é segura, mas sem fonte brasileira lida). O SBP-GI cita um probiótico específico com alguma evidência; a aula não menciona.

### pd5. Cocô e xixi nos primeiros dias
- Mecônio nas primeiras 24 a 36 h, eliminado até o 3º ou 4º dia; depois fezes de transição amarelo-esverdeadas e líquidas, que podem parecer diarreia; podem vir a cada mamada: MS-RN.
- Fezes ficam amarelas durante a 1ª semana; frequência varia; no peito exclusivo, até 2 a 3 dias sem evacuar; escala de cores: CC.
- Fezes raras, pequenas, secas e duras e poucas micções sugerem pouco leite: MS-RN.
- Esforço e rosto vermelho antes de evacuar (disquesia) não precisa de tratamento; sem supositório ou laxante: SBP-GI.
- 1ª diurese nas primeiras 24 h em mais de 90%; manchas avermelhadas de urato sem repercussão: MS-RN. Seis ou mais fraldas molhadas a partir do 5º dia: igual à aula a5 da trilha de amamentação (MS-RN fala em menos de 6 a 8 micções como sinal de pouco leite).
- Alerta: fezes claras, urina escura, sangue nas fezes: CC.

**Para o pediatra decidir:** na primeira semana, poucas evacuações costumam indicar pouca ingestão. A aula diz isso de forma geral ("cocô raro, pouco e duro com poucas fraldas molhadas"); se quiser um número mínimo de evacuações por dia na 1ª semana, a fonte terá de ser outra (não achei número nas fontes brasileiras lidas).

### pd6. Os testes
- Pezinho idealmente do 3º ao 5º dia; coraçãozinho na maternidade depois de 24 h; orelhinha de preferência entre 24 e 48 h na maternidade, no máximo no 1º mês; olhinho antes da alta; conferir o registro na Caderneta: CC (página de triagens neonatais).
- Coraçãozinho na mão direita e num pé, entre 24 e 48 h: protocolo SBP/MS (Portaria SCTIE/MS nº 20/2014), conferido por busca.
- Linguinha: Lei 13.002/2014, antes da alta; anquiloglossia sem sintoma não é indicação de cirurgia; quase sempre a dificuldade é de pega; frenotomia só após avaliação criteriosa da mamada: SBP-anq.

**Para o pediatra decidir:** o teste do pezinho ampliado (Lei 14.154/2021) está em implantação diferente em cada estado; a aula não promete número de doenças. Dizer ou não que o teste do olhinho se repete nas consultas (não conferi a diretriz de saúde ocular).

### pd7. Primeiras consultas e vacinas
- Consulta da 1ª semana do 3º ao 5º dia, por médico ou enfermeiro, em casa ou na UBS; consultas com 1, 2, 4, 6, 9, 12 meses (e 18, 24, 36): CC.
- BCG e hepatite B ao nascer; próximas aos 2 meses: Calendário 2026 (o mesmo de `src/lib/vacinas.ts`).
- Amamentar durante a vacina acalma: CC.
- Volta ao peso de nascimento por volta do 10º dia: CC (a trilha de amamentação fala em 10 a 14 dias; a aula usa "por volta das 2 semanas").

**Para o pediatra decidir:** vitamina D. A SBP recomenda para todo RN a termo desde a 1ª semana (SBP-pele; SBP-alim); o Ministério não tem suplementação universal de vitamina D. A aula só diz que o pediatra indica.

### pd8. Febre no recém-nascido é sempre urgência
- Febre: axila acima de 37,3 °C com termômetro digital: SBP-febre (o mesmo corte do fluxo de febre do app). Reaferir 15 min depois de tirar o excesso de roupa: fluxo de febre do app.
- RN pode não ter febre na infecção e ter hipotermia: SBP-febre.
- Sinais de perigo em menores de 2 meses (molinho, difícil de acordar, não mama, respiração rápida, convulsão, manchas roxas, temperatura de 35,5 °C ou menos): CC. Hipotermia abaixo de 36,5 °C: CC (parte do profissional, consulta da 1ª semana).
- Menor de 3 meses com febre vai ao pronto-socorro mesmo parecendo bem; não medicar antes: fluxo de febre do app (SBP-febre e NICE NG143).

**Para o pediatra decidir:**
1. Corte de febre: a CC usa **37,5 °C ou mais**; a SBP (2021) e o app usam **acima de 37,3 °C**. A aula segue o app.
2. Hipotermia: a CC traz dois números (35,5 °C ou menos para a família; abaixo de 36,5 °C para o profissional). A aula usa os dois: abaixo de 36,5 °C, atendimento no mesmo dia; 35,5 °C ou menos, pronto-socorro.
3. Idade: a CC fala em menores de 2 meses; o app usa menores de 3 meses.

---

## Trilha 2: Sono do bebê e sono seguro (ss1 a ss8)

### ss1. De barriga para cima, em todo sono
- Supino em todo sono até 1 ano; de lado é instável; refluxo também em supino; posicionadores não recomendados; depois que rola para os dois lados pode ficar na posição que assumir; de bruços só acordado e supervisionado: SBP-SMSL; AAP-sono; CC ("permaneça de barriga para cima").

### ss2. Berço vazio é berço seguro
- Superfície firme que não se deforma, lençol com elástico, sem objetos soltos, sem protetor de berço; sofá e poltrona muito perigosos; cadeirinha de carro não serve para o sono habitual: SBP-SMSL; AAP-sono (superfície firme, plana, sem inclinação; sling e assentos).
- Grades com no máximo 6 cm: CC (Prevenindo acidentes).
- Cordões e enfeites de cabelo: CC; colares: AAP-sono.

**Para o pediatra decidir:** a CC diz "coloque o berço **ou a rede** do bebê ao lado da cama ou da rede dos pais". A SBP e a AAP pedem superfície firme e plana; rede não é. A aula fala só em berço e não comenta a rede. Em regiões onde a rede é o costume (Norte e Nordeste), decidir se vale uma frase sobre isso.

### ss3. Mesmo quarto, cama separada
- Quarto dos pais, superfície separada: SBP-SMSL ("até um ano, pelo menos até 6 meses", baseada na AAP 2016); AAP-sono ("idealmente pelo menos nos primeiros 6 meses", 2022). A aula diz "pelo menos 6 meses e, de preferência, até 1 ano".
- Cama compartilhada é fator de risco, sobretudo antes de 3 meses; levar para mamar e devolver ao berço; não compartilhar com quem fumou, bebeu, usou droga ou remédio sedativo, ou está exausto; dispositivos para tornar a cama compartilhada segura não recomendados; gêmeos em berços separados: SBP-SMSL.
- Fadiga e depressão pós-parto associadas a problemas de sono do lactente: SBP-sono.

### ss4. Nem frio nem calor
- No máximo uma camada a mais que um adulto confortável; sinais de superaquecimento (suor, pele vermelha, peito quente); evitar cobrir a cabeça; touca dentro de casa não indicada; sem temperatura de quarto definida por falta de evidência: AAP-sono.
- Ajustar o calor pela roupa, não por cobertor: SBP-SMSL. Saco de dormir: AAP-sono.
- Cueiro não reduz morte súbita; parar quando tenta rolar (em geral aos 3 a 4 meses); cueiro com peso não é seguro: AAP-sono.
- Alerta remete ao fluxo de febre do app.

### ss5. Chupeta
- MS orienta evitar chupeta porque pode prejudicar a amamentação: CC.
- SBP-SMSL e AAP-sono: considerar oferecer na hora de dormir; no bebê amamentado, só depois de a amamentação estar bem estabelecida; não forçar; não recolocar se cair; não pendurar no pescoço nem prender na roupa.
- Sem mel ou açúcar: GA (mel e açúcar fora antes dos 2 anos).

**Para o pediatra decidir (principal ponto do lote):** a aula apresenta as duas posições e pede decisão com o pediatra. O próprio SBP-SMSL reconhece que não há ensaio clínico randomizado; a associação vem de estudos caso-controle. Se o Tranquilim quiser uma recomendação única, é decisão da equipe médica.

### ss6. Quanto o bebê dorme
- RN dorme muito, não diferencia dia e noite, ciclos curtos: SBP-sono; CC.
- Consolidação noturna por volta dos 2 a 3 meses; entre 6 e 9 meses a maioria dorme a noite toda, com 2 a 3 cochilos; 4 a 12 meses, 12 a 16 h em 24 h, contando cochilos: SBP-sono (tabela adaptada da AASM 2016).
- Dia com claridade e barulho normal; noite escura e silenciosa: CC.
- Alerta: muito sonolento e difícil de acordar é sinal de perigo: CC; RN que não acorda para mamar: igual à aula a1 da amamentação.

**Evidência fraca:** não há número recomendado para menores de 4 meses (a AASM não definiu). A aula não dá número para essa idade.

### ss7. Rotina para a hora de dormir
- Ritual curto (até 30 min) com banho, massagem, atividades calmas e luz apagada; horários regulares, inclusive no fim de semana; telas desligadas pelo menos 1 h antes; todos os cuidadores com a mesma estratégia; encorajar a adormecer no próprio berço: SBP-sono. Canções e leitura na rotina do sono: CC.

**Para o pediatra decidir:** "colocar no berço sonolento, mas acordado" é a forma prática de "encorajar a adormecer no próprio berço" do SBP-sono, que não diz a idade. A aula fala "aos poucos". Definir a partir de quando recomendar.

### ss8. Acordar de madrugada é normal
- Despertares breves após cada ciclo, com volta ao sono sem intervenção: SBP-sono.
- Mamadas noturnas necessárias nos primeiros meses e mantêm a produção: CC (8 a 12 mamadas, sem horário fixo; quanto mais mama, mais leite); trilha de amamentação.
- Noite com pouca luz e silêncio: CC. Devolver ao berço de barriga para cima: SBP-SMSL.

**Para o pediatra decidir:** "no bebê maior, espere um pouquinho antes de pegar" é orientação comportamental leve, sem idade definida nas fontes. Confirmar se fica e a partir de que idade.

---

## Trilha 3: Introdução alimentar (ia1 a ia8)

### ia1. Quando começar
- Leite materno exclusivo até 6 meses, sem água, chá ou suco; complementar a partir dos 6 meses; amamentar até 2 anos ou mais: CC; GA; SBP-alim.
- Sinais de prontidão (senta com pouco ou nenhum apoio, cabeça firme, coordenação olho-mão-boca, menos protrusão da língua): GA.
- Cuspir no começo não é rejeição: GA; SBP-alim.
- Quantidade pequena no início, o bebê regula; leite materno segue como principal alimento: GA.
- Sentado, ereto, com supervisão contínua: SBP-BLW (recomendações do BLISS).

**Para o pediatra decidir:** a aula remete ao pediatra o bebê que não mama no peito. Há divergência: o SBP-alim admite início a partir dos 4 meses para quem usa fórmula ou não mantém o aleitamento exclusivo, após avaliação; o GA traz esquema a partir dos 4 meses para quem recebe leite de vaca modificado; o SBP-BLW (2017) dizia 6 meses para todos.

### ia2. O prato
- Um alimento de cada grupo no almoço e jantar; amassar com garfo, separado, sem liquidificar ou peneirar; fruta em vez de suco: CC; GA; SBP-alim.
- Temperos naturais; sem caldo ou tempero pronto: GA; SBP-alim.
- **Sal:** SBP-alim: não adicionar sal antes de 12 meses. GA e CC: sal "na quantidade mínima" e "com moderação". OMS-AC: evitar alimentos com muito sal. A aula traz as duas posições.
- Carne e ovo bem cozidos: GA. Higiene; preparar perto da hora; restos descartados; geladeira até 24 h: CC; SBP-alim.
- Alerta: rejeição frequente pode atrapalhar o crescimento, procurar a unidade: GA.

**Para o pediatra decidir:** sal. Se a equipe preferir uma mensagem só, a mais segura é a da SBP (sem sal antes de 1 ano).

### ia3. Consistência e BLW
- Evolução: amassado aos 6 meses; menos amassado e pedaços macios para pegar com a mão aos 7 a 8 meses; picado e desfiado aos 9 a 11; comida da família cortando o que for grande perto de 1 ano; consistência que não escorre da colher; mesmo sem dentes aceita o amassado: GA.
- Sem pedaços até os 10 meses, mais dificuldade depois; consistência da família por volta de 8 a 9 meses: SBP-alim.
- BLW: a SBP não endossa como forma única; faltam dados sobre crescimento, micronutrientes e segurança; um estudo mostrou menos ferro, zinco e B12; recomenda abordagem mista (colher + exploração com as mãos): SBP-BLW; SBP-alim.
- Cuidados do BLISS (pedaços que o bebê segure, provar a textura antes, alimento rico em ferro e alimento calórico em toda refeição, evitar alimentos redondos ou em moeda, sentado e supervisionado): SBP-BLW.

### ia4. Água sim; mel, açúcar e ultraprocessados não
- Água a partir dos 6 meses, no copo, nos intervalos, filtrada ou fervida; a criança não percebe sede: GA; CC.
- **Suco:** GA: não oferecer suco a menores de 1 ano, nem natural. SBP-alim: não oferecer sucos. OMS-AC: suco 100% deve ser **limitado** (recomendação condicional). A aula segue o GA.
- Água de coco, chá e refrigerante não substituem a água: GA; SBP-alim (água de coco desaconselhada por sódio e potássio).
- **Mel:** SBP-alim: não no 1º ano (botulismo). GA: não antes dos 2 anos (é açúcar e há risco de botulismo, maior antes de 1 ano). A aula diz as duas coisas.
- Açúcar e adoçante até 2 anos não: GA (passo 5); SBP-alim (adoçantes e mascavo, melado, rapadura); OMS-AC.
- Lista de ultraprocessados: CC; GA.
- **Leite de vaca:** SBP-alim: leite de vaca integral não no 1º ano (fórmula se não houver aleitamento). GA: admite leite de vaca modificado em casa para quem não mama no peito. A aula só diz que o pediatra orienta qual leite.
- Alerta: sinais de desidratação: CC. Botulismo: GA cita "sintomas gastrintestinais e neurológicos"; a frase do alerta (molinho, dificuldade para mamar ou engolir) é a tradução leiga, sem lista de sinais nas fontes lidas.

### ia5. Ânsia ou engasgo
- Reflexo de gag (o SBP-engasgo chama de "reflexo de engasgo" ou faríngeo) protege a via aérea, fica mais à frente na boca do bebê, vai para trás por volta dos 9 meses e faz parte do desenvolvimento normal: SBP-engasgo.
- Sinais de obstrução grave (não consegue tossir ou falar, respiração ruidosa, palidez, cianose): SBP-engasgo.
- Obstrução parcial: estimular a tosse, sem manobra; varredura às cegas com o dedo desaconselhada: SBP-engasgo.
- Menor de 1 ano: antebraço, cabeça mais baixa, 5 golpes entre as escápulas com a região tenar e hipotenar, virar, 5 compressões com dois dedos logo abaixo da linha mamilar; perda de consciência: acionar emergência e reanimação; todo bebê que recebeu manobra deve ser avaliado: SBP-engasgo.
- Alimentos de risco (uva, salsicha, castanhas, cenoura crua, maçã, pipoca, bala dura): SBP-engasgo. Uva e acerola cortadas pequenas e sem semente; castanhas e amendoim só triturados; pipoca não antes dos 2 anos: GA.

**Para o pediatra decidir:** conferir o texto da manobra com a figura do SBP-engasgo antes de gravar; o vídeo vai mostrar melhor do que o texto. Considerar indicar curso de primeiros socorros (não está na aula). A trilha de segurança (lote B, `seguranca.ts`) também trata de engasgo com a mesma fonte; o texto das duas está coerente.

### ia6. Ovo, amendoim e outros alergênicos
- Ovo inteiro, peixe e carne de porco liberados a partir dos 6 meses, bem cozidos; a recomendação antiga de evitar foi revista: GA.
- Introdução ampla e sem atraso dos alergênicos (leite de vaca, ovo, soja, trigo, pasta de amendoim, peixes e frutos do mar), um de cada vez a cada 3 a 5 dias, entre 4 e 11 meses; introdução precoce do amendoim reduziu alergia ao amendoim em crianças de alto risco; ovo e peixe podem entrar entre 4 e 6 meses; amendoim entre 4 e 11 meses mesmo com história familiar de atopia: SBP-alim (2024).
- Amendoim e castanhas nunca inteiros, só triturados: GA. Pasta de amendoim: SBP-alim. "Sem açúcar e sem sal": GA (açúcar e ultraprocessados fora).
- Manter a oferta depois de aceito: decorre do objetivo de "aquisição de tolerância" do SBP-alim; a frequência exata (resumos secundários do documento SBP/ASBAI 2025 citam pelo menos 3 vezes por semana) **não foi conferida no texto original**.
- Lactente com dermatite atópica grave ou alergia prévia: conversar antes com o pediatra: SBP-alim (alto risco).
- Alerta (urticária, vômitos; sinais de anafilaxia: 192): conhecimento clínico padrão; o Consenso ASBAI-2018 trata das manifestações, mas não li o texto nesta rodada.

**Mudança recente de orientação e onde ela está hoje no Brasil:**
- Até cerca de 2017, a orientação comum era adiar ovo, peixe e amendoim. O GA (2019) já libera ovo, peixe e porco aos 6 meses. O SBP-alim (2024) manda não adiar nenhum alergênico e, seguindo a ESPGHAN, admite ovo e amendoim por volta dos 4 a 6 meses.
- Em março de 2025, SBP e ASBAI publicaram a "Atualização em Alergia Alimentar 2025" (Arquivos de Asma, Alergia e Imunologia). **Não consegui ler o texto integral** (área restrita); resumos secundários dizem que ela reconhece a introdução controlada de alergênicos entre 4 e 6 meses, sobretudo em lactentes com dermatite atópica ou história familiar, e desaconselha testes antes da introdução. O pediatra precisa conferir esse documento antes de publicar a aula.
- A aula, para o público geral, diz "desde o começo, aos 6 meses, sem adiar", coerente com o aleitamento exclusivo até 6 meses (MS e SBP). Bebês de alto risco ficam para conversa com o pediatra.

**Para o pediatra decidir:** (1) se a aula deve citar a janela de 4 a 6 meses para bebês de alto risco; (2) se inclui leite de vaca na lista de alergênicos (a SBP inclui, mas também diz que leite de vaca integral não entra no 1º ano; para não confundir, a aula deixou o leite de fora da lista); (3) frequência de manutenção.

### ia7. Ferro
- Falta de ferro causa anemia, cansaço, falta de apetite, prejuízo ao desenvolvimento e aprendizado: CC; GA.
- Carnes e ovos todo dia; ferro animal mais bem absorvido; vísceras: CC; GA.
- Leguminosas e verdes-escuras com fruta rica em vitamina C: CC; GA.
- Refrigerante de cola e bebidas de mate, chá-preto e guaraná atrapalham o aproveitamento do ferro; café e chá-preto não devem ser dados: GA.
- Leite de vaca: ferro mal aproveitado e excesso aumenta o risco de anemia: GA.
- Suplementação: CC (todas as crianças de 6 a 24 meses devem receber ferro extra, por suplemento ou fortificação); SBP-alim (Consenso SBP de anemia ferropriva 2021: a partir de 180 dias até 24 meses no termo AIG em aleitamento exclusivo; a partir de 90 dias com fator de risco).

**Para o pediatra decidir:** a idade de início difere (MS 6 meses; SBP 6 meses sem risco, 3 meses com risco). A aula só diz que o pediatra indica.

### ia8. Recusa alimentar
- De 8 a 10 exposições para aceitar um alimento novo; variar o preparo: CC; SBP-alim.
- Respeitar a saciedade; não forçar nem obrigar a limpar o prato; sem telas; não substituir a refeição recusada por lanche; sem recompensa, chantagem ou castigo; comer junto e conversar: GA.
- Dentes, doença e mudanças familiares afetam o apetite; o crescimento na curva da Caderneta é o melhor indicador: GA.

---

## Onde a evidência é fraca ou as orientações divergem (resumo)

| Tema | Brasil | Internacional | Na aula |
|---|---|---|---|
| Antisséptico no coto | CC: álcool 70%. SBP 2021: limpo e seco em nascidos em hospital | OMS: limpo e seco em baixa mortalidade | As duas, segue o pediatra |
| Corte de febre | CC: ≥37,5 °C. SBP 2021: >37,3 °C | NICE: ≥38 °C (outros locais de medida) | >37,3 °C, igual ao app |
| Chupeta | MS evita (amamentação). SBP Medicina do Sono 2018: considerar ao dormir | AAP 2022: recomenda ao dormir, depois da amamentação estabelecida | As duas, decidir com pediatra. Evidência só de caso-controle |
| Rede para dormir | CC cita rede ao lado da cama | AAP: superfície firme, plana | Não menciona |
| Tempo no quarto dos pais | SBP 2018: até 1 ano, pelo menos 6 meses | AAP 2022: pelo menos 6 meses | As duas |
| Sono em menores de 4 meses | Sem número | AASM não define | Sem número |
| Sal antes de 1 ano | SBP: nenhum. MS: mínimo | OMS: evitar alimentos com muito sal | As duas |
| Mel | SBP: não antes de 1 ano. MS: não antes de 2 | Botulismo antes de 1 ano | As duas |
| Suco | MS: não antes de 1 ano | OMS 2023: limitar suco 100% | Não antes de 1 ano |
| Leite de vaca no 1º ano | SBP: não. MS: modificado se não houver peito | Variável | Pediatra orienta |
| Início da alimentação sem aleitamento exclusivo | SBP e MS admitem a partir de 4 meses em situações específicas | ESPGHAN: entre 4 e 6 meses | 6 meses; casos especiais com pediatra |
| Alergênicos | MS: ovo e peixe aos 6 meses. SBP 2024: não adiar, 4 a 11 meses. SBP/ASBAI 2025: 4 a 6 meses em alto risco (não lido) | Introdução precoce, sobretudo amendoim e ovo em alto risco | Aos 6 meses, sem adiar; alto risco com pediatra |
| BLW | SBP: não como método único | Sem endosso oficial de NZ, Canadá, EUA (segundo a SBP) | Método misto |
| Ferro profilático | MS: 6 a 24 meses. SBP: 180 dias (90 com risco) a 24 meses | | Pediatra indica |
| Vitamina D | SBP: todo RN a termo desde a 1ª semana. MS: sem universal | | Pediatra indica |

Afirmações sem fonte brasileira lida diretamente, para conferência: tática de enfrentamento do choro (pd4); melhora da cólica aos 3 a 4 meses (só trecho de página da SBP); sinais de anafilaxia (ia6); sinais leigos de botulismo (ia4); frequência de manutenção dos alergênicos (ia6).
