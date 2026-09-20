'use client';

import { useState } from 'react';
import { site } from '@/dados/site';
import estilos from './Logo.module.css';

/**
 * Wordmark da campanha.
 *
 * O arquivo original tem duas versões de cor: a clara, do cabeçalho, e a
 * cinza, do rodapé. `variante` escolhe qual sai.
 *
 * Se o arquivo faltar, cai para a versão montada em texto + CSS, para a
 * página nunca ficar sem marca.
 */
export default function Logo({ href = '#inicio', tamanho = 'md', variante = 'padrao' }) {
  const arquivo = variante === 'rodape' ? site.logoRodape : site.logo;
  const [temArquivo, setTemArquivo] = useState(Boolean(arquivo));
  const rotulo = `${site.nome} ${site.numero}`;

  return (
    <a className={`${estilos.logo} ${estilos[tamanho]}`} href={href} aria-label={rotulo}>
      {temArquivo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={estilos.arquivo}
          src={arquivo}
          alt=""
          width={109}
          height={60}
          onError={() => setTemArquivo(false)}
        />
      ) : (
        <span className={estilos.lockup} aria-hidden="true">
          <span className={estilos.etiqueta}>{site.etiquetaLogo}</span>
          <span className={estilos.nome}>
            {site.nome.split(' ')[0]}
            <span className={estilos.ponto} />
            {site.nome.split(' ').slice(1).join(' ')}
          </span>
          <span className={estilos.numero}>{site.numero}</span>
          <span className={estilos.barra} />
        </span>
      )}
    </a>
  );
}
