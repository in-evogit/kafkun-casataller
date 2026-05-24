import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { ShoppingBag, Users, BookOpen, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard · Admin Kafkun",
  robots: { index: false },
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: pendingOrders },
    { data: revenueData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total_clp").eq("status", "paid"),
    supabase
      .from("orders")
      .select("id, status, total_clp, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue = (revenueData ?? []).reduce((sum, o) => sum + (o.total_clp ?? 0), 0);

  const stats = [
    { label: "Ingresos totales", value: formatPrice(totalRevenue), icon: TrendingUp },
    { label: "Alumnos", value: totalStudents ?? 0, icon: Users },
    { label: "Cursos publicados", value: totalCourses ?? 0, icon: BookOpen },
    { label: "Órdenes pendientes", value: pendingOrders ?? 0, icon: ShoppingBag },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Panel de administración · Casa Taller Kafkun
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Órdenes recientes */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Órdenes recientes
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(recentOrders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    Sin órdenes aún
                  </td>
                </tr>
              ) : (
                (recentOrders ?? []).map((order) => (
                  <tr key={order.id} className="bg-background">
                    <td className="px-4 py-3 text-foreground">
                      {(order.profiles as unknown as { full_name: string } | null)?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatPrice(order.total_clp)}
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
    </div>
  );
}
