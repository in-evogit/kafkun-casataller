import Link from "next/link";
import CourseCard from "@/components/course-card";
import { seedCourses } from "@/lib/data/seed";

/**
 * Clases de telar. Cards deliberadamente NO fotográficas frente a las obras: así el ojo
 * distingue una clase de una obra sin tener que leer.
 *
 * Al lanzamiento hay UN curso: el inicial. Los otros dos se sacaron el 22-ago-2026
 * porque no existían. Se agregan cuando Katy los grabe.
 */
export default function FeaturedCourses() {
  if (seedCourses.length === 0) return null;

  return (
    <section id="clases" className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Clases de telar mapuche
          </p>
          <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
            Aprende la técnica a tu ritmo, desde donde estés
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
            Katy está grabando el taller inicial. Acá está el temario completo para que
            veas qué vas a aprender; cuando abra, la primera en enterarse es la lista.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {seedCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/cursos"
            className="hilo inline-block text-[0.9375rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver el temario completo
          </Link>
        </div>
      </div>
    </section>
  );
}
