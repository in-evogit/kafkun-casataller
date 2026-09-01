"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_REFERENCIAS, MAX_PESO_MB } from "@/lib/encargo";

export type Referencia = {
  archivo: File;
  /** URL local para la miniatura. Se revoca al quitarla: si no, queda en memoria. */
  vistaPrevia: string;
};

type Props = {
  referencias: Referencia[];
  onCambio: (r: Referencia[]) => void;
};

const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/**
 * Paso 02 — las referencias.
 *
 * Es el paso 02 del proceso que la portada ya promete ("Traes tus referencias"), hecho
 * realidad. El texto repite la idea de Katy a proposito: que la pieza no tiene que
 * existir todavia en ninguna parte.
 *
 * La zona vacia usa la MISMA urdimbre que el estado "foto en camino" de figura.tsx. No es
 * un rectangulo punteado generico: es la superficie del sitio esperando una imagen.
 */
export default function PasoReferencias({ referencias, onCambio }: Props) {
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Las URL locales sobreviven al desmontaje si nadie las suelta.
  useEffect(() => {
    return () => referencias.forEach((r) => URL.revokeObjectURL(r.vistaPrevia));
    // Solo al desmontar: dentro del ciclo se revocan una por una al quitarlas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function agregar(lista: FileList | null) {
    if (!lista) return;
    setError(null);
    const entrantes = Array.from(lista);

    const cupo = MAX_REFERENCIAS - referencias.length;
    if (cupo <= 0) {
      setError(`Ya son ${MAX_REFERENCIAS} fotos, que es el máximo.`);
      return;
    }

    const validas: Referencia[] = [];
    for (const archivo of entrantes.slice(0, cupo)) {
      if (!TIPOS_OK.includes(archivo.type)) {
        setError("Solo fotos: JPG, PNG o HEIC.");
        continue;
      }
      if (archivo.size > MAX_PESO_MB * 1024 * 1024) {
        setError(`"${archivo.name}" pesa más de ${MAX_PESO_MB} MB.`);
        continue;
      }
      validas.push({ archivo, vistaPrevia: URL.createObjectURL(archivo) });
    }

    if (entrantes.length > cupo) {
      setError(`Se agregaron ${cupo}: el máximo son ${MAX_REFERENCIAS} fotos.`);
    }
    if (validas.length) onCambio([...referencias, ...validas]);
  }

  function quitar(i: number) {
    URL.revokeObjectURL(referencias[i].vistaPrevia);
    onCambio(referencias.filter((_, j) => j !== i));
    setError(null);
  }

  const lleno = referencias.length >= MAX_REFERENCIAS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-[1.3125rem] text-foreground">
          Muéstrame lo que te gusta
        </h2>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Fotos de piezas que te llaman la atención. Podemos tomar el cuello de una, el
          largo de otra y el diseño de una tercera. No tiene que existir en ninguna parte
          todavía.
        </p>
      </div>

      {!lleno && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            agregar(e.dataTransfer.files);
          }}
          className={[
            "relative w-full overflow-hidden rounded-[2px] border border-dashed",
            "aspect-[3/2] sm:aspect-[5/2]",
            "transition-colors duration-[var(--dur-color)]",
            arrastrando ? "border-primary bg-primary/[0.04]" : "border-border bg-secondary",
          ].join(" ")}
        >
          {/* La urdimbre de figura.tsx: hilos verticales, sin retícula. */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 9px), repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 23px)",
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center transition-transform duration-[160ms] ease-[var(--ease-hilo)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <span className="hilo text-[0.9375rem] font-medium text-foreground">
              Elegir fotos
            </span>
            <span className="text-[0.8125rem] text-muted-foreground">
              o arrástralas aquí · hasta {MAX_REFERENCIAS}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS_OK.join(",")}
            multiple
            onChange={(e) => {
              agregar(e.target.files);
              e.target.value = "";
            }}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      )}

      {referencias.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {referencias.map((r, i) => (
            <li key={r.vistaPrevia} className="group relative">
              {/* Vertical: es la proporcion con la que se fotografia una prenda. */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-muted">
                {/* Miniatura local, nunca sale del navegador todavia. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.vistaPrevia}
                  alt={`Referencia ${i + 1}: ${r.archivo.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => quitar(i)}
                aria-label={`Quitar referencia ${i + 1}`}
                className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm transition-[transform,color] duration-[160ms] ease-[var(--ease-hilo)] hover:text-primary active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* aria-live: quien usa lector de pantalla se entera del rechazo sin volver a recorrer. */}
      <p aria-live="polite" className="min-h-[1.25rem] text-[0.8125rem] text-primary">
        {error}
      </p>

      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
        Este paso es opcional. Si prefieres, me las muestras cuando nos juntemos.
      </p>
    </div>
  );
}
