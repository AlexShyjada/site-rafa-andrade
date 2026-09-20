// ============================================================
// APIs públicas usadas pelos formulários
// ViaCEP  -> preenchimento de endereço
// IBGE    -> lista de municípios do estado
// ============================================================

import { somenteDigitos } from './formato';

export async function buscarCep(cep) {
  const limpo = somenteDigitos(cep);
  if (limpo.length !== 8) return null;

  const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
  if (!resposta.ok) throw new Error('Falha na consulta de CEP');

  const dados = await resposta.json();
  if (dados?.erro) return null;

  return {
    endereco: dados.logradouro || '',
    bairro: dados.bairro || '',
    cidade: dados.localidade || '',
    uf: dados.uf || ''
  };
}

export async function buscarMunicipios(uf) {
  const resposta = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
  );
  if (!resposta.ok) throw new Error('Falha ao buscar cidades');

  const dados = await resposta.json();
  return dados.map((c) => c.nome);
}
