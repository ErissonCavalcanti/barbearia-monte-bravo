"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Wellerson from "../../../public/Wellerson.webp";
import Pantera from "../../../public/pantera.webp";
import pincel from "../../../public/pincel_sem_fundo.png";
import styles from "../styles/equipe.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Equipe() {
  const equipeRef = useRef(null);
  const pincelRef = useRef(null);

  useEffect(() => {
    const cards = equipeRef.current.querySelectorAll(`.${styles.cardEquipe}`);
    gsap.from(cards, {
      y: -80,
      opacity: 0,
      duration: 1.6,
      stagger: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: equipeRef.current,
        start: "top 80%",
        toggleActions: "restart none none reset",
        scrub: false,
        once: false,
      },
    });
  }, []);

  useEffect(() => {
    const pin = pincelRef.current;
    const section = equipeRef.current;
    if (!pin || !section) return;

    gsap.set(pin, { autoAlpha: 0 });
    const anim = gsap.to(pin, {
      x: "121%", // Move o pincel para a esquerda em 100% da sua própria largura.
      autoAlpha: 1, // Torna-o visível.
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top bottom", // A animação começa quando o topo da seção entra na base da tela.
        end: "top center", // A animação termina quando o topo da seção chega ao centro da tela.
        scrub: 1, 
      },
    });

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, []);

  return (
    <section className={styles.equipe} id="equipe" ref={equipeRef}>
      <div className={styles.equipeContent}>
        <div className={styles.imagesColumn}>
          <div className={styles.containerEquipe}>
            <div className={styles.cardEquipe}>
              <Image
                src={Wellerson}
                alt="Foto de Wellerson Viana"
                className={styles.imgEquipe}
                priority
              />
              <div className={styles.overlay}>
                <h4>Wellerson Viana</h4>
                <p>Barbeiro e Proprietário</p>
              </div>
            </div>

            <div className={styles.cardEquipe}>
              <Image
                src={Pantera}
                alt="Foto de Pantera"
                className={styles.imgEquipe}
              />
              <div className={styles.overlay}>
                <h4>Pantera</h4>
                <p>Barbeiro</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.textColumn}>
          <h2 className="titulo-secao">Conheça nossa Equipa</h2>
          <h3>
            “Transformamos técnica em arte, para garantir a tua melhor versão.”
          </h3>
          <p>
           Com anos de experiência no mercado, a nossa equipa é composta por profissionais que amam o que fazem. Cada um deles traz consigo uma bagagem única de competências e estilos, garantindo que cada cliente receba um atendimento personalizado e de alta qualidade. <br /><br />Seja para um corte clássico ou uma barba estilizada, estamos aqui para realçar o melhor de si.
           Os nossos profissionais participam regularmente em workshops e formações, mantendo-se sempre atualizados com as últimas tendências e técnicas do mercado. <br /> <br /> Convidamo-lo a experimentar não apenas um corte de cabelo, mas uma verdadeira experiência de cuidado e estilo.
          </p>
        </div>
      </div>

      {/* pincel animado — usar <img> para poder referenciar com ref */}
      <img
        src={pincel.src}
        alt="pincel decorativo"
        ref={pincelRef}
        className={styles.pincel_Equipe}
      />
    </section>
  );
}
