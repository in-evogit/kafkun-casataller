"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resenas } from "@/lib/data/testimonios";

/**
 * Resenas, en tarjetas del estilo que la gente ya sabe leer (las de Google).
 *
 * Los dos intentos anteriores fallaron por lo mismo: eran bonitos pero no se leian
 * como resenas. Una cita gigante rotando parece una frase de marca; unas tarjetas
 * oscuras parecen una seccion de producto. La forma importa mas que la elegancia
 * cuando el objetivo es que alguien reconozca "esto es lo que opina la gente" en
 * medio segundo, sin leer el titulo.
 *
 * Por eso: avatar circular con la inicial, nombre, estrellas ambar, texto, y todo
 * sobre tarjeta clara con borde y sombra suave. Nada de eso es original — esa es
 * exactamente la gracia.
 *
 * La barra de abajo es un indicador REAL de desplazamiento: antes el scrollbar
 * nativo estaba oculto por CSS y no quedaba ninguna pista de que la fila se movia.
 */
export default function Resenas() {
  const pista = useRef<HTMLUListElement>(null);
  const [prog, setProg] = useState({ ancho: 1, izq: 0 });
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  const medir = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    const total = el.scrollWidth;
    const visible = el.clientWidth;
    setProg({
      ancho: Math.min(1, visible / total),
      izq: total > visible ? el.scrollLeft / total : 0,
    });
    setAlInicio(el.scrollLeft < 8);
    setAlFinal(el.scrollLeft + visible >= total - 8);
  }, []);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, [medir]);

  if (resenas.length === 0) return null;

  const correr = (dir: number) => {
    const el = pista.current;
    if (!el) return;
    // Medido del DOM: no hay numeros magicos que se desincronicen al cambiar el ancho.
    const paso = el.querySelector("li")?.clientWidth ?? 320;
    el.scrollBy({ left: dir * (paso + 16), behavior: "smooth" });
  };

  const flecha =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm transition-[color,border-color,transform,opacity] duration-[var(--dur-color)] hover:border-primary hover:text-primary active:scale-[0.94] disabled:opacity-35 disabled:hover:border-border disabled:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary";

  return (
    <section aria-labelledby="resenas-titulo" className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2
              id="resenas-titulo"
              className="font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-foreground md:text-[2.25rem]"
            >
              Lo que dicen sus alumnas
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Estrella key={s} className="h-4 w-4" />
                ))}
              </span>
              <span className="text-[0.875rem] text-muted-foreground">
                5,0 · {resenas.length} reseñas
              </span>
            </div>
          </div>

          {resenas.length > 1 && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => correr(-1)} disabled={alInicio} aria-label="Ver reseñas anteriores" className={flecha}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={() => correr(1)} disabled={alFinal} aria-label="Ver más reseñas" className={flecha}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}
        </div>

        <ul
          ref={pista}
          tabIndex={0}
          className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-secondary"
        >
          {resenas.map((r, n) => (
            <li key={r.nombre + n} className="w-[18rem] shrink-0 snap-start sm:w-[21rem]">
              <figure className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-[0_1px_2px_rgba(44,26,17,0.04),0_4px_12px_-4px_rgba(44,26,17,0.08)]">
                <figcaption className="flex items-center gap-3">
                  {/* Avatar con la inicial: nadie mando foto, y un circulo gris vacio
                      se ve peor que la inicial. Papel sobre carmesi da 7.34:1. */}
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-heading text-[1.0625rem] text-primary-foreground"
                  >
                    {r.nombre.trim()[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] font-medium text-foreground">
                      {r.nombre}
                    </span>
                    <span className="block truncate text-[0.75rem] text-muted-foreground">
                      {r.taller}
                    </span>
                  </span>
                </figcaption>

                <div className="mt-3.5 flex gap-0.5" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Estrella key={s} className="h-[0.9375rem] w-[0.9375rem]" />
                  ))}
                </div>

                <blockquote className="mt-3 flex-1">
                  <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {r.texto}
                  </p>
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>

        {/* Indicador de desplazamiento REAL. El scrollbar nativo esta oculto para que
            no rompa el diseno, asi que hay que devolver la pista de otra forma: esta
            barra dice cuanto de la fila se ve y en que parte va. */}
        {resenas.length > 1 && (
          <div aria-hidden className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70 transition-[width] duration-100"
              style={{
                width: `${prog.ancho * 100}%`,
                marginLeft: `${prog.izq * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Estrella({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`fill-estrella ${className ?? ""}`}>
      <path d="M10 1.5l2.47 5.26 5.53.78-4 4.03.95 5.68L10 14.6l-4.95 2.65.95-5.68-4-4.03 5.53-.78z" />
    </svg>
  );
}
