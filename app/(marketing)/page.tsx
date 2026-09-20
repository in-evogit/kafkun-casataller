import type { Metadata } from "next";
import HeroScroll from "@/components/sections/hero-scroll";
import AboutMini from "@/components/sections/about-mini";
import ObrasCarrusel from "@/components/sections/obras-carrusel";
import { obrasPublicables } from "@/lib/data/obras";
import Resenas from "@/components/sections/resenas";
import DosOfertas from "@/components/sections/dos-ofertas";
import FaqSection from "@/components/sections/faq-section";
import NewsletterForm from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Casa Taller Kafkun · Cursos de telar online en Chile",
  description:
    "Aprende telar mapuche desde cero y a tu ritmo, con Katty: tejedora autodidacta que enseña desde 2015, con todos los tips y sin mezquindades.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  openGraph: {
    title: "Casa Taller Kafkun · Cursos de telar online en Chile",
    description:
      "Aprende a tejer en telar mapuche desde cero, a tu ritmo.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
      name: "Casa Taller Kafkun",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      sameAs: ["https://instagram.com/casataller_kafkun"],
    },
    {
      "@type": "WebSite",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      name: "Casa Taller Kafkun",
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ORDEN DEL EMBUDO, rehecho el 19-sep con un dato que lo cambia todo.

          Gabriel: "la gente llega del mismo Instagram, por lo que ya sabran de Katty",
          y "la idea es vender". Si ya la conocen, presentarsela otra vez antes de
          mostrarle donde comprar es hacerle perder el tiempo a alguien que venia
          decidido.

          Por eso las OFERTAS CON PRECIO van segundas, inmediatamente despues del hero,
          antes de las obras y mucho antes de la historia. Es lo mismo que hace la
          referencia que paso (bordacolores): primer boton de compra en el hero,
          precios en la tercera seccion.

          "Quien teje" baja: sigue estando, porque no todos llegan de Instagram, pero
          deja de ser el peaje que hay que pagar para llegar al precio.

          Se eliminan DosPuertas y FeaturedCourses: los dos decian lo mismo que la
          seccion de ofertas, uno sin precio y el otro con el curso repetido. */}
      <HeroScroll />
      <DosOfertas />
      <ObrasCarrusel
        obras={obrasPublicables}
        titulo="No tejo un chaleco típico. Tejo el que tú quieres."
        bajada="Tus medidas, la forma y el diseño conversados, y la lana elegida después de tocarla."
      />
      <Resenas />
      <AboutMini />
      <FaqSection />

      {/* El correo al final del todo: es para quien bajo entera la pagina y aun asi
          no se decidio. Antes ofrecia una salida barata a alguien a punto de comprar. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-[1.5rem] font-light text-foreground sm:text-[1.75rem]">
            ¿Todavía lo estás pensando?
          </h2>
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">
            Déjame tu correo y te aviso cuando abra cupos o publique algo nuevo.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
