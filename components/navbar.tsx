import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CartIcon from "@/components/cart-icon";
import MobileNav from "@/components/mobile-nav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold text-primary"
        >
          Casa Taller Kafkun
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href="/cursos"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cursos
          </Link>
          <Link
            href="/tienda"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tienda
          </Link>
          <Link
            href="/diario"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Diario
          </Link>
          <Link
            href="/sobre-mi"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sobre mí
          </Link>
          <Link
            href="/contacto"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <CartIcon />
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <Link
                href="/mis-cursos"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
              >
                Mi cuenta
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                  Empezar
                </Link>
              </>
            )}
          </div>
          <MobileNav isLoggedIn={!!user} />
        </div>
      </div>
    </header>
  );
}
