import Image from "next/image";
import Link from "next/link";

export default function AboutMini() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/images/katy-retrato.jpg"
              alt="Katy, tejedora de telar mapuche"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Sobre mí
            </p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground md:text-5xl">
              El telar me encontró a mí
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Soy Katy, tejedora autodidacta de telar mapuche, crochet y
              palillo. <em>Kafkún</em> significa susurro en mapudungun, y creo
              que el telar me encontró a mí. Aprendí sola, porque no encontré a
              nadie que me enseñara: me equivoqué harto y cometí muchos errores,
              hasta que fui perfeccionando la técnica.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              En mis talleres no me guardo ningún dato. Todo lo que he aprendido
              desde la práctica, lo enseño — con todos los tips, sin
              mezquindades.
            </p>
            <Link
              href="/sobre-mi"
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              Leer mi historia completa →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
