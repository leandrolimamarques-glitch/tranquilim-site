import { hojeIso, paraData, paraIso } from "./idade";
import type { Crianca } from "./store";

// O convite leva o médico e a criança dentro do próprio link, depois do "#".
// Essa parte do endereço não é enviada a nenhum servidor: vai do WhatsApp
// do consultório direto para o celular da família.

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

type Pacote = {
  v: 1;
  m: { n: string; r: string; t?: string; w?: string; f?: string; l?: string };
  c: { n: string; d: string; s: "F" | "M" };
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

function paraBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(s: string): string {
  const b = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b + "===".slice((b.length + 3) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function limpo(s: unknown, max: number): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim().replace(/\s+/g, " ").slice(0, max);
  return t.length > 0 ? t : undefined;
}

export function dataValida(iso: unknown, hoje: string = hojeIso()): iso is string {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  if (paraIso(paraData(iso)) !== iso) return false;
  return iso <= hoje && iso >= "2010-01-01";
}

export function codificarConvite(medico: Medico, crianca: Crianca): string {
  const m: Pacote["m"] = { n: medico.nome.trim(), r: medico.registro.trim() };
  if (medico.titulo?.trim()) m.t = medico.titulo.trim();
  if (medico.whatsapp?.trim()) m.w = soDigitos(medico.whatsapp);
  if (medico.telefone?.trim()) m.f = soDigitos(medico.telefone);
  if (medico.local?.trim()) m.l = medico.local.trim();
  const p: Pacote = { v: 1, m, c: { n: crianca.nome.trim(), d: crianca.nascimento, s: crianca.sexo === "menina" ? "F" : "M" } };
  return paraBase64Url(JSON.stringify(p));
}

export function lerConvite(codigo: string, hoje: string = hojeIso()): { medico: Medico; crianca: Crianca } | null {
  try {
    const p = JSON.parse(deBase64Url(codigo.trim())) as Partial<Pacote>;
    if (p?.v !== 1 || !p.m || !p.c) return null;
    const nome = limpo(p.m.n, 80);
    const registro = limpo(p.m.r, 40);
    const nomeCrianca = limpo(p.c.n, 60);
    if (!nome || nome.length < 3 || !registro || !nomeCrianca) return null;
    if (!dataValida(p.c.d, hoje)) return null;
    if (p.c.s !== "F" && p.c.s !== "M") return null;
    const medico: Medico = { nome, registro };
    const titulo = limpo(p.m.t, 40);
    const whatsapp = limpo(p.m.w, 20);
    const telefone = limpo(p.m.f, 20);
    const local = limpo(p.m.l, 120);
    if (titulo) medico.titulo = titulo;
    if (whatsapp && telefoneBr(whatsapp)) medico.whatsapp = whatsapp;
    if (telefone && telefoneBr(telefone)) medico.telefone = telefone;
    if (local) medico.local = local;
    return { medico, crianca: { nome: nomeCrianca, nascimento: p.c.d, sexo: p.c.s === "F" ? "menina" : "menino" } };
  } catch {
    return null;
  }
}

/** Acha o código do convite num texto colado (a mensagem inteira do WhatsApp ou só o link). */
export function extrairCodigo(texto: string): string | null {
  const m = texto.match(/#\/convite\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

export function linkConvite(base: string, medico: Medico, crianca: Crianca): string {
  return `${base}#/convite/${codificarConvite(medico, crianca)}`;
}

export function mensagemConvite(medico: Medico, crianca: Crianca, responsavel: string, link: string): string {
  const ola = responsavel.trim() ? `Olá, ${responsavel.trim().split(" ")[0]}!` : "Olá!";
  return [
    `${ola} Aqui é ${medico.nome}.`,
    `Preparei o acompanhamento de ${crianca.nome} no Tranquilim: vacinas do calendário, curva de crescimento e o que fazer quando aparece febre.`,
    `É só abrir o link e tocar em Começar. Os dados ficam só no seu celular.`,
    link,
  ].join("\n\n");
}

/** Texto que identifica o médico abaixo do nome: "Pediatra · CRM-SP 000000". */
export function linhaRegistro(m: Medico): string {
  return [m.titulo, m.registro].filter(Boolean).join(" · ");
}
