import { type Ranura } from "@/lib/media";

/**
 * Obras entregadas. NO son productos: son prueba de lo que Katy es capaz de hacer.
 * El encargo se define conversando, así que acá no hay precio, ni talla, ni "agregar al carrito".
 *
 * Las fotos son DE RELLENO hasta que Katy entregue las definitivas. La categorización sí es
 * la correcta: lo que el sitio publicaba como "bufandas" son en realidad piezas grandes, y el
 * chaleco verde está tejido a palillo, no a telar (por eso no se afirma la técnica).
 */

export type Obra = {
  slug: string;
  /** DATO PENDIENTE: los nombres propios los pone Katy. */
  nombre: string;
  media: Ranura;
  /** Segunda toma, para el cambio al pasar el cursor. */
  mediaHover?: Ranura;
  /** Solo si Katy la nombra. Nunca inventar la técnica ni el material. */
  materialYTecnica: string | null;
  publicable: boolean;
  /** Las fotos con clientas necesitan su autorización antes de publicarse. */
  motivoNoPublicable?: string;
};

export type FamiliaEncargo = {
  slug: string;
  nombre: string;
  bajada: string;
  orden: number;
  obras: Obra[];
};

const v = (src: string, alt: string, posicion?: string): Ranura => ({
  src,
  alt,
  proporcion: "vertical",
  posicion,
});

export const familiasEncargo: FamiliaEncargo[] = [
  {
    slug: "chalecos",
    nombre: "Chalecos",
    bajada: "Prendas hechas sobre tus medidas.",
    orden: 1,
    obras: [
      {
        slug: "chaleco-verde",
        nombre: "Chaleco verde",
        media: v("/images/prod-chaleco-verde-1.jpg", "Chaleco verde tejido a mano"),
        mediaHover: v("/images/prod-chaleco-verde-2.jpg", "Chaleco verde, vista lateral"),
        materialYTecnica: null,
        publicable: true,
      },
    ],
  },
  {
    slug: "piezas-enteras",
    nombre: "Piezas enteras",
    bajada: "Piezas tejidas completas, salidas del telar.",
    orden: 2,
    obras: [
      {
        slug: "pieza-crema",
        nombre: "Pieza crema con bandas",
        media: v("/images/prod-bufanda-blanca-1.jpg", "Pieza tejida crema con bandas de color y flecos"),
        mediaHover: v("/images/prod-bufanda-blanca-2.jpg", "Pieza crema, otra vista"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "pieza-roja",
        nombre: "Pieza roja",
        media: v("/images/prod-bufanda-roja-1.jpg", "Pieza tejida roja con flecos"),
        mediaHover: v("/images/prod-bufanda-roja-2.jpg", "Pieza roja, caída completa", "45% 40%"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "pieza-crema-detalle",
        nombre: "Pieza crema, detalle",
        media: v("/images/prod-bufanda-blanca-3.jpg", "Detalle del tejido de la pieza crema"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "cintas",
        nombre: "Cintas tejidas",
        media: v("/images/obra-correas-1.jpg", "Cintas tejidas en morado, amarillo y rosado"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "cinta-en-el-telar",
        nombre: "Cinta en el telar",
        media: v("/images/obra-correas-4.jpg", "Cinta tejida sobre la espada de madera del telar"),
        materialYTecnica: null,
        publicable: true,
      },
      // Encargo institucional real (cordones porta-credencial), pero fotografiados sobre un
      // escritorio de oficina con teclado y vaso de lápices en cuadro. Hay que refotografiarlos.
      // Además obra-clientes necesita autorización de la clienta.
      {
        slug: "porta-credenciales",
        nombre: "Cordones porta-credencial",
        media: v("/images/obra-clientes.jpg", "Cordón porta-credencial tejido"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Fotografiado sobre un escritorio de oficina. Refotografiar y pedir autorización de la clienta.",
      },
    ],
  },
];

/** Solo lo que se puede mostrar hoy, en orden de familia. */
export const obrasPublicables: Obra[] = familiasEncargo
  .sort((a, b) => a.orden - b.orden)
  .flatMap((f) => f.obras.filter((o) => o.publicable));
