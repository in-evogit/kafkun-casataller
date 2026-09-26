import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { actualizarMensaje } from "./actions";

export const metadata: Metadata = {
  title: "Mensajes · Admin Kafkun",
  robots: { index: false },
};

const ESTADOS = [
  { valor: "nuevo", etiqueta: "Sin responder" },
  { valor: "respondido", etiqueta: "Respondido" },
  { valor: "cerrado", etiqueta: "Cerrado" },
] as const;

const colorEstado: Record<string, string> = {
  nuevo: "bg-primary/10 text-primary",
  respondido: "bg-green-100 text-green-700",
  cerrado: "bg-muted text-muted-foreground",
};

type Mensaje = {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  estado: string;
  notas_internas: string | null;
  created_at: string;
};

/**
 * Los mensajes del formulario de contacto.
 *
 * NUEVA el 26-sep-2026. Antes caian en `audit_log` y no habia donde ver cuales
 * estaban sin responder —que es la unica pregunta que importa en esta pantalla, y
 * por eso el contador de arriba.
 */
export default async function AdminMensajesPage() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("mensajes_contacto")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const mensajes = (data ?? []) as Mensaje[];
  const sinResponder = mensajes.filter((m) => m.estado === "nuevo").length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Mensajes</h1>
        {sinResponder > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {sinResponder} sin responder
          </span>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          No se pudo leer la base de datos: {error.message}
        </p>
      )}

      {!error && mensajes.length === 0 && (
        <p className="mt-6 rounded-lg border border-border bg-secondary px-4 py-8 text-center text-sm text-muted-foreground">
          Nadie ha escrito por el formulario todavía.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {mensajes.map((m) => (
          <article key={m.id} className="rounded-xl border border-border bg-background p-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">
                  {m.nombre}
                </h2>
                <p className="mt-0.5 text-sm">
                  <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                    {m.email}
                  </a>
                  <span className="text-muted-foreground">
                    {" · "}
                    {new Intl.DateTimeFormat("es-CL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Santiago",
                    }).format(new Date(m.created_at))}
                  </span>
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  colorEstado[m.estado] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {ESTADOS.find((s) => s.valor === m.estado)?.etiqueta ?? m.estado}
              </span>
            </header>

            <p className="mt-4 whitespace-pre-wrap rounded-lg bg-secondary p-4 text-sm leading-relaxed text-foreground">
              {m.mensaje}
            </p>

            <form action={actualizarMensaje} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <input type="hidden" name="id" value={m.id} />

              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Notas internas
                <textarea
                  name="notas"
                  rows={2}
                  defaultValue={m.notas_internas ?? ""}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-muted-foreground">
                  Estado
                  <select
                    name="estado"
                    defaultValue={m.estado}
                    className="ml-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {ESTADOS.map((s) => (
                      <option key={s.valor} value={s.valor}>
                        {s.etiqueta}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-[transform,background-color] duration-[var(--dur-toque)] hover:bg-burdeos active:scale-[0.97]"
                >
                  Guardar
                </button>

                <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                  Responderle
                </a>
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
