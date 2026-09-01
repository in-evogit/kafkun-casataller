"use client";

import { TIPOS_PIEZA, PLAZOS } from "@/lib/encargo";

export type DatosPieza = {
  tipo: string;
  descripcion: string;
  plazo: string;
};

type Props = {
  datos: DatosPieza;
  onCambio: (d: DatosPieza) => void;
};

/**
 * Paso 01 — la pieza.
 *
 * Va primero y NO pide datos personales a proposito. Alguien que acaba de ver una obra
 * y hace clic todavia no quiere dar su correo; quiere contar lo que se imagina. Pedirle
 * el telefono en la primera pantalla lo devuelve al Instagram.
 */
export default function PasoPieza({ datos, onCambio }: Props) {
  const set = (parcial: Partial<DatosPieza>) => onCambio({ ...datos, ...parcial });

  return (
    <div className="space-y-10">
      <fieldset>
        <legend className="font-heading text-[1.3125rem] text-foreground">
          ¿Qué te gustaría que teja?
        </legend>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {TIPOS_PIEZA.map((t) => {
            const activo = datos.tipo === t.valor;
            return (
              <label
                key={t.valor}
                className={[
                  "group relative cursor-pointer rounded-[2px] border p-4",
                  // Solo color y borde: el layout no se mueve al elegir, asi que
                  // la fila no da saltos mientras la persona compara opciones.
                  "transition-colors duration-[var(--dur-color)]",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                  activo
                    ? "border-primary bg-primary/[0.04]"
                    : "border-border hover:border-foreground/30",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={t.valor}
                  checked={activo}
                  onChange={() => set({ tipo: t.valor })}
                  className="sr-only"
                />
                <span className="flex items-center gap-2.5">
                  {/* Marca de seleccion: nunca aparece desde scale(0). Nace en 0.6
                      con opacidad 0, que es como aparecen las cosas de verdad. */}
                  <span
                    aria-hidden
                    className={[
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      "transition-colors duration-[var(--dur-color)]",
                      activo ? "border-primary" : "border-muted-foreground/40",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2 w-2 rounded-full bg-primary",
                        "transition-[transform,opacity] duration-[var(--dur-hilo)] ease-[var(--ease-hilo)]",
                        activo ? "scale-100 opacity-100" : "scale-[0.6] opacity-0",
                      ].join(" ")}
                    />
                  </span>
                  <span className="text-[0.9375rem] font-medium text-foreground">
                    {t.etiqueta}
                  </span>
                </span>
                {"ayuda" in t && t.ayuda ? (
                  <span className="mt-1.5 block pl-[1.625rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t.ayuda}
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="descripcion"
          className="block font-heading text-[1.3125rem] text-foreground"
        >
          Cuéntame cómo la imaginas
        </label>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Para qué la quieres, cómo la vas a usar, si es para ti o para regalar. No
          necesitas saber de telar ni usar las palabras correctas.
        </p>
        <textarea
          id="descripcion"
          rows={5}
          value={datos.descripcion}
          onChange={(e) => set({ descripcion: e.target.value })}
          placeholder="Quiero un chaleco para el invierno, holgado, en tonos tierra…"
          className="mt-4 w-full rounded-[2px] border border-border bg-background px-4 py-3 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition-colors duration-[var(--dur-color)] hover:border-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <fieldset>
        <legend className="font-heading text-[1.3125rem] text-foreground">
          ¿Para cuándo la necesitas?
        </legend>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {PLAZOS.map((p) => {
            const activo = datos.plazo === p.valor;
            return (
              <label
                key={p.valor}
                className={[
                  "cursor-pointer rounded-[2px] border px-4 py-2 text-[0.875rem]",
                  "transition-colors duration-[var(--dur-color)]",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                  activo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="plazo"
                  value={p.valor}
                  checked={activo}
                  onChange={() => set({ plazo: p.valor })}
                  className="sr-only"
                />
                {p.etiqueta}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
