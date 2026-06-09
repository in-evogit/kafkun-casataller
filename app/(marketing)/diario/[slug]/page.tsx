import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/diario/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image }],
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function DiarioPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/diario"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Diario de telar
        </Link>

        <div className="mt-6 relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="mt-8">
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            {post.category}
          </span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Por {post.author} ·{" "}
            {new Intl.DateTimeFormat("es-CL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(post.date))}
          </p>
        </div>

        <article className="prose prose-neutral mt-8 max-w-none [&_h2]:font-heading [&_h3]:font-heading [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline">
          <MDXRemote source={post.content} />
        </article>

        <div className="mt-12 rounded-xl border border-border bg-secondary p-6 text-center">
          <p className="font-heading text-lg font-semibold text-foreground">
            ¿Lista para empezar a tejer?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a nuestros cursos online y aprende a tu ritmo.
          </p>
          <Link
            href="/cursos"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-accent"
          >
            Ver cursos →
          </Link>
        </div>
      </main>
    </>
  );
}
