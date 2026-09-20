'use client';

import Seletor from '@/components/moleculas/Seletor/Seletor';
import BandeiraPais from '@/components/atomos/BandeiraPais/BandeiraPais';
import { paises, acharPais } from '@/dados/paises';
import estilos from './SeletorPais.module.css';

/**
 * Seletor de DDI. O gatilho mostra só bandeira + sigla + DDI, mas a lista
 * abre com largura de leitura para caber o nome do país inteiro.
 */
export default function SeletorPais({ valor, aoMudar }) {
  const atual = acharPais(valor);

  const opcoes = paises.map((p) => ({
    valor: p.iso,
    rotulo: `${p.nome} +${p.ddi}`,
    icone: <BandeiraPais iso={p.iso} />
  }));

  return (
    <Seletor
      compacto
      placeholder="País"
      opcoes={opcoes}
      valor={atual.iso}
      aoMudar={aoMudar}
      larguraMinimaLista={280}
      conteudoGatilho={
        <span className={estilos.gatilho}>
          <BandeiraPais iso={atual.iso} />
          <span className={estilos.iso}>{atual.iso}</span>
          <span className={estilos.ddi}>+{atual.ddi}</span>
        </span>
      }
    />
  );
}
