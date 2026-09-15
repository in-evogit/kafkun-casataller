import Image from "next/image";
import Link from "next/link";

/**
 * Hero de la portada.
 *
 * EL VELO ES NEGRO, por pedido de Gabriel (15-sep). Antes fue papel (lavaba la foto)
 * y despues vino (la tenia, pero el tono competia con la imagen). Negro al 62% deja
 * el peor punto de la zona del texto en 6.19:1 y no le mete color a la foto: las
 * araucarias y el volcan se ven como son.
 *
 * Historia del velo, para no repetir el camino: Gabriel: "no me gusta que se vea blanco el
 * iluminado, dejemoslo tipo Mollendo porque si no se ve simple". Tenia razon y se
 * puede medir: el velo de papel al 92% dejaba el texto en 13.24:1 —legible— pero
 * LAVABA la foto hasta dejarla casi blanca, o sea que ponerla no servia de nada.
 *
 * El velo de vino al 55% deja el peor punto en 12.45:1 y OSCURECE en vez de lavar:
 * el lago y la cordillera se siguen viendo, con la profundidad intacta. Es la misma
 * idea de Mollendo — velo solo bajo el texto — pero con el color de la marca.
 *
 * El texto pasa a claro, que es lo que corresponde sobre un fondo oscuro.
 */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b0b0b]">
      <Image
        src="/images/hero-araucarias.jpg"
        alt="Araucarias contra un volcán nevado, en el sur de Chile"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/* Velo de vino: fuerte donde va el texto, se abre sobre el agua y la montaña.
          Vertical en móvil, lateral en escritorio — en móvil el texto ocupa el ancho
          completo y un velo lateral no lo cubriría. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.62)_52%,rgba(0,0,0,0.30)_100%)] md:bg-[linear-gradient(to_right,rgba(0,0,0,0.80)_0%,rgba(0,0,0,0.58)_44%,rgba(0,0,0,0.14)_84%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 sm:pt-32 sm:pb-36 lg:px-8 lg:pt-40 lg:pb-48">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--tinta-foreground)]/70">
            Casa Taller Kafkún · Sur de Chile
          </p>
          <h1 className="mt-5 text-balance font-heading text-[2.875rem] font-light leading-[0.95] tracking-[-0.025em] text-[var(--tinta-foreground)] md:text-[4.25rem] xl:text-[4.75rem]">
            Una pieza tejida{" "}
            <em className="font-normal italic">para ti</em>, no para una talla.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--tinta-foreground)]/85">
            Soy Katty. Tejo a telar, a crochet y a palillo desde el sur de Chile.
            Hago piezas por encargo, conversadas contigo, y enseño lo que sé sin
            guardarme nada.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {/* Sobre el vino, el boton solido va en PAPEL y no en carmesi: el carmesi
                sobre vino da 2.48:1 y desaparece. El papel encima da 14.32:1. */}
            <Link
              href="/a-pedido"
              className="inline-flex h-12 items-center justify-center rounded-[2px] border border-[var(--tinta-foreground)] bg-[var(--tinta-foreground)] px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-tinta transition-[background-color,transform] duration-[var(--dur-color)] hover:bg-[var(--tinta-foreground)]/88 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tinta-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
            >
              Ver las obras
            </Link>
            <Link
              href="/cursos"
              className="inline-flex h-12 items-center justify-center rounded-[2px] border border-[var(--tinta-foreground)]/45 px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[border-color,background-color,transform] duration-[var(--dur-color)] hover:border-[var(--tinta-foreground)] hover:bg-[var(--tinta-foreground)]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tinta-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
            >
              Ver las clases
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
