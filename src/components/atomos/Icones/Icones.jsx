// Ícones de linha, 24x24, desenhados para o site.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

const caminhos = {
  martelo: (
    <>
      <path d="M3 21h8" />
      <path d="M7 21v-7" />
      <path d="m10.5 10.5 3-3" />
      <rect x="11.5" y="3.5" width="9" height="4" rx="1" transform="rotate(45 16 5.5)" />
      <path d="M5.5 12.5 9.5 8.5" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3 5 6v5.5c0 4 3 7.6 7 9.5 4-1.9 7-5.5 7-9.5V6z" />
      <path d="m9.5 12 1.8 1.8 3.4-3.6" />
    </>
  ),
  imposto: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m9 15 6-6" />
      <circle cx="9.5" cy="9.5" r="1.2" />
      <circle cx="14.5" cy="14.5" r="1.2" />
    </>
  ),
  raio: <path d="M13 2 4.5 13H11l-1 9 8.5-11H12z" />,
  dinheiro: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10v4M18 10v4" />
    </>
  ),
  lupa: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  coracao: (
    <path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z" />
  ),
  formatura: (
    <>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5z" />
      <path d="M6.5 10.8V15c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.2" />
      <path d="M21.5 8.5V14" />
    </>
  ),
  seta: <path d="M5 12h13m-5-5 5 5-5 5" />,
  setaDiagonal: <path d="M7 17 17 7m0 0h-7m7 0v7" />,
  setaCima: <path d="M12 19V5m-6 6 6-6 6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  whatsapp: (
    <>
      <path d="M4 20l1.2-3.6A7.5 7.5 0 1 1 8 19.2z" />
      <path d="M9 10c.3 1.6 2.3 3.6 3.9 3.9l.9-1.1 1.7.7v1.4c-2.6.5-6.3-3.1-5.8-5.8h1.4l.7 1.7z" />
    </>
  ),
  check: <path d="m5 13 4.2 4.2L19 7.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  fechar: <path d="m6 6 12 12M18 6 6 18" />
};

export default function Icone({ nome, tamanho = 24, ...resto }) {
  const desenho = caminhos[nome];
  if (!desenho) return null;

  return (
    <svg {...base} width={tamanho} height={tamanho} aria-hidden="true" focusable="false" {...resto}>
      {desenho}
    </svg>
  );
}
