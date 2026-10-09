import React from "react";
import styles from "../styles/marcacao.module.css";

export default function Marcacao() {
  return (
    <section className={styles.marcacao} id="agendamento">
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
        <iframe
          className={styles.marcacao_iframe}
          src="https://noona.pt/montebravobarbershop/book"
          title="Marcação online - Monte Bravo Barbershop"
          frameBorder="0"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
