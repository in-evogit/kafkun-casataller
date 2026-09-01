"use client";

import { useEffect, useRef, useState } from "react";
import { resenas } from "@/lib/data/testimonios";

/**
 * Resenas.
 *
 * Antes era UNA resena gigante que rotaba sola. Dos problemas reales: se comia media
 * pantalla, y no se veia por ninguna parte que hubiera mas (los indicadores eran hilos
 * de 1px, demasiado sutiles para leerse como un control).
 *
 * Ahora es una fila de tarjetas donde LA SIGUIENTE SE ASOMA. Eso no hay que explicarlo:
 * ver media tarjeta cortada en el borde ya dice "hay mas hacia alla". Las flechas quedan
 * como refuerzo y como equivalente de teclado, no como unica pista.
 *
 * Tampoco avanza sola. Con las tarjetas a la vista, el movimiento automatico solo estorba:
 * mueve el texto que alguien esta leyendo para resolver un problema que ya no existe.
 *
 * Va sobre tinta calida porque la portada necesitaba UNA seccion con peso: nueve bloques
 * color crema seguidos se leen como un solo campo plano, por muy bonito que sea el crema.
 */
export default function Resenas() {
  const pista = useRef<HTMLUListElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const revisar = () => {
      setAlInicio(el.scrollLeft < 8);
      setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    revisar();
    el.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      el.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", revisar);
    };
  }, []);

  if (resenas.length === 0) return null;

  const correr = (dir: number) => {
    const el = pista.current;
    if (!el) return;
    // Se mueve una tarjeta a la vez, medida del DOM: no hay numeros magicos que
    // se desincronicen cuando cambie el ancho de la tarjeta.
    const paso = el.querySelector("li")?.clientWidth ?? 320;
    el.scrollBy({ left: dir * (paso + 16), behavior: "smooth" });
  };

  const flecha =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tinta-foreground/25 text-tinta-foreground transition-[color,border-color,background-color,transform,opacity] duration-[var(--dur-color)] hover:border-tinta-foreground hover:bg-tinta-foreground hover:text-tinta active:scale-[0.94] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-tinta-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tinta-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-tinta";

  return (
    <section aria-labelledby="resenas-titulo" className="bg-tinta">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-tinta-foreground/50">
              Lo que dicen
            </p>
            <h2
              id="resenas-titulo"
              className="mt-3 font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-tinta-foreground md:text-[2.25rem]"
            >
              Sus alumnas, en sus palabras
            </h2>
          </div>

          {resenas.length > 1 && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => correr(-1)} disabled={alInicio} aria-label="Ver reseñas anteriores" className={flecha}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={() => correr(1)} disabled={alFinal} aria-label="Ver más reseñas" className={flecha}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Scroll nativo con anclaje: en tactil se arrastra como todo el mundo espera,
            y con teclado la lista recibe foco y se recorre con las flechas. Sin
            librerias y sin reimplementar la inercia del sistema, que nunca queda igual. */}
        <ul
          ref={pista}
          tabIndex={0}
          className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tinta-foreground/60 focus-visible:ring-offset-4 focus-visible:ring-offset-tinta"
        >
          {resenas.map((r, n) => (
            <li
              key={r.nombre + n}
              // Ancho fijo y menor que la pantalla: asi la siguiente SIEMPRE se asoma.
              className="w-[17.5rem] shrink-0 snap-start sm:w-[20rem]"
            >
              <figure className="flex h-full flex-col rounded-[2px] bg-tinta-foreground/[0.06] p-6 ring-1 ring-tinta-foreground/10">
                <div aria-label="5 de 5" className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" aria-hidden className="h-3 w-3 fill-primary">
                      <path d="M10 1.5l2.47 5.26 5.53.78-4 4.03.95 5.68L10 14.6l-4.95 2.65.95-5.68-4-4.03 5.53-.78z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="mt-4 flex-1">
                  <p className="text-[0.9375rem] leading-relaxed text-tinta-foreground/85">
                    {r.texto}
                  </p>
                </blockquote>

                <figcaption className="mt-6 border-t border-tinta-foreground/15 pt-4">
                  <span className="block text-[0.875rem] font-medium text-tinta-foreground">
                    {r.nombre}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] text-tinta-foreground/50">
                    {r.taller}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
