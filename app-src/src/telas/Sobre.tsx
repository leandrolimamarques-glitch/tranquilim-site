import { Coruja } from "../Coruja";
import { SOBRE } from "../conteudo/sobre";

export function Sobre({ voltar, rotuloVoltar = "Voltar" }: { voltar: () => void; rotuloVoltar?: string }) {
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ {rotuloVoltar}</button>
      <div className="card noite" style={{ alignItems: "center", textAlign: "center", padding: 22 }}>
        <div style={{ width: 96 }}><Coruja clara titulo="Tranquilim" /></div>
        <h1 style={{ fontSize: 26 }}>{SOBRE.titulo}</h1>
      </div>
      {SOBRE.abertura.map((p) => <p key={p} style={{ fontSize: 17 }}>{p}</p>)}
      {SOBRE.medicos.map((m) => (
        <div key={m.nome} className="card">
          <h2>{m.nome}{m.apelido ? <span className="muted" style={{ fontSize: 16, fontWeight: 500 }}> · {m.apelido}</span> : null}</h2>
          <p className="muted">{m.linha}</p>
          <p className="muted pequeno" style={{ fontWeight: 700 }}>{m.registro}</p>
          {m.texto.map((t) => <p key={t}>{t}</p>)}
        </div>
      ))}
      <div className="card">
        <h3>Nosso compromisso</h3>
        <ul className="lista">{SOBRE.compromissos.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </>
  );
}
