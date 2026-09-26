import type { Metadata } from "next";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { actualizarEncargo } from "./actions";

export const metadata: Metadata = {
  title: "Encargos · Admin Kafkun",
  robots: { index: false },
};

const BUCKET = "referencias-encargo";

const ESTADOS = [
  { valor: "nuevo", etiqueta: "Nuevo" },
  { valor: "contactado", etiqueta: "Contactado" },
  { valor: "agendado", etiqueta: "Agendado" },
  { valor: "cerrado", etiqueta: "Cerrado" },
] as const;

const colorEstado: Record<string, string> = {
  nuevo: "bg-primary/10 text-primary",
  contactado: "bg-amber-100 text-amber-700",
  agendado: "bg-green-100 text-green-700",
  cerrado: "bg-muted text-muted-foreground",
};

const nombreTipo: Record<string, string> = {
  chaleco: "Un chaleco",
  bufanda: "Una bufanda o un chal",
  otra: "Otra cosa",
};

function fechaHora(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  }).format(new Date(iso));
}

type Encargo = {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: string;
  descripcion: string;
  plazo: string | null;
  referencias: string[] | null;
  hora_iso: string | null;
  prefiere_mensaje: boolean;
  estado: string;
  notas_internas: string | null;
  created_at: string;
};

/**
 * Los encargos que llegaron.
 *
 * NUEVA el 26-sep-2026. Hasta hoy los encargos se guardaban en la base y no habia
 * ninguna pantalla para verlos: habia que entrar al panel de Supabase y leer la
 * tabla en crudo.
 *
 * TARJETAS Y NO UNA TABLA, a diferencia del resto del panel: un encargo trae una
 * descripcion de varios renglones y hasta cinco fotos. En una fila de tabla eso se
 * corta a los tres puntos, y lo que se corta es justamente lo que hay que leer para
 * responder.
 */
export default async function AdminEncargosPage() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("encargos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const encargos = (data ?? []) as Encargo[];

  // El bucket es PRIVADO: las fotos no tienen URL publica. Se firman enlaces que
  // caducan en una hora, lo justo para revisarlas. Una sola llamada para todas.
  const rutas = encargos.flatMap((e) => e.referencias ?? []);
  const firmadas = new Map<string, string>();
  if (rutas.length > 0) {
    const { data: urls } = await admin.storage
      .from(BUCKET)
      .createSignedUrls(rutas, 60 * 60);
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) firmadas.set(u.path, u.signedUrl);
    }
  }

  const sinLeer = encargos.filter((e) => e.estado === "nuevo").length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Encargos</h1>
        {sinLeer > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {sinLeer} sin atender
          </span>
        )}
      </div>

      {/* Si la base no responde hay que DECIRLO. Una lista vacia y un error de
          conexion se ven igual, y esa confusion ya costo caro: los formularios
          respondian "listo" con la base borrada y los correos se perdian. */}
      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          No se pudo leer la base de datos: {error.message}
        </p>
      )}

      {!error && encargos.length === 0 && (
        <p className="mt-6 rounded-lg border border-border bg-secondary px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no ha llegado ningún encargo.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {encargos.map((e) => {
          const fotos = (e.referencias ?? [])
            .map((r) => firmadas.get(r))
            .filter((u): u is string => Boolean(u));

          return (
            <article
              key={e.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    {e.nombre}
                    <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                      {nombreTipo[e.tipo] ?? e.tipo}
                    </span>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {/* Enlaces de verdad: en el correo se responde de un toque, y en
                        el telefono se llama sin copiar el numero a mano. */}
                    <a href={`mailto:${e.email}`} className="text-primary hover:underline">
                      {e.email}
                    </a>
                    {e.telefono && (
                      <>
                        {" · "}
                        <a href={`tel:${e.telefono}`} className="text-primary hover:underline">
                          {e.telefono}
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    colorEstado[e.estado] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {ESTADOS.find((s) => s.valor === e.estado)?.etiqueta ?? e.estado}
                </span>
              </header>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Cita</dt>
                  <dd className="mt-0.5 text-foreground">
                    {e.prefiere_mensaje
                      ? "Prefiere coordinar por mensaje"
                      : e.hora_iso
                        ? fechaHora(e.hora_iso)
                        : "Sin hora"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Plazo</dt>
                  <dd className="mt-0.5 text-foreground">{e.plazo ?? "No indicó"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Llegó</dt>
                  <dd className="mt-0.5 text-foreground">{fechaHora(e.created_at)}</dd>
                </div>
              </dl>

              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-secondary p-4 text-sm leading-relaxed text-foreground">
                {e.descripcion}
              </p>

              {fotos.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {fotos.map((url, i) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-24 w-24 overflow-hidden rounded-lg border border-border transition-opacity duration-[var(--dur-color)] hover:opacity-80"
                    >
                      <Image
                        src={url}
                        alt={`Referencia ${i + 1} de ${e.nombre}`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="96px"
                      />
                    </a>
                  ))}
                </div>
              )}

              <form action={actualizarEncargo} className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
                <input type="hidden" name="id" value={e.id} />

                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Notas internas
                  <textarea
                    name="notas"
                    rows={2}
                    defaultValue={e.notas_internas ?? ""}
                    placeholder="Lo que conversaron, el precio acordado, la lana elegida…"
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm text-muted-foreground">
                    Estado
                    <select
                      name="estado"
                      defaultValue={e.estado}
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

                  <a
                    href={`mailto:${e.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Responderle
                  </a>
                </div>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
