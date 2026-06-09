import type { MetadataRoute } from "next";
import { seedCourses, seedProducts } from "@/lib/data/seed";
import { getAllPosts } from "@/lib/blog";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafkun-casataller.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/cursos`, lastModified: new Date(), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/tienda`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/diario`, lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/sobre-mi`, lastModified: new Date(), priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/contacto`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/preguntas-frecuentes`, lastModified: new Date(), priority: 0.5, changeFrequency: "monthly" },
  ];

  const coursePages: MetadataRoute.Sitemap = seedCourses.map((c) => ({
    url: `${base}/cursos/${c.slug}`,
    lastModified: new Date(),
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const productPages: MetadataRoute.Sitemap = seedProducts.map((p) => ({
    url: `${base}/tienda/${p.slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${base}/diario/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.65,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...coursePages, ...productPages, ...blogPages];
}
