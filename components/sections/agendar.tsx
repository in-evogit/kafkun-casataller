import Link from "next/link";

/**
 * El bloque comercial de la portada.
 *
 * Es el único momento oscuro después del hero, y va a propósito justo antes de las
 * clases: quien llegó hasta acá ya vio las obras y el proceso, y lo único que le
 * falta saber es cuándo puede conversar con Katy.
 *
 * Las condiciones van escritas y completas — día, hora y que es por videollamada —
 * porque son la primera objeción real: "¿tengo que ir al taller?".
 */
export default function Agendar() {
  return (
    <section className="textura-telar relative overflow-hidden bg-foreground">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-background/60">
            La reunión
          </p>
          <h2 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-background md:text-[3.25rem]">
            Conversemos tu pedido
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-background/70">
            Eliges tu hora y te llega el link de la videollamada al correo, ya
            agendado. De esa conversación sale el precio: antes de eso no hay forma
            de dártelo.
          </p>
        </div>

        <div className="border-t border-background/20 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <dl className="flex flex-col gap-5">
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-background/50">
                Dónde
              </dt>
              <dd className="mt-1.5 font-heading text-[1.625rem] font-light text-background">
                Por videollamada
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-background/50">
                Días
              </dt>
              <dd className="mt-1.5 font-heading text-[1.625rem] font-light text-background">
                Lunes a viernes
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-background/50">
                Horario
              </dt>
              <dd className="mt-1.5 font-heading text-[1.625rem] font-light text-background">
                Después de las 18:00
              </dd>
            </div>
          </dl>
          <Link
            href="/contacto"
            className="hilo hilo-boton relative mt-9 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          >
            Hacer mi pedido
          </Link>
        </div>
      </div>
    </section>
  );
}
