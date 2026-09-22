// ============================================================
// Conteúdo e configuração do site. Tudo que é texto, link ou
// endpoint mora aqui — para editar a campanha não é preciso
// mexer nos componentes.
// ============================================================

export const site = {
  nome: 'Rafa Andrade',
  numero: '14014',
  cargo: 'Deputado Estadual',
  etiquetaLogo: 'Deputado Estadual',
  // wordmark oficial: versão clara no cabeçalho, versão cinza no rodapé
  logo: '/imagens/rafa-andrade.svg',
  logoRodape: '/imagens/rafa-andrade-rodape.svg',
  titulo: 'Rafa Andrade 14014 · Candidato a Deputado Estadual na Bahia',
  descricao:
    'Sou da nova geração que é preparada para combater privilégios, fortalecer a segurança pública, defender a liberdade econômica e representar quem realmente trabalha.'
};

export const navegacao = [
  { rotulo: 'Início', href: '#inicio' },
  { rotulo: 'Propostas', href: '#propostas' },
  { rotulo: 'Nossos grupos', href: '#grupos-whatsapp' },
  { rotulo: 'Material de campanha', href: '#material-de-campanha' }
];

export const ctaDoacao = { rotulo: 'Doe para campanha', href: '#faca-uma-doacao' };

export const hero = {
  titulo: ['Coragem para defender', 'a Bahia!'],
  texto:
    'Sou da nova geração que é preparada para combater privilégios, fortalecer a segurança pública, defender a liberdade econômica e representar quem realmente trabalha.',
  botoes: [
    { rotulo: 'Conhecer propostas', href: '#propostas', variante: 'escuro' },
    { rotulo: 'Quero apoiar', href: '#faca-uma-doacao', variante: 'amarelo' }
  ],
  imagem: '/imagens/hero.png'
};

export const ticker = ['Candidato a Deputado Estadual', '14014', 'Por uma Bahia Gloriosa!'];

export const propostas = {
  etiqueta: 'Nosso programa',
  titulo: ['Propostas para uma', 'Bahia Gloriosa!'],
  itens: [
    {
      icone: 'martelo',
      titulo: 'Combate à Corrupção',
      texto:
        'Transparência radical em contratos públicos, fiscalização permanente e punição rigorosa para desvios de recursos.'
    },
    {
      icone: 'escudoMais',
      titulo: 'Segurança Pública',
      texto:
        'Apoio incondicional às forças policiais, endurecimento contra o crime organizado e proteção ao cidadão de bem.'
    },
    {
      icone: 'graficoQueda',
      titulo: 'Redução de Impostos',
      texto:
        'Simplificação tributária para empresas e famílias, com revisão de tributos que sufocam o trabalhador baiano.'
    },
    {
      icone: 'documento',
      titulo: 'Desburocratização',
      texto:
        'Menos burocracia, mais agilidade. Estado eficiente que serve à sociedade, e não o contrário.'
    },
    {
      icone: 'dinheiro',
      titulo: 'Liberdade Econômica',
      texto:
        'Ambiente favorável ao empreendedorismo, geração de emprego e proteção à propriedade privada.'
    },
    {
      icone: 'lupa',
      titulo: 'Fiscalização',
      texto:
        'Vigilância permanente sobre o uso do dinheiro público em todos os níveis da administração estadual.'
    },
    {
      icone: 'coracao',
      titulo: 'Proteção da Família',
      texto:
        'Defesa intransigente dos valores familiares e dos direitos dos pais sobre a educação dos filhos.'
    },
    {
      icone: 'formatura',
      titulo: 'Educação',
      texto:
        'Foco em qualidade, meritocracia, formação técnica e liberdade para escolha educacional das famílias.'
    }
  ]
};

export const grupos = {
  etiqueta: 'Renan Santos + Rafa Andrade',
  titulo: ['Participe dos', 'Nossos', 'Grupos'],
  imagemFundo: '/imagens/grupos-fundo.png',
  botao: 'ASSINAR',
  aviso: 'Ao participar, você concorda em receber comunicações e atualizações.',
  // Webhook do Apps Script "Webhook Framer - grupos Renan + Rafa"
  webhook:
    'https://script.google.com/macros/s/AKfycbxyIG-nUFZXcG-NHOz-dhPx_iFkFnLjMGKyHEjYsdD-eU3WQP3M0ayJFWPoDDr93GJM7Q/exec',
  sucesso: {
    titulo: 'Obrigado por participar das nossas trincheiras!',
    texto: 'Seu cadastro foi confirmado. Agora entre no nosso grupo.',
    grupo: {
      nome: 'RAFA ANDRADE 14014 & RENAN 14 | COMUNIDADE OFICIAL ⬛️⬜️🟨',
      legenda: 'Convite para conversa em grupo',
      // coloque a foto do grupo em /public/imagens e aponte aqui
      imagem: '',
      rotuloBotao: 'Abrir app',
      link: 'https://chat.whatsapp.com/LRjGazqDcGx0eYJ04C5ZdB'
    },
    // 0 desliga o redirecionamento e deixa só o botão
    segundosParaAbrir: 3
  }
};

export const material = {
  etiqueta: 'Faça parte',
  titulo: ['Receba o material', 'de campanha'],
  botao: 'QUERO RECEBER',
  aviso: 'Ao participar, você concorda em receber comunicações e atualizações.',
  // Webhook do Apps Script "Webhook Framer - material de campanha"
  webhook:
    'https://script.google.com/macros/s/AKfycbwOSsGO3fYpLkNTFUz6VeGkPqHZRe4_yQoT2Z6wDd3uYLNL8kNxHj66GGEFAzPk8u23/exec',
  sucesso: {
    titulo: 'Cadastro enviado com sucesso.',
    texto: 'Em breve entraremos em contato para fornecer o material.',
    // O card de convite só aparece se houver link aqui.
    grupo: {
      nome: 'RAFA ANDRADE 14014 & RENAN 14 | COMUNIDADE OFICIAL ⬛️⬜️🟨',
      legenda: 'Convite para conversa em grupo',
      imagem: '',
      rotuloBotao: 'Abrir app',
      link: ''
    },
    segundosParaAbrir: 3
  }
};

export const doacao = {
  etiqueta: 'Apoie a campanha',
  titulo: ['Uma campanha', 'sem dono'],
  texto:
    'Não temos empreiteira, banco nem fundão bancando esta candidatura. Ela se sustenta com doação de gente comum e é isso que nos deixa livres para dizer o que precisa ser dito.',
  card: {
    etiqueta: 'Cartão e parcelado',
    plataforma: 'Quero Apoiar',
      plataformaLogo: '/imagens/quero-apoiar.svg',
    titulo: 'Vaquinha eleitoral',
    texto:
      'A plataforma oficial aceita cartão de crédito, boleto e Pix, emite o recibo eleitoral na hora e já entrega tudo pronto para a prestação de contas.',
    botao: 'Doar na vaquinha',
    link: 'https://queroapoiar.com.br/rafandrade',
    nota:
      'Pessoa física pode doar até 10% dos rendimentos brutos declarados no ano anterior, como manda a Lei Eleitoral.'
  }
};

export const rodape = {
  links: [
    { rotulo: 'Propostas a Bahia', href: '#propostas' },
    { rotulo: 'Nossos grupos', href: '#grupos-whatsapp' },
    { rotulo: 'Material de campanha', href: '#material-de-campanha' }
  ]
};
