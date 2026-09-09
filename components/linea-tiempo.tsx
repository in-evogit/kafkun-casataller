"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Linea de tiempo que se va llenando al bajar.
 *
 * UNA sola implementacion para los dos usos que pidio Gabriel: el proceso del encargo
 * y la historia de Katy. Duplicar la logica del observador en dos archivos garantiza
 * que un dia se comporten distinto y nadie sepa por que.
 *
 * La linea no es adorno: es lo que convierte una lista de cajas sueltas en un
 * recorrido, y de paso dice cuanto falta. El nodo del hito al que llegaste se marca.
 *
 * Con "reducir movimiento" la linea aparece completa desde el principio: se conserva
 * la informacion —los hitos, el orden— y se quita el movimiento, que es lo que marea.
 */
export type Hito = {
  /** El numeral o el año: "01", "2015", "Desde niña". */
  marca: string;
  titulo: string;
  texto: string;
};

export default function LineaTiempo({
  hitos,
  orientacion = "vertical",
  className,
}: {
  hitos: Hito[];
  /** "horizontal" pasa a fila en escritorio; en movil siempre es vertical. */
  orientacion?: "vertical" | "horizontal";
  className?: string;
}) {
  const contenedor = useRef<HTMLOListElement>(null);
  const [activos, setActivos] = useState<boolean[]>(() => hitos.map(() => false));
  const [menosMovimiento, setMenosMovimiento] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const leer = () => setMenosMovimiento(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);

  useEffect(() => {
    if (menosMovimiento) {
      setActivos(hitos.map(() => true));
      return;
    }
    const el = contenedor.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll("[data-hito]"));
    // IntersectionObserver y no un listener de scroll: el navegador avisa cuando el
    // elemento entra, sin correr codigo en cada pixel de desplazamiento.
    const obs = new IntersectionObserver(
      (entradas) => {
        setActivos((prev) => {
          const copia = [...prev];
          let cambio = false;
          for (const e of entradas) {
            if (!e.isIntersecting) continue;
            const i = Number((e.target as HTMLElement).dataset.hito);
            // Solo enciende, nunca apaga: al subir de vuelta la linea no se deshace,
            // que se veria como un error.
            if (!copia[i]) {
              copia[i] = true;
              cambio = true;
            }
          }
          return cambio ? copia : prev;
        });
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0.1 },
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, [hitos, menosMovimiento]);

  const ultimo = activos.lastIndexOf(true);
  const avance = ultimo < 0 ? 0 : ((ultimo + 1) / hitos.length) * 100;
  const enFila = orientacion === "horizontal";

  return (
    <ol ref={contenedor} className={`relative ${className ?? ""}`}>
      <div
        aria-hidden
        className={
          enFila
            ? "absolute left-[15px] top-2 bottom-2 w-px bg-border md:left-0 md:right-0 md:top-[15px] md:bottom-auto md:h-px md:w-auto"
            : "absolute left-[15px] top-2 bottom-2 w-px bg-border"
        }
      >
        {/* El avance viaja como variable CSS y el CSS decide si llena alto o ancho.
            Leer window.innerWidth en el render romperia la hidratacion: el servidor
            no sabe el ancho de pantalla. */}
        <div
          style={{ ["--avance" as string]: `${avance}%` }}
          className={
            enFila
              ? "h-[var(--avance)] w-px bg-primary transition-[height,width] duration-[600ms] ease-[var(--ease-std)] md:h-px md:w-[var(--avance)]"
              : "h-[var(--avance)] w-px bg-primary transition-[height] duration-[600ms] ease-[var(--ease-std)]"
          }
        />
      </div>

      <div className={enFila ? "grid gap-10 md:grid-cols-5 md:gap-6" : "grid gap-12"}>
        {hitos.map((h, i) => (
          <li
            key={h.marca + i}
            data-hito={i}
            className={enFila ? "relative pl-12 md:pl-0 md:pt-12" : "relative pl-12"}
          >
            <span
              aria-hidden
              className={[
                "absolute left-2 top-1 h-[15px] w-[15px] rounded-full border-2",
                enFila ? "md:left-0 md:top-2" : "",
                "transition-[background-color,border-color,transform] duration-[var(--dur-hilo)] ease-[var(--ease-hilo)]",
                activos[i]
                  ? "scale-100 border-primary bg-primary"
                  : "scale-90 border-border bg-background",
              ].join(" ")}
            />
            <span
              className={[
                "block font-heading text-[1.5rem] font-light leading-none transition-colors duration-[var(--dur-color)] md:text-[1.75rem]",
                activos[i] ? "text-primary" : "text-muted-foreground/40",
              ].join(" ")}
            >
              {h.marca}
            </span>
            <h3 className="mt-3 max-w-[32ch] font-heading text-[1.25rem] leading-snug text-foreground md:text-[1.4375rem]">
              {h.titulo}
            </h3>
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {h.texto}
            </p>
          </li>
        ))}
      </div>
    </ol>
  );
}
