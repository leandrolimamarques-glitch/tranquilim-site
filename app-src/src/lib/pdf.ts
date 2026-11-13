// Abre, compartilha (WhatsApp, e-mail, imprimir, salvar) ou baixa um PDF do servidor.

async function baixarBlob(url: string): Promise<Blob> {
  const r = await fetch(url, { credentials: "same-origin" });
  if (!r.ok) throw new Error(r.status === 401 ? "Entre na sua conta de novo." : "Não consegui gerar o PDF. Tente de novo.");
  return r.blob();
}

/** No celular abre a folha de compartilhar (tem Imprimir, WhatsApp, Salvar em Arquivos); no computador, abre o PDF. */
export async function compartilharPdf(url: string, nome: string): Promise<void> {
  await compartilharArquivo(await baixarBlob(url), nome);
}

/** Compartilha um arquivo gerado no aparelho; sem suporte, abre ou baixa. */
export async function compartilharArquivo(blob: Blob, nome: string): Promise<void> {
  const arquivo = new File([blob], nome, { type: blob.type || "application/octet-stream" });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.canShare?.({ files: [arquivo] }) && nav.share) {
    try {
      await nav.share({ files: [arquivo], title: nome });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  const link = URL.createObjectURL(blob);
  const aberto = window.open(link, "_blank");
  if (!aberto) {
    const a = document.createElement("a");
    a.href = link;
    a.download = nome;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(link), 60_000);
}
