import type { Metadata } from "next";
import Link from "next/link";
import { createProduct } from "../actions";

export const metadata: Metadata = {
  title: "Nuevo producto · Admin Kafkun",
  robots: { index: false },
};

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/productos" className="text-sm text-muted-foreground hover:text-foreground">← Productos</Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Nuevo producto</h1>
      </div>

      <form action={createProduct} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Nombre *</label>
            <input name="name" required placeholder="Telar María mediano" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Slug *</label>
            <input name="slug" required placeholder="telar-maria-mediano" pattern="[a-z0-9-]+" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Descripción</label>
            <textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Precio (CLP) *</label>
            <input name="price_clp" type="number" required min={100} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Stock</label>
            <input name="stock" type="number" min={0} defaultValue={0} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Categoría</label>
            <select name="category" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Sin categoría</option>
              <option value="telares">Telares</option>
              <option value="lanas">Lanas</option>
              <option value="kits">Kits</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">URL imagen</label>
            <input name="image_url" type="url" placeholder="https://..." className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-border accent-primary" />
              <span className="text-sm font-medium text-foreground">Producto activo (visible en tienda)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border pt-6">
          <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent">Crear producto</button>
          <Link href="/admin/productos" className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
