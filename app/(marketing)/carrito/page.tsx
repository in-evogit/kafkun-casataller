"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/store/cart";

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default function CarritoPage() {
  const { items, remove, updateQty, total, count } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-4xl">🧺</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora los cursos y agrega lo que te interese.
        </p>
        <Link
          href="/cursos"
          className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
        >
          Ver cursos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-foreground">
        Carrito ({count()} {count() === 1 ? "item" : "items"})
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-border bg-background p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.type === "course" ? "Curso" : "Producto"}
                    </p>
                    <p className="font-medium text-foreground">{item.title}</p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  {item.type === "product" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Acceso de por vida
                    </span>
                  )}
                  <span className="font-heading font-semibold text-foreground">
                    {formatPrice(item.price_clp * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="h-fit rounded-xl border border-border bg-secondary p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Resumen
          </h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[160px]">
                  {item.title}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                </span>
                <span>{formatPrice(item.price_clp * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-heading text-xl font-semibold text-foreground">
              {formatPrice(total())}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-md bg-primary px-6 py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-accent"
          >
            Proceder al pago →
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pago seguro · Garantía 7 días
          </p>
        </div>
      </div>
    </main>
  );
}
