"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "../styles/contatos.module.css";
import { PiEnvelopeSimpleLight, PiArrowLeftLight } from "react-icons/pi";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { CONTACTO, HORARIO, MAPS_LINK } from "../dados/contacto";

const COORDENADAS = [41.8056038, -6.760175];

// "09:30" -> "9h30"
const formatarHora = (hora) => hora.replace(/^0/, "").replace(":", "h");

// dia da semana (0 = domingo) e hora "HH:MM" atuais no fuso de Portugal
function agoraEmPortugal() {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday"));
  return { dia, hora: `${valor("hour")}:${valor("minute")}` };
}

function Horario() {
  // calculado só no browser (evita diferenças entre o servidor e o cliente)
  const [agora, setAgora] = useState(null);

  useEffect(() => {
    const atualizar = () => setAgora(agoraEmPortugal());
    atualizar();
    const temporizador = setInterval(atualizar, 60000);
    return () => clearInterval(temporizador);
  }, []);

  const linhaHoje = agora && HORARIO.find((linha) => linha.diasSemana.includes(agora.dia));
  const abertoAgora =
    linhaHoje?.periodos.some(([inicio, fim]) => agora.hora >= inicio && agora.hora < fim) ?? false;

  return (
    <div className={styles.horario}>
      <div className={styles.horarioCabecalho}>
        <span>Horário</span>
        {agora && (
          <span className={`${styles.estado} ${abertoAgora ? styles.estadoAberto : ""}`}>
            {abertoAgora ? "Aberto agora" : "Fechado agora"}
          </span>
        )}
      </div>
      <ul>
        {HORARIO.map((linha) => (
          <li
            key={linha.dias}
            className={linha === linhaHoje ? styles.hoje : undefined}
            aria-current={linha === linhaHoje ? "date" : undefined}
          >
            <span>{linha.dias}</span>
            <span>
              {linha.periodos.length
                ? linha.periodos.map(([inicio, fim]) => `${formatarHora(inicio)} – ${formatarHora(fim)}`).join(" · ")
                : "Fechado"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Contatos() {
  const [formAberto, setFormAberto] = useState(false);
  const botaoMensagemRef = useRef(null);
  const formAbertoAnterior = useRef(formAberto);

  // acessibilidade: ao abrir o formulário o foco vai para o primeiro campo;
  // ao fechar volta para o botão do envelope (só quando o estado muda de facto)
  useEffect(() => {
    if (formAbertoAnterior.current === formAberto) return;
    formAbertoAnterior.current = formAberto;
    if (formAberto) document.getElementById("contacto-nome")?.focus({ preventScroll: true });
    else botaoMensagemRef.current?.focus({ preventScroll: true });
  }, [formAberto]);
  const mapaRef = useRef(null);

  // cria o mapa com o logótipo como marcador (Leaflet só corre no browser)
  useEffect(() => {
    let mapa;
    let observador;
    let cancelado = false;

    import("leaflet").then((modulo) => {
      const L = modulo.default ?? modulo;
      if (cancelado || !mapaRef.current) return;

      mapa = L.map(mapaRef.current, {
        center: COORDENADAS,
        zoom: 17,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // mapa do OpenStreetMap (gratuito, sem chave de API); o tom cinza é dado por CSS
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: styles.mapa_cinza,
        maxZoom: 19,
      }).addTo(mapa);

      const icone = L.divIcon({
        className: styles.marcador,
        html: `<span class="${styles.marcador_logo}"></span>`,
        iconSize: [64, 72],
        iconAnchor: [32, 72],
      });

      L.marker(COORDENADAS, { icon: icone, title: CONTACTO.nome, alt: CONTACTO.nome })
        .addTo(mapa)
        .on("click", () => window.open(MAPS_LINK, "_blank", "noopener"));

      // reajusta o mapa quando o painel do formulário muda de largura
      observador = new ResizeObserver(() => mapa.invalidateSize());
      observador.observe(mapaRef.current);
    });

    return () => {
      cancelado = true;
      observador?.disconnect();
      mapa?.remove();
    };
  }, []);

  // envia a mensagem do formulário pelo WhatsApp da barbearia
  function enviarMensagem(e) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const texto = `Olá! Sou ${dados.get("nome")} (${dados.get("email")}).\n\n${dados.get(
      "mensagem"
    )}`;
    window.open(
      `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener"
    );
    e.currentTarget.reset();
    setFormAberto(false);
  }

  return (
    <section
      id="contactos"
      className={`${styles.secao_contatos} ${formAberto ? styles.aberto : ""}`}
    >
      <div className={styles.painel}>
        {/* Apresentação: título, botão de mensagem e morada */}
        <div className={`${styles.conteudo} ${styles.apresentacao}`} aria-hidden={formAberto}>
          <h2 className={styles.titulo}>Contactos</h2>
          <p className={styles.subtitulo}>Se tiver alguma dúvida ou sugestão, contacte-nos!</p>

          <button
            type="button"
            ref={botaoMensagemRef}
            className={styles.botao_mensagem}
            onClick={() => setFormAberto(true)}
            aria-label="Enviar mensagem"
            tabIndex={formAberto ? -1 : 0}
          >
            <PiEnvelopeSimpleLight />
          </button>

          <div className={styles.morada}>
            <p>{CONTACTO.nome}</p>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              {CONTACTO.morada}
              <br />
              {CONTACTO.codigoPostal}
            </a>
            {CONTACTO.telefone && (
              <a href={`tel:${CONTACTO.telefone.replace(/\s/g, "")}`}>{CONTACTO.telefone}</a>
            )}
          </div>

          <Horario />

          <ul className={styles.redes}>
            {CONTACTO.instagram && (
              <li>
                <a href={CONTACTO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
              </li>
            )}
            {CONTACTO.facebook && (
              <li>
                <a href={CONTACTO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebookF />
                </a>
              </li>
            )}
            {CONTACTO.whatsapp && (
              <li>
                <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <FaWhatsapp />
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Formulário de contacto */}
        <div className={`${styles.conteudo} ${styles.formulario}`} aria-hidden={!formAberto}>
          <h2 className={styles.titulo}>
            <button
              type="button"
              className={styles.botao_voltar}
              onClick={() => setFormAberto(false)}
              aria-label="Voltar"
              tabIndex={formAberto ? 0 : -1}
            >
              <PiArrowLeftLight />
            </button>
            Contactos
          </h2>
          <p className={styles.subtitulo}>Se tiver alguma dúvida ou sugestão, contacte-nos!</p>

          <form className={styles.form} onSubmit={enviarMensagem}>
            <label htmlFor="contacto-nome" className="sr-only">Nome</label>
            <input id="contacto-nome" name="nome" type="text" autoComplete="name" placeholder="Nome" required tabIndex={formAberto ? 0 : -1} />
            <label htmlFor="contacto-email" className="sr-only">Email</label>
            <input id="contacto-email" name="email" type="email" autoComplete="email" placeholder="Email" required tabIndex={formAberto ? 0 : -1} />
            <label htmlFor="contacto-mensagem" className="sr-only">Mensagem</label>
            <textarea id="contacto-mensagem" name="mensagem" placeholder="Mensagem" rows={6} required tabIndex={formAberto ? 0 : -1} />
            <button
              type="submit"
              className={`${styles.botao_mensagem} ${styles.botao_enviar}`}
              aria-label="Enviar"
              tabIndex={formAberto ? 0 : -1}
            >
              <PiEnvelopeSimpleLight />
            </button>
          </form>
        </div>
      </div>

      {/* Mapa (visível a partir de tablet) */}
      <div className={styles.mapa}>
        <div ref={mapaRef} className={styles.mapa_leaflet} aria-label={`Mapa - ${CONTACTO.nome}`}></div>
      </div>
    </section>
  );
}
