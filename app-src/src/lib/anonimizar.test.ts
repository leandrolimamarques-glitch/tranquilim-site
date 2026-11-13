import { describe, expect, it } from "vitest";
import { anonimizarConversas, lerConversa, mascarar, remetentesFrequentes } from "./anonimizar";

const IOS = `[13/11/26, 09:23:11] Mariana Souza: Bom dia Dr Francisco, o Gui está com febre desde ontem
segunda linha da mesma mensagem
[13/11/26, 09:25:02] Francisco Martiniano: Bom dia! Ele está mamando bem?
[13/11/26, 09:26:40] Mariana Souza: ‎imagem ocultada
[13/11/26, 09:27:00] Mariana Souza: Sim. Meu número novo é (14) 99876-5432, e-mail mari@gmail.com`;

const ANDROID = `12/11/2026 22:10 - Paulo Lima: Doutor, a Helena vomitou 3 vezes
12/11/2026 22:12 - Francisco Martiniano: Está conseguindo beber água?
12/11/2026 22:13 - Paulo Lima: <Mídia oculta>`;

describe("anonimizar conversas do WhatsApp", () => {
  it("áudio vira [áudio] (com ou sem mídia exportada); foto sai", () => {
    const comMidia = `[12/11/26, 22:10:05] Ana Paula: \u200e<anexado: 00000012-AUDIO-2026-11-12-22-10-05.opus>
[12/11/26, 22:11:00] Ana Paula: \u200e<anexado: 00000013-PHOTO-2026-11-12-22-11-00.jpg>
[12/11/26, 22:12:00] Dr. Francisco: Pode dar banho morno.
12/11/2026 22:13 - Ana Paula: PTT-20261112-WA0003.opus (arquivo anexado)
[12/11/26, 22:14:00] Ana Paula: áudio ocultado`;
    const r = anonimizarConversas([comMidia], "Dr. Francisco");
    expect(r.texto.match(/\[áudio\]/g)).toHaveLength(3);
    expect(r.texto).not.toMatch(/PHOTO|2026-11-12|opus/);
  });

  it("lê iPhone e Android, com mensagem de várias linhas", () => {
    const m = lerConversa(IOS);
    expect(m).toHaveLength(4);
    expect(m[0].texto).toContain("segunda linha");
    expect(lerConversa(ANDROID)[0]).toMatchObject({ remetente: "Paulo Lima", hora: "22:10" });
  });
  it("aponta o médico como quem aparece em mais conversas", () => {
    expect(remetentesFrequentes([IOS, ANDROID])[0]).toBe("Francisco Martiniano");
  });
  it("tira nomes, telefone, e-mail, data e mídia", () => {
    const r = anonimizarConversas([IOS, ANDROID], "Francisco Martiniano");
    expect(r.conversas).toBe(2);
    expect(r.texto).not.toMatch(/Mariana|Souza|Paulo|Lima|Helena|Gui\b|Francisco|99876|mari@|13\/11/);
    expect(r.texto).toContain("[1] sexta, 09:23 · Família:");
    expect(r.texto).toContain("Médico: Bom dia!");
    expect(r.texto).toContain("é [telefone], e-mail [e-mail]");
    expect(r.texto).not.toContain("imagem ocultada");
    expect(r.texto).not.toContain("Mídia oculta");
    expect(r.texto).toContain("febre desde ontem");
  });
  it("mantém o que não identifica", () => {
    expect(mascarar("Deu 3 vezes hoje, levo na UPA?", [])).toBe("Deu 3 vezes hoje, levo na UPA?");
  });
});
