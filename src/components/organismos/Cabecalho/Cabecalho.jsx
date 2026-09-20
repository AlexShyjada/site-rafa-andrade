'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/atomos/Logo/Logo';
import Icone from '@/components/atomos/Icones/Icones';
import { navegacao, ctaDoacao } from '@/dados/site';
import estilos from './Cabecalho.module.css';

export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [comFundo, setComFundo] = useState(false);

  useEffect(() => {
    const aoRolar = () => setComFundo(window.scrollY > 8);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAberto]);

  return (
    <header className={`${estilos.cabecalho} ${comFundo ? estilos.solido : ''}`}>
      <div className={estilos.barra}>
        <Logo />

        <nav className={estilos.nav} aria-label="Navegação principal">
          {navegacao.map((item) => (
            <a key={item.href} className={estilos.link} href={item.href}>
              {item.rotulo}
            </a>
          ))}
        </nav>

        <a className={estilos.cta} href={ctaDoacao.href}>
          {ctaDoacao.rotulo}
        </a>

        <button
          className={estilos.botaoMenu}
          onClick={() => setMenuAberto((a) => !a)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          <Icone nome={menuAberto ? 'fechar' : 'menu'} tamanho={22} />
        </button>
      </div>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            className={estilos.menuMobile}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {navegacao.map((item) => (
              <a
                key={item.href}
                className={estilos.linkMobile}
                href={item.href}
                onClick={() => setMenuAberto(false)}
              >
                {item.rotulo}
              </a>
            ))}
            <a
              className={estilos.ctaMobile}
              href={ctaDoacao.href}
              onClick={() => setMenuAberto(false)}
            >
              {ctaDoacao.rotulo}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
