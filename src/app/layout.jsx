import { GeistSans } from 'geist/font/sans';
import { site } from '@/dados/site';
import '@/styles/globais.css';

export const metadata = {
  title: site.titulo,
  description: site.descricao,
  metadataBase: new URL(site.url),
  openGraph: {
    title: site.titulo,
    description: site.descricao,
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/imagens/og.png',
        width: 490,
        height: 686,
        alt: site.titulo
      }
    ]
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
