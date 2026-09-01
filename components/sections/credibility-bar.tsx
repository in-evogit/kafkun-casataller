// Datos confirmados por Katy (commit 03db920). No agregar cifras sin su confirmación.
const stats = [
  { value: "+50", label: "alumnas presenciales" },
  { value: "2015", label: "enseñando desde" },
  { value: "Mapuche", label: "técnica ancestral" },
];

/**
 * Franja de credibilidad. Es el único bloque de tinta de la portada: el contraste de campo
 * marca el corte entre el hero y el resto sin necesitar un divisor.
 */
export default function CredibilityBar() {
  return (
    <div className="relative overflow-hidden bg-foreground">
      <div className="textura-telar pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-heading text-[2.5rem] font-light leading-none text-background">
                {s.value}
              </dt>
              <dd className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-background/60">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
