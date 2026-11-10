import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Medico } from "./convite";
import { aplicarVista, docParaVista, VISTA_VAZIA, type Vista } from "./familia";
import { docValido, juntarDocs, type Doc } from "./sinc";
import { api, ErroApi } from "./api";

export type { Crianca, Medida, Registro, TipoRegistro, InfoVacina, OutraVacina } from "./familia";

// Os dados da criança ficam no aparelho (localStorage). Quando a família entra
// pelo convite do consultório, o mesmo documento também é guardado no servidor
// e sincronizado (mãe, pai e médico veem a mesma caderneta).

export type Vinculo = { pacienteId: string };
export type Sincronia = "local" | "ok" | "enviando" | "sem-conexao" | "desligado";

type Guardado = { versao: 2; doc: Doc; medico: Medico | null; vinculo: Vinculo | null; sujo: boolean };

export type Dados = Vista & { medico: Medico | null; vinculo: Vinculo | null; sincronia: Sincronia };

const CHAVE = "tranquilim:v2";
const CHAVE_V1 = "tranquilim:v1";
const VAZIO_G: Guardado = { versao: 2, doc: {}, medico: null, vinculo: null, sujo: false };

/** Dados vazios (para comparação e testes). */
export const VAZIO: Dados = { ...VISTA_VAZIA, medico: null, vinculo: null, sincronia: "local" };

function migrarV1(bruto: string): Guardado {
  const v1 = JSON.parse(bruto) as Partial<Vista> & { medico?: Medico | null };
  const vista: Vista = {
    ...VISTA_VAZIA,
    crianca: v1.crianca ?? null,
    vacinasAplicadas: v1.vacinasAplicadas ?? [],
    medidas: v1.medidas ?? [],
    diario: v1.diario ?? [],
    aulasVistas: v1.aulasVistas ?? [],
  };
  return { ...VAZIO_G, doc: aplicarVista({}, VISTA_VAZIA, vista), medico: v1.medico ?? null };
}

function carregar(): Guardado {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      const g = JSON.parse(bruto) as Guardado;
      if (g?.versao === 2 && docValido(g.doc)) return { ...VAZIO_G, ...g };
    }
    const antigo = localStorage.getItem(CHAVE_V1);
    if (antigo) return migrarV1(antigo);
  } catch {
    // dados corrompidos ou armazenamento bloqueado: começa vazio
  }
  return VAZIO_G;
}

function salvar(g: Guardado): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(g));
  } catch {
    // Armazenamento cheio ou bloqueado: o app segue funcionando nesta sessão.
  }
}

export function novoId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export type Atualizar = (f: (d: Dados) => Dados) => void;

export type Controle = {
  /** Troca tudo (convite aceito, troca de criança). */
  substituir: (g: { doc: Doc; medico: Medico | null; vinculo: Vinculo | null }) => void;
  /** Apaga os dados deste aparelho e desliga do consultório. */
  zerar: () => Promise<void>;
  /** Desliga do consultório mantendo os dados no aparelho. */
  desligar: () => Promise<void>;
  sincronizarAgora: () => void;
  /** Documento bruto atual (para mandar junto ao aceitar o convite). */
  doc: () => Doc;
};

export function useDados(): [Dados, Atualizar, Controle] {
  const [g, setG] = useState<Guardado>(() => carregar());
  const [sincronia, setSincronia] = useState<Sincronia>(g.vinculo ? "ok" : "local");
  const atual = useRef(g);
  atual.current = g;

  useEffect(() => salvar(g), [g]);

  const vista = useMemo(() => docParaVista(g.doc), [g.doc]);
  const dados: Dados = useMemo(() => ({ ...vista, medico: g.medico, vinculo: g.vinculo, sincronia }), [vista, g.medico, g.vinculo, sincronia]);

  const atualizar: Atualizar = useCallback((f) => {
    setG((ag) => {
      const antes: Dados = { ...docParaVista(ag.doc), medico: ag.medico, vinculo: ag.vinculo, sincronia: "local" };
      const depois = f(antes);
      const doc = aplicarVista(ag.doc, antes, depois);
      return { ...ag, doc, medico: depois.medico, vinculo: depois.vinculo, sujo: ag.vinculo ? ag.sujo || doc !== ag.doc : false };
    });
  }, []);

  const tratarErro = useCallback((e: unknown) => {
    if (e instanceof ErroApi && e.status === 401) {
      setG((ag) => ({ ...ag, vinculo: null, sujo: false }));
      setSincronia("desligado");
    } else setSincronia("sem-conexao");
  }, []);

  const puxar = useCallback(async () => {
    if (!atual.current.vinculo) return;
    try {
      const r = await api.get<{ medico: Medico | null; doc: Doc }>("/api/familia");
      setG((ag) => ({ ...ag, doc: juntarDocs(ag.doc, r.doc), medico: r.medico ?? ag.medico }));
      setSincronia("ok");
    } catch (e) {
      tratarErro(e);
    }
  }, [tratarErro]);

  const enviar = useCallback(async () => {
    const enviado = atual.current.doc;
    if (!atual.current.vinculo) return;
    setSincronia("enviando");
    try {
      const r = await api.put<{ doc: Doc }>("/api/familia/doc", { doc: enviado });
      setG((ag) => ({ ...ag, doc: juntarDocs(ag.doc, r.doc), sujo: ag.doc !== enviado }));
      setSincronia("ok");
    } catch (e) {
      tratarErro(e);
    }
  }, [tratarErro]);

  // Envia mudanças pouco depois de feitas; sem internet, tenta de novo a cada 20 s.
  useEffect(() => {
    if (!g.vinculo || !g.sujo) return;
    const t = setTimeout(() => void enviar(), sincronia === "sem-conexao" ? 20_000 : 1200);
    return () => clearTimeout(t);
  }, [g.doc, g.sujo, g.vinculo, sincronia, enviar]);

  // Ao abrir e ao voltar para o app, busca o que o médico ou o outro responsável mudou.
  useEffect(() => {
    if (!g.vinculo) return;
    void puxar();
    const aoVoltar = () => document.visibilityState === "visible" && void puxar();
    document.addEventListener("visibilitychange", aoVoltar);
    window.addEventListener("online", aoVoltar);
    return () => {
      document.removeEventListener("visibilitychange", aoVoltar);
      window.removeEventListener("online", aoVoltar);
    };
  }, [g.vinculo, puxar]);

  const controle: Controle = useMemo(
    () => ({
      substituir: (n) => {
        setG({ versao: 2, doc: n.doc, medico: n.medico, vinculo: n.vinculo, sujo: false });
        setSincronia(n.vinculo ? "ok" : "local");
      },
      zerar: async () => {
        if (atual.current.vinculo) await api.post("/api/sair", { tipo: "familia" }).catch(() => undefined);
        try {
          localStorage.removeItem(CHAVE);
          localStorage.removeItem(CHAVE_V1);
        } catch {
          // nada a fazer
        }
        setG(VAZIO_G);
        setSincronia("local");
      },
      desligar: async () => {
        await api.post("/api/sair", { tipo: "familia" }).catch(() => undefined);
        setG((ag) => ({ ...ag, vinculo: null, medico: null, sujo: false }));
        setSincronia("local");
      },
      sincronizarAgora: () => void (atual.current.sujo ? enviar() : puxar()),
      doc: () => atual.current.doc,
    }),
    [enviar, puxar],
  );

  return [dados, atualizar, controle];
}
