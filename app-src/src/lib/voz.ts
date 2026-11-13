// Voz no celular: falar a dúvida (ditado) e ouvir a resposta (leitura em voz alta).
//
// Ditado: no iPhone, o reconhecimento de voz do navegador falha com frequência (sobretudo
// no app instalado na tela inicial). Lá o botão abre o teclado e orienta a usar o
// microfone do próprio teclado, que sempre funciona. No Android e no computador, usa o
// reconhecimento do navegador; se der erro, cai para o teclado também.
//
// Leitura: escolhe uma voz em português, divide o texto em frases (o Chrome corta falas
// longas) e evita o defeito do Safari de engolir a fala depois de um cancel().

import { criarReconhecedor, type Reconhecedor } from "./ditado";

export function ehIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && (navigator.maxTouchPoints ?? 0) > 1);
}

/** Usa o reconhecimento do navegador? (No iPhone, não: teclado.) */
export const ditadoPeloNavegador = () => !ehIOS() && !!criarReconhecedor();

export const MSG_TECLADO = ehIOS()
  ? "Toque no microfone 🎤 do teclado e fale. Para parar, toque de novo."
  : "Toque no microfone 🎤 do teclado e fale.";

export function mensagemDeErroDitado(erro: string): string {
  if (erro === "not-allowed" || erro === "service-not-allowed") return `O celular não liberou o microfone para o app. ${MSG_TECLADO}`;
  if (erro === "no-speech") return "Não ouvi nada. Tente de novo, mais perto do celular.";
  if (erro === "network") return `Sem internet para o ditado. ${MSG_TECLADO}`;
  return MSG_TECLADO;
}

/**
 * Começa o ditado. Devolve o reconhecedor (para parar) ou null se não der para usar o do
 * navegador; nesse caso, quem chamou foca o campo e mostra MSG_TECLADO.
 */
export function iniciarDitado(o: {
  antes: string;
  continuo?: boolean;
  aoTexto: (t: string) => void;
  aoFim: () => void;
  aoErro: (mensagem: string) => void;
}): Reconhecedor | null {
  if (!ditadoPeloNavegador()) return null;
  const r = criarReconhecedor();
  if (!r) return null;
  r.lang = "pt-BR";
  r.interimResults = true;
  r.continuous = !!o.continuo;
  const antes = o.antes ? o.antes.trimEnd() + " " : "";
  r.onresult = (e) => {
    let dito = "";
    for (let i = 0; i < e.results.length; i++) dito += e.results[i][0].transcript;
    o.aoTexto(antes + dito.trim());
  };
  r.onend = o.aoFim;
  r.onerror = (e) => {
    o.aoFim();
    if (e.error !== "aborted") o.aoErro(mensagemDeErroDitado(e.error));
  };
  try {
    r.start();
  } catch {
    return null;
  }
  return r;
}

// ---------- leitura em voz alta ----------

let vozes: SpeechSynthesisVoice[] = [];
function carregarVozes() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  vozes = window.speechSynthesis.getVoices();
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  carregarVozes();
  window.speechSynthesis.addEventListener?.("voiceschanged", carregarVozes);
}

function vozPortugues(): SpeechSynthesisVoice | undefined {
  if (!vozes.length) carregarVozes();
  return vozes.find((v) => v.lang === "pt-BR" && v.localService) ?? vozes.find((v) => v.lang === "pt-BR") ?? vozes.find((v) => v.lang?.startsWith("pt"));
}

export const temLeitura = () => typeof window !== "undefined" && "speechSynthesis" in window;

/** Frases de até ~220 caracteres. */
export function emFrases(texto: string): string[] {
  const partes = texto.replace(/\s+/g, " ").match(/[^.!?;:]+[.!?;:]*/g) ?? [texto];
  const saida: string[] = [];
  let atual = "";
  for (const p of partes) {
    if ((atual + p).length > 220 && atual) {
      saida.push(atual.trim());
      atual = p;
    } else atual += p;
  }
  if (atual.trim()) saida.push(atual.trim());
  return saida;
}

export const lendo = () => temLeitura() && (window.speechSynthesis.speaking || window.speechSynthesis.pending);

export function pararLeitura() {
  if (temLeitura() && lendo()) window.speechSynthesis.cancel();
}

/** Lê o texto em voz alta. Chame dentro do toque do usuário (exigência do iPhone). */
export function lerEmVozAlta(texto: string, aoTerminar?: () => void): boolean {
  if (!temLeitura()) return false;
  const s = window.speechSynthesis;
  if (lendo()) s.cancel();
  const voz = vozPortugues();
  const frases = emFrases(texto);
  frases.forEach((f, i) => {
    const u = new SpeechSynthesisUtterance(f);
    u.lang = "pt-BR";
    if (voz) u.voice = voz;
    u.rate = 1;
    if (i === frases.length - 1 && aoTerminar) {
      u.onend = aoTerminar;
      u.onerror = aoTerminar;
    }
    s.speak(u);
  });
  // Safari às vezes começa "pausado".
  if (s.paused) s.resume();
  return true;
}
