import type { Metadata } from "next";
import PedidoForm from "@/components/pedido-form";
import { familiasEncargo } from "@/lib/data/obras";

export const metadata: Metadata = {
  title: "Hacer mi pedido · Casa Taller Kafkun",
  description:
    "Encarga una prenda tejida a telar mapuche. Conversamos por videollamada, vemos medidas y materiales, y de ahí sale el precio.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contacto`,
  },
};

/**
 * El pedido de encargo. Es la única vía comercial del sitio: no hay tienda, no hay
 * precio publicado y no hay pago. Todo termina en una videollamada con Katy.
 */

const PASOS = [
  "Entiendo bien qué quieres, vemos las medidas y te asesoro completo.",
  "Si tienes fotos de referencia, las revisamos juntas.",
  "Definimos tipo de lana, materiales y colores.",
  "Recién ahí te digo el precio y el plazo. Si te parece, abonas el 50%.",
];

type Props = { searchParams: Promise<{ ref?: string }> };

export default async function ContactoPage({ searchParams }: Props) {
  const { ref = "" } = await searchParams;

  // Si llegó desde una obra concreta ("quiero uno así"), se le nombra. Si el slug no
  // existe se ignora en silencio: la URL la escribe cualquiera.
  const obra = familiasEncargo
    .flatMap((f) => f.obras)
    .find((o) => o.slug === ref);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Hacer mi pedido
          </p>
          <h1 className="mt-4 text-balance font-heading text-[2.5rem] font-light leading-[1.02] tracking-[-0.022em] text-foreground md:text-[3.75rem]">
            Cuéntame qué quieres que teja
          </h1>
          <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
            Déjame tus datos y elige tu hora. Nos juntamos por videollamada, te asesoro
            completo y de ahí sale el precio.
          </p>

          {obra && (
            <p className="mt-6 border-l-2 border-primary pl-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Vienes desde <span className="text-foreground">{obra.nombre}</span>. Lo
              anoto para llegar a la reunión sabiendo qué te gustó.
            </p>
          )}

          <div className="mt-12">
            <PedidoForm refObra={obra ? obra.slug : ""} />
          </div>
        </div>

        <aside>
          <div className="textura-telar relative overflow-hidden bg-foreground px-9 py-10">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-background/60">
              La reunión
            </p>
            <dl className="mt-6 flex flex-col gap-5">
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
            <p className="mt-6 text-[0.875rem] leading-relaxed text-background/70">
              No tienes que moverte de tu casa: conversamos por videollamada y te asesoro
              igual que si estuvieras en el taller.
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-7">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Qué pasa en la reunión
            </p>
            <ol className="mt-5 flex flex-col gap-4.5">
              {PASOS.map((paso, i) => (
                <li key={paso} className="flex gap-4">
                  <span
                    className={`w-6 shrink-0 font-heading text-[0.9375rem] ${
                      i === PASOS.length - 1 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {paso}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 border-t border-border pt-7">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              O escríbeme directo
            </p>
            <p className="mt-3.5 text-base leading-[1.7]">
              <a
                href="mailto:kafkuntelares@gmail.com"
                className="hilo font-medium text-foreground"
              >
                kafkuntelares@gmail.com
              </a>
              <br />
              <a
                href="https://instagram.com/casataller_kafkun"
                target="_blank"
                rel="noopener noreferrer"
                className="hilo text-muted-foreground"
              >
                @casataller_kafkun
              </a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
