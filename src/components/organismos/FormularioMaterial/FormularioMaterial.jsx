'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Campo from '@/components/atomos/Campo/Campo';
import Icone from '@/components/atomos/Icones/Icones';
import BandeiraEstado from '@/components/atomos/BandeiraEstado/BandeiraEstado';
import Seletor from '@/components/moleculas/Seletor/Seletor';
import SeletorPais from '@/components/moleculas/SeletorPais/SeletorPais';
import ConviteWhatsApp from '@/components/moleculas/ConviteWhatsApp/ConviteWhatsApp';
import { buscarCep, buscarMunicipios } from '@/lib/apis';
import { enviarParaPlanilha } from '@/lib/webhook';
import { acharPais, PAIS_PADRAO } from '@/dados/paises';
import { estados, UF_PADRAO } from '@/dados/estados';
import { material } from '@/dados/site';
import {
  cepValido as ehCepValido,
  emailValido,
  formatarTelefone,
  mascaraCep,
  nomeValido,
  normalizar,
  somenteDigitos,
  telefoneComDdi,
  telefoneValido
} from '@/lib/formato';
import estilos from '@/styles/formulario.module.css';

export default function FormularioMaterial() {
  // Campos, na mesma ordem das colunas da planilha
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [paisIso, setPaisIso] = useState(PAIS_PADRAO);
  const [whatsapp, setWhatsapp] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState(UF_PADRAO);

  // Cidades (IBGE)
  const [cidades, setCidades] = useState([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroCidades, setErroCidades] = useState(false);
  // UF a que a lista `cidades` atualmente pertence.
  const [ufDasCidades, setUfDasCidades] = useState(null);
  // Cidade devolvida pelo ViaCEP, aguardando a lista do IBGE daquela UF.
  const [cidadePendente, setCidadePendente] = useState(null);

  // CEP (ViaCEP): 'parado' | 'buscando' | 'ok' | 'naoEncontrado' | 'erro'
  const [statusCep, setStatusCep] = useState('parado');

  const [tocado, setTocado] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const digitosCep = somenteDigitos(cep);
  const pais = acharPais(paisIso);

  // Carrega cidades sempre que a UF muda
  useEffect(() => {
    let cancelado = false;
    setCarregandoCidades(true);
    setErroCidades(false);
    setCidade('');

    buscarMunicipios(uf)
      .then((lista) => {
        if (cancelado) return;
        setCidades(lista);
        setUfDasCidades(uf);
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

  // Consulta o ViaCEP assim que o CEP fica completo (8 dígitos)
  useEffect(() => {
    if (digitosCep.length !== 8) {
      setStatusCep('parado');
      return undefined;
    }

    let cancelado = false;
    setStatusCep('buscando');

    buscarCep(digitosCep)
      .then((achado) => {
        if (cancelado) return;
        if (!achado) {
          setStatusCep('naoEncontrado');
          return;
        }
        setStatusCep('ok');
        if (achado.endereco) setEndereco(achado.endereco);
        if (achado.bairro) setBairro(achado.bairro);
        if (achado.uf) {
          // A cidade só pode ser aplicada depois que a lista do IBGE daquela
          // UF estiver carregada — daí a pendência. Guardar a UF junto evita
          // casar a cidade contra a lista antiga.
          if (achado.cidade) {
            setCidadePendente({ uf: achado.uf, nome: achado.cidade });
          }
          setUf(achado.uf);
        }
      })
      .catch(() => {
        if (!cancelado) setStatusCep('erro');
      });

    return () => {
      cancelado = true;
    };
  }, [digitosCep]);

  // Aplica a cidade vinda do ViaCEP quando a lista do IBGE chega
  useEffect(() => {
    if (!cidadePendente) return;
    if (ufDasCidades !== cidadePendente.uf || cidades.length === 0) return;

    const alvo = normalizar(cidadePendente.nome);
    const encontrada = cidades.find((c) => normalizar(c) === alvo);
    if (encontrada) setCidade(encontrada);
    setCidadePendente(null);
  }, [cidadePendente, cidades, ufDasCidades]);

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

  function trocarPais(iso) {
    setPaisIso(iso);
    setWhatsapp((v) => formatarTelefone(v, iso));
  }

  // Validação
  const nomeOk = nomeValido(nome);
  const emailOk = emailValido(email);
  const whatsappOk = telefoneValido(whatsapp, paisIso);
  const cepOk = ehCepValido(cep);
  const enderecoOk = endereco.trim().length >= 3;
  const numeroOk = numero.trim().length >= 1;
  const bairroOk = bairro.trim().length >= 2;
  const cidadeOk = Boolean(cidade);
  const ufOk = Boolean(uf);
  // Complemento é opcional.

  // Os campos de endereço só aparecem depois que o CEP tem 8 dígitos E a
  // consulta ao ViaCEP terminou (com sucesso ou não). Enquanto está
  // carregando, o bloco fica escondido para evitar que a pessoa comece a
  // digitar num campo que a API vai sobrescrever meio segundo depois.
  const mostrarEndereco =
    cepOk &&
    (statusCep === 'ok' ||
      statusCep === 'naoEncontrado' ||
      statusCep === 'erro');

  const formularioOk =
    nomeOk &&
    emailOk &&
    whatsappOk &&
    cepOk &&
    mostrarEndereco &&
    enderecoOk &&
    numeroOk &&
    bairroOk &&
    cidadeOk &&
    ufOk;

  const marcar = (campo) => () => setTocado((t) => ({ ...t, [campo]: true }));

  const dicaCep =
    statusCep === 'buscando'
      ? 'Buscando endereço...'
      : statusCep === 'ok'
        ? 'Endereço preenchido automaticamente.'
        : statusCep === 'naoEncontrado'
          ? 'CEP não encontrado — preencha o endereço manualmente.'
          : statusCep === 'erro'
            ? 'Não foi possível consultar o CEP — preencha manualmente.'
            : undefined;

  async function enviar(evento) {
    evento.preventDefault();
    setTocado({
      nome: true,
      email: true,
      whatsapp: true,
      cep: true,
      endereco: true,
      numero: true,
      bairro: true,
      cidade: true,
      uf: true
    });
    if (!formularioOk || enviando) return;

    // As chaves abaixo espelham as colunas da planilha.
    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: telefoneComDdi(pais.ddi, whatsapp),
      cep: mascaraCep(cep),
      endereco: endereco.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      bairro: bairro.trim(),
      cidade,
      uf // sigla
    };

    setEnviando(true);
    setErroEnvio('');
    try {
      await enviarParaPlanilha(material.webhook, payload);
      setEnviado(true);
    } catch {
      setErroEnvio(
        'Não foi possível enviar. Verifique sua conexão e tente novamente.'
      );
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
              <h3 className={estilos.sucessoTitulo}>
                {material.sucesso.titulo}
              </h3>
              {material.sucesso.texto && (
                <p className={estilos.sucessoTexto}>{material.sucesso.texto}</p>
              )}
            </div>

            {material.sucesso.grupo?.link && (
              <ConviteWhatsApp
                nome={material.sucesso.grupo.nome}
                legenda={material.sucesso.grupo.legenda}
                imagem={material.sucesso.grupo.imagem}
                rotuloBotao={material.sucesso.grupo.rotuloBotao}
                url={material.sucesso.grupo.link}
                segundosParaAbrir={material.sucesso.segundosParaAbrir}
              />
            )}
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

              <Campo
                valor={email}
                aoMudar={setEmail}
                aoSair={marcar('email')}
                invalido={tocado.email && !emailOk}
                erro="Informe um e-mail válido."
                placeholder="Seu e-mail"
                inputMode="email"
                autoComplete="email"
              />

              <div className={`${estilos.linha} ${estilos.linhaTelefone}`}>
                <SeletorPais valor={paisIso} aoMudar={trocarPais} />
                <Campo
                  valor={whatsapp}
                  aoMudar={(v) => setWhatsapp(formatarTelefone(v, paisIso))}
                  aoSair={marcar('whatsapp')}
                  invalido={tocado.whatsapp && !whatsappOk}
                  erro="Informe um WhatsApp válido."
                  placeholder={
                    paisIso === 'BR' ? '(DD) 9XXXX-XXXX' : 'Número do WhatsApp'
                  }
                  inputMode="tel"
                  autoComplete="tel-national"
                />
              </div>

              <Campo
                valor={cep}
                aoMudar={(v) => setCep(mascaraCep(v))}
                aoSair={marcar('cep')}
                invalido={tocado.cep && !cepOk}
                erro="Informe um CEP com 8 dígitos."
                dica={dicaCep}
                placeholder="CEP: 00000-000"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
              />

              {mostrarEndereco && (
                <div className={estilos.revelar}>
                  <Campo
                    valor={endereco}
                    aoMudar={setEndereco}
                    aoSair={marcar('endereco')}
                    invalido={tocado.endereco && !enderecoOk}
                    erro="Informe o endereço."
                    placeholder="Endereço (rua, avenida...)"
                    autoComplete="address-line1"
                  />

                  <div className={`${estilos.linha} ${estilos.linhaNumero}`}>
                    <Campo
                      valor={numero}
                      aoMudar={setNumero}
                      aoSair={marcar('numero')}
                      invalido={tocado.numero && !numeroOk}
                      erro="Obrigatório."
                      placeholder="Número"
                      inputMode="numeric"
                    />
                    <Campo
                      valor={complemento}
                      aoMudar={setComplemento}
                      placeholder="Complemento (opcional)"
                      autoComplete="address-line2"
                    />
                  </div>

                  <Campo
                    valor={bairro}
                    aoMudar={setBairro}
                    aoSair={marcar('bairro')}
                    invalido={tocado.bairro && !bairroOk}
                    erro="Informe o bairro."
                    placeholder="Bairro"
                  />

                  <div className={`${estilos.linha} ${estilos.linhaCidade}`}>
                    <Seletor
                      placeholder="Selecione a cidade"
                      opcoes={opcoesCidade}
                      valor={cidade}
                      aoMudar={setCidade}
                      desabilitado={!uf || carregandoCidades || erroCidades}
                      dicaDesabilitado={
                        erroCidades
                          ? 'Não foi possível carregar as cidades'
                          : undefined
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

                    <Seletor
                      placeholder="Estado"
                      opcoes={opcoesEstado}
                      valor={uf}
                      aoMudar={setUf}
                      temErro={tocado.uf && !ufOk}
                      erro="Selecione um estado."
                      aoValidarSaida={marcar('uf')}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={estilos.enviar}
                disabled={!formularioOk || enviando}
              >
                {enviando ? 'Enviando...' : material.botao}
                {!enviando && <Icone nome="seta" tamanho={18} />}
              </button>
            </div>

            {erroEnvio && (
              <p className={estilos.erroEnvio} role="alert">
                {erroEnvio}
              </p>
            )}

            {material.aviso && (
              <p className={estilos.consentimento}>{material.aviso}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
