"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z
  .object({
    full_name: z.string().min(2, "Ingresa tu nombre completo"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(10, "Mínimo 10 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
      .regex(/[0-9]/, "Debe tener al menos un número"),
    confirm_password: z.string(),
    marketing_opt_in: z.boolean(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { marketing_opt_in: false },
  });

  const password = watch("password") ?? "";

  // Indicador de fuerza de contraseña
  const strength = [
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][strength];
  const strengthColor = ["", "bg-destructive", "bg-yellow-500", "bg-blue-500", "bg-green-500"][strength];

  async function onSubmit(data: FormData) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          marketing_opt_in: data.marketing_opt_in,
        },
      },
    });
    if (error) {
      setServerError("No pudimos crear tu cuenta. Intenta de nuevo.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-sm">
        <p className="font-heading text-xl font-semibold text-foreground">
          Revisa tu email
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te enviamos un link para confirmar tu cuenta.
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
        Crea tu cuenta
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Únete a más de 200 alumnas que ya están tejiendo
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Nombre completo</Label>
          <Input
            id="full_name"
            autoComplete="name"
            placeholder="María González"
            {...register("full_name")}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive">{errors.full_name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 10 caracteres"
            {...register("password")}
          />
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength ? strengthColor : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{strengthLabel}</span>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm_password">Confirmar contraseña</Label>
          <Input
            id="confirm_password"
            type="password"
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            {...register("confirm_password")}
          />
          {errors.confirm_password && (
            <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="marketing"
            onCheckedChange={(checked) =>
              setValue("marketing_opt_in", checked === true)
            }
          />
          <Label
            htmlFor="marketing"
            className="cursor-pointer text-sm font-normal text-muted-foreground"
          >
            Quiero recibir novedades, tips y descuentos exclusivos
          </Label>
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
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Ingresar
        </Link>
      </p>
    </div>
  );
}
