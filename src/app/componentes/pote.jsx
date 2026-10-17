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
      // Entra pela esquerda, a rodar ligeiramente, com duração fixa (não depende
      // da velocidade do scroll): dispara quando o ponto a 40% da altura da secção
      // Marcação chega ao meio do ecrã (um pouco antes da metade), e inverte ao voltar a subir.
      gsap.fromTo(
        poteRef.current,
        { xPercent: -100, rotation: -25, autoAlpha: 0 },
        {
          xPercent: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: document.getElementById("agendamento"),
            start: "40% center",
            toggleActions: "play none none reverse",
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
