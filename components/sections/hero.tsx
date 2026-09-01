import Link from "next/link";
import Figura from "@/components/figura";
import { pendiente, type Ranura } from "@/lib/media";

/**
 * Hero de la portada.
 *
 * La imagen va HORIZONTAL y llega por propiedad: hoy no existe la foto definitiva, así que
 * por defecto entra la ranura pendiente y el bloque se ve igual de terminado. Cuando Katy
 * entregue la foto, se pasa por `media` y este archivo no se toca.
 *
 * El degradado carmesí anterior se fue: competía de frente con el rojo de las propias piezas
 * de Katy, que es el color que tiene que ganar en la página.
 */
type Props = {
  media?: Ranura;
};

const MEDIA_POR_DEFECTO = pendiente(
  "panoramica",
  "Hero: foto horizontal de Katy en el taller o del witral en uso. Pendiente de Katy."
);

export default function Hero({ media = MEDIA_POR_DEFECTO }: Props) {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
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

      {/* La foto a sangre abajo: horizontal, ancho completo, sin radio ni sombra.
          Con el tope de alto, en pantallas anchas la foto se recorta en vez de empujar
          todo lo demás fuera de la pantalla. */}
      <div className="relative mt-14 sm:mt-20">
        <Figura
          media={media}
          priority
          sizes="100vw"
          className="max-h-[62vh] sm:max-h-[58vh]"
        />
      </div>
    </section>
  );
}
