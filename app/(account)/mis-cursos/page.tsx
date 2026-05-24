import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { seedCourses, seedModules } from "@/lib/data/seed";
import { PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Mis cursos · Casa Taller Kafkun",
  robots: { index: false },
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export default async function MisCursosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const devMode = process.env.NEXT_PUBLIC_BUSINESS_MODE !== "production";

  let enrolledSlugs: string[] = [];

  if (!devMode && user) {
    const admin = createAdminClient();
    const { data: enrollments } = await admin
      .from("enrollments")
      .select("courses(slug)")
      .eq("user_id", user.id);

    enrolledSlugs = (enrollments ?? [])
      .map((e) => {
        const c = e.courses as unknown as { slug: string } | null;
        return c?.slug ?? null;
      })
      .filter((s): s is string => s !== null);
  } else {
    // En dev: mostrar todos los cursos como si estuvieran inscritos
    enrolledSlugs = seedCourses.map((c) => c.slug);
  }

  const enrolledCourses = seedCourses.filter((c) => enrolledSlugs.includes(c.slug));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Mis cursos
      </h1>

      {devMode && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          Modo desarrollo: se muestran todos los cursos como si estuvieras inscrita.
        </div>
      )}

      {enrolledCourses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-secondary p-8 text-center">
          <p className="text-muted-foreground">Todavía no tienes cursos.</p>
          <Link
            href="/cursos"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            Ver cursos disponibles
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {enrolledCourses.map((course) => {
            const modules = seedModules[course.slug] ?? [];
            const firstLesson = modules[0]?.lessons[0];
            const totalLessons = modules.flatMap((m) => m.lessons).length;

            return (
              <div
                key={course.slug}
                className="flex gap-4 rounded-xl border border-border bg-background p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {totalLessons} lecciones · {course.level}
                    </p>
                  </div>
                  {firstLesson && (
                    <Link
                      href={`/aprende/${course.slug}/${firstLesson.slug}`}
                      className="mt-2 flex w-fit items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-accent"
                    >
                      <PlayCircle className="h-3.5 w-3.5" />
                      Continuar
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
