// Servidor local para desenvolvimento e testes no navegador: Postgres em memória
// (PGlite) e leitura de carteira de mentira, sem gastar chave.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bancoMemoria, migrar } from "./banco";
import { criarApp } from "./app";
import { criarLeitorClaude, type LeitorCarteira } from "./leitura";
import { validarResposta, type Assistente } from "./pergunta";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const banco = await bancoMemoria();
await migrar(banco);
const falso: LeitorCarteira = async () => {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    legivel: true,
    observacao: "Leitura de teste (servidor local).",
    registros: [
      { calendarioId: "bcg", nomeNaCarteira: "BCG", data: "2026-01-02", confianca: "alta", nota: "" },
      { calendarioId: "hepb-0", nomeNaCarteira: "Hep B", data: "2026-01-02", confianca: "alta", nota: "" },
      { calendarioId: "penta-1", nomeNaCarteira: "Hexa", data: "2026-03-05", confianca: "media", nota: "Hexavalente: conta para penta e VIP." },
      { calendarioId: "vip-1", nomeNaCarteira: "Hexa", data: "2026-03-05", confianca: "media", nota: "Hexavalente: conta para penta e VIP." },
      { calendarioId: "rota-1", nomeNaCarteira: "Rota?", data: "", confianca: "baixa", nota: "Data borrada." },
      { calendarioId: "outra", nomeNaCarteira: "Meningocócica B", data: "2026-03-10", confianca: "alta", nota: "" },
    ],
  };
};
const chave = process.env.LLM_API_KEY;
const assistenteFalso: Assistente = async (p) =>
  validarResposta(/febre|tosse|vomit/i.test(p) ? { tipo: "fluxo", resposta: "Responda as perguntas do Vai ao PS? para saber o que fazer.", fluxo: /febre/i.test(p) ? "febre" : /tosse/i.test(p) ? "respiratorio" : "vomito-diarreia" } : /remedio|dose|dipirona/i.test(p) ? { tipo: "medico", resposta: "Essa é para o seu pediatra.", fluxo: "" } : { tipo: "orientacao", resposta: "Resposta de teste do servidor local.", fluxo: "" });
const app = criarApp({
  banco,
  leitor: chave ? criarLeitorClaude(chave, process.env.LLM_MODEL ?? "claude-opus-5-5", "high") : falso,
  assistente: assistenteFalso,
  cookieSeguro: false,
  pastaPublica: process.env.SERVIR_BUILD ? path.join(aqui, "..", "dist", "public") : undefined,
  cadastroAberto: true,
});
const porta = Number(process.env.PORT ?? 8080);
app.listen(porta, () => console.log(`dev: http://localhost:${porta}`));
