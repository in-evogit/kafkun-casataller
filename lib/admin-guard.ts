import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Comprueba que quien llama sea administrador. Lanza si no lo es.
 *
 * Cada `actions.ts` del panel tenia su propia copia de esto. Con una copia por
 * archivo, el dia que haya que endurecer la comprobacion se endurece en uno y se
 * olvida en los otros —y basta con que se olvide en uno—.
 *
 * Usa el cliente de SESION (no el de service_role) a proposito: la pregunta es
 * "quien es esta persona", y el de service_role no tiene persona, se salta todo.
 */
export async function verificarAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (data?.role !== "admin") throw new Error("Sin permisos");

  return user;
}
