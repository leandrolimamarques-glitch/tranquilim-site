import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { dataBr } from "../lib/idade";
import { compartilharPdf } from "../lib/pdf";

type Doc = { id: string; tipo: "receita" | "atestado" | "comparecimento" | "exame"; medico: string; criadoEm: string };
const ROTULO = { receita: "Receita", atestado: "Atestado", comparecimento: "Declaração de comparecimento", exame: "Pedido de exames" } as const;

/** Documentos que o pediatra mandou para o app (receita, atestado, pedido de exame). */
export function DocumentosDoPediatra({ criancaId, nome }: { criancaId: string; nome: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!criancaId) return;
    api.get<{ documentos: Doc[] }>(`/api/criancas/${criancaId}/documentos`).then((r) => setDocs(r.documentos)).catch(() => setDocs([]));
  }, [criancaId]);
  if (!docs.length) return null;
  return (
    <div className="card">
      <h3>Documentos do pediatra</h3>
      <p className="muted pequeno">Para valer na farmácia ou na escola, precisam da assinatura do médico no papel.</p>
      {docs.slice(0, 6).map((d) => (
        <div key={d.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <span>{ROTULO[d.tipo]}<span className="muted pequeno" style={{ display: "block" }}>{d.medico} · {dataBr(d.criadoEm.slice(0, 10))}</span></span>
          <button className="btn sec" style={{ minHeight: 44 }} onClick={() => void compartilharPdf(`/api/criancas/${criancaId}/documentos/${d.id}/pdf`, `${d.tipo}-${nome.split(" ")[0]}-${d.criadoEm.slice(0, 10)}.pdf`).catch((e: Error) => setMsg(e.message))}>Abrir</button>
        </div>
      ))}
      {msg && <p className="pequeno" style={{ color: "var(--ps)" }}>{msg}</p>}
    </div>
  );
}
