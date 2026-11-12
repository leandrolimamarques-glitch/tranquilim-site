import { useEffect, useState } from "react";
import { Coruja } from "../Coruja";
import { api } from "../lib/api";

const sair = () => {
  history.replaceState(null, "", "/");
  location.reload();
};

/** Link "criar senha nova" que chega por e-mail. */
export function Redefinir({ token }: { token: string }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <>
      <div className="marca"><Coruja titulo="Tranquilim" /><span>Tranquilim</span></div>
      <h1 style={{ fontSize: 26 }}>Criar senha nova</h1>
      {ok ? (
        <div className="card"><p>Senha trocada. Você já está dentro.</p><button className="btn bloco" onClick={sair}>Abrir o Tranquilim</button></div>
      ) : (
        <div className="card">
          <label className="campo">Senha nova<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" placeholder="pelo menos 8 caracteres" /></label>
          {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
          <button className="btn bloco" disabled={senha.length < 8} onClick={async () => {
            try {
              await api.post("/api/conta/redefinir", { token, senha });
              setOk(true);
            } catch (e) {
              setErro((e as Error).message);
            }
          }}>Salvar senha</button>
        </div>
      )}
    </>
  );
}

/** Link "confirmar e-mail" que chega por e-mail. */
export function Confirmar({ token }: { token: string }) {
  const [msg, setMsg] = useState("Confirmando…");
  useEffect(() => {
    api.post("/api/conta/confirmar", { token }).then(() => setMsg("E-mail confirmado. Obrigado!")).catch((e: Error) => setMsg(e.message));
  }, [token]);
  return (
    <>
      <div className="marca"><Coruja titulo="Tranquilim" /><span>Tranquilim</span></div>
      <div className="card"><p>{msg}</p><button className="btn bloco" onClick={sair}>Abrir o Tranquilim</button></div>
    </>
  );
}
