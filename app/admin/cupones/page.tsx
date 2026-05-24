import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Cupones · Admin Kafkun",
  robots: { index: false },
};

async function createCoupon(formData: FormData) {
  "use server";
  const { createAdminClient: admin } = await import("@/lib/supabase/admin");
  await admin().from("coupons").insert({
    code: String(formData.get("code")).toUpperCase().trim(),
    discount_type: formData.get("discount_type") as string,
    discount_value: Number(formData.get("discount_value")),
    applies_to: "all",
    max_uses: formData.get("max_uses") ? Number(formData.get("max_uses")) : null,
    active: true,
  });
  revalidatePath("/admin/cupones");
}

async function toggleCoupon(id: string, active: boolean) {
  "use server";
  const { createAdminClient: admin } = await import("@/lib/supabase/admin");
  await admin().from("coupons").update({ active }).eq("id", id);
  revalidatePath("/admin/cupones");
}

export default async function AdminCuponesPage() {
  const supabase = createAdminClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Cupones</h1>

      {/* Crear cupón */}
      <div className="mt-6 rounded-xl border border-border bg-background p-6">
        <h2 className="font-semibold text-foreground">Nuevo cupón</h2>
        <form action={createCoupon} className="mt-4 grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Código</label>
            <input name="code" required placeholder="VERANO20" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Tipo</label>
            <select name="discount_type" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="percent">Porcentaje %</option>
              <option value="fixed">Monto fijo CLP</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Valor</label>
            <input name="discount_value" type="number" required min={1} placeholder="20" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground">Usos máximos</label>
            <input name="max_uses" type="number" min={1} placeholder="∞" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="sm:col-span-4">
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent">
              Crear cupón
            </button>
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Código</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Descuento</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usos</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(coupons ?? []).length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Sin cupones</td></tr>
            ) : (
              (coupons ?? []).map((c) => (
                <tr key={c.id} className="bg-background">
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{c.code}</td>
                  <td className="px-4 py-3 text-foreground">
                    {c.discount_type === "percent" ? `${c.discount_value}%` : `$${c.discount_value.toLocaleString("es-CL")}`}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.uses_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {c.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleCoupon.bind(null, c.id, !c.active)}>
                      <button type="submit" className="text-xs text-muted-foreground hover:text-foreground">
                        {c.active ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
