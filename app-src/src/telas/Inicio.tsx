import type { Navegar } from "../App";
import { dataBr, hojeIso, idadeEmMesesDecimal, idadeTexto, idadeParaAvaliacao } from "../lib/idade";
import { descreverPercentil, IDADE_MAXIMA_CURVA_MESES, percentil } from "../lib/oms";
import type { Atualizar, Dados, TipoRegistro } from "../lib/store";
import { novoId } from "../lib/store";
import { situacaoDasVacinas } from "../lib/vacinas";
import { trilhasDaIdade } from "../conteudo";
import { contarHoje, ROTULOS_REGISTRO } from "./Caderneta";
import { linhaRegistro, linkLigar, linkWhatsApp } from "../lib/convite";
import { alertasDaCrianca } from "../lib/alertas";

export function Inicio({ dados, atualizar, navegar }: { dados: Dados; atualizar: Atualizar; navegar: Navegar }) {
  const c = dados.crianca!;
  const hoje = hojeIso();
  const meses = idadeEmMesesDecimal(c.nascimento, hoje);
  const vacinas = situacaoDasVacinas(c.nascimento, hoje, new Set(dados.vacinasAplicadas));
  const pendentes = vacinas.filter((v) => v.situacao === "pendente");
  const proximas = vacinas.filter((v) => v.situacao === "proxima");
  const trilha = trilhasDaIdade(meses).find((t) => t.aulas.some((a) => !dados.aulasVistas.includes(a.id))) ?? trilhasDaIdade(meses)[0];
  const vistas = trilha ? trilha.aulas.filter((a) => dados.aulasVistas.includes(a.id)).length : 0;
  const ultimaComPeso = [...dados.medidas].filter((m) => m.pesoKg).sort((a, b) => b.data.localeCompare(a.data))[0];
  const mesesMedida = ultimaComPeso ? idadeParaAvaliacao(c.nascimento, ultimaComPeso.data, c.semanasGestacao) : -1;
  const pPeso = ultimaComPeso && mesesMedida >= 0 && mesesMedida <= IDADE_MAXIMA_CURVA_MESES ? percentil(c.sexo, "peso", mesesMedida, ultimaComPeso.pesoKg!) : null;
  const contagem = contarHoje(dados.diario, hoje);

  const avisos = alertasDaCrianca(dados, hoje).filter((a) => a.nivel === "atencao" && a.id !== "vacinas");
  const registrar = (tipo: TipoRegistro) =>
    atualizar((d) => ({ ...d, diario: [{ id: novoId(), tipo, quando: new Date().toISOString() }, ...d.diario] }));

  return (
    <>


      <div className="card">
        <div className="linha"><h2>{c.nome}</h2><span className="chip">{idadeTexto(c.nascimento, hoje)}</span></div>
        <p className="muted">Nasceu em {dataBr(c.nascimento)}</p>
      </div>

      {dados.medico && (
        <div className="card">
          <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Quem acompanha {c.nome}</span>
          <h3>{dados.medico.nome}</h3>
          <p className="muted">{linhaRegistro(dados.medico)}</p>
          {dados.medico.local && <p className="muted pequeno">{dados.medico.local}</p>}
          {(dados.medico.whatsapp || linkLigar(dados.medico.telefone)) && (
            <div className={dados.medico.whatsapp && linkLigar(dados.medico.telefone) ? "grade2" : ""}>
              {dados.medico.whatsapp && (
                <a className="btn sec bloco" href={linkWhatsApp(dados.medico.whatsapp, `Olá! Sou responsável por ${c.nome}.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              )}
              {linkLigar(dados.medico.telefone) && <a className="btn sec bloco" href={linkLigar(dados.medico.telefone)!}>Ligar</a>}
            </div>
          )}
        </div>
      )}

      {(
        <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => navegar("pergunta")}>
          <h3>Pergunte ao Tranquilim</h3>
          <p className="muted">Dúvida de amamentação, sono, comida, desenvolvimento? Escreva aqui.</p>
        </button>
      )}

      <button className="card" style={{ textAlign: "left", cursor: "pointer", borderWidth: 2, borderColor: "var(--noite)" }} onClick={() => navegar("ps")}>
        <div className="linha">
          <h2>Vai ao PS, liga ou espera?</h2>
          <span aria-hidden="true" style={{ display: "flex", gap: 4 }}>
            <i style={{ width: 10, height: 10, borderRadius: 5, background: "var(--casa)" }} />
            <i style={{ width: 10, height: 10, borderRadius: 5, background: "var(--hoje)" }} />
            <i style={{ width: 10, height: 10, borderRadius: 5, background: "var(--ps)" }} />
          </span>
        </div>
        <p className="muted">Uma pergunta por vez. No fim, o que fazer: cuidar em casa, procurar atendimento hoje ou ir agora.</p>
      </button>

      <button className="card noite" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => navegar("caderneta", { secao: "vacinas" })}>
        <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Vacinas</span>
        {pendentes.length > 0 ? (
          <>
            <h3>{pendentes.length === 1 ? "1 vacina para conferir" : `${pendentes.length} vacinas para conferir`}</h3>
            <p className="muted">A idade já chegou e ainda não foram marcadas como aplicadas. Confira com a caderneta física.</p>
          </>
        ) : proximas.length > 0 ? (
          <>
            <h3>Próximas em {dataBr(proximas[0].dataPrevista)}</h3>
            <p className="muted">{proximas.map((v) => v.nome).join(" · ")}</p>
          </>
        ) : (
          <h3>Tudo em dia pelo calendário</h3>
        )}
      </button>

      {trilha && (
        <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => navegar("trilhas")}>
          <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Trilha desta fase</span>
          <h3>{trilha.titulo}</h3>
          <p className="muted">{vistas} de {trilha.aulas.length} aulas vistas</p>
        </button>
      )}

      <div className="card">
        <div className="linha"><h3>Diário de hoje</h3><button className="btn contorno" style={{ minHeight: 36, padding: "4px 12px" }} onClick={() => navegar("caderneta", { secao: "diario" })}>Ver tudo</button></div>
        <div className="grade4">
          {(Object.keys(ROTULOS_REGISTRO) as TipoRegistro[]).map((t) => (
            <button key={t} className="contador" style={{ border: 0, cursor: "pointer" }} onClick={() => registrar(t)} aria-label={`Registrar ${ROTULOS_REGISTRO[t]}`}>
              <b>{contagem[t]}</b>
              <span>{ROTULOS_REGISTRO[t]} +</span>
            </button>
          ))}
        </div>
        <p className="muted pequeno">Toque para registrar agora.</p>
      </div>

      {avisos.length > 0 && (
        <button className="card" style={{ textAlign: "left", cursor: "pointer", borderColor: "var(--hoje)", borderWidth: 2 }} onClick={() => navegar("caderneta", { secao: avisos[0].id.startsWith("marcos") ? "marcos" : "crescimento" })}>
          <h3>Vale conversar com {dados.medico ? dados.medico.nome : "o pediatra"}</h3>
          {avisos.map((a) => <p key={a.id} className="muted">{a.texto}.</p>)}
          <p className="muted pequeno">{dados.vinculo ? "O consultório também vê este aviso." : "Mostre na próxima consulta."} Não quer dizer doença, mas merece um olhar.</p>
        </button>
      )}
      <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => navegar("caderneta", { secao: "crescimento" })}>
        <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Crescimento</span>
        {ultimaComPeso ? (
          <>
            <h3>{ultimaComPeso.pesoKg!.toLocaleString("pt-BR")} kg em {dataBr(ultimaComPeso.data)}</h3>
            {pPeso !== null && <p className="muted">Peso {descreverPercentil(pPeso)} para a idade (curva da OMS).</p>}
          </>
        ) : (
          <h3>Registrar o primeiro peso</h3>
        )}
      </button>
      <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => navegar("sobre")}>
        <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Quem somos</span>
        <p className="muted">Feito por dois médicos. Conheça a história do Tranquilim.</p>
      </button>
    </>
  );
}
