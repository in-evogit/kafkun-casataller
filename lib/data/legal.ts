/**
 * Los datos legales y las condiciones de venta, en UN solo lugar.
 *
 * Estan aca y no escritos dentro de cada pagina por dos razones:
 *
 *   1. Las tres paginas legales repiten los mismos datos. Con el RUT escrito en
 *      tres archivos, el dia que cambie queda mal en dos.
 *   2. NINGUNO de estos numeros lo decidimos nosotros. Los plazos, si hay o no
 *      retracto, y los datos de la empresa los define Katty. Aca se cambian sin
 *      tocar el texto de las paginas.
 *
 * ⚠ PENDIENTE — Katty todavia NO tiene la empresa creada (26-sep-2026). Mientras
 * `rut` y `razonSocial` sean null, las paginas identifican el taller por su nombre
 * y su correo, que es lo unico verdadero hoy. En cuanto exista la empresa, se
 * rellenan aca y aparecen solas en las tres paginas.
 *
 * ⚠ ESTO NO ES ASESORIA LEGAL. La estructura y el contenido estan escritos con lo
 * que exige la ley chilena del consumidor (19.496) y la de datos personales, pero
 * quien tiene que revisarlo antes de cobrar de verdad es un abogado. Ojo ademas con
 * la ley nueva de datos personales, que entra en vigencia por estos meses y cambia
 * las obligaciones: conviene preguntar por ella expresamente.
 */

export const EMPRESA = {
  nombre: "Casa Taller Kafkün",
  /** Quien responde legalmente. null mientras no exista la empresa. */
  razonSocial: null as string | null,
  rut: null as string | null,
  /** Direccion de atencion. null si no se atiende publico en una direccion fija. */
  direccion: null as string | null,
  comuna: null as string | null,
  email: "kafkuntelares@gmail.com",
  instagram: "https://instagram.com/casataller_kafkun",
} as const;

/** Ultima vez que se reviso el texto de las paginas legales. */
export const ACTUALIZADO = "26 de septiembre de 2026";

/**
 * Las condiciones de venta. DECISIONES DE KATTY, no nuestras.
 *
 * El encargo sin derecho a retracto es la postura que dio Gabriel el 26-sep, y
 * coincide con la excepcion que la ley reconoce para lo hecho a medida: una pieza
 * tejida con tus medidas y tu diseño no se puede revender a nadie mas.
 *
 * El curso es el caso que SI hay que decidir expresamente. En una compra por
 * internet la ley da 10 dias para retractarse salvo que el vendedor diga lo
 * contrario de forma expresa; decirlo es justamente lo que hace esta pagina.
 */
export const CONDICIONES = {
  /** Dias para retractarse de la compra de una clase. 0 = no hay retracto. */
  diasRetractoClase: 10,
  /** ¿Se puede pedir la devolución de un encargo por cambio de opinión? */
  retractoEncargo: false,
  /** Qué parte se paga al encargar, en por ciento. */
  abonoEncargoPorciento: 50,
} as const;
