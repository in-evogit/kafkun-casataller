import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Reviews · Admin Kafkun",
  robots: { index: false },
};

async function toggleReview(id: string, published: boolean) {
  "use server";
  const { createAdminClient: admin } = await import("@/lib/supabase/admin");
  await admin().from("reviews").update({ published }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  const supabase = createAdminClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, published, created_at, profiles(full_name), courses(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">Aprueba o rechaza reseñas antes de publicarlas</p>

      <div className="mt-6 space-y-4">
        {(reviews ?? []).length === 0 ? (
          <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
            Sin reviews aún
          </div>
        ) : (
          (reviews ?? []).map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {(r.profiles as unknown as { full_name: string } | null)?.full_name ?? "Anónimo"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      → {(r.courses as unknown as { title: string } | null)?.title ?? "—"}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-amber-500">
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <form action={toggleReview.bind(null, r.id, !r.published)}>
                    <button
                      type="submit"
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        r.published
                          ? "bg-muted text-muted-foreground hover:bg-secondary"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {r.published ? "Despublicar" : "Aprobar"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
