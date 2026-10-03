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

// Cada card abre o PDF de propostas correspondente num leitor em modal (estilo
// e-book) que desenha o PDF original, em vetor, com pdf.js. O arquivo fica em
// public/propostas/<livro>.pdf. `paginas` = nº de páginas do PDF; `indice` lista
// cada proposta com a página em que ela começa.
export const propostas = {
  etiqueta: 'Nosso programa',
  titulo: ['Propostas para uma', 'Bahia Gloriosa!'],
  botao: 'Ver propostas',
  itens: [
    {
      icone: 'dinheiro',
      titulo: 'Economia',
      livro: 'economia',
      paginas: 25,
      indice: [
        ["IPVA PRODUTIVO", 1],
        ["IPVA CONSCIENTE", 3],
        ["IPVA 12X", 4],
        ["LIBERDADE ECONÔMICA BAIANA", 5],
        ["ICMS DEMOCRÁTICO", 7],
        ["HERANÇA JUSTA", 10],
        ["PONTE PARA A RENDA", 11],
        ["PROTENER — CADEIAS PRODUTIVAS REGIONAIS", 13],
        ["POLOS EM CADEIA", 15],
        ["MINERAL PARA TODOS VEREM", 18],
        ["MINERAL DE VALOR", 21],
        ["BAHIA NAS CADEIAS GLOBAIS", 24]
      ],
      texto:
        'IPVA Produtivo, IPVA 12x, ICMS Democrático, Herança Justa e mais: menos peso sobre quem produz e trabalha na Bahia.'
    },
    {
      icone: 'formatura',
      titulo: 'Educação',
      livro: 'educacao',
      paginas: 47,
      indice: [
        ["BAIANO CAPITALISTA", 1],
        ["IMED 2033", 3],
        ["CARTEIRINHA “0800”", 5],
        ["SUA MARCA ME EDUCA", 8],
        ["PRATO FEITO", 10],
        ["DIREITO DE ESTUDAR", 11],
        ["MARCO BAIANO DAS ESCOLAS CÍVICO-MILITARES", 14],
        ["EDUCAÇÃO DO FUTURO", 16],
        ["EDUCAÇÃO SEM TELA", 18],
        ["PROGRAMA “CUIDAR DE QUEM EDUCA”", 19],
        ["PROGRAMA “ESCOLA NOSSA”", 22],
        ["ESCOLA SEM MEDO", 23],
        ["APRENDER VALE+", 26],
        ["BOLSA EXCELÊNCIA", 28],
        ["PROGRAMA EDUCAÇÃO DO CAMPO", 30],
        ["ESCOLA CIDADÃ", 32],
        ["APRENDIZAGEM SEM LACUNAS", 34],
        ["CIÊNCIA QUE FICA", 36],
        ["IA APLICADA BAHIA", 39],
        ["PONTES DE CONHECIMENTO", 41],
        ["ESCOLA DE STARTUPS BAHIA", 43],
        ["APRENDIZAGEM COMPROVADA – FIM DA APROVAÇÃO AUTOMÁTICA", 47]
      ],
      texto:
        'Baiano Capitalista, Prato Feito, Educação sem Tela, Escola sem Medo e mais: qualidade e mérito na rede estadual.'
    },
    {
      icone: 'documento',
      titulo: 'Gestão Pública',
      livro: 'gestao',
      paginas: 56,
      indice: [
        ["PEC da OPOSIÇÃO", 1],
        ["BAHIA ALERTA", 3],
        ["TETO “COMPLETAMENTE” TRANSPARENTE BAHIA", 5],
        ["TRANSPARÊNCIA IMOBILIÁRIA", 7],
        ["TRANSPARÊNCIA NO “PATROCÍNIO PÚBLICO”", 9],
        ["QUEBROU, PAGOU", 11],
        ["SAC COM VAGA", 12],
        ["FISCAL DE INCENTIVOS", 13],
        ["EMENDA ÀS CLARAS", 15],
        ["BAHIA FISCAL", 17],
        ["DESTINO DO SALDO", 19],
        ["ESTADO EFICIENTE", 21],
        ["MAPA DA CAPACIDADE MUNICIPAL", 23],
        ["PROJETOS EM CONSÓRCIO", 25],
        ["DO REPASSE AO RESULTADO", 28],
        ["RESULTADO ÀS CLARAS", 31],
        ["ANTICAPTURA", 34],
        ["PRODUTIVIDADE DIGITAL", 36],
        ["ACESSO PÚBLICO SEM FAVORECIMENTO", 38],
        ["SERVIÇO PÚBLICO RESILIENTE", 40],
        ["FUNDO SOBERANO DA BAHIA — FSBa", 43],
        ["BAHIA ELÉTRICA", 48],
        ["BAHIA NUCLEAR", 53],
        ["TERRAS RARAS BAIANAS", 55]
      ],
      texto:
        'PEC da Oposição, Teto Completamente Transparente, Anticaptura, Estado Eficiente e mais: transparência e fiscalização.'
    },
    {
      icone: 'predio',
      titulo: 'Infraestrutura e Habitação',
      livro: 'infra',
      paginas: 24,
      indice: [
        ["PONTO FINAL", 1],
        ["PLANO DE INTEGRAÇÃO E DESENVOLVIMENTO DOS MUNICÍPIOS", 3],
        ["FIO DIRETO", 6],
        ["RAIO-X DAS ESTRADAS", 8],
        ["VILAS MILITARES PARA PM’S", 9],
        ["MÉRITO NA MORADIA", 12],
        ["MORAR BEM", 14],
        ["CARTEIRA COM CRITÉRIO", 17],
        ["CORREDOR FERRO-PORTUÁRIO", 19],
        ["CONEXÃO AÉREA REGIONAL", 21],
        ["INFRAESTRUTURA DIGITAL PRODUTIVA", 23]
      ],
      texto:
        'Ponto Final, Raio-X das Estradas, Morar Bem, Corredor Ferro-Portuário e mais: obras que saem do papel e terminam.'
    },
    {
      icone: 'folha',
      titulo: 'Agro e Meio Ambiente',
      livro: 'agro',
      paginas: 18,
      indice: [
        ["CÓDIGO RURAL", 1],
        ["MAPA DAS INVASÕES DE TERRA", 3],
        ["SEM TERRA / SEM MAMATA", 4],
        ["REGULARIZAÇÃO SEM ESBULHO", 5],
        ["CAMPO CONECTADO", 6],
        ["EMPRESA VERDE", 8],
        ["BAHIA ANTECIPA", 11],
        ["MAUS-TRATOS TÊM NOME", 12],
        ["JAVALI ZERO", 13],
        ["LICENÇA SEM RETRABALHO", 15],
        ["ATER+", 17]
      ],
      texto:
        'Código Rural, Regularização sem Esbulho, Campo Conectado, Javali Zero e mais: segurança e produtividade no campo.'
    },
    {
      icone: 'carrinho',
      titulo: 'Pró-Consumidor',
      livro: 'consumidor',
      paginas: 10,
      indice: [
        ["VERDADEIRA INTEIRA", 1],
        ["PRIMEIROS ERROS", 4],
        ["FRAUDE TEM DONO", 5],
        ["CANCELAMENTO “SEM RODEIO”", 7],
        ["LUZ ÀS CLARAS", 9]
      ],
      texto:
        'Verdadeira Inteira, Primeiros Erros, Fraude Tem Dono, Cancelamento sem Rodeio e Luz às Claras: o consumidor em primeiro lugar.'
    },
    {
      icone: 'coracao',
      titulo: 'Mulheres, Crianças, Idosos e Minorias',
      livro: 'mulheres',
      paginas: 17,
      indice: [
        ["RADAR FEMININO", 1],
        ["INFÂNCIA SEM NEGÓCIOS", 3],
        ["PALCO SEGURO", 5],
        ["ALERTA 60+", 8],
        ["NOVO FUTURO", 9],
        ["COMBATE A MENDICÂNCIA INFANTIL", 11],
        ["COMBATE A FALSAS DENUNCIAS", 12],
        ["VAGAS “ANTI-BOLSA”", 14],
        ["COMBATE AO TRIBUNAL RACIAL", 16]
      ],
      texto:
        'Radar Feminino, Infância sem Negócios, Alerta 60+, Palco Seguro e mais: proteção a quem mais precisa.'
    },
    {
      icone: 'museu',
      titulo: 'Cultura',
      livro: 'culturais',
      paginas: 10,
      indice: [
        ["2 DE JULHO SEM PALANQUE", 1],
        ["LEGADO PRÓ-VIDA", 4],
        ["CULTURA HONESTA", 5],
        ["PATRIMÔNIO VIVO", 7],
        ["MUSEUS VIVOS", 9]
      ],
      texto:
        '2 de Julho sem Palanque, Cultura Honesta, Patrimônio Vivo, Museus Vivos e Legado Pró-Vida: memória e identidade baiana.'
    },
    {
      icone: 'cruz',
      titulo: 'Católicos+',
      livro: 'catolicos',
      paginas: 24,
      indice: [
        ["NOSSAS RAÍZES", 1],
        ["NOSSA FÉ VIVE", 3],
        ["SEMANA DA CULTURA CATÓLICA DA BAHIA", 6],
        ["AMOR DE JESUS NA BAHIA", 7],
        ["CAMINHOS DE CRISTO", 9],
        ["PROCISSÃO DO SENHOR BOM JESUS DOS NAVEGANTES", 12],
        ["SANTA DULCE — PATRONA DA EDUCAÇÃO CATÓLICA NA BAHIA", 14],
        ["CAPITAL BAIANA DA ARTE SACRA", 15],
        ["DIA ESTADUAL DO CATEQUISTA", 16],
        ["DIA ESTADUAL DA PRIMEIRA MISSA NO BRASIL", 17],
        ["CORPUS CHRISTI DE 1549 — MEMÓRIA FUNDACIONAL DE SALVADOR", 19],
        ["ANTI-ANTISEMITISMO", 21],
        ["MEMÓRIA ANTI-NAZI", 24]
      ],
      texto:
        'Nossas Raízes, Santa Dulce, Caminhos de Cristo, Capital Baiana da Arte Sacra e mais: fé, história e patrimônio.'
    },
    {
      icone: 'lupa',
      titulo: 'CPIs',
      livro: 'cpis',
      paginas: 8,
      indice: [
        ["CPI DO CREDCRESTA", 1],
        ["CPI DA FILA DA MORTE", 3],
        ["CPI DAS FACÇÕES CRIMINOSAS", 5],
        ["CPI DA EVASÃO ESCOLAR", 7]
      ],
      texto:
        'CPI do CredCesta, da Fila da Morte, das Facções Criminosas e da Evasão Escolar: investigar para resolver.'
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
  ],
  endereco: 'Praça Rockfeller, 84 – Apto 301, Barris, Salvador – BA, 40070-170',
  copyright:
    '© 2026 Eleição Rafael de Andrade Freire Brito – Deputado Estadual · 68.455.295/0001-24'
};

export const cookies = {
  texto: 'Este site utiliza cookies. Ao continuar navegando, você concorda com o uso deles.',
  botao: 'Ok'
};
