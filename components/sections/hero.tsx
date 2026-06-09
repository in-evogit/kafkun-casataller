import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Casa Taller Kafkun
            </p>
            <h1 className="mt-4 font-heading text-5xl font-semibold leading-tight text-foreground md:text-6xl">
              Tejer puede ser tu{" "}
              <span className="text-primary">nuevo lugar favorito</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Cursos online de telar con acceso de por vida. Aprende desde cero,
              a tu ritmo, acompañada por Katy desde el sur de Chile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cursos"
                className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent"
              >
                Ver cursos →
              </Link>
              <Link
                href="/sobre-mi"
                className="rounded-md border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Conocer a Katy
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/media/hero.jpg"
                alt="Alumnas tejiendo en telar en taller de Kafkun"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
