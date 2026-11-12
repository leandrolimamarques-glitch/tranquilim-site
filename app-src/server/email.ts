// Envio de e-mail (confirmação de cadastro e "esqueci a senha") pelo Resend.

export type Carteiro = (m: { para: string; assunto: string; texto: string; html: string }) => Promise<void>;

export function criarCarteiroResend(chave: string, remetente: string): Carteiro {
  return async (m) => {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: remetente, to: [m.para], subject: m.assunto, text: m.texto, html: m.html }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
  };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function mensagem(titulo: string, paragrafos: string[], botao: { texto: string; url: string }) {
  const texto = `${titulo}\n\n${paragrafos.join("\n\n")}\n\n${botao.texto}: ${botao.url}\n\nTranquilim · Em emergência, ligue 192.`;
  const html = `<!doctype html><html><body style="margin:0;background:#FBF7F0;font-family:Arial,sans-serif;color:#1E2A47">
<div style="max-width:480px;margin:0 auto;padding:24px">
<div style="background:#1E2A47;color:#F6EFE4;border-radius:16px;padding:20px;text-align:center;font-size:22px;font-weight:bold">Tranquilim</div>
<h2 style="font-size:20px;margin:20px 0 8px">${esc(titulo)}</h2>
${paragrafos.map((p) => `<p style="font-size:16px;line-height:1.5;margin:0 0 12px">${esc(p)}</p>`).join("")}
<p style="text-align:center;margin:24px 0"><a href="${esc(botao.url)}" style="background:#F2A93B;color:#1E2A47;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:12px;display:inline-block">${esc(botao.texto)}</a></p>
<p style="font-size:13px;color:#5D6378">Se o botão não abrir, copie este endereço no navegador: ${esc(botao.url)}</p>
<p style="font-size:13px;color:#5D6378">Em emergência, ligue 192.</p>
</div></body></html>`;
  return { texto, html };
}
