import { useMemo, useState } from "react";
import { DICAS } from "../conteudo";
import { ROTULO_CATEGORIA, type CategoriaDica, type Dica } from "../conteudo/dicas/tipos";
import { hojeIso, idadeEmMesesDecimal } from "../lib/idade";
import { FotoConteudo, FotoMini } from "./FotoConteudo";
import type { Dados } from "../lib/store";

function faixa(d: Dica): string {
  const f = (m: number) => (m < 24 ? `${m} meses` : `${Math.floor(m / 12)} anos`);
  if (d.deMeses <= 0 && d.ateMeses >= 72) return "todas as idades";
  return `${d.deMeses <= 0 ? "do nascimento" : `de ${f(d.deMeses)}`} a ${f(d.ateMeses)}`;
}

export function Dicas({ dados }: { dados: Dados }) {
  const meses = dados.crianca ? idadeEmMesesDecimal(dados.crianca.nascimento, hojeIso()) : null;
  const [categoria, setCategoria] = useState<CategoriaDica | "todas">("todas");
  const [daIdade, setDaIdade] = useState(meses !== null);
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState<Dica | null>(null);
  const categorias = useMemo(() => [...new Set(DICAS.map((d) => d.categoria))], []);

  if (aberta) return <DicaAberta d={aberta} voltar={() => { setAberta(null); window.scrollTo(0, 0); }} />;

  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const lista = DICAS.filter(
    (d) =>
      (categoria === "todas" || d.categoria === categoria) &&
      (!daIdade || meses === null || (meses >= d.deMeses - 0.5 && meses <= d.ateMeses + 0.5)) &&
      (!termo || `${d.titulo} ${d.resumo} ${(d.ingredientes ?? []).join(" ")}`.toLocaleLowerCase("pt-BR").includes(termo)),
  );

  return (
    <>
      <label className="campo">Procurar<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="ex.: abóbora, cólica, manchinha, tela" /></label>
      <div className="chips-rolagem">
        <button className={`chip-filtro ${categoria === "todas" ? "ativa" : ""}`} onClick={() => setCategoria("todas")}>Tudo</button>
        {categorias.map((c) => <button key={c} className={`chip-filtro ${categoria === c ? "ativa" : ""}`} onClick={() => setCategoria(c)}>{ROTULO_CATEGORIA[c]}</button>)}
      </div>
      {meses !== null && (
        <label className="sinal" style={{ borderWidth: 1, padding: "8px 12px" }}>
          <input type="checkbox" checked={daIdade} onChange={(e) => setDaIdade(e.target.checked)} />
          <span>Só para a idade de {dados.crianca!.nome}</span>
        </label>
      )}
      {lista.length === 0 && <p className="muted">Nada encontrado{daIdade ? " para esta idade. Desmarque o filtro de idade para ver tudo." : "."}</p>}
      {lista.map((d) => (
        <button key={d.id} className="opcao" onClick={() => { setAberta(d); window.scrollTo(0, 0); }}>
          <FotoMini id={d.id} />
          {d.titulo}
          <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>{d.resumo}</span>
          <span className="muted pequeno" style={{ display: "block", fontWeight: 600 }}>{ROTULO_CATEGORIA[d.categoria]} · {faixa(d)}</span>
        </button>
      ))}
    </>
  );
}

function DicaAberta({ d, voltar }: { d: Dica; voltar: () => void }) {
  const [mais, setMais] = useState(false);
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Dicas</button>
      <span className="muted pequeno" style={{ fontWeight: 700 }}>{ROTULO_CATEGORIA[d.categoria]} · {faixa(d)}</span>
      <h1 style={{ fontSize: 26 }}>{d.titulo}</h1>
      <FotoConteudo id={d.id} />
      {d.ingredientes && (
        <div className="card">
          <h3>Ingredientes</h3>
          <ul className="lista">{d.ingredientes.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      )}
      <div className="card">
        <h3>{d.ingredientes ? "Como fazer" : "O que fazer"}</h3>
        {d.ingredientes ? <ol className="lista">{d.simples.map((p) => <li key={p}>{p}</li>)}</ol> : <ul className="lista">{d.simples.map((p) => <li key={p}>{p}</li>)}</ul>}
      </div>
      {d.atencao && <div className="alerta"><b>Atenção: </b>{d.atencao}</div>}
      <button className="btn sec bloco" onClick={() => setMais(!mais)} aria-expanded={mais}>{mais ? "Fechar" : "Entender melhor"}</button>
      {mais && (
        <div className="card">
          {d.aprofundado.map((p) => <p key={p}>{p}</p>)}
          <div className="fontes" style={{ marginTop: 6 }}><b>Fontes</b>{d.fontes.map((f) => <span key={f}>{f}</span>)}</div>
        </div>
      )}
    </>
  );
}
