import { useEffect, useState } from "react";
import { Coruja } from "../Coruja";
import { api } from "../lib/api";
import { linhaRegistro, type Medico } from "../lib/convite";
import type { Crianca } from "../lib/familia";
import { dataBr } from "../lib/idade";
import type { Doc } from "../lib/sinc";
import type { Controle, Dados } from "../lib/store";

type Info = { medico: Medico; crianca: Crianca };

export function Convite({ token, dados, controle, concluir }: { token: string; dados: Dados; controle: Controle; concluir: () => void }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [erro, setErro] = useState("");
  const [autorizo, setAutorizo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get<Info>(`/api/convite/${token}`).then(setInfo).catch((e: Error) => setErro(e.message));
  }, [token]);

  if (erro && !info) {
    return (
      <>
        <div className="marca"><Coruja titulo="Tranquilim" /><span>Tranquilim</span></div>
        <div className="card">
          <h2>Este convite não abriu</h2>
          <p className="muted">{erro}</p>
        </div>
        <button className="btn bloco" onClick={concluir}>Abrir o Tranquilim</button>
      </>
    );
  }
  if (!info) return <p className="muted" role="status">Abrindo o convite…</p>;

  const { medico, crianca } = info;
  const atual = dados.crianca;
  const mesma = !!atual && atual.nome.trim().toLowerCase() === crianca.nome.trim().toLowerCase() && atual.nascimento === crianca.nascimento;
  const outra = !!atual && !mesma;

  const aceitar = async () => {
    setEnviando(true);
    setErro("");
    try {
      const r = await api.post<{ pacienteId: string; medico: Medico; doc: Doc }>(`/api/convite/${token}/aceitar`, { consentimento: true, doc: mesma ? controle.doc() : undefined });
      controle.substituir({ doc: r.doc, medico: r.medico, vinculo: { pacienteId: r.pacienteId } });
      concluir();
    } catch (e) {
      setErro((e as Error).message);
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="card noite" style={{ alignItems: "center", textAlign: "center", padding: 24 }}>
        <div style={{ width: 96 }}><Coruja clara titulo="Tranquilim" /></div>
        <p className="muted">Convite de</p>
        <h1 style={{ fontSize: 26 }}>{medico.nome}</h1>
        <p className="muted">{linhaRegistro(medico)}</p>
      </div>
      <h2>Acompanhamento de {crianca.nome}</h2>
      <p className="muted">Nascimento em {dataBr(crianca.nascimento)}.</p>
      <div className="card">
        <ul className="lista">
          <li>Carteira de vacinação: mande a foto e veja o que falta</li>
          <li>Curva de crescimento da OMS</li>
          <li>Vai ao PS, liga ou espera? para febre e outros sustos</li>
          <li>Diário de mamadas, xixi, cocô e sono</li>
          <li>Contato do consultório a um toque</li>
        </ul>
      </div>
      {outra && (
        <div className="alerta">
          <b>Atenção: </b>este celular já acompanha {atual!.nome}. Por enquanto o Tranquilim acompanha uma criança por vez. Ao continuar, {crianca.nome} entra no lugar e os registros de {atual!.nome} saem deste celular.
        </div>
      )}
      <label className={`sinal ${autorizo ? "marcado-ok" : ""}`}>
        <input id="autorizo" type="checkbox" checked={autorizo} onChange={(e) => setAutorizo(e.target.checked)} />
        <span>Autorizo {medico.nome} a ver o que eu registrar sobre {crianca.nome} neste app: vacinas, medidas, diário e fotos da carteira. Posso desligar quando quiser em Ajustes.</span>
      </label>
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
      <button className="btn bloco" disabled={!autorizo || enviando} onClick={aceitar}>{enviando ? "Ligando…" : outra ? `Trocar para ${crianca.nome}` : "Começar"}</button>
      <button className="btn sec bloco" onClick={concluir}>Agora não</button>
      <p className="muted pequeno">Em emergência, ligue 192.</p>
    </>
  );
}
