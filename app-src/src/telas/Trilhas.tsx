import { useState } from "react";
import { TRILHAS, trilhasDaIdade } from "../conteudo";
import type { Trilha } from "../conteudo/trilhas";
import { hojeIso, idadeEmMesesDecimal } from "../lib/idade";
import type { Atualizar, Dados } from "../lib/store";
import { Dicas } from "./Dicas";
import { DICAS } from "../conteudo";

export function Trilhas({ dados, atualizar }: { dados: Dados; atualizar: Atualizar }) {
  const [parte, setParte] = useState<"trilhas" | "dicas">("trilhas");
  return (
    <>
      <h1 style={{ fontSize: 28 }}>Aprender</h1>
      <div className="segmento">
        <button className={parte === "trilhas" ? "ativa" : ""} onClick={() => setParte("trilhas")}>Aulas</button>
        {DICAS.length > 0 && <button className={parte === "dicas" ? "ativa" : ""} onClick={() => setParte("dicas")}>Dicas e receitas</button>}
      </div>
      {parte === "trilhas" ? <Aulas dados={dados} atualizar={atualizar} /> : <Dicas dados={dados} />}
    </>
  );
}

function Aulas({ dados, atualizar }: { dados: Dados; atualizar: Atualizar }) {
  const [mais, setMais] = useState(false);
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [aulaIdx, setAulaIdx] = useState<number | null>(null);

  if (!trilha) {
    const meses = dados.crianca ? idadeEmMesesDecimal(dados.crianca.nascimento, hojeIso()) : 0;
    const daFase = trilhasDaIdade(meses);
    const outras = TRILHAS.filter((t) => !daFase.includes(t));
    const Item = ({ t }: { t: Trilha }) => {
      const vistas = t.aulas.filter((a) => dados.aulasVistas.includes(a.id)).length;
      return (
        <button className="opcao" onClick={() => { setTrilha(t); window.scrollTo(0, 0); }}>
          {t.titulo}
          <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>{t.faixa} · {vistas} de {t.aulas.length} aulas</span>
        </button>
      );
    };
    return (
      <>
        {daFase.length > 0 && <h3>Para a idade de {dados.crianca?.nome ?? "agora"}</h3>}
        {daFase.map((t) => <Item key={t.id} t={t} />)}
        {outras.length > 0 && <h3 style={{ marginTop: 8 }}>Outras fases</h3>}
        {outras.map((t) => <Item key={t.id} t={t} />)}
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
        <p style={{ fontFamily: "var(--f-d)", fontSize: 19, fontWeight: 500, color: "var(--hoje)" }}>{a.gancho}</p>
        <div className="card">
          {a.simples ? a.simples.map((p) => <p key={p} style={{ fontSize: 17 }}>{p}</p>) : <ul className="lista">{a.pontos.map((p) => <li key={p}>{p}</li>)}</ul>}
        </div>
        <div className="alerta"><b>Quando procurar ajuda: </b>{a.alerta}</div>
        <button className="btn sec bloco" onClick={() => setMais(!mais)} aria-expanded={mais}>{mais ? "Fechar" : "Entender melhor"}</button>
        {mais && (
          <div className="card">
            {(a.aprofundado ?? []).map((p) => <p key={p}>{p}</p>)}
            {a.simples && (
              <>
                <h3 style={{ marginTop: 6 }}>Na prática</h3>
                <ul className="lista">{a.pontos.map((p) => <li key={p}>{p}</li>)}</ul>
              </>
            )}
            <div className="fontes" style={{ marginTop: 6 }}><b>Fontes</b>{trilha.fontes.map((f) => <span key={f}>{f}</span>)}</div>
          </div>
        )}
        <button
          className="btn bloco"
          onClick={() => {
            marcar(a.id);
            setMais(false);
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
      <button className="voltar" onClick={() => setTrilha(null)}>‹ Aulas</button>
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
