import { useEffect, useState } from "react";
import type { Navegar } from "../App";
import { FLUXOS } from "../conteudo";
import { api } from "../lib/api";
import { linkWhatsApp } from "../lib/convite";
import { dataBr } from "../lib/idade";
import type { Dados } from "../lib/store";

type Resp = { tipo: "orientacao" | "fluxo" | "medico" | "emergencia" | "fora"; resposta: string; fluxo: string };
type Hist = Resp & { pergunta: string; criadoEm: string };

const SUGESTOES = ["Quando começo a introdução alimentar?", "Como deixar o berço seguro?", "Quantas fraldas molhadas por dia é normal?", "Com que idade ela deve falar as primeiras palavras?"];

export function Pergunta({ dados, navegar }: { dados: Dados; navegar: Navegar }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [historico, setHistorico] = useState<Hist[]>([]);

  useEffect(() => {
    api.get<{ perguntas: Hist[] }>(`/api/perguntas?crianca=${dados.criancaId}`).then((r) => setHistorico(r.perguntas)).catch(() => undefined);
  }, [dados.criancaId]);

  const enviar = async (q = texto) => {
    if (q.trim().length < 3) return;
    setEnviando(true);
    setErro("");
    try {
      const r = await api.post<Resp>(`/api/pergunta?crianca=${dados.criancaId}`, { pergunta: q.trim() });
      setHistorico((h) => [{ ...r, pergunta: q.trim(), criadoEm: new Date().toISOString() }, ...h]);
      setTexto("");
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };


  return (
    <>
      <button className="voltar" onClick={() => navegar("inicio")}>‹ Início</button>
      <h1 style={{ fontSize: 28 }}>Pergunte ao Tranquilim</h1>
      <p className="muted">Respostas com base nas orientações do app e das sociedades de pediatria. Remédio, dose e diagnóstico ficam com o seu pediatra. Em emergência, ligue 192.</p>
      <div className="card">
        <textarea className="area-texto" rows={3} maxLength={500} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={`Sua dúvida sobre ${dados.crianca?.nome ?? "a criança"}`} />
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" disabled={enviando || texto.trim().length < 3} onClick={() => void enviar()}>{enviando ? "Pensando…" : "Perguntar"}</button>
      </div>
      {historico.length === 0 && (
        <div className="card">
          <h3>Por exemplo</h3>
          {SUGESTOES.map((s) => <button key={s} className="item-lista" style={{ borderTop: "1px solid var(--line)" }} onClick={() => void enviar(s)}>{s}</button>)}
        </div>
      )}
      {historico.map((h, i) => <Bolha key={i} h={h} dados={dados} navegar={navegar} />)}
    </>
  );
}

function Bolha({ h, dados, navegar }: { h: Hist; dados: Dados; navegar: Navegar }) {
  const fluxo = FLUXOS.find((f) => f.id === h.fluxo);
  const cor = h.tipo === "emergencia" ? "var(--ps)" : h.tipo === "medico" ? "var(--hoje)" : "var(--line)";
  return (
    <div className="card" style={{ borderColor: cor, borderWidth: h.tipo === "emergencia" ? 2 : 1 }}>
      <p className="muted pequeno">{dataBr(h.criadoEm.slice(0, 10))} · você perguntou</p>
      <p style={{ fontWeight: 700 }}>{h.pergunta}</p>
      <p>{h.resposta}</p>
      {h.tipo === "emergencia" && <a className="btn ps bloco" href="tel:192">Ligar 192</a>}
      {fluxo && <button className="btn bloco" onClick={() => navegar("ps", { fluxo: fluxo.id })}>Abrir: {fluxo.titulo}</button>}
      {h.tipo === "medico" && dados.medico?.whatsapp && (
        <a className="btn sec bloco" href={linkWhatsApp(dados.medico.whatsapp, `Olá! Sou responsável por ${dados.crianca?.nome ?? ""}. Tenho uma dúvida: ${h.pergunta}`)} target="_blank" rel="noopener noreferrer">Perguntar a {dados.medico.nome}</a>
      )}
    </div>
  );
}
