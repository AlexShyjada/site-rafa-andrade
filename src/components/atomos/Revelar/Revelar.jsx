'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Entrada suave quando o elemento chega na viewport.
 * Reproduz o "appear on scroll" do Framer: sobe 24px e aparece,
 * uma vez só, com atraso opcional para escalonar listas.
 */
export default function Revelar({
  children,
  atraso = 0,
  deslocamento = 24,
  duracao = 0.6,
  como = 'div',
  className,
  ...resto
}) {
  const semMovimento = useReducedMotion();
  const Componente = motion[como] ?? motion.div;

  return (
    <Componente
      className={className}
      initial={semMovimento ? { opacity: 0 } : { opacity: 0, y: deslocamento }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: '0px 0px -10% 0px' }}
      transition={{ duration: duracao, delay: atraso, ease: [0.16, 1, 0.3, 1] }}
      {...resto}
    >
      {children}
    </Componente>
  );
}
