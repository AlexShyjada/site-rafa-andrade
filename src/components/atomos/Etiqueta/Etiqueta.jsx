import estilos from './Etiqueta.module.css';

/** Pílula amarela usada como "olho" de cada seção. */
export default function Etiqueta({ children, tom = 'amarelo' }) {
  return <span className={`${estilos.etiqueta} ${estilos[tom]}`}>{children}</span>;
}
