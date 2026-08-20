import Link from "next/link";
import ObraCard from "@/components/obra-card";
import { obrasPublicables } from "@/lib/data/obras";

/**
 * Obras a pedido.
 *
 * Antes esto era una grilla muda: ocho fotos recortadas a cuadrado —sobre originales 3:4, o
 * sea perdiendo un cuarto de cada pieza— sin un solo elemento clickeable. Era el desperdicio
 * más grande del sitio.
 *
 * La frase de que no están en venta va ANTES de las fotos, no después: es lo que evita que
 * alguien las recorra con cabeza de tienda y rebote al no encontrar el botón de comprar.
 */
export default function ObrasGallery() {
  if (obrasPublicables.length === 0) return null;

  return (
    <section id="a-pedido" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Obras a pedido
          </p>
          <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
            No tejo un chaleco típico. Tejo el que tú quieres.
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
            Tus medidas, la forma y el diseño conversados, y la lana elegida
            después de tocarla. Las piezas que ves acá ya fueron tejidas para
            alguien: están para mostrarte hasta dónde llega el trabajo, no para
            comprarlas tal cual.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-x-8">
          {obrasPublicables.map((obra, i) => (
            <div
              key={obra.slug}
              // El desfase vertical alterno rompe la cuadrícula y hace que se lea como un
              // muestrario y no como un catálogo. Solo en desktop: en móvil desordena.
              className={i % 3 === 1 ? "md:mt-14" : undefined}
            >
              <ObraCard obra={obra} />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href="/contacto"
            className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Hacer mi pedido
          </Link>
        </div>
      </div>
    </section>
  );
}
