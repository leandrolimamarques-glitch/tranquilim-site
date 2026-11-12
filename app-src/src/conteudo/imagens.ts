// Fotos do conteúdo. Fotos reais da Unsplash, escolhidas uma a uma e conferidas quanto à
// segurança (sem mel, sal ou uva inteira no prato; bebê de barriga para baixo só acordado e
// com adulto). Pelas regras da Unsplash, a imagem é carregada do endereço deles e o autor
// aparece com link. O catálogo fica em fotos.json: id -> { u: endereço base, a: autor, p: perfil }.
import fotos from "./fotos.json";

export type Foto = { u: string; a: string; p: string };
const CATALOGO = fotos as Record<string, Foto>;
const UTM = "utm_source=tranquilim&utm_medium=referral";

export function fotoDe(id: string): Foto | null {
  return CATALOGO[id] ?? null;
}

export function imagemDe(id: string, largura = 800): string | null {
  const f = CATALOGO[id];
  return f ? `${f.u}${f.u.includes("?") ? "&" : "?"}w=${largura}&q=70&auto=format&fit=crop&ar=16:10` : null;
}

export function creditoDe(id: string): { autor: string; perfil: string; unsplash: string } | null {
  const f = CATALOGO[id];
  return f ? { autor: f.a, perfil: `https://unsplash.com/@${f.p}?${UTM}`, unsplash: `https://unsplash.com/?${UTM}` } : null;
}
