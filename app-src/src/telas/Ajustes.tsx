import { useEffect, useState } from "react";
import type { Navegar } from "../App";
import { api } from "../lib/api";
import { linhaRegistro } from "../lib/convite";
import type { CriancaDaConta, Pediatra, Sessao } from "../lib/store";
import { Onboarding } from "./Onboarding";
import { Admin } from "./Admin";
import { Sobre } from "./Sobre";

type Props = { sessao: Sessao; atual: CriancaDaConta | null; escolher: (id: string) => void; recarregar: () => Promise<void>; navegar: Navegar; novaCrianca: () => void };

export function Ajustes({ sessao, atual, escolher, recarregar, navegar, novaCrianca }: Props) {
  const [tela, setTela] = useState<"menu" | "admin" | "senha" | "sobre">("menu");
  if (tela === "admin") return <Admin voltar={() => setTela("menu")} euId={sessao.conta.id} />;
  if (tela === "senha") return <TrocarSenha voltar={() => setTela("menu")} />;
  if (tela === "sobre") return <Sobre voltar={() => setTela("menu")} rotuloVoltar="Ajustes" />;
  const sair = async () => {
    await api.post("/api/conta/sair").catch(() => undefined);
    location.reload();
  };

  return (
    <>
      <button className="voltar" onClick={() => navegar("inicio")}>‹ Início</button>
      <h1 style={{ fontSize: 28 }}>Ajustes</h1>

      <div className="card">
        <h3>Sua conta</h3>
        <p><b>{sessao.conta.nome}</b></p>
        <p className="muted">{sessao.conta.email}{sessao.conta.pediatra ? " · pediatra" : ""}{sessao.conta.dono ? " · administrador" : ""}</p>
        <div className="grade2">
          <button className="btn sec" onClick={() => setTela("senha")}>Trocar senha</button>
          <button className="btn contorno" onClick={() => void sair()}>Sair</button>
        </div>
      </div>

      <div className="card">
        <h3>Crianças</h3>
        {sessao.criancas.map((k) => (
          <button key={k.id} className="item-lista" style={{ borderTop: "1px solid var(--line)" }} onClick={() => escolher(k.id)}>
            <span style={{ flex: 1 }}>{k.crianca.nome}</span>
            {atual?.id === k.id ? <span className="chip aplicada">aberta</span> : <span className="muted pequeno">abrir</span>}
          </button>
        ))}
        <button className="btn sec bloco" onClick={novaCrianca}>+ Cadastrar criança</button>
      </div>

      {atual && <CriancaAtual k={atual} recarregar={recarregar} />}

      {sessao.conta.dono && (
        <div className="card">
          <h3>Administração</h3>
          <p className="muted">Ativar pediatras e ajudar quem esqueceu a senha.</p>
          <button className="btn bloco" onClick={() => setTela("admin")}>Abrir administração</button>
        </div>
      )}

      <button className="card" style={{ textAlign: "left", cursor: "pointer" }} onClick={() => setTela("sobre")}>
        <h3>Quem somos</h3>
        <p className="muted">Por que criamos o Tranquilim e quem são os médicos por trás dele.</p>
      </button>
      <div className="card">
        <h3>Sobre o Tranquilim</h3>
        <p className="muted">Orienta e não substitui a consulta. Em emergência, ligue 192. Os dados ficam na sua conta e só você, quem você incluir como responsável e o pediatra que você escolher veem.</p>
      </div>
    </>
  );
}

function CriancaAtual({ k, recarregar }: { k: CriancaDaConta; recarregar: () => Promise<void> }) {
  const [editando, setEditando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [removendo, setRemovendo] = useState(false);
  const nome = k.crianca.nome;

  if (editando) {
    return (
      <Onboarding
        inicial={k.crianca}
        onSalvar={async (crianca) => {
          await api.put(`/api/criancas/${k.id}`, { crianca });
          await recarregar();
          setEditando(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="card">
        <div className="linha"><h3>{nome}</h3><button className="btn contorno" style={{ minHeight: 40 }} onClick={() => setEditando(true)}>Editar</button></div>
        <h3 style={{ marginTop: 6 }}>Pediatra de {nome}</h3>
        {k.pediatras.length === 0 && <p className="muted">Ninguém acompanhando pelo app. Se o pediatra de {nome} usa o Tranquilim, escolha abaixo. Se não usa, mande para ele o seu e-mail desta conta e o endereço tranquilim.com.br.</p>}
        {k.pediatras.map((p) => (
          <div key={p.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
            <span>{p.nome}<span className="muted pequeno" style={{ display: "block" }}>{linhaRegistro(p)}</span></span>
            <button className="btn contorno" style={{ minHeight: 40 }} onClick={() => void api.del(`/api/criancas/${k.id}/pediatra/${p.id}`).then(recarregar)}>Tirar</button>
          </div>
        ))}
        {!buscando ? <button className="btn sec bloco" onClick={() => setBuscando(true)}>Escolher pediatra da rede</button> : <BuscarPediatra k={k} pronto={async () => { setBuscando(false); await recarregar(); }} />}
      </div>

      <div className="card">
        <h3>Outro responsável</h3>
        <p className="muted">Pai, mãe ou avó também podem acompanhar {nome}. A pessoa cria a conta dela no Tranquilim e você coloca o e-mail aqui.</p>
        <div className="grade2">
          <label className="campo">E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <button className="btn sec" style={{ alignSelf: "end" }} disabled={!email.includes("@")} onClick={async () => {
            try {
              const r = await api.post<{ nome: string }>(`/api/criancas/${k.id}/responsaveis`, { email });
              setMsg(`${r.nome} agora também acompanha ${nome}.`);
              setEmail("");
            } catch (e) {
              setMsg((e as Error).message);
            }
          }}>Incluir</button>
        </div>
        {msg && <p className="pequeno">{msg}</p>}
      </div>

      <div className="card">
        {!removendo ? (
          <button className="btn contorno bloco" onClick={() => setRemovendo(true)}>Tirar {nome} desta conta</button>
        ) : (
          <>
            <p className="muted">{nome} sai da sua conta. Se ninguém mais for responsável, os registros deixam de aparecer para todos.</p>
            <div className="grade2">
              <button className="btn sec" onClick={() => setRemovendo(false)}>Cancelar</button>
              <button className="btn ps" onClick={() => void api.del(`/api/criancas/${k.id}`).then(() => location.reload())}>Tirar</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function BuscarPediatra({ k, pronto }: { k: CriancaDaConta; pronto: () => Promise<void> }) {
  const [busca, setBusca] = useState("");
  const [lista, setLista] = useState<Pediatra[]>([]);
  useEffect(() => {
    const t = setTimeout(() => {
      api.get<{ pediatras: Pediatra[] }>(`/api/pediatras?busca=${encodeURIComponent(busca)}`).then((r) => setLista(r.pediatras)).catch(() => setLista([]));
    }, 250);
    return () => clearTimeout(t);
  }, [busca]);
  return (
    <>
      <label className="campo">Nome do pediatra<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Digite parte do nome" /></label>
      {lista.filter((p) => !k.pediatras.some((x) => x.id === p.id)).map((p) => (
        <div key={p.id} className="linha" style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
          <span>{p.nome}<span className="muted pequeno" style={{ display: "block" }}>{[linhaRegistro(p), p.local].filter(Boolean).join(" · ")}</span></span>
          <button className="btn" style={{ minHeight: 40 }} onClick={() => void api.post(`/api/criancas/${k.id}/pediatra`, { pediatraId: p.id }).then(pronto)}>Escolher</button>
        </div>
      ))}
      {lista.length === 0 && <p className="muted pequeno">Nenhum pediatra com esse nome na rede.</p>}
      <p className="muted pequeno">Ao escolher, o pediatra passa a ver as vacinas, medidas, diário e perguntas de {k.crianca.nome}.</p>
    </>
  );
}

function TrocarSenha({ voltar }: { voltar: () => void }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <>
      <button className="voltar" onClick={voltar}>‹ Ajustes</button>
      <h1 style={{ fontSize: 26 }}>Trocar senha</h1>
      <div className="card">
        <label className="campo">Senha atual<input type="password" value={atual} onChange={(e) => setAtual(e.target.value)} autoComplete="current-password" /></label>
        <label className="campo">Senha nova<input type="password" value={nova} onChange={(e) => setNova(e.target.value)} autoComplete="new-password" placeholder="pelo menos 8 caracteres" /></label>
        {msg && <p className="pequeno">{msg}</p>}
        <button className="btn bloco" disabled={nova.length < 8 || !atual} onClick={async () => {
          try {
            await api.put("/api/conta/senha", { atual, nova });
            setMsg("Senha trocada.");
            setAtual("");
            setNova("");
          } catch (e) {
            setMsg((e as Error).message);
          }
        }}>Salvar</button>
      </div>
    </>
  );
}
