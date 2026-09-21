'use client';

import { useState } from 'react';
import { bandeira } from '@/dados/paises';
import estilos from './BandeiraPais.module.css';

/**
 * Bandeira do país como SVG local (public/bandeiras), não como emoji: o Windows não
 * desenha emoji de bandeira e mostra as duas letras do país no lugar.
 * Se a imagem falhar, cai para a sigla.
 */
export default function BandeiraPais({ iso }) {
  const [falhou, setFalhou] = useState(false);

  if (falhou) return <span className={estilos.reserva}>{iso}</span>;

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      className={estilos.bandeira}
      src={bandeira(iso)}
      alt=""
      aria-hidden="true"
      width={20}
      height={14}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
}
