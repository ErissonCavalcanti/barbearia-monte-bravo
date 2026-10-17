"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICOS } from "../dados/servicos";
import styles from "../styles/servicos.module.css";

gsap.registerPlugin(ScrollTrigger);

const formatarPreco = (valor) =>
  valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });

export default function Servicos() {
  const secaoRef = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(secaoRef.current);

    const ctx = gsap.context(() => {
      // cabeçalho e cada coluna entram quando a secção aparece no ecrã
      gsap.from(q(`.${styles.cabecalho} > *`), {
        y: 25,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: secaoRef.current, start: "top 75%" },
      });

      q(`.${styles.coluna}`).forEach((coluna) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: coluna, start: "top 80%" },
        });

        tl.from(coluna.querySelector(`.${styles.categoria}`), {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        })
          // os serviços aparecem um a um...
          .from(
            coluna.querySelectorAll(`.${styles.item}`),
            { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
            "-=0.3"
          )
          // ...e a linha pontilhada cresce até ao preço
          .from(
            coluna.querySelectorAll(`.${styles.pontilhado}`),
            { scaleX: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
            "<0.2"
          );
      });

      gsap.from(q(`.${styles.rodape}`), {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: q(`.${styles.rodape}`)[0], start: "top 90%" },
      });
    }, secaoRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secaoRef} id="servicos" className={styles.servicos}>
      <header className={styles.cabecalho}>
        <span className={styles.rotulo}>Serviços & Preços</span>
        <h2 className={styles.titulo}>O que fazemos por ti</h2>
        <div className={styles.linha}></div>
      </header>

      <div className={styles.colunas}>
        {SERVICOS.map(({ categoria, itens }) => (
          <div key={categoria} className={styles.coluna}>
            <h3 className={styles.categoria}>{categoria}</h3>
            <ul className={styles.lista}>
              {itens.map((servico) => (
                <li key={servico.nome} className={styles.item}>
                  <div className={styles.linhaServico}>
                    <span className={styles.nome}>{servico.nome}</span>
                    <span className={styles.pontilhado} aria-hidden="true"></span>
                    <span className={styles.preco}>{formatarPreco(servico.preco)}</span>
                  </div>
                  <span className={styles.duracao}>{servico.duracao}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.rodape}>
        <a href="#agendamento" className={styles.botao}>
          <span>Marcar agora</span>
        </a>
        <p className={styles.nota}>Escolhe o serviço e marca online em poucos cliques.</p>
      </div>
    </section>
  );
}
