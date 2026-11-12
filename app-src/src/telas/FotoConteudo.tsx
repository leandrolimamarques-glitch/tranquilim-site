import { creditoDe, imagemDe } from "../conteudo/imagens";

/** Foto grande com crédito (obrigatório pela Unsplash). */
export function FotoConteudo({ id }: { id: string }) {
  const src = imagemDe(id);
  const c = creditoDe(id);
  if (!src || !c) return null;
  return (
    <figure style={{ margin: "0 0 12px" }}>
      <img className="foto" src={src} alt="" loading="lazy" />
      <figcaption className="muted" style={{ fontSize: 13, marginTop: 4 }}>
        Foto: <a href={c.perfil} target="_blank" rel="noopener noreferrer">{c.autor}</a> / <a href={c.unsplash} target="_blank" rel="noopener noreferrer">Unsplash</a>
      </figcaption>
    </figure>
  );
}

/** Miniatura na lista (o crédito aparece na dica aberta). */
export function FotoMini({ id }: { id: string }) {
  const src = imagemDe(id, 480);
  return src ? <img className="foto-mini" src={src} alt="" loading="lazy" /> : null;
}
