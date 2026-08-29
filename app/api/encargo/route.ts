import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactLimiter, rateLimit } from "@/lib/ratelimit";
import { MAX_REFERENCIAS, MAX_PESO_MB } from "@/lib/encargo";
import { z } from "zod";

const BUCKET = "referencias-encargo";
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const esquema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  tipo: z.enum(["chaleco", "bufanda", "otra"]),
  descripcion: z.string().trim().min(10).max(4000),
  plazo: z.string().trim().max(40).optional().or(z.literal("")),
  hora_iso: z.string().datetime().nullable(),
  prefiere_mensaje: z.boolean(),
});

export async function POST(req: NextRequest) {
  // Sin sesion: quien pide un encargo no tiene cuenta. Se limita por IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "sin-ip";
  const { allowed } = await rateLimit(contactLimiter, `encargo:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Recibimos varios envíos seguidos. Espera un momento e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "No pudimos leer el formulario." }, { status: 400 });
  }

  const crudo = form.get("encargo");
  if (typeof crudo !== "string") {
    return NextResponse.json({ error: "Faltan datos del encargo." }, { status: 400 });
  }

  const parsed = esquema.safeParse(JSON.parse(crudo ?? "{}"));
  if (!parsed.success) {
    // Mensaje generico al visitante; el detalle queda en los registros del servidor.
    console.error("[encargo] validacion fallida:", parsed.error.flatten());
    return NextResponse.json(
      { error: "Revisa los datos: falta algo o quedó incompleto." },
      { status: 400 }
    );
  }
  const datos = parsed.data;

  // ── Referencias ──────────────────────────────────────────────────────────
  const archivos = form.getAll("referencias").filter((f): f is File => f instanceof File);
  if (archivos.length > MAX_REFERENCIAS) {
    return NextResponse.json(
      { error: `Como máximo ${MAX_REFERENCIAS} fotos.` },
      { status: 400 }
    );
  }
  for (const a of archivos) {
    // Revalidado en el servidor: la validacion del navegador se salta con un curl.
    if (!TIPOS_OK.includes(a.type)) {
      return NextResponse.json({ error: "Solo se aceptan fotos." }, { status: 400 });
    }
    if (a.size > MAX_PESO_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Cada foto puede pesar hasta ${MAX_PESO_MB} MB.` },
        { status: 400 }
      );
    }
  }

  const admin = createAdminClient();
  const carpeta = crypto.randomUUID();
  const rutas: string[] = [];

  for (const [i, archivo] of archivos.entries()) {
    const ext = archivo.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const ruta = `${carpeta}/${i + 1}.${ext}`;
    const { error } = await admin.storage
      .from(BUCKET)
      .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

    if (error) {
      // Si una foto falla se aborta entero. Guardar el encargo diciendo que hay
      // cinco referencias cuando solo subieron tres deja a Katy buscando fotos
      // que no existen.
      console.error("[encargo] fallo la subida de una referencia:", error.message);
      await Promise.all(rutas.map((r) => admin.storage.from(BUCKET).remove([r])));
      return NextResponse.json(
        { error: "No pudimos subir tus fotos. Inténtalo de nuevo." },
        { status: 502 }
      );
    }
    rutas.push(ruta);
  }

  // ── Guardar ──────────────────────────────────────────────────────────────
  const { data, error } = await admin
    .from("encargos")
    .insert({
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono || null,
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      plazo: datos.plazo || null,
      referencias: rutas,
      hora_iso: datos.prefiere_mensaje ? null : datos.hora_iso,
      prefiere_mensaje: datos.prefiere_mensaje,
    })
    .select("id")
    .single();

  if (error) {
    // Limpieza: sin esto quedan fotos huerfanas en el bucket para siempre.
    await Promise.all(rutas.map((r) => admin.storage.from(BUCKET).remove([r])));

    // 23505 = violacion de unicidad. Es la carrera por la misma hora: dos
    // personas la pidieron a la vez y la base dejo entrar solo a una.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Esa hora se acaba de tomar. Elige otra, por favor." },
        { status: 409 }
      );
    }
    console.error("[encargo] no se pudo guardar:", error.message);
    return NextResponse.json(
      { error: "No pudimos registrar tu encargo. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  // ── Avisos ───────────────────────────────────────────────────────────────
  // Sin Resend configurado no se manda nada, y eso se dice en voz alta en los
  // registros: un encargo guardado del que Katy no se entera es un cliente perdido.
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      `[encargo] ${data.id} guardado, pero RESEND_API_KEY no esta configurada: ` +
        `nadie recibio aviso. Revisar la tabla encargos a mano.`
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
