"use client";

import { useSyncExternalStore } from "react";

/**
 * Dos cosas que el navegador sabe y el servidor no, leidas como React 19 manda.
 *
 * POR QUE ESTE ARCHIVO EXISTE: los tres componentes que las necesitaban lo
 * resolvian con `useEffect(() => setEstado(...))`, que en React 19 es un error de
 * compilacion (`react-hooks/set-state-in-effect`) y no un detalle de estilo: ese
 * patron provoca un segundo render en cascada despues de pintar, y con el, el
 * parpadeo que se ve al cargar.
 *
 * `useSyncExternalStore` es la herramienta hecha para esto: devuelve un valor en el
 * servidor y otro en el cliente, sin estado y sin efecto.
 */

/**
 * false mientras se dibuja en el servidor, true una vez montado en el navegador.
 *
 * Hace falta para todo lo que sale de localStorage —el carrito, por ejemplo—:
 * el servidor no puede saber que hay dentro, y dibujarlo de una haria que el
 * HTML del servidor y el del navegador no coincidan.
 */
export function useMontado(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// El matchMedia se crea una sola vez, no en cada render: suscribirse y leer tienen
// que mirar el MISMO objeto o React ve un valor distinto en cada comprobacion.
const consultaMenosMovimiento =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

function suscribirMenosMovimiento(avisar: () => void) {
  if (!consultaMenosMovimiento) return () => {};
  consultaMenosMovimiento.addEventListener("change", avisar);
  return () => consultaMenosMovimiento.removeEventListener("change", avisar);
}

/**
 * true si la persona pidió menos movimiento en su sistema.
 *
 * No significa cero animacion: significa quitar el desplazamiento y quedarse con
 * opacidad y color, que siguen explicando el cambio sin marear a nadie.
 */
export function usePrefiereMenosMovimiento(): boolean {
  return useSyncExternalStore(
    suscribirMenosMovimiento,
    () => consultaMenosMovimiento?.matches ?? false,
    () => false // En el servidor se asume que sí hay movimiento.
  );
}
