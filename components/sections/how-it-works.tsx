const steps = [
  {
    number: "01",
    title: "Eliges tu curso",
    description: "Ves el programa completo, el nivel y el preview gratis de la primera lección.",
  },
  {
    number: "02",
    title: "Recibes acceso",
    description: "Al confirmar el pago tienes acceso inmediato. Sin esperas, sin trámites.",
  },
  {
    number: "03",
    title: "Aprendes a tu ritmo",
    description: "Videos en HD, pausas cuando quieras, vuelves a ver las veces que necesites.",
  },
  {
    number: "04",
    title: "Tejes tu primera obra",
    description: "Terminas el curso con una pieza real en tus manos y las bases para seguir.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-3 text-muted-foreground">
            De la decisión a tu primera pieza en 4 pasos
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col">
              {i < steps.length - 1 && (
                <div className="absolute left-8 top-5 hidden h-0.5 w-full bg-border lg:block" />
              )}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
