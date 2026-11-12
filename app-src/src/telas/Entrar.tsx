import { useState, type ChangeEvent, type FormEvent } from "react";
import { Coruja } from "../Coruja";
import { api } from "../lib/api";
import { Sobre } from "./Sobre";
import { VaiAoPS } from "./VaiAoPS";
import { VISTA_VAZIA } from "../lib/familia";

export function Entrar({ aoEntrar }: { aoEntrar: () => void }) {
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [f, setF] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sobre, setSobre] = useState(false);
  const [ps, setPs] = useState(false);
  const campo = (k: keyof typeof f) => ({ value: f[k], onChange: (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }) });
  const valido = f.email.includes("@") && f.senha.length >= 8 && (modo === "entrar" || f.nome.trim().length >= 2);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await api.post(modo === "entrar" ? "/api/conta/entrar" : "/api/conta/cadastro", f);
      aoEntrar();
    } catch (er) {
      setErro((er as Error).message);
      setEnviando(false);
    }
  };

  if (sobre) return <Sobre voltar={() => setSobre(false)} rotuloVoltar="Entrar" />;
  if (ps) {
    return (
      <>
        <button className="voltar" onClick={() => setPs(false)}>‹ Entrar</button>
        <VaiAoPS dados={{ ...VISTA_VAZIA, criancaId: "", medico: null, vinculo: null, sincronia: "ok" }} />
      </>
    );
  }
  return (
    <>
      <div className="card noite" style={{ alignItems: "center", textAlign: "center", padding: 24 }}>
        <div style={{ width: 110 }}><Coruja clara titulo="Tranquilim" /></div>
        <h1 style={{ fontSize: 30 }}>Tranquilim</h1>
        <p className="muted">Orientação em saúde infantil feita por médicos, na hora da dúvida.</p>
      </div>
      <button className="opcao" style={{ borderColor: "var(--ps)" }} onClick={() => setPs(true)}>
        Criança passando mal agora?
        <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>Vai ao PS, liga ou espera? Funciona sem conta e sem internet.</span>
      </button>
      <div className="segmento">
        <button className={modo === "entrar" ? "ativa" : ""} onClick={() => { setModo("entrar"); setErro(""); }}>Entrar</button>
        <button className={modo === "criar" ? "ativa" : ""} onClick={() => { setModo("criar"); setErro(""); }}>Criar conta</button>
      </div>
      <form className="card" onSubmit={enviar}>
        {modo === "criar" && <label className="campo">Seu nome<input id="nome-conta" {...campo("nome")} autoComplete="name" /></label>}
        <label className="campo">E-mail<input id="email" {...campo("email")} type="email" autoComplete="email" inputMode="email" /></label>
        <label className="campo">Senha<input id="senha" {...campo("senha")} type="password" autoComplete={modo === "entrar" ? "current-password" : "new-password"} placeholder={modo === "criar" ? "pelo menos 8 caracteres" : ""} /></label>
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" type="submit" disabled={!valido || enviando}>{enviando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}</button>
        {modo === "entrar" && <Esqueci emailInicial={f.email} />}
      </form>
      <button className="voltar" style={{ alignSelf: "center" }} onClick={() => setSobre(true)}>Quem somos ›</button>
      <a className="link-192" href="tel:192">Emergência: ligar 192</a>
    </>
  );
}

function Esqueci({ emailInicial }: { emailInicial: string }) {
  const [aberto, setAberto] = useState(false);
  const [email, setEmail] = useState(emailInicial);
  const [msg, setMsg] = useState("");
  if (!aberto) return <button type="button" className="voltar pequeno" onClick={() => { setEmail(emailInicial); setAberto(true); }}>Esqueci a senha</button>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label className="campo">Seu e-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <button type="button" className="btn sec bloco" disabled={!email.includes("@")} onClick={async () => {
        try {
          await api.post("/api/conta/esqueci", { email });
          setMsg("Se este e-mail tiver conta, chega um link para criar a senha nova. Veja também o spam.");
        } catch (e) {
          setMsg((e as Error).message);
        }
      }}>Mandar link</button>
      {msg && <p className="pequeno">{msg}</p>}
    </div>
  );
}
