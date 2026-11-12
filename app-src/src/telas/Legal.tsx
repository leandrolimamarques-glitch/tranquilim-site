import { useState } from "react";
import { POLITICA, TERMOS, type DocumentoLegal } from "../conteudo/legal";
import { VERSAO_TERMOS } from "../conteudo/versao-termos";
import { api } from "../lib/api";

export function Legal({ doc, voltar, rotuloVoltar }: { doc: "politica" | "termos"; voltar: () => void; rotuloVoltar: string }) {
  const d: DocumentoLegal = doc === "politica" ? POLITICA : TERMOS;
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ {rotuloVoltar}</button>
      <h1 style={{ fontSize: 26 }}>{d.titulo}</h1>
      <p className="muted pequeno">Versão de {d.versao}</p>
      {d.secoes.map((s) => (
        <div key={s.titulo} className="card">
          <h3>{s.titulo}</h3>
          {s.paragrafos.map((p) => <p key={p}>{p}</p>)}
        </div>
      ))}
      <button className="btn sec bloco" onClick={voltar}>Voltar</button>
    </>
  );
}

/** Caixa de aceite: consentimento específico e em destaque (LGPD, art. 14). */
export function CaixaAceite({ marcado, mudar, abrir }: { marcado: boolean; mudar: (v: boolean) => void; abrir: (d: "politica" | "termos") => void }) {
  return (
    <div className="card" style={{ borderColor: "var(--luz)", borderWidth: 2, gap: 8 }}>
      <label className="sinal" style={{ borderWidth: 0, padding: 0, alignItems: "flex-start" }}>
        <input type="checkbox" checked={marcado} onChange={(e) => mudar(e.target.checked)} style={{ marginTop: 4 }} />
        <span>
          Sou pai, mãe ou responsável legal pelas crianças que vou cadastrar e autorizo o Tranquilim a guardar e usar os dados de saúde delas como explica a Política de privacidade, inclusive a leitura da carteira e as perguntas por inteligência artificial com servidor nos Estados Unidos.
        </span>
      </label>
      <div className="grade2">
        <button type="button" className="btn contorno" style={{ minHeight: 44 }} onClick={() => abrir("politica")}>Ler a Política</button>
        <button type="button" className="btn contorno" style={{ minHeight: 44 }} onClick={() => abrir("termos")}>Ler os Termos</button>
      </div>
    </div>
  );
}

/** Conta antiga ou termos novos: pede o aceite antes de continuar. */
export function PedirAceite({ aceito, sair }: { aceito: () => void; sair: () => void }) {
  const [marcado, setMarcado] = useState(false);
  const [lendo, setLendo] = useState<"politica" | "termos" | null>(null);
  const [erro, setErro] = useState("");
  if (lendo) return <Legal doc={lendo} voltar={() => setLendo(null)} rotuloVoltar="Voltar" />;
  return (
    <>
      <h1 style={{ fontSize: 26 }}>Antes de continuar</h1>
      <p className="muted">Publicamos a Política de privacidade e os Termos de uso do Tranquilim. Para seguir usando, leia e confirme.</p>
      <CaixaAceite marcado={marcado} mudar={setMarcado} abrir={setLendo} />
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
      <button className="btn bloco" disabled={!marcado} onClick={async () => {
        try {
          await api.post("/api/conta/consentimento", { versao: VERSAO_TERMOS });
          aceito();
        } catch (e) {
          setErro((e as Error).message);
        }
      }}>Aceitar e continuar</button>
      <button className="btn contorno bloco" onClick={sair}>Sair da conta</button>
      <a className="link-192" href="tel:192">Emergência: ligar 192</a>
    </>
  );
}
