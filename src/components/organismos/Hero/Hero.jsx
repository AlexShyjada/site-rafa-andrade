'use client';

import { motion } from 'framer-motion';
import Botao from '@/components/atomos/Botao/Botao';
import { hero } from '@/dados/site';
import estilos from './Hero.module.css';

const subir = {
  oculto: { opacity: 0, y: 28 },
  visivel: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }
  })
};

export default function Hero() {
  return (
    <section className={estilos.hero} id="inicio">
      <div className={estilos.grade}>
        <div className={estilos.texto}>
          <motion.h1
            className={estilos.titulo}
            variants={subir}
            initial="oculto"
            animate="visivel"
            custom={0}
          >
            {hero.titulo[0]} <span className="destaque">{hero.titulo[1]}</span>
          </motion.h1>

          <motion.p
            className={estilos.paragrafo}
            variants={subir}
            initial="oculto"
            animate="visivel"
            custom={1}
          >
            {hero.texto}
          </motion.p>

          <motion.div
            className={estilos.botoes}
            variants={subir}
            initial="oculto"
            animate="visivel"
            custom={2}
          >
            {hero.botoes.map((b) => (
              <Botao
                key={b.href}
                href={b.href}
                variante={b.variante}
                className={estilos.botao}
              >
                {b.rotulo}
              </Botao>
            ))}
          </motion.div>
        </div>

        <motion.div
          className={estilos.painel}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={estilos.retrato}
            src={hero.imagem}
            alt="Rafa Andrade, candidato a deputado estadual pela Bahia"
            width={490}
            height={687}
          />
        </motion.div>
      </div>
    </section>
  );
}
