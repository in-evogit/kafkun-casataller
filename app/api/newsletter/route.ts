import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactLimiter, rateLimit } from "@/lib/ratelimit";
import { sendBienvenidaCorreo } from "@/lib/email";
import { z } from "zod";

/**
 * Suscripcion al correo.
 *
 * Reescrito el 26-sep-2026. Antes hacia dos cosas mal:
 *
 *   1. Guardaba en `audit_log`, el registro de eventos del sistema. Se podia
 *      escribir, pero no listar quien esta suscrito, ni dar de baja, ni sacar
 *      la lista para avisar de un taller presencial —que es justamente para lo
 *      que sirve tener los correos—.
 *   2. NO revisaba el error del insert y respondia {ok:true} igual. Con la base
 *      de datos borrada (paso dos veces) cada correo se perdia en silencio y la
 *      persona veia "¡Listo!" en la pantalla.
 */

const esquema = z.object({
  email: z.string().trim().email().max(200),
  origen: z.string().trim().max(40).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "sin-ip";
  const { allowed } = await rateLimit(contactLimiter, `newsletter:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Espera un momento antes de intentarlo de nuevo." },
      { status: 429 }
    );
  }

  const crudo = await req.json().catch(() => null);
  const parsed = esquema.safeParse(crudo);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa el correo que escribiste." }, { status: 400 });
  }

  // A minusculas porque la tabla lo exige: "Ana@gmail.com" y "ana@gmail.com"
  // son la misma persona y no puede recibir todo dos veces.
  const email = parsed.data.email.toLowerCase();
  const admin = createAdminClient();

  // upsert y no insert: si ya estaba suscrita, el formulario no tiene por que
  // mostrarle un error —ella no hizo nada malo—. Y si se habia dado de baja y
  // vuelve a suscribirse, la reactivamos.
  const { data, error } = await admin
    .from("suscriptores")
    .upsert(
      {
        email,
        origen: parsed.data.origen || "portada",
        estado: "activo",
      },
      { onConflict: "email" }
    )
    .select("token_baja, created_at, updated_at")
    .single();

  if (error) {
    console.error("[newsletter] no se pudo guardar:", error.message);
    return NextResponse.json(
      { error: "No pudimos guardar tu correo. Inténtalo de nuevo en un momento." },
      { status: 500 }
    );
  }

  // La bienvenida solo la primera vez. Si alguien aprieta "suscribirme" tres
  // veces, no recibe tres correos de bienvenida.
  const esNueva = data.created_at === data.updated_at;
  if (esNueva) {
    try {
      await sendBienvenidaCorreo({ email, tokenBaja: data.token_baja });
    } catch (e) {
      // El correo esta guardado, que es lo que importa. Si la bienvenida falla
      // no se le dice nada a la persona: se suscribio igual.
      console.error("[newsletter] bienvenida no enviada a", email, e);
    }
  }

  return NextResponse.json({ ok: true });
}
