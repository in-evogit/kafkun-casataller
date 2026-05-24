"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cart";

export default function CartIcon() {
  const count = useCart((s) => s.count());

  return (
    <Link
      href="/carrito"
      className="relative flex items-center text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Carrito (${count} items)`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
