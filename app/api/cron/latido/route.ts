import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * El latido que mantiene despierta la base de datos.
 *
 * POR QUE EXISTE: la base de Kafkun se borro DOS veces (ago y sep de 2026).
 * Supabase pausa un proyecto tras una semana sin consultas y lo borra despues.
 *
 * Y aca esta lo que no es obvio: EL TRAFICO DE LA WEB NO LA MANTIENE VIVA. Lo
 * que cuenta como actividad son consultas a la base, y el sitio publico no hace
 * ninguna —los cursos, las obras y los precios salen de `lib/data/*.ts`—. El
 * sitio puede tener mil visitas al dia y la base se ve muerta igual.
 *
 * Lo llama Vercel Cron todos los dias (ver vercel.json). No hace falta que
 * nadie se acuerde de nada.
 */

// Sin cache: una respuesta cacheada no toca la base, que es justo lo unico
// que este endpoint tiene que hacer.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel firma sus llamadas de cron con este encabezado. Sin la comprobacion,
  // cualquiera puede llamar el endpoint las veces que quiera.
  //
  // Si CRON_SECRET no esta configurada, se deja pasar: es preferible un latido
  // sin proteger a una base borrada por una variable que nadie puso. Queda
  // dicho en los registros.
  const secreto = process.env.CRON_SECRET;
  if (secreto) {
    if (req.headers.get("authorization") !== `Bearer ${secreto}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  } else {
    console.warn("[latido] CRON_SECRET no configurada: el endpoint queda abierto.");
  }

  const admin = createAdminClient();

  // La consulta mas barata que sigue contando como actividad: cuenta filas de
  // una tabla chica sin traer ninguna.
  const { count, error } = await admin
    .from("courses")
    .select("id", { count: "exact", head: true });

  if (error) {
    // Esto es la alarma que faltaba las dos veces que la base murio en silencio.
    console.error("[latido] LA BASE NO RESPONDE:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
  }

  console.log(`[latido] base viva, ${count} cursos.`);
  return NextResponse.json({ ok: true, cursos: count, momento: new Date().toISOString() });
}
