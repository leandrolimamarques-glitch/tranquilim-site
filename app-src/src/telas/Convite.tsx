import { Coruja } from "../Coruja";
import { lerConvite, linhaRegistro } from "../lib/convite";
import { dataBr } from "../lib/idade";
import { VAZIO, type Atualizar, type Dados } from "../lib/store";

export function Convite({ codigo, dados, atualizar, concluir }: { codigo: string; dados: Dados; atualizar: Atualizar; concluir: () => void }) {
  const convite = lerConvite(codigo);

  if (!convite) {
    return (
      <>
        <div className="marca"><Coruja titulo="Tranquilim" /><span>Tranquilim</span></div>
        <div className="card">
          <h2>Este convite não abriu</h2>
          <p className="muted">O link pode ter sido cortado ao copiar. Peça ao consultório para mandar de novo.</p>
        </div>
        <button className="btn bloco" onClick={concluir}>Abrir o Tranquilim</button>
      </>
    );
  }

  const { medico, crianca } = convite;
  const atual = dados.crianca;
  const mesma = !!atual && atual.nome.trim().toLowerCase() === crianca.nome.toLowerCase() && atual.nascimento === crianca.nascimento;
  const outra = !!atual && !mesma;

  const aceitar = () => {
    atualizar((d) => (mesma ? { ...d, crianca: { ...crianca }, medico } : { ...VAZIO, crianca, medico }));
    concluir();
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
      <p className="muted">Nascimento em {dataBr(crianca.nascimento)}. Se a data estiver errada, dá para corrigir depois em Ajustes.</p>
      <div className="card">
        <ul className="lista">
          <li>Vacinas do calendário 2026, com aviso da próxima</li>
          <li>Curva de crescimento da OMS</li>
          <li>Vai ao PS, liga ou espera? quando aparece febre</li>
          <li>Diário de mamadas, xixi, cocô e sono</li>
          <li>Contato do consultório a um toque</li>
        </ul>
      </div>
      {outra && (
        <div className="alerta">
          <b>Atenção: </b>este celular já acompanha {atual!.nome}. Por enquanto o Tranquilim acompanha uma criança por vez. Ao continuar, {crianca.nome} entra no lugar e as vacinas, medidas e o diário de {atual!.nome} são apagados.
        </div>
      )}
      <button className="btn bloco" onClick={aceitar}>{outra ? `Trocar para ${crianca.nome}` : "Começar"}</button>
      <button className="btn sec bloco" onClick={concluir}>Agora não</button>
      <p className="muted pequeno">Os dados ficam só neste celular. Nada é enviado para servidor. Em emergência, ligue 192.</p>
    </>
  );
}
