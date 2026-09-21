import { GeistSans } from 'geist/font/sans';
import { site } from '@/dados/site';
import '@/styles/globais.css';

// Endereço público do site, usado para montar a URL absoluta da imagem de
// preview (og:image). Na Vercel vem do próprio build; em outro serviço,
// defina NEXT_PUBLIC_SITE_URL (veja .env.example). A imagem em si é local:
// public/imagens/og.png.
const enderecoDoSite =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

// Imagem que aparece ao compartilhar o link (Facebook, Instagram Direct, X,
// WhatsApp...). O ?v= força as redes a buscarem de novo se a imagem mudar.
const previa = {
  url: '/imagens/og.png?v=2',
  width: 1200,
  height: 600,
  type: 'image/png',
  alt: site.titulo
};

export const metadata = {
  title: site.titulo,
  description: site.descricao,
  metadataBase: enderecoDoSite ? new URL(enderecoDoSite) : undefined,
  openGraph: {
    title: site.titulo,
    description: site.descricao,
    siteName: site.nome,
    type: 'website',
    locale: 'pt_BR',
    images: [previa]
  },
  twitter: {
    card: 'summary_large_image',
    title: site.titulo,
    description: site.descricao,
    images: [{ url: previa.url, alt: previa.alt }]
  },
  // O manifesto (Android/PWA) é gerado por src/app/manifest.js
  icons: {
    icon: [
      // sizes no .ico evita que o Chrome prefira ele ao SVG
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  other: {
    'facebook-domain-verification': '9l48en2klmk1s8f4il2wpefmq2dccq',
    // Blocos do Windows (Edge/Start)
    'msapplication-TileColor': '#141414',
    'msapplication-TileImage': '/mstile-150x150.png'
  }
};

export const viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
