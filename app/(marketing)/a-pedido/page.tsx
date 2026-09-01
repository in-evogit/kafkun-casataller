import type { Metadata } from "next";
import Link from "next/link";
import ObraCard from "@/components/obra-card";
import { familiasEncargo } from "@/lib/data/obras";
import { pasosEncargo } from "@/lib/data/proceso";

export const metadata: Metadata = {
  title: "A pedido",
  description:
    "Chalecos, chales y piezas tejidas a telar sobre tus medidas. Se define conversando: tus referencias, el material en la mano, y recién ahí el precio.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/a-pedido` },
};

/**
 * La via del encargo.
 *
 * Reemplaza a /tienda, que prometia una tienda donde no se puede comprar nada: tenia
 * filtros por categoria, tarjetas de producto con precio y un boton de carrito, sobre
 * piezas que en realidad son unicas y ya entregadas. Esa contradiccion hacia rebotar a
 * quien llegaba con cabeza de comprador.
 *
 * Aca no hay precio ni carrito a proposito. Lo que hay es prueba de trabajo, agrupada por
 * familia, y un camino claro hacia la conversacion.
 */
export default function APedidoPage() {
  const familias = familiasEncargo
    .map((f) => ({ ...f, obras: f.obras.filter((o) => o.publicable) }))
    .filter((f) => f.obras.length > 0)
    .sort((a, b) => a.orden - b.orden);

  return (
    <main>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-14 sm:px-6 sm:pt-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              A pedido
            </p>
            <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
              No tejo un chaleco típico. Tejo el que tú quieres.
            </h1>
            {/* La aclaracion de que no estan en venta va ANTES de las fotos, no despues:
                es lo que evita que alguien las recorra buscando el boton de comprar. */}
            <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
              Cada pieza se teje sobre tus medidas y se define conversando. Todo lo que
              ves aquí abajo ya fue tejido para alguien: está para mostrarte hasta dónde
              llega el trabajo, no para comprarlo tal cual.
            </p>

            <div className="mt-9">
              <Link
                href="/a-pedido/empezar"
                className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Empezar mi encargo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {familias.map((familia, i) => (
        <section
          key={familia.slug}
          id={familia.slug}
          className={i % 2 === 1 ? "bg-secondary" : "bg-background"}
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl border-l border-border pl-6">
              <h2 className="font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-foreground md:text-[2.125rem]">
                {familia.nombre}
              </h2>
              <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {familia.bajada}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:gap-x-8">
              {familia.obras.map((obra, j) => (
                <div
                  key={obra.slug}
                  // Desfase alterno solo en escritorio: rompe la cuadricula y hace que
                  // se lea como muestrario y no como catalogo. En movil desordena.
                  className={j % 3 === 1 ? "md:mt-12" : undefined}
                >
                  <ObraCard obra={obra} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* El proceso va DESPUES de la prueba de trabajo: primero se genera el deseo
          viendo lo que Katy hace, y recien entonces se explica como se consigue. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Cómo funciona
            </p>
            <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3rem]">
              De una conversación a una pieza
            </h2>
          </div>

          <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pasosEncargo.map((p) => (
              <li
                key={p.n}
                className="border-l border-border pl-6 transition-colors duration-[var(--dur-color)] hover:border-primary"
              >
                <span className="block font-heading text-[2.125rem] font-light leading-none text-muted-foreground/60">
                  {p.n}
                </span>
                <h3 className="mt-3 font-heading text-[1.3125rem] text-foreground">
                  {p.titulo}
                </h3>
                <p className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {p.texto}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-14">
            <Link
              href="/a-pedido/empezar"
              className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Empezar mi encargo
            </Link>
            <p className="mt-4 max-w-[46ch] text-[0.875rem] leading-relaxed text-muted-foreground">
              No te compromete a nada. El precio y el plazo salen al final, con la pieza
              ya definida entre los dos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
