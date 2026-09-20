import { ticker } from '@/dados/site';
import estilos from './Ticker.module.css';

function Fita({ principal }) {
  return (
    <div className={estilos.fita} aria-hidden={!principal}>
      {Array.from({ length: 4 }).map((_, bloco) => (
        <span className={estilos.bloco} key={bloco}>
          {ticker.map((frase) => (
            <span className={estilos.item} key={frase}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={estilos.separador}
                src="/imagens/oculos-ticker.svg"
                alt=""
                width={20}
                height={21}
              />
              {frase}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <div className={estilos.faixa}>
      <div className={estilos.trilho}>
        <Fita principal />
        <Fita />
      </div>
    </div>
  );
}
