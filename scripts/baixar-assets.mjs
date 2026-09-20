/**
 * Baixa as imagens originais do site para /public/imagens.
 * Rode uma vez depois de instalar:  npm run assets
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const arquivos = [
  {
    url: 'https://framerusercontent.com/images/KFkkC2u5DspQRrWAwbESPkTVY.png',
    destino: 'public/imagens/rafa-retrato.png'
  },
  {
    url: 'https://framerusercontent.com/images/qgrHVM5nv4mEuHoxwcrxKVcSQ0.png',
    destino: 'public/imagens/multidao.png'
  },
  {
    url: 'https://framerusercontent.com/images/FSmOCCh2sTucAsHxRFUAaBz0juA.png',
    destino: 'public/imagens/og.png'
  },
  {
    url: 'https://framerusercontent.com/images/xQPTlyypFCAyMd3XYHeUH3yaBA.png',
    destino: 'public/apple-touch-icon.png'
  },
  {
    url: 'https://framerusercontent.com/images/Ehq51qwlgHpHmgFlDKZUS8GljOQ.png',
    destino: 'public/favicon.png'
  }
];

for (const arquivo of arquivos) {
  const caminho = resolve(raiz, arquivo.destino);
  try {
    const resposta = await fetch(arquivo.url);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    const bytes = Buffer.from(await resposta.arrayBuffer());
    await mkdir(dirname(caminho), { recursive: true });
    await writeFile(caminho, bytes);

    console.log(`ok   ${arquivo.destino}  (${Math.round(bytes.length / 1024)} KB)`);
  } catch (erro) {
    console.error(`erro ${arquivo.destino}: ${erro.message}`);
  }
}
