"use client";

import { useState } from "react";
import CalEmbed from "@/components/cal-embed";

/**
 * Formulario del encargo.
 *
 * El orden importa: primero los datos, después la hora. Así el pedido le llega a Katy
 * aunque la persona abandone antes de agendar, y el calendario aparece ya precargado
 * con lo que acaba de escribir en vez de pedírselo de nuevo.
 *
 * Acá no hay precio, ni carrito, ni pago. El precio sale de la videollamada.
 */

const TIPOS = [
  { id: "chaleco", label: "Chaleco" },
  { id: "bufanda", label: "Bufanda" },
  { id: "otro", label: "Otro tejido" },
] as const;

type Tipo = (typeof TIPOS)[number]["id"];

const ETIQUETA_CAMPO =
  "block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground";

const CAMPO =
  "mt-2 w-full rounded-[2px] border border-border-strong bg-background px-4 py-3 text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function PedidoForm({ refObra = "" }: { refObra?: string }) {
  const [tipo, setTipo] = useState<Tipo>("chaleco");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cuando, setCuando] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "listo" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setError("");
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          whatsapp,
          email,
          tipo,
          cuando,
          mensaje,
          ref: refObra,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No pude enviar tu pedido. Intenta de nuevo.");
        setEstado("error");
        return;
      }
      setEstado("listo");
    } catch {
      setError("No pude enviar tu pedido. Revisa tu conexión e intenta de nuevo.");
      setEstado("error");
    }
  }

  // Enviado: el pedido ya está con Katy y ahora sólo falta la hora.
  if (estado === "listo") {
    const etiqueta = TIPOS.find((t) => t.id === tipo)?.label ?? "";
    return (
      <div>
        <div className="border-t border-border pt-7">
          <div className="flex items-baseline gap-3.5">
            <span className="font-heading text-[0.9375rem] text-muted-foreground">03</span>
            <h2 className="font-heading text-[1.625rem] font-light text-foreground">
              Elige tu hora
            </h2>
          </div>
          <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
            Tu pedido ya me llegó, {nombre.split(" ")[0]}. Elige el horario que te
            acomode y te llega el link de la videollamada a {email}.
          </p>
        </div>
        <div className="mt-7">
          <CalEmbed
            nombre={nombre}
            email={email}
            notas={[etiqueta, cuando, mensaje].filter(Boolean).join(" · ")}
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false}>
      {/* 01 · Datos */}
      <div className="border-t border-border pt-7">
        <div className="flex items-baseline gap-3.5">
          <span className="font-heading text-[0.9375rem] text-muted-foreground">01</span>
          <h2 className="font-heading text-[1.625rem] font-light text-foreground">
            Tus datos
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className={ETIQUETA_CAMPO}>
              Tu nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre y apellido"
              className={CAMPO}
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className={ETIQUETA_CAMPO}>
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              minLength={8}
              maxLength={25}
              autoComplete="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+56 9"
              className={CAMPO}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="email" className={ETIQUETA_CAMPO}>
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ahí te llega el link de la videollamada"
            className={CAMPO}
          />
        </div>
      </div>

      {/* 02 · Qué quiere */}
      <fieldset className="mt-10 border-t border-border pt-7">
        <div className="flex items-baseline gap-3.5">
          <span className="font-heading text-[0.9375rem] text-muted-foreground">02</span>
          <legend className="font-heading text-[1.625rem] font-light text-foreground">
            Qué quieres que teja
          </legend>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {TIPOS.map((t) => {
            const activo = tipo === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipo(t.id)}
                aria-pressed={activo}
                className={`inline-flex h-11 items-center rounded-[2px] px-5 text-[0.9375rem] transition-colors duration-[var(--dur-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  activo
                    ? "border-[1.5px] border-primary bg-primary/[0.06] font-medium text-primary"
                    : "border border-border-strong text-foreground hover:border-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <label htmlFor="cuando" className={ETIQUETA_CAMPO}>
            ¿Para cuándo lo necesitas?
          </label>
          <input
            id="cuando"
            name="cuando"
            maxLength={120}
            value={cuando}
            onChange={(e) => setCuando(e.target.value)}
            placeholder="Un mes, para un cumpleaños, sin apuro…"
            className={CAMPO}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="mensaje" className={ETIQUETA_CAMPO}>
            Cuéntame un poco más
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={4}
            maxLength={1500}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Colores que te gustan, cómo lo vas a usar, si viste algo mío que te tincó…"
            className={`${CAMPO} resize-y`}
          />
          <p className="mt-2 text-[0.8125rem] text-muted-foreground">
            Si tienes fotos de referencia, guárdalas: las vemos juntas en la videollamada.
          </p>
        </div>
      </fieldset>

      <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-border pt-7">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="hilo hilo-boton relative inline-flex h-13 items-center justify-center rounded-[2px] bg-primary px-8 text-base font-medium tracking-[0.02em] text-primary-foreground transition-colors duration-[var(--dur-color)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Enviar y elegir mi hora"}
        </button>
        <p className="text-[0.875rem] text-muted-foreground">
          Después eliges el horario de la videollamada.
        </p>
      </div>

      {estado === "error" && (
        <p role="alert" className="mt-4 text-[0.9375rem] text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
