import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CLASE_PROPORCION,
  SIZES_PROPORCION,
  estaPendiente,
  type Ranura,
} from "@/lib/media";

type Props = {
  media: Ranura;
  className?: string;
  /** Solo para la imagen que es el LCP de la página (hero). Una por página, no más. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Dibuja una ranura de imagen, exista la foto o no.
 *
 * El estado sin foto NO es un cuadro gris de error: es una superficie de lienzo con la
 * urdimbre marcada, del tamaño exacto que va a ocupar la foto definitiva. Así el sitio se
 * ve terminado mientras Katy consigue el material, y además no hay salto de layout el día
 * que la foto entre, porque el espacio ya estaba reservado.
 *
 * Server component a propósito: cero JavaScript en el cliente.
 */
export default function Figura({ media, className, priority, sizes }: Props) {
  const ratio = CLASE_PROPORCION[media.proporcion];

  if (estaPendiente(media)) {
    return (
      <div
        className={cn(
          // w-full es obligatorio: con aspect-ratio y un max-height, el navegador achica
          // el ANCHO para conservar la proporción en vez de recortar el alto.
          "relative w-full overflow-hidden bg-secondary",
          ratio,
          className
        )}
        aria-hidden
      >
        {/* Urdimbre en tinta: hilos verticales, sin retícula. */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 9px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 23px)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Foto en camino
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden bg-muted", ratio, className)}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes={sizes ?? SIZES_PROPORCION[media.proporcion]}
        className="object-cover"
        style={media.posicion ? { objectPosition: media.posicion } : undefined}
      />
    </div>
  );
}
