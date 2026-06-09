import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkoutLimiter, rateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const bodySchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { allowed } = await rateLimit(checkoutLimiter, `cupon:${user.id}`);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Espera un momento." }, { status: 429 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: coupon } = await admin
    .from("coupons")
    .select("code, discount_type, discount_value, max_uses, uses_count, expires_at, active")
    .eq("code", parsed.data.code)
    .maybeSingle();

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Cupón no válido" }, { status: 404 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Este cupón ha expirado" }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Este cupón ya no tiene usos disponibles" }, { status: 400 });
  }

  return NextResponse.json({
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: coupon.discount_value,
  });
}
