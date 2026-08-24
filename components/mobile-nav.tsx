"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Los links los decide el navbar, para que escritorio y móvil no puedan
// desincronizarse. Sin Tienda, sin Diario y sin sesión: el área de alumnas
// quedó dormida hasta que exista el curso.
type Link = { href: string; label: string };

export default function MobileNav({ links }: { links: Link[] }) {
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
              <Link
                href="/contacto"
                onClick={close}
                className="mt-4 flex h-13 items-center justify-center rounded-[2px] bg-primary px-4 text-base font-medium text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent"
              >
                Hacer mi pedido
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
