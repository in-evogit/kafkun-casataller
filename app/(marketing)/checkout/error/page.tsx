import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Error en el pago · Casa Taller Kafkun",
  robots: { index: false },
};

export default function CheckoutErrorPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="flex justify-center">
        <XCircle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        El pago no se completó
      </h1>
      <p className="mt-3 text-muted-foreground">
        No se realizó ningún cobro. Puedes intentarlo de nuevo o contactarnos
        si el problema persiste.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/carrito"
          className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
        >
          Volver al carrito
        </Link>
        <Link
          href="/contacto"
          className="rounded-md border border-border px-8 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Contactar soporte
        </Link>
      </div>
    </main>
  );
}
