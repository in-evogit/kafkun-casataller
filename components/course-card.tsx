import Link from "next/link";
import { Clock } from "lucide-react";
import Figura from "@/components/figura";
import { pendiente } from "@/lib/media";

/**
 * Ficha de clase.
 *
 * Sin precio y sin botón de compra: las clases todavía no existen, están en
 * preparación. Mostrar el temario sin vender es a propósito — demuestra que el
 * taller es real y va en camino, no una promesa vaga. Lo único que se pide es el
 * correo, y eso vive en la sección, no acá.
 *
 * Dejó de ser Client Component al salir el carrito: ahora no tiene estado.
 */

type Course = {
  slug: string;
  title: string;
  subtitle: string;
  level: "principiante" | "intermedio" | "avanzado";
  duration_minutes: number;
  thumbnail_url: string | null;
};

// El nivel se distingue por el color del filete, no por una pastilla de color.
const levelBorder = {
  principiante: "border-border-strong",
  intermedio: "border-border-strong",
  avanzado: "border-primary",
};

function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  return h > 0 ? `${h} h ${min % 60} min` : `${min} min`;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/cursos/${course.slug}`}
      className={`group flex flex-col border-l-2 pl-5 transition-colors duration-[var(--dur-color)] hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background ${levelBorder[course.level]}`}
    >
      {/* Las portadas de curso van HORIZONTALES y todavía no existen. Mientras no
          haya foto real se dibuja la ranura pendiente. */}
      <Figura
        media={
          course.thumbnail_url && !course.thumbnail_url.includes("placehold.co")
            ? {
                src: course.thumbnail_url,
                alt: `Portada del curso ${course.title}`,
                proporcion: "horizontal",
              }
            : pendiente("horizontal", `Portada horizontal del curso "${course.title}"`)
        }
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{course.level}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1 normal-case tracking-normal">
            <Clock className="h-3 w-3" />
            {formatDuration(course.duration_minutes)}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-[1.3125rem] text-foreground">
          {course.title}
        </h3>
        <p className="mt-1.5 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {course.subtitle}
        </p>
        <div className="mt-5">
          <span className="inline-flex items-center rounded-[2px] border border-primary px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary">
            En preparación
          </span>
        </div>
      </div>
    </Link>
  );
}
