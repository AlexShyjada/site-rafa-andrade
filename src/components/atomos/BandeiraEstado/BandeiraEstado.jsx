'use client';

import { useId } from 'react';

/**
 * Ícone do estado: quadrado arredondado dividido na diagonal, com as duas
 * cores dominantes daquele estado. É um desenho simplificado próprio, não
 * a reprodução da bandeira.
 */
export default function BandeiraEstado({ cores, tamanho = 22 }) {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width="24" height="24" rx="6" ry="6" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="24" height="24" fill={cores[0]} />
        <polygon points="24,0 24,24 0,24" fill={cores[1]} />
      </g>
    </svg>
  );
}
