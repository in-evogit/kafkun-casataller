---
name: security-master
description: >
  Skill maestro de seguridad para aplicaciones web modernas (Next.js, Node, APIs). USAR SIEMPRE que el usuario mencione: seguridad, security, headers HTTP, CSP (Content Security Policy), HSTS, X-Frame-Options, autenticación, auth, password, sesiones, JWT, cookies httpOnly, OWASP, OWASP Top 10, XSS, CSRF, SQL injection, validación de input, sanitización, secrets, .env, environment variables, rate limiting, brute force, captcha, 2FA, MFA, audit log, logging, monitoring, Sentry, vulnerabilidades, npm audit, dependabot, pentest, OWASP ZAP, securityheaders.com, observatory mozilla, backup, recovery, encriptación, hashing, bcrypt, PCI compliance, tarjetas de crédito, webhook HMAC, verificación de firma, signed URLs, idempotencia, protección de admin panel, role-based access, RBAC. También activar cuando el usuario pida "revisar seguridad", "endurecer la app", "checklist de seguridad", "pre-lanzamiento", o configurar producción.
---

# Security Master — Seguridad Web Production-Grade

Este skill convierte a Claude en arquitecto de seguridad de nivel senior para aplicaciones web modernas. Prioriza defensa en profundidad, fail-secure por default, y cumplimiento OWASP.

## Filosofía Central

**La seguridad no es una feature, es una propiedad emergente del sistema completo.** Si una sola capa falla y no hay otras detrás, el sistema es inseguro. Toda decisión de diseño debe responder: "si esto falla, ¿qué me protege?".

**Jerarquía de prioridades de seguridad:**
1. No filtrar datos de usuarios (PII, contraseñas, tarjetas)
2. No permitir acceso no autorizado a recursos pagados
3. No permitir escalación de privilegios
4. No permitir denial of service barato
5. No exponer información del stack interno

## Las 10 Reglas Absolutas

Estas reglas no se discuten, no tienen excepciones. Si una decisión las viola, la decisión es incorrecta.

1. **NUNCA manejar números de tarjeta en backend propio.** Usar checkout hospedado del proveedor (Mercado Pago, Stripe, Webpay). Tu servidor recibe `payment_id` y nada más. Esto te saca de PCI scope.

2. **NUNCA confiar en datos del cliente para decisiones de autorización.** Validar siempre server-side. Los datos del cliente son input, no fuente de verdad.

3. **NUNCA exponer service role keys / admin tokens al cliente.** Ni en código, ni en variables `NEXT_PUBLIC_*`, ni en respuestas de API.

4. **NUNCA confiar en redirects del frontend para acciones críticas.** El usuario llega a `/pago/exito` no es prueba de que pagó. Solo el webhook firmado del proveedor lo es.

5. **NUNCA loggear secretos, tokens, passwords, ni PII completa.** Logs son superficie de ataque. Sanitizar antes de loggear.

6. **NUNCA dejar endpoints sin rate limiting** si pueden ser abusados (login, signup, password reset, contact form, checkout).

7. **NUNCA dejar rutas admin sin double-guard** (middleware + verificación server-side en page).

8. **NUNCA commitear `.env*` archivos.** Verificar `.gitignore` en setup inicial. Si se commitea por error, rotar TODOS los secretos.

9. **NUNCA usar `eval()`, `Function()`, `dangerouslySetInnerHTML` con input de usuario.** Sin excepciones.

10. **NUNCA mostrar stack traces, errores SQL, ni mensajes técnicos al usuario final.** Error genérico al usuario, detalle completo al log interno.

## Referencia Principal

Para temas profundos consultar:
- `references/headers-csp.md` — Headers HTTP completos con CSP detallado
- `references/auth-patterns.md` — Patrones de autenticación (sesiones, JWT, OAuth, 2FA)
- `references/owasp-checklist.md` — OWASP Top 10 con mitigaciones específicas
- `references/secrets-management.md` — Gestión de secretos y rotación

## Workflow Estándar al Trabajar en Seguridad

### Fase 1: Análisis de superficie de ataque
1. Listar todos los endpoints expuestos
2. Para cada uno: ¿qué autenticación requiere? ¿qué autorización?
3. ¿Qué input acepta? ¿está validado server-side con schema?
4. ¿Qué datos retorna? ¿filtrados por RLS o lógica de autorización?
5. ¿Tiene rate limiting?
6. ¿Loggea acciones críticas?

### Fase 2: Defensa por capa

| Capa | Defensa principal |
|------|-------------------|
| Network | HTTPS forzado, HSTS preload, CDN/WAF (Cloudflare, Vercel) |
| Browser | CSP, X-Frame-Options, Permissions-Policy, SameSite cookies |
| Application | Validación input (Zod), output encoding, CSRF tokens donde corresponda |
| Auth | Passwords con bcrypt/argon2, MFA opcional, rate limit, lockout |
| Authz | RBAC, RLS en DB, double-check en server actions |
| Data | Encryption at rest (DB), encryption in transit (TLS), backup encriptado |
| Secrets | Vault/env vars, rotación periódica, sin commits |
| Monitoring | Logs estructurados, Sentry, alertas en patrones sospechosos |

### Fase 3: Verificación

Antes de declarar algo "seguro", pasar por:
- [ ] securityheaders.com → grade A o A+
- [ ] observatory.mozilla.org → grade A o A+
- [ ] `npm audit` sin high/critical
- [ ] Test manual: ¿usuario A puede ver datos de usuario B manipulando IDs?
- [ ] Test manual: ¿no-admin puede llegar a `/admin/**`?
- [ ] Test manual: ¿webhook acepta payloads sin firma válida?
- [ ] Test: cookies marcadas httpOnly + Secure + SameSite
- [ ] Test: error de aplicación NO expone stack al usuario

## Headers HTTP de Seguridad (Next.js)

Configurar en `next.config.js`. Headers obligatorios para producción:

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://cdn.mux.com https://www.googletagmanager.com https://connect.facebook.net https://*.vercel-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  media-src 'self' https://stream.mux.com;
  connect-src 'self' https://*.supabase.co https://api.mercadopago.com https://*.mux.com https://www.google-analytics.com;
  frame-src 'self' https://www.mercadopago.com https://player.mux.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://www.mercadopago.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

module.exports = {
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }]; },
  poweredByHeader: false,
};
```

### Notas sobre CSP

- Empezar con CSP **report-only** (`Content-Security-Policy-Report-Only`) y ajustar hasta no ver violations en consola.
- Después cambiar a `Content-Security-Policy` enforced.
- Si necesitas `unsafe-inline` en scripts, considerar nonces o hashes.

## Validación de Input con Zod (patrón obligatorio)

**Toda entrada del usuario pasa por schema Zod server-side**, incluso si ya se validó en cliente.

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(100),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
  const data = parsed.data; // ya está tipado y validado
  // ...
}
```

## Webhook con Firma HMAC (patrón obligatorio)

Para todo webhook entrante (Mercado Pago, Stripe, Mux, etc.):

```typescript
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text(); // raw body, NO json
  const signature = req.headers.get('x-signature') ?? '';

  // Calcular HMAC esperado
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');

  // Comparación timing-safe (NUNCA ===)
  const valid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
  if (!valid) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Idempotencia: ¿ya procesamos este request-id?
  const requestId = req.headers.get('x-request-id');
  if (await alreadyProcessed(requestId)) {
    return new Response('Already processed', { status: 200 });
  }

  // Procesar...
}
```

## Rate Limiting (Upstash Redis)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 req / 15 min
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(`login:${ip}`);
  if (!success) return new Response('Too many requests', { status: 429 });
  // ...
}
```

Endpoints que **siempre** requieren rate limit:
| Endpoint | Límite |
|----------|--------|
| POST /auth/login | 5/15min por IP |
| POST /auth/register | 3/hora por IP |
| POST /auth/reset-password | 3/hora por email |
| POST /api/checkout | 10/hora por usuario |
| POST /api/contact | 5/hora por IP |
| GET /api/video-token | 60/hora por usuario |

## Gestión de Secretos

```
.env.local (NUNCA commitear, en .gitignore)

# Públicas (cliente puede ver, prefijo obligatorio)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=

# Privadas (solo server, sin prefijo)
SUPABASE_SERVICE_ROLE_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
RESEND_API_KEY=
```

### Reglas
- En Vercel: configurar como Encrypted Environment Variables, separadas por entorno.
- Rotar secretos cada 6 meses o ante sospecha de compromiso.
- Si un secreto se filtra (push accidental, log público): **rotar inmediatamente**, no esperar.

## Checklist Pre-Lanzamiento

- [ ] Todos los headers de seguridad activos (verificar en securityheaders.com)
- [ ] CSP enforced (no report-only) sin violations en uso normal
- [ ] HTTPS forzado, HSTS preload activado
- [ ] Cookies httpOnly + Secure + SameSite=Lax
- [ ] Rate limiting en todos los endpoints críticos
- [ ] RLS activado y políticas verificadas en TODAS las tablas con datos de usuario
- [ ] Service role key SOLO en server-side, nunca en cliente
- [ ] Webhooks verifican firma HMAC con `timingSafeEqual`
- [ ] Webhooks tienen idempotencia (no procesan duplicados)
- [ ] Validación Zod en todos los endpoints API
- [ ] Sin secretos en código (`git secrets` o gitleaks scan)
- [ ] `.env*` en `.gitignore`
- [ ] `npm audit` sin high/critical
- [ ] Sentry configurado y recibiendo errores
- [ ] Logs no contienen PII, passwords, ni tokens
- [ ] Páginas de error genéricas (no exponen stack)
- [ ] Test: usuario A no puede ver datos de usuario B (manipulando IDs)
- [ ] Test: no-admin no puede acceder a /admin/**
- [ ] Test: webhook rechaza payloads sin firma válida
- [ ] Backup automatizado y probado (restore drill)
- [ ] Páginas legales: Términos, Privacidad, Cookies, Devoluciones
- [ ] Política de incident response definida (qué hacer si hay breach)

## Cuando el Usuario Pida "Revisar Seguridad"

Workflow:

1. **Listar superficie**: enumerar endpoints, formularios, paths admin, integraciones externas.
2. **Auditar cada uno** contra la matriz de capas (network, browser, app, auth, authz, data, secrets, monitoring).
3. **Reportar findings** clasificados por severidad:
   - 🔴 Crítico: filtración de datos, escalación de privilegios, RCE
   - 🟠 Alto: auth bypass, CSRF en acciones sensibles, datos sin RLS
   - 🟡 Medio: falta rate limit, logs con info sensible, CSP demasiado laxo
   - 🟢 Bajo: headers menores, info disclosure menor
4. **Plan de remediación** ordenado por severidad y esfuerzo.

## Anti-patrones Comunes que Detectar

- "Seguridad por oscuridad" → URLs largas, IDs random, sin auth real
- Validación solo client-side
- `if (user.role === 'admin')` sin verificar que `user` viene de fuente confiable
- Encriptar/desencriptar con misma key en cliente (atacante tiene la key)
- Cookies sin SameSite, sin Secure, sin httpOnly
- `console.log` con tokens o passwords (queda en producción)
- "Vamos a agregar seguridad después" → nunca pasa
- Headers de seguridad en index.html (no aplica), debe ser HTTP response header
- CSP con `unsafe-inline` en producción sin nonce/hash
- JWT con secret hardcoded
- "El frontend ya valida" como única validación
- Permitir HTTP en producción (sin HSTS preload)

## Cuando NO Sobreprotegerse

La seguridad tiene costo en UX. No agregar fricciones donde el riesgo no lo justifica:

- 2FA obligatorio en cuenta de estudiante de un curso → demasiado, hace abandonar
- Captcha en cada submit → solo si hay abuso real
- Password de 16 caracteres con símbolos obligatorios → contraproducente, usuarios anotan en post-it
- Logout cada 5 minutos → mata sesiones legítimas

Calibrar la intensidad de la defensa al valor del activo protegido.
