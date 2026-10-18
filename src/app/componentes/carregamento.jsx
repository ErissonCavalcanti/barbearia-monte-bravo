"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import styles from "../styles/carregamento.module.css";

gsap.registerPlugin(DrawSVGPlugin);

// avisa o resto do site (ex.: o banner) de que a entrada terminou
function terminarCarregamento() {
  document.documentElement.dataset.carregado = "1";
  window.dispatchEvent(new Event("monte-bravo:carregado"));
}

// Ecrã de entrada: o logótipo é desenhado traço a traço, ganha cor
// e o ecrã sobe como uma cortina, revelando o site
export default function Carregamento() {
  const ecraRef = useRef(null);
  const logoRef = useRef(null);
  const linhaRef = useRef(null);

  useEffect(() => {
    const ecra = ecraRef.current;
    let cancelado = false;
    let tl;
    document.body.style.overflow = "hidden";

    const acabar = () => {
      document.body.style.overflow = "";
      ecra.style.display = "none";
      terminarCarregamento();
    };

    // o SVG é inserido inline para se poder animar cada traço
    fetch("/monte_bravo_nav.svg")
      .then((r) => r.text())
      .then((svg) => {
        if (cancelado) return;
        logoRef.current.innerHTML = svg.slice(svg.indexOf("<svg"));
        const caminhos = logoRef.current.querySelectorAll("path");

        gsap.set(caminhos, {
          fill: "rgba(255,255,255,0)",
          stroke: "#fff",
          strokeWidth: 1.2,
          attr: { "vector-effect": "non-scaling-stroke" },
        });

        const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const v = reduzir ? 0.3 : 1; // versão mais curta para quem reduz animações

        tl = gsap
          .timeline({ onComplete: acabar })
          // 1. os traços do logótipo são desenhados
          .fromTo(
            caminhos,
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.6 * v, stagger: 0.012 * v, ease: "power2.inOut" }
          )
          // linha fina de progresso por baixo
          .fromTo(
            linhaRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 2 * v, ease: "power1.inOut" },
            0
          )
          // 2. o logótipo ganha preenchimento
          .to(caminhos, { fill: "rgba(255,255,255,1)", duration: 0.5 * v, ease: "power1.out" }, "-=0.35")
          .to(caminhos, { strokeWidth: 0, duration: 0.3 * v }, "<")
          // 3. o logótipo encolhe ligeiramente e o ecrã sobe como uma cortina
          .to(logoRef.current, { scale: 0.92, autoAlpha: 0, duration: 0.45 * v, ease: "power2.in" }, "+=0.25")
          .to(linhaRef.current, { autoAlpha: 0, duration: 0.3 * v }, "<")
          .to(ecra, { yPercent: -100, duration: 0.9 * v, ease: "power4.inOut" }, "-=0.1");
      })
      .catch(acabar); // se o logótipo não carregar, o site aparece na mesma

    return () => {
      cancelado = true;
      tl?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={ecraRef} className={styles.ecra} aria-hidden="true">
      <div ref={logoRef} className={styles.logo}></div>
      <span ref={linhaRef} className={styles.linha}></span>
    </div>
  );
}
