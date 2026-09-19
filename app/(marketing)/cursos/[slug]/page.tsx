import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import RanuraVideo from "@/components/ranura-video";
import TarjetaPrecio from "@/components/ui/tarjeta-precio";
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
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="inline-block rounded-full border border-tinta-foreground/40 px-3 py-1 text-xs font-medium text-foreground/80">
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
                className="inline-flex h-12 items-center justify-center rounded-[2px] border border-burdeos bg-burdeos px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[background-color,border-color,transform] duration-[var(--dur-color)] hover:border-primary hover:bg-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Quiero este taller
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
              primero que alguien quiere saber es como ensena Katty. Hoy no hay video
              ni Mux configurado, asi que va la ranura del tamano exacto. */}
          {/* SOLO EL VIDEO. La foto de portada se fue: en la lista de cursos ya se
              vio, y repetirla aca no agrega nada. Lo que alguien quiere al entrar a
              un curso grabado es ver COMO ensena Katty, y eso solo lo dice el video. */}
          <div className="flex flex-col justify-center">
            <RanuraVideo
              titulo={course.title}
              nota="Un adelanto de la primera clase, para que veas cómo enseña Katty antes de decidir."
            />
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
          obras de Katty: eso seria trampa. Lo que va aqui son trabajos DE ALUMNAS,
          hechos en este taller. Katty los tiene que juntar, y ademas necesita la
          autorizacion de cada una antes de publicarlos.

          Mientras tanto se ve el lienzo con la urdimbre, del tamano exacto: la seccion
          se ve terminada y el dia que lleguen las fotos no hay salto de layout. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-burdeos">
              Resultados
            </p>
            <h2 className="mt-4 text-balance font-heading text-[1.75rem] font-light leading-tight tracking-[-0.015em] text-foreground md:text-[2.25rem]">
              De no saber nada, a esto
            </h2>
            <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
              El camino completo, paso a paso. Cada pieza es de una alumna de este mismo taller, no de Katty.
            </p>
          </div>

          {/* LINEA DE TIEMPO, no una reja de cuatro cuadros. Gabriel: "hagamos un
              tipo linea de tiempo bien bonita para que el que va a comprar quede como
              wow".

              Y el cambio no es solo visual: una reja dice "estas cuatro cosas", una
              linea dice "primero esto, despues esto, y al final vas a poder ESTO".
              Para alguien que esta decidiendo si puede aprender, ver el CAMINO es lo
              que convence — no ver el catalogo de resultados. La ultima parada lleva
              la pieza mas ambiciosa a proposito: es la que se compra.

              Las cuatro ranuras van vacias esperando trabajos DE ALUMNAS. No se
              llenan con obras de Katty: eso seria vender su nivel como si fuera el
              que se alcanza en el taller. */}
          <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            {[
              { n: "01", pie: "Tu primera pieza en técnica llano", texto: "A las pocas clases ya tienes algo tejido con tus manos." },
              { n: "02", pie: "Una cinta con tu propio diseño", texto: "Eliges los colores y el patrón, y lo montas sola." },
              { n: "03", pie: "Cambios de color sin cortar el hilo", texto: "Acá se nota el salto: la pieza deja de verse de principiante." },
              { n: "04", pie: "Una pieza terminada, con flecos", texto: "Lista para usar o para regalar. Esto es lo que te llevas." },
            ].map((paso, i) => (
              <li key={paso.n} className="relative">
                {/* El hilo que une una parada con la siguiente. En la última no va,
                    porque no hay a dónde seguir. */}
                {i < 3 && (
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-[calc(100%+0.75rem)] hidden h-10 w-px bg-border md:left-0 md:right-[-1.5rem] md:top-[7px] md:block md:h-px md:w-auto"
                  />
                )}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-[15px] w-[15px] rounded-full border-2 border-burdeos bg-background md:top-0"
                />
                <div className="pl-8 md:pl-0 md:pt-8">
                  <span className="block font-heading text-[1.5rem] font-light leading-none text-burdeos">
                    {paso.n}
                  </span>
                  <div className="mt-4">
                    <Figura
                      media={pendiente("vertical", `Trabajo de alumna: ${paso.pie}`)}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <h3 className="mt-4 max-w-[26ch] font-heading text-[1.0625rem] leading-snug text-foreground">
                    {paso.pie}
                  </h3>
                  <p className="mt-2 max-w-[32ch] text-[0.875rem] leading-relaxed text-muted-foreground">
                    {paso.texto}
                  </p>
                </div>
              </li>
            ))}
          </ol>
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
      {/* Aca iba una franja entera en rojo #C50906 a pantalla completa, que Gabriel
          encontro "super fuerte". Una banda del color mas saturado de la paleta grita
          en vez de invitar, y lo que este bloque tiene que hacer es VENDER — que es lo
          que Gabriel repite que importa. Ahora es una tarjeta que responde al cursor. */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-burdeos">
                Empezar
              </p>
              <h2 className="mt-4 text-balance font-heading text-[1.875rem] font-light leading-tight tracking-[-0.018em] text-foreground md:text-[2.5rem]">
                Lo compras una vez y queda tuyo
              </h2>
              <p className="mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                Sin suscripción, sin fecha de vencimiento y sin cupos. Lo ves cuando
                puedas, las veces que quieras, y vuelves a la clase que necesites
                cuando se te olvide un paso.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <TarjetaPrecio
                etiqueta={levelLabel[course.level]}
                precio={formatPrice(course.price_clp)}
                nota="Pago único · para siempre"
                detalle={`${course.lessons_count} clases grabadas, ${formatDuration(course.duration_minutes)} de material. Empiezas cuando quieras.`}
                cta="Quiero este taller"
                href={`/checkout?curso=${course.slug}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
