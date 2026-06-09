import Image from "next/image";
import Link from "next/link";

export default function AboutMini() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/media/about-katy.jpg"
              alt="Katy, instructora de telar"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Sobre mí
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Tejer cambió cómo me relaciono con el tiempo
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Soy Katy, del sur de Chile. Empecé a tejer por accidente y terminé
              convirtiendo el telar en mi oficio. Llevo años enseñando y cada
              alumna que termina su primera pieza me confirma que este oficio
              le pertenece a quien quiera aprenderlo.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Enseño sin secretos. Todo lo que sé, lo comparto.
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
