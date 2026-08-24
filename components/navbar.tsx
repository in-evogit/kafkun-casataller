import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import { obrasPublicables } from "@/lib/data/obras";

/**
 * Navegación de 4 destinos. Cada uno se gana el lugar.
 *
 * Se cayeron: Tienda (no existe más — no hay venta online), Diario (el blog no
 * aporta al lanzamiento; sus entradas siguen publicadas pero fuera del menú), y
 * Login/Registro (no hay nada que loguear hasta que exista el curso: el área de
 * alumnas quedó dormida, sin links que lleven a ella).
 *
 * Dejó de ser async al salir el carrito y la sesión: ya no consulta Supabase, y
 * eso saca una llamada de red del layout de todas las páginas.
 */

export default function Navbar() {
  // "Obras" ancla a una sección que se esconde sola cuando no hay obras
  // publicables. Un link que no lleva a ninguna parte es peor que no tenerlo,
  // así que aparece solo cuando hay algo que mostrar: vuelve solo con las fotos.
  const links = [
    ...(obrasPublicables.length > 0 ? [{ href: "/#a-pedido", label: "Obras" }] : []),
    { href: "/sobre-mi", label: "Quién es Katy" },
    { href: "/cursos", label: "Clases" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold text-primary"
        >
          Casa Taller Kafkún
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hilo text-[0.9375rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {l.label}
            </Link>
          ))}
          {/* El único botón sólido del encabezado: es el destino del negocio. */}
          <Link
            href="/contacto"
            className="hilo hilo-boton relative inline-flex h-10 items-center justify-center rounded-[2px] bg-primary px-5 text-[0.875rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Hacer mi pedido
          </Link>
        </nav>

        <MobileNav links={links} />
      </div>
    </header>
  );
}
