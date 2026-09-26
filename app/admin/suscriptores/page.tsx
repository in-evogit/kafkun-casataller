import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { cambiarEstadoSuscriptor } from "./actions";

export const metadata: Metadata = {
  title: "Suscriptores · Admin Kafkun",
  robots: { index: false },
};

type Suscriptor = {
  id: string;
  email: string;
  nombre: string | null;
  origen: string;
  estado: string;
  created_at: string;
};

const nombreOrigen: Record<string, string> = {
  portada: "Portada",
  newsletter: "Página del newsletter",
};

/**
 * La lista de correos.
 *
 * NUEVA el 26-sep-2026, junto con la tabla `suscriptores`. Antes los correos caian
 * en `audit_log` y no habia forma de listarlos.
 *
 * PARA QUE SIRVE DE VERDAD (Gabriel, 26-sep): avisarle de los talleres PRESENCIALES
 * a la gente que ya mostro interes. De ahi que lo primero de la pantalla sea el
 * boton de descargar y no la tabla.
 */
export default async function AdminSuscriptoresPage() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("suscriptores")
    .select("id, email, nombre, origen, estado, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const suscriptores = (data ?? []) as Suscriptor[];
  const activos = suscriptores.filter((s) => s.estado === "activo");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Suscriptores</h1>
        {activos.length > 0 && (
          <a
            href="/admin/suscriptores/csv"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-[transform,background-color] duration-[var(--dur-toque)] hover:bg-burdeos active:scale-[0.97]"
          >
            Descargar {activos.length} {activos.length === 1 ? "correo" : "correos"}
          </a>
        )}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        El archivo trae solo a quien sigue activo. A quien se dio de baja no se le
        puede escribir.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          No se pudo leer la base de datos: {error.message}
        </p>
      )}

      {!error && suscriptores.length === 0 && (
        <p className="mt-6 rounded-lg border border-border bg-secondary px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no se ha suscrito nadie.
        </p>
      )}

      {suscriptores.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Correo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Llegó de</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {suscriptores.map((s) => (
                <tr key={s.id} className="bg-background">
                  <td className="px-4 py-3">
                    <a href={`mailto:${s.email}`} className="text-primary hover:underline">
                      {s.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {nombreOrigen[s.origen] ?? s.origen}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={cambiarEstadoSuscriptor} className="inline">
                      <input type="hidden" name="id" value={s.id} />
                      <input
                        type="hidden"
                        name="estado"
                        value={s.estado === "activo" ? "baja" : "activo"}
                      />
                      {/* El estado ES el boton: dice como esta y al apretarlo cambia.
                          Una columna de estado mas un boton aparte para cambiarlo
                          ocupa el doble y dice lo mismo. */}
                      <button
                        type="submit"
                        title={
                          s.estado === "activo"
                            ? "Dar de baja a esta persona"
                            : "Volver a activarla"
                        }
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-[transform,background-color] duration-[var(--dur-toque)] active:scale-[0.97] ${
                          s.estado === "activo"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-muted text-muted-foreground hover:bg-border"
                        }`}
                      >
                        {s.estado === "activo" ? "Activo" : "De baja"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
