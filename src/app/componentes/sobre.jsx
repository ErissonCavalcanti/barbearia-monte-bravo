"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/sobre.module.css";

export default function Sobre() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Tenta dar play diretamente, sem esperar pelo scroll.
    video.play().catch((err) => {
      console.log("O autoplay foi bloqueado pelo navegador:", err);
    });

    // A lógica do IntersectionObserver foi removida para este teste.

  }, []); // O array vazio [] garante que isto só corre uma vez.

  // Dentro do seu componente Sobre.js

return (
  // O container principal que usará Flexbox
  <section id="sobre" className={styles.sobre_Container}>
    
    {/* --- FILHO 1: Coluna do Vídeo (50%) --- */}
    <div className={styles.video_Wrapper}>
      <video
        ref={videoRef}
        src="/video_monte_bravo.mp4"
        className={styles.video_Element} // Usaremos uma classe para o vídeo também
        controls={false}
        preload="auto"
        playsInline
        autoPlay
        muted
        loop
      />
    </div>

    {/* --- FILHO 2: Coluna do Texto (50%) --- */}
    <div className={styles.texto_Wrapper}>
      <h1>Sobre a Barbearia Monte Bravo</h1>
      <h2>
        “Das montanhas do norte, nasce a força de um novo estilo.”
      </h2>
      <p>
        A Monte Bravo não é só uma barbearia. É um símbolo de tradição, bravura e identidade.
        Inspirados na imponência das nossas montanhas, na autenticidade dos homens do norte e na arte da navalha, criamos um espaço para aqueles que valorizam qualidade, respeito e atitude.   
  

       <br /><br /> Aqui, cada corte é uma experiência. Cada barba, uma marca de personalidade. Cada cliente, parte da nossa história.   
  

        No coração de Bragança, criamos um lugar onde o tempo desacelera. <br /> <br /> Na Monte Bravo, serás recebido com café quente, conversa boa e um ambiente pensado para inspirar confiança.   
  

        Cada detalhe foi desenhado para oferecer o que realmente importa: um momento só teu.   
  

       <br /> <br /> A Monte Bravo está à tua espera. Vem viver a experiência.
      </p>
    </div>

  </section>
);
}