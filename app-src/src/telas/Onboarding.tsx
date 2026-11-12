import { useState } from "react";
import { Coruja } from "../Coruja";
import { hojeIso } from "../lib/idade";
import type { Crianca } from "../lib/store";
import type { Sexo } from "../lib/oms";

export function Onboarding({ onSalvar, inicial, titulo }: { onSalvar: (c: Crianca) => void; inicial?: Crianca; titulo?: string }) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [nascimento, setNascimento] = useState(inicial?.nascimento ?? "");
  const [sexo, setSexo] = useState<Sexo | "">(inicial?.sexo ?? "");
  const hoje = hojeIso();
  const valido = nome.trim().length > 0 && nascimento !== "" && nascimento <= hoje && sexo !== "";

  return (
    <>
      {!inicial && (
        <div className="card noite" style={{ alignItems: "center", textAlign: "center", padding: 24 }}>
          <div style={{ width: 120 }}><Coruja clara titulo="Tranquilim" /></div>
          <h1 style={{ fontSize: 30 }}>Tranquilim</h1>
          <p className="muted">Orientação em saúde infantil feita por médicos, na hora da dúvida.</p>
        </div>
      )}
      <div className="card">
        <h2>{titulo ?? (inicial ? "Dados da criança" : "Vamos começar pela criança")}</h2>
        <label className="campo">
          Nome ou apelido
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="off" />
        </label>
        <label className="campo">
          Data de nascimento
          <input id="nascimento" type="date" value={nascimento} max={hoje} onChange={(e) => setNascimento(e.target.value)} />
        </label>
        <div className="campo">
          Para as curvas de crescimento
          <div className="segmento">
            <button type="button" className={sexo === "menina" ? "ativa" : ""} onClick={() => setSexo("menina")}>Menina</button>
            <button type="button" className={sexo === "menino" ? "ativa" : ""} onClick={() => setSexo("menino")}>Menino</button>
          </div>
        </div>
        <button className="btn bloco" disabled={!valido} onClick={() => sexo && onSalvar({ nome: nome.trim(), nascimento, sexo })}>
          {inicial ? "Salvar" : "Cadastrar"}
        </button>
        <p className="muted pequeno">Os dados ficam na sua conta. Só você e o pediatra que você escolher veem.</p>
      </div>
    </>
  );
}
