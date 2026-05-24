import Link from "next/link";

// Fase 2: construir navbar completo con menú, carrito y auth state
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-xl font-semibold text-primary">
          Casa Taller Kafkun
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/cursos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Cursos
          </Link>
          <Link href="/tienda" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Tienda
          </Link>
          <Link href="/sobre-mi" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sobre mí
          </Link>
        </nav>
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
        >
          Ingresar
        </Link>
      </div>
    </header>
  );
}
