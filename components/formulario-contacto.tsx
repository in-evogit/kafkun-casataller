"use client";

import { useRef, useState } from "react";

type Estado = "editando" | "enviando" | "listo" | "error";

const campo =
  "mt-2 w-full rounded-[2px] border border-border bg-background px-4 py-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground/60 transition-colors duration-[var(--dur-color)] hover:border-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";

/**
 * Formulario de contacto.
 *
 * OJO, Y ES IMPORTANTE: mientras Resend no este configurado, este formulario GUARDA
 * el mensaje pero NADIE le avisa a Katy. Por eso la confirmacion no dice "te
 * responderemos pronto" —seria mentir— sino que muestra tambien el correo directo,
 * para que quien tenga apuro no se quede esperando una respuesta que no va a llegar.
 *
 * El dia que exista Resend se borra esa nota y ya.
 */
export default function FormularioContacto() {
  const [estado, setEstado] = useState<Estado>("editando");
  const [aviso, setAviso] = useState("");
  const cajaRef = useRef<HTMLDivElement>(null);
  const [datos, setDatos] = useState({ nombre: "", email: "", mensaje: "" });

  const set = (p: Partial<typeof datos>) => setDatos({ ...datos, ...p });

  function queFalta(): { mensaje: string; campo?: string } | null {
    if (!datos.nombre.trim()) return { mensaje: "Falta tu nombre.", campo: "c-nombre" };
    if (!datos.email.trim())
      return { mensaje: "Falta tu correo, para poder responderte.", campo: "c-email" };
    if (!datos.mensaje.trim())
      return { mensaje: "Cuéntame en qué te puedo ayudar.", campo: "c-mensaje" };
    return null;
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const falta = queFalta();
    if (falta) {
      setAviso(falta.mensaje);
      if (falta.campo) document.getElementById(falta.campo)?.focus();
      return;
    }
    setAviso("");
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "No pudimos enviar tu mensaje.");
      }
      setEstado("listo");
      requestAnimationFrame(() => cajaRef.current?.focus());
    } catch (err) {
      setEstado("error");
      setAviso(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
    }
  }

  if (estado === "listo") {
    return (
      <div
        ref={cajaRef}
        tabIndex={-1}
        className="animate-[paso-entra_320ms_var(--ease-hilo)_both] rounded-[2px] border border-border bg-background p-8 outline-none shadow-[0_1px_2px_rgba(44,26,17,0.04),0_16px_40px_-16px_rgba(44,26,17,0.12)] sm:p-10"
      >
        <span aria-hidden className="block h-px w-12 bg-primary" />
        <h3 className="mt-5 font-heading text-[1.5rem] font-light text-foreground">
          Mensaje recibido
        </h3>
        <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          Gracias, {datos.nombre.split(" ")[0]}. Si tu consulta es urgente, escríbeme
          directo a{" "}
          <a
            href="mailto:kafkuntelares@gmail.com"
            className="hilo font-medium text-foreground"
          >
            kafkuntelares@gmail.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="rounded-[2px] border border-border bg-background p-6 shadow-[0_1px_2px_rgba(44,26,17,0.04),0_16px_40px_-16px_rgba(44,26,17,0.12)] sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-nombre" className="text-[0.875rem] font-medium text-foreground">
            Cómo te llamas
          </label>
          <input
            id="c-nombre"
            value={datos.nombre}
            onChange={(e) => set({ nombre: e.target.value })}
            autoComplete="name"
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="c-email" className="text-[0.875rem] font-medium text-foreground">
            Tu correo
          </label>
          <input
            id="c-email"
            type="email"
            value={datos.email}
            onChange={(e) => set({ email: e.target.value })}
            autoComplete="email"
            className={campo}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="c-mensaje" className="text-[0.875rem] font-medium text-foreground">
          En qué te puedo ayudar
        </label>
        <textarea
          id="c-mensaje"
          rows={5}
          value={datos.mensaje}
          onChange={(e) => set({ mensaje: e.target.value })}
          placeholder="Una duda sobre las clases, sobre un encargo, o sobre un pedido en camino…"
          className={campo}
        />
      </div>

      {/* aria-live: quien usa lector de pantalla se entera de lo que falta sin
          tener que recorrer el formulario buscando el campo vacio. */}
      <p aria-live="polite" className="mt-4 min-h-[1.25rem] text-[0.875rem] text-primary">
        {aviso}
      </p>

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="hilo hilo-boton relative mt-2 inline-flex h-12 items-center justify-center rounded-[2px] border border-primary bg-primary px-7 text-[0.9375rem] font-medium tracking-[0.02em] text-primary-foreground transition-[background-color,border-color,transform,opacity] duration-[var(--dur-color)] hover:border-accent hover:bg-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
