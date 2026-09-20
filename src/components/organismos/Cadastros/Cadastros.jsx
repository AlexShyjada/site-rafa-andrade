import Etiqueta from '@/components/atomos/Etiqueta/Etiqueta';
import Revelar from '@/components/atomos/Revelar/Revelar';
import FormularioGrupos from '../FormularioGrupos/FormularioGrupos';
import FormularioMaterial from '../FormularioMaterial/FormularioMaterial';
import { grupos, material } from '@/dados/site';
import estilos from './Cadastros.module.css';

export default function Cadastros() {
  return (
    <div className={estilos.duplo}>
      {/* --------- Nossos grupos --------- */}
      <section className={`${estilos.metade} ${estilos.comFoto}`} id="grupos-whatsapp">
        <div
          className={estilos.foto}
          aria-hidden="true"
          style={{
            // o arquivo local fica por cima; enquanto não foi baixado,
            // o navegador mostra a camada remota que vem atrás
            backgroundImage: `url(${grupos.imagemFundo}), url(${grupos.imagemFundoRemota})`
          }}
        />
        <div className={estilos.veu} aria-hidden="true" />

        <div className={estilos.conteudo}>
          <Revelar como="div">
            <Etiqueta>{grupos.etiqueta}</Etiqueta>
          </Revelar>
          <Revelar como="h2" atraso={0.08} className={estilos.titulo}>
            {grupos.titulo[0]}
            <br />
            {grupos.titulo[1]} <span className="destaque">{grupos.titulo[2]}</span>
          </Revelar>
          <Revelar atraso={0.16} className={estilos.caixaForm}>
            <FormularioGrupos />
          </Revelar>
        </div>
      </section>

      {/* --------- Material de campanha --------- */}
      <section className={estilos.metade} id="material-de-campanha">
        <div className={estilos.conteudo}>
          <Revelar como="div">
            <Etiqueta>{material.etiqueta}</Etiqueta>
          </Revelar>
          <Revelar como="h2" atraso={0.08} className={estilos.titulo}>
            {material.titulo[0]}
            <br />
            <span className="destaque">{material.titulo[1]}</span>
          </Revelar>
          <Revelar atraso={0.16} className={estilos.caixaForm}>
            <FormularioMaterial />
          </Revelar>
        </div>
      </section>
    </div>
  );
}
