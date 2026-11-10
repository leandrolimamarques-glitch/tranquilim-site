import { useRef, useState, type ChangeEvent } from "react";
import { Coruja } from "../Coruja";
import { formatarTelefone, linhaRegistro, linkConvite, linkWhatsApp, mensagemConvite, telefoneBr, type Medico } from "../lib/convite";
import { dataBr, hojeIso, idadeTexto } from "../lib/idade";
import type { Sexo } from "../lib/oms";
import { juntar, lerCopia, usePainel, type AtualizarPainel, type DadosPainel, type PacientePainel } from "../lib/painel";
import { novoId } from "../lib/store";

type Tela = { t: "lista" } | { t: "perfil" } | { t: "novo" } | { t: "editar"; id: string } | { t: "ver"; id: string } | { t: "copia" };

const BASE_APP = () => `${location.origin}${import.meta.env.BASE_URL}`;

export function Painel({ sair }: { sair: () => void }) {
  const [dados, atualizar] = usePainel();
  const [tela, setTela] = useState<Tela>({ t: "lista" });
  const ir = (t: Tela) => {
    setTela(t);
    window.scrollTo(0, 0);
  };

  if (!dados.medico || tela.t === "perfil") {
    return (
      <Perfil
        inicial={dados.medico}
        onSalvar={(medico) => {
          atualizar((d) => ({ ...d, medico }));
          ir({ t: "lista" });
        }}
        voltar={dados.medico ? () => ir({ t: "lista" }) : sair}
      />
    );
  }
  const medico = dados.medico;

  if (tela.t === "novo" || tela.t === "editar") {
    const atual = tela.t === "editar" ? dados.pacientes.find((p) => p.id === tela.id) : undefined;
    return (
      <FormPaciente
        inicial={atual}
        voltar={() => ir(atual ? { t: "ver", id: atual.id } : { t: "lista" })}
        onSalvar={(p) => {
          atualizar((d) => ({
            ...d,
            pacientes: atual ? d.pacientes.map((x) => (x.id === atual.id ? { ...x, ...p } : x)) : [{ ...p, id: novoId(), criadoEm: new Date().toISOString() }, ...d.pacientes],
          }));
          ir({ t: "lista" });
        }}
      />
    );
  }

  if (tela.t === "ver") {
    const p = dados.pacientes.find((x) => x.id === tela.id);
    if (p) return <VerPaciente p={p} medico={medico} atualizar={atualizar} ir={ir} />;
  }

  if (tela.t === "copia") return <Copia dados={dados} atualizar={atualizar} voltar={() => ir({ t: "lista" })} />;

  return <Lista dados={dados} medico={medico} ir={ir} sair={sair} />;
}

function Cabecalho({ titulo, voltar, rotuloVoltar }: { titulo: string; voltar?: () => void; rotuloVoltar?: string }) {
  return (
    <>
      {voltar && <button className="voltar" onClick={voltar}>‹ {rotuloVoltar ?? "Voltar"}</button>}
      <h1 style={{ fontSize: 26 }}>{titulo}</h1>
    </>
  );
}

function Lista({ dados, medico, ir, sair }: { dados: DadosPainel; medico: Medico; ir: (t: Tela) => void; sair: () => void }) {
  const [busca, setBusca] = useState("");
  const hoje = hojeIso();
  const termo = busca.trim().toLocaleLowerCase("pt-BR");
  const lista = [...dados.pacientes]
    .sort((a, b) => a.crianca.nome.localeCompare(b.crianca.nome, "pt-BR"))
    .filter((p) => !termo || `${p.crianca.nome} ${p.responsavel}`.toLocaleLowerCase("pt-BR").includes(termo));
  const enviados = dados.pacientes.filter((p) => p.conviteEm).length;

  return (
    <>
      <div className="topo">
        <div className="marca"><Coruja titulo="Tranquilim" /><span>Painel do pediatra</span></div>
      </div>
      <div className="card noite">
        <h2>{medico.nome}</h2>
        <p className="muted">{linhaRegistro(medico)}</p>
        <p className="muted">{dados.pacientes.length} {dados.pacientes.length === 1 ? "paciente" : "pacientes"} · {enviados} {enviados === 1 ? "convite enviado" : "convites enviados"}</p>
      </div>
      <button className="btn bloco" onClick={() => ir({ t: "novo" })}>+ Cadastrar paciente</button>
      {dados.pacientes.length > 5 && (
        <label className="campo">
          Buscar
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Nome da criança ou do responsável" />
        </label>
      )}
      {dados.pacientes.length === 0 ? (
        <div className="card">
          <h3>Nenhum paciente ainda</h3>
          <p className="muted">Cadastre a criança e mande o convite pelo WhatsApp. A família abre o link e o app já chega com o nome da criança e o seu contato.</p>
        </div>
      ) : (
        <div className="card" style={{ gap: 0, padding: "4px 16px" }}>
          {lista.map((p, i) => (
            <button key={p.id} className="item-lista" style={{ borderBottom: i < lista.length - 1 ? "1px solid var(--line)" : 0 }} onClick={() => ir({ t: "ver", id: p.id })}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b style={{ display: "block" }}>{p.crianca.nome}</b>
                <span className="muted pequeno">{idadeTexto(p.crianca.nascimento, hoje)}{p.responsavel ? ` · ${p.responsavel}` : ""}</span>
              </span>
              <span className={`chip ${p.conviteEm ? "aplicada" : "pendente"}`}>{p.conviteEm ? "Convidado" : "Sem convite"}</span>
            </button>
          ))}
          {lista.length === 0 && <p className="muted" style={{ padding: "12px 0" }}>Ninguém com esse nome.</p>}
        </div>
      )}
      <div className="card">
        <p className="muted pequeno">A lista fica só neste aparelho. Se trocar de celular ou limpar o navegador, ela se perde: guarde uma cópia de segurança de vez em quando.</p>
        <div className="grade2">
          <button className="btn sec" onClick={() => ir({ t: "perfil" })}>Meu perfil</button>
          <button className="btn sec" onClick={() => ir({ t: "copia" })}>Cópia de segurança</button>
        </div>
      </div>
      <button className="voltar" onClick={sair}>‹ Sair do painel</button>
    </>
  );
}

function Perfil({ inicial, onSalvar, voltar }: { inicial: Medico | null; onSalvar: (m: Medico) => void; voltar: () => void }) {
  const [m, setM] = useState<Medico>(inicial ?? { nome: "", registro: "" });
  const campo = (k: keyof Medico) => ({ value: m[k] ?? "", onChange: (e: ChangeEvent<HTMLInputElement>) => setM({ ...m, [k]: e.target.value }) });
  const zapOk = !m.whatsapp?.trim() || !!telefoneBr(m.whatsapp);
  const telOk = !m.telefone?.trim() || !!telefoneBr(m.telefone);
  const valido = m.nome.trim().length >= 3 && m.registro.trim().length >= 4 && zapOk && telOk;

  return (
    <>
      <Cabecalho titulo={inicial ? "Meu perfil" : "Painel do pediatra"} voltar={voltar} rotuloVoltar={inicial ? "Pacientes" : "Sair"} />
      {!inicial && <p className="muted">Primeiro, como você aparece para as famílias. Isso vai no convite e fica no app de cada paciente.</p>}
      <div className="card">
        <label className="campo">Nome como as famílias veem<input {...campo("nome")} placeholder="Dr. Nome Sobrenome" autoComplete="name" /></label>
        <label className="campo">Registro<input {...campo("registro")} placeholder="CRM-UF 000000 · RQE 00000" /></label>
        <label className="campo">
          Título (opcional)
          <input {...campo("titulo")} placeholder="Pediatra" />
          <span className="muted pequeno" style={{ fontWeight: 500 }}>Especialidade só com RQE registrado (regra do CFM). Sem RQE, deixe em branco.</span>
        </label>
        <label className="campo">
          WhatsApp do consultório (opcional)
          <input {...campo("whatsapp")} inputMode="tel" placeholder="(11) 90000-0000" />
          {!zapOk && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}
        </label>
        <label className="campo">
          Telefone para ligar (opcional)
          <input {...campo("telefone")} inputMode="tel" placeholder="(11) 0000-0000" />
          {!telOk && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}
        </label>
        <label className="campo">Endereço ou horário (opcional)<input {...campo("local")} placeholder="Rua, número, cidade · seg a sex, 8h às 18h" /></label>
        <button className="btn bloco" disabled={!valido} onClick={() => onSalvar(m)}>Salvar perfil</button>
      </div>
    </>
  );
}

type PacienteForm = Pick<PacientePainel, "crianca" | "responsavel" | "whatsapp">;

function FormPaciente({ inicial, onSalvar, voltar }: { inicial?: PacientePainel; onSalvar: (p: PacienteForm) => void; voltar: () => void }) {
  const [nome, setNome] = useState(inicial?.crianca.nome ?? "");
  const [nascimento, setNascimento] = useState(inicial?.crianca.nascimento ?? "");
  const [sexo, setSexo] = useState<Sexo | "">(inicial?.crianca.sexo ?? "");
  const [responsavel, setResponsavel] = useState(inicial?.responsavel ?? "");
  const [whatsapp, setWhatsapp] = useState(inicial?.whatsapp ?? "");
  const hoje = hojeIso();
  const zapOk = !whatsapp.trim() || !!telefoneBr(whatsapp);
  const valido = nome.trim().length > 0 && nascimento !== "" && nascimento <= hoje && sexo !== "" && zapOk;

  return (
    <>
      <Cabecalho titulo={inicial ? "Editar paciente" : "Novo paciente"} voltar={voltar} />
      <div className="card">
        <label className="campo">Nome ou apelido da criança<input id="p-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="off" /></label>
        <label className="campo">Data de nascimento<input id="p-nascimento" type="date" value={nascimento} max={hoje} onChange={(e) => setNascimento(e.target.value)} /></label>
        <div className="campo">
          Sexo (para as curvas)
          <div className="segmento">
            <button type="button" className={sexo === "menina" ? "ativa" : ""} onClick={() => setSexo("menina")}>Menina</button>
            <button type="button" className={sexo === "menino" ? "ativa" : ""} onClick={() => setSexo("menino")}>Menino</button>
          </div>
        </div>
        <label className="campo">Nome do responsável (opcional)<input id="p-resp" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} autoComplete="off" /></label>
        <label className="campo">
          WhatsApp do responsável (opcional)
          <input id="p-zap" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" placeholder="(11) 90000-0000" />
          {!zapOk && <span className="pequeno" style={{ color: "var(--ps)" }}>Use DDD e número.</span>}
        </label>
        <button className="btn bloco" disabled={!valido} onClick={() => sexo && onSalvar({ crianca: { nome: nome.trim(), nascimento, sexo }, responsavel: responsavel.trim(), whatsapp: whatsapp.trim() })}>
          Salvar
        </button>
      </div>
    </>
  );
}

function VerPaciente({ p, medico, atualizar, ir }: { p: PacientePainel; medico: Medico; atualizar: AtualizarPainel; ir: (t: Tela) => void }) {
  const [removendo, setRemovendo] = useState(false);
  const [copiado, setCopiado] = useState<"" | "ok" | "falhou">("");
  const hoje = hojeIso();
  const link = linkConvite(BASE_APP(), medico, p.crianca);
  const mensagem = mensagemConvite(medico, p.crianca, p.responsavel, link);
  const marcarEnviado = () => atualizar((d) => ({ ...d, pacientes: d.pacientes.map((x) => (x.id === p.id ? { ...x, conviteEm: new Date().toISOString() } : x)) }));

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado("ok");
      marcarEnviado();
    } catch {
      setCopiado("falhou");
    }
  };

  return (
    <>
      <Cabecalho titulo={p.crianca.nome} voltar={() => ir({ t: "lista" })} rotuloVoltar="Pacientes" />
      <div className="card">
        <div className="linha"><span className="muted">Idade</span><b>{idadeTexto(p.crianca.nascimento, hoje)}</b></div>
        <div className="linha"><span className="muted">Nascimento</span><b>{dataBr(p.crianca.nascimento)}</b></div>
        <div className="linha"><span className="muted">Sexo</span><b>{p.crianca.sexo === "menina" ? "Menina" : "Menino"}</b></div>
        {p.responsavel && <div className="linha"><span className="muted">Responsável</span><b>{p.responsavel}</b></div>}
        {p.whatsapp && <div className="linha"><span className="muted">WhatsApp</span><b>{formatarTelefone(p.whatsapp)}</b></div>}
      </div>

      <div className="card">
        <h3>Convite</h3>
        <p className="muted">
          {p.conviteEm ? `Enviado em ${dataBr(p.conviteEm.slice(0, 10))}. Pode mandar de novo se a família perdeu o link.` : "Ainda não enviado."}
        </p>
        <a className="btn bloco" href={linkWhatsApp(p.whatsapp, mensagem)} target="_blank" rel="noopener noreferrer" onClick={marcarEnviado}>
          Enviar pelo WhatsApp
        </a>
        <button className="btn sec bloco" onClick={copiar}>{copiado === "ok" ? "Mensagem copiada" : "Copiar mensagem com o link"}</button>
        {copiado === "falhou" && <textarea readOnly value={mensagem} rows={6} style={{ width: "100%", font: "inherit", fontSize: 13, borderRadius: 12, padding: 10, border: "1.5px solid var(--line)", background: "var(--card)", color: "var(--ink)" }} onFocus={(e) => e.currentTarget.select()} />}
        <a className="btn contorno bloco" href={link} target="_blank" rel="noopener noreferrer">Ver como a família vê</a>
        <p className="muted pequeno">O link leva o nome e a data de nascimento da criança. Mande só para a família.</p>
      </div>

      <div className="grade2">
        <button className="btn sec" onClick={() => ir({ t: "editar", id: p.id })}>Editar</button>
        <button className="btn contorno" onClick={() => setRemovendo(true)}>Remover</button>
      </div>
      {removendo && (
        <div className="card">
          <p>Remover {p.crianca.nome} da lista? O app da família continua funcionando.</p>
          <div className="grade2">
            <button className="btn sec" onClick={() => setRemovendo(false)}>Cancelar</button>
            <button className="btn ps" onClick={() => { atualizar((d) => ({ ...d, pacientes: d.pacientes.filter((x) => x.id !== p.id) })); ir({ t: "lista" }); }}>Remover</button>
          </div>
        </div>
      )}
    </>
  );
}

function Copia({ dados, atualizar, voltar }: { dados: DadosPainel; atualizar: AtualizarPainel; voltar: () => void }) {
  const arquivo = useRef<HTMLInputElement>(null);
  const [aviso, setAviso] = useState("");

  const exportar = () => {
    const blob = new Blob([JSON.stringify(dados)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tranquilim-pacientes-${hojeIso()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAviso("Arquivo salvo. Guarde num lugar só seu: ele tem nome e nascimento dos pacientes.");
  };

  const importar = async (f: File | undefined) => {
    if (!f) return;
    const copia = lerCopia(await f.text());
    if (!copia) return setAviso("Esse arquivo não é uma cópia do painel.");
    atualizar((d) => juntar(d, copia));
    setAviso(`${copia.pacientes.length} ${copia.pacientes.length === 1 ? "paciente juntado" : "pacientes juntados"} à lista.`);
  };

  return (
    <>
      <Cabecalho titulo="Cópia de segurança" voltar={voltar} rotuloVoltar="Pacientes" />
      <div className="card">
        <h3>Salvar a lista</h3>
        <p className="muted">Baixa um arquivo com o seu perfil e os {dados.pacientes.length} pacientes. Serve para trocar de aparelho ou abrir no computador.</p>
        <button className="btn bloco" onClick={exportar}>Baixar cópia</button>
      </div>
      <div className="card">
        <h3>Abrir uma cópia</h3>
        <p className="muted">Junta os pacientes do arquivo aos que já estão aqui. Ninguém é apagado.</p>
        <input ref={arquivo} type="file" accept="application/json,.json" hidden onChange={(e) => importar(e.target.files?.[0])} />
        <button className="btn sec bloco" onClick={() => arquivo.current?.click()}>Escolher arquivo</button>
      </div>
      {aviso && <div className="card" role="status"><p>{aviso}</p></div>}
    </>
  );
}
