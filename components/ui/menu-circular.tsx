import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Botones que se abren al pasar el cursor y revelan su nombre.
 *
 * Es el mecanismo del GradientMenu que pidio Gabriel, traducido al idioma del sitio.
 * Lo que se conservo: el circulo que se estira, el icono que se va, el nombre que
 * entra detras. Lo que cambio, y por que:
 *
 *   - Iconos de lucide-react, no react-icons. El proyecto YA tiene lucide; sumar otra
 *     libreria de iconos son 2 dependencias haciendo el mismo trabajo.
 *   - Un solo carmesi (#c50906, el del logo de Katy) en vez de degradados neon
 *     morado/rosa/azul/verde. Kafkun tiene UN color; cinco degradados distintos en
 *     una pagina de telar mapuche se leen como plantilla descargada.
 *   - Sin blur glow. Nada en el sitio brilla.
 *   - 280ms con el easing del gesto del hilo, no 500ms lineales: 500 en algo que se
 *     toca seguido se siente lento.
 *
 * EN TACTIL NO HAY HOVER, y un boton cuyo nombre solo aparece al pasar el cursor es
 * ilegible en un telefono. Por eso en pantallas sin cursor la pastilla ya viene
 * abierta con su nombre a la vista.
 */
export type ItemCircular = {
  titulo: string;
  /**
   * Cualquier componente que dibuje un SVG y acepte className.
   *
   * No se tipa como LucideIcon a proposito: lucide-react NO exporta Instagram, y el
   * sitio ya trae ese logo como SVG propio en el pie. Atarlo a lucide obligaria a
   * elegir un icono equivocado solo porque la libreria lo tiene.
   */
  icono: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  href: string;
  externo?: boolean;
};

export default function MenuCircular({
  items,
  className,
}: {
  items: ItemCircular[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {items.map(({ titulo, icono: Icono, href, externo }) => (
        <li key={titulo}>
          <Link
            href={href}
            {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={titulo}
            className={cn(
              "group relative flex h-14 items-center overflow-hidden rounded-full border border-border bg-background",
              // Solo se anima el ancho y el color. En tactil nace abierta.
              "w-auto px-5 transition-[width,background-color,border-color,transform] duration-[var(--dur-hilo)] ease-[var(--ease-hilo)]",
              "hover:border-primary hover:bg-primary active:scale-[0.97]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              // Con cursor: arranca redonda y se estira. Sin cursor: siempre abierta.
              "hover:w-auto [@media(hover:hover)]:w-14 [@media(hover:hover)]:justify-center [@media(hover:hover)]:px-0 [@media(hover:hover)]:hover:px-5",
            )}
          >
            <Icono
              aria-hidden
              className={cn(
                "h-5 w-5 shrink-0 text-primary transition-colors duration-[var(--dur-color)]",
                "group-hover:text-primary-foreground",
              )}
            />
            <span
              className={cn(
                "ml-3 whitespace-nowrap text-[0.9375rem] font-medium text-foreground",
                "transition-colors duration-[var(--dur-color)] group-hover:text-primary-foreground",
                // Con cursor el nombre se esconde hasta que la pastilla se abre.
                "[@media(hover:hover)]:ml-0 [@media(hover:hover)]:w-0 [@media(hover:hover)]:opacity-0",
                "[@media(hover:hover)]:transition-[width,opacity,margin] [@media(hover:hover)]:duration-[var(--dur-hilo)]",
                "[@media(hover:hover)]:group-hover:ml-3 [@media(hover:hover)]:group-hover:w-auto [@media(hover:hover)]:group-hover:opacity-100",
              )}
            >
              {titulo}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
