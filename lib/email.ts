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
