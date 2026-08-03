import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Canje del código de un enlace por correo (magic link / confirmación de registro).
 *
 * Sin esta ruta, Supabase redirige de vuelta al sitio con un `code` en la URL que nadie
 * intercambia, así que la sesión nunca queda escrita en las cookies del servidor: el
 * enlace "funciona" de cara al usuario y aun así sigue sin sesión.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  // Solo rutas internas: evita que un `next` externo convierta esto en un redirect abierto.
  const nextParam = searchParams.get("next") ?? "/mis-cursos";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/mis-cursos";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=enlace_invalido`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] No se pudo canjear el código:", error.message);
    return NextResponse.redirect(`${origin}/login?error=enlace_expirado`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
