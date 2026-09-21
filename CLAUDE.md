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
```

There is no test suite in this repo. `npm run lint` is effectively unconfigured: there is no ESLint config or `eslint` dependency, so `next lint` will prompt to set one up interactively rather than lint anything.

All images live in `public/imagens` and are committed (hero portrait `hero.png`, grupos background `grupos-fundo.png`, share preview `og.png` at 1200×600, logos/SVGs). The Hero portrait goes through `ImagemComFallback` (a plain `<img>` with an optional `onError` swap to a `fallback` URL, currently unused). The favicon set (`icon.svg`, `favicon.ico`, `favicon-{16,32,48}x{16,32,48}.png`, `apple-touch-icon.png`, `android-chrome-*.png` incl. a maskable one, `mstile-150x150.png`) is wired up in the `metadata` export of `src/app/layout.jsx`, as are the Open Graph/Twitter preview tags (absolute image URL built from `NEXT_PUBLIC_SITE_URL`, else Vercel's production URL, else `site.url`); the PWA manifest is `src/app/manifest.js`. The master artwork is `public/imagens/icone.svg` (489×512); `public/icon.svg` is the same drawing with a square viewBox, and every PNG/ICO was rasterized from it (transparent for browser tabs, white background for iOS/Android/Windows tiles).

Remote images used through `next/image` (e.g. country flags from `flagcdn.com`, Framer assets) must have their host allowlisted in `images.remotePatterns` in `next.config.mjs`.

## Architecture

**Content is centralized, not scattered.** All copy, links, and webhook URLs live in `src/dados/site.js` (plus `src/dados/paises.js` for the phone country-code list and `src/dados/estados.js` for Brazilian states). Section components import from here and render — they don't hardcode strings. To change campaign text, a link, or a number, edit `src/dados/site.js`; there is rarely a reason to touch a component for a content change.

**Components under `src/components/` follow an atomic-design-inspired hierarchy** (folder names in Portuguese, matching the rest of the codebase):
- `atomos/` — self-contained primitives with no dependency on other components: Botao, Campo, Etiqueta, Icones (inline SVGs; the 8 proposal-card icons are Phosphor "regular" paths on a 256 viewBox, the rest are hand-drawn 24px line icons, no icon package is installed), ImagemComFallback, Logo, Revelar, BandeiraPais (flagcdn SVG, falls back to the ISO code), BandeiraEstado, MarcaParceiro.
- `moleculas/` — combine atoms: Seletor (a hand-built accessible listbox — the native `<select>` can't be styled to match the design), SeletorPais (Seletor specialized with the country/DDI list and flag icons), ConviteWhatsApp (post-submit group-invite card), Carrossel (a `<ul>` that stays a normal grid above 809px and becomes a scroll-snap carousel with arrows and a dots pill on mobile, mirroring the Framer Slideshow; used by `Propostas`, its `<li>` children must be direct children of the list, and per-item `Revelar` animation is disabled inside it on mobile).
- `organismos/` — page-section-level blocks composed of molecules/atoms: Cabecalho, Hero, Ticker, Propostas, Cadastros, Doacao, Rodape (one per section, assembled in order by `src/app/page.jsx`). `Cadastros` is a two-column section holding both lead-capture forms side by side: `FormularioGrupos` (WhatsApp groups signup: nome, telefone, estado, cidade) and `FormularioMaterial` (campaign-material request: adds email + CEP/address). They live here rather than in molecules because they own real business logic — validation, webhook submission, ViaCEP/IBGE lookups.

**Each component lives in its own folder** alongside its CSS: `src/components/<camada>/Nome/Nome.jsx` + `Nome.module.css` (CSS Modules, not global classes; components with no styles, like `Icones`, `Revelar`, `ImagemComFallback`, have only the `.jsx`). There are no `index.js` barrels, so imports repeat the name. Import convention: within the same layer, imports are relative (`../Icones/Icones`); crossing layers, imports use the alias `@/components/<camada>/Nome/Nome`. Both forms share one stylesheet, `src/styles/formulario.module.css` (card, fields, success state); `FormularioMaterial/FormularioMaterial.module.css` is currently orphaned — nothing imports it.

**Both forms submit to Google Apps Script webhooks**, not a backend of this project — one per form: `grupos.webhook` and `material.webhook` in `src/dados/site.js`. They are real production endpoints writing to real Google Sheets; treat them as live integration points, not placeholders. `src/lib/webhook.js` (`enviarParaPlanilha`) POSTs JSON with `Content-Type: text/plain` specifically to avoid a CORS preflight. Apps Script answers HTTP 200 even when it rejects a submission, so the response body is read: only an explicit `ok: false` / `erro` / `error` counts as failure (any other body, or non-JSON, counts as success). Up to 3 attempts with exponential backoff, and only when the sheet answers `"ocupado"` (lock contention); any other rejection is final.

**Form ↔ sheet contract.** The payload keys match existing Google Sheet columns — don't rename them. `FormularioMaterial` sends `nome, email, whatsapp, cep, endereco, numero, complemento, bairro, cidade, uf` (`uf` as the sigla, phone as `+55 (71) 99999-9999`). `FormularioGrupos` sends `nome, telefone, estado, cidade` (`estado` as the full state name via `nomeDoEstado`, not the sigla). Masks/validators and `telefoneComDdi` live in `src/lib/formato.js`; the country/DDI list in `src/dados/paises.js` (default `BR`), states in `src/dados/estados.js` (default `BA`).

**External API calls in `src/lib/apis.js`** (public, keyless, called live from the browser): ViaCEP (`buscarCep`) and IBGE (`buscarMunicipios`, city list by UF). The city field in both forms is a `Seletor` populated from IBGE whenever the UF changes (with a `cancelado` flag to drop stale responses). In `FormularioMaterial`, a ViaCEP hit sets the UF and stores the returned city as `cidadePendente`; it is only applied after the IBGE list for *that* UF has loaded (`ufDasCidades` guards against matching the old list), using accent-insensitive `normalizar`. The address block stays hidden until the CEP is complete *and* the ViaCEP lookup has settled, so the API can't overwrite what the user is typing.

**Post-submit invite.** On success both forms render `ConviteWhatsApp` with the group data from `site.js` (`sucesso.grupo`). It auto-redirects after `segundosParaAbrir` (0 disables) but always shows the button too, because Instagram/Facebook WebViews block automatic navigation. `material.sucesso.grupo.link` is empty, so that form currently shows no invite card; the invite URL passes through `linkSeguro`.

**Design tokens** live in `src/styles/globais.css` as CSS custom properties (`--amarelo`, `--preto`, `--cinza-texto`, `--largura-max`, `--altura-header`, etc.) — reuse these rather than hardcoding colors/sizes in module CSS. Typography is Geist via the `geist` npm package (`geist/font/sans`, applied as a CSS variable class in `src/app/layout.jsx`) — not `next/font/google`, despite what the README says.

**Responsive breakpoints mirror the original Framer site exactly** and are intentional, not arbitrary: desktop ≥1220px, tablet 810–1219px, mobile ≤809px, with the nav collapsing to a hamburger below 900px. Preserve these when touching layout CSS. The 1219px edge is measured from the original site's own media queries (`(max-width: 1219px) and (min-width: 810px)`), not rounded to 1200 — an earlier version of this repo used 1199px and left a 20px band rendering the desktop layout at tablet widths.

At tablet the layout is not just a narrower desktop; it changes shape, matching the original:
- **Hero** stacks and centers — portrait (490×687) on top via `order: -1`, then centered title (64px), paragraph and buttons in a row.
- **Propostas** goes to 3 columns (not 2), section titles drop to 48px. At mobile the cards become a carousel (see `Carrossel`).
- **Doacao** stacks — centered text above, 390px card below.
- **Botao** keeps its full desktop size (56px tall, 20px type); it only shrinks at mobile. The Hero buttons (`.botoes > .botao` in `Hero.module.css`) are extra compact at mobile — 40px tall, 14px type, side by side — matching the Framer site.
- The Hero has an 8px yellow `border-top` right under the fixed header (the hero uses `margin-top: var(--altura-header)` instead of top padding so the border isn't hidden behind the header).
- Section `h2` sizes are shared: `Propostas` and `Cadastros` titles both use 64px desktop / 48px tablet / 34px mobile.

**Animation conventions:**
- `Revelar` (`src/components/atomos/Revelar/Revelar.jsx`) is the shared scroll-reveal wrapper (fade + rise, once per element, staggerable via `atraso`) — reach for it instead of writing bespoke `whileInView` logic in a section.
- All motion respects `prefers-reduced-motion` (see `useReducedMotion` usage in `Revelar`); keep that guarantee when adding new animations.
- The ticker marquee is pure CSS (not Framer Motion), pausing on hover.

**Path alias:** `@/*` maps to `src/*` (see `jsconfig.json`).

**The README is partly stale — trust the code over it.** Known drifts: it says Geist loads via `next/font/google` (it's the `geist` package), and it lists flat component paths like `atomos/Logo.jsx` / `./Icones` (real paths are `atomos/Logo/Logo.jsx` / `../Icones/Icones`).
