import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import FeaturedCourses from "@/components/sections/featured-courses";
import AboutMini from "@/components/sections/about-mini";
import ObrasCarrusel from "@/components/sections/obras-carrusel";
import { obrasPublicables } from "@/lib/data/obras";
import Resenas from "@/components/sections/resenas";
import DosPuertas from "@/components/sections/dos-puertas";
import FaqSection from "@/components/sections/faq-section";
import NewsletterForm from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Casa Taller Kafkun · Cursos de telar online en Chile",
  description:
    "Aprende telar mapuche desde cero y a tu ritmo, con Katy: tejedora autodidacta que enseña desde 2015, con todos los tips y sin mezquindades.",
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
      {/* Orden del embudo, reordenado el 8-sep-2026 con Gabriel.
          Su frase: "tiene que ser como un embudo de nutricion de info mientras
          scrolleo, para que cuando llegue al momento de pedir ya no tenga dudas".

          Eso cambia DONDE va la bifurcacion. Antes "las dos puertas" estaba en la
          posicion 4, a media pagina: se le pedia elegir camino a alguien que todavia
          no sabia quien es Katy, que hace ni si funciona. Ahora baja al final, con
          toda la informacion ya entregada. La pregunta se hace cuando ya no hay dudas.

          El orden queda: quien es -> que hace -> que ensena -> quien lo dice ->
          que dudas quedan -> ELIGE. Y recien despues el correo, que es lo que se
          pide a quien todavia no esta listo para decidir. */}
      <Hero />
      <AboutMini />
      <ObrasCarrusel
        obras={obrasPublicables}
        titulo="No tejo un chaleco típico. Tejo el que tú quieres."
        bajada="Tus medidas, la forma y el diseño conversados, y la lana elegida después de tocarla."
      />
      <FeaturedCourses />
      <Resenas />
      <FaqSection />
      {/* Aca iba tambien FinalCta ("Dos maneras de empezar"), que decia EXACTAMENTE
          lo mismo que DosPuertas: encargar vs aprender, dos botones, con veinte lineas
          de distancia. Lo cazo Gabriel. Se elimina el duplicado; DosPuertas se queda
          porque tiene las cajas marcadas y los dos botones con contorno. */}
      <DosPuertas />

      {/* El correo va al FINAL del todo, despues del cierre: es el premio de consuelo
          para quien bajo entera la pagina y aun asi no se decidio. Ponerlo antes le
          ofrece una salida barata a alguien que estaba a punto de encargar. */}
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
