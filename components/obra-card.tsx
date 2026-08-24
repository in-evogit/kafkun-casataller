import Link from "next/link";
import Figura from "@/components/figura";
import { type Obra } from "@/lib/data/obras";

/**
 * Ficha de obra entregada.
 *
 * La foto ES la tarjeta: sin borde, sin sombra, sin radio. Ese trío es la firma exacta de
 * plantilla, y acá el protagonista es el tejido.
 *
 * No lleva "agregar al carrito" ni precio a propósito: el encargo se define conversando, así que
 * el único destino posible es empezar un encargo. El `?ref` deja anotado de qué obra viene.
 */
export default function ObraCard({ obra }: { obra: Obra }) {
  return (
    <article className="group">
      <div className="relative">
        <Figura media={obra.media} />
        {/* La segunda toma se revela encima al pasar el cursor. En táctil no existe hover,
            así que simplemente nunca aparece y la primera foto se basta sola. */}
        {obra.mediaHover && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[var(--dur-foto)] motion-safe:group-hover:opacity-100">
            <Figura media={obra.mediaHover} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-[1.0625rem] text-foreground">{obra.nombre}</h3>
          <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Obra entregada
          </p>
          {obra.materialYTecnica && (
            <p className="mt-1 text-[0.8125rem] text-muted-foreground">
              {obra.materialYTecnica}
            </p>
          )}
        </div>
        <Link
          href={`/contacto?ref=${obra.slug}`}
          className="hilo mt-0.5 shrink-0 text-[0.8125rem] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Quiero uno así
        </Link>
      </div>
    </article>
  );
}
