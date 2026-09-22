import { headers } from 'next/headers';
import { GeistSans } from 'geist/font/sans';
import { site } from '@/dados/site';
import '@/styles/globais.css';

function enderecoDoSite() {
  const configurado = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurado) {
    return (/^https?:\/\//i.test(configurado)
      ? configurado
      : `https://${configurado}`
    ).replace(/\/+$/, '');
  }

  const cabecalhos = headers();
  const primeiro = (valor) => valor?.split(',')[0].trim();
  const host =
    primeiro(cabecalhos.get('x-forwarded-host')) || cabecalhos.get('host');
  if (!host) return undefined;

  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host);
  const protocolo =
    primeiro(cabecalhos.get('x-forwarded-proto')) || (local ? 'http' : 'https');
  return `${protocolo}://${host}`;
}

// URL inválida nunca pode derrubar o site: sem base, o Next usa o padrão dele.
function baseDoSite() {
  try {
    const endereco = enderecoDoSite();
    return endereco ? new URL(endereco) : undefined;
  } catch {
    return undefined;
  }
}

// Imagem que aparece ao compartilhar o link (Facebook, Instagram Direct, X,
// WhatsApp...). O ?v= força as redes a buscarem de novo se a imagem mudar.
const previa = {
  url: '/imagens/og.png',
  width: 1200,
  height: 600,
  type: 'image/png',
  alt: site.titulo
};

const metadados = {
  title: site.titulo,
  description: site.descricao,
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
    images: ['/imagens/og.png']
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

export function generateMetadata() {
  return { ...metadados, metadataBase: baseDoSite() };
}

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
