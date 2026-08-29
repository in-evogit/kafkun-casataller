import Link from "next/link";

/**
 * Cierre con las dos puertas explícitas, para quien recorrió toda la portada sin hacer clic.
 *
 * Es el único lugar del sitio con dos botones del mismo peso, y se justifica porque son las dos
 * vías del negocio: encargar una pieza y aprender la técnica. Los verbos son distintos a
 * propósito, para que nadie confunda una cosa con la otra.
 *
 * Prohibido acá: garantías, plazos de entrega, "acceso de por vida" y "últimos cupos".
 */
export default function FinalCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <h2 className="text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
          Dos maneras de empezar
        </h2>

        <div className="mt-12 grid gap-10 border-t border-border pt-10 sm:grid-cols-2 sm:gap-16">
          <div>
            <h3 className="font-heading text-[1.3125rem] text-foreground">
              Encargar una pieza
            </h3>
            <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              Conversamos, tomo tus medidas y definimos juntas la pieza. Recién
              después de eso hay precio.
            </p>
            <Link
              href="/a-pedido/empezar"
              className="hilo hilo-boton relative mt-6 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Empezar mi encargo
            </Link>
          </div>

          <div>
            <h3 className="font-heading text-[1.3125rem] text-foreground">
              Aprender la técnica
            </h3>
            <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              Clases grabadas que ves a tu ritmo. Si nunca has tejido en telar,
              parte por la primera.
            </p>
            <Link
              href="/cursos"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[2px] border border-border-strong px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-foreground transition-colors duration-[var(--dur-color)] hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver las clases
            </Link>
          </div>
        </div>

        <p className="mt-14 text-[0.8125rem] text-muted-foreground">
          kafkuntelares@gmail.com · @casataller_kafkun
        </p>
      </div>
    </section>
  );
}
