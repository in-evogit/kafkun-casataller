"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verificarAdmin } from "@/lib/admin-guard";
import { z } from "zod";

const esquema = z.object({
  id: z.string().uuid(),
  estado: z.enum(["activo", "baja"]),
});

/**
 * Da de baja a alguien a mano, o la vuelve a activar.
 *
 * Hace falta porque la gente lo pide por Instagram o por WhatsApp, no siempre
 * apretando el enlace del correo. Si no se puede hacer desde el panel, se hace
 * "no mandandole" —y un dia se le manda igual—.
 */
export async function cambiarEstadoSuscriptor(formData: FormData) {
  await verificarAdmin();

  const parsed = esquema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin
    .from("suscriptores")
    .update({ estado: parsed.data.estado })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/suscriptores");
}
