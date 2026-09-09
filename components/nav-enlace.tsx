"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Enlace del menu que se marca cuando estas en esa seccion.
 *
 * Gabriel: "cuando estoy en alguna seccion que quede marcada, no se sabe en que
 * seccion estoy". Es un problema de orientacion real: sin esto, la barra se ve igual
 * en todas las paginas y no da ninguna pista de donde estas parado.
 *
 * La marca es DOBLE a proposito. El color solo no basta: quien no distingue bien los
 * colores no ve ninguna diferencia. Por eso ademas va el hilo tensado —el gesto firma
 * del sitio, quieto en vez de animado— y aria-current, que es lo que anuncia un lector
 * de pantalla.
 */
export default function NavEnlace({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ruta = usePathname();
  // Coincidencia por prefijo: estando en /a-pedido/empezar, "A pedido" sigue marcado.
  const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "relative text-sm transition-colors duration-[var(--dur-color)]",
        activo ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
      {activo && (
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-0 right-0 h-px bg-primary"
        />
      )}
    </Link>
  );
}
