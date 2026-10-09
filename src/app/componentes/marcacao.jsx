import React from "react";
import styles from "../styles/marcacao.module.css";

export default function Marcacao() {
  return (
    <section className={styles.marcacao_title} id="agendamento">
      <h2>Faz a tua Marcação:</h2>
      <iframe
        className={styles.marcacao_iframe}
        src="https://noona.pt/montebravobarbershop/book"
        width="100%"
        height="500"
        frameBorder="0"
        loading="lazy"
      ></iframe>
    </section>
  );
}
