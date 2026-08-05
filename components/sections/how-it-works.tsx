/**
 * El proceso del encargo, en la voz de Katy.
 *
 * Antes esta sección describía la compra de un curso ("eliges tu curso, recibes acceso") sobre
 * un bloque rojo oscuro con textura. Ahora cuenta lo que realmente pasa cuando alguien encarga
 * una pieza, que es la duda que hoy Katy responde una y otra vez por WhatsApp.
 *
 * Sin iconos y sin fotos: cinco pasos numerados y nada más. El número grande en Fraunces liviano
 * es el ritmo de la sección.
 */
const pasos = [
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

export default function HowItWorks() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            El proceso
          </p>
          <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
            De una conversación a una pieza
          </h2>
        </div>

        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pasos.map((p) => (
            <li
              key={p.n}
              className="border-l border-border pl-6 transition-colors duration-[var(--dur-color)] hover:border-primary"
            >
              <span className="block font-heading text-[2.125rem] font-light leading-none text-muted-foreground/60">
                {p.n}
              </span>
              <h3 className="mt-3 font-heading text-[1.3125rem] text-foreground">
                {p.titulo}
              </h3>
              <p className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {p.texto}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[52ch] text-[0.8125rem] text-muted-foreground">
          Una pieza a pedido se teje a mano y toma su tiempo. En la reunión te
          digo cuánto.
        </p>
      </div>
    </section>
  );
}
