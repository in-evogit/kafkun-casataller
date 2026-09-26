import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ShoppingBag,
  Users,
  BookOpen,
  TrendingUp,
  Scissors,
  MessageSquare,
  Mail,
} from "lucide-react";

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

function fecha(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  }).format(new Date(iso));
}

/**
 * La pantalla de entrada del panel.
 *
 * REHECHA el 26-sep-2026. Antes abria con los ingresos totales y las ordenes, que
 * son el RESULTADO de lo que ya pasó: no hay nada que hacer con ese numero al
 * entrar. Ahora abre con lo que ESPERA RESPUESTA —los encargos sin atender y los
 * mensajes sin responder—, que es lo unico de esta pantalla sobre lo que se puede
 * actuar hoy. Los numeros del negocio bajan a la segunda fila.
 *
 * Y allSettled, no Promise.all: antes, con la base caida —paso dos veces— la
 * promesa se rechazaba y el panel entero respondia un error 500 sin explicar nada.
 * Ahora cada dato falla por su cuenta y la pantalla dice que la base no responde.
 */
export default async function AdminDashboard() {
  const supabase = createAdminClient();

  const resultados = await Promise.allSettled([
    supabase.from("encargos").select("*", { count: "exact", head: true }).eq("estado", "nuevo"),
    supabase
      .from("mensajes_contacto")
      .select("*", { count: "exact", head: true })
      .eq("estado", "nuevo"),
    supabase
      .from("suscriptores")
      .select("*", { count: "exact", head: true })
      .eq("estado", "activo"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("total_clp").eq("status", "paid"),
    supabase
      .from("encargos")
      .select("id, nombre, tipo, estado, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("mensajes_contacto")
      .select("id, nombre, estado, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Si TODAS fallaron es la base, no una tabla: se dice una vez arriba en vez de
  // pintar siete tarjetas en cero, que se ven igual que un negocio sin ventas.
  const baseCaida = resultados.every((r) => r.status === "rejected");

  const cuenta = (i: number) =>
    resultados[i].status === "fulfilled"
      ? ((resultados[i] as PromiseFulfilledResult<{ count: number | null }>).value.count ?? 0)
      : null;

  const filas = <T,>(i: number): T[] =>
    resultados[i].status === "fulfilled"
      ? (((resultados[i] as PromiseFulfilledResult<{ data: T[] | null }>).value.data ?? []) as T[])
      : [];

  const encargosNuevos = cuenta(0);
  const mensajesNuevos = cuenta(1);
  const suscriptores = cuenta(2);
  const alumnos = cuenta(3);
  const cursos = cuenta(4);
  const ordenesPendientes = cuenta(5);

  const pagadas = filas<{ total_clp: number | null }>(6);
  const ingresos = pagadas.reduce((s, o) => s + (o.total_clp ?? 0), 0);

  const ultimosEncargos = filas<{
    id: string;
    nombre: string;
    tipo: string;
    estado: string;
    created_at: string;
  }>(7);
  const ultimosMensajes = filas<{
    id: string;
    nombre: string;
    estado: string;
    created_at: string;
  }>(8);

  // Lo accionable. Las tarjetas se encienden SOLO si hay algo pendiente: un panel
  // que grita siempre se deja de mirar.
  const pendientes = [
    {
      href: "/admin/encargos",
      etiqueta: "Encargos sin atender",
      valor: encargosNuevos,
      icono: Scissors,
    },
    {
      href: "/admin/mensajes",
      etiqueta: "Mensajes sin responder",
      valor: mensajesNuevos,
      icono: MessageSquare,
    },
    {
      href: "/admin/ordenes",
      etiqueta: "Órdenes pendientes",
      valor: ordenesPendientes,
      icono: ShoppingBag,
    },
  ];

  const negocio = [
    { etiqueta: "Ingresos", valor: formatPrice(ingresos), icono: TrendingUp },
    { etiqueta: "En la lista de correo", valor: suscriptores ?? "—", icono: Mail },
    { etiqueta: "Alumnos", valor: alumnos ?? "—", icono: Users },
    { etiqueta: "Clases publicadas", valor: cursos ?? "—", icono: BookOpen },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Casa Taller Kafkün</p>

      {baseCaida && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            La base de datos no responde.
          </p>
          <p className="mt-1 text-sm text-destructive/80">
            Nada de lo que la gente deje en el sitio —encargos, correos, mensajes— se
            está guardando. Es lo primero que hay que resolver.
          </p>
        </div>
      )}

      {/* ── Lo que espera respuesta ────────────────────────────────────────── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {pendientes.map((p) => {
          const Icono = p.icono;
          const hayQueHacer = (p.valor ?? 0) > 0;

          return (
            <Link
              key={p.href}
              href={p.href}
              className={`group rounded-xl border p-5 transition-[border-color,transform] duration-[var(--dur-color)] hover:-translate-y-0.5 ${
                hayQueHacer
                  ? "border-primary/40 bg-primary/[0.04] hover:border-primary"
                  : "border-border bg-background hover:border-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm ${
                    hayQueHacer ? "font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {p.etiqueta}
                </p>
                <Icono
                  className={`h-4 w-4 ${hayQueHacer ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <p
                className={`mt-2 font-heading text-3xl font-semibold ${
                  hayQueHacer ? "text-primary" : "text-muted-foreground/60"
                }`}
              >
                {p.valor ?? "—"}
              </p>
            </Link>
          );
        })}
      </div>

      {/* ── Los numeros, que no piden nada ─────────────────────────────────── */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {negocio.map((n) => {
          const Icono = n.icono;
          return (
            <div key={n.etiqueta} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{n.etiqueta}</p>
                <Icono className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                {n.valor}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Lo ultimo que llego ────────────────────────────────────────────── */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Últimos encargos
            </h2>
            <Link href="/admin/encargos" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {ultimosEncargos.length === 0 ? (
            <p className="mt-4 rounded-xl border border-border bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
              Sin encargos todavía
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {ultimosEncargos.map((e) => (
                <li key={e.id} className="flex items-center justify-between bg-background px-4 py-3">
                  <div>
                    <p className="text-sm text-foreground">{e.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.tipo} · {fecha(e.created_at)}
                    </p>
                  </div>
                  {e.estado === "nuevo" && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Nuevo
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Últimos mensajes
            </h2>
            <Link href="/admin/mensajes" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {ultimosMensajes.length === 0 ? (
            <p className="mt-4 rounded-xl border border-border bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
              Sin mensajes todavía
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {ultimosMensajes.map((m) => (
                <li key={m.id} className="flex items-center justify-between bg-background px-4 py-3">
                  <div>
                    <p className="text-sm text-foreground">{m.nombre}</p>
                    <p className="text-xs text-muted-foreground">{fecha(m.created_at)}</p>
                  </div>
                  {m.estado === "nuevo" && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Sin responder
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
