// Anonimiza conversas exportadas do WhatsApp (iPhone e Android) para estudo interno do
// padrão de dúvidas. Roda no próprio aparelho do médico: nada é enviado ao servidor.
// Sai: nº da conversa, dia da semana e hora (sem a data), quem fala ("Médico" ou
// "Família") e o texto com nomes, telefones, e-mails, CPF, links e números longos
// trocados por marcadores. Mídias e mensagens apagadas saem.

export type Mensagem = { data: string; hora: string; remetente: string; texto: string };

// iPhone: "[13/11/26, 09:23:11] Fulana: texto"   Android: "13/11/2026 09:23 - Fulana: texto"
const LINHA_IOS = /^‎?\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})(?::\d{2})?\]\s+([^:]{1,60}):\s?(.*)$/;
const LINHA_ANDROID = /^‎?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2})\s+-\s+([^:]{1,60}):\s?(.*)$/;

export function lerConversa(txt: string): Mensagem[] {
  const saida: Mensagem[] = [];
  for (const bruta of txt.replace(/\r/g, "").split("\n")) {
    const linha = bruta.replace(/[‎‏‪-‮]/g, "");
    const m = LINHA_IOS.exec(linha) ?? LINHA_ANDROID.exec(linha);
    if (m) saida.push({ data: m[1], hora: m[2].padStart(5, "0"), remetente: m[3].trim(), texto: m[4] });
    else if (saida.length && linha.trim()) saida[saida.length - 1].texto += `\n${linha}`;
  }
  return saida;
}

const MIDIA = /(<m[ií]dia oculta>|<media omitted>|imagem ocultada|v[ií]deo omitido|[áa]udio ocultado|figurinha omitida|documento omitido|gif omitido|anexado:|‎?<anexado:|esta mensagem foi apagada|mensagem apagada|this message was deleted|null)$/i;
const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

function diaDaSemana(data: string): string {
  const [d, m, a] = data.split("/").map(Number);
  const ano = a < 100 ? 2000 + a : a;
  const dt = new Date(ano, m - 1, d);
  return Number.isNaN(dt.getTime()) ? "" : DIAS[dt.getDay()];
}

// Palavras com maiúscula no meio da frase que não são nome de pessoa.
const PERMITIDAS = new Set(
  ("Dr Dra Doutor Doutora Deus PS UPA UBS SUS SAMU UTI Brasil Google WhatsApp Ok OK Bom Boa Oi Olá Obrigado Obrigada " +
    "Janeiro Fevereiro Março Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro " +
    "Segunda Terça Quarta Quinta Sexta Sábado Domingo Natal Páscoa").split(" "),
);

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Troca dados que identificam por marcadores. `nomes` = partes de nomes conhecidos (remetentes, criança). */
export function mascarar(texto: string, nomes: string[]): string {
  let t = texto;
  t = t.replace(/https?:\/\/\S+|www\.\S+/gi, "[link]");
  t = t.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[e-mail]");
  t = t.replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[cpf]");
  t = t.replace(/(\+?\(?\d[\d\s().-]{7,}\d)/g, (m) => (m.replace(/\D/g, "").length >= 8 ? "[telefone]" : m));
  t = t.replace(/\b\d{6,}\b/g, "[número]");
  const partes = [...new Set(nomes.flatMap((n) => n.split(/[\s.,()-]+/)).filter((p) => p.length >= 3 && !PERMITIDAS.has(p)))];
  if (partes.length) t = t.replace(new RegExp(`\\b(${partes.map(escapar).join("|")})\\b`, "gi"), "[nome]");
  // Palavra com inicial maiúscula no meio da frase: provável nome próprio.
  t = t.replace(/([^.!?\n]\s)([A-ZÀ-Ý][a-zà-ÿ]{2,})/g, (m, antes: string, palavra: string) => (PERMITIDAS.has(palavra) ? m : `${antes}[nome]`));
  return t;
}

export type Resultado = { texto: string; conversas: number; mensagens: number };

/**
 * Junta e anonimiza várias conversas. `medico` = como o médico aparece no WhatsApp
 * (as falas dele viram "Médico"; as outras, "Família").
 */
export function anonimizarConversas(arquivos: string[], medico: string): Resultado {
  const linhas: string[] = [
    "Conversas anonimizadas para estudo interno do Tranquilim (não publicar).",
    "Formato: [conversa] dia da semana, hora · quem: texto. Datas, nomes, telefones, e-mails e mídias foram retirados.",
    "",
  ];
  let conversas = 0;
  let mensagens = 0;
  arquivos.forEach((txt) => {
    const msgs = lerConversa(txt).filter((m) => !MIDIA.test(m.texto.trim()));
    if (!msgs.length) return;
    conversas++;
    const nomes = [...new Set(msgs.map((m) => m.remetente))];
    for (const m of msgs) {
      const quem = m.remetente.toLowerCase() === medico.toLowerCase() ? "Médico" : "Família";
      linhas.push(`[${conversas}] ${diaDaSemana(m.data)}, ${m.hora} · ${quem}: ${mascarar(m.texto, nomes)}`);
      mensagens++;
    }
    linhas.push("");
  });
  return { texto: linhas.join("\n"), conversas, mensagens };
}

/** Quem mais aparece nas conversas (para o médico apontar qual é ele). */
export function remetentesFrequentes(arquivos: string[]): string[] {
  const emQuantas = new Map<string, number>();
  for (const txt of arquivos) for (const r of new Set(lerConversa(txt).map((m) => m.remetente))) emQuantas.set(r, (emQuantas.get(r) ?? 0) + 1);
  return [...emQuantas.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r).slice(0, 6);
}
