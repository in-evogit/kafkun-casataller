import Link from "next/link";

/**
 * Tarjeta de precio que reacciona al pasar el cursor.
 *
 * Es la idea del SquishyCard que paso Gabriel: la tarjeta crece un poco, el precio se
 * agranda desde su esquina y la forma del fondo se estira. Lo que cambia:
 *
 *   - SIN framer-motion. El efecto es hover sobre un elemento: transiciones de CSS lo
 *     hacen igual y corren en el compositor. Meter una libreria de animacion por un
 *     hover son ~40 KB por algo que el navegador ya sabe hacer.
 *   - Fondo indigo -> burdeos, la unica escala de color del sitio.
 *   - font-mono y uppercase fuera: la tipografia del sitio es Fraunces, y un precio
 *     en monoespaciada mayuscula se lee como panel de software, no como taller textil.
 *   - Los circulos negros del fondo pasan a una forma tejida: un arco y una elipse en
 *     el vino profundo, que es la unica figura que tiene sentido aqui.
 *
 * REEMPLAZA el bloque que estaba en rojo #C50906 a pantalla completa, que Gabriel
 * encontro "super fuerte". Una franja entera del color mas saturado de la paleta grita
 * en vez de invitar — y lo que tiene que hacer este bloque es vender.
 */
export default function TarjetaPrecio({
  etiqueta,
  precio,
  nota,
  detalle,
  cta,
  href,
}: {
  etiqueta: string;
  precio: string;
  nota: string;
  detalle: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group relative w-full max-w-[22rem] overflow-hidden rounded-2xl bg-burdeos p-8 transition-transform duration-[600ms] ease-[var(--ease-hilo)] hover:scale-[1.035]">
      {/* Las formas del fondo. Se estiran al pasar el cursor, con un retardo para que
          se lea como que la tarjeta respira y no como que todo salta junto. */}
      <svg
        aria-hidden
        viewBox="0 0 320 384"
        className="absolute inset-0 -z-0 h-full w-full transition-transform duration-[900ms] ease-[var(--ease-hilo)] group-hover:scale-150"
      >
        <circle
          cx="160"
          cy="112"
          r="102"
          className="origin-center fill-tinta transition-transform delay-150 duration-[900ms] ease-[var(--ease-hilo)] group-hover:-translate-y-6 group-hover:scale-y-50"
        />
        <ellipse
          cx="160"
          cy="266"
          rx="102"
          ry="44"
          className="origin-center fill-tinta transition-transform delay-150 duration-[900ms] ease-[var(--ease-hilo)] group-hover:-translate-y-6 group-hover:scale-y-[2.2]"
        />
      </svg>

      <div className="relative z-10 flex h-full flex-col text-[var(--tinta-foreground)]">
        <span className="w-fit rounded-full bg-[var(--tinta-foreground)]/20 px-3 py-1 text-[0.75rem] font-medium tracking-[0.02em]">
          {etiqueta}
        </span>

        <span className="mt-6 block origin-top-left font-heading text-[3rem] font-light leading-[1.05] tracking-[-0.02em] transition-transform duration-[600ms] ease-[var(--ease-hilo)] group-hover:scale-[1.08] md:text-[3.5rem]">
          {precio}
        </span>
        <span className="mt-1 text-[0.875rem] text-[var(--tinta-foreground)]/70">
          {nota}
        </span>

        <p className="mt-6 max-w-[30ch] text-[0.9375rem] leading-relaxed text-[var(--tinta-foreground)]/85">
          {detalle}
        </p>

        <Link
          href={href}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[var(--tinta-foreground)] px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-burdeos transition-[background-color,transform] duration-[var(--dur-color)] hover:bg-[var(--tinta-foreground)]/90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tinta-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-burdeos"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
