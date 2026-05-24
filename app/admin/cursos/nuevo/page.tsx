import type { Metadata } from "next";
import Link from "next/link";
import { createCourse } from "../actions";

export const metadata: Metadata = {
  title: "Nuevo curso · Admin Kafkun",
  robots: { index: false },
};

export default function NuevoCursoPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/cursos" className="text-sm text-muted-foreground hover:text-foreground">
          ← Cursos
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Nuevo curso
        </h1>
      </div>

      <form action={createCourse} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Título *
            </label>
            <input
              name="title"
              required
              placeholder="Tu primer telar"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Slug (URL) *
            </label>
            <input
              name="slug"
              required
              placeholder="tu-primer-telar"
              pattern="[a-z0-9-]+"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Solo minúsculas, números y guiones. Ej: telar-mapuche
            </p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Subtítulo
            </label>
            <input
              name="subtitle"
              placeholder="De cero a tu primer tapiz"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Descripción
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Descripción detallada del curso..."
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Precio (CLP) *
            </label>
            <input
              name="price_clp"
              type="number"
              required
              min={1000}
              placeholder="45000"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Nivel *
            </label>
            <select
              name="level"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              Duración (minutos)
            </label>
            <input
              name="duration_minutes"
              type="number"
              min={0}
              defaultValue={0}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">
              URL de imagen de portada
            </label>
            <input
              name="thumbnail_url"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">
              Descripción SEO (max 160 caracteres)
            </label>
            <input
              name="seo_description"
              maxLength={160}
              placeholder="Aprende a tejer en telar desde cero..."
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Publicar curso (visible en /cursos)
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border pt-6">
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Crear curso
          </button>
          <Link
            href="/admin/cursos"
            className="rounded-md border border-border px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
