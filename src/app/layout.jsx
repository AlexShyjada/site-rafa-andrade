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
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    apple: '/apple-touch-icon.png'
  },
  other: {
    'facebook-domain-verification': '9l48en2klmk1s8f4il2wpefmq2dccq'
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
