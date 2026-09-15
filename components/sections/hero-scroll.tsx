import Image from "next/image";
import Link from "next/link";
import { obrasPublicables } from "@/lib/data/obras";
import { estaPendiente } from "@/lib/media";

/**
 * Hero: las piezas primero, el texto despues.
 *
 * La secuencia que pidio Gabriel: al entrar se ven las piezas de Katty en tarjetas;
 * al bajar se juntan, el fondo se oscurece y RECIEN AHI aparece el texto.
 *
 * El primer intento tenia el orden al reves —texto encima, fotos detras de un velo
 * radial al 82%— y el resultado era una pantalla negra con letras. Las fotos estaban
 * ahi, pero nadie las veia. Ahora el velo nace transparente.
 *
 * Las fotos son las obras REALES de Katty, no un banco de imagenes: lo primero que se
 * ve al entrar al sitio es su trabajo.
 *
 * Sin libreria de animacion: ver la nota en globals.css, seccion "Hero con scroll".
 */
export default function HeroScroll() {
  const piezas = obrasPublicables
    .filter((o) => !estaPendiente(o.media))
    .slice(0, 6)
    .map((o) => ({
      src: (o.media as { src: string }).src,
      alt: (o.media as { alt: string }).alt,
    }));

  // Cada tarjeta con su forma: una grande que manda y cinco alrededor. Una reja
  // pareja se lee como catalogo; esta se lee como un muestrario desplegado.
  const formas = [
    "col-span-2 row-span-2 md:col-span-3 md:row-span-2",
    "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    "hidden md:col-span-1 md:row-span-1 md:block",
    "hidden md:col-span-1 md:row-span-1 md:block",
  ];

  return (
    <section className="hero-scroll relative bg-[#0b0b0b]">
      {/* El alto largo ES el recorrido del scroll. La escena queda pegada mientras
          tanto, que es lo que hace que se lea como una sola toma y no como tres. */}
      <div className="h-[200vh] md:h-[240vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-2 grid-rows-3 gap-2.5 [height:min(78vh,44rem)] md:grid-cols-6 md:grid-rows-2 md:gap-3.5">
              {piezas.map((p, i) => (
                <div
                  key={p.src}
                  style={{ animationDelay: `${i * 26}ms` }}
                  className={`hero-celda relative overflow-hidden rounded-[2px] bg-[#1a1a1a] ${formas[i] ?? "hidden"}`}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    priority={i < 2}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* El velo. Nace invisible y se cierra con el scroll: por eso al entrar
                las piezas se ven tal cual, y el texto solo llega cuando ya hay fondo
                oscuro donde apoyarse. */}
            <div
              aria-hidden
              className="hero-velo pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.80)_55%,rgba(0,0,0,0.88)_100%)] opacity-0"
            />

            <div className="hero-texto pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--tinta-foreground)]/70">
                Casa Taller Kafkún · Sur de Chile
              </p>
              <h1 className="mt-5 max-w-[18ch] text-balance font-heading text-[2.25rem] font-light leading-[0.98] tracking-[-0.025em] text-[var(--tinta-foreground)] sm:text-[2.875rem] md:text-[4.25rem]">
                Una pieza tejida{" "}
                <em className="font-normal italic">para ti</em>, no para una talla.
              </h1>
              <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--tinta-foreground)]/85">
                Soy Katty. Tejo a telar, a crochet y a palillo desde el sur de Chile.
              </p>

              <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/a-pedido"
                  className="inline-flex h-12 items-center justify-center rounded-[2px] border border-[var(--tinta-foreground)] bg-[var(--tinta-foreground)] px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[#0b0b0b] transition-[background-color,transform] duration-[var(--dur-color)] hover:bg-[var(--tinta-foreground)]/88 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tinta-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                >
                  Ver las obras
                </Link>
                <Link
                  href="/cursos"
                  className="inline-flex h-12 items-center justify-center rounded-[2px] border border-[var(--tinta-foreground)]/45 px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[border-color,background-color,transform] duration-[var(--dur-color)] hover:border-[var(--tinta-foreground)] hover:bg-[var(--tinta-foreground)]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tinta-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                >
                  Ver las clases
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIN SOPORTE DE ANIMACIONES DE SCROLL (hoy Firefox) el velo y el texto se
          quedarian invisibles con opacity-0, o sea el hero saldria sin titular. Este
          bloque los devuelve a la vista: se pierde el efecto, no el contenido. */}
      <style>{`
        @supports not (animation-timeline: view()) {
          .hero-scroll .hero-velo,
          .hero-scroll .hero-texto { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
