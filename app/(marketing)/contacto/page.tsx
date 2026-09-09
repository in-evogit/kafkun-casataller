import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Scissors } from "lucide-react";
import IconoInstagram from "@/components/ui/icono-instagram";
import MenuCircular from "@/components/ui/menu-circular";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbele a Katy de Casa Taller Kafkün. Dudas sobre clases, encargos o un pedido en curso.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contacto` },
};

/**
 * Contacto.
 *
 * SIN FORMULARIO a proposito, y no por falta de ganas. Un formulario necesita avisarle a
 * Katy cuando alguien escribe; sin Resend configurado, el mensaje se guardaria en la base
 * y nadie lo leeria nunca. Eso es peor que no tener formulario: la persona cree que
 * escribio y se queda esperando. Cuando Resend este, se agrega.
 *
 * Mientras tanto el correo y el Instagram funcionan de verdad, que es lo que importa.
 *
 * Los dos caminos comerciales NO viven aca: quien quiere encargar va a /a-pedido/empezar
 * y quien quiere aprender va a las clases. Esta pagina es para lo demas.
 */
const canales = [
  {
    etiqueta: "Correo",
    valor: "kafkuntelares@gmail.com",
    href: "mailto:kafkuntelares@gmail.com",
    nota: "Lo lee Katy. Suele responder en el día.",
  },
  {
    etiqueta: "Instagram",
    valor: "@casataller_kafkun",
    href: "https://instagram.com/casataller_kafkun",
    nota: "Ahí publica lo que va saliendo del telar.",
    externo: true,
  },
];

export default function ContactoPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Contacto
        </p>
        <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
          Escríbeme y conversamos
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          Cualquier duda sobre las clases, sobre un encargo, o sobre un pedido que ya está
          en camino.
        </p>

        <dl className="mt-14 space-y-10">
          {canales.map((c) => (
            <div key={c.etiqueta} className="border-l border-border pl-6 transition-colors duration-[var(--dur-color)] hover:border-primary">
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {c.etiqueta}
              </dt>
              <dd className="mt-2">
                <a
                  href={c.href}
                  {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="hilo font-heading text-[1.5rem] font-light text-foreground transition-colors duration-[var(--dur-color)] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background md:text-[1.75rem]"
                >
                  {c.valor}
                </a>
                <p className="mt-2 text-[0.9375rem] text-muted-foreground">{c.nota}</p>
              </dd>
            </div>
          ))}
        </dl>

        {/* Los mismos canales, en botones que se abren al pasar el cursor. Un boton
            circular con icono es exactamente para esto: acciones cortas y conocidas,
            donde el icono ya dice de que se trata antes de leer el nombre. */}
        <MenuCircular
          className="mt-14"
          items={[
            { titulo: "Escríbeme", icono: Mail, href: "mailto:kafkuntelares@gmail.com" },
            {
              titulo: "Instagram",
              icono: IconoInstagram,
              href: "https://instagram.com/casataller_kafkun",
              externo: true,
            },
            { titulo: "Encargar una pieza", icono: Scissors, href: "/a-pedido/empezar" },
          ]}
        />

        {/* Quien llega aca con intencion de encargar no deberia tener que escribir un
            correo para empezar: se le ofrece el camino corto. */}
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-heading text-[1.3125rem] text-foreground">
            ¿Quieres encargar una pieza?
          </h2>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
            No hace falta que me escribas primero. Cuéntame qué tienes en mente y
            agendamos una conversación.
          </p>
          <Link
            href="/a-pedido/empezar"
            className="hilo hilo-boton relative mt-6 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Empezar mi encargo
          </Link>
        </div>
      </div>
    </main>
  );
}
