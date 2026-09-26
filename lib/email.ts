// Candado real, no un comentario: si alguien importa esto desde un componente
// de navegador, la compilacion FALLA en vez de empaquetar el secreto y mandarlo.
import "server-only";

import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "gabrielrivera2758@gmail.com";

type OrderNotificationParams = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ title: string; quantity: number; price_clp: number }>;
  total_clp: number;
  hasPhysicalItems: boolean;
};

function formatPrice(clp: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(clp);
}

export async function sendOrderConfirmation({
  orderId,
  customerName,
  customerEmail,
  items,
  total_clp,
}: OrderNotificationParams) {
  if (!resend) {
    console.log("[email] RESEND_API_KEY no configurado — email omitido:", { orderId, customerEmail });
    return;
  }

  const itemsHtml = items
    .map((i) => `<li>${i.quantity}× ${i.title} — ${formatPrice(i.price_clp * i.quantity)}</li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: "Tu compra en Casa Taller Kafkun está confirmada",
    html: `
      <h2>¡Hola ${customerName || ""}!</h2>
      <p>Tu pago fue recibido. Aquí el resumen:</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ${formatPrice(total_clp)}</strong></p>
      <p>Si compraste un curso, ya puedes acceder desde <a href="${process.env.NEXT_PUBLIC_SITE_URL}/mis-cursos">Mis cursos</a>.</p>
      <p>Gracias por confiar en Casa Taller Kafkun 🧶</p>
    `,
  });
}

export async function sendAdminOrderAlert({
  orderId,
  customerName,
  customerEmail,
  items,
  total_clp,
  hasPhysicalItems,
}: OrderNotificationParams) {
  if (!resend) {
    console.log("[email] Admin alert omitida (sin RESEND_API_KEY):", { orderId, hasPhysicalItems });
    return;
  }

  if (!hasPhysicalItems) return;

  const itemsHtml = items
    .map((i) => `<li>${i.quantity}× ${i.title} — ${formatPrice(i.price_clp * i.quantity)}</li>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🧺 Nueva orden con productos físicos — ${formatPrice(total_clp)}`,
    html: `
      <h2>Nueva orden con despacho</h2>
      <p><strong>Cliente:</strong> ${customerName || "Sin nombre"} (${customerEmail})</p>
      <p><strong>Orden:</strong> ${orderId}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: ${formatPrice(total_clp)}</strong></p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/ordenes">Ver en panel admin →</a></p>
    `,
  });
}

// ════════════════════════════════════════════════════════════════════════════
//  ENCARGOS, CONTACTO Y CORREO
//
//  Escrito el 26-sep-2026. Hasta hoy /api/encargo guardaba la solicitud y no
//  avisaba a NADIE: lo unico que hacia era escribir en los registros del
//  servidor "revisar la tabla encargos a mano". Alguien pedia un chaleco,
//  elegia hora, y se quedaba esperando.
// ════════════════════════════════════════════════════════════════════════════

/**
 * Escapa lo que escribio el visitante antes de meterlo en el HTML del correo.
 *
 * Hace falta de verdad: el nombre y la descripcion los escribe un desconocido,
 * y el correo lo abre Katty. Sin esto, un "nombre" como
 * `<a href="sitio-falso.cl">tu banco</a>` llega como un enlace de verdad
 * dentro de un correo que ella confia porque viene de su propio sitio.
 */
function esc(texto: string | null | undefined): string {
  return (texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Fecha y hora de la cita en palabras, en hora de Chile. */
function formatHora(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  }).format(new Date(iso));
}

const PIE_TALLER = `
  <p style="margin-top:28px;color:#6b6b6b;font-size:13px">
    Casa Taller Kafkün · <a href="https://instagram.com/casataller_kafkun">@casataller_kafkun</a>
  </p>`;

type EncargoParams = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string | null;
  tipo: string;
  descripcion: string;
  plazo?: string | null;
  horaIso: string | null;
  prefiereMensaje: boolean;
  cantidadReferencias: number;
};

/**
 * El aviso interno. Este es el correo que no existia y por el que se perdian
 * encargos.
 *
 * Lleva `replyTo` con el correo de quien encarga: asi Katty responde apretando
 * "responder" y le llega a la persona, sin copiar y pegar direcciones.
 */
export async function sendEncargoAviso(p: EncargoParams) {
  if (!resend) {
    console.warn(
      `[email] encargo ${p.id} SIN AVISO: falta RESEND_API_KEY. ` +
        `Revisar la tabla encargos a mano.`
    );
    return;
  }

  const cuando = p.prefiereMensaje
    ? "Prefiere coordinar por mensaje (no eligió hora)"
    : p.horaIso
      ? formatHora(p.horaIso)
      : "Sin hora";

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: p.email,
    subject: `Nuevo encargo: ${esc(p.tipo)} — ${esc(p.nombre)}`,
    html: `
      <h2 style="margin-bottom:4px">Nuevo encargo a pedido</h2>
      <p style="color:#6b6b6b;margin-top:0">Responde este correo y le llega directo a ${esc(p.nombre)}.</p>

      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        <tr><td><strong>Nombre</strong></td><td>${esc(p.nombre)}</td></tr>
        <tr><td><strong>Correo</strong></td><td>${esc(p.email)}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${esc(p.telefono) || "No dejó"}</td></tr>
        <tr><td><strong>Pieza</strong></td><td>${esc(p.tipo)}</td></tr>
        <tr><td><strong>Para cuándo</strong></td><td>${esc(p.plazo) || "No indicó"}</td></tr>
        <tr><td><strong>Cita</strong></td><td>${esc(cuando)}</td></tr>
        <tr><td><strong>Fotos</strong></td><td>${p.cantidadReferencias} adjuntas en el panel</td></tr>
      </table>

      <h3 style="margin-bottom:4px">Lo que quiere</h3>
      <p style="white-space:pre-wrap;background:#faf7f2;padding:12px;border-radius:6px">${esc(p.descripcion)}</p>

      <p style="color:#6b6b6b;font-size:13px">Encargo ${p.id}</p>
    `,
  });
}

/**
 * La confirmacion a quien encargo. Cierra el circulo: sin esto la persona
 * manda el formulario y no tiene ninguna prueba de que llego.
 *
 * No promete un precio. El precio del encargo sale conversando, con la pieza
 * definida — poner una cifra aca seria inventarle un numero a Katty.
 */
export async function sendEncargoConfirmacion(p: EncargoParams) {
  if (!resend) return;

  const cita = p.prefiereMensaje
    ? `<p>Te vamos a escribir para coordinar cuándo conversamos.</p>`
    : p.horaIso
      ? `<p>Quedamos de conversar el <strong>${esc(formatHora(p.horaIso))}</strong>.</p>`
      : "";

  await resend.emails.send({
    from: FROM,
    to: p.email,
    replyTo: ADMIN_EMAIL,
    subject: "Recibimos tu encargo · Casa Taller Kafkün",
    html: `
      <h2>¡Hola ${esc(p.nombre)}!</h2>
      <p>Recibí tu solicitud para tejer <strong>${esc(p.tipo)}</strong>. Ya está en mis manos.</p>
      ${cita}
      <p>En esa conversación definimos las medidas, la forma y la lana. Con la pieza
      definida sale el precio y el plazo — no antes, porque cada encargo es distinto.</p>
      <p>Si quieres agregar algo o mandarme más fotos, responde este mismo correo.</p>
      <p>Katty</p>
      ${PIE_TALLER}
    `,
  });
}

/** El aviso de un mensaje del formulario de contacto. */
export async function sendContactoAviso(p: {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
}) {
  if (!resend) {
    console.warn(`[email] contacto ${p.id} SIN AVISO: falta RESEND_API_KEY.`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: p.email,
    subject: `Mensaje de ${esc(p.nombre)} — kafkun`,
    html: `
      <h2 style="margin-bottom:4px">Mensaje desde el sitio</h2>
      <p style="color:#6b6b6b;margin-top:0">Responde este correo y le llega directo.</p>
      <p><strong>${esc(p.nombre)}</strong> · ${esc(p.email)}</p>
      <p style="white-space:pre-wrap;background:#faf7f2;padding:12px;border-radius:6px">${esc(p.mensaje)}</p>
    `,
  });
}

/**
 * La bienvenida al correo. Antes vivia dentro de /api/newsletter escrita a
 * mano; se trae aca para que todos los correos del sitio salgan del mismo
 * lugar y lleven el mismo pie.
 *
 * Lleva el enlace de baja SIEMPRE. No es un detalle legal nada mas: un correo
 * sin salida se marca como spam, y el spam se lo come el dominio entero.
 */
export async function sendBienvenidaCorreo(p: { email: string; tokenBaja: string }) {
  if (!resend) return;

  const urlBaja = `${process.env.NEXT_PUBLIC_SITE_URL}/api/newsletter/baja?t=${p.tokenBaja}`;

  await resend.emails.send({
    from: FROM,
    to: p.email,
    subject: "Te avisaré cuando abra cupos · Casa Taller Kafkün",
    html: `
      <h2>¡Hola!</h2>
      <p>Quedaste en la lista. Te escribo cuando abra cupos para un taller, cuando
      publique algo nuevo, o cuando haga un presencial.</p>
      <p>Nada más — no mando correos por mandar.</p>
      <p>Katty</p>
      ${PIE_TALLER}
      <p style="color:#9b9b9b;font-size:12px">
        Si no quieres recibir nada, <a href="${urlBaja}">bórrate de la lista acá</a>.
      </p>
    `,
  });
}
