"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Email inválido"),
});
type FormData = z.infer<typeof schema>;

export function RecoverForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const supabase = createClient();
    // No revelar si el email existe o no (seguridad)
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/mi-cuenta/nueva-password`,
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <p className="font-heading text-xl font-semibold text-foreground">
          Revisa tu email
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Si tu cuenta existe, te llegará un link para restablecer tu
          contraseña. Expira en 1 hora.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Recupera tu contraseña
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Te enviamos un link a tu email para restablecerla
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hola@ejemplo.cl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-accent"
        >
          {isSubmitting ? "Enviando…" : "Enviar link"}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
