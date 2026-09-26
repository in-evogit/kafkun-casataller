import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactLimiter, rateLimit } from "@/lib/ratelimit";
import { sendContactoAviso } from "@/lib/email";
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

  // Tabla propia desde el 26-sep-2026. Antes caia en `audit_log`, el registro de
  // eventos del sistema: el mensaje quedaba escrito pero no habia donde anotar
  // "a esta persona ya le respondi", ni listar lo que esta sin contestar.
  const { data, error } = await admin
    .from("mensajes_contacto")
    .insert({
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      mensaje: parsed.data.mensaje,
    })
    .select("id")
    .single();

  // Se revisa el error SIEMPRE. Responder ok cuando la escritura fallo es peor
  // que fallar: la persona cree que escribio y se queda esperando una respuesta
  // que nadie va a mandar.
  if (error) {
    console.error("[contacto] no se pudo guardar:", error.message);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Escríbenos a kafkuntelares@gmail.com." },
      { status: 500 }
    );
  }

  // El mensaje ya esta guardado: si el correo falla, no se le dice nada a la
  // persona. El fallo queda en los registros.
  try {
    await sendContactoAviso({ id: data.id, ...parsed.data });
  } catch (e) {
    console.error(`[contacto] ${data.id} guardado pero sin aviso:`, e);
  }

  return NextResponse.json({ ok: true });
}
