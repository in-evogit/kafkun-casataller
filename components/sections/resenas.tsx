"use client";

import { useEffect, useState } from "react";
import { resenas } from "@/lib/data/testimonios";

const INTERVALO_MS = 7000;

/**
 * Carrusel de resenas.
 *
 * Los indicadores no son puntos: son HILOS. Es el gesto firma del sitio (la linea de
 * 1.5px de .hilo), y ademas el hilo activo se va tensando con el tiempo que queda, asi
 * que se ve venir el cambio en vez de que la frase desaparezca a media lectura. Esa
 * ansiedad —"¿me va a cambiar antes de terminar?"— es lo que hace odiosos a la mayoria
 * de los carruseles.
 *
 * Un carrusel que avanza solo y no se puede detener es de lo mas hostil que puede tener
 * una pagina. Este:
 *   - se detiene al pasar el mouse y al recibir el foco de teclado,
 *   - trae flechas de verdad, que son el equivalente accesible por teclado,
 *   - no avanza con la pestana oculta (si no, al volver salta varias de golpe),
 *   - y con "reducir movimiento" no avanza solo: se lee con las flechas.
 *
 * Todas las tarjetas se apilan en la MISMA celda de grilla. Asi el bloque mide lo que la
 * resena mas larga y no da un salto de alto al cambiar entre una de dos lineas y una de
 * cinco.
 */
export default function Resenas() {
  const [i, setI] = useState(0);
  const [detenido, setDetenido] = useState(false);
  const [menosMovimiento, setMenosMovimiento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const leer = () => setMenosMovimiento(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  useEffect(() => {
    if (detenido || menosMovimiento || resenas.length <= 1) return;
    const t = setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % resenas.length);
    }, INTERVALO_MS);
    return () => clearInterval(t);
  }, [detenido, menosMovimiento]);

  if (resenas.length === 0) return null;

  const mover = (d: number) => setI((n) => (n + d + resenas.length) % resenas.length);
  const corre = !detenido && !menosMovimiento && resenas.length > 1;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Lo que dicen quienes ya tejieron con Katy"
      className="border-t border-border bg-secondary"
      onMouseEnter={() => setDetenido(true)}
      onMouseLeave={() => setDetenido(false)}
      onFocusCapture={() => setDetenido(true)}
      onBlurCapture={() => setDetenido(false)}
    >
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Lo que dicen sus alumnas
        </p>

        {/* aria-live off: el cambio automatico no debe interrumpir a un lector de
            pantalla cada siete segundos. Las flechas si mueven el foco al contenido. */}
        <div className="mt-10 grid" aria-live="off">
          {resenas.map((r, n) => {
            const activa = n === i;
            return (
              <figure
                key={r.nombre + n}
                aria-hidden={!activa}
                // Todas en la misma celda: el bloque mide lo que la mas larga.
                style={{ gridArea: "1 / 1" }}
                className={[
                  "transition-opacity duration-[var(--dur-foto)] ease-[var(--ease-std)]",
                  activa ? "opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
              >
                <div aria-label="5 de 5" className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      viewBox="0 0 20 20"
                      aria-hidden
                      className="h-3.5 w-3.5 fill-primary"
                    >
                      <path d="M10 1.5l2.47 5.26 5.53.78-4 4.03.95 5.68L10 14.6l-4.95 2.65.95-5.68-4-4.03 5.53-.78z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mt-6">
                  <p className="max-w-[36ch] text-balance font-heading text-[1.5rem] font-light leading-[1.25] tracking-[-0.01em] text-foreground md:max-w-[42ch] md:text-[2.125rem]">
                    {r.texto}
                  </p>
                </blockquote>

                <figcaption className="mt-8 flex items-baseline gap-3">
                  {/* Un hilo corto antes del nombre: el mismo gesto, quieto. */}
                  <span aria-hidden className="h-px w-8 shrink-0 bg-primary" />
                  <span className="text-[0.9375rem] font-medium text-foreground">
                    {r.nombre}
                  </span>
                  <span className="text-[0.8125rem] text-muted-foreground">
                    {r.taller}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {resenas.length > 1 && (
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5">
            {/* Los hilos. El activo se tensa con el tiempo que queda. */}
            <ol className="flex flex-1 items-center gap-2">
              {resenas.map((r, n) => (
                <li key={r.nombre + n} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setI(n)}
                    aria-label={`Reseña ${n + 1} de ${resenas.length}`}
                    aria-current={n === i}
                    className="group relative block h-4 w-full focus-visible:outline-none"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border transition-colors duration-[var(--dur-color)] group-hover:bg-muted-foreground group-focus-visible:bg-muted-foreground" />
                    <span
                      key={`${n}-${i}-${corre}`}
                      style={
                        n === i && corre
                          ? { animation: `tensar ${INTERVALO_MS}ms linear forwards` }
                          : undefined
                      }
                      className={[
                        "absolute inset-x-0 top-1/2 h-[1.5px] origin-left -translate-y-1/2 bg-primary",
                        n === i ? (corre ? "" : "scale-x-100") : "scale-x-0",
                      ].join(" ")}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-2">
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
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
