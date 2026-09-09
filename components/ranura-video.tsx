import { PlayCircle } from "lucide-react";

/**
 * Ranura de video, misma idea que figura.tsx para las fotos.
 *
 * Hoy no hay ni un video grabado ni Mux configurado, asi que esto NO es un reproductor:
 * es el hueco del tamano exacto que va a ocupar el video, con la urdimbre marcada. Asi
 * la pagina se ve terminada mientras se espera el material, y el dia que llegue no hay
 * salto de layout porque el espacio ya estaba reservado.
 *
 * Cuando exista el video se le pasa `playbackId` y este archivo dibuja el reproductor.
 * Ningun otro componente tiene que cambiar.
 */
export default function RanuraVideo({
  titulo,
  nota,
  playbackId,
}: {
  titulo: string;
  /** Para nosotros, no se muestra al publico. */
  nota?: string;
  playbackId?: string | null;
}) {
  if (playbackId) {
    // Cuando exista Mux, aca va el reproductor. Se deja el hueco listo a proposito.
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-[2px] bg-muted" />
    );
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-[2px] border border-border bg-secondary"
      role="img"
      aria-label={`${titulo} — video en preparación`}
    >
      {/* La misma urdimbre del estado sin foto: hilos verticales, sin retícula. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 9px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 23px)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <PlayCircle aria-hidden className="h-9 w-9 text-muted-foreground/50" strokeWidth={1.2} />
        <span className="text-[0.8125rem] uppercase tracking-[0.16em] text-muted-foreground">
          Video en preparación
        </span>
        {nota && (
          <span className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-muted-foreground/70">
            {nota}
          </span>
        )}
      </div>
    </div>
  );
}
