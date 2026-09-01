/**
 * Los cinco pasos del encargo, en la voz de Katy.
 *
 * Viven aca y no dentro de un componente porque los cuentan DOS lugares: la seccion
 * "El proceso" de la portada y la pagina /a-pedido. Duplicar el texto garantiza que
 * un dia digan cosas distintas y nadie se de cuenta.
 */

export type PasoEncargo = { n: string; titulo: string; texto: string };

export const pasosEncargo: PasoEncargo[] = [
  {
    n: "01",
    titulo: "Nos juntamos",
    texto:
      "Antes de tejer nada conversamos: para qué la quieres, cómo la usas, qué te queda bien. Ahí te tomo las medidas.",
  },
  {
    n: "02",
    titulo: "Traes tus referencias",
    texto:
      "Fotos de lo que te gusta. Podemos tomar el cuello de una, el largo de otra y el diseño de una tercera. No tiene que existir en ninguna parte todavía.",
  },
  {
    n: "03",
    titulo: "Eliges el material tocándolo",
    texto:
      "Te muestro muestras de lanas y texturas. La pieza se define con el material en la mano, no mirando una pantalla.",
  },
  {
    n: "04",
    titulo: "Recién ahí hay precio y plazo",
    texto:
      "Con la pieza ya definida te digo cuánto vale y cuánto se demora. Si estamos de acuerdo, abonas el 50% y tu pieza entra al telar.",
  },
  {
    n: "05",
    titulo: "Tejo tu pieza y te la entrego",
    texto: "El otro 50% se paga al final.",
  },
];
