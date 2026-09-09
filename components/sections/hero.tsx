import Image from "next/image";
import Link from "next/link";

/**
 * Hero de la portada.
 *
 * La foto es el lago con la cordillera al fondo, sur de Chile, que entrego Gabriel.
 *
 * EL VELO NO ES DECORACION. Medido sobre la foto, el peor punto de la zona del texto
 * daba 1.05:1 — tinta oscura sobre bosque oscuro, ilegible. Pero un velo parejo sobre
 * toda la imagen la lava y deja de valer la pena ponerla. Por eso el velo es LATERAL:
 * fuerte donde va el texto y transparente sobre el agua y la montana, que es lo que
 * hay que ver. En movil el degradado gira a vertical, porque ahi el texto ocupa el
 * ancho completo y un velo lateral no lo cubriria.
 *
 * Los textos cambian con la foto: hablan del lugar, no solo de la tecnica. Y ya no
 * dicen "telar mapuche" a secas — Katy tambien teje a crochet y palillo, y sus propias
 * alumnas lo dicen en las resenas.
 */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-secondary">
      <Image
        src="/images/hero-paisaje.jpg"
        alt="Lago en calma reflejando la cordillera, en el sur de Chile"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* Velo de papel: vertical en móvil, lateral en escritorio. Con esto el peor
          punto medido pasa de 1.05:1 a más de 8:1. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--background)_0%,color-mix(in_oklch,var(--background)_88%,transparent)_46%,color-mix(in_oklch,var(--background)_18%,transparent)_100%)] md:bg-[linear-gradient(to_right,var(--background)_0%,color-mix(in_oklch,var(--background)_92%,transparent)_38%,color-mix(in_oklch,var(--background)_10%,transparent)_78%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8 lg:pt-36 lg:pb-44">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Casa Taller Kafkún · Sur de Chile
          </p>
          {/* text-balance reparte las líneas parejo y evita que "ti," quede huérfana. */}
          <h1 className="mt-5 text-balance font-heading text-[2.875rem] font-light leading-[0.95] tracking-[-0.025em] text-foreground md:text-[4.25rem] xl:text-[4.75rem]">
            Una pieza tejida{" "}
            <em className="font-normal italic text-primary">para ti</em>, no para
            una talla.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
            Soy Katy. Tejo a telar, a crochet y a palillo desde el sur de Chile.
            Hago piezas por encargo, conversadas contigo, y enseño lo que sé sin
            guardarme nada.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/a-pedido"
              className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] border border-primary bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:border-accent hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver las obras
            </Link>
            <Link
              href="/cursos"
              className="inline-flex h-12 items-center justify-center rounded-[2px] border border-border bg-background/70 px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-foreground backdrop-blur-sm transition-colors duration-[var(--dur-color)] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver las clases
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
