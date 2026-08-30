/**
 * Resenas de alumnas y clientas.
 *
 * VACIO A PROPOSITO. Gabriel tiene las resenas reales y las va a pasar; hasta entonces
 * el carrusel no se dibuja y la portada no muestra un hueco. Nunca inventar una: un
 * testimonio falso en un sitio que vende es de las pocas cosas que hacen dano de verdad.
 *
 * Para cargarlas, agregar objetos a este arreglo y listo. La seccion aparece sola.
 */

export type Resena = {
  /** Nombre tal como la persona autoriza que se publique. */
  nombre: string;
  /** Ciudad o comuna. Opcional: da credibilidad pero no todas la dan. */
  lugar?: string;
  /** Que le compro o que curso tomo. Opcional. */
  contexto?: string;
  /** El texto, en sus palabras. No corregir el tono. */
  texto: string;
};

export const resenas: Resena[] = [];

/**
 * Nombre viejo, para no romper lo que todavia lo importa.
 * @deprecated usar `resenas`
 */
export const testimonials: {
  name: string;
  city: string;
  course: string;
  avatar: string;
  quote: string;
}[] = [];
