import { useState } from "react";
import type { ContaInfo } from "../../lib/store";
import { useDocRemoto } from "../../lib/useDocRemoto";
import { Pacientes } from "./Pacientes";
import { Agenda } from "./Agenda";
import { FinanceiroTela } from "./Financeiro";
import { Configuracoes } from "./Configuracoes";

type Parte = "pacientes" | "agenda" | "financeiro" | "perfil";

/** Funções do pediatra, dentro do mesmo app e da mesma conta. */
export function Consultorio({ conta, recarregar }: { conta: ContaInfo; recarregar: () => Promise<void> }) {
  const [parte, setParte] = useState<Parte>("pacientes");
  const financeiro = useDocRemoto("/api/pediatra/financeiro", `tq:fin:${conta.id}`);
  return (
    <>
      <div className="segmento">
        {(["pacientes", "agenda", "financeiro", "perfil"] as Parte[]).map((p) => (
          <button key={p} className={parte === p ? "ativa" : ""} onClick={() => { setParte(p); window.scrollTo(0, 0); }} style={{ fontSize: 13 }}>
            {{ pacientes: "Pacientes", agenda: "Agenda", financeiro: "Financeiro", perfil: "Perfil" }[p]}
          </button>
        ))}
      </div>
      {parte === "pacientes" && <Pacientes medico={{ nome: conta.nome, registro: conta.registro ?? "", titulo: conta.titulo ?? undefined }} financeiro={financeiro} />}
      {parte === "agenda" && <Agenda financeiro={financeiro} />}
      {parte === "financeiro" && <FinanceiroTela financeiro={financeiro} />}
      {parte === "perfil" && <Configuracoes conta={conta} recarregar={recarregar} financeiro={financeiro} />}
    </>
  );
}
