import { useMemo, useState } from "react";
import { linkWhatsApp } from "../../lib/convite";
import { nomeDoMes, paraCentavos, reais } from "../../lib/dinheiro";
import { aReceber, csvDoMes, lerFinanceiro, mesDe, resumoMes, ROTULO_TIPO, somarMesesAoMes, type Despesa, type ItemReceber, type Lancamento } from "../../lib/financeiro";
import { dataBr, hojeIso } from "../../lib/idade";
import { gravar, remover } from "../../lib/sinc";
import { novoId } from "../../lib/store";
import { FormLancamento } from "./Agenda";
import type { useDocRemoto } from "../../lib/useDocRemoto";

type DocRemoto = ReturnType<typeof useDocRemoto>;
type Aba = "resumo" | "receber" | "despesas" | "contador";

const CATEGORIAS = ["Aluguel", "Secretária", "Condomínio e contas", "Material", "Cursos e congressos", "Conselho e associações", "Contador", "Outros"];

export function FinanceiroTela({ financeiro }: { financeiro: DocRemoto }) {
  const hoje = hojeIso();
  const [mes, setMes] = useState(mesDe(hoje));
  const [aba, setAba] = useState<Aba>("resumo");
  const [editando, setEditando] = useState<Lancamento | null>(null);
  const fin = useMemo(() => lerFinanceiro(financeiro.doc), [financeiro.doc]);
  const r = useMemo(() => resumoMes(fin, mes, hoje), [fin, mes, hoje]);

  if (editando) return <FormLancamento fin={fin.fontes} inicial={editando} dia={editando.data} financeiro={financeiro} fechar={() => setEditando(null)} />;

  return (
    <>
      <h1 style={{ fontSize: 26 }}>Financeiro</h1>
      <div className="segmento">
        {(["resumo", "receber", "despesas", "contador"] as Aba[]).map((a) => (
          <button key={a} className={aba === a ? "ativa" : ""} onClick={() => setAba(a)} style={{ fontSize: 13 }}>
            {{ resumo: "Mês", receber: "A receber", despesas: "Despesas", contador: "Contador" }[a]}
          </button>
        ))}
      </div>
      {aba !== "receber" && (
        <div className="linha">
          <button className="icone-btn" aria-label="Mês anterior" onClick={() => setMes(somarMesesAoMes(mes, -1))}>‹</button>
          <b>{nomeDoMes(mes)}</b>
          <button className="icone-btn" aria-label="Próximo mês" onClick={() => setMes(somarMesesAoMes(mes, 1))}>›</button>
        </div>
      )}
      {financeiro.estado === "sem-conexao" && <p className="alerta">Sem conexão. Os lançamentos ficam neste aparelho e sobem quando a internet voltar.</p>}

      {aba === "resumo" && (
        <>
          <div className="card noite">
            <span className="muted pequeno" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Líquido estimado</span>
            <h2 style={{ fontSize: 30 }}>{reais(r.liquido)}</h2>
            <p className="muted">Produzido {reais(r.bruto)} − glosa {reais(r.glosaEstimada)} − impostos {reais(r.impostos.total)} − despesas {reais(r.despesas)}</p>
          </div>
          <div className="grade2">
            <div className="contador"><b style={{ fontSize: 19 }}>{reais(r.consultorio)}</b><span>consultório · {r.consultas} consultas</span></div>
            <div className="contador"><b style={{ fontSize: 19 }}>{reais(r.plantao)}</b><span>plantão · {r.plantoes} ({r.horasPlantao}h)</span></div>
          </div>
          <div className="card">
            <h3>Por convênio e local</h3>
            {r.porFonte.length === 0 && <p className="muted">Nada lançado neste mês.</p>}
            {r.porFonte.map((lf) => (
              <div key={lf.fonte.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
                <span style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
                  <i aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 5, background: lf.fonte.cor, flex: "0 0 auto" }} />
                  <span>{lf.fonte.nome}<span className="muted pequeno" style={{ display: "block" }}>{lf.quantidade}× {lf.porHora ? `· ${reais(lf.porHora)}/h` : ""}</span></span>
                </span>
                <b>{reais(lf.bruto)}</b>
              </div>
            ))}
          </div>
          <div className="card">
            <h3>Impostos estimados</h3>
            <div className="linha"><span className="muted">Empresa (PJ)</span><b>{reais(r.impostos.pj)}</b></div>
            <div className="linha"><span className="muted">Pessoa física (INSS + IR)</span><b>{reais(r.impostos.pf)}</b></div>
            {r.impostos.detalhe.map((d) => <p key={d} className="muted pequeno">{d}</p>)}
            {!financeiro.doc.config && <p className="pequeno" style={{ fontWeight: 700 }}>Configure seu regime em Ajustes → Impostos e contador. Sem pró-labore informado, o Simples cai no Anexo V.</p>}
            <p className="muted pequeno">Estimativa para planejar o mês, pelo regime escolhido em Ajustes. A apuração oficial é do contador.</p>
          </div>
          <div className="card">
            <div className="linha"><span className="muted">Recebido neste mês</span><b>{reais(r.recebidoNoMes)}</b></div>
          </div>
        </>
      )}

      {aba === "receber" && <AReceber itens={aReceber(fin, hoje)} financeiro={financeiro} editar={setEditando} />}
      {aba === "despesas" && <Despesas despesas={fin.despesas.filter((d) => mesDe(d.data) === mes)} mes={mes} financeiro={financeiro} />}
      {aba === "contador" && <Contador fin={fin} mes={mes} hoje={hoje} />}
    </>
  );
}

function AReceber({ itens, financeiro, editar }: { itens: ReturnType<typeof aReceber>; financeiro: DocRemoto; editar: (l: Lancamento) => void }) {
  const hoje = hojeIso();
  const receber = (i: ItemReceber) => financeiro.mudar((d) => gravar(d, "lancamentos", { ...i.lancamento, recebidoEm: hoje, valorRecebido: i.valor }));
  const totalAtraso = itens.atrasados.reduce((s, i) => s + i.valor, 0);
  const Linha = ({ i }: { i: ItemReceber }) => (
    <div className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
      <button className="item-lista" style={{ minHeight: 44, padding: 0 }} onClick={() => editar(i.lancamento)}>
        <span>
          {i.fonte?.nome ?? "?"} <span className="muted pequeno">· {ROTULO_TIPO[i.lancamento.tipo]}{(i.lancamento.quantidade || 1) > 1 ? ` ×${i.lancamento.quantidade}` : ""}</span>
          <span className="muted pequeno" style={{ display: "block" }}>trabalhado {dataBr(i.lancamento.data).slice(0, 5)} · previsto {dataBr(i.previsto)}</span>
        </span>
      </button>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <b className="pequeno">{reais(i.valor)}</b>
        <button className="btn sec" style={{ minHeight: 40, padding: "6px 10px", fontSize: 13 }} onClick={() => receber(i)}>Recebi</button>
      </span>
    </div>
  );
  return (
    <>
      {itens.atrasados.length > 0 && (
        <div className="card" style={{ borderColor: "var(--ps)" }}>
          <div className="linha"><h3>Atrasados</h3><b style={{ color: "var(--ps)" }}>{reais(totalAtraso)}</b></div>
          <p className="muted pequeno">Passou da data prevista e não foi marcado como recebido. Confira o extrato ou cobre o convênio.</p>
          {itens.atrasados.map((i) => <Linha key={i.lancamento.id} i={i} />)}
        </div>
      )}
      {itens.porMes.map((m) => (
        <div key={m.mes} className="card">
          <div className="linha"><h3>{nomeDoMes(m.mes)}</h3><b>{reais(m.total)}</b></div>
          {m.itens.map((i) => <Linha key={i.lancamento.id} i={i} />)}
        </div>
      ))}
      {itens.atrasados.length === 0 && itens.porMes.length === 0 && <p className="muted">Nada a receber nos próximos 3 meses.</p>}
      <p className="muted pequeno">Valores já descontada a glosa média de cada convênio. "Recebi" marca hoje com o valor esperado; toque no item para ajustar data e valor.</p>
    </>
  );
}

function Despesas({ despesas, mes, financeiro }: { despesas: Despesa[]; mes: string; financeiro: DocRemoto }) {
  const hoje = hojeIso();
  const [data, setData] = useState(mesDe(hoje) === mes ? hoje : `${mes}-01`);
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [valor, setValor] = useState("");
  const [dedutivel, setDedutivel] = useState(true);
  const v = paraCentavos(valor);
  const total = despesas.reduce((s, d) => s + d.valor, 0);
  const salvar = () => {
    if (v === null) return;
    financeiro.mudar((d) => gravar(d, "despesas", { id: novoId(), data, descricao: descricao.trim() || categoria, categoria, valor: v, dedutivel }));
    setDescricao("");
    setValor("");
  };
  return (
    <>
      <div className="card">
        <h3>Nova despesa</h3>
        <div className="grade2">
          <label className="campo">Data<input type="date" value={data} onChange={(e) => setData(e.target.value)} /></label>
          <label className="campo">Valor (R$)<input inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" /></label>
        </div>
        <label className="campo">Categoria
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>{CATEGORIAS.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="campo">Descrição (opcional)<input value={descricao} onChange={(e) => setDescricao(e.target.value)} /></label>
        <label className="sinal" style={{ borderWidth: 1 }}>
          <input type="checkbox" checked={dedutivel} onChange={(e) => setDedutivel(e.target.checked)} />
          <span>Dedutível no livro-caixa (despesa necessária ao consultório, com comprovante)</span>
        </label>
        <button className="btn bloco" disabled={v === null || v === 0} onClick={salvar}>Salvar despesa</button>
      </div>
      <div className="card">
        <div className="linha"><h3>Despesas do mês</h3><b>{reais(total)}</b></div>
        {despesas.length === 0 && <p className="muted">Nenhuma despesa neste mês.</p>}
        {despesas.map((d) => (
          <div key={d.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
            <span>{d.descricao}<span className="muted pequeno" style={{ display: "block" }}>{dataBr(d.data)} · {d.categoria}{d.dedutivel ? " · dedutível" : ""}</span></span>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <b className="pequeno">{reais(d.valor)}</b>
              <button className="icone-btn" aria-label={`Apagar ${d.descricao}`} onClick={() => financeiro.mudar((doc) => remover(doc, "despesas", d.id))}>✕</button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Contador({ fin, mes, hoje }: { fin: ReturnType<typeof lerFinanceiro>; mes: string; hoje: string }) {
  const r = resumoMes(fin, mes, hoje);
  const c = fin.config.contador;
  const nomeArquivo = `tranquilim-financeiro-${mes}.csv`;
  const resumoTexto = [
    `*Financeiro ${nomeDoMes(mes)}*`,
    `Produzido (bruto): ${reais(r.bruto)}`,
    `  Consultório: ${reais(r.consultorio)} (${r.consultas} consultas)`,
    `  Plantão: ${reais(r.plantao)} (${r.plantoes} plantões, ${r.horasPlantao}h)`,
    `Glosa estimada: ${reais(r.glosaEstimada)}`,
    `Recebido no mês: ${reais(r.recebidoNoMes)}`,
    `Despesas: ${reais(r.despesas)}`,
    `Impostos estimados: ${reais(r.impostos.total)}`,
    ...r.porFonte.map((lf) => `- ${lf.fonte.nome}: ${reais(lf.bruto)} (${lf.quantidade}×)`),
    `Planilha detalhada em anexo (${nomeArquivo}).`,
  ].join("\n");

  const arquivo = () => new File([csvDoMes(fin, mes, hoje)], nomeArquivo, { type: "text/csv" });
  const baixar = () => {
    const url = URL.createObjectURL(arquivo());
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const podeCompartilhar = typeof navigator !== "undefined" && "canShare" in navigator && navigator.canShare?.({ files: [arquivo()] });
  const compartilhar = () => void navigator.share({ files: [arquivo()], title: nomeArquivo, text: resumoTexto }).catch(() => undefined);

  return (
    <>
      <div className="card">
        <h3>Relatório do mês</h3>
        <p className="muted">Planilha com cada consulta e plantão (data, convênio, valor, previsão e recebimento), as despesas e o resumo. Abre direto no Excel.</p>
        {podeCompartilhar && <button className="btn bloco" onClick={compartilhar}>Enviar planilha (WhatsApp, e-mail…)</button>}
        <button className={`btn ${podeCompartilhar ? "sec" : ""} bloco`} onClick={baixar}>Baixar planilha</button>
        {c.whatsapp && <a className="btn sec bloco" href={linkWhatsApp(c.whatsapp, resumoTexto)} target="_blank" rel="noopener noreferrer">Mandar resumo para {c.nome || "o contador"}</a>}
        {c.email && <a className="btn sec bloco" href={`mailto:${c.email}?subject=${encodeURIComponent(`Financeiro ${nomeDoMes(mes)}`)}&body=${encodeURIComponent(resumoTexto.replace(/\*/g, ""))}`}>E-mail para {c.nome || "o contador"}</a>}
        {!c.whatsapp && !c.email && <p className="muted pequeno">Cadastre o contato do contador em Ajustes para mandar com um toque.</p>}
      </div>
      <div className="card">
        <h3>Prévia</h3>
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 14, margin: 0 }}>{resumoTexto.replace(/\*/g, "")}</pre>
      </div>
      <p className="muted pequeno">Tudo aqui é estimativa a partir do que você lançou. Não substitui a apuração do contador.</p>
    </>
  );
}
