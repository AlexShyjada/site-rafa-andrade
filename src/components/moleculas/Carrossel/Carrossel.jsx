'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Icone from '@/components/atomos/Icones/Icones';
import estilos from './Carrossel.module.css';

/**
 * Lista que vira carrossel no mobile (<= 809px) e continua sendo a lista
 * normal (a grade definida por `className`) nas telas maiores.
 *
 * No mobile é um trilho horizontal com scroll-snap nativo — arrastar ou
 * deslizar funciona sem JavaScript —, com setas, pontos e o próximo item
 * aparecendo na borda direita, como no Slideshow do Framer. Os filhos
 * devem ser <li>.
 */
export default function Carrossel({ children, className = '', rotulo }) {
  const trilho = useRef(null);
  const semMovimento = useReducedMotion();
  const total = Children.count(children);
  const [ativo, setAtivo] = useState(0);
  const [noFim, setNoFim] = useState(false);

  const atualizar = useCallback(() => {
    const el = trilho.current;
    if (!el) return;
    const itens = Array.from(el.children);
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setNoFim(fim);
    if (fim) {
      setAtivo(itens.length - 1);
      return;
    }
    // o ativo é o item cujo início está mais perto do início do trilho
    const base = el.getBoundingClientRect().left;
    let melhor = 0;
    let menor = Infinity;
    itens.forEach((item, i) => {
      const dist = Math.abs(item.getBoundingClientRect().left - base);
      if (dist < menor) {
        menor = dist;
        melhor = i;
      }
    });
    setAtivo(melhor);
  }, []);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return undefined;
    el.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
    return () => {
      el.removeEventListener('scroll', atualizar);
      window.removeEventListener('resize', atualizar);
    };
  }, [atualizar]);

  function irPara(indice) {
    const el = trilho.current;
    const alvo = el?.children[Math.max(0, Math.min(indice, total - 1))];
    if (!alvo) return;
    el.scrollTo({
      left: alvo.offsetLeft,
      behavior: semMovimento ? 'auto' : 'smooth'
    });
  }

  return (
    <div
      className={estilos.raiz}
      role="region"
      aria-roledescription="carrossel"
      aria-label={rotulo}
    >
      <ul
        ref={trilho}
        className={`${estilos.trilho} ${className}`}
        data-fim={noFim ? '' : undefined}
      >
        {children}
      </ul>

      <div className={estilos.controles}>
        <button
          type="button"
          className={`${estilos.seta} ${estilos.anterior}`}
          onClick={() => irPara(ativo - 1)}
          disabled={ativo === 0}
          aria-label="Anterior"
        >
          <Icone nome="chevronEsquerda" tamanho={22} />
        </button>
        <button
          type="button"
          className={`${estilos.seta} ${estilos.proxima}`}
          onClick={() => irPara(ativo + 1)}
          disabled={ativo >= total - 1}
          aria-label="Próximo"
        >
          <Icone nome="chevronDireita" tamanho={22} />
        </button>

        <div className={estilos.pontos}>
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              className={estilos.ponto}
              onClick={() => irPara(i)}
              aria-label={`Ir para o item ${i + 1} de ${total}`}
              aria-current={i === ativo ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
