import Link from "next/link";

/**
 * Las dos puertas.
 *
 * A Kafkun llegan dos personas muy distintas: la que quiere TENER una pieza y la que
 * quiere APRENDER a tejerla. Hasta ahora la portada las mezclaba —obras por un lado,
 * cursos por otro, sin nada que dijera "elige tu camino"— y quien no se reconocia en la
 * primera seccion seguia bajando sin saber si el sitio era para ella.
 *
 * Dos verbos distintos y a proposito: encargar y aprender. Nunca "comprar", que es lo
 * que rompe el encargo (no hay carrito) y abarata la clase.
 */
const puertas = [
  {
    eyebrow: "Quiero una pieza",
    titulo: "Encargar",
    texto:
      "Conversamos qué quieres, traes tus referencias y eliges el material tocándolo. La pieza se teje sobre tus medidas.",
    cta: "Empezar mi encargo",
    href: "/a-pedido/empezar",
    secundario: { texto: "Ver las obras", href: "/a-pedido" },
    principal: true,
  },
  {
    eyebrow: "Quiero aprender",
    titulo: "Aprender",
    texto:
      "Clases grabadas que ves a tu ritmo, sin fechas ni cupos. Todo lo que Katy aprendió desde la práctica, sin mezquindades.",
    cta: "Ver las clases",
    href: "/cursos",
    secundario: null,
    principal: false,
  },
];

export default function DosPuertas() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3rem]">
            ¿Quieres tener una pieza, o aprender a tejerla?
          </h2>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {puertas.map((p) => (
            <div
              key={p.titulo}
              className="border-l border-border pl-6 transition-colors duration-[var(--dur-color)] hover:border-primary md:pl-8"
            >
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {p.eyebrow}
              </p>
              <h3 className="mt-3 font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-foreground md:text-[2.125rem]">
                {p.titulo}
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {p.texto}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={p.href}
                  className={
                    p.principal
                      ? "hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      : "hilo inline-flex h-12 items-center justify-center border-b border-transparent px-1 text-[0.9375rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  }
                >
                  {p.cta}
                </Link>
                {p.secundario && (
                  <Link
                    href={p.secundario.href}
                    className="hilo text-[0.9375rem] text-muted-foreground transition-colors duration-[var(--dur-color)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {p.secundario.texto}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
