/**
 * Resenas reales de alumnas de Casa Taller Kafkun.
 *
 * Origen: formulario de Google respondido entre el 29-jul y el 7-ago-2026.
 * Las 8 que estan aca cumplen las TRES condiciones, y ninguna se publica sin las tres:
 *   1. Calificaron 5 de 5.
 *   2. Marcaron "Si, pueden publicarla con mi nombre y apellido".
 *   3. Son personas reales, no pruebas del formulario.
 *
 * QUEDARON FUERA, y conviene que se sepa por que:
 *   - La respuesta de "gabriel rivera" (29-jul): es la prueba que hizo Gabriel al armar
 *     el formulario. Publicarla seria inventar un testimonio.
 *   - Vivian Aedo: califico 4 y ademas pidio que no apareciera su nombre.
 *
 * EDICION: solo ortografia evidente, nunca el tono ni el contenido.
 *   "chaleto" -> "chaleco", "Casa Talker" -> "Casa Taller", "Katti"/"Kathy" -> "Katy"
 *   (el sitio la nombra Katy en todas partes; dejar tres grafias distintas confunde),
 *   y tildes que faltaban. Todo lo demas es textual.
 *
 * El texto de cada una sale de la pregunta que de verdad recogio la experiencia. OJO:
 * en el formulario las columnas estan CRUZADAS — "Cuentanos tu experiencia" recogio en
 * realidad "como nos conociste" ("por instagram", "redes sociales"). Hay que arreglar
 * ese formulario antes de pedir mas resenas.
 * UNA PERSONA, UNA RESENA. Elizabeth Muñoz habia quedado dos veces porque sus dos
 * textos salen de la MISMA respuesta (la columna de experiencia y la de recomendacion
 * de una sola fila): partir una resena en dos es inflar la prueba social. Se dejo la
 * mas fuerte.
 *
 * "Consu S." y "Consu S.E." eran la misma persona en dos respuestas (crochet y Retiro
 * Tejeril). Gabriel lo confirmo el 31-ago y se unificaron en una sola entrada que nombra
 * los dos talleres.
 */

export type Resena = {
  nombre: string;
  /** El taller que hizo. Da contexto y demuestra que Katy ensena mas que telar. */
  taller: string;
  /** Sus palabras. */
  texto: string;
};

export const resenas: Resena[] = [
  {
    nombre: "Elizabeth Muñoz",
    taller: "Retiro Tejeril",
    texto:
      "Atrévete a crear con tus propias manos. En Casa Taller Kafkün descubrirás que tejer en telar, palillo o crochet también es conectar contigo, aprender y transformar cada hebra en una obra única.",
  },
  {
    nombre: "Consu S.",
    // Hizo los dos, en fechas distintas. Se nombran ambos porque que una alumna VUELVA
    // es de las senales mas fuertes que hay, y asi ademas se ve que Katy no ensena
    // solo telar. La cita es textual de una sola de las dos respuestas: juntar dos
    // respuestas en una frase seria fabricar algo que ella nunca escribio asi.
    taller: "Taller de crochet · Retiro Tejeril",
    texto:
      "Me encantó, aprendí a hacer un chaleco top down a la medida, con explicaciones claras y precisas, y la profe tenía mucha paciencia y amabilidad con todas.",
  },
  {
    nombre: "Javier Vargas",
    taller: "Taller de telar, técnicas básicas",
    texto: "Magnífica experiencia. Los talleres son para todos los niveles.",
  },
  {
    nombre: "María Raquel Salas",
    taller: "Taller de telar, técnicas básicas",
    texto: "Me sentí muy bien. Son clases entretenidas y personalizadas.",
  },
  {
    nombre: "Janinne Gallardo",
    taller: "Taller de telar, técnicas básicas",
    texto:
      "Yo buscaba algo que me enseñara desde cero. Transparencia en la transmisión del conocimiento.",
  },
  {
    nombre: "Verónica Salgado",
    taller: "Taller de telar, técnicas básicas",
    texto: "Katy es muy profesional y clara para enseñar.",
  },
];
