// Estados brasileiros.
// As duas cores geram um ícone plano e simplificado, inspirado na paleta
// dominante de cada bandeira — não é reprodução literal da bandeira.
export const estados = [
  { sigla: 'AC', nome: 'Acre', cores: ['#0B7B3E', '#FFD400'] },
  { sigla: 'AL', nome: 'Alagoas', cores: ['#D32F2F', '#1565C0'] },
  { sigla: 'AP', nome: 'Amapá', cores: ['#1B5E20', '#0D47A1'] },
  { sigla: 'AM', nome: 'Amazonas', cores: ['#2E7D32', '#C62828'] },
  { sigla: 'BA', nome: 'Bahia', cores: ['#1565C0', '#C62828'] },
  { sigla: 'CE', nome: 'Ceará', cores: ['#1565C0', '#FBC02D'] },
  { sigla: 'DF', nome: 'Distrito Federal', cores: ['#1565C0', '#FBC02D'] },
  { sigla: 'ES', nome: 'Espírito Santo', cores: ['#1565C0', '#2E7D32'] },
  { sigla: 'GO', nome: 'Goiás', cores: ['#2E7D32', '#FBC02D'] },
  { sigla: 'MA', nome: 'Maranhão', cores: ['#C62828', '#212121'] },
  { sigla: 'MT', nome: 'Mato Grosso', cores: ['#1565C0', '#2E7D32'] },
  { sigla: 'MS', nome: 'Mato Grosso do Sul', cores: ['#1565C0', '#FBC02D'] },
  { sigla: 'MG', nome: 'Minas Gerais', cores: ['#C62828', '#212121'] },
  { sigla: 'PA', nome: 'Pará', cores: ['#2E7D32', '#1565C0'] },
  { sigla: 'PB', nome: 'Paraíba', cores: ['#C62828', '#2E7D32'] },
  { sigla: 'PR', nome: 'Paraná', cores: ['#2E7D32', '#FBC02D'] },
  { sigla: 'PE', nome: 'Pernambuco', cores: ['#FBC02D', '#C62828'] },
  { sigla: 'PI', nome: 'Piauí', cores: ['#2E7D32', '#C62828'] },
  { sigla: 'RJ', nome: 'Rio de Janeiro', cores: ['#1565C0', '#C62828'] },
  { sigla: 'RN', nome: 'Rio Grande do Norte', cores: ['#1565C0', '#C62828'] },
  { sigla: 'RS', nome: 'Rio Grande do Sul', cores: ['#C62828', '#2E7D32'] },
  { sigla: 'RO', nome: 'Rondônia', cores: ['#2E7D32', '#1565C0'] },
  { sigla: 'RR', nome: 'Roraima', cores: ['#2E7D32', '#FBC02D'] },
  { sigla: 'SC', nome: 'Santa Catarina', cores: ['#1565C0', '#C62828'] },
  { sigla: 'SP', nome: 'São Paulo', cores: ['#C62828', '#1565C0'] },
  { sigla: 'SE', nome: 'Sergipe', cores: ['#2E7D32', '#1565C0'] },
  { sigla: 'TO', nome: 'Tocantins', cores: ['#2E7D32', '#FBC02D'] }
];

export const UF_PADRAO = 'BA';

export const acharEstado = (sigla) => estados.find((e) => e.sigla === sigla);

export const nomeDoEstado = (sigla) => acharEstado(sigla)?.nome ?? '';
