import Botao from '@/components/atomos/Botao/Botao';
import Etiqueta from '@/components/atomos/Etiqueta/Etiqueta';
import MarcaParceiro from '@/components/atomos/MarcaParceiro/MarcaParceiro';
import Revelar from '@/components/atomos/Revelar/Revelar';
import { doacao } from '@/dados/site';
import estilos from './Doacao.module.css';

export default function Doacao() {
  return (
    <section className={estilos.secao} id="faca-uma-doacao">
      <div className={`container ${estilos.grade}`}>
        <div className={estilos.texto}>
          <Revelar como="div">
            <Etiqueta>{doacao.etiqueta}</Etiqueta>
          </Revelar>

          <Revelar como="h2" atraso={0.08} className={estilos.titulo}>
            {doacao.titulo[0]}
            <br />
            <span className="destaque">{doacao.titulo[1]}</span>
          </Revelar>

          <Revelar como="p" atraso={0.14} className={estilos.paragrafo}>
            {doacao.texto}
          </Revelar>
        </div>

        <Revelar atraso={0.12} className={estilos.cartao}>
          <div className={estilos.cartaoTopo}>
            <Etiqueta>{doacao.card.etiqueta}</Etiqueta>
            <MarcaParceiro
              nome={doacao.card.plataforma}
              arquivo={doacao.card.plataformaLogo}
            />
          </div>

          <h3 className={estilos.cartaoTitulo}>{doacao.card.titulo}</h3>
          <p className={estilos.cartaoTexto}>{doacao.card.texto}</p>

          <Botao
            href={doacao.card.link}
            variante="escuro"
            icone="setaDiagonal"
            largo
            className={estilos.cartaoBotao}
          >
            {doacao.card.botao}
          </Botao>

          <p className={estilos.nota}>{doacao.card.nota}</p>
        </Revelar>
      </div>
    </section>
  );
}
