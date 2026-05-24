"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/store/cart";

type Product = {
  slug: string;
  name: string;
  price_clp: number;
  image_url: string;
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const cartItem = items.find((i) => i.id === product.slug);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      add({
        id: product.slug,
        type: "product",
        title: product.name,
        price_clp: product.price_clp,
        thumbnail_url: product.image_url,
      });
    }
  }

  if (outOfStock) {
    return (
      <div className="rounded-md bg-muted px-6 py-3 text-center text-sm font-medium text-muted-foreground">
        Producto agotado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-medium text-foreground">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent"
        >
          <ShoppingBag className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>

      {cartItem && (
        <p className="text-center text-xs text-muted-foreground">
          Ya tienes {cartItem.quantity} en el carrito
        </p>
      )}
    </div>
  );
}
