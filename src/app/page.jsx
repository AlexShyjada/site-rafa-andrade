import Cabecalho from '@/components/organismos/Cabecalho/Cabecalho';
import Hero from '@/components/organismos/Hero/Hero';
import Ticker from '@/components/organismos/Ticker/Ticker';
import Propostas from '@/components/organismos/Propostas/Propostas';
import Cadastros from '@/components/organismos/Cadastros/Cadastros';
import Doacao from '@/components/organismos/Doacao/Doacao';
import Rodape from '@/components/organismos/Rodape/Rodape';

export default function Pagina() {
  return (
    <>
      <Cabecalho />
      <main>
        <Hero />
        <Ticker />
        <Propostas />
        <Cadastros />
        <Doacao />
      </main>
      <Rodape />
    </>
  );
}
