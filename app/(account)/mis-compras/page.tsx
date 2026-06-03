import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Package, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Mis compras · Casa Taller Kafkun",
  robots: { index: false },
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price_clp: number;
  item_type: string;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_clp: number;
  mp_payment_id: string | null;
  order_items: OrderItem[];
};

const statusLabel: Record<string, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
};

const statusColor: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-muted text-muted-foreground",
};

export default async function MisComprasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const devMode = process.env.NEXT_PUBLIC_BUSINESS_MODE !== "production";

  let orders: Order[] = [];

  if (!devMode && user) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("id, created_at, status, total_clp, mp_payment_id, order_items(id, title, quantity, unit_price_clp, item_type)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    orders = (data ?? []) as Order[];
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Mis compras
      </h1>

      {devMode && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          Modo desarrollo: el historial de compras se muestra vacío hasta conectar Mercado Pago.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-secondary p-8 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Todavía no tienes compras.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/cursos"
              className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              Ver cursos
            </Link>
            <Link
              href="/tienda"
              className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Ver tienda
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                  {order.mp_payment_id && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Pago #{order.mp_payment_id}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {statusLabel[order.status] ?? order.status}
                  </span>
                  <span className="font-heading font-semibold text-foreground">
                    {formatPrice(order.total_clp)}
                  </span>
                </div>
              </div>

              {order.order_items.length > 0 && (
                <ul className="mt-4 divide-y divide-border">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-2">
                      <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 text-sm text-foreground">
                        {item.quantity > 1 && (
                          <span className="mr-1 text-muted-foreground">{item.quantity}×</span>
                        )}
                        {item.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(item.unit_price_clp * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
