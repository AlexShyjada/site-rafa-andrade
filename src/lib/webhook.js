// ============================================================
// Envio para o Apps Script.
//
// O Apps Script responde 200 mesmo quando recusa o cadastro, então o
// res.ok sozinho não serve: é preciso ler o corpo. A leitura é
// conservadora de propósito, para funcionar com qualquer doPost: só conta
// como falha quando a resposta diz isso explicitamente (ok: false, erro ou
// error). Qualquer outro JSON, ou uma resposta que nem seja JSON, continua
// valendo como sucesso. "ocupado" é o lock estourando em pico, e esse sim
// vale repetir.
// ============================================================

const MAX_TENTATIVAS = 3;

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export async function enviarParaPlanilha(endpoint, payload) {
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    let podeRepetir = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // text/plain evita o preflight CORS que o Apps Script não
          // responde corretamente. O corpo continua sendo JSON — o
          // doPost() faz JSON.parse(e.postData.contents).
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`http_${res.status}`);

      const data = await res.json().catch(() => null);
      if (!data) return;

      const recusou =
        data.ok === false || Boolean(data.erro) || Boolean(data.error);
      if (!recusou) return;

      const motivo = data.erro || data.error || 'falha';
      if (motivo !== 'ocupado') {
        // Erro de validação não melhora repetindo.
        podeRepetir = false;
        throw new Error(String(motivo));
      }
      throw new Error('ocupado');
    } catch (err) {
      if (!podeRepetir || tentativa === MAX_TENTATIVAS) throw err;
      await espera(400 * 2 ** (tentativa - 1) + Math.random() * 300);
    }
  }
}
