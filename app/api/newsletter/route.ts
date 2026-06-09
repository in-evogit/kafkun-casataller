import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Guardar en profiles si el usuario existe, o en una tabla aparte
  // Por ahora guardamos en audit_log como registro simple
  await admin.from("audit_log").insert({
    action: "newsletter_signup",
    entity_type: "email",
    metadata: { email: parsed.data.email },
  });

  // Si hay Resend configurado, enviar email de bienvenida
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
    await resend.emails.send({
      from,
      to: parsed.data.email,
      subject: "¡Bienvenida a Casa Taller Kafkun!",
      html: `
        <h2>¡Hola!</h2>
        <p>Gracias por suscribirte. Te avisaremos cuando publiquemos nuevos cursos, artículos y descuentos exclusivos.</p>
        <p>Mientras tanto, explora nuestros <a href="${process.env.NEXT_PUBLIC_SITE_URL}/cursos">cursos disponibles</a>.</p>
        <p>Katy · Casa Taller Kafkun 🧶</p>
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
