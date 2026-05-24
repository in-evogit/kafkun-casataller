import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkoutLimiter, rateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        type: z.enum(["course", "product"]),
        title: z.string().min(1),
        price_clp: z.number().positive().int(),
        quantity: z.number().positive().int().max(20),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req: NextRequest) {
  // Auth — debe estar logueado
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Rate limit
  const { allowed } = await rateLimit(checkoutLimiter, user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera un momento." },
      { status: 429 }
    );
  }

  // Validar body
  const rawBody = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { items } = parsed.data;

  // Modo desarrollo — MP no configurado
  if (!process.env.MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { devMode: true, message: "Mercado Pago no configurado aún" },
      { status: 200 }
    );
  }

  try {
    const { MercadoPagoConfig, Preference } = await import("mercadopago");
    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
    const preferenceApi = new Preference(mpClient);

    // Construir line items
    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.id,
      quantity: item.quantity,
      unit_price: item.price_clp / 100, // MP usa pesos sin centavos en CLP
      currency_id: "CLP",
    }));

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const preference = await preferenceApi.create({
      body: {
        items: mpItems,
        payer: { email: user.email },
        back_urls: {
          success: `${siteUrl}/checkout/exito`,
          failure: `${siteUrl}/checkout/error`,
          pending: `${siteUrl}/checkout/exito`,
        },
        auto_return: "approved",
        external_reference: user.id,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        metadata: {
          items: items.map((i) => ({
            id: i.id,
            type: i.type,
            title: i.title,
            price_clp: i.price_clp,
            quantity: i.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ init_point: preference.init_point });
  } catch (err) {
    console.error("[checkout] MP error:", err);
    return NextResponse.json(
      { error: "Error al crear el pago. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
