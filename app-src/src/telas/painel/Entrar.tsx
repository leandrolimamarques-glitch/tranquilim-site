import { useState, type ChangeEvent, type FormEvent } from "react";
import { Coruja } from "../../Coruja";
import { api } from "../../lib/api";
import { telefoneBr } from "../../lib/convite";
import type { MedicoConta } from "./Painel";

export function Entrar({ aoEntrar, sair }: { aoEntrar: (m: MedicoConta) => void; sair: () => void }) {
  const [modo, setModo] = useState<"entrar" | "cadastro">("entrar");
  const [f, setF] = useState({ email: "", senha: "", nome: "", registro: "", titulo: "", whatsapp: "", local: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const campo = (k: keyof typeof f) => ({ value: f[k], onChange: (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }) });
  const zapOk = !f.whatsapp.trim() || !!telefoneBr(f.whatsapp);
  const valido = f.email.includes("@") && f.senha.length >= 8 && (modo === "entrar" || (f.nome.trim().length >= 3 && f.registro.trim().length >= 4 && zapOk));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const r = await api.post<{ medico: MedicoConta }>(modo === "entrar" ? "/api/medico/entrar" : "/api/medico/cadastro", f);
      aoEntrar(r.medico);
    } catch (er) {
      setErro((er as Error).message);
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="card noite" style={{ alignItems: "center", textAlign: "center", padding: 24 }}>
        <div style={{ width: 88 }}><Coruja clara titulo="Tranquilim" /></div>
        <h1 style={{ fontSize: 26 }}>Painel do pediatra</h1>
        <p className="muted">Pacientes, carteiras de vacina, agenda do consultório e dos plantões, e o financeiro num lugar só.</p>
      </div>
      <div className="segmento">
        <button className={modo === "entrar" ? "ativa" : ""} onClick={() => setModo("entrar")}>Entrar</button>
        <button className={modo === "cadastro" ? "ativa" : ""} onClick={() => setModo("cadastro")}>Criar conta</button>
      </div>
      <form className="card" onSubmit={enviar}>
        {modo === "cadastro" && (
          <>
            <label className="campo">Nome como as famílias veem<input {...campo("nome")} placeholder="Dr. Nome Sobrenome" autoComplete="name" /></label>
            <label className="campo">Registro<input {...campo("registro")} placeholder="CRM-UF 000000 · RQE 00000" /></label>
            <label className="campo">
              Título (opcional)
              <input {...campo("titulo")} placeholder="Pediatra" />
              <span className="muted pequeno" style={{ fontWeight: 500 }}>Especialidade só com RQE registrado (regra do CFM). Sem RQE, deixe em branco.</span>
            </label>
            <label className="campo">
              WhatsApp do consultório (opcional)
              <input {...campo("whatsapp")} inputMode="tel" placeholder="(11) 90000-0000" />
              {!zapOk && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}
            </label>
            <label className="campo">Endereço ou horário (opcional)<input {...campo("local")} /></label>
          </>
        )}
        <label className="campo">E-mail<input {...campo("email")} type="email" autoComplete="email" /></label>
        <label className="campo">Senha<input {...campo("senha")} type="password" autoComplete={modo === "entrar" ? "current-password" : "new-password"} placeholder={modo === "cadastro" ? "pelo menos 8 caracteres" : ""} /></label>
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" type="submit" disabled={!valido || enviando}>{enviando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}</button>
      </form>
      <button className="voltar" onClick={sair}>‹ Voltar ao app da família</button>
    </>
  );
}
