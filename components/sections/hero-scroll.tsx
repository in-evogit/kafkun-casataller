import Image from "next/image";
import Link from "next/link";

/**
 * Hero: cuatro columnas de piezas subiendo, con el texto encima.
 *
 * Gabriel: "tipo carrusel de fotos pero al scroll hacia arriba... que no se vea
 * pobreza, que no queden espacios negros, el corte redondeado, como cards que se van
 * al cielo".
 *
 * QUE NO QUEDEN HUECOS es la parte que hay que cuidar: cada columna lleva ocho fotos
 * y mide bastante mas que la pantalla, y arranca ya desplazada hacia abajo. Al subir
 * siempre hay foto entrando por el borde inferior, porque el recorrido nunca supera
 * el sobrante de la columna.
 *
 * Las columnas viajan distinto a proposito. Si todas fueran a la misma velocidad se
 * leeria como una sola imagen grande desplazandose; a velocidades distintas se lee
 * como planos a distintas profundidades.
 *
 * FOTOS: se excluyen a mano las que muestran caras de terceros —obra-clientes,
 * obra-manta-crema, obra-capucha-mostaza, taller-alumnas, taller-mesa— porque no
 * tenemos su autorizacion por escrito. Las de Katty si van: es su sitio.
 */
const COLUMNAS: string[][] = [
  [
    "obra-chaleco-mostaza-1",
    "obra-manta-roja-1",
    "obra-chal-rosa-1",
    "lanas-1",
    "obra-cintas-muestrario",
    "prod-chaleco-verde-1",
    "obra-manta-hojas",
    "katy-telar",
  ],
  [
    "obra-chal-gris",
    "obra-chaleco-cafe-1",
    "materiales-conos",
    "obra-manta-roja-2",
    "prod-bufanda-roja-1",
    "obra-correas-1",
    "proceso-telar",
    "obra-chal-rosa-2",
  ],
  [
    "obra-manta-roja-caja",
    "obra-cinta-amarilla",
    "obra-chaleco-mostaza-2",
    "lanas-2",
    "prod-bufanda-blanca-1",
    "katty-chal-gris",
    "obra-correas-4",
    "obra-chaleco-cafe-2",
  ],
  [
    "prod-chaleco-verde-2",
    "materiales-caja",
    "obra-correas-2",
    "telar-proceso",
    "prod-bufanda-blanca-2",
    "obra-langer-1",
    "katy-taller",
    "obra-correas-3",
  ],
];

// De donde sale y a donde llega cada columna. El sobrante de cada una es mayor que
// su recorrido, que es lo que garantiza que no aparezca fondo.
const VIAJES = [
  { desde: "-4%", hasta: "-30%" },
  { desde: "-14%", hasta: "-46%" },
  { desde: "-2%", hasta: "-26%" },
  { desde: "-10%", hasta: "-40%" },
];

export default function HeroScroll() {
  return (
    <section className="hero-scroll relative bg-[#0b0b0b]">
      {/* El alto largo ES el recorrido. La escena queda pegada mientras tanto. */}
      <div className="h-[260vh] md:h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Las columnas ocupan TODO el ancho y mas alto que la pantalla. */}
          <div className="absolute inset-0 grid grid-cols-2 gap-2.5 p-2.5 md:grid-cols-4 md:gap-3 md:p-3">
            {COLUMNAS.map((col, c) => (
              <div
                key={c}
                style={
                  {
                    "--desde": VIAJES[c].desde,
                    "--hasta": VIAJES[c].hasta,
                  } as React.CSSProperties
                }
                className={[
                  "hero-col flex flex-col gap-2.5 will-change-transform md:gap-3",
                  // En móvil solo caben dos columnas: las otras dos se esconden y
                  // las visibles llevan igual sus ocho fotos, así no queda hueco.
                  c >= 2 ? "hidden md:flex" : "flex",
                ].join(" ")}
              >
                {col.map((nombre, i) => (
                  <div
                    key={nombre + i}
                    className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a]"
                  >
                    <Image
                      src={`/images/${nombre}.jpg`}
                      alt=""
                      fill
                      priority={c < 2 && i < 2}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* El velo nace invisible: al entrar se ven las piezas tal cual, y se
              cierra con el scroll para que el texto tenga donde apoyarse. */}
          <div
            aria-hidden
            className="hero-velo pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.70)_0%,rgba(0,0,0,0.82)_50%,rgba(0,0,0,0.90)_100%)] opacity-0"
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
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--tinta-foreground)] bg-[var(--tinta-foreground)] px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[#0b0b0b] transition-[background-color,transform] duration-[var(--dur-color)] hover:bg-[var(--tinta-foreground)]/88 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tinta-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
              >
                Ver las obras
              </Link>
              <Link
                href="/cursos"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--tinta-foreground)]/45 px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[border-color,background-color,transform] duration-[var(--dur-color)] hover:border-[var(--tinta-foreground)] hover:bg-[var(--tinta-foreground)]/10 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tinta-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
              >
                Ver las clases
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sin soporte de animaciones de scroll el velo y el texto quedarian en
          opacity-0, o sea el hero saldria sin titular. Especificidad de
          descendiente e !important para que no dependa del orden de carga. */}
      <style>{`
        @supports not (animation-timeline: view()) {
          .hero-scroll .hero-velo,
          .hero-scroll .hero-texto { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
