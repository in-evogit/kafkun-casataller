import Link from "next/link";

/**
 * Hero de la portada.
 *
 * SIN FOTO, por decisión de Gabriel (7-sep-2026): la del telar que iba a sangre abajo
 * sobraba. El hero es puro texto — el titular, la promesa, las cifras y las dos puertas.
 *
 * Eso obliga a que el titular se sostenga solo, que es una prueba honesta: si el hero
 * necesita una foto para no verse vacío, es que el texto no estaba diciendo lo suficiente.
 *
 * El degradado carmesí anterior se fue: competía de frente con el rojo de las propias piezas
 * de Katy, que es el color que tiene que ganar en la página.
 */

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        {/* Texto primero, siempre: en móvil la foto sola sin texto no dice nada. */}
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Casa Taller Kafkún · Telar mapuche
          </p>
          {/* text-balance reparte las líneas parejo y evita que "ti," quede huérfana.
              El titular grande es lo que llena el ancho: el aire a la derecha queda como
              margen editorial, no como un hueco donde falta algo. */}
          <h1 className="mt-5 text-balance font-heading text-[2.875rem] font-light leading-[0.95] tracking-[-0.025em] text-foreground md:text-[4.25rem] xl:text-[5rem]">
            Una pieza tejida{" "}
            <em className="font-normal italic text-primary">para ti</em>, no para
            una talla.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
            Soy Katy, tejedora de telar mapuche. Hago piezas a pedido conversadas
            contigo, y enseño la técnica en clases que ves a tu ritmo.
          </p>

          {/* Las cifras que antes ocupaban una franja entera de tinta.
              Son datos confirmados por Katy (commit 03db920) y no se tocan; lo que
              cambia es el peso: aca sostienen la promesa del titular en el momento
              en que se lee, en vez de robarse un bloque completo de la portada. */}
          <dl className="mt-8 flex flex-wrap items-baseline gap-x-7 gap-y-2">
            {[
              { valor: "+50", etiqueta: "alumnas presenciales" },
              { valor: "2015", etiqueta: "enseñando desde" },
            ].map((d) => (
              <div key={d.etiqueta} className="flex items-baseline gap-2">
                <dt className="font-heading text-[1.375rem] font-light leading-none text-primary">
                  {d.valor}
                </dt>
                <dd className="text-[0.8125rem] text-muted-foreground">{d.etiqueta}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/a-pedido"
              className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver las obras
            </Link>
            <Link
              href="/cursos"
              className="hilo inline-flex h-12 items-center justify-center px-2 text-[0.9375rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver las clases
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
