'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { normalizar } from '@/lib/formato';
import estilos from './Seletor.module.css';

function Chevron({ aberto }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 120ms ease'
      }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#8e8e93"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Select acessível feito à mão, com busca.
 *
 * A lista vai para um portal no <body> com position: fixed, senão ela fica
 * presa dentro do cartão do formulário e é cortada pelo overflow. Como o
 * portal sai da árvore do cartão, a posição é recalculada em scroll e
 * resize — com capture: true, para pegar o scroll de qualquer contêiner
 * ancestral e não só o da janela.
 *
 * opcoes: [{ valor, rotulo, icone? }]
 */
export default function Seletor({
  placeholder,
  opcoes = [],
  valor,
  aoMudar,
  desabilitado,
  dicaDesabilitado,
  carregando,
  erro,
  temErro,
  aoValidarSaida,
  compacto,
  conteudoGatilho,
  larguraMinimaLista
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [pos, setPos] = useState(null);
  const [montado, setMontado] = useState(false);

  const raiz = useRef(null);
  const gatilho = useRef(null);
  const lista = useRef(null);

  useEffect(() => setMontado(true), []);

  function atualizarPosicao() {
    const r = gatilho.current?.getBoundingClientRect();
    if (!r) return;
    const largura = Math.max(r.width, larguraMinimaLista ?? 0);
    setPos({ top: r.bottom + 6, left: r.left, width: largura });
  }

  useEffect(() => {
    if (!aberto) return undefined;
    atualizarPosicao();
    window.addEventListener('scroll', atualizarPosicao, true);
    window.addEventListener('resize', atualizarPosicao);
    return () => {
      window.removeEventListener('scroll', atualizarPosicao, true);
      window.removeEventListener('resize', atualizarPosicao);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  useEffect(() => {
    // Só escuta clique-fora enquanto está aberto. Sem essa guarda, qualquer
    // clique na página dispararia aoValidarSaida() em selects que a pessoa
    // nunca abriu, acusando erro em "cidade" antes de qualquer interação.
    if (!aberto) return undefined;

    function aoClicarFora(e) {
      const alvo = e.target;
      const dentroGatilho = raiz.current?.contains(alvo);
      const dentroLista = lista.current?.contains(alvo);
      if (!dentroGatilho && !dentroLista) {
        setAberto(false);
        setBusca('');
        aoValidarSaida?.();
      }
    }

    function aoTeclar(e) {
      if (e.key === 'Escape') {
        setAberto(false);
        setBusca('');
      }
    }

    document.addEventListener('mousedown', aoClicarFora);
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.removeEventListener('mousedown', aoClicarFora);
      document.removeEventListener('keydown', aoTeclar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  const selecionada = opcoes.find((o) => o.valor === valor);

  const filtradas = useMemo(() => {
    if (!busca) return opcoes;
    const q = normalizar(busca);
    return opcoes.filter((o) => normalizar(o.rotulo).includes(q));
  }, [opcoes, busca]);

  const dropdown =
    montado && aberto && !desabilitado && pos
      ? createPortal(
          <div
            ref={lista}
            className={estilos.lista}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: pos.width
            }}
            role="listbox"
          >
            <input
              autoFocus
              className={estilos.busca}
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <div className={estilos.opcoes}>
              {filtradas.length === 0 && (
                <div className={`${estilos.opcao} ${estilos.vazia}`}>
                  Nenhum resultado
                </div>
              )}
              {filtradas.map((o) => (
                <div
                  key={o.valor}
                  role="option"
                  aria-selected={o.valor === valor}
                  className={`${estilos.opcao} ${o.valor === valor ? estilos.ativa : ''}`}
                  onClick={() => {
                    aoMudar(o.valor);
                    setAberto(false);
                    setBusca('');
                    aoValidarSaida?.();
                  }}
                >
                  {o.icone}
                  <span>{o.rotulo}</span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={estilos.campo} ref={raiz}>
      <button
        ref={gatilho}
        type="button"
        className={`${estilos.gatilho} ${compacto ? estilos.compacto : ''} ${
          temErro ? estilos.comErro : ''
        }`}
        disabled={desabilitado}
        aria-label={placeholder}
        aria-expanded={aberto}
        aria-haspopup="listbox"
        title={desabilitado ? dicaDesabilitado : undefined}
        onClick={() => !desabilitado && setAberto((v) => !v)}
      >
        {conteudoGatilho ?? (
          <span className={estilos.valor}>
            {selecionada?.icone}
            <span className={selecionada ? '' : estilos.placeholder}>
              {carregando
                ? 'Carregando...'
                : (selecionada?.rotulo ?? placeholder)}
            </span>
          </span>
        )}
        <Chevron aberto={aberto} />
      </button>

      {dropdown}

      {temErro && erro && <span className={estilos.erro}>{erro}</span>}
    </div>
  );
}
