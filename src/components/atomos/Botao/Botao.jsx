import Icone from '../Icones/Icones';
import estilos from './Botao.module.css';

/**
 * variante: 'escuro' | 'amarelo' | 'claro'
 * icone:    'seta' | 'setaDiagonal' | nenhum
 */
export default function Botao({
  children,
  href,
  variante = 'escuro',
  icone = 'seta',
  largo = false,
  className = '',
  ...resto
}) {
  const classe = [estilos.botao, estilos[variante], largo ? estilos.largo : '', className]
    .filter(Boolean)
    .join(' ');

  const conteudo = (
    <>
      <span className={estilos.rotulo}>{children}</span>
      {icone && (
        <span className={estilos.icone}>
          <Icone nome={icone} tamanho={20} />
        </span>
      )}
    </>
  );

  if (href) {
    const externo = href.startsWith('http');
    return (
      <a
        className={classe}
        href={href}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...resto}
      >
        {conteudo}
      </a>
    );
  }

  return (
    <button className={classe} {...resto}>
      {conteudo}
    </button>
  );
}
