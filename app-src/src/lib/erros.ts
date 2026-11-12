// Manda para o servidor os erros que acontecem no aparelho, para sabermos o que quebrou
// sem depender de alguém contar. Só a mensagem técnica e a tela; nada do que a família digitou.

const enviados = new Set<string>();
let total = 0;

export function registrarErro(erro: unknown, onde = location.hash || location.pathname) {
  const e = erro instanceof Error ? erro : new Error(typeof erro === "string" ? erro : "Erro desconhecido");
  const chave = `${e.message}|${onde}`;
  if (enviados.has(chave) || total >= 10) return;
  enviados.add(chave);
  total++;
  try {
    void fetch("/api/erro", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mensagem: e.message.slice(0, 500), pilha: (e.stack ?? "").slice(0, 3000), onde: onde.slice(0, 200) }),
    }).catch(() => undefined);
  } catch {
    // sem rede: deixa para lá
  }
}

export function instalarCapturaDeErros() {
  window.addEventListener("error", (ev) => registrarErro(ev.error ?? ev.message));
  window.addEventListener("unhandledrejection", (ev) => {
    const r = ev.reason as { status?: number } | undefined;
    // Falhas de rede e respostas esperadas da API (ex.: senha errada) não são defeito do app.
    if (r && typeof r.status === "number") return;
    registrarErro(ev.reason);
  });
}
