import { useEffect, useState } from "react";
import type { Sexo } from "./oms";
import type { Medico } from "./convite";

// Tudo fica só neste aparelho (localStorage). Nada é enviado a servidor.

export type Medida = { id: string; data: string; pesoKg?: number; comprimentoCm?: number };
export type TipoRegistro = "mamada" | "xixi" | "coco" | "sono";
export type Registro = { id: string; tipo: TipoRegistro; quando: string };

export type Crianca = { nome: string; nascimento: string; sexo: Sexo };

export type Dados = {
  versao: 1;
  crianca: Crianca | null;
  vacinasAplicadas: string[];
  medidas: Medida[];
  diario: Registro[];
  aulasVistas: string[];
  /** Médico que convidou a família pelo painel; null se a família entrou sozinha. */
  medico: Medico | null;
};

const CHAVE = "tranquilim:v1";

export const VAZIO: Dados = { versao: 1, crianca: null, vacinasAplicadas: [], medidas: [], diario: [], aulasVistas: [], medico: null };

export function carregar(): Dados {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return VAZIO;
    const d = JSON.parse(bruto) as Partial<Dados>;
    return { ...VAZIO, ...d, versao: 1 };
  } catch {
    return VAZIO;
  }
}

function salvar(d: Dados): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(d));
  } catch {
    // Armazenamento cheio ou bloqueado: o app segue funcionando nesta sessão.
  }
}

export function novoId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export type Atualizar = (f: (d: Dados) => Dados) => void;

export function useDados(): [Dados, Atualizar] {
  const [dados, setDados] = useState<Dados>(() => carregar());
  useEffect(() => salvar(dados), [dados]);
  return [dados, (f) => setDados((atual) => f(atual))];
}

export function apagarTudo(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // nada a fazer
  }
}
