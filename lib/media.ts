/**
 * Sistema de medios de Casa Taller Kafkún.
 *
 * Las fotos que hay hoy en public/images/ son DE RELLENO. Las definitivas las consigue
 * Katy después. Por eso ningún componente escribe una ruta de imagen adentro: recibe un
 * `Media` y lo dibuja. Cuando lleguen las fotos buenas se cambia el dato, no el componente.
 *
 * Regla de proporción, decidida con Gabriel:
 *   VERTICAL   → obras, piezas, productos, trabajos de alumnas, detalle de proceso.
 *                Es como se fotografía una prenda colgada o una pieza en el telar.
 *   HORIZONTAL → hero, portadas de curso y de bloque, fotos de Katy en ambiente.
 *                Es como se fotografía un espacio o una persona trabajando.
 */

export type Proporcion = "vertical" | "vertical-alta" | "horizontal" | "panoramica";

/** Clases de aspect-ratio de Tailwind por proporción. Fuente única. */
export const CLASE_PROPORCION: Record<Proporcion, string> = {
  vertical: "aspect-[3/4]", // obras y productos
  "vertical-alta": "aspect-[9/16]", // retrato de cuerpo entero, video de saludo
  horizontal: "aspect-[3/2]", // portadas de curso y bloque
  panoramica: "aspect-[16/9]", // hero
};

/** `sizes` de next/image por proporción, para no servir 1280px a un tile de 320px. */
export const SIZES_PROPORCION: Record<Proporcion, string> = {
  vertical: "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px",
  "vertical-alta": "(max-width: 1024px) 100vw, 50vw",
  horizontal: "(max-width: 1024px) 100vw, 50vw",
  panoramica: "100vw",
};

export type Media = {
  src: string;
  /** Descripción para lectores de pantalla. Vacío solo si la imagen es decorativa. */
  alt: string;
  proporcion: Proporcion;
  /**
   * Recorte explícito. `object-cover` centrado corta caras y nadie lo revisa hasta que ya
   * está publicado, así que se declara por foto cuando el centro no es lo importante.
   */
  posicion?: string;
};

/**
 * Estado sin foto. Se usa cuando todavía no existe el material definitivo.
 * `nota` es para nosotros, no se muestra al público.
 */
export type MediaPendiente = {
  pendiente: true;
  proporcion: Proporcion;
  nota: string;
};

export type Ranura = Media | MediaPendiente;

export function estaPendiente(m: Ranura): m is MediaPendiente {
  return "pendiente" in m;
}

/** Atajo para declarar una ranura vacía sin repetir el objeto entero. */
export function pendiente(proporcion: Proporcion, nota: string): MediaPendiente {
  return { pendiente: true, proporcion, nota };
}
