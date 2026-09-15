import Urdimbre from "@/components/urdimbre";

/**
 * Hero compartido de las subpaginas.
 *
 * Gabriel: "necesito que todas las paginas queden en sintonia en terminos del hero de
 * cada pagina... hay paginas que su hero es distinta a las de las otras y se ve mal,
 * por ejemplo el de curso el crema no tiene nada que ver con el de los otros".
 *
 * Tenia razon: cada subpagina se habia escrito por separado y cada una invento su
 * cabecera —una sobre crema, otra sobre vino, otra sin fondo, con tamanos de titular
 * distintos—. Eso no se arregla ajustando cada una: se arregla con UNA cabecera que
 * todas usan, porque asi no pueden volver a divergir.
 *
 * La urdimbre de fondo es el motivo de la marca y aparece en todas por igual, que es
 * lo que da la sintonia. El hero de la PORTADA es el unico distinto a proposito: ese
 * lleva foto a sangre y es la entrada al sitio.
 */
export default function HeroPagina({
  antetitulo,
  titulo,
  bajada,
  acciones,
}: {
  antetitulo: string;
  titulo: React.ReactNode;
  bajada?: string;
  acciones?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <Urdimbre className="absolute inset-0 -z-10" />
      {/* El papel se cierra hacia abajo para que el texto no compita con los hilos. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--background)_58%,transparent)_0%,var(--background)_80%)]"
      />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-14 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {antetitulo}
          </p>
          <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
            {titulo}
          </h1>
          {bajada && (
            <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
              {bajada}
            </p>
          )}
          {acciones && <div className="mt-9 flex flex-wrap gap-3">{acciones}</div>}
        </div>
      </div>
    </section>
  );
}
