import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import FeaturedCourses from "@/components/sections/featured-courses";
import AboutMini from "@/components/sections/about-mini";
import ObrasGallery from "@/components/sections/obras-gallery";
import Resenas from "@/components/sections/resenas";
import DosPuertas from "@/components/sections/dos-puertas";
import FaqSection from "@/components/sections/faq-section";
import FinalCta from "@/components/sections/final-cta";
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
      {/* Orden del embudo.
          Un sitio de marca personal no se ordena como una tienda: acá lo que se compra
          es el criterio de QUIEN teje, no un catálogo. Por eso "Quién teje" subió de la
          posición 6 a la 3 — la confianza en la persona va antes que el interés en el
          producto, y la historia de Katy es el activo más fuerte que tiene el sitio.

          Después la prueba de trabajo, y recién entonces la bifurcación explícita: hasta
          ahora las dos vías convivían sin que nada dijera "elige tu camino", y quien no
          se reconocía en la primera sección seguía bajando sin saber si esto era para ella.

          El proceso de cinco pasos salió de acá: vive completo en /a-pedido, que es donde
          hace falta. Repetirlo en la portada la alargaba haciendo el trabajo de la subpágina. */}
      <Hero />
      <AboutMini />
      <ObrasGallery />
      <DosPuertas />
      <FeaturedCourses />
      <Resenas />
      <FaqSection />
      <section className="bg-secondary">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Novedades y descuentos exclusivos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Suscríbete y sé la primera en enterarte de nuevos cursos, materiales y ofertas.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
