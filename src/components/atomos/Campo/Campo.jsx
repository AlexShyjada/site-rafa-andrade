'use client';

import estilos from './Campo.module.css';

export default function Campo({
  valor,
  aoMudar,
  aoSair,
  invalido,
  erro,
  dica,
  placeholder,
  tipo = 'text',
  inputMode,
  autoComplete,
  maxLength
}) {
  return (
    <div className={estilos.campo}>
      <input
        className={`${estilos.input} ${invalido ? estilos.comErro : ''}`}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-invalid={invalido || undefined}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(e) => aoMudar(e.target.value)}
        onBlur={aoSair}
      />
      {invalido && erro && <span className={estilos.erro}>{erro}</span>}
      {!invalido && dica && <span className={estilos.dica}>{dica}</span>}
    </div>
  );
}
