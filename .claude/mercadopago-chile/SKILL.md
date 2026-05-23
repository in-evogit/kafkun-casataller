---
name: mercadopago-chile
description: >
  Skill experto en integración de Mercado Pago en Chile para Next.js. USAR SIEMPRE que el usuario mencione: Mercado Pago, MercadoPago, MP, checkout, pasarela de pago, payment gateway, integración de pagos, procesamiento de tarjetas, cuotas, cuotas sin interés, Webpay, Transbank, Flow Chile, pagos online Chile, comisiones de pago, preferencias de pago, preference, init_point, sandbox, test cards, webhook de MP, notification URL, x-signature, idempotencia de pagos, refund, devolución, chargeback, boleta electrónica, SII, OpenFactura, Bsale, factura, RUT, pesos chilenos, CLP, payment_id, external_reference, back_urls, auto_return. También activar al construir checkout, carrito, página de éxito de pago, manejo de fallos de pago, o cualquier flujo financiero.
---

# Mercado Pago Chile — Integración Completa

Este skill cubre la integración production-grade de Mercado Pago para Chile en Next.js. La pasarela más usada en LATAM, mejor SDK que Webpay/Flow, soporta cuotas sin interés.

## Filosofía Central

**El usuario nunca debe pagar dos veces. Tu DB nunca debe creer que pagó cuando no pagó. El único trigger válido para "está pagado" es el webhook firmado verificado.**

Todo lo demás es UX.

## Las 8 Reglas Absolutas

1. **NUNCA manejar números de tarjeta en backend propio.** Usar Checkout Pro (hospedado por MP). El usuario pone la tarjeta en el dominio de MP, no en el tuyo.

2. **NUNCA confiar en el redirect `/pago/exito` para crear enrollments.** El frontend puede manipularse. Solo el webhook firmado lo dispara.

3. **SIEMPRE verificar la firma HMAC del webhook con `timingSafeEqual`**, nunca `===`.

4. **SIEMPRE consultar a la API de MP** el estado real del pago tras recibir webhook, no confiar en el payload.

5. **SIEMPRE implementar idempotencia** (mismo `request-id` no se procesa dos veces).

6. **SIEMPRE usar `external_reference`** para mapear el `payment_id` de MP con tu orden interna.

7. **SIEMPRE usar HTTPS en `notification_url`**, MP rechaza HTTP.

8. **NUNCA loggear el access token** ni el webhook secret. Sanitizar antes.

## Setup Inicial

### 1. Cuenta y credenciales

1. Crear cuenta en https://www.mercadopago.cl
2. Ir a https://www.mercadopago.com.cl/developers/panel
3. Crear "aplicación" tipo "Pagos en línea con Checkout Pro"
4. Obtener:
   - `ACCESS_TOKEN` de **producción** y de **test** (sandbox)
   - `PUBLIC_KEY` (solo si usas SDK del cliente)
   - `WEBHOOK_SECRET` (para verificar firma)

### 2. Variables de entorno

```
# .env.local

# Test (sandbox)
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxx
MP_WEBHOOK_SECRET=xxxxxxxxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxxxxxx

# Producción (Vercel env)
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxx
MP_WEBHOOK_SECRET=xxxxxxxxxx
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxxxxxx
```

### 3. Instalación

```bash
npm install mercadopago
```

## Flujo Completo de Pago

```
1. Usuario clickea "Comprar"
2. POST /api/checkout con items
3. Backend valida items y precios (DB), crea Order interna 'pending'
4. Backend llama a MP Preference API, obtiene init_point (URL)
5. Backend retorna init_point al frontend
6. Frontend redirige a init_point (checkout hospedado de MP)
7. Usuario paga en MP (MP maneja la tarjeta)
8. MP redirige a back_urls.success/failure/pending con query params
9. EN PARALELO MP envía POST a notification_url con notificación
10. Tu webhook verifica firma, consulta MP, actualiza Order, crea Enrollments
11. Email transaccional al usuario con acceso al curso
```

## Crear Preferencia de Pago

```typescript
// app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getUser } from '@/lib/auth';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 10000 },
});

const schema = z.object({
  items: z.array(z.object({
    type: z.enum(['course', 'product']),
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(20),
  coupon_code: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  // 1) Auth
  const user = await getUser();
  if (!user) return Response.json({ error: 'Auth required' }, { status: 401 });

  // 2) Validar input
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { items, coupon_code } = parsed.data;

  // 3) Cargar items reales de DB (NUNCA confiar en precios del cliente)
  const itemsWithPrices = await loadItemsFromDb(items);
  const total = itemsWithPrices.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  // 4) Aplicar cupón si existe (validar server-side)
  const finalTotal = coupon_code
    ? await applyCoupon(total, coupon_code, user.id)
    : total;

  // 5) Crear order interna
  const { data: order } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      total_clp: finalTotal,
    })
    .select()
    .single();

  // 5b) Crear order_items
  await supabaseAdmin.from('order_items').insert(
    itemsWithPrices.map(i => ({
      order_id: order.id,
      item_type: i.type,
      [`${i.type}_id`]: i.id,
      quantity: i.quantity,
      unit_price_clp: i.unit_price,
    }))
  );

  // 6) Crear preferencia en MP
  const preference = await new Preference(client).create({
    body: {
      items: itemsWithPrices.map(i => ({
        id: i.id,
        title: i.title,
        quantity: i.quantity,
        unit_price: i.unit_price,
        currency_id: 'CLP',
        category_id: i.type === 'course' ? 'learnings' : 'art',
      })),
      payer: {
        email: user.email,
        name: user.full_name,
      },
      external_reference: order.id, // ← MAPEO clave
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/exito?order=${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/fallo?order=${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/pendiente?order=${order.id}`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'KATY TELAR',
      payment_methods: {
        installments: 3, // hasta 3 cuotas sin interés (depende del banco)
      },
    },
  });

  // 7) Guardar preference_id en order
  await supabaseAdmin
    .from('orders')
    .update({ mp_preference_id: preference.id })
    .eq('id', order.id);

  // 8) Retornar init_point al cliente
  return Response.json({
    init_point: preference.init_point,
    order_id: order.id,
  });
}
```

## Webhook con Verificación HMAC

```typescript
// app/api/webhooks/mercadopago/route.ts
import crypto from 'crypto';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase/admin';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';

  // 1) Parsear header: ts=xxxxxx,v1=hash
  const parts = Object.fromEntries(
    signature.split(',').map(kv => {
      const [k, v] = kv.split('=').map(s => s.trim());
      return [k, v];
    })
  );
  const ts = parts.ts;
  const receivedHash = parts.v1;

  if (!ts || !receivedHash) {
    return new Response('Missing signature components', { status: 401 });
  }

  // 2) Extraer dataId del payload o query string
  let dataId = '';
  try {
    const payload = JSON.parse(rawBody);
    dataId = payload?.data?.id ?? '';
  } catch {}

  // Fallback: a veces viene en query string
  if (!dataId) {
    const url = new URL(req.url);
    dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '';
  }

  if (!dataId) {
    return new Response('Missing data.id', { status: 400 });
  }

  // 3) Construir manifest según docs de MP
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expectedHash = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
    .update(manifest)
    .digest('hex');

  // 4) Comparar timing-safe
  const valid = crypto.timingSafeEqual(
    Buffer.from(expectedHash, 'hex'),
    Buffer.from(receivedHash, 'hex')
  );
  if (!valid) {
    console.warn('[MP webhook] Invalid signature', { requestId });
    return new Response('Invalid signature', { status: 401 });
  }

  // 5) Idempotencia: ¿ya procesamos este request-id?
  const { data: existing } = await supabaseAdmin
    .from('audit_log')
    .select('id')
    .eq('action', 'mp_webhook_processed')
    .eq('metadata->>request_id', requestId)
    .maybeSingle();

  if (existing) {
    return new Response('Already processed', { status: 200 });
  }

  // 6) Consultar estado REAL del pago (no confiar en payload)
  const paymentData = await new Payment(client).get({ id: dataId });
  const status = paymentData.status; // 'approved' | 'rejected' | 'pending' | etc.
  const externalReference = paymentData.external_reference; // = order.id interno
  const paymentId = paymentData.id;

  if (!externalReference) {
    return new Response('No external_reference', { status: 400 });
  }

  // 7) Actualizar order según status
  if (status === 'approved') {
    // Actualizar order
    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        mp_payment_id: String(paymentId),
        paid_at: new Date().toISOString(),
      })
      .eq('id', externalReference)
      .eq('status', 'pending') // ← solo si todavía estaba pending
      .select()
      .single();

    if (order) {
      // Crear enrollments para cursos en esta orden
      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)
        .eq('item_type', 'course');

      if (items && items.length > 0) {
        await supabaseAdmin.from('enrollments').insert(
          items.map(i => ({
            user_id: order.user_id,
            course_id: i.course_id,
            order_id: order.id,
          }))
        );
      }

      // Enviar email transaccional
      await sendOrderConfirmationEmail(order.id);

      // Emitir boleta electrónica (OpenFactura)
      await emitBoleta(order.id);
    }
  } else if (status === 'rejected') {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', externalReference);
  }

  // 8) Registrar en audit_log para idempotencia
  await supabaseAdmin.from('audit_log').insert({
    action: 'mp_webhook_processed',
    entity_type: 'order',
    entity_id: externalReference,
    metadata: { request_id: requestId, payment_id: paymentId, status },
  });

  return new Response('ok', { status: 200 });
}
```

## Página `/pago/exito`

```typescript
// app/pago/exito/page.tsx
import { redirect } from 'next/navigation';

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) redirect('/');

  // Esperar hasta 5s a que el webhook actualice la orden
  // (mientras tanto mostrar "procesando pago...")
  let order = await fetchOrder(orderId);
  let attempts = 0;
  while (order?.status === 'pending' && attempts < 5) {
    await new Promise(r => setTimeout(r, 1000));
    order = await fetchOrder(orderId);
    attempts++;
  }

  if (order?.status === 'paid') {
    return <OrderPaidView order={order} />;
  } else if (order?.status === 'pending') {
    return <OrderPendingView />;
  } else {
    return <OrderFailedView />;
  }
}
```

**Nota:** la redirección del frontend NO es prueba de pago. Solo el webhook lo es. Esta página espera unos segundos a que el webhook procese, pero si no termina, muestra "pendiente" y deja que el webhook complete asíncrono. El usuario recibirá el email cuando se confirme.

## Tarjetas de Prueba (Sandbox Chile)

```
Mastercard aprobada:   5031 7557 3453 0604, CVV 123, vencimiento 11/30, nombre APRO
Visa aprobada:         4509 9535 6623 3704, CVV 123, vencimiento 11/30, nombre APRO
Tarjeta rechazada:     usar nombre OTHE en cualquier tarjeta
Pago pendiente:        usar nombre CONT
Insuficiente saldo:    usar nombre FUND
Tarjeta vencida:       usar nombre EXPI
Seguridad inválida:    usar nombre SECU
```

Probar TODOS estos casos antes de pasar a producción.

## Boletas Electrónicas (Chile, obligatorio SII)

Tras webhook con pago `approved`, emitir boleta vía OpenFactura o Bsale:

```typescript
// lib/boleta.ts
export async function emitBoleta(orderId: string) {
  const order = await fetchOrderWithItemsAndUser(orderId);

  const response = await fetch('https://api.haulmer.com/v2/dte/document', {
    method: 'POST',
    headers: {
      'apikey': process.env.OPENFACTURA_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Encabezado: {
        IdDoc: { TipoDTE: 39 /* Boleta */, FchEmis: new Date().toISOString().slice(0, 10) },
        Emisor: { /* tus datos de empresa */ },
        Receptor: {
          RUTRecep: order.user.rut,
          RznSocRecep: order.user.full_name,
        },
        Totales: { MntTotal: order.total_clp },
      },
      Detalle: order.items.map((item, idx) => ({
        NroLinDet: idx + 1,
        NmbItem: item.title,
        QtyItem: item.quantity,
        PrcItem: item.unit_price_clp,
      })),
    }),
  });

  const data = await response.json();
  // Guardar URL del PDF en order.boleta_url
  await supabaseAdmin
    .from('orders')
    .update({ boleta_url: data.urlpdf })
    .eq('id', orderId);
}
```

## Refunds (Devoluciones)

```typescript
import { Payment } from 'mercadopago';

export async function refundPayment(paymentId: string, amount?: number) {
  const result = await new Payment(client).refund({
    id: paymentId,
    body: amount ? { amount } : undefined, // sin amount = refund total
  });

  // Actualizar orden interna
  await supabaseAdmin
    .from('orders')
    .update({ status: 'refunded' })
    .eq('mp_payment_id', paymentId);

  // Revocar enrollments si aplica
  // ...
}
```

## Comisiones (referencia, verificar con MP)

| Plan | Comisión por venta |
|------|---------------------|
| Estándar | ~3.19% + IVA |
| Cuotas sin interés (3 cuotas) | adicional ~3-5% |
| Acreditación inmediata | adicional ~1-2% |

**Tip:** las cuotas sin interés las paga el comercio (tú). Calcular antes de ofrecerlas en cursos baratos.

## Estados de Pago (referencia)

| Status | Significado | Acción |
|--------|-------------|--------|
| `approved` | Pago aprobado | Crear enrollment, email, boleta |
| `pending` | Pendiente (transferencia, OXXO no aplica en Chile pero similar) | Esperar webhook posterior |
| `in_process` | En revisión por MP (riesgo) | Esperar resolución |
| `rejected` | Rechazado por banco o MP | Notificar al usuario, NO crear enrollment |
| `cancelled` | Cancelado por usuario o sistema | NO crear enrollment |
| `refunded` | Devuelto | Revocar enrollment |
| `charged_back` | Chargeback | Revocar enrollment, alertar admin |

## Anti-patrones

- ❌ Crear enrollment en `/pago/exito` desde el frontend
- ❌ Confiar en el `status` del payload del webhook (consultar API)
- ❌ No verificar firma HMAC (atacante puede falsificar webhook)
- ❌ Procesar el webhook dos veces (sin idempotencia)
- ❌ Hardcodear precios en el cliente (manipulables)
- ❌ Aplicar cupón sin validar server-side
- ❌ No probar tarjetas de fallo (rejected, pending) en sandbox
- ❌ `notification_url` con HTTP (MP la rechaza)
- ❌ Loggear el access token (queda en logs públicos)
- ❌ Usar test access token en producción
- ❌ No emitir boleta (SII te multa)

## Checklist Pre-Producción

- [ ] Access token de producción configurado en Vercel (no test)
- [ ] Webhook secret configurado
- [ ] notification_url apunta a HTTPS
- [ ] Probado checkout completo en sandbox: approved, rejected, pending
- [ ] Probado idempotencia (mismo request_id no duplica enrollment)
- [ ] Probado firma HMAC con payload manipulado (debe rechazar)
- [ ] Boleta SII se emite correctamente
- [ ] Email transaccional llega tras pago aprobado
- [ ] Página `/pago/exito` maneja estados pending/paid/failed
- [ ] Logs no exponen tokens ni datos sensibles
- [ ] Rate limit en POST /api/checkout
