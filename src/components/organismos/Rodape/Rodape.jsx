import Icone from '@/components/atomos/Icones/Icones';
import Logo from '@/components/atomos/Logo/Logo';
import { rodape } from '@/dados/site';
import estilos from './Rodape.module.css';

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className={estilos.linha}>
        <Logo tamanho="sm" variante="rodape" />

        <nav className={estilos.links} aria-label="Rodapé">
          {rodape.links.map((l) => (
            <a key={l.rotulo} className={estilos.link} href={l.href}>
              {l.rotulo}
            </a>
          ))}
        </nav>

        <a className={estilos.topo} href="#inicio" aria-label="Voltar ao topo">
          <Icone nome="chevronCima" tamanho={20} />
        </a>
      </div>
    </footer>
  );
}
