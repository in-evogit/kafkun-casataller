import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verificarAdmin } from "@/lib/admin-guard";

/**
 * Descarga la lista de correos como CSV.
 *
 * Para que sirve: Gabriel quiere avisarle de los talleres PRESENCIALES a la gente
 * que ya mostro interes. Con el archivo se importa a cualquier herramienta de
 * correo sin copiar direcciones a mano.
 *
 * OJO — esta ruta vive bajo /admin pero el layout del panel NO la protege: un
 * `route.ts` no pasa por los layouts. La comprobacion de abajo es la unica que hay,
 * y sin ella este enlace entrega la lista de correos entera a cualquiera.
 */
export async function GET() {
  // try/catch y no `await` suelto: verificarAdmin lanza, y una excepcion sin
  // atrapar sale como un 500 con detalles del servidor adentro. Para quien no
  // tiene permiso, la respuesta correcta es un 403 seco.
  try {
    await verificarAdmin();
  } catch {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("suscriptores")
    .select("email, nombre, origen, estado, created_at")
    .eq("estado", "activo") // Solo quien no se dio de baja. Mandarle a quien se fue es ilegal y quema el dominio.
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  const escapar = (v: string | null) => {
    const s = v ?? "";
    // Comillas dobles y separador: sin esto, un nombre con coma parte la fila en dos.
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const filas = [
    "correo,nombre,origen,fecha",
    ...(data ?? []).map((s) =>
      [
        escapar(s.email),
        escapar(s.nombre),
        escapar(s.origen),
        new Date(s.created_at).toISOString().slice(0, 10),
      ].join(",")
    ),
  ].join("\n");

  const hoy = new Date().toISOString().slice(0, 10);

  // El BOM va DENTRO del cuerpo, no en una cabecera: sin el, Excel en Windows
  // abre los acentos como basura ("Martín" → "MartÃ­n").
  return new NextResponse("\uFEFF" + filas, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kafkun-suscriptores-${hoy}.csv"`,
    },
  });
}
