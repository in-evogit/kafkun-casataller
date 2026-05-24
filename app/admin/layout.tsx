import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Doble guardia: middleware (primera) + esta verificación server-side (segunda)
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/admin");

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleData?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-secondary">
        <div className="p-4">
          <span className="font-heading text-sm font-semibold text-primary">
            Admin · Kafkun
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/cursos", label: "Cursos" },
            { href: "/admin/productos", label: "Productos" },
            { href: "/admin/ordenes", label: "Órdenes" },
            { href: "/admin/alumnos", label: "Alumnos" },
            { href: "/admin/cupones", label: "Cupones" },
            { href: "/admin/reviews", label: "Reviews" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
