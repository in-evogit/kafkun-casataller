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

/**
 * Familias del encargo. Son TRES y son estas: chalecos, bufandas y correas.
 * No existen "fajas" — eso estaba mal categorizado y se corrigió el 20-ago-2026.
 *
 * Las `obras` van vacías a propósito: las fotos de relleno se sacaron del repo el
 * 20-ago-2026 porque estaban mal seccionadas y se iban a mezclar con las definitivas.
 * Las buenas llegan por el Drive de contenido, ya ordenadas por estas mismas familias.
 * Mientras estén vacías, `ObrasGallery` se esconde sola: es preferible a publicar
 * siete recuadros grises.
 *
 * Para cargar una obra:
 *   media: { src: "/images/<archivo>.jpg", alt: "...", proporcion: "vertical" }
 * Siempre VERTICAL 3:4 — es como se fotografía una prenda colgada.
 * `mediaHover` es la segunda toma de la MISMA pieza, la que aparece al pasar el cursor.
 */
export const familiasEncargo: FamiliaEncargo[] = [
  {
    slug: "chalecos",
    nombre: "Chalecos",
    bajada: "Prendas hechas sobre tus medidas.",
    orden: 1,
    // Va primero: es lo que más se encarga hoy.
    // Pendiente del Drive: chaleco verde (2 tomas) y el chaleco de la familia Langer (2 tomas).
    obras: [],
  },
  {
    slug: "bufandas",
    nombre: "Bufandas",
    bajada: "Tejidas enteras, con la caída y el largo que tú elijas.",
    orden: 2,
    // Pendiente del Drive: bufanda crema con bandas (2 tomas + 1 detalle) y bufanda roja (2 tomas).
    obras: [],
  },
  {
    slug: "correas",
    nombre: "Correas",
    bajada: "Correas y cordones tejidos, también por encargo.",
    orden: 3,
    // Pendiente del Drive: las correas de colores y la correa montada en el telar.
    // Los cordones porta-credencial hay que REFOTOGRAFIARLOS (los actuales están sobre
    // un escritorio de oficina) y pedirle autorización a la clienta antes de publicarlos.
    obras: [],
  },
];

/** Solo lo que se puede mostrar hoy, en orden de familia. */
export const obrasPublicables: Obra[] = familiasEncargo
  .slice()
  .sort((a, b) => a.orden - b.orden)
  .flatMap((f) => f.obras.filter((o) => o.publicable));
