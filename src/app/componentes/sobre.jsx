"use client";

import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import styles from "../styles/sobre.module.css";

// versões comprimidas: 1080p (desktop/tablet) e 720p (telemóvel); o original fica fora do site
const VIDEO = "/video_monte_bravo.mp4";
const VIDEO_MOBILE = "/video_monte_bravo_mobile.mp4";
const escolherVideo = () => (window.matchMedia("(max-width: 767px)").matches ? VIDEO_MOBILE : VIDEO);

export default function Sobre() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const pausadoRef = useRef(false); // pausa pedida pelo utilizador
  // estado real do vídeo, atualizado pelos eventos play/pause (define o ícone do botão)
  const [aTocar, setATocar] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // quem pede menos movimento (ou poupança de dados) começa com o vídeo parado
    const poupar =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.connection?.saveData === true;
    if (poupar) pausadoRef.current = true;

    // o vídeo só é descarregado quando a secção está prestes a aparecer no ecrã
    // (antes era descarregado logo ao abrir o site, mesmo no telemóvel)
    const carregar = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        video.src = escolherVideo();
        video.load();
        carregar.disconnect();
      },
      { rootMargin: "300px 0px" }
    );
    carregar.observe(section);

    // pausa/retoma conforme a visibilidade da secção
    const visibilidade = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          if (!pausadoRef.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    visibilidade.observe(section);

    return () => {
      carregar.disconnect();
      visibilidade.disconnect();
    };
  }, []);

  // botão pausar / retomar o vídeo
  const alternarVideo = () => {
    const video = videoRef.current;
    pausadoRef.current = !pausadoRef.current;
    if (pausadoRef.current) video.pause();
    else {
      if (!video.src) video.src = escolherVideo();
      video.play().catch(() => {});
    }
  };

  return (
    <section id="sobre" ref={sectionRef} className={styles.sobre_Container}>
      <div className={styles.video_Wrapper}>
        <video
          ref={videoRef}
          className={styles.video_Element}
          controls={false}
          preload="none"
          playsInline
          muted
          loop
          aria-hidden="true"
          onPlay={() => setATocar(true)}
          onPause={() => setATocar(false)}
        />
        <button
          type="button"
          className={styles.botaoVideo}
          onClick={alternarVideo}
          aria-label={aTocar ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          {aTocar ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
        </button>
      </div>

      <div className={styles.texto_Wrapper}>
        <h2 className={styles.titulo}>Sobre a Barbearia Monte Bravo</h2>
        <p className={styles.citacao}>“Das montanhas do norte, nasce a força de um novo estilo.”</p>
        <p>
          A Monte Bravo não é só uma barbearia. É um símbolo de tradição,
          bravura e identidade. Inspirados na imponência das nossas montanhas,
          na autenticidade dos homens do norte e na arte da navalha, criamos um
          espaço para aqueles que valorizam qualidade, respeito e atitude.
          <br />
          <br />
          Aqui, cada corte é uma experiência. Cada barba, uma marca de
          personalidade. Cada cliente, parte da nossa história.
          <br />
          <br />
          No coração de Bragança, criamos um lugar onde o tempo desacelera. Na
          Monte Bravo, serás recebido com café quente, conversa boa e um
          ambiente pensado para inspirar confiança.
          <br />
          <br />
          Cada detalhe foi desenhado para oferecer o que realmente importa: um
          momento só teu.
          <br />
          <br />A Monte Bravo está à tua espera. Vem viver a experiência.
        </p>
      </div>
    </section>
  );
}
