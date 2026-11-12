// Política de privacidade e Termos de uso. Texto simples, para pais e mães.
// Ao mudar qualquer um dos dois, troque VERSAO_TERMOS (versao-termos.ts): todos aceitam de novo.

import { VERSAO_TERMOS } from "./versao-termos";

export type SecaoLegal = { titulo: string; paragrafos: string[] };
export type DocumentoLegal = { titulo: string; versao: string; secoes: SecaoLegal[] };

const dataVersao = VERSAO_TERMOS.split("-").reverse().join("/");

export const POLITICA: DocumentoLegal = {
  titulo: "Política de privacidade",
  versao: dataVersao,
  secoes: [
    {
      titulo: "Quem cuida dos seus dados",
      paragrafos: [
        "O Tranquilim é mantido pelos médicos Dr. Francisco Martiniano (CRM-SP 199456) e Dr. Leandro L. Marques (CRM-SP 216.200), responsáveis pelo tratamento dos dados (controladores, na Lei Geral de Proteção de Dados, a LGPD). O encarregado de dados é o Dr. Leandro L. Marques.",
        "Para falar com a gente sobre seus dados, use o app: Ajustes → Sugestão ou problema.",
      ],
    },
    {
      titulo: "Que dados guardamos",
      paragrafos: [
        "Da sua conta: nome, e-mail, senha (guardada embaralhada, de um jeito que nem nós conseguimos ler), a data do cadastro e a data em que você aceitou esta política.",
        "Das crianças que você cadastra: nome, data de nascimento e sexo; vacinas; medidas (peso, comprimento, cabeça); o diário (mamadas, xixi, cocô, sono); as aulas vistas; a foto ou o PDF da carteira de vacinação e o que a leitura encontrou nela; as perguntas feitas no \"Pergunte ao Tranquilim\" e as respostas.",
        "Se você é pediatra: registro no conselho, título, telefone, WhatsApp, local de atendimento e o que você anota na agenda e no financeiro.",
        "Dados técnicos: quando algo dá errado no app, guardamos por 90 dias a mensagem técnica do erro, a tela e o tipo de navegador, para corrigir. Usamos um cookie só para manter você conectado. Não usamos cookies de propaganda nem ferramentas que acompanham o que você faz.",
        "Neste aparelho, o app guarda uma cópia da sua conta para abrir sem internet. Ao sair da conta, essa cópia é apagada.",
      ],
    },
    {
      titulo: "Para que usamos",
      paragrafos: [
        "Para mostrar a caderneta, os avisos e as orientações da idade da criança; para o pediatra que você escolheu acompanhar; para responder às perguntas e ler a carteira de vacinação; para mandar e-mails da conta (confirmação, senha nova) e lembretes de vacina, que você pode desligar; e para corrigir erros e melhorar o app.",
        "Não vendemos nem alugamos dados. Não usamos dados das crianças para propaganda.",
      ],
    },
    {
      titulo: "Por que podemos tratar esses dados",
      paragrafos: [
        "Dados de saúde são dados sensíveis (LGPD, art. 11), e dados de criança só podem ser tratados com o consentimento específico e em destaque de pelo menos um dos pais ou do responsável legal (art. 14). Por isso pedimos o seu aceite ao criar a conta. Você pode retirar esse consentimento quando quiser, excluindo a conta.",
        "Os dados da sua própria conta (nome, e-mail, senha) são usados para prestar o serviço que você pediu (art. 7º, V).",
      ],
    },
    {
      titulo: "Quem mais vê",
      paragrafos: [
        "Quem você incluir como outro responsável pela criança.",
        "O pediatra que você escolher, ou cujo pedido você aceitar: ele vê vacinas, medidas, diário, carteira e perguntas das crianças que você marcou. Você pode tirar o pediatra a qualquer momento, em Ajustes.",
        "Os médicos responsáveis pelo Tranquilim, como administradores: veem nome e e-mail das contas e as perguntas feitas à inteligência artificial, com o nome da criança, para conferir se as respostas estão seguras.",
        "Empresas que fazem o app funcionar, só para isso: Fly.io (servidor do app, em São Paulo); Neon (banco de dados, em São Paulo); Anthropic (inteligência artificial que lê a carteira de vacinação e responde às perguntas, nos Estados Unidos; recebe a foto da carteira, a pergunta, o primeiro nome e a idade da criança e o nome do pediatra; pelo contrato dela, não usa esses dados para treinar a inteligência artificial); Resend (envio dos e-mails, nos Estados Unidos; recebe seu nome e e-mail); Unsplash (fotos das receitas e brincadeiras: o seu aparelho baixa as fotos direto da Unsplash, que recebe o endereço de internet do aparelho, mas nenhum dado da conta).",
        "Autoridades, quando a lei obrigar.",
      ],
    },
    {
      titulo: "Dados fora do Brasil",
      paragrafos: [
        "A leitura da carteira, as perguntas e os e-mails passam por empresas nos Estados Unidos (Anthropic e Resend). Ao aceitar esta política, você consente com essa transferência (LGPD, art. 33, VIII). Se não quiser, não use a leitura da carteira nem o \"Pergunte ao Tranquilim\": o resto do app funciona igual.",
      ],
    },
    {
      titulo: "Por quanto tempo",
      paragrafos: [
        "Enquanto a sua conta existir. Ao excluir a conta, apagamos na hora a conta e as crianças que não têm outro responsável, com tudo delas. Uma criança que tem outro responsável continua na conta dele, sem o vínculo com você.",
        "Ao tirar uma criança da conta, se ninguém mais for responsável por ela, os registros dela são apagados.",
        "As cópias de segurança automáticas do banco de dados se apagam sozinhas em até 30 dias. Registros de erro, em 90 dias.",
      ],
    },
    {
      titulo: "Seus direitos",
      paragrafos: [
        "Pela LGPD (art. 18), você pode: saber se tratamos seus dados e ter uma cópia deles (Ajustes → Baixar meus dados); corrigir (editar em Ajustes e na Caderneta); excluir e retirar o consentimento (Ajustes → Excluir minha conta); saber com quem compartilhamos (item \"Quem mais vê\"); e reclamar à Autoridade Nacional de Proteção de Dados (ANPD), em gov.br/anpd.",
      ],
    },
    {
      titulo: "Segurança",
      paragrafos: [
        "A conexão com o app é protegida (HTTPS), a senha fica embaralhada e cada pessoa só vê as crianças às quais tem acesso. Nenhum sistema é totalmente à prova de falhas: se acontecer um incidente que possa trazer risco a você, avisamos você e a ANPD (art. 48).",
      ],
    },
    {
      titulo: "Crianças",
      paragrafos: ["O Tranquilim é para pais, mães e responsáveis. A criança não usa o app nem cria conta."],
    },
    {
      titulo: "Mudanças nesta política",
      paragrafos: ["Quando esta política mudar, o app mostra o texto novo e pede o seu aceite de novo."],
    },
  ],
};

export const TERMOS: DocumentoLegal = {
  titulo: "Termos de uso",
  versao: dataVersao,
  secoes: [
    {
      titulo: "O que é o Tranquilim",
      paragrafos: [
        "Um app de orientação em saúde infantil para pais, mães e responsáveis, feito por médicos. Ele ajuda a entender, organizar e decidir quando procurar atendimento.",
        "O Tranquilim não substitui a consulta, o exame da criança nem o pediatra. Não é serviço de emergência: em emergência, ligue 192.",
      ],
    },
    {
      titulo: "Vai ao PS?",
      paragrafos: [
        "Os fluxos orientam a partir das suas respostas e seguem diretrizes do Ministério da Saúde e da Sociedade Brasileira de Pediatria. Se a criança parecer pior do que as respostas mostram, ou se você estiver em dúvida, procure atendimento.",
      ],
    },
    {
      titulo: "Pergunte ao Tranquilim",
      paragrafos: [
        "É uma inteligência artificial que segue regras definidas pelos médicos: não dá dose de remédio, diagnóstico nem receita, e encaminha ao pediatra ou ao pronto-socorro quando é o caso. Ela pode errar. Use as respostas como orientação geral, nunca como decisão sobre tratamento.",
      ],
    },
    {
      titulo: "Leitura da carteira de vacinação",
      paragrafos: [
        "A leitura pela foto pode errar. Confira cada vacina antes de salvar. Vale sempre o que está anotado na carteira oficial.",
      ],
    },
    {
      titulo: "Sua conta",
      paragrafos: [
        "Ao criar a conta, você declara ser maior de idade e ser pai, mãe ou responsável legal pela criança que cadastrar, ou ter autorização deles. Mantenha os dados corretos e não compartilhe a sua senha.",
      ],
    },
    {
      titulo: "Pediatras",
      paragrafos: [
        "A função de pediatra é liberada pelos administradores depois de conferir o registro no conselho. O pediatra responde pelos seus atos profissionais. O Tranquilim não marca consultas, não faz teleconsulta e não intermedeia pagamentos. Os valores e impostos do financeiro são estimativas para organização: confirme com o seu contador.",
      ],
    },
    {
      titulo: "Preço",
      paragrafos: ["O Tranquilim é gratuito neste período de teste. Se um dia passar a ser pago, avisaremos antes e ninguém será cobrado sem concordar."],
    },
    {
      titulo: "Uso indevido",
      paragrafos: ["Podemos suspender a conta de quem usar o app para enganar, prejudicar outras pessoas ou acessar dados de crianças sem ser responsável por elas."],
    },
    {
      titulo: "Lei",
      paragrafos: ["Valem as leis do Brasil, incluindo o Código de Defesa do Consumidor e a LGPD."],
    },
  ],
};
