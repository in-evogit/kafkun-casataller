import type { Metadata } from "next";
import CourseCard from "@/components/course-card";
import { seedCourses } from "@/lib/data/clases";

export const metadata: Metadata = {
  title: "Todos los cursos · Casa Taller Kafkun",
  description:
    "Explora los cursos de telar de Casa Taller Kafkun, desde principiante hasta avanzado, para aprender a tu ritmo.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/cursos`,
  },
};

const levelOrder = { principiante: 0, intermedio: 1, avanzado: 2 } as const;

export default function CursosPage() {
  const sorted = [...seedCourses].sort(
    (a, b) => levelOrder[a.level] - levelOrder[b.level]
  );

  return (
    <main>
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Cursos de telar
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Aprender a tejer es para cualquiera. Elige el nivel que te llama y
            empieza hoy, a tu propio ritmo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Antes esto era una fila de simbolos con etiquetas sueltas —"A tu ritmo",
            "Pago unico", "Telar mapuche"— que decia lo obvio y no respondia nada.
            Ahora responde las dudas que de verdad frenan una inscripcion.

            LAS RESPUESTAS SON DE GABRIEL (9-sep-2026), no inventadas:
            - "Pago unico" = pagas el curso y lo tienes para siempre. No es suscripcion
              ni acceso por tiempo limitado.
            - El curso es ONLINE Y GRABADO. Katy tambien hace talleres presenciales,
              pero este no lo es, y hay que decirlo aca antes de que alguien pague
              creyendo que va a ir a su taller.

            Las preguntas las escribi yo como primera version; Gabriel las va a revisar
            con Katy. Ninguna promete algo que no este confirmado. */}
        <dl className="mt-16 divide-y divide-border border-y border-border">
          {[
            {
              q: "¿Es online o presencial?",
              a: "Este curso es online y grabado: lo ves cuando puedas, las veces que quieras. Katy también hace talleres presenciales, pero se avisan aparte.",
            },
            {
              q: "¿Por cuánto tiempo lo tengo?",
              a: "Para siempre. Se paga una vez y queda tuyo — no es suscripción ni tiene fecha de vencimiento.",
            },
            {
              q: "¿Necesito saber tejer?",
              a: "No. El taller inicial parte desde cero: qué es el telar, cómo se arma la urdimbre y cómo urdir con la técnica de llano.",
            },
            {
              q: "¿Necesito comprar un telar antes?",
              a: "Escríbele a Katy antes de comprar nada. Ella te dice qué necesitas de verdad según lo que quieras tejer.",
            },
          ].map((item) => (
            <div key={item.q} className="py-6">
              <dt className="font-heading text-[1.0625rem] text-foreground">{item.q}</dt>
              <dd className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
