import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-primary-foreground md:text-5xl">
          ¿Lista para tejer tu primera pieza?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Acceso inmediato · Garantía 7 días · De por vida
        </p>
        <Link
          href="/cursos"
          className="mt-8 inline-block rounded-md bg-primary-foreground px-8 py-4 font-semibold text-primary transition-opacity hover:opacity-90"
        >
          Quiero empezar →
        </Link>
      </div>
    </section>
  );
}
