// Candado real, no un comentario: si alguien importa esto desde un componente
// de navegador, la compilacion FALLA en vez de empaquetar el secreto y mandarlo.
import "server-only";

import { createClient } from "@supabase/supabase-js";

// Solo usar en server components / API routes / server actions
// NUNCA exponer al cliente — bypassa RLS
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
