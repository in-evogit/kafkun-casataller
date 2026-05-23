export const config = {
  isProduction: process.env.NEXT_PUBLIC_BUSINESS_MODE === "production",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  mp: {
    mode: (process.env.MP_MODE ?? "sandbox") as "sandbox" | "production",
    accessToken: process.env.MP_ACCESS_TOKEN!,
    webhookSecret: process.env.MP_WEBHOOK_SECRET!,
  },

  boleta: {
    autoEnabled: process.env.BOLETA_AUTO_ENABLED === "true",
    provider: "openfactura" as const,
    rut: process.env.EMPRESA_RUT,
    razonSocial: process.env.EMPRESA_RAZON_SOCIAL,
    direccion: process.env.EMPRESA_DIRECCION,
    comuna: process.env.EMPRESA_COMUNA,
    ciudad: process.env.EMPRESA_CIUDAD,
  },

  email: {
    from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;
