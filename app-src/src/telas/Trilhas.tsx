import { useState } from "react";
import { TRILHAS, type Trilha } from "../conteudo/trilhas";
import type { Atualizar, Dados } from "../lib/store";

export function Trilhas({ dados, atualizar }: { dados: Dados; atualizar: Atualizar }) {
  const [trilha, setTrilha] = useState<Trilha | null>(TRILHAS.length === 1 ? TRILHAS[0] : null);
  const [aulaIdx, setAulaIdx] = useState<number | null>(null);

  if (!trilha) {
    return (
      <>
        <h1 style={{ fontSize: 28 }}>Trilhas</h1>
        {TRILHAS.map((t) => (
          <button key={t.id} className="opcao" onClick={() => setTrilha(t)}>{t.titulo}</button>
        ))}
      </>
    );
  }

  const vista = (id: string) => dados.aulasVistas.includes(id);
  const marcar = (id: string) =>
    atualizar((d) => ({ ...d, aulasVistas: d.aulasVistas.includes(id) ? d.aulasVistas : [...d.aulasVistas, id] }));

  if (aulaIdx !== null) {
    const a = trilha.aulas[aulaIdx];
    const proxima = aulaIdx + 1 < trilha.aulas.length ? aulaIdx + 1 : null;
    return (
      <>
        <button className="voltar" onClick={() => setAulaIdx(null)}>‹ {trilha.titulo}</button>
        <span className="muted pequeno" style={{ fontWeight: 700 }}>Aula {aulaIdx + 1} de {trilha.aulas.length}</span>
        <h1 style={{ fontSize: 26 }}>{a.titulo}</h1>
        <div className="video">Vídeo com o pediatra em gravação.<br />Por enquanto, o conteúdo da aula está abaixo.</div>
        <p style={{ fontFamily: "var(--f-d)", fontSize: 19, fontWeight: 500, color: "var(--hoje)" }}>{a.gancho}</p>
        <div className="card">
          <ul className="lista">{a.pontos.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div className="alerta"><b>Quando procurar ajuda: </b>{a.alerta}</div>
        <button
          className="btn bloco"
          onClick={() => {
            marcar(a.id);
            setAulaIdx(proxima);
            window.scrollTo(0, 0);
          }}
        >
          {proxima !== null ? "Vista. Próxima aula" : "Vista. Voltar à trilha"}
        </button>
      </>
    );
  }

  const total = trilha.aulas.filter((a) => vista(a.id)).length;
  return (
    <>
      <h1 style={{ fontSize: 28 }}>{trilha.titulo}</h1>
      <p className="muted">{trilha.aulas.length} aulas · {trilha.faixa} · {total} vistas</p>
      <div className="card" style={{ gap: 0, padding: "4px 16px" }}>
        {trilha.aulas.map((a, i) => (
          <button
            key={a.id}
            onClick={() => { setAulaIdx(i); window.scrollTo(0, 0); }}
            style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left", minHeight: 56, border: 0, borderBottom: i < trilha.aulas.length - 1 ? "1px solid var(--line)" : 0, background: "transparent", cursor: "pointer", padding: "8px 0" }}
          >
            <span className={`chip ${vista(a.id) ? "aplicada" : ""}`} style={{ minWidth: 28, justifyContent: "center" }}>{vista(a.id) ? "✓" : i + 1}</span>
            <span style={{ fontWeight: 600 }}>{a.titulo}</span>
          </button>
        ))}
      </div>
      <div className="fontes">
        <b>Fontes</b>
        {trilha.fontes.map((f) => <span key={f}>{f}</span>)}
      </div>
    </>
  );
}
