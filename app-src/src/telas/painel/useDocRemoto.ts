import { useCallback, useEffect, useRef, useState } from "react";
import { api, ErroApi } from "../../lib/api";
import { docValido, juntarDocs, type Doc } from "../../lib/sinc";

export type EstadoDoc = "carregando" | "ok" | "enviando" | "sem-conexao" | "sem-acesso";

/**
 * Documento guardado no servidor (financeiro do médico, caderneta de um paciente),
 * com cópia no aparelho quando `chaveLocal` é dada. Mudanças vão ao servidor pouco
 * depois de feitas e se juntam ao que estiver lá (sinc.ts).
 */
export function useDocRemoto(url: string, chaveLocal?: string) {
  const [doc, setDoc] = useState<Doc>(() => {
    if (!chaveLocal) return {};
    try {
      const d = JSON.parse(localStorage.getItem(chaveLocal) ?? "{}");
      return docValido(d) ? d : {};
    } catch {
      return {};
    }
  });
  const [sujo, setSujo] = useState(false);
  const [estado, setEstado] = useState<EstadoDoc>("carregando");
  const atual = useRef(doc);
  atual.current = doc;

  useEffect(() => {
    if (!chaveLocal) return;
    try {
      localStorage.setItem(chaveLocal, JSON.stringify(doc));
    } catch {
      // sem espaço: segue só com o servidor
    }
  }, [doc, chaveLocal]);

  const falhou = (e: unknown) => setEstado(e instanceof ErroApi && (e.status === 401 || e.status === 404) ? "sem-acesso" : "sem-conexao");

  const puxar = useCallback(async () => {
    try {
      const r = await api.get<{ doc: Doc }>(url);
      setDoc((d) => juntarDocs(d, r.doc));
      setEstado("ok");
    } catch (e) {
      falhou(e);
    }
  }, [url]);

  useEffect(() => {
    void puxar();
    const aoVoltar = () => document.visibilityState === "visible" && void puxar();
    document.addEventListener("visibilitychange", aoVoltar);
    return () => document.removeEventListener("visibilitychange", aoVoltar);
  }, [puxar]);

  useEffect(() => {
    if (!sujo) return;
    const t = setTimeout(async () => {
      const enviado = atual.current;
      setEstado("enviando");
      try {
        const r = await api.put<{ doc: Doc }>(url, { doc: enviado });
        setDoc((d) => juntarDocs(d, r.doc));
        setSujo(atual.current !== enviado);
        setEstado("ok");
      } catch (e) {
        falhou(e);
      }
    }, estado === "sem-conexao" ? 20_000 : 800);
    return () => clearTimeout(t);
  }, [doc, sujo, url, estado]);

  const mudar = useCallback((f: (d: Doc) => Doc) => {
    setDoc((d) => {
      const n = f(d);
      if (n !== d) setSujo(true);
      return n;
    });
  }, []);

  return { doc, mudar, estado, recarregar: puxar };
}
