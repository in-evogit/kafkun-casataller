export const seedCourses = [
  {
    slug: "tu-primer-telar",
    title: "Tu primer telar",
    subtitle: "De cero a tu primer tapiz",
    description:
      "Aprende los fundamentos del telar desde la base. En 12 lecciones vas a armar tu primer tapiz, paso a paso, sin saltarse nada.",
    price_clp: 45000,
    level: "principiante" as const,
    duration_minutes: 260,
    lessons_count: 12,
    thumbnail_url:
      "https://placehold.co/600x450/9B2335/FFFFFF?text=Tu+primer+telar",
    seo_description:
      "Aprende a tejer en telar desde cero, a tu ritmo. 12 lecciones, 4h 20min, acceso de por vida.",
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
    thumbnail_url:
      "https://placehold.co/600x450/7C1D2B/FFFFFF?text=Telar+mapuche",
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
    thumbnail_url:
      "https://placehold.co/600x450/5C1520/FFFFFF?text=Diseño+propio",
    seo_description:
      "Desarrolla tu propio lenguaje textil. Curso avanzado de diseño en telar.",
  },
];

export const seedProducts = [
  {
    slug: "telar-maria-mediano",
    name: "Telar María mediano",
    price_clp: 38900,
    stock: 8,
    image_url: "https://placehold.co/600x600/9B2335/FFFFFF?text=Telar+María",
    category: "telares",
  },
  {
    slug: "lana-oveja-100g",
    name: "Lana de oveja · 100g",
    price_clp: 5200,
    stock: 50,
    image_url: "https://placehold.co/600x600/7C1D2B/FFFFFF?text=Lana",
    category: "lanas",
  },
  {
    slug: "kit-iniciacion-completo",
    name: "Kit completo iniciación",
    price_clp: 67000,
    stock: 5,
    image_url: "https://placehold.co/600x600/5C1520/FFFFFF?text=Kit",
    category: "kits",
  },
  {
    slug: "set-peines-telar",
    name: "Set de peines de telar",
    price_clp: 12400,
    stock: 12,
    image_url: "https://placehold.co/600x600/9B2335/FFFFFF?text=Peines",
    category: "accesorios",
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
