import Link from "next/link";
import Figura from "@/components/figura";
import { pendiente, type Ranura } from "@/lib/media";

/**
 * Quién teje. Sostiene el precio de un encargo a medida: lo que se compra es el criterio
 * de quien teje, no una prenda de catálogo.
 *
 * El texto es de Katy, verificado, y no se toca. Es de lo mejor que tiene el sitio.
 *
 * La foto va HORIZONTAL (retrato de ella en ambiente). La que había, katy-retrato.jpg, es una
 * selfie de interior con un perro tapándole media cara: servía para una bio chica, no para ser
 * la imagen más grande de la portada. Queda pendiente hasta tener un retrato real.
 */
const RETRATO_POR_DEFECTO = pendiente(
  "horizontal",
  "Retrato horizontal de Katy en el taller, mirando a cámara. Sirve también de póster del video de saludo."
);

export default function AboutMini({ media = RETRATO_POR_DEFECTO }: { media?: Ranura }) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Figura media={media} />

          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Quién teje
            </p>
            <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3rem]">
              El telar me encontró a mí
            </h2>
            <p className="mt-6 max-w-[52ch] leading-relaxed text-muted-foreground">
              Soy Katy, tejedora autodidacta de telar mapuche, crochet y
              palillo. <em>Kafkún</em> significa susurro en mapudungun, y creo
              que el telar me encontró a mí. Aprendí sola, porque no encontré a
              nadie que me enseñara: me equivoqué harto y cometí muchos errores,
              hasta que fui perfeccionando la técnica.
            </p>
            <blockquote className="mt-8 border-l-2 border-primary pl-6">
              <p className="max-w-[46ch] font-heading text-[1.3125rem] italic leading-snug text-foreground">
                En mis talleres no me guardo ningún dato. Todo lo que he
                aprendido desde la práctica, lo enseño, con todos los tips y sin
                mezquindades.
              </p>
            </blockquote>
            <Link
              href="/sobre-mi"
              className="hilo mt-8 inline-block text-[0.9375rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Leer mi historia completa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
