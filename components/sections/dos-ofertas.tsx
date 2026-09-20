import Link from "next/link";
import Image from "next/image";
import { seedCourses } from "@/lib/data/clases";

function precio(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

/**
 * Las dos ofertas, con precio, arriba de todo.
 *
 * Gabriel: "la pagina principal lo mas rapida posible con un mix de curso y de pedido,
 * ya que la idea es vender", y la gente llega desde Instagram — o sea YA SABE quien es
 * Katty. Eso cambia el embudo entero: no hay que presentarsela, hay que darle donde
 * comprar.
 *
 * En la referencia que paso (bordacolores) el primer boton de compra esta en el hero y
 * los precios aparecen en la tercera seccion. Aca es lo mismo: esta seccion va
 * inmediatamente despues del hero, antes de las obras, antes de las resenas y mucho
 * antes de la historia de Katty.
 *
 * LAS DOS COLUMNAS NO SON IGUALES, y es correcto que no lo sean:
 *   - La clase tiene precio, porque se compra hoy.
 *   - El encargo NO tiene precio, porque el precio sale despues de conversar. Poner
 *     "desde $X" ahi seria inventarle un numero a Katty. Lo que se promete es lo
 *     unico cierto: que conversar no cuesta nada.
 */
export default function DosOfertas() {
  const curso = seedCourses[0];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-burdeos">
            Dos caminos
          </p>
          <h2 className="mt-4 text-balance font-heading text-[1.875rem] font-light leading-tight tracking-[-0.018em] text-foreground md:text-[2.5rem]">
            Aprende a tejer, o encarga tu pieza
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {/* ── La clase, con precio y boton de compra ────────────────────── */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-[var(--dur-color)] hover:-translate-y-0.5 hover:border-burdeos hover:shadow-[0_2px_8px_rgba(44,26,17,0.06),0_18px_40px_-18px_rgba(44,26,17,0.18)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src={curso.thumbnail_url}
                alt="Alumnas tejiendo en un taller de Casa Taller Kafkún"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="w-fit rounded-full border border-burdeos/40 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-burdeos">
                Desde cero
              </span>
              <h3 className="mt-4 font-heading text-[1.4375rem] font-light text-foreground">
                {curso.title}
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {curso.lessons_count} clases grabadas. Lo compras una vez y queda tuyo
                para siempre — sin cupos ni fechas.
              </p>

              <div className="mt-6 flex flex-1 items-end">
                <div className="w-full">
                  <span className="block font-heading text-[2rem] font-light leading-none text-foreground">
                    {precio(curso.price_clp)}
                  </span>
                  <Link
                    href={`/cursos/${curso.slug}`}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full border border-burdeos bg-burdeos px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-[var(--tinta-foreground)] transition-[background-color,border-color,transform] duration-[var(--dur-color)] hover:border-primary hover:bg-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                  >
                    Ver el taller
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── El encargo, sin precio porque sale de la conversación ──────── */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow,transform] duration-[var(--dur-color)] hover:-translate-y-0.5 hover:border-burdeos hover:shadow-[0_2px_8px_rgba(44,26,17,0.06),0_18px_40px_-18px_rgba(44,26,17,0.18)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
              <Image
                src="/images/obra-chaleco-mostaza-1.jpg"
                alt="Chaleco tejido en mostaza, sobre maniquí en el campo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-7">
              <span className="w-fit rounded-full border border-border px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                A tu medida
              </span>
              <h3 className="mt-4 font-heading text-[1.4375rem] font-light text-foreground">
                Encarga tu pieza
              </h3>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                Chalecos, chales y mantas tejidos sobre tus medidas. Conversamos qué
                quieres y lo definimos entre las dos.
              </p>

              <div className="mt-6 flex flex-1 items-end">
                <div className="w-full">
                  <span className="block font-heading text-[2rem] font-light leading-none text-foreground">
                    Conversemos
                  </span>
                  <span className="mt-1 block text-[0.8125rem] text-muted-foreground">
                    El precio sale con la pieza ya definida
                  </span>
                  <Link
                    href="/a-pedido/empezar"
                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full border border-border px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-foreground transition-[border-color,color,transform] duration-[var(--dur-color)] hover:border-burdeos hover:text-burdeos active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                  >
                    Empezar mi encargo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
