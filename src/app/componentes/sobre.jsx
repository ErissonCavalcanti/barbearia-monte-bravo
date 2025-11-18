"use client";

import { useEffect, useRef } from "react";
import styles from "../styles/sobre.module.css";

export default function Sobre() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // tenta autoplay inicial (pode ser bloqueado pelo navegador)
    video.play().catch(() => {});

    // pausa/retoma conforme a visibilidade da seção
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sobre" ref={sectionRef} className={styles.sobre_Container}>
      <div className={styles.video_Wrapper}>
        <video
          ref={videoRef}
          src="/video_monte_bravo.mp4"
          className={styles.video_Element}
          controls={false}
          preload="auto"
          playsInline
          autoPlay
          muted
          loop
        />
      </div>

      <div className={styles.texto_Wrapper}>
        <h1>Sobre a Barbearia Monte Bravo</h1>
        <h2>“Das montanhas do norte, nasce a força de um novo estilo.”</h2>
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
