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
      "Taller inicial de telar mapuche, técnica llano. Conoce el telar y sus piezas, la urdimbre y aprende a urdir desde cero. Acceso de por vida.",
  },
  {
    slug: "telar-mapuche",
    title: "Telar mapuche",
    subtitle: "Witral, técnicas ancestrales",
    description:
      "Adéntrate en el telar mapuche tradicional. Técnicas de witral, ñimin, y el respeto del oficio.",
    price_clp: 72000,
    level: "intermedio" as const,
    duration_minutes: 430,
    lessons_count: 18,
    thumbnail_url: "https://placehold.co/600x450/7C1D2B/FFFFFF?text=Telar+mapuche",
    seo_description:
      "Curso de telar mapuche tradicional. Witral, ñimin y técnicas ancestrales.",
  },
  {
    slug: "diseno-propio",
    title: "Diseño propio",
    subtitle: "Color, composición y oficio",
    description:
      "Para alumnas que ya saben tejer y quieren desarrollar su propio lenguaje. Color, composición, identidad.",
    price_clp: 68000,
    level: "avanzado" as const,
    duration_minutes: 400,
    lessons_count: 16,
    thumbnail_url: "https://placehold.co/600x450/5C1520/FFFFFF?text=Diseño+propio",
    seo_description:
      "Desarrolla tu propio lenguaje textil. Curso avanzado de diseño en telar.",
  },
];

// NOTA: precios y stock son PLACEHOLDER — reemplazar con los reales de Katy.
export const seedProducts = [
  {
    slug: "bufanda-crema",
    name: "Bufanda tejida a telar · crema",
    price_clp: 45000,
    stock: 3,
    image_url: "/images/prod-bufanda-blanca-1.jpg",
    images: [
      "/images/prod-bufanda-blanca-1.jpg",
      "/images/prod-bufanda-blanca-2.jpg",
      "/images/prod-bufanda-blanca-3.jpg",
    ],
    category: "bufandas",
  },
  {
    slug: "bufanda-roja",
    name: "Bufanda tejida a telar · roja",
    price_clp: 45000,
    stock: 2,
    image_url: "/images/prod-bufanda-roja-1.jpg",
    images: [
      "/images/prod-bufanda-roja-1.jpg",
      "/images/prod-bufanda-roja-2.jpg",
    ],
    category: "bufandas",
  },
  {
    slug: "chaleco-verde",
    name: "Chaleco de lana · verde",
    price_clp: 38000,
    stock: 1,
    image_url: "/images/prod-chaleco-verde-1.jpg",
    images: [
      "/images/prod-chaleco-verde-1.jpg",
      "/images/prod-chaleco-verde-2.jpg",
    ],
    category: "chalecos",
  },
  {
    slug: "lanas-hilos",
    name: "Lanas e hilos de colores",
    price_clp: 4500,
    stock: 20,
    image_url: "/images/lanas-1.jpg",
    images: ["/images/lanas-1.jpg", "/images/lanas-2.jpg"],
    category: "lanas",
  },
];

export const testimonials = [
  {
    name: "Valentina Rojas",
    city: "Santiago",
    course: "Tu primer telar",
    avatar: "https://placehold.co/80x80/9B2335/FFFFFF?text=VR",
    quote:
      "Nunca pensé que iba a poder tejer algo tan bonito en mis primeras semanas. Katy explica todo con mucha paciencia y claridad.",
  },
  {
    name: "Francisca Morales",
    city: "Valparaíso",
    course: "Telar mapuche",
    avatar: "https://placehold.co/80x80/7C1D2B/FFFFFF?text=FM",
    quote:
      "El curso de telar mapuche me cambió la perspectiva. Aprendí no solo técnica sino también historia y significado detrás de cada tejido.",
  },
  {
    name: "Daniela Sepúlveda",
    city: "Concepción",
    course: "Tu primer telar",
    avatar: "https://placehold.co/80x80/5C1520/FFFFFF?text=DS",
    quote:
      "Acceso de por vida es lo mejor. Vuelvo a ver las lecciones cada vez que necesito repasar algo. Vale cada peso.",
  },
];

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
  "telar-mapuche": [
    {
      title: "Contexto e historia",
      lessons: [
        { slug: "introduccion", title: "El witral y su significado", duration_minutes: 20, mux_playback_id: null },
        { slug: "materiales-tradicionales", title: "Materiales tradicionales", duration_minutes: 15, mux_playback_id: null },
        { slug: "construir-witral", title: "Construir tu propio witral", duration_minutes: 35, mux_playback_id: null },
      ],
    },
    {
      title: "Técnica witral",
      lessons: [
        { slug: "urdimbre-vertical", title: "Urdimbre vertical", duration_minutes: 28, mux_playback_id: null },
        { slug: "nimin-basico", title: "Ñimin básico", duration_minutes: 40, mux_playback_id: null },
        { slug: "motivos-geometricos", title: "Motivos geométricos ancestrales", duration_minutes: 35, mux_playback_id: null },
      ],
    },
    {
      title: "Color y fibra",
      lessons: [
        { slug: "tintura-natural", title: "Tintura natural de lanas", duration_minutes: 45, mux_playback_id: null },
        { slug: "paleta-tradicional", title: "Paleta de colores tradicional", duration_minutes: 22, mux_playback_id: null },
      ],
    },
    {
      title: "Proyecto completo",
      lessons: [
        { slug: "diseno-nimin", title: "Diseñar tu ñimin", duration_minutes: 38, mux_playback_id: null },
        { slug: "tejiendo-proyecto", title: "Tejiendo el proyecto", duration_minutes: 55, mux_playback_id: null },
        { slug: "terminaciones", title: "Terminaciones y presentación", duration_minutes: 30, mux_playback_id: null },
        { slug: "reflexion-final", title: "Reflexión final", duration_minutes: 12, mux_playback_id: null },
      ],
    },
  ],
  "diseno-propio": [
    {
      title: "Fundamentos del diseño",
      lessons: [
        { slug: "introduccion-diseno", title: "¿Qué es diseño propio?", duration_minutes: 18, mux_playback_id: null },
        { slug: "teoria-color", title: "Teoría del color textil", duration_minutes: 35, mux_playback_id: null },
        { slug: "composicion", title: "Composición y ritmo", duration_minutes: 30, mux_playback_id: null },
      ],
    },
    {
      title: "Identidad visual",
      lessons: [
        { slug: "referencias", title: "Construir un moodboard textil", duration_minutes: 25, mux_playback_id: null },
        { slug: "lenguaje-propio", title: "Desarrollar tu lenguaje propio", duration_minutes: 40, mux_playback_id: null },
      ],
    },
    {
      title: "Técnicas mixtas",
      lessons: [
        { slug: "mezcla-fibras", title: "Mezcla de fibras y texturas", duration_minutes: 35, mux_playback_id: null },
        { slug: "relieve", title: "Tejido en relieve", duration_minutes: 42, mux_playback_id: null },
        { slug: "estructura", title: "Variaciones de estructura", duration_minutes: 38, mux_playback_id: null },
      ],
    },
    {
      title: "Proyecto y portafolio",
      lessons: [
        { slug: "proceso-creativo", title: "Del boceto al tapiz", duration_minutes: 30, mux_playback_id: null },
        { slug: "proyecto-final", title: "Proyecto final", duration_minutes: 50, mux_playback_id: null },
        { slug: "fotografia", title: "Fotografiar tu obra", duration_minutes: 22, mux_playback_id: null },
        { slug: "portafolio", title: "Armar tu portafolio", duration_minutes: 20, mux_playback_id: null },
        { slug: "cierre", title: "Cierre y próximos pasos", duration_minutes: 15, mux_playback_id: null },
      ],
    },
  ],
};

export const faqItems = [
  {
    q: "¿Necesito experiencia previa para empezar?",
    a: "No, para nada. El curso Tu primer telar está diseñado exactamente para alguien que nunca ha tocado un telar. Te acompaño desde armar el bastidor.",
  },
  {
    q: "¿Qué materiales necesito tener?",
    a: "Un telar de peine o bastidor básico y lana. En la tienda encuentras kits de iniciación con todo lo necesario. También te indico alternativas económicas al inicio del curso.",
  },
  {
    q: "¿Cuánto tiempo tengo para ver el curso?",
    a: "Acceso de por vida. Lo ves a tu ritmo, puedes pausar, volver a ver y retomar cuando quieras. Sin fechas límite.",
  },
  {
    q: "¿Y si el curso no es lo que esperaba?",
    a: "Garantía de 7 días. Si en la primera semana sientes que no es para ti, te devuelvo el dinero sin preguntas.",
  },
  {
    q: "¿Puedo hacer preguntas si me trabo?",
    a: "Sí, todos los cursos incluyen soporte por WhatsApp por 30 días desde tu primera clase. Estoy ahí para ayudarte.",
  },
  {
    q: "¿Cómo accedo al curso después de comprar?",
    a: "Al completar el pago recibes un email con tus datos de acceso. En segundos ya puedes entrar a tu primera lección.",
  },
];
