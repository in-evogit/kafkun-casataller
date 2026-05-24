import Link from "next/link";

// Fase 2: construir footer completo con newsletter y links legales
export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <span className="font-heading text-lg font-semibold text-primary">
            Casa Taller Kafkun
          </span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/contacto" className="hover:text-foreground">Contacto</Link>
            <Link href="/preguntas-frecuentes" className="hover:text-foreground">FAQ</Link>
            <Link href="/terminos" className="hover:text-foreground">Términos</Link>
            <Link href="/privacidad" className="hover:text-foreground">Privacidad</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Casa Taller Kafkun
          </p>
        </div>
      </div>
    </footer>
  );
}
