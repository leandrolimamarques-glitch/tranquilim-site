import { useState } from "react";
import { andar, type Fluxo, type Resposta } from "../lib/fluxo";
import { FLUXOS } from "../conteudo";
import { linkLigar, linkWhatsApp, type Medico } from "../lib/convite";
import type { Dados } from "../lib/store";


const ROTULO_NIVEL = { ps: "Agora", hoje: "Hoje", casa: "Em casa" } as const;

export function VaiAoPS({ dados, fluxoInicial }: { dados: Dados; fluxoInicial?: string | null }) {
  const [fluxo, setFluxo] = useState<Fluxo | null>(() => FLUXOS.find((f) => f.id === fluxoInicial) ?? null);

  if (fluxo) return <Executar fluxo={fluxo} sair={() => setFluxo(null)} medico={dados.medico} nomeCrianca={dados.crianca?.nome ?? ""} />;

  return (
    <>
      <h1 style={{ fontSize: 28 }}>Vai ao PS, liga ou espera?</h1>
      <p className="muted">Escolha o que está acontecendo. Uma pergunta por vez, e no fim o que fazer.</p>
      <a className="btn ps bloco" href="tel:192">Emergência agora: ligar 192</a>
      {FLUXOS.map((f) => (
        <button key={f.id} className="opcao" style={f.id === "engasgo" ? { borderColor: "var(--ps)" } : undefined} onClick={() => setFluxo(f)}>
          {f.titulo}
          <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>{f.resumo}</span>
        </button>
      ))}
    </>
  );
}

function Executar({ fluxo, sair, medico, nomeCrianca }: { fluxo: Fluxo; sair: () => void; medico: Medico | null; nomeCrianca: string }) {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [marcados, setMarcados] = useState<string[]>([]);
  const estado = andar(fluxo, respostas);

  const responder = (r: Resposta) => {
    setRespostas((rs) => [...rs, r]);
    setMarcados([]);
    window.scrollTo(0, 0);
  };
  const voltar = () => {
    if (respostas.length === 0) return sair();
    setRespostas((rs) => rs.slice(0, -1));
    setMarcados([]);
  };

  if (estado.tipo === "desfecho") {
    const d = estado.desfecho;
    return (
      <>
        <button className="voltar" onClick={voltar}>‹ Voltar</button>
        <div className={`desfecho ${d.nivel}`}>
          <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", fontSize: 13 }}>{ROTULO_NIVEL[d.nivel]}</span>
          <h2>{d.titulo}</h2>
        </div>
        {d.nivel === "ps" && <a className="btn ps bloco" href="tel:192">Ligar 192</a>}
        {d.nivel !== "ps" && medico?.whatsapp && (
          <a
            className="btn sec bloco"
            href={linkWhatsApp(medico.whatsapp, `Olá! Sou responsável por ${nomeCrianca}. No Tranquilim (${fluxo.titulo}), o resultado foi: ${d.titulo}. Pode me orientar?`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mandar mensagem para {medico.nome}
          </a>
        )}
        {d.nivel === "hoje" && !medico?.whatsapp && medico && linkLigar(medico.telefone) && (
          <a className="btn sec bloco" href={linkLigar(medico.telefone)!}>Ligar para {medico.nome}</a>
        )}
        <div className="card">
          <h3>O que fazer</h3>
          <ul className="lista">{d.oQueFazer.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        {d.volteSe && (
          <div className="card">
            <h3>Procure atendimento se</h3>
            <ul className="lista">{d.volteSe.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        )}
        <button className="btn sec bloco" onClick={() => { setRespostas([]); setMarcados([]); }}>Responder de novo</button>
        <button className="btn contorno bloco" onClick={sair}>Voltar à lista</button>
        <div className="fontes">
          <b>Fontes</b>
          {fluxo.fontes.map((f) => <span key={f}>{f}</span>)}
          <span>O Tranquilim orienta e não substitui a avaliação médica.</span>
        </div>
      </>
    );
  }

  const p = estado.passo;
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Voltar</button>
      <span className="muted pequeno" style={{ fontWeight: 700 }}>{fluxo.titulo}</span>
      <p className="pergunta">{p.pergunta}</p>
      {p.ajuda && <p className="muted">{p.ajuda}</p>}
      {p.tipo === "escolha" ? (
        p.opcoes.map((o, i) => (
          <button key={o.texto} className="opcao" onClick={() => responder({ passo: p.id, tipo: "escolha", opcao: i })}>{o.texto}</button>
        ))
      ) : (
        <>
          {p.itens.map((item) => {
            const marcado = marcados.includes(item.id);
            return (
              <label key={item.id} className={`sinal ${marcado ? "marcado" : ""}`}>
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => setMarcados((m) => (marcado ? m.filter((x) => x !== item.id) : [...m, item.id]))}
                />
                <span>{item.texto}</span>
              </label>
            );
          })}
          <button className="btn ps bloco" disabled={marcados.length === 0} onClick={() => responder({ passo: p.id, tipo: "sinais", marcados })}>
            Tem pelo menos um destes
          </button>
          <button className="btn sec bloco" disabled={marcados.length > 0} onClick={() => responder({ passo: p.id, tipo: "sinais", marcados: [] })}>
            Nenhum destes
          </button>
        </>
      )}
    </>
  );
}
