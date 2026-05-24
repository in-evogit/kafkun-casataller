import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateCourse, deleteCourse } from "../../actions";

export const metadata: Metadata = {
  title: "Editar curso · Admin Kafkun",
  robots: { index: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditarCursoPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!course) notFound();

  const updateWithId = updateCourse.bind(null, id);
  const deleteWithId = deleteCourse.bind(null, id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/cursos" className="text-sm text-muted-foreground hover:text-foreground">
          ← Cursos
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Editar: {course.title}
        </h1>
      </div>

      <form action={updateWithId} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Título *</label>
            <input
              name="title"
              required
              defaultValue={course.title}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Slug *</label>
            <input
              name="slug"
              required
              defaultValue={course.slug}
              pattern="[a-z0-9-]+"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Subtítulo</label>
            <input
              name="subtitle"
              defaultValue={course.subtitle ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Descripción</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={course.description ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Precio (CLP) *</label>
            <input
              name="price_clp"
              type="number"
              required
              defaultValue={course.price_clp}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Nivel *</label>
            <select
              name="level"
              required
              defaultValue={course.level}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Duración (minutos)</label>
            <input
              name="duration_minutes"
              type="number"
              defaultValue={course.duration_minutes ?? 0}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">URL portada</label>
            <input
              name="thumbnail_url"
              type="url"
              defaultValue={course.thumbnail_url ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Descripción SEO</label>
            <input
              name="seo_description"
              maxLength={160}
              defaultValue={course.seo_description ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                defaultChecked={course.published}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Publicado</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              Guardar cambios
            </button>
            <Link
              href="/admin/cursos"
              className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </Link>
          </div>
          <form action={deleteWithId}>
            <button
              type="submit"
              className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              onClick={(e) => {
                if (!confirm("¿Eliminar este curso? Esta acción no se puede deshacer.")) {
                  e.preventDefault();
                }
              }}
            >
              Eliminar
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}
