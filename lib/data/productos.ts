/**
 * Piezas a pedido. Lo lleva Gabriel.
 *
 * OJO: hoy no se vende nada directo. Estas piezas son REFERENCIA de lo que
 * Katy ya tejio para otras personas, no inventario disponible.
 *
 * Antes esto vivia todo junto en lib/data/seed.ts. Se partio el 30-ago-2026 porque
 * Luca trabaja las clases y Gabriel los productos a pedido: con un archivo unico,
 * cada merge de los dos chocaba en el mismo lugar.
 */

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

/**
 * Testimonios: vacío a propósito.
 * Los 3 anteriores (Valentina Rojas, Francisca Morales, Daniela Sepúlveda) eran inventados,
 * con avatares de placehold.co, y afirmaban "acceso de por vida". Se eliminaron el 3-ago-2026.
 * Solo se repuebla con testimonios reales de alumnas de Katy, con su autorización.
 */
