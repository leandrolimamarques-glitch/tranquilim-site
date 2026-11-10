import { useCallback, useEffect, useState } from "react";
import { Coruja } from "../../Coruja";
import { api, ErroApi } from "../../lib/api";
import type { Medico } from "../../lib/convite";
import { Entrar } from "./Entrar";
import { Pacientes } from "./Pacientes";
import { Agenda } from "./Agenda";
import { FinanceiroTela } from "./Financeiro";
import { Configuracoes } from "./Configuracoes";
import { useDocRemoto } from "./useDocRemoto";

export type MedicoConta = Medico & { email: string };
type Aba = "pacientes" | "agenda" | "financeiro" | "ajustes";

const ABAS: { id: Aba; rotulo: string; icone: string }[] = [
  { id: "pacientes", rotulo: "Pacientes", icone: "☺" },
  { id: "agenda", rotulo: "Agenda", icone: "▦" },
  { id: "financeiro", rotulo: "Financeiro", icone: "$" },
  { id: "ajustes", rotulo: "Ajustes", icone: "⚙" },
];

export function Painel({ sair }: { sair: () => void }) {
  const [conta, setConta] = useState<MedicoConta | null | undefined>(undefined);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setConta((await api.get<{ medico: MedicoConta }>("/api/medico/eu")).medico);
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) setConta(null);
      else setErro((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  if (conta === undefined) return <main className="conteudo sem-abas"><p className="muted" role="status">{erro || "Abrindo o painel…"}</p></main>;
  if (conta === null) return <main className="conteudo sem-abas"><Entrar aoEntrar={setConta} sair={sair} /></main>;
  return <PainelLogado conta={conta} setConta={setConta} sair={sair} />;
}

function PainelLogado({ conta, setConta, sair }: { conta: MedicoConta; setConta: (m: MedicoConta | null) => void; sair: () => void }) {
  const [aba, setAba] = useState<Aba>("pacientes");
  const financeiro = useDocRemoto("/api/medico/financeiro", `tranquilim:fin:${conta.email}`);
  const ir = (a: Aba) => {
    setAba(a);
    window.scrollTo(0, 0);
  };
  const desconectar = async () => {
    await api.post("/api/sair", { tipo: "medico" }).catch(() => undefined);
    setConta(null);
  };

  return (
    <>
      <main className="conteudo painel">
        <div className="topo">
          <div className="marca"><Coruja titulo="Tranquilim" /><span>Painel</span></div>
          <span className="muted pequeno" style={{ textAlign: "right" }}>{conta.nome}</span>
        </div>
        {aba === "pacientes" && <Pacientes medico={conta} financeiro={financeiro} />}
        {aba === "agenda" && <Agenda financeiro={financeiro} />}
        {aba === "financeiro" && <FinanceiroTela financeiro={financeiro} />}
        {aba === "ajustes" && <Configuracoes conta={conta} setConta={setConta} financeiro={financeiro} desconectar={desconectar} sair={sair} />}
      </main>
      <nav className="abas" aria-label="Seções do painel">
        <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {ABAS.map((a) => (
            <button key={a.id} className={aba === a.id ? "ativa" : ""} onClick={() => ir(a.id)} aria-current={aba === a.id ? "page" : undefined}>
              <span className="ic" aria-hidden="true">{a.icone}</span>
              {a.rotulo}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
