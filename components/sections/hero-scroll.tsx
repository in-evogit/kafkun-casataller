import Image from "next/image";
import Link from "next/link";
import { obrasPublicables } from "@/lib/data/obras";
import { estaPendiente } from "@/lib/media";

/**
 * Hero con galeria que se junta al bajar.
 *
 * Es el efecto que pidio Gabriel: las piezas de Katty crecen y se juntan mientras se
 * hace scroll, el texto se va, y despues empieza la historia.
 *
 * SIN LIBRERIA DE ANIMACION, y la razon de fondo no es el peso. Una libreria anima
 * desde el hilo principal — el mismo que en ese momento esta cargando seis fotos e
 * hidratando React. El hero se anima justo cuando el navegador esta mas ocupado, que
 * es exactamente cuando se caen los cuadros. Las animaciones ligadas al scroll de CSS
 * corren en el compositor y no dependen de eso.
 *
 * Donde no hay soporte (hoy Firefox) las reglas se ignoran y la galeria se ve quieta
 * en su estado final. Se ve bien igual: no hay estado roto.
 *
 * Las fotos son las obras REALES de Katty, no un banco de imagenes. Son las mismas
 * que estan mas abajo en el carrusel, y eso es a proposito: lo primero que se ve al
 * entrar es su trabajo.
 */
export default function HeroScroll() {
  const piezas = obrasPublicables
    .filter((o) => !estaPendiente(o.media))
    .slice(0, 5)
    .map((o) => ({
      src: (o.media as { src: string }).src,
      alt: (o.media as { alt: string }).alt,
    }));

  return (
    <section className="hero-scroll relative bg-[#0b0b0b]">
      {/* Alto largo: es el recorrido del scroll. La galeria queda pegada mientras
          tanto, que es lo que hace que el efecto se lea como una sola escena. */}
      <div className="h-[220vh] md:h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* La reja de piezas, al fondo. */}
            <div className="grid grid-cols-8 grid-rows-[1.1fr_0.55fr_0.55fr] gap-3 opacity-90 md:gap-4">
              {piezas.map((p, i) => (
                <div
                  key={p.src}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={[
                    "hero-celda relative overflow-hidden rounded-[2px] bg-[#1a1a1a]",
                    i === 0
                      ? "col-span-8 row-span-3 md:col-span-5"
                      : i === 1
                        ? "hidden md:col-span-3 md:row-span-2 md:block"
                        : i === 2
                          ? "hidden md:col-span-3 md:block"
                          : i === 3
                            ? "hidden md:col-span-2 md:block"
                            : "hidden md:col-span-1 md:block",
                  ].join(" ")}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* El velo: sin esto el texto blanco cae sobre lana clara y desaparece. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.62)_45%,rgba(0,0,0,0.30)_100%)]"
            />

            {/* El texto, encima y al centro. Se va mientras las piezas se juntan. */}
            <div className="hero-texto pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--tinta-foreground)]/70">
                Casa Taller Kafkún · Sur de Chile
              </p>
              <h1 className="mt-5 max-w-[18ch] text-balance font-heading text-[2.5rem] font-light leading-[0.95] tracking-[-0.025em] text-[var(--tinta-foreground)] md:text-[4.25rem]">
                Una pieza tejida{" "}
                <em className="font-normal italic">para ti</em>, no para una talla.
              </h1>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--tinta-foreground)]/85">
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
    </section>
  );
}
