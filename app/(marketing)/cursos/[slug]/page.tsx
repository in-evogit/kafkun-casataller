import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import { seedCourses, faqItems } from "@/lib/data/seed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = { params: Promise<{ slug: string }> };

function getCourse(slug: string) {
  return seedCourses.find((c) => c.slug === slug) ?? null;
}

export function generateStaticParams() {
  return seedCourses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.title} · Casa Taller Kafkun`,
    description: course.seo_description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/cursos/${slug}`,
    },
    openGraph: {
      title: course.title,
      description: course.seo_description,
      images: [{ url: course.thumbnail_url }],
      type: "website",
    },
  };
}

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

const levelLabel = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const whatYouLearn: Record<string, string[]> = {
  "tu-primer-telar": [
    "Armar y tensar un telar de peine desde cero",
    "Técnicas básicas de urdimbre y trama",
    "Leer e interpretar esquemas de tejido",
    "Rematar y finalizar tu pieza correctamente",
    "Cómo elegir y combinar lanas",
    "Diseñar patrones geométricos simples",
  ],
  "telar-mapuche": [
    "Historia y significado del telar mapuche (witral)",
    "Técnica de ñimin para diseños tradicionales",
    "Preparación y tintura natural de lanas",
    "Motivos ancestrales: significado e interpretación",
    "Construcción de tu propio witral",
    "Protocolos de respeto en el oficio textil",
  ],
  "diseno-propio": [
    "Teoría del color aplicada al textil",
    "Composición y ritmo en el tejido",
    "Desarrollar un lenguaje visual propio",
    "Técnicas mixtas: combinación de fibras y texturas",
    "Documentación y portafolio textil",
    "De la idea al tapiz: proceso creativo completo",
  ],
};

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const learns = whatYouLearn[slug] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.seo_description,
    provider: {
      "@type": "Organization",
      name: "Casa Taller Kafkun",
      sameAs: process.env.NEXT_PUBLIC_SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: course.price_clp,
      priceCurrency: "CLP",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {levelLabel[course.level]}
            </span>
            <h1 className="mt-4 font-heading text-4xl font-semibold text-foreground md:text-5xl">
              {course.title}
            </h1>
            <p className="mt-2 font-heading text-xl text-muted-foreground">
              {course.subtitle}
            </p>
            <p className="mt-4 text-muted-foreground">{course.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(course.duration_minutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.lessons_count} lecciones
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Garantía 7 días
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="font-heading text-3xl font-semibold text-foreground">
                {formatPrice(course.price_clp)}
              </span>
              <Link
                href={`/checkout?curso=${course.slug}`}
                className="rounded-md bg-primary px-8 py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-accent"
              >
                Inscribirme ahora
              </Link>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Acceso inmediato · Acceso de por vida · Sin suscripción
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={course.thumbnail_url}
              alt={`Portada del curso ${course.title}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      {learns.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Qué vas a aprender
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {learns.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Includes */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Este curso incluye
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              `${formatDuration(course.duration_minutes)} de video bajo demanda`,
              `${course.lessons_count} lecciones en video HD`,
              "Acceso de por vida desde cualquier dispositivo",
              "Soporte por WhatsApp por 30 días",
              "Garantía de devolución de 7 días",
              "Certificado digital al completar",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Preguntas frecuentes
        </h2>
        <Accordion className="mt-8">
          {faqItems.slice(0, 4).map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-foreground">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold text-primary-foreground md:text-3xl">
            ¿Lista para empezar?
          </h2>
          <p className="mt-2 text-primary-foreground/80">
            Acceso inmediato · Garantía 7 días · De por vida
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <span className="font-heading text-2xl font-semibold text-primary-foreground">
              {formatPrice(course.price_clp)}
            </span>
            <Link
              href={`/checkout?curso=${course.slug}`}
              className="rounded-md bg-primary-foreground px-8 py-3 font-semibold text-primary transition-opacity hover:opacity-90"
            >
              Inscribirme ahora →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
