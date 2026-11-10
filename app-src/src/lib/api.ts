// Chamadas ao servidor do Tranquilim (mesmo endereço do app).

export class ErroApi extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
  }
}

async function chamar<T>(metodo: string, rota: string, corpo?: unknown, tipo = "application/json"): Promise<T> {
  let r: Response;
  try {
    r = await fetch(rota, {
      method: metodo,
      credentials: "same-origin",
      headers: corpo === undefined ? {} : { "content-type": tipo },
      body: corpo === undefined ? undefined : tipo === "application/json" ? JSON.stringify(corpo) : (corpo as BodyInit),
    });
  } catch {
    throw new ErroApi(0, "Sem conexão. Tente de novo quando a internet voltar.");
  }
  const texto = await r.text();
  let dados: unknown = null;
  try {
    dados = texto ? JSON.parse(texto) : null;
  } catch {
    dados = null;
  }
  if (!r.ok) throw new ErroApi(r.status, (dados as { erro?: string })?.erro ?? "Não deu certo. Tente de novo.");
  return dados as T;
}

export const api = {
  get: <T>(rota: string) => chamar<T>("GET", rota),
  post: <T>(rota: string, corpo: unknown = {}) => chamar<T>("POST", rota, corpo),
  put: <T>(rota: string, corpo: unknown) => chamar<T>("PUT", rota, corpo),
  del: <T>(rota: string) => chamar<T>("DELETE", rota),
  enviarArquivo: <T>(rota: string, arquivo: Blob) => chamar<T>("POST", rota, arquivo, arquivo.type),
};
