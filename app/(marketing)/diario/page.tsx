import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Diario de telar · Casa Taller Kafkun",
  description:
    "Consejos, técnicas y materiales para tejer. Aprende con Katy, instructora de telar en Chile.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/diario`,
  },
};

export default function DiarioPage() {
  const posts = getAllPosts();

  return (
    <main>
      {/* Cabecera sin bloque de color. Gabriel: los encabezados de las subsecciones
          "son muy voluminosos y no aportan mucho". Este ocupaba una franja entera para
          decir dos frases. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 sm:pt-28 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Diario
            </p>
            <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
              Lo que voy aprendiendo, y te lo paso
            </h1>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Técnicas, materiales y lo que he ido descubriendo tejiendo. Gratis, sin
              tener que dejarme nada a cambio.
            </p>
          </div>
        </div>
      </section>

      {/* ENTRADAS HORIZONTALES, UNA BAJO OTRA. Gabriel: "que sean diarios horizontales
          hacia abajo, no como cuadros".

          Y tiene sentido de fondo: en una reja de tarjetas cada entrada compite con las
          de al lado y el titulo se corta a dos lineas. En una fila horizontal cada
          entrada tiene el ancho de la pagina para decir de que se trata, que es lo que
          hace falta si lo que se ofrece es informacion util y no producto. */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/diario/${post.slug}`}
                className="group grid grid-cols-1 gap-5 py-8 transition-colors duration-[var(--dur-color)] sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-8 sm:py-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="order-2 flex flex-col sm:order-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="text-primary">{post.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={post.date}>
                      {new Intl.DateTimeFormat("es-CL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(post.date))}
                    </time>
                  </div>
                  <h2 className="mt-3 max-w-[28ch] text-balance font-heading text-[1.5rem] font-light leading-tight tracking-[-0.012em] text-foreground transition-colors duration-[var(--dur-color)] group-hover:text-primary md:text-[2rem]">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <span className="hilo mt-5 self-start text-[0.875rem] font-medium text-foreground">
                    Leer
                  </span>
                </div>

                {/* La foto a la derecha y chica: acompaña, no manda. En movil pasa
                    arriba porque una imagen sola bajo el texto se lee como sobra. */}
                <div className="relative order-1 aspect-[3/2] overflow-hidden rounded-[2px] bg-muted sm:order-2 sm:aspect-[4/3]">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {posts.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Próximamente nuevos artículos.
          </p>
        )}
      </section>
    </main>
  );
}
