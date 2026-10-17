"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaStar, FaGoogle } from "react-icons/fa";
import { AVALIACOES, NOTA_GOOGLE } from "../dados/avaliacoes";
import { MAPS_LINK } from "../dados/contacto";
import styles from "../styles/avaliacoes.module.css";

gsap.registerPlugin(ScrollTrigger);

const INTERVALO = 4000; // tempo (ms) que cada avaliação fica parada antes de passar à seguinte

function Estrelas({ quantidade }) {
  return (
    <div className={styles.estrelas} aria-label={`${quantidade} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} className={i < quantidade ? styles.estrelaCheia : styles.estrelaVazia} />
      ))}
    </div>
  );
}

function Cartao({ avaliacao, copia }) {
  return (
    <figure className={styles.cartao} aria-hidden={copia || undefined}>
      <span className={styles.aspas} aria-hidden="true">
        “
      </span>
      <Estrelas quantidade={avaliacao.estrelas} />
      <blockquote className={styles.texto}>{avaliacao.texto}</blockquote>
      <figcaption className={styles.autor}>
        <span className={styles.inicial} aria-hidden="true">
          {avaliacao.nome.charAt(0)}
        </span>
        <span>
          <strong>{avaliacao.nome}</strong>
          <small>Avaliação no Google</small>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Avaliacoes() {
  const secaoRef = useRef(null);
  const trilhoRef = useRef(null);
  const irParaRef = useRef(() => {});
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const secao = secaoRef.current;
    const trilho = trilhoRef.current;
    const total = AVALIACOES.length;
    let indice = 0;
    let temporizador = null;
    let visivel = false;
    let ratoEmCima = false;

    // distância de um cartão (largura + espaço entre cartões)
    const passo = () =>
      trilho.children[0].offsetWidth + parseFloat(getComputedStyle(trilho).columnGap || 0);

    // desliza até ao cartão "novo"; ao passar do último, volta ao início sem se notar
    // (os cartões estão duplicados, por isso a cópia é igual ao original)
    const irPara = (novo) => {
      indice = novo;
      setAtivo(indice % total);
      gsap.to(trilho, {
        x: -indice * passo(),
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => {
          if (indice >= total) {
            indice -= total;
            gsap.set(trilho, { x: -indice * passo() });
          }
        },
      });
    };
    irParaRef.current = (novo) => {
      irPara(novo);
      reiniciar();
    };

    const parar = () => {
      clearInterval(temporizador);
      temporizador = null;
    };
    // só anda se a secção estiver visível e o rato não estiver sobre a avaliação
    const reiniciar = () => {
      parar();
      if (visivel && !ratoEmCima) temporizador = setInterval(() => irPara(indice + 1), INTERVALO);
    };

    // o carrossel passa sozinho enquanto a secção está visível no ecrã
    const observador = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting;
      reiniciar();
    });
    observador.observe(secao);

    // pausa enquanto o rato está sobre a avaliação e continua quando sai
    const janela = trilho.parentElement;
    const aoEntrar = () => {
      ratoEmCima = true;
      parar();

      // as estrelas da avaliação visível fazem uma "onda"
      const cartaoVisivel = trilho.children[indice];
      const estrelas = cartaoVisivel?.querySelectorAll(`.${styles.estrelaCheia}`);
      if (estrelas?.length) {
        gsap.fromTo(
          estrelas,
          { y: 0, scale: 1 },
          {
            y: -7,
            scale: 1.25,
            duration: 0.2,
            stagger: 0.07,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            overwrite: true,
          }
        );
      }
    };
    const aoSair = () => {
      ratoEmCima = false;
      reiniciar();
    };
    janela.addEventListener("mouseenter", aoEntrar);
    janela.addEventListener("mouseleave", aoSair);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(secao);

      // entrada da secção
      gsap
        .timeline({ scrollTrigger: { trigger: secao, start: "top 75%" } })
        .from(q(`.${styles.cabecalho} > *`), {
          y: 25,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })
        .from(q(`.${styles.janela}`), { x: 60, autoAlpha: 0, duration: 0.9, ease: "power3.out" }, "-=0.4")
        .from(q(`.${styles.navegacao}, .${styles.rodape}`), { autoAlpha: 0, duration: 0.6 }, "-=0.3");
    }, secao);

    // ao redimensionar a janela, reposiciona o trilho no cartão atual
    const aoRedimensionar = () => gsap.set(trilho, { x: -indice * passo() });
    window.addEventListener("resize", aoRedimensionar);

    return () => {
      parar();
      observador.disconnect();
      janela.removeEventListener("mouseenter", aoEntrar);
      janela.removeEventListener("mouseleave", aoSair);
      ctx.revert();
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, []);

  if (AVALIACOES.length === 0) return null;

  return (
    <section ref={secaoRef} id="avaliacoes" className={styles.avaliacoes}>
      <header className={styles.cabecalho}>
        <span className={styles.rotulo}>Avaliações</span>
        <h2 className={styles.titulo}>O que dizem os clientes</h2>
        <div className={styles.nota}>
          <span className={styles.notaValor}>{NOTA_GOOGLE.toFixed(1).replace(".", ",")}</span>
          <div>
            <Estrelas quantidade={Math.round(NOTA_GOOGLE)} />
            <span className={styles.notaFonte}>
              <FaGoogle aria-hidden="true" /> Nota no Google
            </span>
          </div>
        </div>
      </header>

      <div className={styles.janela} aria-roledescription="carrossel" aria-label="Avaliações de clientes">
        <div ref={trilhoRef} className={styles.trilho}>
          {AVALIACOES.map((avaliacao) => (
            <Cartao key={avaliacao.nome} avaliacao={avaliacao} />
          ))}
          {/* cópias para o carrossel dar a volta sem salto */}
          {AVALIACOES.map((avaliacao) => (
            <Cartao key={`${avaliacao.nome}-copia`} avaliacao={avaliacao} copia />
          ))}
        </div>
      </div>

      <div className={styles.navegacao}>
        {AVALIACOES.map((avaliacao, i) => (
          <button
            key={avaliacao.nome}
            type="button"
            className={`${styles.ponto} ${i === ativo ? styles.pontoAtivo : ""}`}
            onClick={() => irParaRef.current(i)}
            aria-label={`Ver avaliação de ${avaliacao.nome}`}
            aria-current={i === ativo}
          />
        ))}
      </div>

      <div className={styles.rodape}>
        <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Ver avaliações no Google →
        </a>
      </div>
    </section>
  );
}
