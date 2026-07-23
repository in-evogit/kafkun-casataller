import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#5c1520] via-[#7c1d2b] to-[#9b2335]">
      <div className="textura-telar pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Texto */}
          <div className="order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Casa Taller Kafkun
            </p>
            <h1 className="mt-4 font-heading text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
              Tejer puede ser tu{" "}
              <span className="italic text-[#f2c9bf]">nuevo lugar favorito</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
              Kafkún significa susurro en mapudungun. Aprende telar mapuche
              desde cero, a tu ritmo y con acceso de por vida, de la mano de una
              tejedora que no se guarda ningún secreto: todo lo que sabe, te lo
              enseña.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cursos"
                className="rounded-md bg-white px-6 py-3 font-medium text-primary shadow-sm transition-colors hover:bg-white/90"
              >
                Ver cursos →
              </Link>
              <Link
                href="/sobre-mi"
                className="rounded-md border border-white/40 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                Conocer a Katy
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
              <Image
                src="/images/prod-bufanda-blanca-1.jpg"
                alt="Chal tejido a mano en telar mapuche"
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
