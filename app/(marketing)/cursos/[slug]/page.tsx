import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import RanuraVideo from "@/components/ranura-video";
import Figura from "@/components/figura";
import { pendiente } from "@/lib/media";
import Link from "next/link";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { seedCourses, faqItems } from "@/lib/data/clases";
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
      <section className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {levelLabel[course.level]}
            </span>
            <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3rem]">
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
            {/* Respuesta de Gabriel (9-sep-2026): se paga una vez y queda tuyo para
                siempre. No es suscripcion ni acceso por tiempo limitado, y decirlo
                completo quita la duda que frena una inscripcion. */}
            <p className="mt-3 max-w-[46ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
              Pago único: lo compras una vez y queda tuyo para siempre. Online y
              grabado, lo ves cuando puedas.
            </p>
          </div>

          {/* Un curso GRABADO se vende mostrando el video, no una foto fija: lo
              primero que alguien quiere saber es como ensena Katy. Hoy no hay video
              ni Mux configurado, asi que va la ranura del tamano exacto. */}
          <div className="flex flex-col justify-center gap-4">
            <RanuraVideo
              titulo={course.title}
              nota="Un adelanto de la primera clase, para que veas cómo enseña Katy antes de decidir."
            />
            <div className="relative aspect-[3/2] overflow-hidden rounded-[2px]">
              <Image
                src={course.thumbnail_url}
                alt={`Alumnas en un taller de Casa Taller Kafkún`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      {learns.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-[1.75rem] font-light tracking-[-0.015em] text-foreground md:text-[2.25rem]">
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

      {/* RESULTADOS. Lo pidio Gabriel: "resultados por ejemplo de lo que voy a ser
          capaz de hacer". Es lo que mas convence en un curso — no lo que el curso
          contiene, sino lo que la persona va a poder hacer despues.

          Las cuatro ranuras estan vacias A PROPOSITO y no se llenan con fotos de las
          obras de Katy: eso seria trampa. Lo que va aqui son trabajos DE ALUMNAS,
          hechos en este taller. Katy los tiene que juntar, y ademas necesita la
          autorizacion de cada una antes de publicarlos.

          Mientras tanto se ve el lienzo con la urdimbre, del tamano exacto: la seccion
          se ve terminada y el dia que lleguen las fotos no hay salto de layout. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Resultados
            </p>
            <h2 className="mt-4 text-balance font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-foreground md:text-[2.25rem]">
              Lo que vas a poder tejer al terminar
            </h2>
            <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              Piezas hechas por alumnas de este mismo taller, no por Katy.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              "Primera pieza en técnica llano",
              "Cinta con diseño propio",
              "Pieza con cambio de color",
              "Trabajo terminado con flecos",
            ].map((pie) => (
              <li key={pie}>
                <Figura
                  media={pendiente("vertical", `Trabajo de alumna: ${pie}`)}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {pie}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Includes */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-[1.75rem] font-light tracking-[-0.015em] text-foreground md:text-[2.25rem]">
            Este curso incluye
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              `${formatDuration(course.duration_minutes)} de video bajo demanda`,
              `${course.lessons_count} lecciones en video`,
              "Lo ves desde cualquier dispositivo",
              "Avanzas a tu ritmo, sin fechas límite",
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
        <h2 className="font-heading text-[1.75rem] font-light tracking-[-0.015em] text-foreground md:text-[2.25rem]">
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
            Pago único · Empiezas cuando quieras
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
