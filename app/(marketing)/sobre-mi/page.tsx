import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LineaTiempo from "@/components/linea-tiempo";

export const metadata: Metadata = {
  title: "Sobre mí · Casa Taller Kafkun",
  description:
    "Katty, tejedora autodidacta de telar mapuche. Kafkún significa susurro en mapudungun. Su historia, su oficio y por qué enseña sin guardarse nada.",
};

export default function SobreMiPage() {
  return (
    <main className="bg-background">
      {/* HERO SIN EL DEGRADADO VINO. Gabriel: "el hero de esa sección que sea sin ese
          fondo vino raro". Eran tres tonos de la paleta ANTERIOR al logo (#5C1520 →
          #7C1D2B → #9B2335), que ya no existen en el sitio. El vino no desaparece:
          vuelve más abajo, en la cita, que es donde de verdad pega. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-14 sm:px-6 sm:pt-28 lg:px-8">
          {/* items-center y no items-end: con items-end el texto se pegaba al pie de
              una foto vertical muy alta y quedaba un hueco enorme arriba. Y la foto
              baja de 3:4 a 4:5 con tope de alto, porque a 3:4 en esta columna medía
              casi una pantalla entera. */}
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-burdeos">
                Quién teje
              </p>
              <h1 className="mt-4 text-balance font-heading text-[2.5rem] font-light leading-[0.98] tracking-[-0.025em] text-foreground md:text-[4rem]">
                El telar me{" "}
                <em className="font-normal italic text-primary">encontró a mí</em>.
              </h1>
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
                Soy Katty, tejedora autodidacta de telar mapuche, crochet y palillo.{" "}
                <em>Kafkün</em> significa susurro en mapudungun.
              </p>
            </div>

            <div className="relative aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-[2px]">
              <Image
                src="/images/katty-chal-gris.jpg"
                alt="Katty en su taller, con un chal gris tejido por ella"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                style={{ objectPosition: "50% 30%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SU HISTORIA COMO LÍNEA DE TIEMPO. Gabriel: "que sea todo en sintonía hacia
          abajo como línea de tiempo tal vez interactiva... está súper simple, da lata
          hasta leer".

          Eran tres párrafos largos seguidos. El texto es bueno —es su voz, verificada,
          y no se toca una palabra— pero en bloque no se lee: no hay dónde descansar ni
          se ve que hay un recorrido. Partido en hitos, con la línea que se va llenando,
          la misma historia se recorre en vez de leerse de corrido. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <LineaTiempo
            hitos={[
              {
                marca: "Desde niña",
                titulo: "El crochet y el palillo",
                texto:
                  "Me enseñó mi mamá, un poco mi abuela, algo en el colegio, y sobre todo mirando. Miro mucho y aprendo mucho — muchas cosas las he aprendido observando.",
              },
              {
                marca: "El telar",
                titulo: "Aprendí sola, porque no había quién me enseñara",
                texto:
                  "Aprendí de manera autodidacta, porque no encontré a nadie que me pudiera enseñar. Me equivoqué harto, cometí muchos errores… hasta que, con la práctica, empecé a perfeccionar la técnica.",
              },
              {
                marca: "El salto",
                titulo: "Es ahora o nunca",
                texto:
                  "Siempre quise tejer y tener mi propio taller, pero entre lo laboral y tener que proveer, nunca le di el tiempo. Hasta que un día dije: es ahora o nunca. Me puse un poco egoísta, me lancé nomás — gústele a quien le guste — con mi taller y mi Instagram. Y la cosa ha crecido tanto que hasta yo estoy sorprendida.",
              },
              {
                marca: "El mural",
                titulo: "Mi primera pieza ornamental",
                texto:
                  "En telar mapuche todo empieza por la urdimbre: esos hilos tensos que ves en el bastidor. Ahí parto cada clase y cada pieza. Mi primera pieza ornamental fue un mural que guardo hasta el día de hoy: no lo vendo, no lo regalo. Fue el primero, y ese se queda conmigo.",
              },
              {
                marca: "2015",
                titulo: "Enseñar",
                texto:
                  "Enseñar lo paso muy bien: me pongo contenta y me gusta ver el entusiasmo con que la gente quiere aprender. Muchas alumnas llegan como llegué yo, sin nadie que les enseñe, y me dicen «por fin», «hace tanto que quería aprender».",
              },
            ]}
          />
        </div>
      </section>

      {/* LA CITA, SIN LA FRANJA. Gabriel: "ese recuadro burdeo que pones con la frase
          como que corta la web". Tenia razon: un bloque de color a pantalla completa en
          medio de una historia la parte en dos, y la frase de Katty es lo mejor que
          tiene el sitio — no merece quedar aislada, merece estar dentro del relato.

          Ahora va sobre el papel, con el hilo burdeo al costado y el tamaño de un
          titular. Sigue siendo el momento mas fuerte de la pagina, pero la historia
          sigue corriendo a traves de ella. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <blockquote className="border-l-2 border-burdeos pl-7 md:pl-10">
            <p className="max-w-[30ch] text-balance font-heading text-[1.75rem] font-light italic leading-[1.2] text-foreground md:text-[2.75rem]">
              En mis talleres no me guardo ningún dato.
            </p>
            <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
              Todo lo que he aprendido desde la práctica, lo enseño — con todos los tips,
              sin mezquindades.
            </p>
            <footer className="mt-6 text-[0.875rem] text-muted-foreground">
              Katty · Casa Taller Kafkün
            </footer>
          </blockquote>
        </div>
      </section>

      {/* EL CIERRE. Antes era la foto del telar sola al costado y dos botones: "esa
          foto pelada del telar se ve mal y el cta es medio fome".

          Lo que se cambia de fondo no es el diseño: es QUE DICE. Un cierre que solo
          repite los dos botones no vende nada, porque no le da a nadie una razon para
          apretar. Ahora la ultima frase de la pagina es la promesa concreta de cada
          camino, y los botones vienen detras de esa promesa.

          Las dos fotos en vez de una: la pieza terminada y el telar en uso. Una sola
          foto de un telar vacio no dice nada de lo que se puede tener. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-burdeos">
              Y ahora
            </p>
            <h2 className="mt-4 text-balance font-heading text-[1.875rem] font-light leading-tight tracking-[-0.018em] text-foreground md:text-[2.75rem]">
              Puedes tener una pieza mía, o aprender a hacer la tuya
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8">
            {[
              {
                foto: "/images/obra-chaleco-mostaza-1.jpg",
                alt: "Chaleco tejido en mostaza, sobre maniquí en el campo",
                titulo: "Encargar una pieza",
                texto:
                  "Nos juntamos, me cuentas qué quieres y te tomo las medidas. El precio y el plazo salen al final, con la pieza ya definida entre las dos.",
                cta: "Empezar mi encargo",
                href: "/a-pedido/empezar",
                principal: true,
              },
              {
                foto: "/images/proceso-telar.jpg",
                alt: "Pieza montada en el telar, en proceso",
                titulo: "Aprender a tejer",
                texto:
                  "Clases grabadas que ves a tu ritmo. Se paga una vez y queda tuyo. Si nunca has tejido en telar, parte por la primera.",
                cta: "Ver las clases",
                href: "/cursos",
                principal: false,
              },
            ].map((v) => (
              <div
                key={v.titulo}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-[var(--dur-color)] hover:-translate-y-0.5 hover:border-burdeos hover:shadow-[0_2px_8px_rgba(44,26,17,0.06),0_18px_40px_-18px_rgba(44,26,17,0.18)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={v.foto}
                    alt={v.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-heading text-[1.4375rem] font-light text-foreground">
                    {v.titulo}
                  </h3>
                  <p className="mt-3 flex-1 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {v.texto}
                  </p>
                  <Link
                    href={v.href}
                    className={
                      v.principal
                        ? "mt-7 inline-flex h-12 w-fit items-center justify-center rounded-full border border-burdeos bg-burdeos px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[background-color,border-color,transform] duration-[var(--dur-color)] hover:border-primary hover:bg-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        : "mt-7 inline-flex h-12 w-fit items-center justify-center rounded-full border border-border px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-foreground transition-[border-color,color,transform] duration-[var(--dur-color)] hover:border-burdeos hover:text-burdeos active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    }
                  >
                    {v.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
