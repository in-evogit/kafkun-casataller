"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function MiCuentaForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string;
  defaultPhone: string;
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage({ ok: false, text: "Sesión expirada. Vuelve a iniciar sesión." });
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: name.trim(), phone: phone.trim() });

    setMessage(
      error
        ? { ok: false, text: "Error al guardar. Intenta de nuevo." }
        : { ok: true, text: "Cambios guardados." }
    );
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground">Nombre completo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Teléfono</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="+56 9 1234 5678"
        />
      </div>

      {message && (
        <p
          className={`text-sm ${message.ok ? "text-green-700" : "text-destructive"}`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
