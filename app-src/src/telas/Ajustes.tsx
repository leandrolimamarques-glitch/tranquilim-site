import { useState } from "react";
import type { Navegar } from "../App";
import { linhaRegistro, ROTA_PAINEL } from "../lib/convite";
import type { Atualizar, Controle, Dados } from "../lib/store";
import { Onboarding } from "./Onboarding";

const TEXTO_SINCRONIA: Record<Dados["sincronia"], string> = {
  local: "Só neste celular.",
  ok: "Sincronizado com o consultório.",
  enviando: "Enviando…",
  "sem-conexao": "Sem internet agora. O que você registrar vai quando a conexão voltar.",
  desligado: "Este celular foi desligado do consultório. Os dados continuam aqui.",
};

export function Ajustes({ dados, atualizar, navegar, controle }: { dados: Dados; atualizar: Atualizar; navegar: Navegar; controle: Controle }) {
  const [confirmando, setConfirmando] = useState<"" | "apagar" | "desligar">("");
  return (
    <>
      <button className="voltar" onClick={() => navegar("inicio")}>‹ Início</button>
      <h1 style={{ fontSize: 28 }}>Ajustes</h1>
      <Onboarding inicial={dados.crianca ?? undefined} onSalvar={(crianca) => { atualizar((d) => ({ ...d, crianca })); navegar("inicio"); }} />

      <div className="card">
        <h3>Consultório</h3>
        {dados.vinculo && dados.medico ? (
          <>
            <p><b>{dados.medico.nome}</b></p>
            <p className="muted">{linhaRegistro(dados.medico)}</p>
            <p className="muted pequeno">{TEXTO_SINCRONIA[dados.sincronia]}</p>
            {confirmando !== "desligar" ? (
              <button className="btn contorno bloco" onClick={() => setConfirmando("desligar")}>Desligar do consultório</button>
            ) : (
              <>
                <p className="muted">O médico deixa de receber o que você registrar daqui para a frente. Os dados continuam neste celular.</p>
                <div className="grade2">
                  <button className="btn sec" onClick={() => setConfirmando("")}>Cancelar</button>
                  <button className="btn ps" onClick={() => void controle.desligar().then(() => setConfirmando(""))}>Desligar</button>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="muted">{dados.sincronia === "desligado" ? TEXTO_SINCRONIA.desligado : "Não ligado a um consultório. Se o seu pediatra usa o Tranquilim, peça o link de convite."}</p>
        )}
      </div>

      <div className="card">
        <h3>Sobre o Tranquilim</h3>
        <p className="muted">Versão 0.2. Orienta e não substitui a consulta. Em emergência, ligue 192.</p>
        <p className="muted">{dados.vinculo ? "Os dados ficam neste celular e no servidor do Tranquilim, visíveis para você e para o consultório." : "Os dados ficam só neste celular. Se você limpar o navegador ou trocar de aparelho, eles se perdem."}</p>
      </div>

      <div className="card">
        <h3>Apagar os dados deste celular</h3>
        {confirmando !== "apagar" ? (
          <button className="btn contorno bloco" onClick={() => setConfirmando("apagar")}>Apagar dados deste celular</button>
        ) : (
          <>
            <p className="muted">{dados.vinculo ? "Isso desliga este celular do consultório e apaga os dados daqui. O que já foi enviado continua com o médico." : "Isso apaga a criança, as vacinas marcadas, as medidas e o diário. Não dá para desfazer."}</p>
            <div className="grade2">
              <button className="btn sec" onClick={() => setConfirmando("")}>Cancelar</button>
              <button className="btn ps" onClick={() => void controle.zerar().then(() => navegar("inicio"))}>Apagar</button>
            </div>
          </>
        )}
      </div>
      <a className="voltar" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }} href={ROTA_PAINEL}>Área do pediatra ›</a>
    </>
  );
}
