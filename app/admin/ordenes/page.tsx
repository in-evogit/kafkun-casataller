import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Órdenes · Admin Kafkun",
  robots: { index: false },
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(clp);
}

const statusLabel: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  refunded: "Reembolsado",
  failed: "Fallido",
};

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
};

export default async function AdminOrdenesPage() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_clp, mp_payment_id, created_at, profiles(full_name, id)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Órdenes</h1>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID Pago MP</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(orders ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Sin órdenes aún
                </td>
              </tr>
            ) : (
              (orders ?? []).map((order) => (
                <tr key={order.id} className="bg-background">
                  <td className="px-4 py-3 text-foreground">
                    {(order.profiles as unknown as { full_name: string } | null)?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {order.mp_payment_id ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatPrice(order.total_clp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("es-CL")}
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
