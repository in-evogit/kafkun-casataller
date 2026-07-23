import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Package, Truck, ShieldCheck } from "lucide-react";
import { seedProducts } from "@/lib/data/seed";
import AddToCartButton from "@/components/add-to-cart-button";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} · Casa Taller Kafkun`,
    description: `${product.name} — disponible en nuestra tienda. Envío a todo Chile.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/${slug}`,
    },
  };
}

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url,
    offers: {
      "@type": "Offer",
      price: product.price_clp,
      priceCurrency: "CLP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Imagen + galería */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.images.map((img) => (
                  <div
                    key={img}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border"
                  >
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="20vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm capitalize text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-heading text-3xl font-semibold text-foreground">
                {formatPrice(product.price_clp)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Quedan {product.stock}
                </span>
              )}
              {product.stock === 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Agotado
                </span>
              )}
            </div>

            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 shrink-0" />
                <span>Envío a todo Chile · desde $3.990</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Package className="h-4 w-4 shrink-0" />
                <span>Despacho en 24-48h hábiles</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>10 días para devoluciones (Ley del Consumidor)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
