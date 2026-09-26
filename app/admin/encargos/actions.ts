"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verificarAdmin } from "@/lib/admin-guard";
import { z } from "zod";

const ESTADOS = ["nuevo", "contactado", "agendado", "cerrado"] as const;

const esquema = z.object({
  id: z.string().uuid(),
  estado: z.enum(ESTADOS),
  notas: z.string().max(4000).optional(),
});

/**
 * Cambia el estado de un encargo y guarda las notas internas.
 *
 * revalidatePath y no redirect: quien atiende encargos va marcando uno tras otro
 * en la misma pantalla. Un redirect la devolveria arriba del todo en cada cambio.
 */
export async function actualizarEncargo(formData: FormData) {
  await verificarAdmin();

  const parsed = esquema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
    notas: formData.get("notas") ?? "",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin
    .from("encargos")
    .update({
      estado: parsed.data.estado,
      notas_internas: parsed.data.notas || null,
    })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/encargos");
}
