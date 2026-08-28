import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafkun-casataller.vercel.app";

// Los previews son publicos a proposito, para poder mandarle el enlace a Katy.
// Pero si ademas dejaramos que Google los rastreara, cada rama terminaria
// compitiendo en los buscadores con el sitio de verdad por el mismo contenido.
// Fuera de produccion se cierra entero.
const esProduccion = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!esProduccion) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/mis-cursos", "/mi-cuenta", "/mis-compras", "/aprende/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
