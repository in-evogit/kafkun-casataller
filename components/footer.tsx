import Link from "next/link";

const links = {
  Aprende: [
    { href: "/cursos", label: "Todos los cursos" },
    { href: "/cursos/tu-primer-telar", label: "Tu primer telar" },
    { href: "/cursos/telar-mapuche", label: "Telar mapuche" },
    { href: "/cursos/diseno-propio", label: "Diseño propio" },
  ],
  Tienda: [
    { href: "/tienda", label: "Todos los productos" },
    { href: "/tienda?cat=telares", label: "Telares" },
    { href: "/tienda?cat=lanas", label: "Lanas" },
    { href: "/tienda?cat=kits", label: "Kits" },
  ],
  Casa: [
    { href: "/sobre-mi", label: "Sobre mí" },
    { href: "/diario", label: "Diario" },
    { href: "/contacto", label: "Contacto" },
    { href: "/preguntas-frecuentes", label: "FAQ" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-xl font-semibold text-primary">
              Casa Taller Kafkun
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Cursos de telar online desde el sur de Chile. Aprender a tejer
              es para cualquiera.
            </p>
            <a
              href="https://instagram.com/casataller_kafkun"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @casataller_kafkun
            </a>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Casa Taller Kafkun · Chile
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/terminos" className="hover:text-foreground">Términos</Link>
            <Link href="/privacidad" className="hover:text-foreground">Privacidad</Link>
            <Link href="/devoluciones" className="hover:text-foreground">Devoluciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
