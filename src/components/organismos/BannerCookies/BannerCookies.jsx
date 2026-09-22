'use client';

import { useEffect, useState } from 'react';
import { cookies } from '@/dados/site';
import estilos from './BannerCookies.module.css';

const CHAVE = 'cookies-aceitos';

export default function BannerCookies() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CHAVE)) setVisivel(true);
  }, []);

  function aceitar() {
    localStorage.setItem(CHAVE, '1');
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div className={estilos.banner} role="region" aria-label="Aviso de cookies">
      <p className={estilos.texto}>{cookies.texto}</p>
      <button className={estilos.botao} onClick={aceitar}>
        {cookies.botao}
      </button>
    </div>
  );
}
