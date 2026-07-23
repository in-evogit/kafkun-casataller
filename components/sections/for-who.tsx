import { Sprout, TrendingUp, ShoppingBag } from "lucide-react";

const cards = [
  {
    icon: Sprout,
    title: "Nunca has tejido",
    description:
      "Empezamos desde armar el bastidor. Sin experiencia previa, sin jerga técnica. Solo tú, el telar y las ganas.",
    cta: "Empezar desde cero",
    href: "/cursos/tu-primer-telar",
  },
  {
    icon: TrendingUp,
    title: "Quieres mejorar tu técnica",
    description:
      "Ya tejiste algo pero sientes que te falta base. Acá trabajamos precisión, color y composición con intención.",
    cta: "Subir de nivel",
    href: "/cursos/telar-mapuche",
  },
  {
    icon: ShoppingBag,
    title: "Quieres tejer para vender",
    description:
      "Desarrollas tu propio lenguaje textil. Aprende a diseñar piezas únicas con identidad propia y valor de mercado.",
    cta: "Crear mi estilo",
    href: "/cursos/diseno-propio",
  },
];

export default function ForWho() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
            Tres formas de empezar
          </h2>
          <p className="mt-3 text-muted-foreground">
            Elige la que más te describe ahora mismo
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <a
                href={card.href}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                {card.cta} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
