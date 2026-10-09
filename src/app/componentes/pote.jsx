"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "../styles/pote.module.css";

gsap.registerPlugin(ScrollTrigger);

// Pote de creme decorativo entre as secções Marcação e Contactos (tablet e desktop)
export default function Pote() {
  const divisoriaRef = useRef(null);
  const poteRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const pote = poteRef.current;

      // Entra pela esquerda, a rodar ligeiramente, acompanhando o scroll:
      // começa quando o topo do pote aparece no fundo do ecrã e termina
      // quando o fim da Marcação chega ao fundo do ecrã.
      gsap.fromTo(
        pote,
        { xPercent: -100, rotation: -25, autoAlpha: 0 },
        {
          xPercent: 0,
          rotation: 0,
          autoAlpha: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: divisoriaRef.current,
            start: () => `top bottom+=${-pote.offsetTop}`,
            end: "top bottom",
            scrub: true,
            invalidateOnRefresh: true, // recalcula se a janela mudar de tamanho
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={divisoriaRef} className={styles.divisoria} aria-hidden="true">
      <div ref={poteRef} className={styles.pote}></div>
    </div>
  );
}
