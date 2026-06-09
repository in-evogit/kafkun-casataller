import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  coupon_code: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { allowed } = await rateLimit(checkoutLimiter, user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera un momento." },
      { status: 429 }
    );
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { items, coupon_code } = parsed.data;

  // Validar cupón si se envió
  let couponData: { id: string; discount_type: string; discount_value: number } | null = null;
  if (coupon_code) {
    const admin = createAdminClient();
    const { data: coupon } = await admin
      .from("coupons")
      .select("id, discount_type, discount_value, max_uses, uses_count, expires_at, active")
      .eq("code", coupon_code.toUpperCase())
      .maybeSingle();

    if (
      coupon &&
      coupon.active &&
      (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) &&
      (coupon.max_uses === null || coupon.uses_count < coupon.max_uses)
    ) {
      couponData = coupon;
    }
  }

  // Calcular subtotal y descuento
  const subtotal = items.reduce((sum, i) => sum + i.price_clp * i.quantity, 0);
  let discountAmount = 0;
  if (couponData) {
    discountAmount =
      couponData.discount_type === "percent"
        ? Math.round(subtotal * couponData.discount_value / 100)
        : Math.min(couponData.discount_value, subtotal);
  }
  const totalAfterDiscount = subtotal - discountAmount;

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Si hay descuento, proporcional al total; si no, precio normal
    const discountRatio = subtotal > 0 ? totalAfterDiscount / subtotal : 1;
    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      unit_price: Math.round(item.price_clp * discountRatio) / 100,
      currency_id: "CLP",
    }));

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
          coupon_id: couponData?.id ?? null,
          discount_amount: discountAmount,
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
