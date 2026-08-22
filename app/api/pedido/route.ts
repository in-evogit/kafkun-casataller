import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactLimiter, rateLimit } from "@/lib/ratelimit";
import { sendPedidoAKaty, sendPedidoConfirmacion } from "@/lib/email";

/**
 * Pedido de encargo. No es una compra: no hay precio, ni pago, ni pasarela.
 * Son los datos con los que Katy llega preparada a la videollamada, y el precio
 * sale de esa conversación.
 */

const TIPOS = {
  chaleco: "Chaleco",
  bufanda: "Bufanda",
  otro: "Otro tejido",
} as const;

const bodySchema = z.object({
  nombre: z.string().trim().min(2).max(80),
  whatsapp: z.string().trim().min(8).max(25),
  email: z.string().trim().email().max(120),
  tipo: z.enum(["chaleco", "bufanda", "otro"]),
  cuando: z.string().trim().max(120).default(""),
  mensaje: z.string().trim().max(1500).default(""),
  /** Slug de la obra desde la que llegó, si entró por "quiero uno así". */
  ref: z.string().trim().max(60).default(""),
});

export async function POST(req: NextRequest) {
  // La ruta es pública, así que el límite va por IP. Sin Upstash configurado
  // `rateLimit` permite todo, que es lo correcto en desarrollo.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const { allowed } = await rateLimit(contactLimiter, `pedido:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Ya enviaste varios pedidos. Escríbeme a kafkuntelares@gmail.com." },
      { status: 429 }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisa los datos del formulario" }, { status: 400 });
  }

  const pedido = { ...parsed.data, tipo: TIPOS[parsed.data.tipo] };

  // Queda registrado por si el correo se pierde, pero NO puede tumbar el pedido:
  // `createAdminClient` lanza en cuanto falta la env de Supabase, así que el try
  // tiene que envolver también esa línea, no sólo el insert.
  try {
    const admin = createAdminClient();
    await admin.from("audit_log").insert({
      action: "pedido_encargo",
      entity_type: "pedido",
      metadata: pedido,
    });
  } catch (e) {
    console.error("[pedido] no se pudo registrar en audit_log:", e);
  }

  // Que falle el correo de cortesía no puede tumbar el pedido de Katy, ni al revés.
  const [aKaty] = await Promise.allSettled([
    sendPedidoAKaty(pedido),
    sendPedidoConfirmacion(pedido),
  ]);

  if (aKaty.status === "rejected") {
    console.error("[pedido] el aviso a Katy falló:", aKaty.reason);
    return NextResponse.json(
      { error: "No pude enviar tu pedido. Escríbeme a kafkuntelares@gmail.com." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
