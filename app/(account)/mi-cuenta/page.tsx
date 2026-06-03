import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MiCuentaForm from "./form";

export const metadata: Metadata = {
  title: "Mi cuenta · Casa Taller Kafkun",
  robots: { index: false },
};

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { full_name: string | null; phone: string | null } | null = null;

  if (user) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Mi cuenta
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      <div className="mt-8">
        <MiCuentaForm
          defaultName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
        />
      </div>
    </div>
  );
}
