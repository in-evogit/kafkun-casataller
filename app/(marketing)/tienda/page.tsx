import type { Metadata } from "next";
import { seedProducts } from "@/lib/data/seed";
import ProductCard from "@/components/product-card";

export const metadata: Metadata = {
  title: "Tienda · Casa Taller Kafkun",
  description:
    "Telares, lanas, kits de iniciación y accesorios para tejer. Envío a todo Chile.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda`,
  },
};

const categories = [
  { value: "", label: "Todo" },
  { value: "telares", label: "Telares" },
  { value: "lanas", label: "Lanas" },
  { value: "kits", label: "Kits" },
  { value: "accesorios", label: "Accesorios" },
];

type Props = { searchParams: Promise<{ cat?: string }> };

export default async function TiendaPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const filtered = cat
    ? seedProducts.filter((p) => p.category === cat)
    : seedProducts;

  return (
    <main>
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Tienda
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Todo lo que necesitas para tejer. Envío a todo Chile.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c.value}
              href={c.value ? `/tienda?cat=${c.value}` : "/tienda"}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat === c.value || (!cat && c.value === "")
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="mt-8 grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Sin productos en esta categoría.
          </p>
        )}

        {/* Envío */}
        <div className="mt-16 rounded-xl border border-border bg-secondary p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Envíos a todo Chile
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              { zona: "Región Metropolitana", plazo: "2-3 días hábiles", precio: "$3.990" },
              { zona: "Resto del país", plazo: "3-5 días hábiles", precio: "$5.990" },
              { zona: "Zonas extremas", plazo: "5-7 días hábiles", precio: "$7.990" },
            ].map((e) => (
              <div key={e.zona} className="rounded-lg border border-border bg-background p-4">
                <p className="font-medium text-foreground">{e.zona}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.plazo}</p>
                <p className="mt-2 font-heading font-semibold text-primary">{e.precio}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Despacho gratuito en compras sobre $50.000 · Vía Starken o Chilexpress
          </p>
        </div>
      </section>
    </main>
  );
}
