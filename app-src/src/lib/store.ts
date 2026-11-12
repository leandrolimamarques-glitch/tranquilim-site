import { useCallback, useEffect, useMemo, useState } from "react";
import type { Medico } from "./convite";
import { aplicarVista, docParaVista, type Crianca, type Vista } from "./familia";
import { api, ErroApi } from "./api";
import { useDocRemoto, type EstadoDoc } from "./useDocRemoto";

export type { Crianca, Medida, Registro, TipoRegistro, InfoVacina, OutraVacina } from "./familia";

// Tudo fica na conta (servidor), com cópia no aparelho para abrir sem internet.

export type Pediatra = Medico & { id: string };
export type ContaInfo = {
  id: string;
  email: string;
  nome: string;
  dono: boolean;
  pediatra: boolean;
  registro: string | null;
  titulo: string | null;
  whatsapp: string | null;
  telefone: string | null;
  local: string | null;
  emailVerificado?: boolean;
};
export type CriancaDaConta = { id: string; crianca: Crianca; pediatras: Pediatra[] };
export type Pedido = { id: string; pediatra: Pediatra; criadoEm: string };
export type Sessao = { conta: ContaInfo; criancas: CriancaDaConta[]; pedidos: Pedido[]; emailLigado?: boolean; termos?: { versao: string; aceito: boolean } };

const CHAVE_SESSAO = "tq:sessao";

function lerSessaoGuardada(): Sessao | undefined {
  try {
    const t = localStorage.getItem(CHAVE_SESSAO);
    return t ? (JSON.parse(t) as Sessao) : undefined;
  } catch {
    return undefined;
  }
}

function guardarSessao(s: Sessao | null) {
  try {
    if (s) localStorage.setItem(CHAVE_SESSAO, JSON.stringify(s));
    else localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    // sem armazenamento: segue só em memória
  }
}

/** Apaga a cópia local da conta (ao sair ou excluir a conta). */
export function esquecerSessaoLocal() {
  guardarSessao(null);
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith("tq:")) localStorage.removeItem(k);
  } catch {
    // nada
  }
}

/**
 * null = fora da conta; undefined = carregando (e sem cópia no aparelho).
 * Abre na hora com a última cópia guardada e atualiza pelo servidor em seguida; sem internet,
 * segue com a cópia (o terceiro valor diz que está sem conexão).
 */
export function useSessao(): [Sessao | null | undefined, () => Promise<void>, string] {
  const [s, setS] = useState<Sessao | null | undefined>(lerSessaoGuardada);
  const [erro, setErro] = useState("");
  const carregar = useCallback(async () => {
    try {
      const nova = await api.get<Sessao>("/api/conta");
      guardarSessao(nova);
      setS(nova);
      setErro("");
    } catch (e) {
      if (e instanceof ErroApi && e.status === 401) {
        guardarSessao(null);
        setS(null);
      } else setErro((e as Error).message);
    }
  }, []);
  useEffect(() => {
    void carregar();
  }, [carregar]);
  return [s, carregar, erro];
}

export type Sincronia = EstadoDoc;

export type Dados = Vista & {
  /** Id da criança na conta. */
  criancaId: string;
  /** Pediatra que acompanha (o primeiro, se houver mais de um). */
  medico: Pediatra | null;
  /** Há pediatra acompanhando. */
  vinculo: { pacienteId: string } | null;
  sincronia: Sincronia;
};

export type Atualizar = (f: (d: Dados) => Dados) => void;

export function novoId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Dados de uma criança como as telas usam (listas), sincronizados com o servidor. */
export function useCrianca(c: CriancaDaConta): [Dados, Atualizar] {
  const remoto = useDocRemoto(`/api/criancas/${c.id}/doc`, `tq:doc:${c.id}`);
  const medico = c.pediatras[0] ?? null;
  const montar = useCallback(
    (doc: Parameters<typeof docParaVista>[0], estado: EstadoDoc): Dados => {
      const v = docParaVista(doc);
      return { ...v, crianca: v.crianca ?? c.crianca, criancaId: c.id, medico, vinculo: medico ? { pacienteId: c.id } : null, sincronia: estado };
    },
    [c, medico],
  );
  const dados = useMemo(() => montar(remoto.doc, remoto.estado), [montar, remoto.doc, remoto.estado]);
  const atualizar: Atualizar = useCallback(
    (f) => remoto.mudar((doc) => {
      const antes = montar(doc, "ok");
      return aplicarVista(doc, antes, f(antes));
    }),
    [remoto, montar],
  );
  return [dados, atualizar];
}
