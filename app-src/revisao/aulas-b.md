# Revisão: trilhas Desenvolvimento, Segurança e Rotina (aulas-b)

Rascunho para o pediatra e o médico revisores. Arquivos:

- `src/conteudo/aulas/desenvolvimento.ts` (`DESENVOLVIMENTO`, aulas de1 a de8)
- `src/conteudo/aulas/seguranca.ts` (`SEGURANCA`, aulas sg1 a sg8)
- `src/conteudo/aulas/rotina-telas.ts` (`ROTINA_TELAS`, aulas rt1 a rt8)
- `src/conteudo/aulas/aulas-b.test.ts` (6 a 8 aulas, ids únicos, campos preenchidos, nenhum texto com dose)

Nenhuma aula traz dose de medicamento. Telefones usados: 192 (SAMU), 193 (Bombeiros), 0800 722 6001 (Disque-Intoxicação, impresso na Caderneta da Criança e na página da SBP) e Disque 100 (denúncia de violação de direitos). Fontes conferidas por busca e leitura do documento em 10/11/2026.

## Fontes conferidas

Siglas usadas nas tabelas abaixo.

| Sigla | Fonte | Como foi conferida |
|---|---|---|
| CAD | Ministério da Saúde. Caderneta da Criança: Passaporte da Cidadania, 6ª ed., 2023 (versão menina) | PDF lido na íntegra (espelho UFMG). A 7ª ed. (2024; "7ª edição revisada" de 2025 na BVS) existe e incluiu o M-CHAT-R/F, mas o PDF da BVS devolveu 403; o texto citado é o da 6ª ed. |
| SBP-MCHAT | SBP, DC Desenvolvimento e Comportamento. Manual de Orientação nº 150: Triagem precoce para autismo, M-CHAT-R/F. 25/04/2024 | PDF lido |
| SBP-TEA | SBP, DC Desenvolvimento e Comportamento. Manual de Orientação nº 5: Transtorno do Espectro do Autismo. Abril/2019 | PDF lido |
| SBP-TELAS | SBP, GT Saúde na Era Digital. Manual de Orientação nº 163: #Menos Telas #Mais Saúde, atualização 2024. 13/08/2024 | PDF lido (seção Recomendações) |
| SECOM | Governo Federal (Secom). Crianças, adolescentes e telas: guia sobre usos de dispositivos digitais. 2025 | Página oficial de resumo das recomendações lida |
| SBP-ACID | SBP, DC Segurança. Manual de Orientação nº 4: Os acidentes são evitáveis e na maioria das vezes o perigo está dentro de casa! Abril/2020 | PDF lido |
| SBP-ENG | SBP, Curso de Suporte Básico de Vida. Guia Prático de Atualização nº 222: Obstrução de vias aéreas por corpo estranho e engasgo por líquidos: o que fazer? 01/08/2025 | PDF lido |
| SBP-CE | SBP, DC Gastroenterologia. Ingestão de corpos estranhos. 2022 | PDF lido (introdução e prevenção) |
| SBP-INTOX | SBP. Intoxicações exógenas (Pediatria para Famílias). Jan/2024; e Intoxicações agudas na infância, DC Toxicologia, set/2025 | Páginas lidas |
| SBP-TCE | SBP, DC Emergência. Traumatismo cranioencefálico leve na infância (Pediatria para Famílias). Out/2025 | Página lida |
| SBP-SONO | SBP, DC do Sono. Documento Científico nº 5: Higiene do sono, atualização 2021. 05/11/2021 | PDF lido |
| SBP-APNEIA | SBP, DC Otorrinolaringologia. Apneia do sono (Pediatria para Famílias). Dez/2023 | Página lida |
| SBP-TE | SBP e Sociedade Brasileira de Urologia. Manual de Orientação: Treinamento esfincteriano. Set/2019 | PDF lido |
| SBP-BUCAL | SBP, GT Saúde Oral. "Cuidados com a saúde oral nos primeiros mil dias de vida" (jan/2026) e "O primeiro dente de leite está chegando, e agora?" (out/2026) | Páginas lidas |
| GUIA2 | Ministério da Saúde. Guia Alimentar para Crianças Brasileiras Menores de 2 Anos, 2019 (versão resumida, 2021) | PDF da versão resumida lido |
| GUIAPOP | Ministério da Saúde. Guia Alimentar para a População Brasileira, 2ª ed., 2014 | Citado só para ultraprocessados depois dos 2 anos; não relido |
| CTB | Código de Trânsito Brasileiro, art. 64, redação da Lei 14.071/2020 | Texto do artigo conferido (transcrição em artigo jurídico; o site do Planalto bloqueou o acesso automatizado) |
| CONTRAN | Resolução CONTRAN nº 819, de 17/03/2021, em vigor desde 12/04/2021 | PDF oficial (gov.br/transportes) lido, com anexo. Busca em nov/2026 não encontrou resolução que a altere ou revogue; há pedido de entidades para revisar o texto |
| L13010 | Lei 13.010/2014 (Lei Menino Bernardo), art. 18-A e 18-B do ECA | Texto da lei lido |
| L14826 | Lei 14.826/2024 (parentalidade positiva e direito ao brincar) | Ementa e artigos 1º a 3º conferidos por busca (Câmara, Senado) |
| DISQUE100 | Disque 100, Ministério dos Direitos Humanos e da Cidadania | Conferido em página do CNJ (gratuito, anônimo, 24 h) |
| OMS-QUEIM | OMS. Burns (nota descritiva), atualizada em 21/10/2026 | Página lida (seção de primeiros socorros) |
| OMS-5 | OMS. Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age. 2019 | Conferido por busca (resumos da OMS/OPAS) |
| CDC | Zubler JM et al. Evidence-Informed Milestones for Developmental Surveillance Tools. Pediatrics 2022;149(3):e2021052138 (marcos do programa "Learn the Signs. Act Early.") | PubMed e páginas de 2, 9, 18 meses, 2, 3, 4 e 5 anos lidas no site do CDC |
| AAP-TEA | Hyman SL et al. Identification, Evaluation, and Management of Children With ASD. Pediatrics 2020;145(1):e20193447 | PubMed |
| AAP-CARRO | Durbin DR, Hoffman BD. Child Passenger Safety. Pediatrics 2018;142(5):e20182460 | PubMed (resumo) |
| AAP-AFOG | Shenoi RP et al. Prevention of Drowning: Policy Statement e Technical Report. Pediatrics 2026;158(1) | PubMed (resumo); "rápido e silencioso" vem do HealthyChildren.org (AAP) |
| AAP-DISC | Sege RD, Siegel BS. Effective Discipline to Raise Healthy Children. Pediatrics 2018;142(6):e20183112 | PubMed (resumo) |
| AASM | Paruthi S et al. Recommended Amount of Sleep for Pediatric Populations. J Clin Sleep Med 2016;12(6):785-6 | PubMed; é a tabela que a SBP-SONO adota |

## Trilha Desenvolvimento e marcos (de1 a de8)

Os marcos seguem a CAD (faixas de idade da Caderneta) e foram conferidos com o CDC 2022, que lista o que pelo menos 75% das crianças fazem em cada idade. Quando as duas fontes diferem, o texto usa "por volta de" e o alerta segue a faixa mais tolerante, exceto para fala, em que segue a SBP-TEA.

### de1. Do nascimento aos 6 meses

| Afirmação | Fonte |
|---|---|
| Marcos de 2 meses (acalma com a voz, olha o rosto, sorri, sons além do choro, reage a barulho, levanta a cabeça de bruços) | CDC 2 meses; CAD 0 a 2 meses ("observa um rosto", "sorri quando estimulada", "emite sons", "eleva a cabeça") |
| Marcos de 4 meses (risada, sons, vira para a voz, segura brinquedo, mãos à boca, apoio nos antebraços) | CDC 4 meses; CAD 2 a 4 meses ("emite sons, ri alto", "segura objetos", "levanta a cabeça e apoia-se nos antebraços") |
| Marcos de 6 meses (reconhece as pessoas, ri, reveza sons, pega o que quer, leva à boca, localiza som, rola) | CDC 6 meses; CAD 4 a 6 meses ("busca ativa de objetos", "leva objetos à boca", "localiza o som", "muda de posição (rola)") |
| Idade corrigida no prematuro | CAD, "Avaliação dos marcos" |
| Alerta: marco ausente no fim da faixa leva à conversa com o pediatra; perda de habilidade, procurar logo | CAD (instrumento de classificação: ausência de marco = alerta ou provável atraso); SBP-TEA (perda de habilidades) |

### de2. De 9 a 12 meses

| Afirmação | Fonte |
|---|---|
| Marcos de 9 meses | CDC 9 meses; CAD 6 a 9 meses (esconde-achou, transfere objetos, duplica sílabas, senta sem apoio) |
| Estranhar desconhecidos é bom sinal | CAD ("Nesta fase, o bebê começa a estranhar as outras pessoas. Isso é um bom sinal!") |
| Marcos de 1 ano (tchau, imita gestos, "mamã/papá", procura o escondido, pinça, em pé com apoio) | CDC 12 meses; CAD 9 a 12 meses (imita gestos, faz pinça, jargão, anda com apoio) |
| Andar sem apoio e primeira palavra entre 12 e 15 meses | CAD, faixa 12 a 15 meses ("anda sem apoio", "diz uma palavra") |
| Andador contraindicado em qualquer idade | SBP-ACID ("O andador não deve ser usado, nunca, em nenhuma idade"); CAD |
| Alerta: sem balbucio aos 9 meses, sem apontar/tchau com 1 ano | SBP-TEA (ausência de balbucio aos 9 meses; não apontar aos 12 meses); CAD |

### de3. De 1 ano e meio a 2 anos

| Afirmação | Fonte |
|---|---|
| Marcos de 18 meses (anda, rabisca, colher, 3 palavras, aponta para mostrar, pedido simples sem gesto) | CDC 18 meses (texto conferido); CAD 15 a 18 meses ("usa colher ou garfo", "fala 3 palavras") |
| Marcos de 2 anos (corre, chuta, aponta figuras, 2 partes do corpo, junta 2 palavras, faz de conta simples) | CDC 2 anos (texto conferido); CAD 18 a 24 meses ("aponta 2 figuras", "chuta bola") |
| Apontar para mostrar e dividir atenção são marcos importantes | SBP-TEA (gestos comunicativos e resposta ao nome distinguem crianças com TEA a partir de 12 meses); itens do M-CHAT |
| Triagem nas consultas de 18 e 24 meses | SBP-MCHAT; AAP-TEA |
| Alerta: 18 meses sem andar, sem palavras ou sem apontar; 2 anos sem juntar palavras | CAD (ausência de marcos da faixa anterior); SBP-TEA (nenhuma palavra até 16 meses; sem frases até 2 anos) |

### de4. Dos 3 aos 5 anos

| Afirmação | Fonte |
|---|---|
| Marcos de 3 anos | CDC 3 anos (texto conferido); CAD 30 a 42 meses (brinca com outras crianças, veste camiseta) |
| Marcos de 4 anos | CDC 4 anos (texto conferido); CAD 42 a 48 meses (copia círculo, fala clara e compreensível) |
| Marcos de 5 anos | CDC 5 anos (texto conferido); CAD 48 a 72 meses (veste-se sem ajuda, aceita regras nos jogos, pula num pé só) |
| Deixar fazer sozinho, elogiar o esforço | CAD (estímulo de 4 a 6 anos: "Valorize seu esforço e não ridicularize sua dificuldade") |
| Pré-escola obrigatória a partir dos 4 anos | CAD ("a partir desta idade a matrícula na pré-escola é obrigatória") |
| Alerta | CAD (sinais de alerta: isolamento, dificuldade na fala e em atender comandos); CDC |

### de5. Brincar, conversar e ler

| Afirmação | Fonte |
|---|---|
| Narrar o dia, conversar, responder aos sons | CAD (estímulo de 2 a 3 anos: "comentar em voz alta o que o adulto e a criança estão fazendo") |
| Ler pelo menos 10 minutos por dia; livro de figuras vale | CAD ("Separe pelo menos dez minutos todos os dias para ler") |
| De bruços acordado, esconde-achou, potes, bola, faz de conta | CAD (orientações por faixa etária) |
| Pronúncia correta, repetir sem corrigir | CAD (fala materna sem distorcer palavras; "Não corrija eventuais erros de linguagem. Apenas repita") |
| TV desligada nas refeições; rotina dá segurança | CAD |
| Alerta: depressão de quem cuida | CAD (depressão materna listada como risco para o desenvolvimento) |

### de6. Telas e desenvolvimento

| Afirmação | Fonte |
|---|---|
| Menos de 2 anos: nenhuma exposição, nem passiva | SBP-TELAS ("Evitar a exposição de crianças menores de 2 anos às telas, sem necessidade (nem passivamente!)"); CAD; OMS-5 |
| Exceção: chamada de vídeo com a família, com adulto | SECOM |
| 2 a 5 anos: até 1 hora por dia, com supervisão | SBP-TELAS; OMS-5 ("no more than 1 hour; less is better") |
| Sem tela nas refeições; desligar 1 a 2 horas antes de dormir | SBP-TELAS |
| Uso de celular pelos adultos | CAD ("Cuide para não se distrair dando atenção a equipamentos eletrônicos") |
| Alerta: uso problemático | SBP-TELAS (identificar uso inadequado, excessivo ou problemático) |

### de7. Atraso na fala

| Afirmação | Fonte |
|---|---|
| Referências de idade da fala | CAD (diz 1 palavra: 12 a 15 meses; 3 palavras: 15 a 18; frases de 2 palavras: 24 a 30; fala compreensível: 42 a 48); CDC (2 palavras juntas aos 2 anos; entendido por estranhos na maior parte do tempo aos 3 anos) |
| Investigar a audição; sinais de perda auditiva | CAD ("Sinais de deficiência auditiva": não atender, só atender olhando, falar pouco) |
| Não esperar para ver; estimulação precoce | CAD ("quanto mais cedo um problema de desenvolvimento for identificado e enfrentado, melhores serão os resultados"); SBP-TEA ("Quando é detectado qualquer atraso, a estimulação precoce é a regra") |
| Alerta: sem balbucio aos 9 meses, sem apontar aos 12, nenhuma palavra aos 16, sem frases aos 2 anos, perda de linguagem | SBP-TEA (lista de sinais da linguagem); CDC 3 anos para inteligibilidade |

### de8. Sinais de autismo e M-CHAT

| Afirmação | Fonte |
|---|---|
| Definição de TEA; sinais ficam claros entre 12 e 24 meses | SBP-TEA; SBP-MCHAT |
| Lista de sinais (nome, olhar, sorriso, apontar, imitar, objetos > pessoas, enfileirar, sons/toque) | SBP-TEA ("Sinais sugestivos"); CAD ("Sinais de alerta") |
| M-CHAT-R/F, 20 perguntas, respondidas pelos pais, nas consultas de 18 e 24 meses; está na Caderneta | SBP-MCHAT; AAP-TEA; notícias do MS sobre a 7ª ed. da CAD |
| Triagem não é diagnóstico; falsos positivos; repetir aos 24 meses se baixo risco antes disso | SBP-MCHAT |
| Estimular antes do diagnóstico | CAD (seção TEA: "independentemente de confirmação diagnóstica posterior") |
| Regressão nunca é normal | SBP-TEA (perda de habilidades como sinal); CAD |

### Pontos para o pediatra decidir (Desenvolvimento)

1. Faixas de idade dos marcos: o texto mistura a CAD (faixas, critério de "fim da faixa") e o CDC (75% das crianças). Confirmar se prefere apresentar só os marcos da Caderneta, idênticos ao que o pai vê no papel.
2. Alerta de fala aos 2 anos ("não junta duas palavras"): a SBP-TEA usa 2 anos; a CAD coloca "frases com 2 palavras" entre 24 e 30 meses. Mantive 2 anos como gatilho para conversar, não como atraso confirmado.
3. Gênero gramatical: alterno "ele" (bebê) e "ela" (criança). Decidir padrão para o vídeo.
4. Se quer citar a Lei 13.438/2017 (protocolo de risco psíquico até 18 meses no SUS). Não incluí porque é controversa (nota do Conanda e recomendação do MPF contra a regulamentação).
5. Confirmar o texto da 7ª ed. da Caderneta (não consegui abrir o PDF da BVS): se os marcos mudaram em relação à 6ª ed., ajustar de1 a de4.

## Trilha Segurança em casa e no carro (sg1 a sg8)

### sg1. Cadeirinha

| Afirmação | Fonte |
|---|---|
| Menor de 10 anos com menos de 1,45 m no banco de trás, em dispositivo adequado | CTB art. 64; CONTRAN art. 2º |
| Bebê conforto/conversível: até 1 ano ou 13 kg, limite do fabricante | CONTRAN, Anexo I |
| De costas para o movimento | CAD ("voltada para o vidro traseiro"); SBP-ACID ("voltada para a traseira do carro"); AAP-CARRO |
| Cadeirinha: 1 a 4 anos ou 9 a 18 kg | CONTRAN, Anexo II |
| Assento de elevação: 4 a 7,5 anos, ou até 1,45 m e 15 a 36 kg | CONTRAN, Anexo III; cinto de 3 pontos: SBP-ACID |
| Cinto do carro de 7,5 a 10 anos | CONTRAN, Anexo IV |
| Manter elevação até o cinto encaixar (cerca de 1,45 m) | AAP-CARRO ("belt-positioning booster seats ... through at least 8 years"; até o cinto servir). A altura de 1,45 m (4 pés e 9 pol.) vem do texto da AAP, não li o artigo completo |
| Cada transição reduz a proteção; adiar | AAP-CARRO (resumo) |
| Proibido dispositivo de costas no banco da frente com airbag (até 7,5 anos) | CONTRAN art. 4º, I |
| Táxi, aplicativo, escolar e coletivo isentos (até 7,5 anos) | CONTRAN art. 2º, §2º e §3º |

### sg2. Quedas

| Afirmação | Fonte |
|---|---|
| Nunca sozinho no trocador, cama, lugar alto | SBP-ACID; CAD ("Não deixe a criança sozinha em cima de móveis") |
| Bebê conforto com cinto | SBP-ACID ("deve estar com o cinto de segurança e com a alça travada") |
| Telas em janelas, sacadas e vãos; afastar móveis | SBP-ACID; CAD |
| Portão nas duas extremidades da escada | SBP-ACID |
| Andador nunca; beliche não indicado nos primeiros anos | SBP-ACID |
| Tanque, pia e móveis firmes | CAD |
| Alerta (sinais após bater a cabeça; alturas de 0,9 m e 1,5 m) | SBP-TCE (lista copiada quase literalmente) |

### sg3. Afogamento

| Afirmação | Fonte |
|---|---|
| Rápido e silencioso | AAP (HealthyChildren.org, "It's quick, and it's silent") |
| Supervisão próxima, constante, ao alcance do braço | AAP-AFOG |
| Nunca sozinho na banheira ou bacia | CAD; SBP-ACID |
| 2,5 cm de água bastam; lavanderia proibida ao bebê; esvaziar baldes | SBP-ACID; CAD ("Mesmo pouca água pode causar afogamento") |
| Cerca em toda a volta, acima de 1,5 m, portão com trava; fecha sozinho | SBP-ACID (150 cm, trava); AAP-AFOG (cerca de 4 lados, portão autofechante e autotravante) |
| Festas: um confia no outro; vigia da água sem distração | SBP-ACID; AAP-AFOG ("close, constant, attentive, and competent supervision"). "Sem bebida alcoólica" vem da política da AAP de 2019/2021; não reli o texto de 2026 |
| Colete, nunca boia; saber nadar não protege | SBP-ACID; CAD |

### sg4. Queimaduras

| Afirmação | Fonte |
|---|---|
| Cozinha é onde ocorre a maioria das queimaduras | SBP-ACID |
| Sem líquido quente ou fogão com criança no colo | SBP-ACID; CAD |
| Bocas de trás, cabos para dentro, cozinha com portão | SBP-ACID; CAD |
| Toalha pendurada | SBP-ACID |
| Água do banho: fria primeiro, testar com antebraço, perto da temperatura do corpo | SBP-ACID (36 °C); CAD (37 °C). Evitei citar o número |
| Tomadas, fios, ferro; inflamáveis fora do alcance; fogos e fogueira | CAD; SBP-ACID |
| Alerta: quando procurar atendimento | OMS-QUEIM (profundas, extensas, elétricas, químicas, rosto, mãos, pés, genitais). "Bolhas" e "maior que a palma da mão" são critério clínico meu, ver pontos abaixo |

### sg5. Remédios e produtos de limpeza

| Afirmação | Fonte |
|---|---|
| No alto e trancados; não em bolsa ou gaveta baixa | SBP-INTOX (2024 e 2025); SBP-ACID ("Nunca os deixe em bolsas ou prateleiras") |
| Nunca em garrafa de bebida; embalagem original | CAD; SBP-INTOX |
| Tampa de segurança | SBP-INTOX (2024) |
| Remédio não é bala; não tomar na frente da criança | SBP-INTOX (2025); SBP-ACID |
| Raticida em isca, pó ou grão | SBP-INTOX (2024) |
| Disque-Intoxicação 0800 722 6001 | CAD (página de prevenção de acidentes, "Centro de Informação Toxicológica, 0800-722-6001"); SBP-INTOX (2024) |
| Alerta: ligar ou ir ao PS com a embalagem; 192 se grave | SBP-INTOX (2024: 192 se desmaio ou convulsão; levar embalagem); CAD |

### sg6. Engasgo

| Afirmação | Fonte |
|---|---|
| 90% dos casos em menores de 5 anos, 65% em menores de 1 ano | SBP-ENG |
| Balão é a principal causa letal em menores de 6 anos | SBP-ENG |
| Objetos pequenos; faixa etária na caixa (Inmetro) | CAD |
| Lista de alimentos de risco | SBP-ENG (uvas, carne, salsichas, castanhas, cenoura crua, maçã, pipoca, balas duras) |
| Cortar uva e tirar semente; castanha só triturada | GUIA2 |
| Comer sentado e supervisionado | GUIA2 (desaconselha alimentar andando e brincando); SBP-ACID (nunca alimentar deitado) |
| Irmãos maiores | SBP-ACID |
| Alerta: estimular tosse, sem varredura às cegas; manobras por idade; avaliação depois | SBP-ENG |

### sg7. Bateria de botão e ímãs

| Afirmação | Fonte |
|---|---|
| Presentes em brinquedos, controles e eletrônicos; complicações graves se não retirada em até 2 horas | SBP-CE |
| Lacres seguros no compartimento | SBP-CE ("aparelhos que as contenham apresentem lacres seguros") |
| Dois ou mais ímãs (ou ímã e metal): perfuração, fístula | SBP-CE |
| Ingestão muitas vezes não presenciada e sem sintomas | SBP-CE |
| Irmãos maiores e brinquedos | Notícia de 2026 citando a SBP; evidência fraca, ver abaixo |
| Alerta: PS imediato; não provocar vômito | SBP-CE (retirada imediata, menos de 2 horas, se no esôfago); SBP-INTOX (não provocar vômito) |

### sg8. Primeiros minutos

| Afirmação | Fonte |
|---|---|
| Água corrente fria, não gelada, cerca de 20 minutos; manter o corpo aquecido | OMS-QUEIM |
| Tirar anéis e roupa não aderida; não arrancar o que grudou; não estourar bolhas; cobrir com pano limpo | OMS-QUEIM |
| Nada de gelo, pasta de dente, manteiga, óleo, pó de café | OMS-QUEIM; comunicados do MS de 2022 (manteiga, pó de café, creme dental) |
| Pele/olhos: água em abundância; tirar roupa contaminada | SBP-INTOX (2024) |
| Não provocar vômito, não dar leite, água ou líquidos; levar embalagem | SBP-INTOX (2024) |
| 192 se desmaio, convulsão, dificuldade para respirar | SBP-INTOX (2024); CAD |

### Pontos para o pediatra decidir (Segurança)

1. **Tempo de resfriamento da queimadura**: usei 20 minutos (OMS 2026). Comunicados do Ministério da Saúde (2022) falam em cerca de 10 minutos. Escolher um número só.
2. **Critério para levar a queimadura ao atendimento**: "bolhas" e "maior que a palma da mão da criança" são critério prático meu, não estão na OMS. Validar ou trocar.
3. **Manobra de desengasgo**: sg6 só nomeia a manobra por idade. Vale uma aula própria com demonstração em vídeo? Texto sem imagem não ensina a manobra.
4. **Mel na bateria de botão**: a ESPGHAN (2021, citada pela SBP-CE) admite mel no caminho do hospital em maiores de 1 ano. Ficou de fora por ser conduta com quantidade definida; decidir se entra.
5. **Assento de elevação dos 7,5 aos 10 anos**: a resolução permite só o cinto; AAP e entidades brasileiras defendem elevação até 1,45 m. O texto diz as duas coisas. Confirmar o tom.
6. **"Sem bebida alcoólica" para o vigia da água**: vem das versões de 2019/2021 da política da AAP; não li o texto completo de 2026.
7. **Faixa de 0 a 6 anos**: a trilha toda aparece desde o nascimento. Talvez sg6 e sg7 devam aparecer a partir dos 4 a 6 meses, quando o bebê começa a levar objetos à boca (a estrutura atual não permite faixa por aula).
8. **Disque-Intoxicação**: o número está na Caderneta (2023) e na SBP (2024). Há relato antigo de estados sem cobertura (AC, AP, MA, TO); não confirmei a situação atual.

## Trilha Rotina, birras e telas (rt1 a rt8)

### rt1. Birras

| Afirmação | Fonte |
|---|---|
| Birras (gritar, chorar, se jogar) são frequentes a partir de 1 ano e meio | CAD (estímulo de 18 a 24 meses: "As birras ... são comportamentos frequentes nestas e nas próximas fases") |
| Prevenção: rotina, avisar transições, escolhas pequenas | CAD (rotina dá segurança); AAP-DISC (estratégias positivas: definir expectativas, redirecionar). Exemplos práticos são meus |
| Na crise: calma, segurança, não ceder; não gritar, não bater | CAD ("De forma nenhuma reaja à birra, falando, gritando, batendo. Espere calmamente, não ceda.") |
| Acolher e elogiar depois; atender pedidos sem grito | CAD (texto quase literal) |
| Mesma resposta entre adultos | CAD ("Ordens diferentes, dadas ao mesmo tempo, deixam a criança confusa") |
| Alerta: agressividade, desafio constante, atraso de fala | CAD ("Sinais de alerta": muita agressividade, desafia com frequência, dificuldade na fala) |

### rt2. Limites sem violência

| Afirmação | Fonte |
|---|---|
| Direito a ser educado sem castigo físico ou tratamento cruel ou degradante (sofrimento, lesão, humilhar, ameaçar gravemente, ridicularizar) | L13010 (art. 18-A, texto lido) |
| Parentalidade positiva e direito ao brincar como estratégia de prevenção | L14826 |
| Punição física, grito e humilhação: pouco efeito imediato, nenhum a longo prazo, piores desfechos | AAP-DISC |
| "Não" só para o perigoso, com firmeza sem agressividade; dizer o que pode | CAD |
| Elogio do bom comportamento; consequência e pausa curta | AAP-DISC (reforço positivo); a pausa ("time-out") está nos materiais da AAP para famílias, não conferi no texto da política |
| Exemplo dos adultos | CAD |
| Alerta: CRAS, Conselho Tutelar, Disque 100 | CAD (CRAS); L13010 (art. 18-B, Conselho Tutelar); DISQUE100 |

### rt3. Sono

| Afirmação | Fonte |
|---|---|
| 1 a 2 anos: 11 a 14 h; 3 a 5 anos: 10 a 13 h, com cochilos | SBP-SONO (Tabela 1, adaptada de AASM); OMS-5 |
| Horários regulares, inclusive fim de semana | SBP-SONO |
| Ritual de até 30 minutos, prazeroso | SBP-SONO |
| Ambiente; objeto de transição; dormir na própria cama | SBP-SONO |
| Telas: pelo menos 1 h antes (SBP-SONO); 1 a 2 h (SBP-TELAS) | SBP-SONO; SBP-TELAS |
| Evitar chocolate, café, refrigerante à noite | SBP-SONO |
| Soneca some até os 5 anos; mesma estratégia entre os pais | SBP-SONO |
| Alerta: ronco, pausas, respiração pela boca, sonolência; levar vídeo | SBP-APNEIA |

### rt4. Desfralde: prontidão

| Afirmação | Fonte |
|---|---|
| Brasil: início médio 22 meses, conclusão 27,4 meses, duração 6 a 12 meses | SBP-TE |
| Lista de sinais de prontidão | SBP-TE (21 itens; selecionei os mais observáveis) |
| Avaliação pelo pediatra por volta dos 24 meses | SBP-TE |
| Não iniciar em estresse (mudança, irmão); dias quentes | SBP-TE |
| Casa e escola ao mesmo tempo | SBP-TE |
| Tratar constipação antes | SBP-TE |
| Alerta: 36 meses sem prontidão, 48 meses sem controle diurno | SBP-TE. "Voltou a escapar depois de meses" é acréscimo meu |

### rt5. Desfralde na prática

| Afirmação | Fonte |
|---|---|
| Penico apresentado antes; redutor e apoio para os pés no vaso | SBP-TE |
| Horários; 3 a 5 minutos no máximo; nunca forçar | SBP-TE |
| Só elogio; sem guloseima, prêmio, punição ou termo pejorativo | SBP-TE (Quadro 1) |
| Após uma semana de sucesso, calcinha/cueca; não voltar à fralda de dia | SBP-TE |
| Meninos sentados no início; meninas da frente para trás | SBP-TE |
| Recusa: pausa de 1 a 3 meses | SBP-TE |
| Alerta: retenção de fezes, se esconder para evacuar | SBP-TE |

### rt6. Telas em casa

| Afirmação | Fonte |
|---|---|
| Limites por idade e exceção da videochamada | SBP-TELAS; SECOM |
| Refeições e antes de dormir; não ficar isolado no quarto com telas | SBP-TELAS; CAD (até 10 anos sem TV ou computador no quarto) |
| Alternativas ao ar livre; tela não é babá | SBP-TELAS; SBP-ACID ("não pode servir de companhia ou terceirização do cuidar") |
| Supervisão e conteúdo adequado à idade | SBP-TELAS; CAD (classificação etária) |
| Sem celular próprio antes dos 12 anos | CAD; SECOM |
| Não postar fotos em redes públicas | SBP-TELAS |
| Exemplo dos adultos | CAD; SECOM (uso excessivo dos adultos como fator) |

### rt7. Dentes

| Afirmação | Fonte |
|---|---|
| Escovar desde o primeiro dente, ao menos 2 vezes ao dia, escova pequena e macia | CAD; SBP-BUCAL (após o café da manhã e antes de dormir) |
| Creme com flúor de no mínimo 1.000 ppm; grão de arroz até 3 anos e 11 meses; grão de ervilha a partir de 4 anos; não engolir a espuma | CAD (texto quase literal) |
| Adulto escova até 5 anos; supervisão até cerca de 8 anos | SBP-BUCAL (out/2026); CAD |
| Fio dental quando os dentes se tocam | CAD |
| Mamadeira noturna e cárie rápida; nada de açúcar na mamadeira | CAD |
| Sem açúcar antes dos 2 anos | SBP-BUCAL; GUIA2 |
| Primeira consulta no primeiro dente ou até 1 ano | SBP-BUCAL |
| Alerta: trauma, procurar o dentista imediatamente | CAD |

### rt8. Seletividade alimentar

| Afirmação | Fonte |
|---|---|
| Após 1 ano o apetite cai porque o crescimento desacelera; pode recusar o que aceitava | GUIA2 ("Desafio: a criança que não quer comer") |
| Respeitar saciedade; porções pequenas | GUIA2 |
| Não forçar, chantagear, castigar à mesa, nem premiar com doce ou presente | GUIA2 (texto quase literal) |
| Oferecer de novo, de outra forma; algumas crianças precisam provar mais de 8 vezes | GUIA2 |
| Comer junto, sem TV ou celular | GUIA2 |
| Beliscos e ultraprocessados tiram o apetite | GUIA2 (comer no intervalo reduz o apetite); GUIAPOP (ultraprocessados) |
| Alerta: curva de crescimento, poucos alimentos, engasgos e vômitos | CAD (dificuldade de alimentação entre os sinais de alerta; curvas de crescimento). Lista prática é minha |

### Pontos para o pediatra decidir (Rotina)

1. **Pausa para se acalmar ("time-out")**: a política da AAP de 2018 fala em estratégias positivas; a pausa aparece nos materiais da AAP para famílias. Manter ou tirar?
2. **Quantidade de creme dental** (grão de arroz/ervilha) e **1.000 ppm**: não é medicamento, mas é quantidade. Está na Caderneta. Confirmar se cabe na regra de "sem quantidades".
3. **Sinal de alerta do desfralde "voltou a escapar depois de meses"**: acréscimo clínico meu (pode ser infecção urinária, constipação, estresse). Validar.
4. **Disque 100 e Conselho Tutelar em rt2**: confirmar se o app deve indicar canais de denúncia numa aula para pais.
5. **Ritual de sono "escovar os dentes"** dentro do ritual e escovação "sempre antes de dormir" em rt7: coerentes, mas confirmar se quer a escovação como último passo depois da última mamada/leite.
6. **Higiene do sono**: o documento da SBP é de 2021; há nota mais recente da SBP sobre qualidade do sono que não consegui abrir. Verificar se mudou algo.
7. **Alimentação depois dos 2 anos**: o Guia para menores de 2 anos é a base; para 2 a 6 anos só cito o Guia da População Brasileira (2014) para ultraprocessados. O guia da SBP sobre dificuldades alimentares (2022) foi feito com colaboração da indústria (análise crítica na revista Demetra, 2023); não usei.

## Onde a evidência foi fraca ou não pude conferir no original

- 7ª edição da Caderneta: existe (BVS lista "7ª edição revisada", 2025; MS anunciou a 7ª ed. em 2024 com o M-CHAT-R/F), mas o PDF devolveu 403. O texto citado é o da 6ª ed. (2023).
- CTB art. 64: o Planalto bloqueou acesso automatizado; texto conferido em transcrição de artigo jurídico (Migalhas, 2021), coerente com a Resolução 819 lida no original.
- AAP (carro, afogamento, disciplina, TEA): li resumos no PubMed, não os textos completos. Detalhes como 1,45 m (4 pés e 9 pol.), "sem álcool" e "time-out" vêm de versões anteriores ou de materiais da AAP para famílias.
- Queimaduras: não consegui abrir a Cartilha para Tratamento de Emergência das Queimaduras (MS, 2012), dirigida a profissionais. A orientação para leigos vem da OMS (2026); o tempo de resfriamento diverge de comunicados do MS.
- Irmãos maiores e baterias/ímãs (sg7): reportagem de 2026 citando a SBP, não documento da SBP.
- Disque 100 e Disque-Intoxicação: números confirmados; cobertura do Disque-Intoxicação em todos os estados não confirmada.
- Lei 14.826/2024: conferi ementa e artigos por fontes secundárias e páginas da Câmara e do Senado, não o texto no Planalto.
