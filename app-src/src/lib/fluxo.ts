// Motor dos fluxos "Vai ao PS, liga ou espera?". Os fluxos são dados
// (src/conteudo/fluxos/*.ts); este arquivo só sabe andar por eles.

export type Nivel = "ps" | "hoje" | "casa";

export type Desfecho = {
  id: string;
  nivel: Nivel;
  titulo: string;
  oQueFazer: string[];
  volteSe?: string[];
};

export type Item = { id: string; texto: string };

export type PassoSinais = {
  id: string;
  tipo: "sinais";
  pergunta: string;
  ajuda?: string;
  itens: Item[];
  /** Destino se qualquer item for marcado. */
  seAlgum: string;
  /** Destino se nenhum item for marcado. */
  seNenhum: string;
};

export type PassoEscolha = {
  id: string;
  tipo: "escolha";
  pergunta: string;
  ajuda?: string;
  opcoes: { texto: string; vai: string }[];
};

export type Passo = PassoSinais | PassoEscolha;

export type Fluxo = {
  id: string;
  titulo: string;
  resumo: string;
  inicio: string;
  passos: Record<string, Passo>;
  desfechos: Record<string, Desfecho>;
  fontes: string[];
};

export type Resposta =
  | { passo: string; tipo: "sinais"; marcados: string[] }
  | { passo: string; tipo: "escolha"; opcao: number };

export type Estado =
  | { tipo: "passo"; passo: Passo }
  | { tipo: "desfecho"; desfecho: Desfecho };

function resolver(fluxo: Fluxo, destino: string): Estado {
  if (fluxo.desfechos[destino]) return { tipo: "desfecho", desfecho: fluxo.desfechos[destino] };
  const passo = fluxo.passos[destino];
  if (!passo) throw new Error(`Destino desconhecido no fluxo ${fluxo.id}: ${destino}`);
  return { tipo: "passo", passo };
}

/** Aplica as respostas em ordem, a partir do início, e devolve onde o fluxo para. */
export function andar(fluxo: Fluxo, respostas: readonly Resposta[]): Estado {
  let estado = resolver(fluxo, fluxo.inicio);
  for (const r of respostas) {
    if (estado.tipo !== "passo" || estado.passo.id !== r.passo) {
      throw new Error(`Resposta fora de ordem no fluxo ${fluxo.id}: ${r.passo}`);
    }
    const p = estado.passo;
    if (p.tipo === "sinais" && r.tipo === "sinais") {
      estado = resolver(fluxo, r.marcados.length > 0 ? p.seAlgum : p.seNenhum);
    } else if (p.tipo === "escolha" && r.tipo === "escolha") {
      const opcao = p.opcoes[r.opcao];
      if (!opcao) throw new Error(`Opção inexistente no passo ${p.id}`);
      estado = resolver(fluxo, opcao.vai);
    } else {
      throw new Error(`Tipo de resposta errado no passo ${p.id}`);
    }
  }
  return estado;
}

/** Confere que todo destino existe e que todo passo e desfecho é alcançável. */
export function validarFluxo(fluxo: Fluxo): string[] {
  const erros: string[] = [];
  const existe = (d: string) => Boolean(fluxo.passos[d] || fluxo.desfechos[d]);
  if (!existe(fluxo.inicio)) erros.push(`início inexistente: ${fluxo.inicio}`);
  const alcancados = new Set<string>();
  const fila = [fluxo.inicio];
  while (fila.length) {
    const atual = fila.shift()!;
    if (alcancados.has(atual)) continue;
    alcancados.add(atual);
    const p = fluxo.passos[atual];
    if (!p) continue;
    const destinos = p.tipo === "sinais" ? [p.seAlgum, p.seNenhum] : p.opcoes.map((o) => o.vai);
    for (const d of destinos) {
      if (!existe(d)) erros.push(`${p.id} aponta para destino inexistente: ${d}`);
      else fila.push(d);
    }
  }
  for (const id of [...Object.keys(fluxo.passos), ...Object.keys(fluxo.desfechos)]) {
    if (!alcancados.has(id)) erros.push(`inalcançável: ${id}`);
  }
  for (const [id, p] of Object.entries(fluxo.passos)) if (p.id !== id) erros.push(`id divergente: ${id}`);
  for (const [id, d] of Object.entries(fluxo.desfechos)) if (d.id !== id) erros.push(`id divergente: ${id}`);
  return erros;
}
