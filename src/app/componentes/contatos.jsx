"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import styles from "../styles/contatos.module.css";
import { PiEnvelopeSimpleLight, PiArrowLeftLight } from "react-icons/pi";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { CONTACTO, MAPS_LINK } from "../dados/contacto";

const COORDENADAS = [41.8056038, -6.760175];

export default function Contatos() {
  const [formAberto, setFormAberto] = useState(false);
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
            <input name="nome" type="text" placeholder="Nome" required tabIndex={formAberto ? 0 : -1} />
            <input name="email" type="email" placeholder="Email" required tabIndex={formAberto ? 0 : -1} />
            <textarea name="mensagem" placeholder="Mensagem" rows={6} required tabIndex={formAberto ? 0 : -1} />
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
