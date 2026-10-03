'use client';

import { useState } from 'react';
import Etiqueta from '@/components/atomos/Etiqueta/Etiqueta';
import Icone from '@/components/atomos/Icones/Icones';
import Revelar from '@/components/atomos/Revelar/Revelar';
import Botao from '@/components/atomos/Botao/Botao';
import Carrossel from '@/components/moleculas/Carrossel/Carrossel';
import LeitorPropostas from '@/components/organismos/LeitorPropostas/LeitorPropostas';
import { propostas } from '@/dados/site';
import estilos from './Propostas.module.css';

export default function Propostas() {
  const [aberto, setAberto] = useState(null);

  return (
    <section className={estilos.secao} id="propostas">
      <div className="container">
        <header className={estilos.cabecalho}>
          <Revelar como="div">
            <Etiqueta>{propostas.etiqueta}</Etiqueta>
          </Revelar>

          <Revelar como="h2" atraso={0.08} className={estilos.titulo}>
            {propostas.titulo[0]}
            <br />
            <span className="destaque">{propostas.titulo[1]}</span>
          </Revelar>
        </header>

        <Carrossel className={estilos.grade} rotulo={propostas.etiqueta}>
          {propostas.itens.map((item, i) => (
            <Revelar
              como="li"
              key={item.titulo}
              atraso={0.05 * (i % 4)}
              className={estilos.card}
            >
              <span className={estilos.icone}>
                <Icone nome={item.icone} tamanho={28} />
              </span>
              <h3 className={estilos.cardTitulo}>{item.titulo}</h3>
              <p className={estilos.cardTexto}>{item.texto}</p>
              <div className={estilos.cardRodape}>
                <span className={estilos.cardContagem}>
                  {item.indice.length} propostas · {item.paginas} páginas
                </span>
                <Botao
                  type="button"
                  variante="claro"
                  className={estilos.botao}
                  onClick={() => setAberto(item)}
                  aria-haspopup="dialog"
                  aria-label={`${propostas.botao}: ${item.titulo}`}
                >
                  {propostas.botao}
                </Botao>
              </div>
            </Revelar>
          ))}
        </Carrossel>
      </div>

      <LeitorPropostas item={aberto} onFechar={() => setAberto(null)} />
    </section>
  );
}
