# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Next.js (App Router) rebuild of a political campaign site (`rafandrade.framer.website`), originally built in Framer. Plain CSS Modules + CSS variables, Framer Motion for animation — no Tailwind, no generated Framer markup. Site content is in Portuguese (pt-BR); code identifiers (components, functions, variables) are also in Portuguese, matching the domain language.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start         # serve the production build
npm run lint      # next lint — see caveat below
npm run assets    # one-time: download the hero photo into /public/imagens
```

There is no test suite in this repo. `npm run lint` is effectively unconfigured: there is no ESLint config or `eslint` dependency, so `next lint` will prompt to set one up interactively rather than lint anything.

`npm run assets` is optional: until the image exists locally under `/public/imagens`, `ImagemComFallback` (`src/components/atomos/ImagemComFallback.jsx`) falls back to loading it straight from the Framer CDN, so the site never renders broken either way. It's a plain `<img>` (not `next/image`) with an `onError` swap to the `fallback` URL. The asset list lives in `scripts/baixar-assets.mjs`.

Remote images used through `next/image` (e.g. country flags from `flagcdn.com`, Framer assets) must have their host allowlisted in `images.remotePatterns` in `next.config.mjs`.

## Architecture

**Content is centralized, not scattered.** All copy, links, and webhook URLs live in `src/dados/site.js` (plus `src/dados/paises.js` for the phone country-code list and `src/dados/estados.js` for Brazilian states). Section components import from here and render — they don't hardcode strings. To change campaign text, a link, or a number, edit `src/dados/site.js`; there is rarely a reason to touch a component for a content change.

**Components under `src/components/` follow an atomic-design-inspired hierarchy** (folder names in Portuguese, matching the rest of the codebase):
- `atomos/` — self-contained primitives with no dependency on other components: Botao, Campo, Etiqueta, Icones (inline SVGs), ImagemComFallback, Logo, Revelar.
- `moleculas/` — combine atoms: Seletor (a hand-built accessible listbox — the native `<select>` can't be styled to match the design), SeletorPais (Seletor specialized with the country/DDI list and flag icons).
- `organismos/` — page-section-level blocks composed of molecules/atoms: Cabecalho, Hero, Ticker, Propostas, Cadastros, Doacao, Rodape (one per section, assembled in order by `src/app/page.jsx`), plus FormularioMaterial (the lead-capture form, which lives here rather than in molecules because it owns real business logic — validation, webhook submission, ViaCEP/IBGE lookups).

**Each component lives in its own folder** alongside its CSS: `src/components/<camada>/Nome/Nome.jsx` + `Nome.module.css` (CSS Modules, not global classes; components with no styles, like `Icones`, `Revelar`, `ImagemComFallback`, have only the `.jsx`). There are no `index.js` barrels, so imports repeat the name. Import convention: within the same layer, imports are relative (`../Icones/Icones`); crossing layers, imports use the alias `@/components/<camada>/Nome/Nome`. The form's card/success-state layout is in `organismos/FormularioMaterial/FormularioMaterial.module.css`.

**The form submits to a Google Apps Script webhook**, not a backend of this project. `src/lib/webhook.js` (`enviarParaPlanilha`) POSTs with `Content-Type: text/plain` specifically to avoid a CORS preflight, and retries up to 4 times with exponential backoff when the sheet responds `"ocupado"` (busy); any other error from the sheet is treated as final. The webhook URL is a real production Apps Script endpoint, defined in `src/dados/site.js` (`material.webhook`) — treat it as a real integration point, not a placeholder.

**External API calls in `src/lib/apis.js`:** ViaCEP (`buscarCep`) fills in address fields from a CEP in the "material de campanha" form — public, keyless, called live. `buscarMunicipios` (IBGE city list by state) is defined but currently **not used**: the city field in `FormularioMaterial` is a plain text input, despite the README describing an IBGE-driven dropdown.

**Form input masks and validators** (phone, CEP, name, email, and the `+55 (71) 99999-9999` DDI-prefixed phone string the sheet expects) live in `src/lib/formato.js`. The keys sent to the webhook (`nome`, `email`, `whatsapp`, `cep`, `endereco`, `numero`, `complemento`, `bairro`, `cidade`, `uf`) match the existing Google Sheet's columns — don't rename them.

**Design tokens** live in `src/styles/globais.css` as CSS custom properties (`--amarelo`, `--preto`, `--cinza-texto`, `--largura-max`, `--altura-header`, etc.) — reuse these rather than hardcoding colors/sizes in module CSS. Typography is Geist via the `geist` npm package (`geist/font/sans`, applied as a CSS variable class in `src/app/layout.jsx`) — not `next/font/google`, despite what the README says.

**Responsive breakpoints mirror the original Framer site exactly** and are intentional, not arbitrary: desktop ≥1220px, tablet 810–1219px, mobile ≤809px, with the nav collapsing to a hamburger below 900px. Preserve these when touching layout CSS. The 1219px edge is measured from the original site's own media queries (`(max-width: 1219px) and (min-width: 810px)`), not rounded to 1200 — an earlier version of this repo used 1199px and left a 20px band rendering the desktop layout at tablet widths.

At tablet the layout is not just a narrower desktop; it changes shape, matching the original:
- **Hero** stacks and centers — portrait (490×687) on top via `order: -1`, then centered title (64px), paragraph and buttons in a row.
- **Propostas** goes to 3 columns (not 2), section titles drop to 48px.
- **Doacao** stacks — centered text above, 390px card below.
- **Botao** keeps its full desktop size (56px tall, 20px type); it only shrinks at mobile.

**Animation conventions:**
- `Revelar` (`src/components/atomos/Revelar.jsx`) is the shared scroll-reveal wrapper (fade + rise, once per element, staggerable via `atraso`) — reach for it instead of writing bespoke `whileInView` logic in a section.
- All motion respects `prefers-reduced-motion` (see `useReducedMotion` usage in `Revelar`); keep that guarantee when adding new animations.
- The ticker marquee is pure CSS (not Framer Motion), pausing on hover.

**Path alias:** `@/*` maps to `src/*` (see `jsconfig.json`).

**The README is partly stale — trust the code over it.** Known drifts: it says Geist loads via `next/font/google` (it's the `geist` package), that the city field is an IBGE dropdown (it's a plain text input), and it lists flat component paths like `atomos/Logo.jsx` / `./Icones` (real paths are `atomos/Logo/Logo.jsx` / `../Icones/Icones`).
