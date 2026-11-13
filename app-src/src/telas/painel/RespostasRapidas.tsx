import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { TEMAS_RAPIDOS, TEM_DOSE, fluxoDoTema, rascunhoDoTema, sinaisDePerigo, type Tema } from "../../lib/respostas";

type Salva = { tema: string; texto: string; publicado: boolean; atualizadoEm: string | null };

/** O pediatra escreve, por tema, o que orienta fazer em casa. A família vê no "Vai ao PS?" e a IA usa. */
export function RespostasRapidas({ voltar }: { voltar: () => void }) {
  const [salvas, setSalvas] = useState<Salva[] | null>(null);
  const [aberto, setAberto] = useState<Tema | null>(null);
  const carregar = () => api.get<{ respostas: Salva[] }>("/api/pediatra/respostas").then((r) => setSalvas(r.respostas)).catch(() => setSalvas([]));
  useEffect(() => {
    void carregar();
  }, []);
  if (aberto) return <EditarResposta tema={aberto} salva={salvas?.find((s) => s.tema === aberto.id)} fechar={() => { setAberto(null); void carregar(); window.scrollTo(0, 0); }} />;
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Perfil</button>
      <h1 style={{ fontSize: 26 }}>Resposta rápida</h1>
      <p className="muted">
        Para a mãe ou o pai que está apavorado e quer uma resposta já. Em cada tema, o app mostra primeiro os sinais de perigo (192 ou pronto-socorro) e depois a sua orientação para casa. O "Pergunte ao Tranquilim" também passa a responder com base no que você escrever.
      </p>
      <p className="muted pequeno">Só as famílias que você acompanha veem a sua orientação. Sem dose: cada criança tem a dose pelo peso. Escreva, por exemplo, "na dose da receita".</p>
      {salvas === null && <p className="muted" role="status">Carregando…</p>}
      {salvas && TEMAS_RAPIDOS.map((t) => {
        const s = salvas.find((x) => x.tema === t.id);
        return (
          <button key={t.id} className="opcao" onClick={() => setAberto(t)}>
            {t.titulo}
            <span className="muted" style={{ display: "block", fontWeight: 500, fontSize: 14 }}>
              {s?.publicado ? "Aparecendo para as famílias" : s ? "Guardado, ainda não aparece" : "Ainda não escrito"}
            </span>
          </button>
        );
      })}
    </>
  );
}

function EditarResposta({ tema, salva, fechar }: { tema: Tema; salva?: Salva; fechar: () => void }) {
  const [texto, setTexto] = useState(salva?.texto ?? rascunhoDoTema(tema));
  const [erro, setErro] = useState("");
  const dose = TEM_DOSE.test(texto);
  const salvar = async (publicado: boolean) => {
    setErro("");
    try {
      await api.put(`/api/pediatra/respostas/${tema.id}`, { texto, publicado });
      fechar();
    } catch (e) {
      setErro((e as Error).message);
    }
  };
  return (
    <>
      <button className="voltar" onClick={fechar}>‹ Resposta rápida</button>
      <h1 style={{ fontSize: 26 }}>{tema.titulo}</h1>
      <div className="card" style={{ borderColor: "var(--ps)" }}>
        <h3>Antes da sua orientação, a família vê:</h3>
        <p className="muted pequeno" style={{ margin: 0 }}>Ligue 192 ou vá ao pronto-socorro agora se:</p>
        <ul className="lista pequeno">{sinaisDePerigo(fluxoDoTema(tema)).map((x) => <li key={x}>{x}</li>)}</ul>
        {tema.id === "febre" && <p className="muted pequeno" style={{ margin: 0 }}>Bebê com menos de 3 meses e febre vê só a orientação de ir ao pronto-socorro.</p>}
      </div>
      <div className="card">
        <label className="campo">
          Sua orientação para casa
          <textarea rows={10} value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={3000} />
        </label>
        {!salva && <p className="muted pequeno">Começamos com as orientações do app para você ajustar do seu jeito.</p>}
        {dose && <p className="pequeno" style={{ color: "var(--ps)" }}>Tire a dose: o app não mostra dose. Use "na dose da receita".</p>}
        {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
        <button className="btn bloco" disabled={dose || texto.trim().length < 10} onClick={() => void salvar(true)}>Salvar e mostrar para as famílias</button>
        <button className="btn sec bloco" disabled={dose} onClick={() => void salvar(false)}>{salva?.publicado ? "Tirar das famílias e guardar" : "Só guardar"}</button>
      </div>
    </>
  );
}
