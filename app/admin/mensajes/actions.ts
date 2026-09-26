"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verificarAdmin } from "@/lib/admin-guard";
import { z } from "zod";

const esquema = z.object({
  id: z.string().uuid(),
  estado: z.enum(["nuevo", "respondido", "cerrado"]),
  notas: z.string().max(4000).optional(),
});

export async function actualizarMensaje(formData: FormData) {
  await verificarAdmin();

  const parsed = esquema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
    notas: formData.get("notas") ?? "",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin
    .from("mensajes_contacto")
    .update({
      estado: parsed.data.estado,
      notas_internas: parsed.data.notas || null,
    })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/mensajes");
}
