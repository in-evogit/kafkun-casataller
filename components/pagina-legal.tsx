import HeroPagina from "@/components/hero-pagina";
import { ACTUALIZADO } from "@/lib/data/legal";

/**
 * Molde de las tres paginas legales.
 *
 * Una sola cabecera y un solo ancho de lectura para las tres: si cada una se
 * escribiera por separado, terminarian con tamaños de titular distintos, como paso
 * con las subpaginas antes de HeroPagina.
 *
 * El ancho maximo es de 68 caracteres, no el de la pagina. Un texto legal a todo lo
 * ancho de una pantalla no se lee, se ojea —y este es justo el texto que la gente
 * ya viene predispuesta a no leer—.
 */
export default function PaginaLegal({
  antetitulo,
  titulo,
  bajada,
  children,
}: {
  antetitulo: string;
  titulo: string;
  bajada: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <HeroPagina antetitulo={antetitulo} titulo={titulo} bajada={bajada} />

      <div className="mx-auto max-w-[68ch] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-[0.8125rem] text-muted-foreground">
          Última actualización: {ACTUALIZADO}
        </p>

        {/* Los estilos del texto van aca, una vez, y no repartidos por las tres
            paginas: asi las tres se leen igual y no pueden divergir. */}
        <div
          className="mt-10 flex flex-col gap-10
            [&_h2]:font-heading [&_h2]:text-[1.375rem] [&_h2]:font-light [&_h2]:tracking-[-0.012em] [&_h2]:text-foreground
            [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-[1.0625rem] [&_h3]:text-foreground
            [&_p]:mt-3 [&_p]:text-[0.9375rem] [&_p]:leading-relaxed [&_p]:text-muted-foreground
            [&_li]:mt-2 [&_li]:text-[0.9375rem] [&_li]:leading-relaxed [&_li]:text-muted-foreground
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5
            [&_strong]:font-medium [&_strong]:text-foreground
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
