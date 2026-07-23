"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/cursos", label: "Cursos" },
  { href: "/tienda", label: "Tienda" },
  { href: "/diario", label: "Diario" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <>
          {/* Fondo para cerrar al tocar afuera */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 top-16 z-30 cursor-default bg-foreground/20"
          />
          {/* Panel */}
          <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background shadow-lg">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="border-b border-border/60 py-3 text-base text-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {isLoggedIn ? (
                  <Link
                    href="/mis-cursos"
                    onClick={close}
                    className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                  >
                    Mi cuenta
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={close}
                      className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/registro"
                      onClick={close}
                      className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                    >
                      Empezar
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
