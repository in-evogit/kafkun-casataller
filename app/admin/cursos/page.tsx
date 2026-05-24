import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil } from "lucide-react";

export const metadata: Metadata = {
  title: "Cursos · Admin Kafkun",
  robots: { index: false },
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default async function AdminCursosPage() {
  const supabase = createAdminClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, level, price_clp, published, lessons_count")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Cursos
        </h1>
        <Link
          href="/admin/cursos/nuevo"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Nuevo curso
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Título</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nivel</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Precio</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Lecciones</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(courses ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Sin cursos. <Link href="/admin/cursos/nuevo" className="text-primary hover:underline">Crea el primero</Link>
                </td>
              </tr>
            ) : (
              (courses ?? []).map((course) => (
                <tr key={course.id} className="bg-background">
                  <td className="px-4 py-3 font-medium text-foreground">{course.title}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{course.level}</td>
                  <td className="px-4 py-3 text-foreground">{formatPrice(course.price_clp)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{course.lessons_count}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.published
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {course.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/cursos/${course.id}/editar`}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
