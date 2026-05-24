import type { Metadata } from "next";
import CourseCard from "@/components/course-card";
import { seedCourses } from "@/lib/data/seed";

export const metadata: Metadata = {
  title: "Todos los cursos · Casa Taller Kafkun",
  description:
    "Explora nuestros cursos de telar online. Desde principiante hasta avanzado, con acceso de por vida y soporte personalizado.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/cursos`,
  },
};

const levelOrder = { principiante: 0, intermedio: 1, avanzado: 2 } as const;

export default function CursosPage() {
  const sorted = [...seedCourses].sort(
    (a, b) => levelOrder[a.level] - levelOrder[b.level]
  );

  return (
    <main>
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Cursos de telar
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Aprender a tejer es para cualquiera. Elige el nivel que te llama y
            empieza hoy, a tu propio ritmo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-border bg-secondary p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Todos los cursos incluyen
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Acceso de por vida", icon: "∞" },
              { label: "Soporte 30 días", icon: "💬" },
              { label: "Garantía 7 días", icon: "✓" },
              { label: "Certificado digital", icon: "◎" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
