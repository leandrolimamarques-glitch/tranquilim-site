import { useState } from "react";
import type { Navegar } from "../App";
import { linhaRegistro, ROTA_PAINEL } from "../lib/convite";
import { apagarTudo, VAZIO, type Atualizar, type Dados } from "../lib/store";
import { Onboarding } from "./Onboarding";

export function Ajustes({ dados, atualizar, navegar }: { dados: Dados; atualizar: Atualizar; navegar: Navegar }) {
  const [confirmando, setConfirmando] = useState(false);
  const [desvinculando, setDesvinculando] = useState(false);
  return (
    <>
      <button className="voltar" onClick={() => navegar("inicio")}>‹ Início</button>
      <h1 style={{ fontSize: 28 }}>Ajustes</h1>
      <Onboarding inicial={dados.crianca ?? undefined} onSalvar={(crianca) => { atualizar((d) => ({ ...d, crianca })); navegar("inicio"); }} />
      {dados.medico && (
        <div className="card">
          <h3>Quem acompanha</h3>
          <p><b>{dados.medico.nome}</b></p>
          <p className="muted">{linhaRegistro(dados.medico)}</p>
          {!desvinculando ? (
            <button className="btn contorno bloco" onClick={() => setDesvinculando(true)}>Tirar este contato do app</button>
          ) : (
            <div className="grade2">
              <button className="btn sec" onClick={() => setDesvinculando(false)}>Cancelar</button>
              <button className="btn ps" onClick={() => { atualizar((d) => ({ ...d, medico: null })); setDesvinculando(false); }}>Tirar</button>
            </div>
          )}
        </div>
      )}
      <div className="card">
        <h3>Sobre o Tranquilim</h3>
        <p className="muted">Versão 0.1. Orienta e não substitui a consulta. Em emergência, ligue 192.</p>
        <p className="muted">Seus dados ficam só neste celular, no navegador. Se você limpar os dados do navegador ou trocar de aparelho, eles se perdem.</p>
      </div>
      <div className="card">
        <h3>Apagar todos os dados</h3>
        {!confirmando ? (
          <button className="btn contorno bloco" onClick={() => setConfirmando(true)}>Apagar dados deste celular</button>
        ) : (
          <>
            <p className="muted">Isso apaga a criança, as vacinas marcadas, as medidas e o diário. Não dá para desfazer.</p>
            <div className="grade2">
              <button className="btn sec" onClick={() => setConfirmando(false)}>Cancelar</button>
              <button className="btn ps" onClick={() => { apagarTudo(); atualizar(() => VAZIO); navegar("inicio"); }}>Apagar</button>
            </div>
          </>
        )}
      </div>
      <a className="voltar" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }} href={ROTA_PAINEL}>Área do pediatra ›</a>
    </>
  );
}
