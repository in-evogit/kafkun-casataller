import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Diario de telar · Casa Taller Kafkun",
  description:
    "Consejos, técnicas y materiales para tejer. Aprende con Katy, instructora de telar en Chile.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/diario`,
  },
};

export default function DiarioPage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Diario de telar
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Consejos, técnicas y materiales para tejer mejor.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/diario/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {post.category}
                </span>
                <h2 className="mt-2 font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("es-CL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(post.date))}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Próximamente nuevos artículos.
          </p>
        )}
      </section>
    </main>
  );
}
