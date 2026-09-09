"use client";

import Link from "next/link";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { estaPendiente } from "@/lib/media";
import type { Obra } from "@/lib/data/obras";

/**
 * Las obras a pedido, en carrusel de portadas.
 *
 * La reja anterior mostraba las piezas todas del mismo tamano y a la misma
 * distancia, que es como se lee un catalogo. Aca hay una pieza al centro y las
 * demas inclinandose hacia atras: se mira UNA a la vez, con las otras insinuadas.
 * Para un encargo eso es lo correcto — nadie compra "una de estas ocho", cada
 * persona esta imaginando la suya.
 *
 * Tarjetas VERTICALES (3:4) y no cuadradas: es la proporcion con la que se
 * fotografia una prenda colgada, y en cuadrado se pierde un cuarto de cada pieza.
 */
export default function ObrasCarrusel({
  obras,
  titulo,
  bajada,
  cta,
}: {
  obras: Obra[];
  titulo: string;
  bajada: string;
  cta?: { texto: string; href: string };
}) {
  const slides = obras
    .filter((o) => !estaPendiente(o.media))
    .map((o) => ({
      // El filtro de arriba ya descarto las ranuras sin foto.
      src: (o.media as { src: string }).src,
      alt: (o.media as { alt: string }).alt,
      title: o.nombre,
      subtitle: o.materialYTecnica ?? "Obra entregada",
    }));

  if (slides.length === 0) return null;

  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Obras a pedido
          </p>
          <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3rem]">
            {titulo}
          </h2>
          <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
            {bajada}
          </p>
        </div>

        <CoverflowCarousel
          slides={slides}
          cardAspect={0.75}
          cardWidth="clamp(190px, 26vw, 300px)"
          // Menos inclinacion que el original (44): una prenda muy girada deja de
          // leerse como prenda. A 34 se sigue viendo el corte de la pieza vecina.
          rotate={34}
          depth={0.5}
          fade={0.16}
          showCaption
          showPagination
          showNavigation
          label="Piezas tejidas por encargo"
          className="mt-6"
          // rounded-[2px]: el sitio entero usa esquinas casi rectas. El rounded-2xl
          // que traia el componente lo delataria como pieza importada.
          cardClassName="rounded-[2px] shadow-[0_2px_8px_rgba(44,26,17,0.10),0_16px_40px_-12px_rgba(44,26,17,0.18)]"
        />

        <p className="mt-10 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Todas estas piezas ya fueron tejidas para alguien. Están para mostrarte hasta
          dónde llega el trabajo, no para comprarlas tal cual.
        </p>

        {cta && (
          <div className="mt-8">
            <Link
              href={cta.href}
              className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {cta.texto}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
