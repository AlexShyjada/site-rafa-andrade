import { headers } from 'next/headers';
import Script from 'next/script';
import { GeistSans } from 'geist/font/sans';
import { site } from '@/dados/site';
import BannerCookies from '@/components/organismos/BannerCookies/BannerCookies';
import '@/styles/globais.css';

// Pixel do Meta (Facebook/Instagram Ads), enviado pelo gestor de tráfego.
const PIXEL_META = '1087596597147926';

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
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_META}');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_META}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
        <BannerCookies />
      </body>
    </html>
  );
}
