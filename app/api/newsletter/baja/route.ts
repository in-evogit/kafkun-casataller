import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Baja de la lista de correo.
 *
 * Es un GET porque se abre desde un enlace dentro de un correo, y ahi no hay
 * formularios. El token es un UUID aleatorio por persona: sin el no se puede
 * dar de baja a nadie, y con el no se puede hacer nada mas que darse de baja
 * (no expone el correo, ni deja leer la lista).
 *
 * No se borra la fila: se marca 'baja'. Si se borrara, el proximo formulario
 * que llene la volveria a suscribir como si nunca se hubiera ido.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t");

  const pagina = (titulo: string, cuerpo: string) =>
    new NextResponse(
      `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <title>${titulo} · Casa Taller Kafkün</title>
       <style>
         body{margin:0;min-height:100vh;display:grid;place-items:center;
              background:#faf7f2;color:#2b2523;
              font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:24px}
         main{max-width:26rem;text-align:center}
         h1{font-size:1.375rem;font-weight:500;margin:0 0 .5rem}
         p{color:#6b6b6b;font-size:.9375rem;line-height:1.6;margin:0 0 1.5rem}
         a{color:#8A0605}
       </style></head>
       <body><main><h1>${titulo}</h1><p>${cuerpo}</p>
       <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "/"}">Volver al taller</a></p>
       </main></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );

  if (!token) {
    return pagina("Enlace incompleto", "Este enlace no trae el código de baja.");
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("suscriptores")
    .update({ estado: "baja" })
    .eq("token_baja", token)
    .select("email")
    .maybeSingle();

  if (error) {
    console.error("[newsletter/baja] falló:", error.message);
    return pagina(
      "No pudimos darte de baja",
      "Algo falló de nuestro lado. Escríbenos y te sacamos de la lista a mano."
    );
  }

  if (!data) {
    // Token que no existe. Se responde lo mismo que en el caso bueno a
    // proposito: si dijera "ese código no existe", se podria probar tokens
    // hasta encontrar uno valido y dar de baja a otra persona.
    return pagina("Listo", "Ya no vas a recibir más correos nuestros.");
  }

  return pagina(
    "Listo",
    "Te sacamos de la lista. No vas a recibir más correos nuestros."
  );
}
