export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-heading text-4xl font-semibold text-primary">
        Casa Taller Kafkun
      </h1>
      <p className="font-sans text-lg text-muted-foreground">
        Plataforma en construcción — Fase 0 completada
      </p>
      <div className="flex gap-3">
        <div className="h-8 w-24 rounded bg-primary" title="#9B2335 carmesí" />
        <div className="h-8 w-24 rounded bg-accent" title="#7C1D2B hover" />
        <div className="h-8 w-24 rounded border bg-secondary" title="#FDF5F5 surface" />
        <div className="h-8 w-24 rounded bg-foreground" title="#1A0A0E texto" />
      </div>
    </main>
  );
}
