"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/store/cart";
import CheckoutButton from "@/components/checkout-button";

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

/**
 * Resumen y pago del carrito.
 * Antes esta pantalla no existía: /checkout sin ?curso= mostraba "Revisa tu carrito"
 * y devolvía al carrito, así que "Proceder al pago" era un callejón sin salida.
 */
export default function CheckoutCarrito({ devMode }: { devMode: boolean }) {
  // El store está persistido en localStorage: hasta montar, el server y el cliente difieren.
  // useSyncExternalStore da false en el servidor y true en el cliente sin setState en un efecto.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const discount = useCart((s) => s.discount());
  const total = useCart((s) => s.total());
  const coupon = useCart((s) => s.coupon);

  if (!mounted) {
    return <div className="mt-6 h-40 animate-pulse rounded-xl bg-secondary" />;
  }

  if (items.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
        <Link href="/cursos" className="mt-4 inline-block text-primary hover:underline">
          Ver los cursos
        </Link>
      </div>
    );
  }

  const checkoutItems = items.map((i) => ({
    id: i.id,
    type: i.type,
    title: i.title,
    price_clp: i.price_clp,
    quantity: i.quantity,
  }));

  return (
    <>
      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-4">
            <span className="flex-1 text-sm text-foreground">
              {item.quantity > 1 && (
                <span className="mr-1 text-muted-foreground">{item.quantity}×</span>
              )}
              {item.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatPrice(item.price_clp * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 rounded-xl border border-border bg-secondary p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-sm text-primary">
            <span>Descuento{coupon ? ` · ${coupon.code}` : ""}</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-heading text-xl font-semibold text-foreground">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <CheckoutButton items={checkoutItems} devMode={devMode} couponCode={coupon?.code} />
      </div>

      <Link
        href="/carrito"
        className="mt-4 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Volver al carrito
      </Link>
    </>
  );
}
