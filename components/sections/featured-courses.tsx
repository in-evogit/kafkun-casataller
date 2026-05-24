import Link from "next/link";
import CourseCard from "@/components/course-card";
import { seedCourses } from "@/lib/data/seed";

export default function FeaturedCourses() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Cursos destacados
            </h2>
            <p className="mt-2 text-muted-foreground">
              Elige el nivel que te corresponde ahora
            </p>
          </div>
          <Link
            href="/cursos"
            className="hidden text-sm font-medium text-primary hover:underline md:block"
          >
            Ver todos los cursos →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seedCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/cursos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos los cursos →
          </Link>
        </div>
      </div>
    </section>
  );
}
