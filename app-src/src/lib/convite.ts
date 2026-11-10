import { hojeIso, paraData, paraIso } from "./idade";
import type { Crianca } from "./store";

// Convite do consultório: o link leva um código que o servidor troca pelo
// acesso da família àquela criança (ver server/app.ts).

/** Endereço do painel dentro do app (o pediatra salva nos favoritos). */
export const ROTA_PAINEL = "#/pediatra";

export type Medico = {
  nome: string;
  registro: string;
  titulo?: string;
  whatsapp?: string;
  telefone?: string;
  local?: string;
};

export function soDigitos(s: string): string {
  return s.replace(/\D/g, "");
}

/** Celular ou fixo brasileiro com DDD, devolvido como 55DDNNNNNNNN(N). */
export function telefoneBr(s: string | undefined): string | null {
  if (!s) return null;
  let d = soDigitos(s);
  if (d.startsWith("0")) d = d.replace(/^0+/, "");
  if (d.length === 10 || d.length === 11) d = "55" + d;
  if ((d.length === 12 || d.length === 13) && d.startsWith("55")) return d;
  return null;
}

export function formatarTelefone(s: string | undefined): string {
  const t = telefoneBr(s);
  if (!t) return s ?? "";
  const n = t.slice(2);
  const ddd = n.slice(0, 2);
  const resto = n.slice(2);
  return resto.length === 9 ? `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}` : `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
}

export function linkWhatsApp(telefone: string | undefined, texto: string): string {
  const t = telefoneBr(telefone);
  return `https://wa.me/${t ?? ""}?text=${encodeURIComponent(texto)}`;
}

export function linkLigar(telefone: string | undefined): string | null {
  const t = telefoneBr(telefone);
  return t ? `tel:+${t}` : null;
}

export function dataValida(iso: unknown, hoje: string = hojeIso()): iso is string {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  if (paraIso(paraData(iso)) !== iso) return false;
  return iso <= hoje && iso >= "2010-01-01";
}

/** Acha o código do convite num texto colado (a mensagem inteira do WhatsApp ou só o link). */
export function extrairCodigo(texto: string): string | null {
  const m = texto.match(/#\/convite\/([A-Za-z0-9_-]{16,})/);
  return m ? m[1] : null;
}

export function linkConvite(base: string, token: string): string {
  return `${base}#/convite/${token}`;
}

export function mensagemConvite(medico: Medico, crianca: Crianca, responsavel: string, link: string): string {
  const ola = responsavel.trim() ? `Olá, ${responsavel.trim().split(" ")[0]}!` : "Olá!";
  return [
    `${ola} Aqui é ${medico.nome}.`,
    `Preparei o acompanhamento de ${crianca.nome} no Tranquilim: carteira de vacinação, curva de crescimento e o que fazer quando aparece febre ou outro susto.`,
    `É só abrir o link e tocar em Começar. O que você registrar lá eu também acompanho daqui.`,
    link,
  ].join("\n\n");
}

/** Texto que identifica o médico abaixo do nome: "Pediatra · CRM-SP 000000". */
export function linhaRegistro(m: Medico): string {
  return [m.titulo, m.registro].filter(Boolean).join(" · ");
}
