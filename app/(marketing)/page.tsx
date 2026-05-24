// Fase 2: construir landing completa con todas las secciones del MASTER_INSTRUCTIONS
export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-4 py-32 text-center">
      <h1 className="font-heading text-5xl font-semibold leading-tight text-foreground md:text-6xl">
        Tejer puede ser tu <br />
        <span className="text-primary">nuevo lugar favorito</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Cursos online de telar con acceso de por vida. Aprende desde cero,
        a tu ritmo, con Katy desde Chile.
      </p>
      <div className="flex gap-3">
        <a
          href="/cursos"
          className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-accent"
        >
          Ver cursos
        </a>
        <a
          href="/sobre-mi"
          className="rounded-md border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Conocer a Katy
        </a>
      </div>
    </section>
  );
}
