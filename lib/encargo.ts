/**
 * Disponibilidad y datos del encargo.
 *
 * Esto NO habla con Google Calendar ni con ninguna empresa externa, y no hace falta:
 * la disponibilidad vive acá, no en la agenda personal de Katy. Ella declara sus
 * ventanas y bloquea lo que no puede. A cambio, el sistema nunca va a "adivinar" que
 * tiene dentista el martes: si no lo bloquea, la hora se puede reservar.
 *
 * Las horas se calculan en el SERVIDOR y llegan al navegador ya resueltas como texto.
 * Si se calcularan en el cliente, el reloj del visitante y el del servidor darían
 * resultados distintos y React reventaría con un error de hidratación.
 */

/** Cuánto dura la conversación de encargo. */
export const DURACION_ENCUENTRO_MIN = 45;

/** Cuántos días hacia adelante se ofrecen. */
export const VENTANA_DIAS = 21;

/**
 * Cuántas horas de anticipación mínima. Sin esto, alguien puede reservar para dentro
 * de diez minutos y Katy se entera cuando ya pasó.
 */
export const ANTICIPACION_HORAS = 24;

export type VentanaSemanal = {
  /** 0 = domingo … 6 = sábado */
  dia: number;
  /** "HH:MM" en hora de Chile */
  desde: string;
  hasta: string;
};

/**
 * PROVISIONAL — estas ventanas las define KATY, no nosotros.
 * Están acá solo para que la interfaz tenga algo que dibujar mientras tanto.
 * Cuando exista el panel, esto sale de la base de datos y este arreglo se borra.
 */
export const VENTANAS_PROVISIONALES: VentanaSemanal[] = [
  { dia: 2, desde: "10:00", hasta: "13:00" }, // martes
  { dia: 4, desde: "15:00", hasta: "18:00" }, // jueves
  { dia: 6, desde: "10:00", hasta: "12:30" }, // sábado
];

/** Fechas puntuales que Katy bloquea. Formato "YYYY-MM-DD". También saldrá de la base. */
export const BLOQUEOS_PROVISIONALES: string[] = [];

export type Hora = {
  /** ISO completo con zona; es lo que se guarda y lo que va al .ics */
  iso: string;
  /** "10:00" ya formateado para mostrar */
  etiqueta: string;
};

export type DiaDisponible = {
  /** "YYYY-MM-DD" */
  fecha: string;
  /** "mar 2 sep" */
  etiqueta: string;
  /** "martes" */
  diaSemana: string;
  horas: Hora[];
};

const ZONA = "America/Santiago";

function minutosDe(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Chile cambia la hora en septiembre y en abril. Construir la fecha a mano sumando
 * milisegundos se corre una hora dos veces al año, y nadie entiende por qué. Se arma
 * con el formateador de zona horaria, que sí conoce el cambio.
 */
function isoEnChile(fecha: string, minutos: number): string {
  const h = String(Math.floor(minutos / 60)).padStart(2, "0");
  const m = String(minutos % 60).padStart(2, "0");
  const tentativa = new Date(`${fecha}T${h}:${m}:00`);

  // Descubre el desfase real de ESE día (−03:00 o −04:00 según corresponda).
  const enZona = new Date(tentativa.toLocaleString("en-US", { timeZone: ZONA }));
  const enUtc = new Date(tentativa.toLocaleString("en-US", { timeZone: "UTC" }));
  const desfaseMin = Math.round((enUtc.getTime() - enZona.getTime()) / 60000);

  return new Date(tentativa.getTime() + desfaseMin * 60000).toISOString();
}

/**
 * Arma los días con horas libres.
 *
 * `reservadas` son los ISO ya tomados. Hoy llega vacío; cuando exista la tabla de
 * reservas se le pasan las de verdad. Ojo: filtrar acá NO basta para impedir que dos
 * personas tomen la misma hora en el mismo segundo — eso lo tiene que impedir una
 * restricción única en Postgres, que es lo único atómico.
 */
export function generarDisponibilidad(
  ahora: Date,
  ventanas: VentanaSemanal[] = VENTANAS_PROVISIONALES,
  bloqueos: string[] = BLOQUEOS_PROVISIONALES,
  reservadas: string[] = []
): DiaDisponible[] {
  const tomadas = new Set(reservadas);
  const minimo = ahora.getTime() + ANTICIPACION_HORAS * 3600_000;
  const dias: DiaDisponible[] = [];

  for (let i = 0; i < VENTANA_DIAS; i++) {
    const d = new Date(ahora.getTime() + i * 86400_000);
    const fecha = d.toLocaleDateString("en-CA", { timeZone: ZONA }); // YYYY-MM-DD
    if (bloqueos.includes(fecha)) continue;

    // Mediodia a proposito: en el borde del cambio de hora, medianoche puede caer en
    // el dia anterior o saltarse una hora. A las 12:00 nunca pasa.
    const ref = new Date(`${fecha}T12:00:00`);
    const delDia = ventanas.filter((v) => v.dia === ref.getDay());
    if (delDia.length === 0) continue;

    const horas: Hora[] = [];
    for (const v of delDia) {
      for (
        let min = minutosDe(v.desde);
        min + DURACION_ENCUENTRO_MIN <= minutosDe(v.hasta);
        min += DURACION_ENCUENTRO_MIN
      ) {
        const iso = isoEnChile(fecha, min);
        if (new Date(iso).getTime() < minimo) continue;
        if (tomadas.has(iso)) continue;
        horas.push({
          iso,
          etiqueta: `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`,
        });
      }
    }
    if (horas.length === 0) continue;

    dias.push({
      fecha,
      etiqueta: ref.toLocaleDateString("es-CL", { day: "numeric", month: "short" }),
      diaSemana: ref.toLocaleDateString("es-CL", { weekday: "long" }),
      horas,
    });
  }

  return dias;
}

export const TIPOS_PIEZA = [
  { valor: "chaleco", etiqueta: "Un chaleco" },
  { valor: "bufanda", etiqueta: "Una bufanda o un chal" },
  { valor: "otra", etiqueta: "Otra cosa", ayuda: "Cuéntame abajo qué tienes en mente" },
] as const;

export const PLAZOS = [
  { valor: "sin-apuro", etiqueta: "Sin apuro" },
  { valor: "un-mes", etiqueta: "Dentro de un mes" },
  { valor: "tres-meses", etiqueta: "Dentro de tres meses" },
  { valor: "fecha", etiqueta: "Para una fecha concreta" },
] as const;

export const MAX_REFERENCIAS = 5;
export const MAX_PESO_MB = 8;
