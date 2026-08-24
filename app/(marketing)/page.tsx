import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import CredibilityBar from "@/components/sections/credibility-bar";
import FeaturedCourses from "@/components/sections/featured-courses";
import HowItWorks from "@/components/sections/how-it-works";
import Agendar from "@/components/sections/agendar";
import AboutMini from "@/components/sections/about-mini";
import ObrasGallery from "@/components/sections/obras-gallery";
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
      {/* Orden del embudo: quién es ella → qué hace → cómo se pide → cuándo se
          conversa → qué enseña. Quién teje sube al segundo lugar porque el sitio
          vende marca personal: la persona no puede aparecer en el sexto scroll.
          Las clases van al final porque todavía no existen; lo que puede
          convertir hoy es el encargo. */}
      <Hero />
      <CredibilityBar />
      <AboutMini />
      <ObrasGallery />
      <HowItWorks />
      <Agendar />
      <FeaturedCourses />

      {/* Lista de espera. Es el activo del pre-lanzamiento: esta es la gente a la
          que se le puede vender el día uno. Va pegada a las clases, no suelta al
          final, porque sin el temario arriba el correo no se justifica. */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground">
            Avísame cuando abra el taller
          </h2>
          <p className="mt-4 text-muted-foreground">
            Te escribo una sola vez, el día que esté disponible. Nada de correos
            todas las semanas.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
