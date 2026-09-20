// ============================================================
// Máscaras, normalização e validações dos formulários
// ============================================================

export function normalizar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export const somenteDigitos = (valor) => (valor || '').replace(/\D/g, '');

/** (71) 99999-9999 */
export function mascaraTelefone(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  let saida = d;
  if (d.length > 0) saida = `(${d.slice(0, 2)}`;
  if (d.length >= 3) saida += `) ${d.slice(2, 7)}`;
  if (d.length >= 8) saida += `-${d.slice(7, 11)}`;
  return saida;
}

/**
 * Fora do Brasil não há máscara: só dígitos. O E.164 permite no máximo
 * 15 dígitos contando o DDI.
 */
export function mascaraTelefoneIntl(valor) {
  return somenteDigitos(valor).slice(0, 15);
}

export function formatarTelefone(valor, iso) {
  return iso === 'BR' ? mascaraTelefone(valor) : mascaraTelefoneIntl(valor);
}

export function telefoneValido(valor, iso) {
  if (iso === 'BR') return /^\(\d{2}\) 9\d{4}-\d{4}$/.test(valor);
  const d = somenteDigitos(valor);
  return d.length >= 6 && d.length <= 15;
}

/** 00000-000 */
export function mascaraCep(valor) {
  const d = somenteDigitos(valor).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function cepValido(valor) {
  return somenteDigitos(valor).length === 8;
}

/** Nome e sobrenome, cada um com 2 letras ou mais */
export function nomeValido(valor) {
  const partes = (valor || '').trim().split(/\s+/).filter(Boolean);
  return partes.length >= 2 && partes.every((p) => p.length >= 2);
}

export function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test((valor || '').trim());
}

/** Junta DDI e telefone como a planilha espera: "+55 (71) 99999-9999" */
export function telefoneComDdi(ddi, telefone) {
  return `+${ddi} ${telefone}`.trim();
}

/**
 * Só aceita https. Evita que um valor colado errado vire um
 * "javascript:" navegável.
 */
export function linkSeguro(url) {
  const v = (url || '').trim();
  return /^https:\/\//i.test(v) ? v : '';
}
