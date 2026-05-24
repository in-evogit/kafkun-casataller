"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { useRouter } from "next/navigation";

type Props = {
  items: Array<{ id: string; type: "course" | "product"; title: string; price_clp: number; quantity: number }>;
  devMode: boolean;
};

export default function CheckoutButton({ items, devMode }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  if (devMode) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">Modo desarrollo</p>
        <p className="mt-1">
          El pago con Mercado Pago se activa cuando Katy configure las
          credenciales oficiales. La estructura está lista.
        </p>
      </div>
    );
  }

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el pago");
      clear();
      router.push(data.init_point);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
      >
        {loading ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
      </button>
    </div>
  );
}
