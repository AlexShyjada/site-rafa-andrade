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
    locale: 'pt_BR'
  },
  icons: { icon: '/favicon.svg' }
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
