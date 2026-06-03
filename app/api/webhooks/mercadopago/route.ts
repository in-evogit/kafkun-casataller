import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { webhookLimiter, rateLimit } from "@/lib/ratelimit";
import { sendOrderConfirmation, sendAdminOrderAlert } from "@/lib/email";
import { emitirBoleta } from "@/lib/openfactura";

export async function POST(req: NextRequest) {
  // Rate limit por IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await rateLimit(webhookLimiter, ip);
  if (!allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";

  // Verificación HMAC obligatoria
  if (!process.env.MP_WEBHOOK_SECRET) {
    console.error("[webhook] MP_WEBHOOK_SECRET no configurado");
    return new NextResponse("Not configured", { status: 503 });
  }

  const parts = Object.fromEntries(
    signature.split(",").map((kv) => kv.split("=").map((s) => s.trim()))
  );
  const ts = parts["ts"];
  const hash = parts["v1"];

  if (!ts || !hash) {
    return new NextResponse("Invalid signature format", { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const dataId = (data.data as Record<string, unknown>)?.id ?? "";
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(hash);

  if (
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    console.warn("[webhook] Firma inválida. requestId:", requestId);
    return new NextResponse("Invalid signature", { status: 401 });
  }

  // Solo procesar eventos de pago
  if (data.type !== "payment") {
    return new NextResponse("ok");
  }

  const supabase = createAdminClient();

  // Idempotencia — evitar procesar el mismo evento dos veces
  const { data: existing } = await supabase
    .from("audit_log")
    .select("id")
    .eq("action", "webhook_mp")
    .eq("metadata->request_id", requestId)
    .maybeSingle();

  if (existing) {
    return new NextResponse("ok"); // ya procesado
  }

  // Registrar en audit_log antes de procesar
  await supabase.from("audit_log").insert({
    action: "webhook_mp",
    entity_type: "payment",
    metadata: { request_id: requestId, data_id: dataId, ts },
  });

  // Consultar estado real del pago a MP (no confiar en el payload)
  if (!process.env.MP_ACCESS_TOKEN) {
    return new NextResponse("ok");
  }

  try {
    const { MercadoPagoConfig, Payment } = await import("mercadopago");
    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const paymentApi = new Payment(mpClient);
    const payment = await paymentApi.get({ id: String(dataId) });

    if (payment.status !== "approved") {
      return new NextResponse("ok"); // pago no aprobado, nada que hacer
    }

    const userId = payment.external_reference;
    const orderId = payment.id ? String(payment.id) : null;

    if (!userId || !orderId) {
      console.error("[webhook] Faltan datos del pago:", payment);
      return new NextResponse("ok");
    }

    // Crear orden en base de datos
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        mp_payment_id: orderId,
        status: "paid",
        total_clp: payment.transaction_amount ?? 0,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[webhook] Error creando orden:", orderError);
      return new NextResponse("Internal error", { status: 500 });
    }

    // Crear enrollments para cursos comprados
    type PaymentItem = { id: string; type: string; title?: string; price_clp?: number; quantity?: number };
    const metadata = payment.metadata as Record<string, unknown> | null;
    const items = (metadata?.items as PaymentItem[]) ?? [];
    const courseIds = items
      .filter((i) => i.type === "course")
      .map((i) => i.id);

    if (courseIds.length > 0) {
      // Obtener UUIDs de cursos por slug
      const { data: courses } = await supabase
        .from("courses")
        .select("id, slug")
        .in("slug", courseIds);

      if (courses && courses.length > 0) {
        await supabase.from("enrollments").insert(
          courses.map((c) => ({
            user_id: userId,
            course_id: c.id,
            order_id: order.id,
          }))
        );
      }
    }

    // Enviar emails de confirmación
    const customerEmail = payment.payer?.email ?? "";
    const customerName = [payment.payer?.first_name, payment.payer?.last_name]
      .filter(Boolean)
      .join(" ");
    const hasPhysicalItems = items.some((i) => i.type === "product");
    const emailItems = items.map((i) => ({
      title: i.title ?? i.id,
      quantity: i.quantity ?? 1,
      price_clp: i.price_clp ?? 0,
    }));

    const boletaItems = emailItems.map((i) => ({
      description: i.title,
      quantity: i.quantity,
      unitPrice: i.price_clp,
    }));

    await Promise.all([
      sendOrderConfirmation({
        orderId: order.id,
        customerName,
        customerEmail,
        items: emailItems,
        total_clp: payment.transaction_amount ?? 0,
        hasPhysicalItems,
      }),
      sendAdminOrderAlert({
        orderId: order.id,
        customerName,
        customerEmail,
        items: emailItems,
        total_clp: payment.transaction_amount ?? 0,
        hasPhysicalItems,
      }),
      emitirBoleta({
        orderId: order.id,
        customerName,
        customerEmail,
        items: boletaItems,
        total_clp: payment.transaction_amount ?? 0,
      }).catch((err) => console.error("[webhook] Error emitiendo boleta:", err)),
    ]);

    // Actualizar audit_log con resultado
    await supabase
      .from("audit_log")
      .update({ metadata: { request_id: requestId, data_id: dataId, status: "processed" } })
      .eq("action", "webhook_mp")
      .eq("metadata->request_id", requestId);

  } catch (err) {
    console.error("[webhook] Error procesando pago:", err);
    return new NextResponse("Internal error", { status: 500 });
  }

  return new NextResponse("ok");
}
