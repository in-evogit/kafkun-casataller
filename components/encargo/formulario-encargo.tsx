"use client";

import { useRef, useState } from "react";
import type { DiaDisponible } from "@/lib/encargo";
import PasoPieza, { type DatosPieza } from "./paso-pieza";
import PasoReferencias, { type Referencia } from "./paso-referencias";
import PasoHora, { type DatosContacto } from "./paso-hora";

const PASOS = [
  { n: "01", titulo: "Tu pieza" },
  { n: "02", titulo: "Tus referencias" },
  { n: "03", titulo: "Cuándo nos juntamos" },
] as const;

type Estado = "editando" | "enviando" | "listo" | "error";

/**
 * El formulario de encargo, en tres pasos y sin salir de la pagina.
 *
 * Sin redirecciones a proposito: la confirmacion reemplaza al formulario en el mismo
 * lugar. Mandar a una pagina /gracias corta el hilo, obliga a una carga completa y
 * pierde el contexto de lo que la persona acaba de escribir si algo falla.
 *
 * El numerado 01/02/03 no es decorativo: repite el mismo lenguaje que la seccion "El
 * proceso" de la portada, para que se lea como la continuacion de lo que ya prometio.
 */
export default function FormularioEncargo({ dias }: { dias: DiaDisponible[] }) {
  const [paso, setPaso] = useState(0);
  const [estado, setEstado] = useState<Estado>("editando");
  const [mensajeError, setMensajeError] = useState("");
  const encabezadoRef = useRef<HTMLDivElement>(null);

  const [pieza, setPieza] = useState<DatosPieza>({
    tipo: "",
    descripcion: "",
    plazo: "",
  });
  const [referencias, setReferencias] = useState<Referencia[]>([]);
  const [contacto, setContacto] = useState<DatosContacto>({
    nombre: "",
    email: "",
    telefono: "",
    horaIso: "",
    prefiereMensaje: false,
  });

  /**
   * Que falta para avanzar, dicho con palabras.
   *
   * Antes esto devolvia un booleano y el boton se apagaba en silencio: la persona
   * quedaba mirando un boton muerto sin saber por que. Un boton deshabilitado sin
   * explicacion es una via muerta. Ahora el boton SIEMPRE se puede apretar, y si
   * falta algo lo dice y lleva el foco al campo que falta.
   */
  function queFalta(): { mensaje: string; campo?: string } | null {
    if (paso === 0) {
      if (!pieza.tipo) return { mensaje: "Elige qué te gustaría que teja." };
      if (pieza.descripcion.trim() === "")
        return {
          mensaje: "Cuéntame aunque sea en una línea cómo la imaginas.",
          campo: "descripcion",
        };
      return null;
    }
    if (paso === 2) {
      if (contacto.nombre.trim() === "")
        return { mensaje: "Falta tu nombre.", campo: "nombre" };
      if (contacto.email.trim() === "")
        return { mensaje: "Falta tu correo, para poder responderte.", campo: "email" };
      if (!contacto.prefiereMensaje && contacto.horaIso === "" && dias.length > 0)
        return {
          mensaje:
            "Elige una hora, o marca abajo que prefieres coordinar por mensaje.",
        };
      return null;
    }
    return null;
  }

  function ir(siguiente: number) {
    setPaso(siguiente);
    setMensajeError("");
    // Sin esto, quien navega con teclado o lector de pantalla se queda al final del
    // paso anterior y no se entera de que cambio la pantalla.
    requestAnimationFrame(() => encabezadoRef.current?.focus());
  }

  async function enviar() {
    setEstado("enviando");
    setMensajeError("");
    try {
      const cuerpo = new FormData();
      cuerpo.append(
        "encargo",
        JSON.stringify({
          tipo: pieza.tipo,
          descripcion: pieza.descripcion,
          plazo: pieza.plazo,
          nombre: contacto.nombre,
          email: contacto.email,
          telefono: contacto.telefono,
          hora_iso: contacto.prefiereMensaje ? null : contacto.horaIso || null,
          prefiere_mensaje: contacto.prefiereMensaje,
        })
      );
      referencias.forEach((r) => cuerpo.append("referencias", r.archivo));

      const res = await fetch("/api/encargo", { method: "POST", body: cuerpo });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "No pudimos enviar tu encargo.");
      }
      setEstado("listo");
      requestAnimationFrame(() => encabezadoRef.current?.focus());
    } catch (e) {
      setEstado("error");
      setMensajeError(
        e instanceof Error ? e.message : "No pudimos enviar tu encargo."
      );
    }
  }

  if (estado === "listo") {
    const hora = dias
      .flatMap((d) => d.horas.map((h) => ({ ...h, dia: d })))
      .find((h) => h.iso === contacto.horaIso);

    return (
      <div
        ref={encabezadoRef}
        tabIndex={-1}
        className="animate-[paso-entra_320ms_var(--ease-hilo)_both] outline-none"
      >
        {/* El hilo aca no se dibuja al pasar el mouse: ya esta tenso. Es el gesto
            del sitio marcando que algo se cerro. */}
        <span aria-hidden className="block h-px w-16 bg-primary" />
        <h2 className="mt-6 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[2.75rem]">
          Recibí tu encargo
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          {hora ? (
            <>
              Nos juntamos el <strong className="font-medium text-foreground">{hora.dia.diaSemana} {hora.dia.etiqueta}</strong>{" "}
              a las <strong className="font-medium text-foreground">{hora.etiqueta}</strong>.
              Te llega un correo con los detalles y con la cita lista para agregar a tu
              calendario.
            </>
          ) : (
            <>
              Te escribo a{" "}
              <strong className="font-medium text-foreground">{contacto.email}</strong>{" "}
              para coordinar cuándo conversamos.
            </>
          )}
        </p>
        <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Si algo cambia, respóndeme ese mismo correo y lo movemos sin problema.
        </p>
      </div>
    );
  }

  const esUltimo = paso === PASOS.length - 1;

  return (
    <div>
      {/* Progreso: los mismos numerales que "El proceso" de la portada. El hilo
          marca el paso activo, que es justo donde la persona esta decidiendo. */}
      <ol className="flex flex-wrap gap-x-8 gap-y-3">
        {PASOS.map((p, i) => {
          const activo = i === paso;
          const hecho = i < paso;
          return (
            <li key={p.n} className="flex items-baseline gap-2">
              <span
                className={[
                  "font-heading text-[1.0625rem] font-light leading-none transition-colors duration-[var(--dur-color)]",
                  activo || hecho ? "text-primary" : "text-muted-foreground/50",
                ].join(" ")}
              >
                {p.n}
              </span>
              <span
                className={[
                  activo ? "hilo" : "",
                  "text-[0.875rem] transition-colors duration-[var(--dur-color)]",
                  activo
                    ? "text-foreground"
                    : hecho
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50",
                ].join(" ")}
              >
                {p.titulo}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        ref={encabezadoRef}
        tabIndex={-1}
        // key: al cambiar de paso el nodo es nuevo, y la animacion de entrada corre.
        key={paso}
        className="mt-12 animate-[paso-entra_320ms_var(--ease-hilo)_both] outline-none"
      >
        {paso === 0 && <PasoPieza datos={pieza} onCambio={setPieza} />}
        {paso === 1 && (
          <PasoReferencias referencias={referencias} onCambio={setReferencias} />
        )}
        {paso === 2 && (
          <PasoHora dias={dias} datos={contacto} onCambio={setContacto} />
        )}
      </div>

      {/* aria-live: quien usa lector de pantalla se entera de lo que falta sin
          tener que recorrer el formulario otra vez buscando el campo vacio. */}
      <p aria-live="polite" className="mt-8 min-h-[1.25rem] text-[0.875rem] text-primary">
        {mensajeError}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4">
        {paso > 0 && (
          <button
            type="button"
            onClick={() => ir(paso - 1)}
            className="hilo text-[0.9375rem] text-muted-foreground transition-colors duration-[var(--dur-color)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Volver
          </button>
        )}

        <button
          type="button"
          disabled={estado === "enviando"}
          onClick={() => {
            const falta = queFalta();
            if (falta) {
              setMensajeError(falta.mensaje);
              if (falta.campo) document.getElementById(falta.campo)?.focus();
              return;
            }
            setMensajeError("");
            esUltimo ? enviar() : ir(paso + 1);
          }}
          className="hilo hilo-boton relative inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-[background-color,transform,opacity] duration-[var(--dur-color)] hover:bg-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {estado === "enviando"
            ? "Enviando…"
            : esUltimo
              ? "Enviar mi encargo"
              : "Continuar"}
        </button>

        {paso === 1 && referencias.length === 0 && (
          <button
            type="button"
            onClick={() => ir(2)}
            className="hilo text-[0.9375rem] text-muted-foreground transition-colors duration-[var(--dur-color)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Saltar este paso
          </button>
        )}
      </div>
    </div>
  );
}
