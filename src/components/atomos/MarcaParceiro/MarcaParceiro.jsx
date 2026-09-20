'use client';

import { useEffect, useState } from 'react';
import estilos from './MarcaParceiro.module.css';

/**
 * Marca da plataforma de doação.
 *
 * Usa o arquivo oficial quando ele existe em /public/imagens. Como é
 * marca de terceiro, o arquivo certo é o do brand kit da própria
 * plataforma, não uma versão redesenhada. Sem o arquivo, mostra o nome
 * em texto — referência honesta que nunca quebra o layout.
 */
export default function MarcaParceiro({ nome, arquivo }) {
  const [temArquivo, setTemArquivo] = useState(false);

  useEffect(() => {
    if (!arquivo) return undefined;
    let vivo = true;
    const teste = new Image();
    teste.onload = () => vivo && setTemArquivo(true);
    teste.src = arquivo;
    return () => {
      vivo = false;
    };
  }, [arquivo]);

  if (!temArquivo) {
    return <span className={estilos.texto}>{nome}</span>;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={estilos.marca} src={arquivo} alt={nome} />;
}
