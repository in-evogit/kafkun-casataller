import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://sdk.mercadopago.com
    https://cdn.mux.com
    https://www.googletagmanager.com
    https://connect.facebook.net
    https://*.vercel-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https: https://*.mux.com https://*.supabase.co https://placehold.co;
  media-src 'self' https://stream.mux.com;
  connect-src 'self'
    https://*.supabase.co
    https://api.mercadopago.com
    https://*.mux.com
    https://www.google-analytics.com
    https://*.vercel-analytics.com;
  frame-src 'self' https://www.mercadopago.com https://player.mux.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://www.mercadopago.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
