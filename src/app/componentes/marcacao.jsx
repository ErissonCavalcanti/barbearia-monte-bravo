"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../styles/marcacao.module.css";

const NOONA = "https://noona.pt/montebravobarbershop/book";

export default function Marcacao() {
  const secaoRef = useRef(null);
  const [carregar, setCarregar] = useState(false);

  // o widget da Noona (pesado e com cookies próprios) só é carregado
  // quando a pessoa se aproxima da secção, e não logo ao abrir o site
  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setCarregar(true);
        observador.disconnect();
      },
      { rootMargin: "600px 0px" }
    );
    observador.observe(secaoRef.current);
    return () => observador.disconnect();
  }, []);

  return (
    <section ref={secaoRef} className={styles.marcacao} id="agendamento">
      {/* Imagem do copo como plano de fundo (decorativa) */}
      <div className={styles.fundo_copo} aria-hidden="true">
        {/* elementos da composição usados apenas no desktop */}
        <span className={styles.forma}></span>
        <span className={styles.copo}></span>
        <span className={styles.linhas}></span>
        <span className={styles.circulo_claro}></span>
        <span className={styles.circulo_escuro}></span>
      </div>

      <header className={styles.cabecalho}>
        <span className={styles.rotulo}>Agendamento online</span>
        <h2 className={styles.titulo}>Faz a tua Marcação</h2>
        <div className={styles.linha}></div>
        <p className={styles.subtitulo}>
          Escolhe o serviço, o barbeiro e o horário que preferires.
        </p>
      </header>

      <div className={styles.cartao}>
        {carregar ? (
          <iframe
            className={styles.marcacao_iframe}
            src={NOONA}
            title="Marcação online - Monte Bravo Barbershop"
            frameBorder="0"
          ></iframe>
        ) : (
          <p className={styles.aCarregar}>A carregar a marcação online…</p>
        )}
      </div>
    </section>
  );
}
