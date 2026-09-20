'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Campo from '@/components/atomos/Campo/Campo';
import Icone from '@/components/atomos/Icones/Icones';
import BandeiraEstado from '@/components/atomos/BandeiraEstado/BandeiraEstado';
import Seletor from '@/components/moleculas/Seletor/Seletor';
import SeletorPais from '@/components/moleculas/SeletorPais/SeletorPais';
import ConviteWhatsApp from '@/components/moleculas/ConviteWhatsApp/ConviteWhatsApp';
import { buscarMunicipios } from '@/lib/apis';
import { enviarParaPlanilha } from '@/lib/webhook';
import { acharPais, PAIS_PADRAO } from '@/dados/paises';
import { estados, nomeDoEstado, UF_PADRAO } from '@/dados/estados';
import { grupos } from '@/dados/site';
import {
  formatarTelefone,
  nomeValido,
  telefoneComDdi,
  telefoneValido
} from '@/lib/formato';
import estilos from '@/styles/formulario.module.css';

export default function FormularioGrupos() {
  const [nome, setNome] = useState('');
  const [paisIso, setPaisIso] = useState(PAIS_PADRAO);
  const [telefone, setTelefone] = useState('');
  const [uf, setUf] = useState(UF_PADRAO);
  const [cidade, setCidade] = useState('');

  const [cidades, setCidades] = useState([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroCidades, setErroCidades] = useState(false);

  const [tocado, setTocado] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(false);

  const pais = acharPais(paisIso);

  // Carrega cidades sempre que o estado muda
  useEffect(() => {
    let cancelado = false;
    setCarregandoCidades(true);
    setErroCidades(false);
    setCidade('');

    buscarMunicipios(uf)
      .then((lista) => {
        if (!cancelado) setCidades(lista);
      })
      .catch(() => {
        if (!cancelado) setErroCidades(true);
      })
      .finally(() => {
        if (!cancelado) setCarregandoCidades(false);
      });

    return () => {
      cancelado = true;
    };
  }, [uf]);

  const opcoesEstado = useMemo(
    () =>
      estados.map((e) => ({
        valor: e.sigla,
        rotulo: e.nome,
        icone: <BandeiraEstado cores={e.cores} />
      })),
    []
  );

  const opcoesCidade = useMemo(
    () => cidades.map((c) => ({ valor: c, rotulo: c })),
    [cidades]
  );

  // Troca de país reaplica a formatação: sair do Brasil descarta a máscara
  // (DD) 9XXXX-XXXX e mantém só os dígitos; voltar reaplica a máscara.
  function trocarPais(iso) {
    setPaisIso(iso);
    setTelefone((v) => formatarTelefone(v, iso));
  }

  const nomeOk = nomeValido(nome);
  const telefoneOk = telefoneValido(telefone, paisIso);
  const estadoOk = Boolean(uf);
  const cidadeOk = Boolean(cidade);
  const formularioOk = nomeOk && telefoneOk && estadoOk && cidadeOk;

  const marcar = (campo) => () => setTocado((t) => ({ ...t, [campo]: true }));

  async function enviar(evento) {
    evento.preventDefault();
    setTocado({ nome: true, telefone: true, estado: true, cidade: true });
    if (!formularioOk || enviando) return;

    // As chaves abaixo espelham as colunas da planilha.
    const payload = {
      nome: nome.trim(),
      telefone: telefoneComDdi(pais.ddi, telefone),
      estado: nomeDoEstado(uf),
      cidade
    };

    setEnviando(true);
    setErroEnvio(false);
    try {
      await enviarParaPlanilha(grupos.webhook, payload);
      setEnviado(true);
    } catch {
      setErroEnvio(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={estilos.cartao}>
      <AnimatePresence mode="wait">
        {enviado ? (
          <motion.div
            key="sucesso"
            className={estilos.sucesso}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <h3 className={estilos.sucessoTitulo}>{grupos.sucesso.titulo}</h3>
              {grupos.sucesso.texto && (
                <p className={estilos.sucessoTexto}>{grupos.sucesso.texto}</p>
              )}
            </div>

            <ConviteWhatsApp
              nome={grupos.sucesso.grupo.nome}
              legenda={grupos.sucesso.grupo.legenda}
              imagem={grupos.sucesso.grupo.imagem}
              rotuloBotao={grupos.sucesso.grupo.rotuloBotao}
              url={grupos.sucesso.grupo.link}
              segundosParaAbrir={grupos.sucesso.segundosParaAbrir}
            />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={enviar}
            noValidate
            exit={{ opacity: 0, y: -8 }}
          >
            <div className={estilos.campos}>
              <Campo
                valor={nome}
                aoMudar={setNome}
                aoSair={marcar('nome')}
                invalido={tocado.nome && !nomeOk}
                erro="Informe nome e sobrenome."
                placeholder="Seu nome completo"
                autoComplete="name"
              />

              <div className={`${estilos.linha} ${estilos.linhaTelefone}`}>
                <SeletorPais valor={paisIso} aoMudar={trocarPais} />
                <Campo
                  valor={telefone}
                  aoMudar={(v) => setTelefone(formatarTelefone(v, paisIso))}
                  aoSair={marcar('telefone')}
                  invalido={tocado.telefone && !telefoneOk}
                  erro="Informe um WhatsApp válido."
                  placeholder={
                    paisIso === 'BR' ? '(DD) 9XXXX-XXXX' : 'Número do WhatsApp'
                  }
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>

              <Seletor
                placeholder="Selecione o estado"
                opcoes={opcoesEstado}
                valor={uf}
                aoMudar={setUf}
                temErro={tocado.estado && !estadoOk}
                erro="Selecione um estado."
                aoValidarSaida={marcar('estado')}
              />

              <Seletor
                placeholder={
                  uf ? 'Selecione a cidade' : 'Selecione um estado primeiro'
                }
                opcoes={opcoesCidade}
                valor={cidade}
                aoMudar={setCidade}
                desabilitado={!uf || carregandoCidades || erroCidades}
                dicaDesabilitado={
                  erroCidades ? 'Não foi possível carregar as cidades' : undefined
                }
                carregando={carregandoCidades}
                temErro={tocado.cidade && !cidadeOk}
                erro={
                  erroCidades
                    ? 'Não foi possível carregar as cidades.'
                    : 'Selecione uma cidade.'
                }
                aoValidarSaida={marcar('cidade')}
              />

              <button
                type="submit"
                className={estilos.enviar}
                disabled={!formularioOk || enviando}
              >
                {enviando ? 'Enviando...' : grupos.botao}
                {!enviando && <Icone nome="seta" tamanho={18} />}
              </button>
            </div>

            {erroEnvio && (
              <p className={estilos.erroEnvio} role="alert">
                Não foi possível enviar. Verifique sua conexão e tente
                novamente.
              </p>
            )}

            {grupos.aviso && (
              <p className={estilos.consentimento}>{grupos.aviso}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
