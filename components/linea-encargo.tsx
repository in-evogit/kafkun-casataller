import LineaTiempo from "@/components/linea-tiempo";
import { pasosEncargo } from "@/lib/data/proceso";

/**
 * El proceso del encargo sobre la linea de tiempo compartida.
 *
 * Antes eran cinco cajas sueltas en una reja: los numeros 01..05 no significaban nada
 * porque nada los unia. Ahora una sola linea los recorre y se va llenando al bajar.
 */
export default function LineaEncargo() {
  return (
    <LineaTiempo
      className="mt-14"
      orientacion="horizontal"
      hitos={pasosEncargo.map((p) => ({
        marca: p.n,
        titulo: p.titulo,
        texto: p.texto,
      }))}
    />
  );
}
