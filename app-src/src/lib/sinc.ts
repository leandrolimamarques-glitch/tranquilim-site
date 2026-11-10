// Sincronização sem conflito para documentos pequenos (família e financeiro do médico).
//
// Um documento é um conjunto de coleções; cada coleção é um mapa id → item, e cada
// item carrega `em` (quando foi mudado, em ms). Juntar dois documentos é, item a
// item, ficar com o mais recente. Apagar é marcar `removido: true` (a marca também
// tem `em`), para que a remoção vença uma cópia antiga que chegue depois.
// A mesma função roda no aparelho e no servidor, então qualquer ordem de envio dá
// o mesmo resultado.

export type Item = { id: string; em: number; removido?: boolean; [campo: string]: unknown };
export type Colecao = Record<string, Item>;
export type Doc = Record<string, Colecao>;

function vencedor(a: Item | undefined, b: Item | undefined): Item | undefined {
  if (!a) return b;
  if (!b) return a;
  if (b.em !== a.em) return b.em > a.em ? b : a;
  return JSON.stringify(b) > JSON.stringify(a) ? b : a;
}

export function juntarDocs(a: Doc, b: Doc): Doc {
  const saida: Doc = {};
  for (const nome of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const ca = a[nome] ?? {};
    const cb = b[nome] ?? {};
    const col: Colecao = {};
    for (const id of new Set([...Object.keys(ca), ...Object.keys(cb)])) {
      const v = vencedor(ca[id], cb[id]);
      if (v) col[id] = v;
    }
    saida[nome] = col;
  }
  return saida;
}

/** Itens vivos de uma coleção, sem as marcas de remoção. */
export function vivos<T = Item>(doc: Doc, colecao: string): (T & Item)[] {
  return Object.values(doc[colecao] ?? {}).filter((i) => !i.removido) as (T & Item)[];
}

export function gravar(doc: Doc, colecao: string, item: { id: string; [campo: string]: unknown }, agora: number = Date.now()): Doc {
  return { ...doc, [colecao]: { ...(doc[colecao] ?? {}), [item.id]: { ...item, em: agora } as Item } };
}

export function remover(doc: Doc, colecao: string, id: string, agora: number = Date.now()): Doc {
  return { ...doc, [colecao]: { ...(doc[colecao] ?? {}), [id]: { id, em: agora, removido: true } } };
}

/** Valida a forma de um documento vindo de fora (rede, arquivo). */
export function docValido(x: unknown): x is Doc {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  for (const col of Object.values(x as Record<string, unknown>)) {
    if (!col || typeof col !== "object" || Array.isArray(col)) return false;
    for (const [id, item] of Object.entries(col as Record<string, unknown>)) {
      const i = item as Item;
      if (!i || typeof i !== "object" || i.id !== id || typeof i.em !== "number" || !Number.isFinite(i.em)) return false;
    }
  }
  return true;
}
