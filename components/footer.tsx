import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import IconoInstagram from "@/components/ui/icono-instagram";

/**
 * Pie del sitio.
 *
 * Gabriel pidio integrar el Footer4Col de mvpblocks. Se conserva su ESTRUCTURA —la
 * columna de marca a la izquierda, las columnas de enlaces a la derecha, la fila de
 * copyright abajo— y se descarta todo lo demas, que era de otro sitio:
 *
 *   - Nada de Dribbble, GitHub, Twitter ni Facebook: Katty tiene Instagram y correo.
 *     Poner iconos de redes que no existen es prometer canales que nadie atiende.
 *   - Fuera "Careers", "Employee Handbook", "Live Chat" y el puntito que parpadea:
 *     son de una agencia con equipo, no de una tejedora.
 *   - Fuera el glass con blur y los degradados rosa neon del demo: este sitio no
 *     brilla, y el rosa no es su color.
 *
 * SOBRE VINO, que es lo que pidio: el pie es el unico bloque de peso al cerrar la
 * pagina. Papel sobre este vino da 14.32:1, medido.
 *
 * Y CADA ENLACE SE ILUMINA AL PASAR EL MOUSE, que era el otro pedido: sobre fondo
 * oscuro el unico cambio de color no basta, asi que ademas se enciende un hilo bajo
 * el texto — el gesto firma del sitio.
 */
const columnas = [
  {
    titulo: "Aprende",
    enlaces: [
      { href: "/cursos", texto: "Todas las clases" },
      { href: "/cursos/tu-primer-telar", texto: "Taller inicial de telar" },
      { href: "/diario", texto: "Diario" },
    ],
  },
  {
    titulo: "A pedido",
    enlaces: [
      { href: "/a-pedido", texto: "Piezas a pedido" },
      { href: "/a-pedido/empezar", texto: "Empezar mi encargo" },
    ],
  },
  {
    titulo: "Casa Taller",
    enlaces: [
      { href: "/sobre-mi", texto: "Sobre mí" },
      { href: "/contacto", texto: "Contacto" },
    ],
  },
];

const enlaceClase =
  "group relative inline-block text-[0.9375rem] text-tinta-foreground/70 transition-colors duration-[var(--dur-color)] hover:text-tinta-foreground focus-visible:outline-none focus-visible:text-tinta-foreground";

function Hilo() {
  return (
    <span
      aria-hidden
      className="absolute -bottom-0.5 left-1/2 right-1/2 h-px bg-tinta-foreground transition-[left,right] duration-[var(--dur-hilo)] ease-[var(--ease-hilo)] group-hover:left-0 group-hover:right-0 group-focus-visible:left-0 group-focus-visible:right-0"
    />
  );
}

export default function Footer() {
  return (
    <footer className="bg-tinta">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="font-heading text-[1.375rem] font-semibold tracking-[-0.01em] text-tinta-foreground">
              Casa Taller Kafkún
            </p>
            <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-tinta-foreground/70">
              Piezas tejidas a mano por encargo y clases de telar, crochet y palillo.
              Desde el sur de Chile.
            </p>

            <ul className="mt-8 space-y-3">
              <li>
                <a
                  href="mailto:kafkuntelares@gmail.com"
                  className={`${enlaceClase} inline-flex items-center gap-2.5`}
                >
                  <Mail aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="relative">
                    kafkuntelares@gmail.com
                    <Hilo />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/casataller_kafkun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${enlaceClase} inline-flex items-center gap-2.5`}
                >
                  <IconoInstagram className="h-4 w-4 shrink-0" />
                  <span className="relative">
                    @casataller_kafkun
                    <Hilo />
                  </span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-[0.9375rem] text-tinta-foreground/55">
                <MapPin aria-hidden className="h-4 w-4 shrink-0" />
                Sur de Chile
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columnas.map((col) => (
              <div key={col.titulo}>
                <h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-tinta-foreground/45">
                  {col.titulo}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link href={e.href} className={enlaceClase}>
                        <span className="relative">
                          {e.texto}
                          <Hilo />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-tinta-foreground/15 pt-7 text-[0.8125rem] text-tinta-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Casa Taller Kafkún · Chile</p>
          {/* Los enlaces legales se quitan hasta que existan: enlazar a 404 desde el
              pie es peor que no tenerlos. Vuelven cuando Katty entregue sus datos. */}
          <p className="text-tinta-foreground/40">Tejido a mano, pieza por pieza.</p>
        </div>
      </div>
    </footer>
  );
}
