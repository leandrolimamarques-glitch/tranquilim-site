import path from "node:path";
import { fileURLToPath } from "node:url";
import { bancoPostgres, migrar } from "./banco";
import { criarApp } from "./app";
import { criarLeitorClaude } from "./leitura";
import { criarAssistenteClaude } from "./pergunta";
import { criarCarteiroResend } from "./email";

const aqui = path.dirname(fileURLToPath(import.meta.url));

async function iniciar() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada.");
  const banco = await bancoPostgres(url);
  const feitas = await migrar(banco);
  if (feitas) console.log(`migrações aplicadas: ${feitas}`);

  const chave = process.env.LLM_API_KEY;
  const esforco = (process.env.LLM_EFFORT ?? "high") as "low" | "medium" | "high" | "xhigh" | "max";
  const leitor = chave ? criarLeitorClaude(chave, process.env.LLM_MODEL ?? "claude-opus-5-5", esforco) : undefined;
  if (!leitor) console.warn("LLM_API_KEY ausente: leitura de carteira desligada.");

  const assistente = chave ? criarAssistenteClaude(chave, process.env.LLM_MODELO_ASSISTENTE ?? "claude-haiku-5-5") : undefined;
  const carteiro = process.env.RESEND_API_KEY ? criarCarteiroResend(process.env.RESEND_API_KEY, process.env.EMAIL_REMETENTE ?? "Tranquilim <nao-responda@tranquilim.com.br>") : undefined;
  if (!carteiro) console.warn("RESEND_API_KEY ausente: e-mails desligados.");
  const app = criarApp({
    banco,
    carteiro,
    urlBase: process.env.URL_BASE ?? "https://app.tranquilim.com.br",
    leitor,
    assistente,
    cookieSeguro: process.env.NODE_ENV === "production",
    pastaPublica: path.join(aqui, "public"),
  });
  const porta = Number(process.env.PORT ?? 8080);
  app.listen(porta, "0.0.0.0", () => console.log(`Tranquilim ouvindo na porta ${porta}`));
}

iniciar().catch((e) => {
  console.error(e);
  process.exit(1);
});
