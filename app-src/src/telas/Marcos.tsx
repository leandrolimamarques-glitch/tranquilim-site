import { ehPrematuro, hojeIso, idadeEmMesesDecimal, idadeParaAvaliacao } from "../lib/idade";
import type { Atualizar, Dados } from "../lib/store";
import {
  FONTE_MARCOS, FONTE_MCHAT, FONTE_REGRESSAO, ID_REGRESSAO, marcosParaMostrar, naJanelaMchat, rotuloFaixa, situacaoMarco,
  type Faixa, type Marco,
} from "../lib/marcos";

type Quem = "familia" | "medico";

export function Marcos({ dados, atualizar, quem }: { dados: Dados; atualizar: Atualizar; quem: Quem }) {
  const c = dados.crianca!;
  const hoje = hojeIso();
  const meses = Math.max(0, idadeParaAvaliacao(c.nascimento, hoje, c.semanasGestacao));
  const corrigida = ehPrematuro(c.semanasGestacao) && idadeEmMesesDecimal(c.nascimento, hoje) < 36;
  const { atual, anterior, marcos } = marcosParaMostrar(meses);
  const primeiro = c.nome.split(" ")[0];
  const marcar = (id: string, faz: boolean | null) =>
    atualizar((d) => {
      const { [id]: _fora, ...resto } = d.marcos ?? {};
      return { ...d, marcos: faz === null ? resto : { ...resto, [id]: { faz, data: hoje } } };
    });
  const perdeu = dados.marcos?.[ID_REGRESSAO]?.faz === true;
  const grupo = (f: Faixa, titulo: string) => (
    <div className="card" key={f.de}>
      <h3>{titulo}</h3>
      <p className="muted pequeno" style={{ margin: 0 }}>{rotuloFaixa(f)}</p>
      {marcos.filter((m) => m.faixa.de === f.de).map((m) => (
        <LinhaMarco key={m.id} m={m} meses={meses} dados={dados} quem={quem} marcar={marcar} />
      ))}
    </div>
  );

  return (
    <>
      <p className="muted">
        {quem === "familia"
          ? `Marque o que ${primeiro} já faz. Não é prova: cada criança tem seu ritmo dentro da faixa de idade. Se ainda não faz algo da idade, brinque estimulando; se a idade passar, converse com o pediatra.`
          : "Relato da família e o que o consultório marcar. Classificação conforme o Instrumento de Vigilância do Desenvolvimento da Caderneta da Criança."}
      </p>
      {corrigida && (
        <p className="pequeno"><b>Usando a idade corrigida</b> ({Math.floor(meses)} {Math.floor(meses) === 1 ? "mês" : "meses"}), porque {primeiro} nasceu com {c.semanasGestacao} semanas.</p>
      )}
      {grupo(atual, meses >= 72 ? "Última faixa da caderneta" : "Idade atual")}
      {anterior && grupo(anterior, "Faixa anterior (a caderneta pede para conferir)")}

      <div className="card" style={perdeu ? { borderColor: "var(--hoje)", borderWidth: 2 } : undefined}>
        <h3>Deixou de fazer algo que já fazia?</h3>
        <p className="muted">Por exemplo: parou de falar palavras que falava, de olhar quando é chamado, de andar ou de brincar como antes.</p>
        {perdeu ? (
          <>
            <p><b>Converse com o pediatra em breve.</b> Perder uma habilidade, em qualquer idade, merece avaliação.</p>
            <button className="btn contorno bloco" onClick={() => marcar(ID_REGRESSAO, null)}>Desmarcar</button>
          </>
        ) : (
          <button className="btn sec bloco" onClick={() => marcar(ID_REGRESSAO, true)}>Sim, deixou de fazer</button>
        )}
      </div>

      {naJanelaMchat(meses) && (
        <div className="card">
          <h3>Triagem de autismo</h3>
          <p className="muted">
            Entre 16 e 30 meses existe um questionário curto para os pais, o M-CHAT-R/F, que a Sociedade Brasileira de Pediatria recomenda nas consultas de 18 e 24 meses, para todas as crianças. Peça ao pediatra.
          </p>
        </div>
      )}

      <p className="muted pequeno">
        {ehPrematuro(c.semanasGestacao) ? "Para prematuros, os marcos usam a idade corrigida até 3 anos (SBP, Manual de Seguimento do RN de Alto Risco, 2024)." : "Nasceu prematuro? Informe as semanas de gestação no cadastro da criança, em Ajustes: os marcos passam a usar a idade corrigida."} Fontes: {FONTE_MARCOS} {FONTE_REGRESSAO}{naJanelaMchat(meses) ? ` ${FONTE_MCHAT}` : ""}
      </p>
    </>
  );
}

function LinhaMarco({ m, meses, dados, quem, marcar }: { m: Marco; meses: number; dados: Dados; quem: Quem; marcar: (id: string, faz: boolean | null) => void }) {
  const r = dados.marcos?.[m.id];
  const s = situacaoMarco(m, meses, r);
  const escolher = (faz: boolean) => marcar(m.id, r && r.faz === faz ? null : faz);
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
      <span>
        <b style={{ fontWeight: 600 }}>{quem === "medico" ? m.nome : m.texto}</b>
        {quem === "medico" && <span className="muted pequeno" style={{ display: "block" }}>{m.texto}</span>}
      </span>
      <div className="grade2">
        <button className={`btn ${r?.faz === true ? "" : "contorno"}`} style={{ minHeight: 44 }} aria-pressed={r?.faz === true} onClick={() => escolher(true)}>Já faz</button>
        <button className={`btn ${r?.faz === false ? "sec" : "contorno"}`} style={{ minHeight: 44 }} aria-pressed={r?.faz === false} onClick={() => escolher(false)}>Ainda não</button>
      </div>
      {s === "ainda-na-idade" && <p className="pequeno muted" style={{ margin: 0 }}>Ainda está dentro da idade. Brinque estimulando (veja Aprender → Dicas → Brincar e estimular).</p>}
      {s === "conversar" && <p className="pequeno" style={{ margin: 0, color: "var(--hoje)", fontWeight: 600 }}>Converse com o pediatra sobre este marco.</p>}
    </div>
  );
}
