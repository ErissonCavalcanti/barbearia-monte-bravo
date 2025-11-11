"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import monte_bravo_banner from "../../../public/monte_bravo_banner.webp";
import { TbMenu3 } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import styles from "../styles/banner.module.css";
import monte_bravo_nav from "../../../public/monte_bravo_nav.svg";

export default function Banner() {
  const buttonRef = useRef(null);

  // refs para os ícones
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // anima entrada inicial do botão "Marque já"
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" }
    );

    // anima o ícone de menu inicial
    if (menuIconRef.current) {
      gsap.fromTo(
        menuIconRef.current,
        { scale: 0.8, rotation: -20, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.36,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  // quando isMenuOpen muda, anima o ícone que aparece
  useEffect(() => {
    if (isMenuOpen) {
      if (closeIconRef.current) {
        gsap.fromTo(
          closeIconRef.current,
          { scale: 0.8, rotation: 20, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.28,
            ease: "back.out(1.7)",
          }
        );
      }
    } else {
      if (menuIconRef.current) {
        gsap.fromTo(
          menuIconRef.current,
          { scale: 0.8, rotation: -20, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.28,
            ease: "back.out(1.7)",
          }
        );
      }
    }
  }, [isMenuOpen]);

  // anima o ícone atual para "fora" e só então troca o estado (ex: anima menu -> setIsMenuOpen(true) -> anima close)
  const toggleMenu = () => {
    const next = !isMenuOpen;
    const outRef = isMenuOpen ? closeIconRef.current : menuIconRef.current;

    if (outRef) {
      gsap.to(outRef, {
        scale: 0.6,
        rotation: isMenuOpen ? 30 : -30,
        opacity: 0,
        duration: 0.18,
        ease: "power1.in",
        onComplete: () => setIsMenuOpen(next),
      });
    } else {
      setIsMenuOpen(next);
    }
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <header>
      
        <div
         className={styles.containerBanner}
      />
      
      <Image
        src={monte_bravo_banner}
        className={styles.simboloBanner}
        alt="Logo Barbearia Monte Bravo"
        title="Barbearia Monte Bravo"
      />

      {/* Botão do menu (agora renderiza os dois ícones e controla exibição via estado) */}
      <button
        type="button"
        className={styles.menuBtn}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="main-menu"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <span
          ref={menuIconRef}
          style={{
            display: isMenuOpen ? "none" : "inline-flex",
            alignItems: "center",
          }}
        >
          <TbMenu3 />
        </span>

        <span
          ref={closeIconRef}
          style={{
            display: isMenuOpen ? "inline-flex" : "none",
            alignItems: "center",
          }}
        >
          <IoCloseOutline />
        </span>
      </button>

      {/* Menu de navegação */}
      <nav
        id="main-menu"
        className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}
        role="navigation"
        aria-hidden={!isMenuOpen}
      >
        <div >
          <Image
            className={styles.monte_bravo_nav}
            src={monte_bravo_nav}
            alt="Logo Barbearia Monte Bravo"
            title="Barbearia Monte Bravo"

          />
        </div>
        <ul>
          <li>
            <a href="#sobre" onClick={handleLinkClick}>
              Sobre
            </a>
          </li>
          <li>
            <a href="#equipe" onClick={handleLinkClick}>
              Equipe
            </a>
          </li>
          <li>
            <a href="#contato" onClick={handleLinkClick}>
              Contatos
            </a>
          </li>
          <li>
            <a href="#agendamento" onClick={handleLinkClick}>
              Agende
            </a>
          </li>
        </ul>
      </nav>

      {/* botão "Marque já" existente */}
      <button
        ref={buttonRef}
        className={`${styles.btn} ${styles["btn-3"]} ${styles["hover-border-5"]}`}
      >
        <span id="marcar-agendamento">
          Marque já
        </span>
      </button>
    </header>
  );
}
