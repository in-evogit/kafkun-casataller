"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  subtitle: z.string().max(160).optional(),
  description: z.string().max(2000).optional(),
  price_clp: z.coerce.number().int().positive(),
  level: z.enum(["principiante", "intermedio", "avanzado"]),
  duration_minutes: z.coerce.number().int().nonnegative().default(0),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  seo_description: z.string().max(160).optional(),
  published: z.coerce.boolean().default(false),
});

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
  if (data?.role !== "admin") throw new Error("Sin permisos");
}

export async function createCourse(formData: FormData) {
  await verifyAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = courseSchema.safeParse({
    ...raw,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin.from("courses").insert(parsed.data);
  if (error) throw new Error(error.message);

  redirect("/admin/cursos");
}

export async function updateCourse(id: string, formData: FormData) {
  await verifyAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = courseSchema.safeParse({
    ...raw,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) throw new Error("Datos inválidos");

  const admin = createAdminClient();
  const { error } = await admin.from("courses").update(parsed.data).eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/cursos");
}

export async function deleteCourse(id: string) {
  await verifyAdmin();
  const admin = createAdminClient();
  await admin.from("courses").delete().eq("id", id);
  redirect("/admin/cursos");
}
