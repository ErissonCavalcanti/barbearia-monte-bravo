"use client";
import styles from "../styles/contatos.module.css";
import { PiWhatsappLogoThin } from "react-icons/pi";

export default function Contatos() {
  return (
    <section id="contactos" className={styles.secao_contatos}>
      <h2>Contactos</h2>
      <h3>Dúvidas ou sugestões? Não exite em contactar-nos!</h3>
      <div className={styles.icon_container}>
        <PiWhatsappLogoThin className={styles.icon} />
        <div className={styles.line}></div>
      </div>
    </section>
  );
}
