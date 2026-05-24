import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Pago exitoso · Casa Taller Kafkun",
  robots: { index: false },
};

export default function CheckoutExitoPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        ¡Pago recibido!
      </h1>
      <p className="mt-3 text-muted-foreground">
        En unos segundos recibirás un email con acceso a tu curso. Si no llega
        en 5 minutos, revisa tu carpeta de spam.
      </p>
      <Link
        href="/mis-cursos"
        className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
      >
        Ir a mis cursos →
      </Link>
    </main>
  );
}
