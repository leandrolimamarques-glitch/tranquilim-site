// Fotos do conteúdo. Cada arquivo fica em public/img/<id>.webp e entra nesta lista
// quando existir; sem foto, a tela mostra só o texto.
export const COM_IMAGEM: ReadonlySet<string> = new Set<string>([]);

export function imagemDe(id: string): string | null {
  return COM_IMAGEM.has(id) ? `/img/${id}.webp` : null;
}
