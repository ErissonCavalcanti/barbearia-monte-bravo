"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import styles from "../styles/banner.module.css";
import monte_bravo_nav from "../../../public/monte_bravo_nav.svg";
import { CONTACTO } from "../dados/contacto";

const LINKS_MENU = [
  { href: "#sobre", texto: "Sobre" },
  { href: "#equipe", texto: "Equipe" },
  { href: "#servicos", texto: "Serviços" },
  { href: "#agendamento", texto: "Marcação" },
  { href: "#contactos", texto: "Contactos" },
];

const REDES = [
  { href: CONTACTO.instagram, nome: "Instagram", Icone: FaInstagram },
  { href: CONTACTO.facebook, nome: "Facebook", Icone: FaFacebookF },
  { href: CONTACTO.whatsapp && `https://wa.me/${CONTACTO.whatsapp}`, nome: "WhatsApp", Icone: FaWhatsapp },
].filter((rede) => rede.href);

export default function Banner() {
  const buttonRef = useRef(null);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);
  const menuTl = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // anima a entrada do botão "Marque já" só depois do ecrã de carregamento sair
    gsap.set(buttonRef.current, { opacity: 0, y: 20 });
    const animarBotao = () =>
      gsap.to(buttonRef.current, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" });
    if (document.documentElement.dataset.carregado) animarBotao();
    else window.addEventListener("monte-bravo:carregado", animarBotao, { once: true });
    gsap.fromTo(
      burgerRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );

    // timeline do menu: o fundo desce como uma cortina, depois o logótipo,
    // os links (que sobem por trás de uma máscara, um a um) e o rodapé do menu
    const menu = menuRef.current;
    const q = gsap.utils.selector(menu);
    menuTl.current = gsap
      .timeline({ paused: true })
      .set(menu, { autoAlpha: 1 })
      .fromTo(
        menu,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" }
      )
      .fromTo(
        q(`.${styles.menuLogo}`),
        { autoAlpha: 0, y: -15 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.25"
      )
      .fromTo(
        q(`.${styles.menuTexto}`),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        "-=0.35"
      )
      .fromTo(
        q(`.${styles.menuNumero}`),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.4, stagger: 0.08 },
        "<0.2"
      )
      .fromTo(
        q(`.${styles.menuRodape}`),
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.4"
      );

    return () => {
      menuTl.current?.kill();
      window.removeEventListener("monte-bravo:carregado", animarBotao);
    };
  }, []);

  // abre/fecha o menu: corre a timeline (mais rápida ao fechar) e bloqueia o scroll da página
  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;

    // acessibilidade: ao abrir, o foco vai para o primeiro link; ao fechar, volta ao botão
    if (isMenuOpen) {
      tl.timeScale(1).play();
      setTimeout(() => menuRef.current?.querySelector("a")?.focus({ preventScroll: true }), 300);
    } else {
      if (tl.progress() > 0) burgerRef.current?.focus({ preventScroll: true });
      tl.timeScale(1.8).reverse();
    }

    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    // fecha com a tecla Esc
    const fecharComEsc = (e) => e.key === "Escape" && setIsMenuOpen(false);
    if (isMenuOpen) window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((aberto) => !aberto);
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.containerBanner} />

      {/* Logótipo (vetorial, nítido em qualquer ecrã) e botão, centrados numa coluna */}
      <div className={styles.heroConteudo}>
        {/* título principal da página: o logótipo */}
        <h1 className={styles.marca}>
          <Image
            src={monte_bravo_nav}
            className={styles.simboloBanner}
            alt="Monte Bravo Barbershop"
            priority
          />
        </h1>

        <a
          href="#agendamento"
          ref={buttonRef}
          className={`${styles.botao} ${styles["btn-3"]} ${styles["hover-border-5"]}`}
        >
          <span>Marque já</span>
        </a>
      </div>

      {/* Botão do menu: três traços que se transformam num X */}
      <button
        ref={burgerRef}
        type="button"
        className={`${styles.burger} ${isMenuOpen ? styles.burgerAberto : ""}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu de navegação (animado com GSAP) */}
      <nav ref={menuRef} id="main-menu" className={styles.navMenu} aria-hidden={!isMenuOpen}>
        <div className={styles.menuLogo}>
          <Image src={monte_bravo_nav} alt="Logo Barbearia Monte Bravo" title="Barbearia Monte Bravo" />
        </div>

        <ul className={styles.menuLinks}>
          {LINKS_MENU.map((link, i) => (
            <li key={link.href} className={styles.menuItem}>
              <a href={link.href} onClick={handleLinkClick} tabIndex={isMenuOpen ? 0 : -1}>
                <span className={styles.menuNumero}>{String(i + 1).padStart(2, "0")}</span>
                {/* a máscara (overflow: hidden) esconde o texto antes de ele subir */}
                <span className={styles.menuMascara}>
                  <span className={styles.menuTexto}>{link.texto}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.menuRodape}>
          <ul className={styles.menuRedes}>
            {REDES.map(({ href, nome, Icone }) => (
              <li key={nome}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nome}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  <Icone />
                </a>
              </li>
            ))}
          </ul>
          <p>Av. Sá Carneiro, 32 · Bragança</p>
        </div>
      </nav>
    </header>
  );
}
