'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icone from '@/components/atomos/Icones/Icones';
import estilos from './LeitorPropostas.module.css';

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const limitar = (z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(z * 100) / 100));

const urlPdf = (livro) => `/propostas/${livro}.pdf`;

// pdf.js é servido de /public/pdfjs (build "legacy", compatível com mais
// navegadores) e carregado só quando o leitor abre, fora do bundle do Next.
let promessaPdfjs;
function carregarPdfjs() {
  if (!promessaPdfjs) {
    promessaPdfjs = import(/* webpackIgnore: true */ '/pdfjs/pdf.min.mjs').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
      return pdfjs;
    });
    promessaPdfjs.catch(() => {
      promessaPdfjs = undefined; // permite tentar de novo
    });
  }
  return promessaPdfjs;
}

/**
 * Leitor em modal, estilo e-book, de um PDF de propostas. Mostra o PDF
 * original página a página (as páginas são imagens geradas dele, sem nenhuma
 * alteração de conteúdo), com sumário, navegação por botões, teclado, barra
 * de progresso e deslize no celular, e link para baixar o PDF.
 *
 * `item` é um item de `propostas.itens` (dados/site.js) ou null (fechado).
 */
export default function LeitorPropostas({ item, onFechar }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  if (!montado || !item) return null;
  return createPortal(<Leitor key={item.livro} item={item} onFechar={onFechar} />, document.body);
}

function Leitor({ item, onFechar }) {
  const { livro, paginas, indice, titulo } = item;
  const [pagina, setPagina] = useState(1);
  const [sumario, setSumario] = useState(false);
  const [direcao, setDirecao] = useState(0);
  const caixa = useRef(null);
  const palco = useRef(null);
  const toque = useRef(null);
  const [tentativa, setTentativa] = useState(0);
  const [doc, setDoc] = useState(null);
  const [erroDoc, setErroDoc] = useState(false);
  const [zoom, setZoom] = useState(1);
  const zoomAnterior = useRef(1);
  const pinca = useRef(null);
  const ultimoToque = useRef(0);

  const irPara = useCallback(
    (n) => {
      const alvo = Math.max(1, Math.min(paginas, n));
      setPagina((atual) => {
        if (alvo === atual) return atual;
        setDirecao(alvo > atual ? 1 : -1);
        return alvo;
      });
      setSumario(false);
    },
    [paginas]
  );

  const mudarZoom = useCallback((passo) => setZoom((z) => limitar(z + passo)), []);

  // proposta em que a página atual está
  const propostaAtual = useMemo(() => {
    let atual = indice[0];
    for (const entrada of indice) if (entrada[1] <= pagina) atual = entrada;
    return atual;
  }, [indice, pagina]);

  // trava a rolagem da página, devolve o foco ao fechar
  useEffect(() => {
    const anterior = document.activeElement;
    const largura = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (largura > 0) document.body.style.paddingRight = `${largura}px`;
    caixa.current?.querySelector('[data-foco-inicial]')?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (anterior instanceof HTMLElement) anterior.focus();
    };
  }, []);

  // teclado: Esc fecha, setas/PgUp/PgDn viram a página, Tab fica dentro do modal
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (sumario) setSumario(false);
        else onFechar();
        return;
      }
      if (e.key === 'Tab' && caixa.current) {
        const itens = Array.from(caixa.current.querySelectorAll(FOCAVEIS));
        if (!itens.length) return;
        const primeiro = itens[0];
        const ultimo = itens[itens.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
        return;
      }
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        irPara(pagina + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        irPara(pagina - 1);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        mudarZoom(0.5);
      } else if (e.key === '-') {
        e.preventDefault();
        mudarZoom(-0.5);
      } else if (e.key === '0') {
        setZoom(1);
      } else if (e.key === 'Home') {
        irPara(1);
      } else if (e.key === 'End') {
        irPara(paginas);
      }
    }
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [pagina, paginas, sumario, irPara, onFechar, mudarZoom]);

  // ao mudar o zoom, mantém o centro do que está sendo lido no mesmo lugar
  useLayoutEffect(() => {
    const el = palco.current;
    const antes = zoomAnterior.current;
    zoomAnterior.current = zoom;
    if (!el || antes === zoom) return;
    const r = zoom / antes;
    el.scrollLeft = (el.scrollLeft + el.clientWidth / 2) * r - el.clientWidth / 2;
    el.scrollTop = (el.scrollTop + el.clientHeight / 2) * r - el.clientHeight / 2;
  }, [zoom]);

  // ctrl + rolagem (e o gesto de pinça do touchpad) dá zoom; precisa de listener
  // não passivo para poder cancelar o zoom do navegador
  useEffect(() => {
    const el = palco.current;
    if (!el) return undefined;
    function aoRolar(e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((z) => limitar(z * Math.exp(-e.deltaY * 0.01)));
    }
    el.addEventListener('wheel', aoRolar, { passive: false });
    return () => el.removeEventListener('wheel', aoRolar);
  }, []);

  // abre o PDF (vetorial, o arquivo original) uma vez por leitura
  useEffect(() => {
    let cancelado = false;
    let tarefa;
    setErroDoc(false);
    setDoc(null);
    carregarPdfjs()
      .then((pdfjs) => {
        tarefa = pdfjs.getDocument({ url: urlPdf(livro), isEvalSupported: false });
        return tarefa.promise;
      })
      .then((pdf) => {
        if (cancelado) pdf.destroy();
        else setDoc(pdf);
      })
      .catch(() => {
        if (!cancelado) setErroDoc(true);
      });
    return () => {
      cancelado = true;
      tarefa?.destroy();
    };
  }, [livro, tentativa]);

  // volta ao topo ao virar a página e já prepara as vizinhas
  useEffect(() => {
    palco.current?.scrollTo({ top: 0, left: 0 });
    [pagina + 1, pagina - 1].forEach((n) => {
      if (doc && n >= 1 && n <= paginas) doc.getPage(n).catch(() => {});
    });
  }, [pagina, paginas, doc]);

  const distancia = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  function aoTocar(e) {
    if (e.touches.length === 2) {
      pinca.current = { d: distancia(e.touches), z: zoom };
      toque.current = null;
      return;
    }
    toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function aoMoverToque(e) {
    if (e.touches.length === 2 && pinca.current) {
      setZoom(limitar((pinca.current.z * distancia(e.touches)) / pinca.current.d));
    }
  }
  function aoSoltar(e) {
    if (pinca.current) {
      if (e.touches.length < 2) pinca.current = null;
      toque.current = null;
      return;
    }
    const inicio = toque.current;
    toque.current = null;
    if (!inicio) return;
    const dx = e.changedTouches[0].clientX - inicio.x;
    const dy = e.changedTouches[0].clientY - inicio.y;
    // com zoom, arrastar é para andar pela página; só vira a página sem zoom
    if (zoom === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      irPara(pagina + (dx < 0 ? 1 : -1));
      return;
    }
    // toque duplo alterna entre a página inteira e 250%
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const agora = Date.now();
      if (agora - ultimoToque.current < 300) {
        setZoom((z) => (z > 1 ? 1 : 2.5));
        ultimoToque.current = 0;
      } else {
        ultimoToque.current = agora;
      }
    }
  }

  const rotuloTitulo = `Propostas: ${titulo}`;

  return (
    <div
      className={estilos.fundo}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        ref={caixa}
        className={estilos.caixa}
        role="dialog"
        aria-modal="true"
        aria-label={rotuloTitulo}
      >
        <header className={estilos.topo}>
          <button
            type="button"
            className={`${estilos.botaoIcone} ${estilos.botaoSumario}`}
            onClick={() => setSumario((v) => !v)}
            aria-expanded={sumario}
            aria-controls="leitor-sumario"
            aria-label="Sumário"
          >
            <Icone nome="menu" tamanho={20} />
            <span>Sumário</span>
          </button>

          <div className={estilos.titulos}>
            <span className={estilos.livro}>{titulo}</span>
            <span className={estilos.proposta}>{propostaAtual[0]}</span>
          </div>

          <a
            className={estilos.botaoIcone}
            href={`/propostas/${livro}.pdf`}
            download
            aria-label="Baixar PDF"
            title="Baixar PDF"
          >
            <Icone nome="documento" tamanho={20} />
            <span className={estilos.somenteDesktop}>PDF</span>
          </a>
          <button
            type="button"
            className={estilos.botaoIcone}
            onClick={onFechar}
            aria-label="Fechar leitor"
            data-foco-inicial
          >
            <Icone nome="fechar" tamanho={20} />
          </button>
        </header>

        <div className={estilos.corpo}>
          <div
            ref={palco}
            className={estilos.palco}
            onTouchStart={aoTocar}
            onTouchMove={aoMoverToque}
            onTouchEnd={aoSoltar}
            tabIndex={-1}
          >
            <div className={estilos.livroAberto} style={{ '--zoom': zoom }}>
              <Folha
                key={`${livro}-${pagina}`}
                doc={doc}
                erro={erroDoc}
                numero={pagina}
                rotulo={`${titulo}, página ${pagina} de ${paginas}`}
                direcao={direcao}
                aoTentar={() => setTentativa((t) => t + 1)}
              />
            </div>
          </div>

          <div className={estilos.zoom} role="group" aria-label="Zoom">
            <button
              type="button"
              onClick={() => mudarZoom(-0.5)}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Diminuir zoom"
            >
              <Icone nome="menos" tamanho={20} />
            </button>
            <button
              type="button"
              className={estilos.zoomValor}
              onClick={() => setZoom(1)}
              aria-label="Voltar à página inteira"
              title="Voltar à página inteira"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => mudarZoom(0.5)}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Aumentar zoom"
            >
              <Icone nome="mais" tamanho={20} />
            </button>
          </div>

          {sumario && (
            <>
              <div className={estilos.veu} onClick={() => setSumario(false)} />
              <nav id="leitor-sumario" className={estilos.sumario} aria-label="Sumário">
                <h2 className={estilos.sumarioTitulo}>Sumário</h2>
                <p className={estilos.sumarioSub}>
                  {indice.length} propostas · {paginas} páginas
                </p>
                <ol className={estilos.lista}>
                  {indice.map(([nome, n], i) => (
                    <li key={`${nome}-${n}`}>
                      <button
                        type="button"
                        className={estilos.entrada}
                        aria-current={propostaAtual === indice[i] ? 'true' : undefined}
                        onClick={() => irPara(n)}
                      >
                        <span className={estilos.numero}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={estilos.nome}>{nome}</span>
                        <span className={estilos.pg}>p. {n}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}
        </div>

        <footer className={estilos.rodape}>
          <button
            type="button"
            className={estilos.virar}
            onClick={() => irPara(pagina - 1)}
            disabled={pagina <= 1}
            aria-label="Página anterior"
          >
            <Icone nome="chevronEsquerda" tamanho={22} />
          </button>

          <div className={estilos.progresso}>
            <input
              type="range"
              min={1}
              max={paginas}
              value={pagina}
              onChange={(e) => irPara(Number(e.target.value))}
              aria-label="Ir para a página"
              aria-valuetext={`Página ${pagina} de ${paginas}`}
              style={{ '--p': `${paginas > 1 ? ((pagina - 1) / (paginas - 1)) * 100 : 100}%` }}
            />
            <span className={estilos.contador} aria-live="polite">
              Página {pagina} de {paginas}
            </span>
          </div>

          <button
            type="button"
            className={estilos.virar}
            onClick={() => irPara(pagina + 1)}
            disabled={pagina >= paginas}
            aria-label="Próxima página"
          >
            <Icone nome="chevronDireita" tamanho={22} />
          </button>
        </footer>
      </div>
    </div>
  );
}

const LIMITE_PIXELS = 14_000_000; // acima disso o celular (iOS) recusa o canvas

// Uma página do PDF, desenhada em vetor num canvas na resolução exata do que
// está na tela. Ao dar zoom, o canvas existente é só esticado (instantâneo) e,
// quando o zoom assenta, a página é redesenhada nítida nessa nova escala.
function Folha({ doc, erro, numero, rotulo, direcao, aoTentar }) {
  const [estado, setEstado] = useState('carregando'); // carregando | pronta | erro
  const [largura, setLargura] = useState(0);
  const folha = useRef(null);
  const tela = useRef(null);

  // largura real da folha em px (muda com o zoom e com o tamanho da janela)
  useEffect(() => {
    const el = folha.current;
    if (!el) return undefined;
    let tempo;
    const medir = () => setLargura(Math.round(el.getBoundingClientRect().width));
    medir();
    const obs = new ResizeObserver(() => {
      clearTimeout(tempo);
      tempo = setTimeout(medir, 180);
    });
    obs.observe(el);
    return () => {
      clearTimeout(tempo);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (erro) setEstado('erro');
  }, [erro]);

  useEffect(() => {
    if (!doc || !largura) return undefined;
    let cancelado = false;
    let tarefa;
    (async () => {
      try {
        const pagina = await doc.getPage(numero);
        const base = pagina.getViewport({ scale: 1 });
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        let escala = (largura * dpr) / base.width;
        const pixels = base.width * escala * base.height * escala;
        if (pixels > LIMITE_PIXELS) escala *= Math.sqrt(LIMITE_PIXELS / pixels);
        const vp = pagina.getViewport({ scale: escala });

        // desenha fora da tela e só então troca, para nunca piscar
        const fora = document.createElement('canvas');
        fora.width = Math.floor(vp.width);
        fora.height = Math.floor(vp.height);
        tarefa = pagina.render({
          canvasContext: fora.getContext('2d'),
          viewport: vp,
          background: '#ffffff'
        });
        await tarefa.promise;
        if (cancelado || !tela.current) return;
        const visivel = tela.current;
        visivel.width = fora.width;
        visivel.height = fora.height;
        visivel.getContext('2d').drawImage(fora, 0, 0);
        setEstado('pronta');
      } catch (e) {
        if (!cancelado && e?.name !== 'RenderingCancelledException') setEstado('erro');
      }
    })();
    return () => {
      cancelado = true;
      tarefa?.cancel();
    };
  }, [doc, numero, largura]);

  return (
    <div ref={folha} className={estilos.folha} data-direcao={direcao} data-estado={estado}>
      <canvas ref={tela} className={estilos.tela} role="img" aria-label={rotulo} />
      {estado === 'carregando' && (
        <div className={estilos.carregando} role="status">
          <span className={estilos.spinner} aria-hidden="true" />
          <span>Carregando página…</span>
        </div>
      )}
      {estado === 'erro' && (
        <div className={estilos.carregando} role="alert">
          <span>Não foi possível carregar esta página.</span>
          <button type="button" className={estilos.tentar} onClick={aoTentar}>
            Tentar de novo
          </button>
        </div>
      )}
    </div>
  );
}
