"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import Figura from "@/components/figura";
import { pendiente } from "@/lib/media";

type Course = {
  slug: string;
  title: string;
  subtitle: string;
  price_clp: number;
  level: "principiante" | "intermedio" | "avanzado";
  duration_minutes: number;
  thumbnail_url: string;
};

// El nivel se distingue por el color del filete, no por una pastilla de color:
// una pastilla mas compite con el precio y con el boton por la misma atencion.
const levelBorder = {
  principiante: "border-border-strong",
  intermedio: "border-border-strong",
  avanzado: "border-primary",
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export default function CourseCard({ course }: { course: Course }) {
  const add = useCart((s) => s.add);
  const items = useCart((s) => s.items);
  const inCart = items.some((i) => i.id === course.slug);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    add({
      id: course.slug,
      type: "course",
      title: course.title,
      price_clp: course.price_clp,
      thumbnail_url: course.thumbnail_url,
    });
  }

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className={`group flex flex-col border-l-2 pl-5 transition-colors duration-[var(--dur-color)] hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background ${levelBorder[course.level]}`}
    >
      {/* Las portadas de curso van HORIZONTALES y hoy no existen: los thumbnail_url de seed
          apuntaban a placehold.co, que responde 400, o sea la portada mostraba tres imágenes
          rotas. Mientras no haya foto real se dibuja la ranura pendiente. */}
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
        <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
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
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="font-heading text-[1.0625rem] tabular-nums text-foreground">
            {formatPrice(course.price_clp)}
          </span>
          <button
            onClick={handleAdd}
            className={`rounded-[2px] px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-[var(--dur-color)] ${
              inCart
                ? "cursor-default bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-accent"
            }`}
          >
            {inCart ? "En carrito" : "Agregar"}
          </button>
        </div>
      </div>
    </Link>
  );
}
