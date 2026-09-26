"use client";

import { useState } from "react";

/**
 * Suscripcion al correo.
 *
 * Reescrito el 26-sep-2026 junto con /api/newsletter. Tres cosas que estaban mal:
 *
 *   1. El componente decidia su propia alineacion (`sm:justify-center`), pensado
 *      solo para la portada. Ahora la decide quien lo usa: en la cabecera del
 *      newsletter va a la izquierda, con el texto.
 *   2. Mostraba "Algo salió mal" pase lo que pase, ignorando el mensaje que
 *      manda el servidor —que ahora sabe distinguir un correo mal escrito de la
 *      base caida—.
 *   3. El error estaba posicionado con `sm:absolute sm:mt-12`, o sea flotando
 *      sobre lo que viniera debajo.
 */
export default function NewsletterForm({
  origen = "portada",
  alineacion = "centro",
}: {
  /** De donde llego la suscripcion. Se guarda: sirve para saber que parte del sitio trae gente. */
  origen?: string;
  alineacion?: "centro" | "izquierda";
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"quieto" | "enviando" | "listo" | "error">("quieto");
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setMensajeError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origen }),
      });

      if (res.ok) {
        setEstado("listo");
        return;
      }

      // El servidor sabe por que fallo; decirlo es mas util que "algo salio mal".
      const cuerpo = await res.json().catch(() => null);
      setMensajeError(cuerpo?.error ?? "No pudimos guardar tu correo. Intenta de nuevo.");
      setEstado("error");
    } catch {
      setMensajeError("No hay conexión. Revisa tu internet e intenta de nuevo.");
      setEstado("error");
    }
  }

  const centrado = alineacion === "centro";

  if (estado === "listo") {
    return (
      <p
        // aria-live para que un lector de pantalla anuncie el cambio: el formulario
        // desaparecio y sin esto no se dice nada.
        aria-live="polite"
        className={`animate-in fade-in duration-[var(--dur-color)] font-medium text-foreground ${
          centrado ? "text-center" : ""
        }`}
      >
        Quedaste en la lista. Te aviso cuando abra cupos.
      </p>
    );
  }

  return (
    <div className={centrado ? "w-full" : ""}>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-3 sm:flex-row sm:items-center ${
          centrado ? "sm:justify-center" : ""
        }`}
      >
        <label className="sr-only" htmlFor={`correo-${origen}`}>
          Tu correo
        </label>
        <input
          id={`correo-${origen}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.cl"
          aria-invalid={estado === "error"}
          className="w-full rounded-[2px] border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors duration-[var(--dur-color)] placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:w-72"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          // transform y no `all`: lo unico que se mueve al apretar es la escala.
          // --dur-toque (120ms) es el token del sitio para la respuesta al toque.
          className="rounded-[2px] bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-[var(--dur-toque)] ease-[var(--ease-std)] hover:bg-burdeos active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
        >
          {estado === "enviando" ? "Enviando…" : "Avísame"}
        </button>
      </form>

      {/* En flujo, no flotando encima de lo que venga debajo. */}
      {estado === "error" && mensajeError && (
        <p
          role="alert"
          className={`animate-in fade-in mt-3 text-sm text-destructive duration-[var(--dur-color)] ${
            centrado ? "text-center" : ""
          }`}
        >
          {mensajeError}
        </p>
      )}
    </div>
  );
}
