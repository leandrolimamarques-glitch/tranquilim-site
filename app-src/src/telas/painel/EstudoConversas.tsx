import { useState } from "react";
import { unzipSync } from "fflate";
import { anonimizarConversas, remetentesFrequentes, type Resultado } from "../../lib/anonimizar";
import { compartilharArquivo } from "../../lib/pdf";

/** Lê os arquivos exportados do WhatsApp e tira a identificação, tudo no próprio celular. */
async function lerArquivos(lista: FileList): Promise<string[]> {
  const textos: string[] = [];
  const dec = new TextDecoder("utf-8");
  for (const f of Array.from(lista)) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    if (f.name.toLowerCase().endsWith(".zip") || (bytes[0] === 0x50 && bytes[1] === 0x4b)) {
      const dentro = unzipSync(bytes, { filter: (a) => a.name.toLowerCase().endsWith(".txt") });
      for (const conteudo of Object.values(dentro)) textos.push(dec.decode(conteudo));
    } else textos.push(dec.decode(bytes));
  }
  return textos;
}

export function EstudoConversas({ voltar }: { voltar: () => void }) {
  const [textos, setTextos] = useState<string[]>([]);
  const [candidatos, setCandidatos] = useState<string[]>([]);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState("");

  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Perfil</button>
      <h1 style={{ fontSize: 26 }}>Conversas para estudo</h1>
      <p className="muted">Para entender o padrão das dúvidas das famílias. O app tira nomes, telefones, e-mails, datas e fotos aqui mesmo, no seu celular. Nada é enviado até você tocar em compartilhar.</p>

      <div className="card">
        <h3>1. Exporte as conversas no WhatsApp</h3>
        <ol className="lista">
          <li>Abra a conversa com a família.</li>
          <li>Toque no nome dela, no alto da tela.</li>
          <li>Desça e toque em <b>Exportar conversa</b>.</li>
          <li>Escolha <b>Sem mídia</b>.</li>
          <li>No iPhone, toque em <b>Salvar em Arquivos</b>. No Android, salve no celular.</li>
        </ol>
        <p className="muted pequeno">Repita com umas 30 conversas recentes. Pode salvar todas na mesma pasta. Os áudios aparecem como [áudio], sem o conteúdo: a voz e o que é dito identificam a família.</p>
      </div>

      <div className="card">
        <h3>2. Escolha os arquivos aqui</h3>
        <label className="btn bloco" style={{ cursor: "pointer" }}>
          Escolher arquivos
          <input type="file" multiple accept=".zip,.txt,application/zip,text/plain" style={{ display: "none" }} onChange={async (e) => {
            setErro("");
            setResultado(null);
            if (!e.target.files?.length) return;
            try {
              const t = await lerArquivos(e.target.files);
              setTextos(t);
              setCandidatos(remetentesFrequentes(t));
              if (!t.length) setErro("Não achei conversa nesses arquivos. Use os arquivos do Exportar conversa.");
            } catch {
              setErro("Não consegui abrir esses arquivos. Use os arquivos do Exportar conversa.");
            }
          }} />
        </label>
        {textos.length > 0 && <p className="pequeno">{textos.length} {textos.length === 1 ? "conversa encontrada" : "conversas encontradas"}.</p>}
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
      </div>

      {candidatos.length > 0 && !resultado && (
        <div className="card">
          <h3>3. Qual destes é você?</h3>
          <p className="muted pequeno">Assim as suas mensagens aparecem como "Médico" e as outras como "Família".</p>
          {candidatos.map((c) => (
            <button key={c} className="btn sec bloco" onClick={() => setResultado(anonimizarConversas(textos, c))}>Sou eu: {c}</button>
          ))}
        </div>
      )}

      {resultado && (
        <div className="card">
          <h3>4. Confira e compartilhe</h3>
          <p className="pequeno">{resultado.conversas} conversas, {resultado.mensagens} mensagens, sem identificação. Veja o começo:</p>
          <pre style={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 260, overflow: "auto", background: "var(--nevoa)", borderRadius: 10, padding: 10, margin: 0 }}>
            {resultado.texto.split("\n").slice(0, 25).join("\n")}
          </pre>
          <p className="muted pequeno">Se ainda aparecer algum nome no meio do texto, me avise antes de mandar: dá para ajustar.</p>
          <button className="btn bloco" onClick={() => void compartilharArquivo(new Blob([resultado.texto], { type: "text/plain" }), "conversas-anonimas.txt")}>Compartilhar arquivo anônimo</button>
        </div>
      )}
    </>
  );
}
