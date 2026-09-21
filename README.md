# Rafa Andrade 14014 — versão em Next.js

Reconstrução do site `rafandrade.framer.website` em Next.js (App Router),
com CSS Modules, variáveis CSS e animações em Framer Motion.
Sem Tailwind, sem código gerado pelo Framer: tudo é componente legível
e editável.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
```

Todas as imagens ficam versionadas em `/public/imagens`.

## Estrutura

```
src/
  app/
    layout.jsx          metadados, fonte Geist, CSS global
    page.jsx            ordem das seções
  components/
    atomos/             Botao, Campo, Etiqueta, Icones,
                        Logo, Revelar
    moleculas/          Seletor, SeletorPais
    organismos/         Cabecalho, Hero, Ticker, Propostas, Cadastros,
                        Doacao, Rodape, FormularioMaterial
  dados/
    site.js             TODO o conteúdo: textos, links, webhooks
    paises.js           lista de DDI do seletor de telefone
    estados.js          UFs
  lib/
    webhook.js          POST para o Apps Script (com retentativa)
    formato.js          máscaras e validações
    apis.js             ViaCEP e IBGE
  styles/
    globais.css         tokens de design e reset
```

Organização dos componentes inspirada em [atomic design](https://bradfrost.com/blog/post/atomic-web-design/):
átomos não dependem de nada, moléculas combinam átomos, organismos combinam
moléculas/átomos em blocos completos de seção. Dentro da mesma camada os
imports são relativos (`./Icones`); entre camadas usam o alias
`@/components/<camada>/Nome`.

Para mudar texto, link ou número, mexa só em `src/dados/site.js`.

## Design tokens

Definidos em `src/styles/globais.css`:

| token | valor |
| --- | --- |
| `--amarelo` | `#ffbf27` |
| `--preto` | `#141414` |
| `--cinza-texto` | `#4d4d4d` |
| `--largura-max` | `1200px` |
| `--altura-header` | `78px` (72 no tablet, 64 no mobile) |

Tipografia: Geist, via `next/font/google`. H1 do hero em 80px no desktop,
58px no tablet e 40px no mobile, sempre com `letter-spacing: -0.05em`.

## Breakpoints

Os mesmos três do Framer:

- **Desktop** — a partir de 1200px
- **Tablet** — 810px a 1199px
- **Mobile** — até 809px

O menu vira hambúrguer abaixo de 900px. A grade das propostas vai de
4 para 2 e depois 1 coluna.

## Animações

- **Ticker** — marquee em CSS, 48s no desktop e 32s no mobile, pausa no hover.
- **Entrada do hero** — títulos e botões sobem escalonados (Framer Motion).
- **Revelar** — `src/components/atomos/Revelar.jsx` faz o "appear on scroll"
  de cada seção e card, uma vez só, com atraso escalonado.
- **Selects** — abrem e fecham com `AnimatePresence`.
- **Formulários** — troca animada entre formulário e tela de sucesso;
  no material, os campos de endereço deslizam quando o CEP fica completo.
- Tudo respeita `prefers-reduced-motion`.

## Formulário

O cadastro de material de campanha envia para o mesmo webhook do Apps
Script que o site atual usa (está em `src/dados/site.js`). O envio é
`POST` com `Content-Type: text/plain` para não disparar preflight de
CORS, com retentativa e backoff quando a planilha responde `ocupado`.

Chaves enviadas (iguais às de hoje): `nome`, `email`, `whatsapp`, `cep`,
`endereco`, `numero`, `complemento`, `bairro`, `cidade`, `uf`.

O telefone vai com DDI na frente: `+55 (71) 99999-9999`.
As cidades da Bahia vêm da API do IBGE e o endereço vem do ViaCEP,
como no original.

## O que mudou em relação ao Framer

- **Marca da campanha** — remontada em texto e CSS (`atomos/Logo.jsx`), então
  escala sem perder nitidez e o número muda em um lugar só.
- **Ícones das propostas** — desenhados como SVG inline no projeto.
- **Logo da plataforma de doação** — está como texto no card. Se quiser o
  logotipo oficial dela, coloque o arquivo em `/public/imagens` e troque o
  `<span>` em `organismos/Doacao.jsx`.
- **Fundo amarelo do hero** — o painel e a textura de skyline são CSS; só o
  retrato é imagem, o que deixa a seção mais leve e fácil de ajustar.
- **Badge "Made in Framer"** — removido.

## Build

```bash
npm run build && npm start
```

Roda em qualquer host de Next: Vercel, Netlify ou Node próprio.
