import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateProduct, deleteProduct } from "../../actions";

export const metadata: Metadata = {
  title: "Editar producto · Admin Kafkun",
  robots: { index: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);
  const deleteWithId = deleteProduct.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/productos" className="text-sm text-muted-foreground hover:text-foreground">
          ← Productos
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Editar: {product.name}
        </h1>
      </div>

      <form action={updateWithId} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Nombre *</label>
            <input
              name="name"
              required
              defaultValue={product.name}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Slug *</label>
            <input
              name="slug"
              required
              defaultValue={product.slug}
              pattern="[a-z0-9-]+"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Descripción</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product.description ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Precio (CLP) *</label>
            <input
              name="price_clp"
              type="number"
              required
              defaultValue={product.price_clp}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Stock *</label>
            <input
              name="stock"
              type="number"
              required
              min={0}
              defaultValue={product.stock}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Categoría</label>
            <input
              name="category"
              defaultValue={product.category ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">URL imagen</label>
            <input
              name="image_url"
              type="url"
              defaultValue={product.image_url ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                defaultChecked={product.active}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Activo</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/productos"
              className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </Link>
          </div>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              onClick={(e) => {
                if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) {
                  e.preventDefault();
                }
              }}
            >
              Eliminar
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}
