import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactLimiter, rateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const esquema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  mensaje: z.string().trim().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "sin-ip";
  const { allowed } = await rateLimit(contactLimiter, `contacto:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Recibimos varios mensajes seguidos. Espera un momento." },
      { status: 429 }
    );
  }

  const crudo = await req.json().catch(() => null);
  const parsed = esquema.safeParse(crudo);
  if (!parsed.success) {
    // Mensaje generico al visitante; el detalle queda en los registros.
    console.error("[contacto] validacion fallida:", parsed.error.flatten());
    return NextResponse.json({ error: "Revisa los datos del formulario." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("audit_log").insert({
    action: "contacto",
    entity_type: "mensaje",
    metadata: parsed.data,
  });

  // A diferencia de /api/newsletter, aca SI se revisa el error. Responder ok cuando
  // la escritura fallo es peor que fallar: la persona cree que escribio y se queda
  // esperando una respuesta que nadie va a mandar.
  if (error) {
    console.error("[contacto] no se pudo guardar:", error.message);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Escríbenos a kafkuntelares@gmail.com." },
      { status: 500 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[contacto] mensaje guardado, pero RESEND_API_KEY no esta configurada: " +
        "nadie recibio aviso. Revisar audit_log a mano."
    );
  }

  return NextResponse.json({ ok: true });
}
