import { type Ranura } from "@/lib/media";

/**
 * Obras entregadas. NO son productos: son prueba de lo que Katy es capaz de hacer.
 * El encargo se define conversando, así que acá no hay precio, ni talla, ni "agregar al carrito".
 *
 * ACTUALIZADO 6-sep-2026: las fotos de relleno se reemplazaron por el material real que
 * entregó Gabriel. De seis piezas se pasa a catorce, y eso cambia lo que el sitio dice de
 * Katy: seis se lee como "hizo unas cosas", catorce se lee como oficio.
 *
 * Las piezas en maniquí son las más valiosas del set porque se ve CÓMO CAE la prenda puesta,
 * que es justo lo que alguien necesita para imaginarse la suya.
 *
 * Regla de autorización (viene del LEEME de la carpeta de contenido): toda foto con una
 * persona identificable entra marcada `publicable: false` hasta tener su permiso por escrito.
 * Están acá listas para encenderse el día que llegue.
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
        slug: "chaleco-mostaza",
        nombre: "Chaleco mostaza",
        media: v("/images/obra-chaleco-mostaza-1.jpg", "Chaleco tejido en mostaza, visto de frente"),
        mediaHover: v("/images/obra-chaleco-mostaza-2.jpg", "El mismo chaleco mostaza, por detrás"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "chaleco-cafe",
        nombre: "Chaleco café",
        media: v("/images/obra-chaleco-cafe-1.jpg", "Chaleco tejido en café sobre camisa blanca"),
        mediaHover: v("/images/obra-chaleco-cafe-2.jpg", "El mismo chaleco café, de frente"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "capucha-mostaza",
        nombre: "Capucha y cuello",
        media: v("/images/obra-capucha-mostaza.jpg", "Capucha y cuello tejidos en tonos mostaza, puestos"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Se ve el rostro de la persona que la lleva. Falta su autorización por escrito.",
      },
      {
        slug: "chaleco-verde",
        nombre: "Chaleco verde",
        media: v("/images/prod-chaleco-verde-1.jpg", "Chaleco verde tejido"),
        mediaHover: v("/images/prod-chaleco-verde-2.jpg", "El chaleco verde, otra vista"),
        materialYTecnica: null,
        publicable: true,
      },
    ],
  },
  {
    slug: "piezas-enteras",
    nombre: "Piezas enteras",
    bajada: "Mantas, chales y piezas grandes, salidas del telar.",
    orden: 2,
    obras: [
      {
        slug: "manta-roja",
        nombre: "Manta roja y crema",
        media: v("/images/obra-manta-roja-1.jpg", "Manta tejida a rayas rojas sobre crema"),
        mediaHover: v("/images/obra-manta-roja-2.jpg", "La manta roja colgada del telar"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "manta-roja-entrega",
        nombre: "Lista para entregar",
        media: v("/images/obra-manta-roja-caja.jpg", "La manta roja doblada en su caja, con la etiqueta de Kafkün"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Gabriel, 7-sep-2026: es la misma manta roja de la obra anterior, en su caja. La foto vale (se ve el empaque con la etiqueta), pero en el carrusel la pieza salía dos veces. Devolverla con publicable: true si se quiere una sección de empaque aparte.",
      },
      {
        slug: "manta-hojas",
        nombre: "Manta de hojas",
        media: v("/images/obra-manta-hojas.jpg", "Manta crema con hojas tejidas en tonos de otoño"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "chal-rosa",
        nombre: "Chal crema y rosa",
        media: v("/images/obra-chal-rosa-1.jpg", "Chal crema con franjas rosadas, sobre maniquí en el campo"),
        mediaHover: v("/images/obra-chal-rosa-2.jpg", "El mismo chal, puesto sobre los hombros"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "chal-gris",
        nombre: "Chal gris con flecos",
        media: v("/images/obra-chal-gris.jpg", "Chal tejido en gris jaspeado, con flecos"),
        materialYTecnica: null,
        publicable: true,
      },
      {
        slug: "manta-crema",
        nombre: "Manta crema con bandas",
        media: v("/images/obra-manta-crema.jpg", "Manta crema con bandas oscuras, sostenida por su dueña"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Se ve el rostro de la clienta. Falta su autorización por escrito.",
      },
      {
        slug: "chal-frambuesa",
        nombre: "Chal crema y frambuesa",
        media: v("/images/prod-bufanda-roja-1.jpg", "Chal crema con franjas frambuesa, sobre maniquí en el jardín"),
        mediaHover: v("/images/prod-bufanda-roja-2.jpg", "El mismo chal, caída completa", "45% 40%"),
        materialYTecnica: null,
        publicable: true,
      },
    ],
  },
  {
    slug: "cintas",
    nombre: "Cintas y fajas tejidas",
    bajada: "Piezas angostas con diseños tradicionales, tejidas una a una.",
    orden: 3,
    obras: [
      {
        slug: "cintas-muestrario",
        nombre: "Muestrario de diseños",
        media: v("/images/obra-cintas-muestrario.jpg", "Varias cintas tejidas con distintos diseños tradicionales"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Gabriel, 6-sep-2026: las cintas y correas se dejan aparte por ahora. La familia entera desaparece de /a-pedido mientras todas estén así; para devolverlas, cambiar estos cuatro a true.",
      },
      {
        slug: "cinta-amarilla",
        nombre: "Cinta crema, roja y amarilla",
        media: v("/images/obra-cinta-amarilla.jpg", "Cinta tejida en crema con franjas rojas y amarillas"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Gabriel, 6-sep-2026: las cintas y correas se dejan aparte por ahora. La familia entera desaparece de /a-pedido mientras todas estén así; para devolverlas, cambiar estos cuatro a true.",
      },
      {
        slug: "cintas-colores",
        nombre: "Cintas tejidas",
        media: v("/images/obra-correas-1.jpg", "Cintas tejidas en morado, amarillo y rosado"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Gabriel, 6-sep-2026: las cintas y correas se dejan aparte por ahora. La familia entera desaparece de /a-pedido mientras todas estén así; para devolverlas, cambiar estos cuatro a true.",
      },
      {
        slug: "cinta-en-el-telar",
        nombre: "Cinta en el telar",
        media: v("/images/obra-correas-4.jpg", "Cinta tejida sobre la espada de madera del telar"),
        materialYTecnica: null,
        publicable: false,
        motivoNoPublicable:
          "Gabriel, 6-sep-2026: las cintas y correas se dejan aparte por ahora. La familia entera desaparece de /a-pedido mientras todas estén así; para devolverlas, cambiar estos cuatro a true.",
      },
    ],
  },
];

/** Solo lo que se puede mostrar hoy, en orden de familia. */
export const obrasPublicables: Obra[] = familiasEncargo
  .sort((a, b) => a.orden - b.orden)
  .flatMap((f) => f.obras.filter((o) => o.publicable));
