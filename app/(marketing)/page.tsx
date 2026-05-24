import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import CredibilityBar from "@/components/sections/credibility-bar";
import ForWho from "@/components/sections/for-who";
import FeaturedCourses from "@/components/sections/featured-courses";
import HowItWorks from "@/components/sections/how-it-works";
import AboutMini from "@/components/sections/about-mini";
import Testimonials from "@/components/sections/testimonials";
import FaqSection from "@/components/sections/faq-section";
import FinalCta from "@/components/sections/final-cta";

export const metadata: Metadata = {
  title: "Casa Taller Kafkun · Cursos de telar online en Chile",
  description:
    "Aprende a tejer en telar desde cero, a tu ritmo. Cursos online con acceso de por vida, soporte personalizado y garantía 7 días. Más de 200 alumnas tejiendo.",
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
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}
