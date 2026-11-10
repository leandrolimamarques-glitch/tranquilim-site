import { useEffect, useState } from "react";
import { dataValida, type Medico } from "./convite";
import type { Crianca } from "./store";

// Painel do pediatra: a lista de pacientes fica só no aparelho do médico.
// A cópia de segurança é um arquivo que ele mesmo guarda.

export type PacientePainel = {
  id: string;
  crianca: Crianca;
  responsavel: string;
  whatsapp: string;
  criadoEm: string;
  conviteEm?: string;
};

export type DadosPainel = { versao: 1; medico: Medico | null; pacientes: PacientePainel[] };

const CHAVE = "tranquilim:painel:v1";

export const PAINEL_VAZIO: DadosPainel = { versao: 1, medico: null, pacientes: [] };

export function lerCopia(texto: string): DadosPainel | null {
  try {
    const d = JSON.parse(texto) as Partial<DadosPainel>;
    if (d?.versao !== 1 || !Array.isArray(d.pacientes)) return null;
    const pacientes = d.pacientes.filter(
      (p): p is PacientePainel =>
        !!p &&
        typeof p.id === "string" &&
        typeof p.crianca?.nome === "string" &&
        dataValida(p.crianca?.nascimento) &&
        (p.crianca?.sexo === "menina" || p.crianca?.sexo === "menino"),
    );
    const medico = d.medico && typeof d.medico.nome === "string" && typeof d.medico.registro === "string" ? d.medico : null;
    return {
      versao: 1,
      medico,
      pacientes: pacientes.map((p) => ({ ...p, responsavel: p.responsavel ?? "", whatsapp: p.whatsapp ?? "", criadoEm: p.criadoEm ?? "" })),
    };
  } catch {
    return null;
  }
}

/** Junta a cópia importada à lista atual; o mesmo paciente (mesmo id) fica com a versão importada. */
export function juntar(atual: DadosPainel, importado: DadosPainel): DadosPainel {
  const porId = new Map(atual.pacientes.map((p) => [p.id, p]));
  importado.pacientes.forEach((p) => porId.set(p.id, p));
  return { versao: 1, medico: atual.medico ?? importado.medico, pacientes: [...porId.values()] };
}

export function carregarPainel(): DadosPainel {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? lerCopia(bruto) ?? PAINEL_VAZIO : PAINEL_VAZIO;
  } catch {
    return PAINEL_VAZIO;
  }
}

export type AtualizarPainel = (f: (d: DadosPainel) => DadosPainel) => void;

export function usePainel(): [DadosPainel, AtualizarPainel] {
  const [dados, setDados] = useState<DadosPainel>(() => carregarPainel());
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch {
      // Armazenamento bloqueado: segue nesta sessão.
    }
  }, [dados]);
  return [dados, (f) => setDados((atual) => f(atual))];
}
