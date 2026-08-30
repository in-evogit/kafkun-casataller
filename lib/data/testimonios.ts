/**
 * Resenas de alumnas y clientas. Compartido: va en la portada.
 *
 * Vacio a proposito hasta que Gabriel pase las resenas reales. La seccion no se
 * dibuja si el arreglo esta vacio, asi que el sitio no muestra un hueco.
 *
 * Antes esto vivia todo junto en lib/data/seed.ts. Se partio el 30-ago-2026 porque
 * Luca trabaja las clases y Gabriel los productos a pedido: con un archivo unico,
 * cada merge de los dos chocaba en el mismo lugar.
 */

export const testimonials: {
  name: string;
  city: string;
  course: string;
  avatar: string;
  quote: string;
}[] = [];

export type SeedLesson = {
  slug: string;
  title: string;
  duration_minutes: number;
  mux_playback_id: string | null;
};

export type SeedModule = {
  title: string;
  lessons: SeedLesson[];
};

