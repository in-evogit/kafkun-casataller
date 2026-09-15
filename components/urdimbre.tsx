/**
 * Urdimbre: los hilos del telar dibujados con CSS.
 *
 * Gabriel pidio "algo mas representativo de lo que es la marca, algun diseño con
 * referencia a lanas... tal vez con framer motion".
 *
 * NO se uso framer-motion, y la razon es concreta: el sitio no tiene ni una libreria
 * de animacion, y meter una costaria 50-70 KB en la ruta mas critica. Todo esto lo
 * hace CSS con una keyframe de seis lineas.
 *
 * Los hilos tienen anchos y colores irregulares a proposito. Una reja pareja se lee
 * como un patron de fondo generico; una urdimbre de verdad tiene hilos de distinto
 * grosor y tono, que es lo que la hace reconocible.
 *
 * Decorativa: aria-hidden y sin contenido. Y el bloque global de prefers-reduced-motion
 * ya la deja quieta sin que haya que hacer nada aqui.
 */
const hilos = [
  { x: 4, w: 2, tono: 0.20 },
  { x: 9, w: 1, tono: 0.12 },
  { x: 13, w: 4, tono: 0.34 },
  { x: 20, w: 1, tono: 0.10 },
  { x: 24, w: 2, tono: 0.24 },
  { x: 29, w: 6, tono: 0.16 },
  { x: 38, w: 1, tono: 0.30 },
  { x: 42, w: 3, tono: 0.14 },
  { x: 48, w: 2, tono: 0.26 },
  { x: 53, w: 5, tono: 0.11 },
  { x: 61, w: 1, tono: 0.32 },
  { x: 65, w: 3, tono: 0.18 },
  { x: 71, w: 2, tono: 0.13 },
  { x: 76, w: 4, tono: 0.28 },
  { x: 83, w: 1, tono: 0.15 },
  { x: 87, w: 2, tono: 0.22 },
  { x: 92, w: 3, tono: 0.12 },
  { x: 97, w: 1, tono: 0.30 },
];

export default function Urdimbre({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className ?? ""}`}>
      {hilos.map((h, i) => (
        <span
          key={h.x}
          className="hilo-urdimbre absolute top-0 bottom-0 bg-primary"
          style={{
            left: `${h.x}%`,
            width: `${h.w}px`,
            opacity: h.tono,
            // Retardo escalonado: los hilos se montan de izquierda a derecha, como
            // se urde de verdad. Corto, para que no se haga esperar.
            animationDelay: `${i * 38}ms`,
          }}
        />
      ))}
    </div>
  );
}
