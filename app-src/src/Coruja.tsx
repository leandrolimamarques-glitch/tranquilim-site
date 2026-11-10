type Props = { clara?: boolean; titulo?: string };

/** Logo: coruja adulta e filhote de olhos fechados, com a lua. */
export function Coruja({ clara = false, titulo }: Props) {
  const corpo = clara ? "#F6EFE4" : "#1E2A47";
  const olho = clara ? "#F6EFE4" : "#FFFFFF";
  const contorno = clara ? "#1E2A47" : "#F6EFE4";
  return (
    <svg viewBox="0 0 120 120" role={titulo ? "img" : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true}>
      <path d="M24 46 C22 32 25 22 29 12 L44 27 C52 24 62 24 70 27 L85 12 C89 22 92 32 90 46 C96 62 94 84 80 98 C70 108 44 108 34 98 C20 84 18 62 24 46 Z" fill={corpo} />
      <circle cx="44" cy="52" r="13" fill={olho} />
      <circle cx="70" cy="52" r="13" fill={olho} />
      <path d="M36.5 52 Q44 59.5 51.5 52" fill="none" stroke="#1E2A47" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M62.5 52 Q70 59.5 77.5 52" fill="none" stroke="#1E2A47" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M53.5 64 L60.5 64 L57 71 Z" fill="#F2A93B" />
      <path d="M73 82 C72 76 74 72 76 68 L82 74 C85 73 89 73 92 74 L98 68 C100 72 102 76 101 82 C104 90 102 99 95 104 C90 108 83 108 78 104 C71 99 70 90 73 82 Z" fill="#F2A93B" stroke={contorno} strokeWidth="3.5" paintOrder="stroke" />
      <circle cx="82" cy="86" r="5" fill="#fff" />
      <circle cx="92" cy="86" r="5" fill="#fff" />
      <path d="M79 86 Q82 89.5 85 86" fill="none" stroke="#1E2A47" strokeWidth="2" strokeLinecap="round" />
      <path d="M89 86 Q92 89.5 95 86" fill="none" stroke="#1E2A47" strokeWidth="2" strokeLinecap="round" />
      <path d="M85.5 92 L88.5 92 L87 95 Z" fill="#1E2A47" />
      <path d="M104 14 A11 11 0 1 0 112 30 A8.5 8.5 0 1 1 104 14 Z" fill="#F2A93B" />
    </svg>
  );
}
