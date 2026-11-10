// Leitura da carteira de vacinação (foto ou PDF) pelo Claude.
//
// A leitura só PROPÕE: a tela mostra cada vacina ao lado da foto e nada entra na
// caderneta sem alguém confirmar. Letra ruim ou data borrada vira confiança
// "baixa", que a tela deixa desmarcada.

import Anthropic from "@anthropic-ai/sdk";
import { CALENDARIO } from "../src/lib/vacinas";

export type RegistroLido = {
  calendarioId: string; // id do CALENDARIO, ou "outra"
  nomeNaCarteira: string;
  data: string; // AAAA-MM-DD, ou "" se não deu para ler
  confianca: "alta" | "media" | "baixa";
  nota: string;
};

export type LeituraCarteira = { legivel: boolean; observacao: string; registros: RegistroLido[] };

export type LeitorCarteira = (arquivo: { mime: string; bytes: Buffer }, contexto: { nascimento: string }) => Promise<LeituraCarteira>;

const IDS = [...CALENDARIO.map((v) => v.id), "outra"];

const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: ["legivel", "observacao", "registros"],
  properties: {
    legivel: { type: "boolean" },
    observacao: { type: "string" },
    registros: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["calendarioId", "nomeNaCarteira", "data", "confianca", "nota"],
        properties: {
          calendarioId: { type: "string", enum: IDS },
          nomeNaCarteira: { type: "string" },
          data: { type: "string" },
          confianca: { type: "string", enum: ["alta", "media", "baixa"] },
          nota: { type: "string" },
        },
      },
    },
  },
};

const INSTRUCOES = `Você lê carteiras de vacinação de crianças brasileiras (caderneta da criança do SUS, cartões de clínicas particulares, comprovantes impressos) para ajudar o pediatra e a família a conferir o que já foi aplicado.

Regras:
- Registre só doses que têm sinal de aplicação: data, carimbo, lote ou rubrica. Espaço em branco ou só a data agendada (aprazamento, geralmente a lápis) NÃO é dose aplicada.
- Mapeie cada dose para um id do calendário abaixo. Se uma vacina cobre mais de um item (hexavalente = pentavalente + VIP da mesma dose; tetraviral SCRV = item "scrv"; meningocócica ACWY aos 3 e 5 meses cobre menc-1 e menc-2), escreva um registro para cada id coberto, com a mesma data e explique na nota.
- Pneumocócica 10, 13, 15 ou 20-valente conta para pneumo-1/2/r pela ordem das doses. Rotavírus monovalente ou pentavalente conta para rota-1/rota-2 (a 3ª dose da pentavalente vai como "outra").
- Influenza de qualquer ano: só a primeira vai como flu-1; as outras como "outra" com o ano na nota.
- Vacina fora da lista (meningocócica B, dengue, VOP de campanha, doses extras) vai como "outra".
- Datas no formato AAAA-MM-DD. Se o ano estiver com dois dígitos, deduza pelo nascimento da criança. Se não der para ler a data com segurança, deixe "" e confiança "baixa".
- confianca "alta" só quando o nome e a data estão claros. Use "media" quando precisou deduzir a equivalência ou um dígito da data, e "baixa" quando está em dúvida.
- Não invente: na dúvida, menos registros com confiança honesta.
- "observacao": uma frase curta para a família sobre a qualidade da imagem ou o que não deu para ler (ex.: "A página das vacinas de 4 meses ficou cortada").`;

function textoCalendario(): string {
  return CALENDARIO.map((v) => `${v.id}: ${v.nome}, ${v.dose} (prevista aos ${v.idadeMeses} meses)`).join("\n");
}

export function criarLeitorClaude(chave: string, modelo: string, esforco: "low" | "medium" | "high" | "xhigh" | "max"): LeitorCarteira {
  const cliente = new Anthropic({ apiKey: chave, timeout: 180_000, maxRetries: 2 });
  return async (arquivo, contexto) => {
    const dados = arquivo.bytes.toString("base64");
    const bloco: Anthropic.Beta.BetaContentBlockParam =
      arquivo.mime === "application/pdf"
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: dados } }
        : { type: "image", source: { type: "base64", media_type: arquivo.mime as "image/jpeg" | "image/png" | "image/webp", data: dados } };

    const stream = cliente.beta.messages.stream({
      model: modelo,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: esforco, format: { type: "json_schema", schema: ESQUEMA } },
      system: [{ type: "text", text: `${INSTRUCOES}\n\nCalendário (id: vacina):\n${textoCalendario()}`, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: [bloco, { type: "text", text: `Nascimento da criança: ${contexto.nascimento}. Leia a carteira e devolva o JSON.` }],
        },
      ],
    });
    const resposta = await stream.finalMessage();
    if (resposta.stop_reason === "refusal") throw new Error("A leitura foi recusada pelo modelo.");
    if (resposta.stop_reason === "max_tokens") throw new Error("A leitura ficou longa demais.");
    const texto = resposta.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
    return validarLeitura(JSON.parse(texto));
  };
}

/** Confere a resposta antes de mostrar (e descarta o que não faz sentido). */
export function validarLeitura(x: unknown): LeituraCarteira {
  const o = x as Partial<LeituraCarteira>;
  if (!o || typeof o !== "object" || !Array.isArray(o.registros)) throw new Error("Resposta da leitura fora do formato.");
  const registros = o.registros
    .filter((r): r is RegistroLido => !!r && IDS.includes(r.calendarioId) && typeof r.nomeNaCarteira === "string")
    .map((r) => ({
      calendarioId: r.calendarioId,
      nomeNaCarteira: r.nomeNaCarteira.slice(0, 120),
      data: /^\d{4}-\d{2}-\d{2}$/.test(r.data) ? r.data : "",
      confianca: (["alta", "media", "baixa"] as const).includes(r.confianca) ? r.confianca : "baixa",
      nota: typeof r.nota === "string" ? r.nota.slice(0, 300) : "",
    }));
  return { legivel: o.legivel !== false, observacao: typeof o.observacao === "string" ? o.observacao.slice(0, 300) : "", registros };
}
