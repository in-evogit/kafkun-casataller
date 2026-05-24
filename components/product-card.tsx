"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";

type Product = {
  slug: string;
  name: string;
  price_clp: number;
  image_url: string;
  stock: number;
  category: string;
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const inCart = items.some((i) => i.id === product.slug);
  const outOfStock = product.stock === 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    add({
      id: product.slug,
      type: "product",
      title: product.name,
      price_clp: product.price_clp,
      thumbnail_url: product.image_url,
    });
  }

  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs capitalize text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-medium text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-heading font-semibold text-foreground">
            {formatPrice(product.price_clp)}
          </span>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              outOfStock
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : inCart
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-accent"
            }`}
          >
            {outOfStock ? "Agotado" : inCart ? "En carrito" : "Agregar"}
          </button>
        </div>
      </div>
    </Link>
  );
}
