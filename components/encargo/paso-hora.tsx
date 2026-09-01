"use client";

import { useState } from "react";
import type { DiaDisponible } from "@/lib/encargo";

export type DatosContacto = {
  nombre: string;
  email: string;
  telefono: string;
  horaIso: string;
  prefiereMensaje: boolean;
};

type Props = {
  dias: DiaDisponible[];
  datos: DatosContacto;
  onCambio: (d: DatosContacto) => void;
};

const campo =
  "mt-2 w-full rounded-[2px] border border-border bg-background px-4 py-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/60 transition-colors duration-[var(--dur-color)] hover:border-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";

/**
 * Paso 03 — datos y hora.
 *
 * La hora va al FINAL de todo el formulario a proposito. Elegir un horario es un
 * compromiso mayor que contar lo que quieres: si se pidiera primero, se perderia a
 * quien todavia esta decidiendo. Puesto aca, la persona ya conto su idea y subio sus
 * fotos, y el paso se siente como cerrar algo y no como empezarlo.
 *
 * Por eso tambien existe la salida "prefiero que coordinemos por mensaje": el lead se
 * captura igual aunque no quiera comprometerse a una hora.
 */
export default function PasoHora({ dias, datos, onCambio }: Props) {
  const [diaAbierto, setDiaAbierto] = useState<string | null>(dias[0]?.fecha ?? null);
  const set = (p: Partial<DatosContacto>) => onCambio({ ...datos, ...p });

  const dia = dias.find((d) => d.fecha === diaAbierto);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-[1.3125rem] text-foreground">Tus datos</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="text-[0.875rem] font-medium text-foreground">
              Cómo te llamas
            </label>
            <input
              id="nombre"
              required
              value={datos.nombre}
              onChange={(e) => set({ nombre: e.target.value })}
              autoComplete="name"
              className={campo}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-[0.875rem] font-medium text-foreground">
              Tu correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={datos.email}
              onChange={(e) => set({ email: e.target.value })}
              autoComplete="email"
              className={campo}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="telefono" className="text-[0.875rem] font-medium text-foreground">
              Tu teléfono{" "}
              <span className="font-normal text-muted-foreground">
                — opcional, pero por acá es más rápido
              </span>
            </label>
            <input
              id="telefono"
              type="tel"
              value={datos.telefono}
              onChange={(e) => set({ telefono: e.target.value })}
              autoComplete="tel"
              placeholder="+56 9 ..."
              className={campo}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-[1.3125rem] text-foreground">
          ¿Cuándo nos juntamos?
        </h2>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Una conversación de unos 45 minutos para entender bien lo que quieres.
        </p>

        {dias.length === 0 ? (
          <p className="mt-5 rounded-[2px] border border-border bg-secondary p-4 text-[0.9375rem] text-muted-foreground">
            No hay horas publicadas por ahora. Deja tus datos y te escribo para coordinar.
          </p>
        ) : (
          <fieldset
            disabled={datos.prefiereMensaje}
            className="mt-6 transition-opacity duration-[var(--dur-color)] disabled:opacity-40"
          >
            <legend className="sr-only">Elige día y hora</legend>

            {/* Los dias en una fila que se desliza: en movil no caben 21 en columna. */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {dias.map((d) => {
                const activo = d.fecha === diaAbierto;
                return (
                  <button
                    key={d.fecha}
                    type="button"
                    onClick={() => setDiaAbierto(d.fecha)}
                    className={[
                      "shrink-0 rounded-[2px] border px-4 py-2.5 text-left",
                      "transition-colors duration-[var(--dur-color)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      activo
                        ? "border-primary bg-primary/[0.06]"
                        : "border-border hover:border-foreground/30",
                    ].join(" ")}
                  >
                    <span className="block text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {d.diaSemana.slice(0, 3)}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] font-medium text-foreground">
                      {d.etiqueta}
                    </span>
                  </button>
                );
              })}
            </div>

            {dia && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {dia.horas.map((h, i) => {
                  const activo = datos.horaIso === h.iso;
                  return (
                    <button
                      key={h.iso}
                      type="button"
                      onClick={() => set({ horaIso: activo ? "" : h.iso })}
                      aria-pressed={activo}
                      style={{
                        // Escalonado corto: las horas caen una tras otra al cambiar de dia.
                        // Se corta a los 6 para que la ultima nunca se haga esperar.
                        animationDelay: `${Math.min(i, 6) * 35}ms`,
                      }}
                      className={[
                        "animate-[caer_260ms_var(--ease-hilo)_both]",
                        "rounded-[2px] border px-4 py-2 text-[0.9375rem] tabular-nums",
                        "transition-[color,background-color,border-color,transform] duration-[var(--dur-color)]",
                        "active:scale-[0.97]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        activo
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary/50",
                      ].join(" ")}
                    >
                      {h.etiqueta}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        )}

        <label className="mt-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={datos.prefiereMensaje}
            onChange={(e) => set({ prefiereMensaje: e.target.checked, horaIso: "" })}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            Prefiero que me escribas y coordinamos entre los dos
          </span>
        </label>
      </div>
    </div>
  );
}
