"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/mis-cursos";

  const [serverError, setServerError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError("Email o contraseña incorrectos.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function sendMagicLink() {
    setServerError(null);
    const email = getValues("email");
    if (!email || !z.string().email().safeParse(email).success) {
      setServerError("Ingresa tu email primero para recibir el link.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    setMagicLinkSent(true);
  }

  if (magicLinkSent) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <p className="font-heading text-xl font-semibold text-foreground">
          Revisa tu email
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te enviamos un link de acceso. El link expira en 1 hora.
        </p>
        <button
          onClick={() => setMagicLinkSent(false)}
          className="mt-6 text-sm text-primary underline underline-offset-4"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Bienvenida de vuelta
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ingresa a tu cuenta para acceder a tus cursos
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/recuperar-password"
              className="text-xs text-primary hover:underline"
            >
              Olvidé mi contraseña
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-accent"
        >
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">o</span>
        <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={sendMagicLink}
      >
        Ingresar con link por email
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
