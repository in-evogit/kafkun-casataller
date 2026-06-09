"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, Tag, X } from "lucide-react";
import { useCart } from "@/lib/store/cart";

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

function CuponInput() {
  const { coupon, setCoupon, subtotal } = useCart();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Cupón no válido");
      } else {
        setCoupon(data);
        setCode("");
      }
    } catch {
      setError("Error al validar el cupón");
    } finally {
      setLoading(false);
    }
  }

  if (coupon) {
    const descuento =
      coupon.discount_type === "percent"
        ? `${coupon.discount_value}% de descuento`
        : `${formatPrice(coupon.discount_value)} de descuento`;

    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm">
        <div className="flex items-center gap-2 text-green-700">
          <Tag className="h-3.5 w-3.5" />
          <span className="font-medium">{coupon.code}</span>
          <span className="text-green-600">— {descuento}</span>
        </div>
        <button
          onClick={() => setCoupon(null)}
          className="text-green-600 hover:text-green-800"
          aria-label="Quitar cupón"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Código de descuento"
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {loading ? "..." : "Aplicar"}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function CarritoPage() {
  const { items, remove, updateQty, total, subtotal, discount, coupon, count } = useCart();

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

  const hasDiscount = coupon !== null && discount() > 0;

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
                <span className="truncate max-w-[160px] text-muted-foreground">
                  {item.title}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                </span>
                <span>{formatPrice(item.price_clp * item.quantity)}</span>
              </div>
            ))}
          </div>

          {hasDiscount && (
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm text-green-700">
              <span>Descuento ({coupon!.code})</span>
              <span>−{formatPrice(discount())}</span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <div className="text-right">
              {hasDiscount && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(subtotal())}
                </p>
              )}
              <span className="font-heading text-xl font-semibold text-foreground">
                {formatPrice(total())}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <CuponInput />
          </div>

          <Link
            href="/checkout"
            className="mt-4 block rounded-md bg-primary px-6 py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-accent"
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
