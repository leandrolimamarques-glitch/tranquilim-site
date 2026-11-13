import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { hojeIso, idadeEmMesesDecimal } from "../lib/idade";
import { avisoDaIdade, cuidadosEmCasa, sinaisDePerigo, temaDoFluxo } from "../lib/respostas";
import { andar, type Fluxo, type Resposta } from "../lib/fluxo";
import { FLUXOS } from "../conteudo";
import { linkLigar, linkWhatsApp, type Medico } from "../lib/convite";
import type { Dados } from "../lib/store";


const ROTULO_NIVEL = { ps: "Agora", hoje: "Hoje", casa: "Em casa" } as const;

/** "do Dr. Fulano", "da Dra. Fulana", "de Fulano". */
const deNome = (nome: string) => (/^dra\b/i.test(nome) ? `da ${nome}` : /^dr\b/i.test(nome) ? `do ${nome}` : `de ${nome}`);

type Respostas = { pediatra: { nome: string; whatsapp: string | null } | null; respostas: Record<string, string> };

/** Respostas rápidas publicadas pelo pediatra da criança (com cópia no aparelho para abrir sem internet). */
function useRespostas(criancaId: string): Respostas {
  const chave = `tq:resp:${criancaId}`;
  const [r, setR] = useState<Respostas>(() => {
    try {
      return JSON.parse(localStorage.getItem(chave) ?? "null") ?? { pediatra: null, respostas: {} };
    } catch {
      return { pediatra: null, respostas: {} };
    }
  });
  useEffect(() => {
    if (!criancaId) return;
    api.get<Respostas>(`/api/criancas/${criancaId}/respostas`).then((x) => {
      setR(x);
      try {
        localStorage.setItem(chave, JSON.stringify(x));
      } catch {
        // sem armazenamento
      }
    }).catch(() => undefined);
  }, [criancaId, chave]);
  return r;
}

type Tela = { qual: "lista" } | { qual: "rapida"; fluxo: Fluxo } | { qual: "perguntas"; fluxo: Fluxo };

export function VaiAoPS({ dados, fluxoInicial }: { dados: Dados; fluxoInicial?: string | null }) {
  const abrir = (f: Fluxo): Tela => (temaDoFluxo(f.id) ? { qual: "rapida", fluxo: f } : { qual: "perguntas", fluxo: f });
  const [tela, setTela] = useState<Tela>(() => {
    const f = FLUXOS.find((x) => x.id === fluxoInicial);
    return f ? abrir(f) : { qual: "lista" };
  });
  const resp = useRespostas(dados.criancaId);
  const ir = (t: Tela) => {
    setTela(t);
    window.scrollTo(0, 0);
  };

  if (tela.qual === "perguntas") return <Executar fluxo={tela.fluxo} sair={() => ir({ qual: "lista" })} medico={dados.medico} nomeCrianca={dados.crianca?.nome ?? ""} />;
  if (tela.qual === "rapida") return <RespostaRapida fluxo={tela.fluxo} dados={dados} resp={resp} voltar={() => ir({ qual: "lista" })} perguntas={() => ir({ qual: "perguntas", fluxo: tela.fluxo })} />;

  return (
    <>
      <h1 style={{ fontSize: 28 }}>Vai ao PS, liga ou espera?</h1>
      <p className="muted">Toque no que está acontecendo. Primeiro vêm os sinais de perigo e o que fazer em casa{resp.pediatra ? `, com a orientação ${deNome(resp.pediatra.nome)}` : ""}. Se ficar em dúvida, responda as perguntas.</p>
      <a className="btn ps bloco" href="tel:192">Emergência agora: ligar 192</a>
      {FLUXOS.map((f) => (
        <button key={f.id} className="opcao" style={f.id === "engasgo" ? { borderColor: "var(--ps)" } : undefined} onClick={() => ir(abrir(f))}>
          {f.titulo}
          <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>{f.resumo}</span>
        </button>
      ))}
    </>
  );
}

function RespostaRapida({ fluxo, dados, resp, voltar, perguntas }: { fluxo: Fluxo; dados: Dados; resp: Respostas; voltar: () => void; perguntas: () => void }) {
  const tema = temaDoFluxo(fluxo.id)!;
  const meses = dados.crianca ? idadeEmMesesDecimal(dados.crianca.nascimento, hojeIso()) : null;
  const idade = avisoDaIdade(fluxo, meses);
  const casa = cuidadosEmCasa(fluxo);
  const doPediatra = resp.pediatra ? resp.respostas[tema.id] : undefined;
  const medico = dados.medico;
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Vai ao PS?</button>
      <h1 style={{ fontSize: 28 }}>{tema.titulo}</h1>
      {idade && (
        <div className="desfecho ps">
          <h2>{idade.titulo}</h2>
          <ul className="lista">{idade.oQueFazer.map((x) => <li key={x}>{x}</li>)}</ul>
          <a className="btn ps bloco" href="tel:192">Ligar 192</a>
        </div>
      )}
      <div className="card" style={{ borderColor: "var(--ps)", borderWidth: 2 }}>
        <h3 style={{ color: "var(--ps)" }}>Ligue 192 ou vá ao pronto-socorro agora se:</h3>
        <ul className="lista">{sinaisDePerigo(fluxo).map((x) => <li key={x}>{x}</li>)}</ul>
        <a className="btn ps bloco" href="tel:192">Tem algum desses: ligar 192</a>
      </div>
      {!idade && (
        <div className="card">
          {doPediatra ? (
            <>
              <h3>Orientação {deNome(resp.pediatra!.nome)}</h3>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{doPediatra}</p>
            </>
          ) : casa ? (
            <>
              <h3>Sem nenhum desses sinais, em casa:</h3>
              <ul className="lista">{casa.oQueFazer.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          ) : null}
        </div>
      )}
      {!idade && casa?.volteSe && (
        <div className="card">
          <h3>Procure atendimento hoje se:</h3>
          <ul className="lista">{casa.volteSe.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      <button className="btn sec bloco" onClick={perguntas}>Não sei se é grave: responder as perguntas</button>
      {medico?.whatsapp && (
        <a className="btn contorno bloco" href={linkWhatsApp(medico.whatsapp, `Olá! Sou responsável por ${dados.crianca?.nome ?? ""}. Vi no Tranquilim a orientação sobre ${tema.titulo.toLowerCase()} e queria falar com você.`)} target="_blank" rel="noopener noreferrer">Falar com {medico.nome}</a>
      )}
      <p className="fontes">{fluxo.fontes.join(" ")}</p>
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
