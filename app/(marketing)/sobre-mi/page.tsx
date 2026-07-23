import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre mí · Casa Taller Kafkun",
  description:
    "Katy, tejedora autodidacta de telar mapuche. Kafkún significa susurro en mapudungun. Su historia, su oficio y por qué enseña sin guardarse nada.",
};

export default function SobreMiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#5c1520] via-[#7c1d2b] to-[#9b2335]">
        <div className="textura-telar pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Sobre mí
              </p>
              <h1 className="mt-4 font-heading text-5xl font-semibold leading-[1.05] text-white md:text-6xl">
                El telar me{" "}
                <span className="italic text-[#f2c9bf]">encontró a mí</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
                Soy Katy, tejedora autodidacta de telar mapuche, crochet y
                palillo. <em>Kafkún</em> significa susurro en mapudungun —o
                hablar al oído— y así fue como este oficio llegó a mi vida.
              </p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
              <Image
                src="https://placehold.co/800x1000/9B2335/FFFFFF?text=Katy"
                alt="Katy, tejedora de telar mapuche"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Aprendí de manera autodidacta, porque no encontré a nadie que me
              pudiera enseñar. Me equivoqué harto, cometí muchos errores… hasta
              que, con la práctica, empecé a perfeccionar la técnica.
            </p>
            <p>
              El crochet y el palillo los tejo desde niña: me enseñó mi mamá, un
              poco mi abuela, algo en el colegio, y sobre todo mirando. Miro
              mucho y aprendo mucho —muchas cosas las he aprendido observando.
            </p>
            <p>
              Siempre quise tejer y tener mi propio taller, pero entre lo
              laboral y tener que proveer, nunca le di el tiempo. Hasta que un
              día dije: <strong className="text-foreground">es ahora o nunca</strong>.
              Me puse un poco egoísta, me lancé nomás —gústele a quien le
              guste— con mi taller y mi Instagram. Y la cosa ha crecido tanto
              que hasta yo estoy sorprendida.
            </p>
          </div>

          {/* Principio destacado */}
          <blockquote className="my-12 border-l-4 border-primary bg-secondary px-6 py-6">
            <p className="font-heading text-2xl font-medium italic text-foreground md:text-3xl">
              “En mis talleres no me guardo ningún dato. Todo lo que he aprendido
              desde la práctica, lo enseño —con todos los tips, sin
              mezquindades.”
            </p>
          </blockquote>

          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Enseñar lo paso muy bien: me pongo contenta y me gusta ver el
              entusiasmo con que la gente quiere aprender. Muchas alumnas llegan
              como llegué yo, sin nadie que les enseñe, y me dicen “por fin”,
              “hace tanto que quería aprender”. Otras me cuentan que nunca
              habían encontrado a alguien que enseñara así, al detalle.
            </p>
          </div>
        </div>
      </section>

      {/* Primera pieza */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
            <Image
              src="https://placehold.co/900x675/7C1D2B/FFFFFF?text=Mi+primer+mural"
              alt="El primer mural que tejió Katy en telar mapuche"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Mi primera pieza
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground md:text-5xl">
              El mural que no vendo ni regalo
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              En telar mapuche mi primera pieza fueron las tiritas de práctica
              —las mismas con las que hoy parto mis clases, para aprender la
              técnica. Mi primera pieza ornamental fue un mural que guardo hasta
              el día de hoy: no lo vendo, no lo regalo. Fue el primero, y ese se
              queda conmigo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#4d121c] textura-telar">
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
            ¿Te tinca aprender conmigo?
          </h2>
          <p className="mt-3 text-white/70">
            Empieza por el taller inicial de telar mapuche, desde cero y a tu
            ritmo.
          </p>
          <Link
            href="/cursos"
            className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-medium text-primary shadow-sm transition-colors hover:bg-white/90"
          >
            Ver los cursos →
          </Link>
        </div>
      </section>
    </>
  );
}
