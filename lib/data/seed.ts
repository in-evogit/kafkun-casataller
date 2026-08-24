// Un solo curso: el inicial. Los otros dos ("telar-mapuche" y "diseno-propio")
// se sacaron el 22-ago-2026 porque no existían — tenían precio y flujo de compra
// con las 46 lecciones en mux_playback_id: null, o sea cero video.
// price_clp se conserva para cuando abra, pero NO se muestra en ninguna parte.
export const seedCourses = [
  {
    slug: "tu-primer-telar",
    title: "Taller inicial de telar mapuche",
    subtitle: "Técnica llano · desde cero",
    description:
      "Conoce el telar mapuche y todas sus piezas, entiende las fases de la urdimbre y aprende a urdir con la técnica de llano. Para todo tipo de persona, sin experiencia previa.",
    price_clp: 45000,
    level: "principiante" as const,
    duration_minutes: 260,
    lessons_count: 12,
    thumbnail_url: "https://placehold.co/600x450/9B2335/FFFFFF?text=Telar+mapuche+inicial",
    seo_description:
      "Taller inicial de telar mapuche, técnica llano. Conoce el telar y sus piezas, la urdimbre y aprende a urdir desde cero.",
  },
];

// NOTA: precios y stock son PLACEHOLDER — reemplazar con los reales de Katy.
//
// `image_url` va en null y `images` vacío desde el 20-ago-2026: las fotos de relleno se
// sacaron del repo. Además la venta online se cae en la v1 (todo es por encargo), así que
// esta lista queda en pausa y no se le vuelven a enchufar fotos hasta que se decida si la
// tienda revive con materiales.
export const seedProducts: {
  slug: string;
  name: string;
  price_clp: number;
  stock: number;
  image_url: string | null;
  images: string[];
  category: string;
}[] = [
  {
    slug: "bufanda-crema",
    name: "Bufanda tejida a telar · crema",
    price_clp: 45000,
    stock: 3,
    image_url: null,
    images: [],
    category: "bufandas",
  },
  {
    slug: "bufanda-roja",
    name: "Bufanda tejida a telar · roja",
    price_clp: 45000,
    stock: 2,
    image_url: null,
    images: [],
    category: "bufandas",
  },
  {
    slug: "chaleco-verde",
    name: "Chaleco de lana · verde",
    price_clp: 38000,
    stock: 1,
    image_url: null,
    images: [],
    category: "chalecos",
  },
  {
    slug: "lanas-hilos",
    name: "Lanas e hilos de colores",
    price_clp: 4500,
    stock: 20,
    image_url: null,
    images: [],
    category: "lanas",
  },
];

/**
 * Testimonios: vacío a propósito.
 * Los 3 anteriores (Valentina Rojas, Francisca Morales, Daniela Sepúlveda) eran inventados,
 * con avatares de placehold.co, y afirmaban "acceso de por vida". Se eliminaron el 3-ago-2026.
 * Solo se repuebla con testimonios reales de alumnas de Katy, con su autorización.
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

export const seedModules: Record<string, SeedModule[]> = {
  "tu-primer-telar": [
    {
      title: "Introducción",
      lessons: [
        { slug: "bienvenida", title: "Bienvenida al curso", duration_minutes: 8, mux_playback_id: null },
        { slug: "materiales", title: "Materiales que necesitas", duration_minutes: 12, mux_playback_id: null },
      ],
    },
    {
      title: "Primeros pasos",
      lessons: [
        { slug: "armar-telar", title: "Cómo armar el telar", duration_minutes: 22, mux_playback_id: null },
        { slug: "urdimbre", title: "La urdimbre paso a paso", duration_minutes: 25, mux_playback_id: null },
        { slug: "primera-trama", title: "Tu primera trama", duration_minutes: 20, mux_playback_id: null },
      ],
    },
    {
      title: "Técnica básica",
      lessons: [
        { slug: "tensado", title: "Tensado y ajuste", duration_minutes: 18, mux_playback_id: null },
        { slug: "patrones", title: "Patrones geométricos simples", duration_minutes: 30, mux_playback_id: null },
        { slug: "lanas", title: "Cómo elegir y combinar lanas", duration_minutes: 15, mux_playback_id: null },
      ],
    },
    {
      title: "Tu primera pieza",
      lessons: [
        { slug: "proyecto", title: "El proyecto final", duration_minutes: 35, mux_playback_id: null },
        { slug: "rematar", title: "Rematar y finalizar", duration_minutes: 20, mux_playback_id: null },
        { slug: "presentar", title: "Presentar tu obra", duration_minutes: 15, mux_playback_id: null },
        { slug: "siguientes-pasos", title: "¿Y ahora qué?", duration_minutes: 10, mux_playback_id: null },
      ],
    },
  ],
};

/**
 * FAQ: vacío a propósito.
 * Las 6 respuestas anteriores afirmaban garantía de 7 días, acceso de por vida, soporte por
 * WhatsApp durante 30 días y kits de iniciación en la tienda. Ninguna fue confirmada por Katy.
 * Eliminadas el 3-ago-2026. Cada respuesta vuelve solo cuando ella defina la política real.
 */
export const faqItems: { q: string; a: string }[] = [];
