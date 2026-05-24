const stats = [
  { value: "+200", label: "alumnas tejiendo" },
  { value: "5.0", label: "rating promedio" },
  { value: "+50h", label: "de contenido" },
  { value: "∞", label: "acceso de por vida" },
];

export default function CredibilityBar() {
  return (
    <div className="bg-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="font-heading text-3xl font-semibold text-primary">
                {s.value}
              </dt>
              <dd className="mt-1 text-sm text-white/70">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
