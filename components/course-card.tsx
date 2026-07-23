"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useCart } from "@/lib/store/cart";

type Course = {
  slug: string;
  title: string;
  subtitle: string;
  price_clp: number;
  level: "principiante" | "intermedio" | "avanzado";
  duration_minutes: number;
  thumbnail_url: string;
};

const levelColors = {
  principiante: "bg-primary text-primary-foreground",
  intermedio: "bg-accent text-accent-foreground",
  avanzado: "bg-[#5c1520] text-white",
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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={course.thumbnail_url}
          alt={`Portada del curso ${course.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}
          >
            {course.level}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(course.duration_minutes)}
          </span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-semibold text-foreground group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">
          {course.subtitle}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-heading text-lg font-semibold text-foreground">
            {formatPrice(course.price_clp)}
          </span>
          <button
            onClick={handleAdd}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              inCart
                ? "bg-muted text-muted-foreground cursor-default"
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
