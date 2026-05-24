"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  price_clp: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().nonnegative().default(0),
  category: z.string().max(60).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  active: z.coerce.boolean().default(true),
});

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
  if (data?.role !== "admin") throw new Error("Sin permisos");
}

export async function createProduct(formData: FormData) {
  await verifyAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    active: formData.get("active") === "on",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin.from("products").insert(parsed.data);
  if (error) throw new Error(error.message);
  redirect("/admin/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  await verifyAdmin();
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    active: formData.get("active") === "on",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin.from("products").update(parsed.data).eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await verifyAdmin();
  const admin = createAdminClient();
  await admin.from("products").delete().eq("id", id);
  redirect("/admin/productos");
}
