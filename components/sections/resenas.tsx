"use client";

import { useEffect, useRef, useState } from "react";
import { resenas } from "@/lib/data/testimonios";

const INTERVALO_MS = 6500;

/**
 * Carrusel de resenas.
 *
 * Un carrusel que avanza solo y no se puede detener es de las cosas mas hostiles que
 * puede tener una pagina: quien lee despacio pierde la frase a media lectura y no tiene
 * como recuperarla. Por eso este:
 *   - se detiene al pasar el mouse y al recibir el foco de teclado,
 *   - trae flechas de verdad, que son el equivalente de teclado,
 *   - deja de avanzar cuando la pestana no esta visible (si no, al volver hay un salto),
 *   - y con "reducir movimiento" NO avanza solo: se lee con las flechas y nada mas.
 *
 * No se dibuja si no hay resenas. Nunca inventar una.
 */
export default function Resenas() {
  const [i, setI] = useState(0);
  const [detenido, setDetenido] = useState(false);
  const [menosMovimiento, setMenosMovimiento] = useState(false);
  const contenedor = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const leer = () => setMenosMovimiento(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  useEffect(() => {
    if (detenido || menosMovimiento || resenas.length <= 1) return;

    // La pestana oculta: sin esto se acumulan avances y al volver salta varias de golpe.
    const visible = () => !document.hidden;
    const t = setInterval(() => {
      if (visible()) setI((n) => (n + 1) % resenas.length);
    }, INTERVALO_MS);
    return () => clearInterval(t);
  }, [detenido, menosMovimiento]);

  if (resenas.length === 0) return null;

  const mover = (delta: number) =>
    setI((n) => (n + delta + resenas.length) % resenas.length);

  return (
    <section
      ref={contenedor}
      aria-roledescription="carrusel"
      aria-label="Lo que dicen quienes ya tejieron con Katy"
      className="bg-secondary"
      onMouseEnter={() => setDetenido(true)}
      onMouseLeave={() => setDetenido(false)}
      onFocusCapture={() => setDetenido(true)}
      onBlurCapture={() => setDetenido(false)}
    >
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Lo que dicen
        </p>

        {/* aria-live off: lo mueve la persona o el temporizador, y anunciar cada cambio
            automatico interrumpiria la lectura en vez de ayudarla. */}
        <div aria-live="off" className="mt-8 min-h-[13rem]">
          {resenas.map((r, n) => (
            <figure
              key={r.nombre + n}
              hidden={n !== i}
              // La cita entra con el mismo gesto que el resto del sitio.
              className="animate-[paso-entra_320ms_var(--ease-hilo)_both]"
            >
              <blockquote className="border-l-2 border-primary pl-6">
                <p className="max-w-[46ch] text-balance font-heading text-[1.5rem] font-light italic leading-snug text-foreground md:text-[2rem]">
                  {r.texto}
                </p>
              </blockquote>
              <figcaption className="mt-6 pl-6 text-[0.9375rem] text-muted-foreground">
                <span className="font-medium text-foreground">{r.nombre}</span>
                {r.lugar ? ` · ${r.lugar}` : ""}
                {r.contexto ? (
                  <span className="mt-0.5 block text-[0.8125rem]">{r.contexto}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>

        {resenas.length > 1 && (
          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Reseña anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-[color,border-color,transform] duration-[var(--dur-color)] hover:border-primary hover:text-primary active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Reseña siguiente"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-[color,border-color,transform] duration-[var(--dur-color)] hover:border-primary hover:text-primary active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <span className="ml-2 text-[0.8125rem] tabular-nums text-muted-foreground">
              {i + 1} / {resenas.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
