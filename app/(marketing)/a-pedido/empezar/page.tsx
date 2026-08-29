import type { Metadata } from "next";
import FormularioEncargo from "@/components/encargo/formulario-encargo";
import { generarDisponibilidad } from "@/lib/encargo";

export const metadata: Metadata = {
  title: "Empezar mi encargo",
  description:
    "Cuéntame qué pieza tienes en mente, muéstrame tus referencias y agendamos una conversación. Tejido a telar por encargo, en Chile.",
};

// La disponibilidad depende de la hora actual: si se generara estatica, al dia
// siguiente ofreceria horas que ya pasaron.
export const dynamic = "force-dynamic";

export default function EmpezarEncargoPage() {
  // Se calcula en el SERVIDOR y llega resuelto al navegador. Si se calculara en el
  // cliente, el reloj del visitante y el del servidor darian resultados distintos
  // y React reventaria con un error de hidratacion.
  const dias = generarDisponibilidad(new Date());

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            A pedido
          </p>
          <h1 className="mt-4 text-balance font-heading text-[2.125rem] font-light leading-[1.05] tracking-[-0.018em] text-foreground md:text-[3.25rem]">
            Empecemos tu pieza
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Cuéntame qué tienes en mente y nos juntamos a conversarlo. El precio y el
            plazo salen después, cuando la pieza esté definida entre los dos.
          </p>
        </header>

        <div className="mt-16">
          <FormularioEncargo dias={dias} />
        </div>
      </div>
    </div>
  );
}
