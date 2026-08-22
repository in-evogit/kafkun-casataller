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

// ─── Pedidos de encargo ───────────────────────────────────────────────────────
// Un pedido NO es una compra: no hay precio ni pago. Son los datos con los que
// Katy llega preparada a la videollamada. Por eso vive acá y no en las órdenes.

const PEDIDOS_EMAIL = process.env.PEDIDOS_EMAIL ?? "kafkuntelares@gmail.com";

export type PedidoParams = {
  nombre: string;
  whatsapp: string;
  email: string;
  /** Qué quiere que le tejan. Ya viene validado contra la lista de tipos. */
  tipo: string;
  cuando: string;
  mensaje: string;
  /** Obra desde la que llegó, si entró por "quiero uno así". */
  ref: string;
};

/**
 * El mensaje y el nombre los escribe cualquiera, así que se escapan antes de
 * entrar al HTML del correo. Sin esto, un `<script>` en el mensaje viaja tal cual
 * al cliente de correo de Katy.
 */
function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parrafo(texto: string) {
  return escaparHtml(texto).replace(/\n/g, "<br>");
}

/** Le llega a Katy. Responder el correo le contesta directo a la persona. */
export async function sendPedidoAKaty(p: PedidoParams) {
  if (!resend) {
    console.log("[email] Pedido recibido, correo omitido (sin RESEND_API_KEY):", {
      nombre: p.nombre,
      tipo: p.tipo,
    });
    return;
  }

  const filas = [
    ["Nombre", p.nombre],
    ["WhatsApp", p.whatsapp],
    ["Correo", p.email],
    ["Qué quiere", p.tipo],
    ["Para cuándo", p.cuando || "No lo dijo"],
    ["Viene de la obra", p.ref || "Entró directo"],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#7A7167">${k}</td><td style="padding:4px 0"><strong>${escaparHtml(v)}</strong></td></tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: PEDIDOS_EMAIL,
    replyTo: p.email,
    subject: `Pedido de ${p.nombre} · ${p.tipo}`,
    html: `
      <h2>Nuevo pedido de encargo</h2>
      <table style="border-collapse:collapse;font-size:15px">${filas}</table>
      ${p.mensaje ? `<p style="color:#7A7167;margin-top:16px">Lo que te contó:</p><p>${parrafo(p.mensaje)}</p>` : ""}
      <p style="color:#7A7167;font-size:13px;margin-top:24px">
        Si respondes este correo le llega directo a ${escaparHtml(p.email)}.
      </p>
    `,
  });
}

/** Le llega a la persona, para que sepa que su pedido no se perdió. */
export async function sendPedidoConfirmacion(p: PedidoParams) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: p.email,
    subject: "Recibí tu pedido · Casa Taller Kafkún",
    html: `
      <h2>Hola ${escaparHtml(p.nombre)}</h2>
      <p>Recibí tu pedido. El siguiente paso es la videollamada: ahí conversamos qué quieres,
      vemos las medidas, definimos la lana y los materiales, y recién después de eso te digo
      el precio y el plazo.</p>
      <p>Si todavía no elegiste tu hora, puedes hacerlo acá:
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contacto">elegir mi hora</a>.</p>
      <p>Si tienes fotos de referencia, guárdalas y las vemos juntas en la reunión.</p>
      <p>Katy · Casa Taller Kafkún</p>
    `,
  });
}
