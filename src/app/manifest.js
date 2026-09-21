import { site } from '@/dados/site';

export default function manifest() {
  return {
    name: `${site.nome} ${site.numero}`,
    short_name: site.nome,
    description: site.descricao,
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#141414',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/android-chrome-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
