'use client';

import { useState } from 'react';

/**
 * Usa o arquivo local em /public. Se ele ainda não foi baixado
 * (npm run assets), cai para a URL original hospedada no Framer,
 * assim o site nunca aparece quebrado.
 */
export default function ImagemComFallback({ src, fallback, alt = '', ...resto }) {
  const [atual, setAtual] = useState(src);

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={atual}
      alt={alt}
      onError={() => atual !== fallback && fallback && setAtual(fallback)}
      {...resto}
    />
  );
}
