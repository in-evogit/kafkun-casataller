import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Alumnos · Admin Kafkun",
  robots: { index: false },
};

export default async function AdminAlumnosPage() {
  const supabase = createAdminClient();
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  // Contar cursos por alumno
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id");

  const courseCountByUser: Record<string, number> = {};
  for (const e of enrollments ?? []) {
    courseCountByUser[e.user_id] = (courseCountByUser[e.user_id] ?? 0) + 1;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Alumnos</h1>
      <p className="mt-1 text-sm text-muted-foreground">{students?.length ?? 0} registrados</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cursos</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(students ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Sin alumnos aún</td>
              </tr>
            ) : (
              (students ?? []).map((s) => (
                <tr key={s.id} className="bg-background">
                  <td className="px-4 py-3 font-medium text-foreground">{s.full_name ?? "Sin nombre"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{courseCountByUser[s.id] ?? 0}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("es-CL")}
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
