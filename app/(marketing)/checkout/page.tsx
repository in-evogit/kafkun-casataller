import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { seedCourses } from "@/lib/data/seed";
import CheckoutButton from "@/components/checkout-button";

export const metadata: Metadata = {
  title: "Checkout · Casa Taller Kafkun",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ curso?: string }> };

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { curso } = await searchParams;
  const devMode = !process.env.MP_ACCESS_TOKEN;

  // Checkout de curso directo
  if (curso) {
    const course = seedCourses.find((c) => c.slug === curso);
    if (!course) {
      return (
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <p className="text-muted-foreground">Curso no encontrado.</p>
          <Link href="/cursos" className="mt-4 inline-block text-primary hover:underline">
            Ver todos los cursos
          </Link>
        </main>
      );
    }

    const items = [{ id: course.slug, type: "course" as const, title: course.title, price_clp: course.price_clp, quantity: 1 }];

    return (
      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Confirmar compra
        </h1>

        <div className="mt-6 flex gap-4 rounded-xl border border-border bg-background p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Curso online</p>
            <p className="font-medium text-foreground">{course.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{course.subtitle}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-secondary p-4">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-heading text-xl font-semibold text-foreground">
            {formatPrice(course.price_clp)}
          </span>
        </div>

        <div className="mt-6">
          <CheckoutButton items={items} devMode={devMode} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Pago seguro · Garantía 7 días · Acceso inmediato
        </div>
      </main>
    );
  }

  // Checkout desde carrito — el resumen lo maneja el client
  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Confirmar compra
      </h1>
      <p className="mt-2 text-muted-foreground">
        Revisa tu carrito antes de continuar.
      </p>
      <Link
        href="/carrito"
        className="mt-4 inline-block text-primary hover:underline"
      >
        ← Volver al carrito
      </Link>

      {devMode && (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Modo desarrollo</p>
          <p className="mt-1">
            El pago con Mercado Pago se activa cuando se configuren las
            credenciales oficiales.
          </p>
        </div>
      )}
    </main>
  );
}
