import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { dataBr } from "../lib/idade";
import type { Atualizar, Dados } from "../lib/store";
import { novoId } from "../lib/store";
import { CALENDARIO } from "../lib/vacinas";

type Registro = { calendarioId: string; nomeNaCarteira: string; data: string; confianca: "alta" | "media" | "baixa"; nota: string };
type Leitura = { legivel: boolean; observacao: string; registros: Registro[] };
type ItemCarteira = { id: string; enviadoPor: string; mime: string; leitura: Leitura | null; erro: string | null; criadoEm: string };

const ROTULO_CONFIANCA = { alta: "leitura clara", media: "conferir", baixa: "duvidosa" } as const;
const CHIP_CONFIANCA = { alta: "aplicada", media: "pendente", baixa: "" } as const;
const NOME = new Map(CALENDARIO.map((v) => [v.id, `${v.nome} · ${v.dose}`]));

/** Reduz a foto para no máximo 2000 px (JPEG), para subir rápido no 4G. */
async function prepararArquivo(f: File): Promise<Blob> {
  if (f.type === "application/pdf") return f;
  try {
    const img = await createImageBitmap(f);
    const escala = Math.min(1, 2000 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((ok, falha) => canvas.toBlob((b) => (b ? ok(b) : falha(new Error("foto"))), "image/jpeg", 0.85));
  } catch {
    return f;
  }
}

export function Carteira({ dados, atualizar, pacienteId }: { dados: Dados; atualizar: Atualizar; pacienteId?: string }) {
  const sufixo = pacienteId ? `?paciente=${pacienteId}` : "";
  const [itens, setItens] = useState<ItemCarteira[] | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const entrada = useRef<HTMLInputElement>(null);

  const carregar = useCallback(async () => {
    try {
      const r = await api.get<{ carteiras: ItemCarteira[] }>(`/api/carteira${sufixo}`);
      setItens(r.carteiras);
      return r.carteiras;
    } catch (e) {
      setErro((e as Error).message);
      return null;
    }
  }, [sufixo]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // Enquanto houver leitura em andamento, confere a cada 3 s.
  const lendo = itens?.some((i) => !i.leitura && !i.erro);
  useEffect(() => {
    if (!lendo) return;
    const t = setInterval(() => void carregar(), 3000);
    return () => clearInterval(t);
  }, [lendo, carregar]);

  const enviar = async (f: File | undefined) => {
    if (!f) return;
    setErro("");
    setEnviando(true);
    try {
      const arquivo = await prepararArquivo(f);
      if (arquivo.size > 12 * 1024 * 1024) throw new Error("Arquivo grande demais (máximo 12 MB).");
      await api.enviarArquivo(`/api/carteira${sufixo}`, arquivo);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
      if (entrada.current) entrada.current.value = "";
    }
  };

  return (
    <div className="card">
      <h3>Carteira de vacinação</h3>
      <p className="muted">Tire foto das páginas de vacina (ou envie o PDF). O app lê, você confere e as vacinas entram na lista abaixo.</p>
      <input ref={entrada} type="file" accept="image/*,application/pdf" hidden onChange={(e) => void enviar(e.target.files?.[0])} />
      <button className="btn bloco" disabled={enviando} onClick={() => entrada.current?.click()}>{enviando ? "Enviando…" : "Enviar foto ou PDF da carteira"}</button>
      {erro && <p className="pequeno" style={{ color: "var(--ps)" }}>{erro}</p>}
      {itens?.map((i) => <ItemLido key={i.id} item={i} dados={dados} atualizar={atualizar} sufixo={sufixo} aoApagar={carregar} />)}
    </div>
  );
}

function ItemLido({ item, dados, atualizar, sufixo, aoApagar }: { item: ItemCarteira; dados: Dados; atualizar: Atualizar; sufixo: string; aoApagar: () => void }) {
  const urlArquivo = `/api/carteira/${item.id}/arquivo${sufixo}`;
  const aplicadas = new Set(dados.vacinasAplicadas);
  const registros = item.leitura?.registros ?? [];
  const doCalendario = registros.filter((r) => r.calendarioId !== "outra" && !aplicadas.has(r.calendarioId));
  const outras = registros.filter((r) => r.calendarioId === "outra" && !dados.outrasVacinas.some((o) => o.nome === r.nomeNaCarteira && (o.data ?? "") === r.data));
  const chave = (r: Registro, _i?: number) => `${r.calendarioId}|${r.data}|${r.nomeNaCarteira}`;
  const [marcados, setMarcados] = useState<Set<string>>(new Set());
  // Quando a leitura chega, já vem marcado o que foi lido com clareza; as duvidosas, não.
  const temLeitura = !!item.leitura;
  useEffect(() => {
    if (temLeitura) setMarcados(new Set([...doCalendario, ...outras].filter((r) => r.confianca !== "baixa").map((r) => chave(r))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temLeitura]);
  const [apagando, setApagando] = useState(false);
  const todos = [...doCalendario, ...outras];

  const confirmar = () => {
    const escolhidos = todos.filter((r, i) => marcados.has(chave(r, i)));
    atualizar((d) => {
      const vacinaInfo = { ...d.vacinaInfo };
      const ids = new Set(d.vacinasAplicadas);
      const novasOutras = [...d.outrasVacinas];
      for (const r of escolhidos) {
        if (r.calendarioId === "outra") novasOutras.push({ id: novoId(), nome: r.nomeNaCarteira, data: r.data || undefined, origem: "carteira" });
        else {
          ids.add(r.calendarioId);
          vacinaInfo[r.calendarioId] = { ...(r.data ? { data: r.data } : {}), origem: "carteira" };
        }
      }
      return { ...d, vacinasAplicadas: [...ids], vacinaInfo, outrasVacinas: novasOutras };
    });
  };

  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="linha">
        <span className="muted pequeno">Enviada em {dataBr(item.criadoEm.slice(0, 10))}{item.enviadoPor === "medico" ? " pelo consultório" : ""}</span>
        <a className="pequeno" href={urlArquivo} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", fontWeight: 700 }}>Ver {item.mime === "application/pdf" ? "PDF" : "foto"}</a>
      </div>
      {!item.leitura && !item.erro && <p className="muted" role="status">Lendo a carteira… pode levar até um minuto.</p>}
      {item.erro && <p className="pequeno" style={{ color: "var(--ps)" }}>Não deu para ler: {item.erro} Marque as vacinas à mão na lista abaixo.</p>}
      {item.leitura && (
        <>
          {item.leitura.observacao && <p className="muted pequeno">{item.leitura.observacao}</p>}
          {todos.length === 0 ? (
            <p className="muted">Tudo o que foi lido nesta foto já está na caderneta.</p>
          ) : (
            <>
              <p className="pequeno" style={{ fontWeight: 700 }}>Confira cada vacina com a foto antes de confirmar. As duvidosas vêm desmarcadas.</p>
              <div className="tabela-vacina">
                {todos.map((r, i) => (
                  <label key={chave(r, i)}>
                    <input
                      type="checkbox"
                      checked={marcados.has(chave(r, i))}
                      onChange={() => setMarcados((m) => {
                        const n = new Set(m);
                        if (n.has(chave(r, i))) n.delete(chave(r, i));
                        else n.add(chave(r, i));
                        return n;
                      })}
                    />
                    <span>
                      <b style={{ fontWeight: 600 }}>{r.calendarioId === "outra" ? r.nomeNaCarteira : NOME.get(r.calendarioId)}</b>
                      <span className="muted pequeno" style={{ display: "block" }}>
                        {r.data ? dataBr(r.data) : "sem data legível"}
                        {r.calendarioId !== "outra" && ` · na carteira: ${r.nomeNaCarteira}`}
                        {r.nota && ` · ${r.nota}`}
                      </span>
                    </span>
                    <span className={`chip ${CHIP_CONFIANCA[r.confianca]}`}>{ROTULO_CONFIANCA[r.confianca]}</span>
                  </label>
                ))}
              </div>
              <button className="btn bloco" disabled={marcados.size === 0} onClick={confirmar}>Confirmar {marcados.size} {marcados.size === 1 ? "vacina" : "vacinas"}</button>
            </>
          )}
        </>
      )}
      {!apagando ? (
        <button className="voltar pequeno" onClick={() => setApagando(true)}>Apagar este arquivo</button>
      ) : (
        <div className="grade2">
          <button className="btn sec" onClick={() => setApagando(false)}>Cancelar</button>
          <button className="btn ps" onClick={() => void api.del(`/api/carteira/${item.id}${sufixo}`).then(aoApagar)}>Apagar</button>
        </div>
      )}
    </div>
  );
}
