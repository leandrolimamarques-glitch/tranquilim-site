// Ditado por voz do navegador (Chrome e Safari). Usado no "Pergunte" e no prontuário.

export type Reconhecedor = {
  lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void;
  onresult: ((e: { resultIndex?: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null; onerror: ((e: { error: string }) => void) | null;
};

export function criarReconhecedor(): Reconhecedor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Reconhecedor; webkitSpeechRecognition?: new () => Reconhecedor };
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return C ? new C() : null;
}

export const temDitado = () => !!criarReconhecedor();
