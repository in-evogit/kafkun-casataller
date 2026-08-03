"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Identificación dentro del propio checkout, con enlace por correo.
 * /api/checkout responde 401 sin usuario y los enrollments cuelgan de user_id, así que
 * hay que identificarse antes de pagar. Se hace acá, sin contraseña y sin mandar a
 * /registro: sacar a la compradora del checkout para crear una cuenta es una de las
 * fugas mejor documentadas en producto digital.
 */
export default function CheckoutMagicLink() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado">("idle");
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    setError(null);

    const supabase = createClient();
    // Vuelve exactamente a esta pantalla, con el carrito y el ?curso= intactos.
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      window.location.pathname + window.location.search
    )}`;

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (err) {
      setError("No pudimos enviar el correo. Revisa la dirección e intenta de nuevo.");
      setEstado("idle");
      return;
    }
    setEstado("enviado");
  }

  if (estado === "enviado") {
    return (
      <div className="rounded-lg border border-border bg-secondary p-4 text-sm">
        <p className="font-medium text-foreground">Te enviamos un enlace a {email}</p>
        <p className="mt-1 text-muted-foreground">
          Ábrelo desde este mismo dispositivo y vuelves acá para pagar. Puede tardar un
          par de minutos; revisa también el correo no deseado.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-lg border border-border p-4">
      <div>
        <label htmlFor="checkout-email" className="text-sm font-medium text-foreground">
          Tu correo
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          Lo necesitamos para darte acceso al curso después del pago. Sin contraseña: te
          llega un enlace y listo.
        </p>
      </div>
      <input
        id="checkout-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tucorreo@ejemplo.cl"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando..." : "Enviarme el enlace"}
      </button>
    </form>
  );
}
