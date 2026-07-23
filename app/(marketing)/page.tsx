import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import CredibilityBar from "@/components/sections/credibility-bar";
import ForWho from "@/components/sections/for-who";
import FeaturedCourses from "@/components/sections/featured-courses";
import HowItWorks from "@/components/sections/how-it-works";
import AboutMini from "@/components/sections/about-mini";
import ObrasGallery from "@/components/sections/obras-gallery";
import Testimonials from "@/components/sections/testimonials";
import FaqSection from "@/components/sections/faq-section";
import FinalCta from "@/components/sections/final-cta";
import NewsletterForm from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Casa Taller Kafkun · Cursos de telar online en Chile",
  description:
    "Aprende telar mapuche desde cero, a tu ritmo. Cursos online con acceso de por vida, soporte personalizado y garantía 7 días. Con Katy, tejedora autodidacta desde 2015.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  openGraph: {
    title: "Casa Taller Kafkun · Cursos de telar online en Chile",
    description:
      "Aprende a tejer en telar desde cero. Cursos online con acceso de por vida.",
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
      <Hero />
      <CredibilityBar />
      <ForWho />
      <FeaturedCourses />
      <HowItWorks />
      <AboutMini />
      <ObrasGallery />
      <Testimonials />
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
