import { describe, expect, it } from "vitest";
import fotos from "./fotos.json";
import { DICAS } from "./dicas";
import { creditoDe, imagemDe } from "./imagens";

describe("fotos do conteúdo", () => {
  const ids = new Set(DICAS.map((d) => d.id));
  it("cada foto pertence a uma dica existente e vem da Unsplash com autor", () => {
    for (const [id, f] of Object.entries(fotos as Record<string, { u: string; a: string; p: string }>)) {
      expect(ids.has(id), id).toBe(true);
      expect(f.u.startsWith("https://images.unsplash.com/"), id).toBe(true);
      expect(f.a.length > 0 && f.p.length > 0, id).toBe(true);
    }
  });
  it("monta endereço e crédito com link de volta", () => {
    const id = Object.keys(fotos)[0];
    expect(imagemDe(id)).toContain("&w=800");
    expect(creditoDe(id)!.perfil).toContain("utm_source=tranquilim");
    expect(imagemDe("nao-existe")).toBeNull();
  });
});
