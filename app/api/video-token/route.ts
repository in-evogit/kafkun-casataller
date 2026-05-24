import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/ratelimit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const querySchema = z.object({
  playback_id: z.string().min(1),
  course_slug: z.string().min(1),
});

function makeVideoLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)
    return null;
  return new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(60, "1 h"),
    analytics: false,
  });
}

const videoLimiter = makeVideoLimiter();

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { allowed } = await rateLimit(videoLimiter, user.id);
  if (!allowed) return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    playback_id: searchParams.get("playback_id"),
    course_slug: searchParams.get("course_slug"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });

  const { playback_id, course_slug } = parsed.data;

  // Dev mode — Mux no configurado
  if (!process.env.MUX_SIGNING_KEY_ID || !process.env.MUX_SIGNING_PRIVATE_KEY) {
    return NextResponse.json({ token: null, devMode: true });
  }

  // Verificar enrollment
  const admin = createAdminClient();
  const { data: course } = await admin
    .from("courses")
    .select("id")
    .eq("slug", course_slug)
    .maybeSingle();

  if (!course) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const { data: enrollment } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json({ error: "No tienes acceso a este curso" }, { status: 403 });
  }

  // Generar JWT firmado para Mux
  try {
    const jwt = await import("jsonwebtoken");
    const privateKey = Buffer.from(
      process.env.MUX_SIGNING_PRIVATE_KEY,
      "base64"
    ).toString("ascii");

    const token = jwt.default.sign(
      {
        sub: playback_id,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      privateKey,
      {
        algorithm: "RS256",
        keyid: process.env.MUX_SIGNING_KEY_ID,
      }
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error("[video-token]", err);
    return NextResponse.json({ error: "Error generando token" }, { status: 500 });
  }
}
