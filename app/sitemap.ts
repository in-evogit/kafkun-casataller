import type { MetadataRoute } from "next";
import { seedCourses } from "@/lib/data/clases";
import { getAllPosts } from "@/lib/blog";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafkun-casataller.vercel.app";

/**
 * Solo rutas que existen de verdad.
 *
 * Antes este archivo le anunciaba a Google /tienda y cada pagina de producto (que ahora
 * redirigen), y ademas /contacto y /preguntas-frecuentes, que nunca se construyeron y
 * responden 404. Un sitemap que apunta a paginas muertas gasta el presupuesto de rastreo
 * y le dice al buscador que el sitio esta descuidado.
 *
 * Cuando /contacto exista, se vuelve a agregar aca. No antes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/a-pedido`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/a-pedido/empezar`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/cursos`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/diario`, lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/sobre-mi`, lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" },
  ];

  const cursos: MetadataRoute.Sitemap = seedCourses.map((c) => ({
    url: `${base}/cursos/${c.slug}`,
    lastModified: new Date(),
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const diario: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${base}/diario/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.65,
    changeFrequency: "monthly" as const,
  }));

  return [...estaticas, ...cursos, ...diario];
}
