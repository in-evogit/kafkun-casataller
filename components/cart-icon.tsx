"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useMontado } from "@/lib/hooks/navegador";

export default function CartIcon() {
  const count = useCart((s) => s.count());

  // El carrito vive en localStorage, que el servidor no puede leer. Antes esto era
  // `useEffect(() => setMounted(true))`, que en React 19 es un error: provoca un
  // segundo render en cascada justo despues de pintar.
  const montado = useMontado();

  return (
    <Link
      href="/carrito"
      className="relative flex items-center text-muted-foreground transition-colors duration-[var(--dur-color)] hover:text-foreground"
      aria-label={
        montado && count > 0
          ? `Carrito, ${count} ${count === 1 ? "producto" : "productos"}`
          : "Carrito"
      }
    >
      <ShoppingBag className="h-5 w-5" />
      {montado && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
