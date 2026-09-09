import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LineaTiempo from "@/components/linea-tiempo";

export const metadata: Metadata = {
  title: "Sobre mí · Casa Taller Kafkun",
  description:
    "Katy, tejedora autodidacta de telar mapuche. Kafkún significa susurro en mapudungun. Su historia, su oficio y por qué enseña sin guardarse nada.",
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
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Quién teje
              </p>
              <h1 className="mt-4 text-balance font-heading text-[2.5rem] font-light leading-[0.98] tracking-[-0.025em] text-foreground md:text-[4rem]">
                El telar me{" "}
                <em className="font-normal italic text-primary">encontró a mí</em>.
              </h1>
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
                Soy Katy, tejedora autodidacta de telar mapuche, crochet y palillo.{" "}
                <em>Kafkün</em> significa susurro en mapudungun.
              </p>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
              <Image
                src="/images/katy-chal-gris.jpg"
                alt="Katy en su taller, con un chal gris tejido por ella"
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

      {/* EL VINO VUELVE ACÁ. Gabriel lo pidió de vuelta "en algunos sectores", y este
          es el sector: su principio, dicho por ella. Es lo más fuerte que tiene el
          sitio y merece el único bloque de peso de la página. Papel sobre este vino
          da 14.32:1, medido. */}
      <section className="bg-tinta">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <blockquote>
            <span aria-hidden className="block h-px w-14 bg-tinta-foreground/40" />
            <p className="mt-8 text-balance font-heading text-[1.625rem] font-light italic leading-[1.25] text-tinta-foreground md:text-[2.5rem]">
              En mis talleres no me guardo ningún dato. Todo lo que he aprendido desde la
              práctica, lo enseño — con todos los tips, sin mezquindades.
            </p>
            <footer className="mt-8 text-[0.875rem] text-tinta-foreground/60">
              Katy · Casa Taller Kafkün
            </footer>
          </blockquote>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
              <Image
                src="/images/telar-proceso.jpg"
                alt="Telar mapuche de Katy con un tejido en proceso"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Y ahora
              </p>
              <h2 className="mt-4 text-balance font-heading text-[1.875rem] font-light leading-tight tracking-[-0.018em] text-foreground md:text-[2.5rem]">
                Tejo por encargo y enseño lo que sé
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/a-pedido/empezar"
                  className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] border border-primary bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:border-accent hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Encargar una pieza
                </Link>
                <Link
                  href="/cursos"
                  className="inline-flex h-12 items-center justify-center rounded-[2px] border border-border px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-foreground transition-colors duration-[var(--dur-color)] hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Ver las clases
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
