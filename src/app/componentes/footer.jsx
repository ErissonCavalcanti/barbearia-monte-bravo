import styles from "../styles/footer.module.css";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© {ano} Monte Bravo Barbershop. Todos os direitos reservados.</p>
      <p>Criado por Erisson Cavalcanti</p>
    </footer>
  );
}
