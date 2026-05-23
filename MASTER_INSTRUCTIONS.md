# MASTER INSTRUCTIONS — Plataforma de Cursos de Telar

> **Documento único de proyecto.** Léelo completo antes de empezar a construir. Está organizado en 12 secciones más 5 apéndices (skills para crear en Claude Code). Cuando termines de leer, resume en 5-7 líneas qué entendiste y qué vas a construir, después arrancamos la Fase 0.
>
> **Prioridades del proyecto en orden:** (1) Seguridad. (2) SEO técnico. (3) Conversión / UX. (4) Estética. Si tienes que sacrificar algo, sacrifícalo en ese orden inverso.

---

## Índice

1. Resumen ejecutivo
2. Stack técnico (decisiones tomadas)
3. Modelo de datos (SQL)
4. **SEGURIDAD** — sección expandida
5. **SEO TÉCNICO** — sección expandida
6. Estructura de páginas + copy
7. Customer journey (qué objetivo sirve cada página)
8. Panel de administración
9. Tono de voz y reglas de copy
10. Roadmap por fases
11. Skills y agentes a usar
12. Prompt de arranque sugerido

Apéndices (skills para crear):
- A. `security-headers-nextjs`
- B. `supabase-rls-patterns`
- C. `seo-technical-nextjs`
- D. `mercadopago-checkout-pro`
- E. `mux-signed-urls`

---

# 1. Resumen ejecutivo

**Qué construir:** plataforma web que vende dos categorías:
1. **Cursos online de telar** (video on-demand protegido detrás de pago)
2. **Productos físicos** (telares, lanas, kits, accesorios)

**Para quién:** Katy, instructora de telar en Chile. Marca personal fuerte. Audiencia principal: mujeres 28-55, llegan desde Instagram (5-20K seguidores de partida).

**Diferenciador:** la competencia chilena (Telarte, Soltelar, Telar de la Nona, Lanas de Antaño) tiene webs viejas o solo opera por DM. Acá se construye una web premium con checkout fluido, video protegido y SEO técnico fuerte. Vacío de mercado real.

**Modelo de monetización:**
- Cursos: $35.000-$72.000 CLP, ticket promedio ~$50.000
- Productos: telares $25k-$60k, lanas $5-15k, kits combinados $60-100k
- Cuotas sin interés (hasta 3) vía Mercado Pago
- Acceso de por vida a los cursos

**Volumen objetivo año 1:** 200 alumnas, 800 productos vendidos, $30M CLP de ingresos brutos.

---

# 2. Stack técnico

| Capa | Elección | Justificación |
|------|----------|---------------|
| Framework | **Next.js 15 (App Router) + TypeScript estricto** | SSR/SSG nativo (excelente para SEO), server actions, API routes, todo monorepo |
| Estilos | **Tailwind CSS + shadcn/ui** | Sistema consistente, componentes accesibles |
| Base de datos | **Supabase (PostgreSQL)** | Postgres + Auth + Storage + RLS en un servicio |
| Auth | **Supabase Auth** (email/password + Google OAuth) | Sesiones JWT en httpOnly cookies |
| Pagos | **Mercado Pago Checkout Pro** | Mejor SDK para Chile, soporta cuotas, webhooks confiables |
| Video | **Mux Video** con signed playback IDs | URLs firmadas, adaptive bitrate, player listo |
| Email | **Resend + React Email** | API simple, templates en JSX |
| Hosting | **Vercel** | Deploy automático desde GitHub, edge global |
| Boletas SII | **OpenFactura** (API) | Obligatorio en Chile para boleta electrónica |
| Forms | **react-hook-form + zod** | Validación tipo-segura cliente y servidor |
| Estado cliente | **Zustand** (carrito) + Tanstack Query (server state) | Mínimo y suficiente |
| Analítica | **Vercel Analytics + GA4 + Meta Pixel** | Métricas técnicas + marketing |
| Monitoring | **Sentry** (errores) + **BetterStack** (uptime) | Plan gratis suficiente para start |
| Rate limiting | **Upstash Redis** (vía `@upstash/ratelimit`) | Protege endpoints críticos |

**Versiones a usar:** las últimas estables al momento de instalación. Especialmente Next.js 15+ (App Router maduro), React 19, TypeScript 5.5+.

---

# 3. Modelo de datos

Aplicar este SQL en Supabase tras crear el proyecto. Después generar tipos: `npx supabase gen types typescript --project-id <ID> > types/database.ts`.

```sql
-- ============================================
-- USERS & ROLES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  rut TEXT,
  phone TEXT,
  avatar_url TEXT,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student'))
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  trailer_mux_playback_id TEXT,
  price_clp INTEGER NOT NULL CHECK (price_clp >= 0),
  compare_at_price_clp INTEGER, -- para "precio tachado"
  level TEXT CHECK (level IN ('principiante', 'intermedio', 'avanzado')),
  duration_minutes INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX courses_slug_idx ON courses(slug);
CREATE INDEX courses_status_idx ON courses(status);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, position)
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  mux_asset_id TEXT,
  mux_playback_id TEXT NOT NULL,
  duration_seconds INTEGER,
  is_free_preview BOOLEAN DEFAULT FALSE,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, position)
);

-- ============================================
-- PRODUCTS (físicos)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_clp INTEGER NOT NULL CHECK (price_clp >= 0),
  compare_at_price_clp INTEGER,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight_grams INTEGER,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_status_idx ON products(status);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  total_clp INTEGER NOT NULL,
  mp_preference_id TEXT,
  mp_payment_id TEXT,
  shipping_address JSONB,
  boleta_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX orders_user_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_mp_payment_idx ON orders(mp_payment_id);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('course', 'product')),
  course_id UUID REFERENCES courses(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_clp INTEGER NOT NULL,
  CHECK (
    (item_type = 'course' AND course_id IS NOT NULL AND product_id IS NULL) OR
    (item_type = 'product' AND product_id IS NOT NULL AND course_id IS NULL)
  )
);

-- ============================================
-- ENROLLMENTS & PROGRESS
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX enrollments_user_idx ON enrollments(user_id);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  watched_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================
-- COUPONS, REVIEWS
-- ============================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value INTEGER NOT NULL,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('all', 'course', 'product')),
  target_id UUID,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX audit_log_user_idx ON audit_log(user_id);
CREATE INDEX audit_log_created_idx ON audit_log(created_at DESC);

-- ============================================
-- FUNCTION: trigger updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Las políticas RLS van en la **sección de seguridad** (sección 4) y deben aplicarse en bloque tras este SQL.

---

# 4. 🔒 SEGURIDAD (PRIORIDAD MÁXIMA)

Esta sección es la más importante del documento. **No mover a producción nada que no cumpla con todos los puntos.**

## 4.1 Modelo de amenazas

Atacantes esperables y sus objetivos:
- **Script kiddies**: probar inputs maliciosos, ver si pueden hacer login bypass, encontrar endpoints sin auth.
- **Compradores deshonestos**: intentar acceder a un curso sin pagar (URL guessing, manipular webhooks).
- **Bots de scraping**: descargar todos los videos del curso para republicar.
- **Atacantes de pago**: usar tarjetas robadas, intentar chargeback abuse.
- **Atacantes de cuenta**: brute force a logins, credential stuffing.

## 4.2 Reglas absolutas (no negociables)

1. **NUNCA manejar números de tarjeta en backend propio.** Ni encriptados, ni hasheados, ni "solo los últimos 4". El checkout es hospedado por Mercado Pago. Tu backend recibe `mp_payment_id` y nada más.

2. **NUNCA confiar en el redirect del frontend para desbloquear acceso.** El único trigger válido para crear un `enrollment` es el webhook firmado de Mercado Pago verificado con HMAC.

3. **NUNCA exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.** Esa clave bypassa RLS. Solo en server components / API routes / server actions.

4. **NUNCA servir videos sin signed URL.** Todo asset de Mux debe ser "signed playback policy" en la creación; el cliente recibe un JWT de 1h emitido por tu backend.

5. **NUNCA dejar `/admin/**` sin middleware que verifique rol.** Doble guardia: middleware + verificación server-side en cada page.

## 4.3 Headers HTTP de seguridad

Configurar en `next.config.js` (ver Apéndice A para código completo). Headers obligatorios:

| Header | Valor | Por qué |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Fuerza HTTPS, previene downgrade attacks |
| `X-Frame-Options` | `DENY` | Previene clickjacking |
| `X-Content-Type-Options` | `nosniff` | Previene MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limita info de referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Bloquea APIs sensibles |
| `Content-Security-Policy` | Ver Apéndice A | Previene XSS, restringe fuentes de scripts |

CSP debe permitir:
- `script-src`: self, Mux player, Mercado Pago SDK, GA4, Meta Pixel, Vercel Analytics
- `frame-src`: Mercado Pago, Mux, YouTube (si embeds)
- `img-src`: self, Supabase storage, Mux thumbnails, data:, https:
- `connect-src`: self, Supabase, Mux API, Mercado Pago API
- `style-src`: self, 'unsafe-inline' (Tailwind requiere), Google Fonts
- `font-src`: self, Google Fonts
- Default: `'none'`

## 4.4 Autenticación

- **Email + password** con Supabase Auth.
- **Password mínimo 10 caracteres**, validar fortaleza con zxcvbn (mostrar barra de fuerza).
- **Magic link** como opción primaria para reducir fricción.
- **Google OAuth** como segunda opción.
- **Rate limit en login**: 5 intentos por IP cada 15 minutos. Después, captcha (hCaptcha free).
- **Bloqueo de cuenta** tras 10 intentos fallidos consecutivos → email al usuario "alguien intentó entrar a tu cuenta".
- **Sesiones**: cookies httpOnly + Secure + SameSite=Lax + path=/. Expiran en 30 días, refresh automático.
- **Logout también del lado servidor** (invalidar refresh token en Supabase, no solo borrar cookie).
- **Password reset**: token de un solo uso, expira en 1 hora, no revelar si el email existe ("si tu cuenta existe, te llegará un email").
- **2FA opcional** para admins (fase 2, vía TOTP).

## 4.5 Row Level Security en Supabase (CRÍTICO)

Aplicar este SQL completo después del esquema base. **Sin RLS, todo el modelo de seguridad colapsa.**

```sql
-- Activar RLS en TODAS las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: función para chequear si es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- profiles
CREATE POLICY "users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admins read all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- courses (público lee published, admin lee todo)
CREATE POLICY "anyone reads published courses" ON courses
  FOR SELECT USING (status = 'published');
CREATE POLICY "admins manage courses" ON courses
  FOR ALL USING (is_admin());

-- modules y lessons (mismo patrón: público lee si el course es published)
CREATE POLICY "anyone reads modules of published courses" ON modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = modules.course_id AND status = 'published')
  );
CREATE POLICY "admins manage modules" ON modules FOR ALL USING (is_admin());

-- lessons: tres reglas críticas
-- 1) Cualquiera puede VER METADATA (título, duración, is_free_preview) de lecciones de cursos publicados
-- 2) Solo enrollment válido o is_free_preview accede al playback_id
-- 3) Admins ven todo
CREATE POLICY "anyone reads lesson metadata" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id AND c.status = 'published'
    )
  );
CREATE POLICY "admins manage lessons" ON lessons FOR ALL USING (is_admin());
-- IMPORTANTE: el playback_id NO debe exponerse en el SELECT general.
-- El backend filtra: si is_free_preview = true OR existe enrollment → devuelve playback_id; si no → omite el campo.

-- products
CREATE POLICY "anyone reads published products" ON products
  FOR SELECT USING (status = 'published');
CREATE POLICY "admins manage products" ON products FOR ALL USING (is_admin());

-- orders
CREATE POLICY "users read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all orders" ON orders
  FOR SELECT USING (is_admin());
-- Las inserciones de orders se hacen SIEMPRE desde server con service_role, no desde cliente.

-- order_items
CREATE POLICY "users read items of own orders" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "admins read all order items" ON order_items
  FOR SELECT USING (is_admin());

-- enrollments
CREATE POLICY "users read own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all enrollments" ON enrollments
  FOR SELECT USING (is_admin());
-- Las inserciones SOLO desde webhook server-side con service_role.

-- lesson_progress
CREATE POLICY "users manage own progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- coupons
CREATE POLICY "anyone validates active coupons" ON coupons
  FOR SELECT USING (active = TRUE AND (expires_at IS NULL OR expires_at > NOW()));
CREATE POLICY "admins manage coupons" ON coupons FOR ALL USING (is_admin());

-- reviews
CREATE POLICY "anyone reads published reviews" ON reviews
  FOR SELECT USING (published = TRUE);
CREATE POLICY "users manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins manage all reviews" ON reviews FOR ALL USING (is_admin());

-- audit_log: solo admins leen
CREATE POLICY "admins read audit log" ON audit_log
  FOR SELECT USING (is_admin());
```

## 4.6 Validación de input

**Toda entrada del usuario pasa por Zod schemas**, server-side incluso si ya se validó en cliente. Nunca confiar en validación de cliente.

Ejemplo de patrón obligatorio en API routes:

```typescript
// app/api/checkout/route.ts
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    type: z.enum(['course', 'product']),
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1).max(20),
  coupon_code: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }
  // ...
}
```

## 4.7 Webhook de Mercado Pago — verificación HMAC obligatoria

El webhook es la **única fuente de verdad** para marcar un pago como aprobado y crear el enrollment. Si la firma no verifica, descartar. Si verifica pero el `status !== 'approved'`, descartar.

```typescript
// app/api/webhooks/mercadopago/route.ts
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text(); // raw body
  const signature = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';

  // Parsear ts y v1 del header
  const parts = Object.fromEntries(
    signature.split(',').map(kv => kv.split('=').map(s => s.trim()))
  );
  const ts = parts.ts;
  const hash = parts.v1;

  // dataId viene del body o query string (depende del evento)
  const data = JSON.parse(body);
  const dataId = data.data?.id ?? '';

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
    .update(manifest)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash))) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Idempotencia: si ya procesamos este request-id, descartar
  // (chequear contra tabla audit_log o similar)

  // Consultar a MP el estado real del pago (no confiar en el payload)
  // SOLO si status === 'approved', marcar orden como paid y crear enrollments
  // ...

  return new Response('ok');
}
```

## 4.8 Rate limiting

Endpoints que requieren rate limit obligatorio (Upstash Redis):

| Endpoint | Límite |
|----------|--------|
| `POST /auth/login` | 5/15min por IP |
| `POST /auth/register` | 3/hora por IP |
| `POST /auth/reset-password` | 3/hora por email |
| `POST /api/checkout` | 10/hora por usuario |
| `POST /api/contact` | 5/hora por IP |
| `POST /api/coupon/validate` | 20/hora por IP |
| `GET /api/video-token` | 60/hora por usuario |

## 4.9 Protección contra scraping de videos

- Mux signed URLs (JWT) con expiración 1h.
- Token vinculado al `user_id` → si se comparte, otro usuario tampoco lo puede usar (validar en backend).
- Watermark dinámico en video con email del comprador (Mux soporta esto, fase 2).
- DRM Widevine/FairPlay solo si la piratería se vuelve un problema real (caro, posponer).

## 4.10 Gestión de secretos

```
.env.local (NO COMMITEAR, en .gitignore)

# Públicas (cliente puede ver)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://katyTelar.cl
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# Privadas (solo server)
SUPABASE_SERVICE_ROLE_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY_ID=
MUX_SIGNING_PRIVATE_KEY=
RESEND_API_KEY=
OPENFACTURA_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SENTRY_AUTH_TOKEN=
```

- En Vercel: configurar todas como Encrypted Environment Variables, separadas por entorno (Production / Preview / Development).
- Rotar `MP_WEBHOOK_SECRET` y `SUPABASE_SERVICE_ROLE_KEY` cada 6 meses o ante sospecha de compromiso.

## 4.11 Logging y monitoring

- **Sentry**: capturar errores de servidor y cliente. Filtrar PII antes de enviar.
- **Audit log**: registrar en tabla `audit_log` toda acción admin (crear curso, cambiar precio, eliminar usuario), todo login, todo cambio de password, todo refund.
- **BetterStack / Uptime Robot**: monitor de `/api/health` cada minuto. Alerta si cae.
- **Vercel Logs**: revisar weekly los logs de API routes buscando 4xx/5xx anómalos.

## 4.12 Backup

- Supabase: habilitar PITR (Point In Time Recovery) en cuanto haya tráfico real (plan Pro $25/mes).
- Mientras tanto en plan free: cron diario que ejecute `pg_dump` y suba a S3 / Google Drive. Retener 30 días.
- Video en Mux: tener copia local en disco duro externo de los masters subidos (Katy mantiene los archivos originales).

## 4.13 Cumplimiento legal (Chile)

- **Ley 19.628 (Protección de Datos Personales)** y **Ley 21.719** (modernización 2024-2026):
  - Política de Privacidad pública y clara (qué datos se recolectan, para qué, cuánto tiempo se guardan).
  - Consentimiento explícito para newsletter (no opt-out por defecto).
  - Derecho a eliminación: endpoint que permite al usuario solicitar borrado de cuenta.
  - Banner de cookies con opciones (necesarias / analítica / marketing) — los de marketing y analítica desactivados por defecto, activan tras consentimiento.
- **SERNAC**:
  - Política de Retracto: 10 días para productos físicos no consumidos. Para contenido digital ya accedido, ver excepción del Art. 3 bis letra b) Ley 19.496.
  - Términos y Condiciones visibles antes de la compra.
  - Boleta electrónica emitida (OpenFactura).
- **Anti-discriminación en precios** (sin precios diferenciados según género/raza/etc).

## 4.14 Checklist de seguridad pre-lanzamiento

- [ ] Todas las tablas con RLS habilitada y políticas verificadas
- [ ] Service role key solo en server-side, nunca en código de cliente
- [ ] Headers de seguridad configurados en `next.config.js`
- [ ] CSP probado en producción (revisar consola por warnings)
- [ ] Webhook HMAC verificado con test del sandbox
- [ ] Rate limiting activo en endpoints críticos
- [ ] Logs de Sentry recibiendo eventos
- [ ] Backup automatizado funcionando
- [ ] `npm audit` sin vulnerabilidades high/critical
- [ ] Snyk o Dependabot configurado para alertas
- [ ] Páginas legales publicadas: Términos, Privacidad, Cookies, Devoluciones
- [ ] Probar flujo completo de pago en sandbox: aprobado, rechazado, pendiente, chargeback
- [ ] Probar que un usuario logueado NO puede ver enrollments/orders de otro (manipular `user_id` en queries)
- [ ] Probar que un no-admin NO puede acceder a `/admin/**`
- [ ] Probar que las cookies son httpOnly + Secure + SameSite=Lax
- [ ] Test de OWASP ZAP en preview deploy

---

# 5. 🔍 SEO TÉCNICO (PRIORIDAD MÁXIMA)

Esta sección es la segunda más importante. **El SEO bien hecho desde el día 1 es 10x más barato que arreglarlo después.** El nicho tiene poca competencia en SERPs, así que con técnico bien hecho + contenido de blog se puede dominar varios long-tail queries en 6-12 meses.

## 5.1 Estrategia SEO global

**Keywords objetivo (research preliminar — refinar con Ahrefs/Semrush):**

| Keyword | Intent | Prioridad |
|---------|--------|-----------|
| "curso de telar online" | Commercial | Alta |
| "curso de telar mapuche" | Commercial | Alta |
| "aprender a tejer en telar" | Informational | Alta |
| "telar de peine curso" | Commercial | Media |
| "como hacer un telar" | Informational | Media |
| "telar mapuche para principiantes" | Informational | Media |
| "comprar telar chile" | Commercial | Media |
| "telar de madera" | Commercial | Baja |
| "lana para telar" | Commercial | Baja |
| "[nombre marca]" | Brand | Alta (defensiva) |

**Estrategia de contenido:**
- Páginas comerciales (cursos, productos) → optimizadas para intent commercial.
- Blog (`/diario`) → optimizado para intent informational, capta tráfico arriba del funnel.
- Página `/sobre-mi` → ranquea para "[nombre Katy] telar".

## 5.2 Estructura de URLs

Reglas:
- Todas en español, kebab-case
- Sin parámetros si se puede evitar (filtros usan query strings que se marcan `noindex`)
- Máximo 5 niveles
- Slugs descriptivos, no IDs

Esquema:
```
/                                    Home
/cursos                              Listado
/cursos/[slug]                       Detalle (ej: /cursos/telar-mapuche-principiante)
/tienda                              Listado
/tienda/[slug]                       Detalle (ej: /tienda/telar-maria-mediano)
/sobre-mi
/diario                              Blog
/diario/[slug]
/contacto
/preguntas-frecuentes
```

URLs `noindex` (vía meta robots + robots.txt):
```
/login, /registro, /recuperar
/carrito, /checkout, /pago/*
/mi-cuenta, /mis-cursos, /mis-compras
/aprende/*
/admin/*
/api/*
```

## 5.3 Sitemap dinámico

`app/sitemap.ts` que genera XML automáticamente con todas las páginas indexables:

```typescript
import { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabase();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Páginas estáticas
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/cursos`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/sobre-mi`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/diario`, lastModified: new Date(), priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/preguntas-frecuentes`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  // Cursos publicados
  const { data: courses } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .eq('status', 'published');
  const coursePages = (courses ?? []).map(c => ({
    url: `${baseUrl}/cursos/${c.slug}`,
    lastModified: new Date(c.updated_at),
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }));

  // Productos publicados
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .eq('status', 'published');
  const productPages = (products ?? []).map(p => ({
    url: `${baseUrl}/tienda/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...coursePages, ...productPages];
}
```

## 5.4 Robots.txt

`app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/', '/api/', '/login', '/registro', '/recuperar',
          '/carrito', '/checkout', '/pago/',
          '/mi-cuenta', '/mis-cursos', '/mis-compras', '/aprende/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## 5.5 Metadata por página (Next.js `generateMetadata`)

**Reglas:**
- `title`: 50-60 chars. Patrón: `[Tópico] · [Marca]`
- `description`: 140-160 chars. Frase única, descriptiva, con CTA suave.
- `openGraph.image`: 1200x630px, optimizada, < 200KB
- `canonical`: siempre presente
- `alternates.languages`: solo si hay multi-idioma (fase 2)

**Patrones por tipo de página:**

```typescript
// Landing
export const metadata = {
  title: 'Katy · Academia online de telar en Chile',
  description: 'Aprende a tejer en telar desde cero, a tu ritmo. Cursos online con +200 alumnas tejiendo. Empezar por $45.000.',
  alternates: { canonical: 'https://katytelar.cl' },
  openGraph: { /* ... */ },
};

// Detalle de curso (generateMetadata dinámico)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) return notFound();

  return {
    title: course.seo_title ?? `${course.title} · Curso de telar online · Katy`,
    description: course.seo_description ?? course.subtitle?.slice(0, 155),
    alternates: { canonical: `https://katytelar.cl/cursos/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.subtitle,
      images: [{ url: course.seo_og_image_url ?? course.thumbnail_url, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}

// Lecciones, /admin, /mi-cuenta, etc.
export const metadata = { robots: { index: false, follow: false } };
```

## 5.6 JSON-LD estructurado (Schema.org)

**OBLIGATORIO en cada tipo de página.** Es lo que hace que aparezcan rich results en Google.

### Landing — Organization + WebSite

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://katytelar.cl/#organization',
      name: 'Katy Academia de Telar',
      url: 'https://katytelar.cl',
      logo: 'https://katytelar.cl/logo.png',
      sameAs: ['https://instagram.com/katy_telar'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+56-9-XXXX-XXXX',
        contactType: 'customer service',
        availableLanguage: 'Spanish',
        areaServed: 'CL',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://katytelar.cl/#website',
      url: 'https://katytelar.cl',
      name: 'Katy Academia de Telar',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://katytelar.cl/buscar?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};
```

### Detalle de curso — Course + Offer + AggregateRating

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'Katy Academia de Telar',
    sameAs: 'https://katytelar.cl',
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: `PT${course.duration_minutes}M`,
  },
  offers: {
    '@type': 'Offer',
    price: course.price_clp,
    priceCurrency: 'CLP',
    availability: 'https://schema.org/InStock',
    url: `https://katytelar.cl/cursos/${course.slug}`,
  },
  ...(reviewsCount > 0 && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviewsCount,
    },
  }),
};
```

### Detalle de producto — Product + Offer

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  offers: {
    '@type': 'Offer',
    price: product.price_clp,
    priceCurrency: 'CLP',
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `https://katytelar.cl/tienda/${product.slug}`,
  },
};
```

### Breadcrumb (en cualquier página interna)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://katytelar.cl' },
    { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://katytelar.cl/cursos' },
    { '@type': 'ListItem', position: 3, name: course.title },
  ],
}
```

### FAQ (en `/preguntas-frecuentes` y FAQ de cursos)

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}
```

Inyectar JSON-LD con `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`.

**Validar siempre en https://search.google.com/test/rich-results.**

## 5.7 Core Web Vitals — targets

| Métrica | Target mobile | Target desktop |
|---------|---------------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.0s |
| INP (Interaction to Next Paint) | < 200ms | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.1 |
| FCP (First Contentful Paint) | < 1.8s | < 1.0s |
| TTFB (Time to First Byte) | < 600ms | < 400ms |

**Cómo lograrlo:**
- **Imágenes**: `next/image` siempre, con `priority` en LCP candidate (hero), `loading="lazy"` en el resto. Formato AVIF con fallback WebP. Tamaños exactos en `sizes`.
- **Fuentes**: `next/font` (auto-host, no FOIT). Subsetting latin.
- **JS bundle**: dynamic imports para componentes no críticos (modales, video players). Bundle de home page < 100KB gzipped.
- **CSS**: Tailwind con purge automático, sin frameworks pesados adicionales.
- **Server Components por defecto**, Client Components solo cuando necesitas interactividad.
- **Streaming SSR** con `<Suspense>` para no bloquear el render inicial.
- **Cache HTTP**: páginas estáticas con `revalidate` ISR (1h para listings, 24h para landing, on-demand para detalles).

## 5.8 Optimización de imágenes

```typescript
import Image from 'next/image';

// Hero (LCP candidate)
<Image
  src="/hero.jpg"
  alt="Katy tejiendo en su telar"
  width={1200}
  height={800}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Card de curso
<Image
  src={course.thumbnail_url}
  alt={`Portada del curso ${course.title}`}
  width={600}
  height={450}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

- **Siempre `alt` descriptivo** (accesibilidad + SEO de imágenes).
- Subir originales al menos 2x del tamaño máximo de render.
- Comprimir antes de subir (Squoosh, ImageOptim).

## 5.9 Internal linking

- Footer con links a todas las categorías principales.
- En cada detalle de curso: 3 cursos relacionados al final.
- En cada post de blog: 2-3 links internos a cursos/productos relevantes con anchor text descriptivo.
- Breadcrumbs visibles en mobile y desktop.
- Anchor text variado (no usar siempre "click aquí").

## 5.10 Mobile-first

- Mobile como primer viewport en diseño y test.
- Tap targets ≥ 44px.
- Sin horizontal scroll en ningún punto.
- Menú hamburguesa accesible (con focus trap correcto).
- Botón de WhatsApp sticky en mobile, pequeño en desktop.

## 5.11 Setup post-deploy

- [ ] Verificar dominio en **Google Search Console**, enviar sitemap.
- [ ] Verificar dominio en **Bing Webmaster Tools**.
- [ ] Configurar **GA4** con events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`.
- [ ] Configurar **Meta Pixel** con events: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`.
- [ ] Solicitar primera indexación manual en Search Console para landing + cursos top.
- [ ] Configurar redirecciones 301 si había sitio previo.
- [ ] Test Lighthouse: score ≥ 90 en Performance, SEO, Accessibility, Best Practices.
- [ ] Test https://search.google.com/test/mobile-friendly
- [ ] Test https://search.google.com/test/rich-results para cada tipo de página.

## 5.12 SEO checklist por página

Antes de publicar cualquier página, verificar:

- [ ] Title único, 50-60 chars, incluye keyword principal
- [ ] Meta description única, 140-160 chars, con CTA
- [ ] H1 único por página, incluye keyword principal
- [ ] Estructura H2/H3 jerárquica (no saltarse H2 directo a H4)
- [ ] Canonical URL correcto
- [ ] Open Graph + Twitter Cards
- [ ] JSON-LD según tipo de página
- [ ] Imágenes con alt descriptivo
- [ ] Internal links contextuales (≥ 2 por página)
- [ ] URL en kebab-case, descriptiva, sin parámetros
- [ ] Mobile-friendly (test en DevTools mobile view)
- [ ] LCP < 2.5s (test con Lighthouse)
- [ ] Sin contenido oculto (display:none) con keywords (black-hat)

---

# 6. Estructura de páginas + copy

> Resumen. Para detalle completo de cada sección, ver el bloque por página.

## 6.1 Mapa del sitio

```
/                              Landing
/cursos                        Listado
/cursos/[slug]                 Detalle (página de venta)
/tienda                        Listado
/tienda/[slug]                 Detalle
/sobre-mi                      Marca personal
/diario                        Blog (fase 2)
/diario/[slug]                 Post (fase 2)
/contacto                      Form + WhatsApp + IG
/preguntas-frecuentes
/login, /registro, /recuperar
/carrito, /checkout
/pago/exito, /pago/fallo, /pago/pendiente
/mi-cuenta                     Datos
/mis-cursos                    Cursos comprados
/mis-compras                   Historial + boletas
/aprende/[curso]/[leccion]     Reproductor
/admin/*                       Panel
```

## 6.2 Landing — secciones en orden

1. **Hero**: eyebrow + H1 ("Tejer puede ser tu nuevo lugar favorito" o variante), subhead, CTA primario "Ver cursos", CTA secundario "Conocer a Katy", foto fuerte de manos/telar.
2. **Tira de credibilidad** (banda oscura): "+200 alumnas", "5.0 rating", "+50h contenido", "Acceso de por vida".
3. **Para quién es** ("Tres formas de empezar"): 3 columnas — "Nunca has tejido", "Quieres mejorar técnica", "Tejer para vender".
4. **Cursos destacados**: grid de 3 cards (principiante, intermedio, avanzado).
5. **Cómo funciona**: 4 pasos (eliges → recibes acceso → aprendes a tu ritmo → tejes tu primera obra).
6. **Sobre Katy (mini)**: foto + 3-4 líneas de historia + CTA a `/sobre-mi`.
7. **Galería de obras de alumnas**: mosaic de 8-12 fotos, hover muestra alumna + curso.
8. **Testimonios**: 3 cards con foto real + nombre + ciudad + curso + texto.
9. **Productos destacados**: 4 cards de tienda.
10. **FAQ resumido**: 5-6 preguntas (acordeón).
11. **CTA final**: banda terracota "¿Lista para tejer tu primera pieza?" + botón grande.
12. **Footer**: logo + tagline, columnas (Aprende / Tienda / Casa), newsletter, redes, copyright, links legales.

## 6.3 Detalle de curso — secciones (página de venta)

1. **Hero**: breadcrumb, título, subtítulo, badges (nivel, duración, lecciones), descripción corta, precio + cuotas, botón "Comprar curso", trailer Mux a la derecha.
2. **Lo que aprenderás**: 6-8 bullets con check.
3. **Para quién sí / Para quién no**: 2 columnas.
4. **Programa del curso**: acordeón por módulos con lecciones; lecciones con candado o play; marca preview gratis.
5. **Sobre la instructora**: foto + bio.
6. **Galería de obras de alumnas DEL CURSO**.
7. **Testimonios DEL CURSO** (no genéricos).
8. **Qué incluye**: checklist (acceso de por vida, soporte WhatsApp 30 días, certificado, comunidad, PDFs).
9. **Precio + garantía**: caja destacada con precio, cuotas, "Garantía 7 días", logos de pago.
10. **FAQ específico del curso**.
11. **CTA final**: repetir botón compra.

## 6.4 Otras páginas

- **`/sobre-mi`**: storytelling. Foto → headline emocional → 4-5 párrafos cortos (origen, primer telar, primer error, oficio, por qué enseña) → foto taller → principios → foto con alumnas → CTA a `/cursos`.
- **`/cursos`**: hero + filtros (nivel, tipo) + grid de cards.
- **`/tienda`**: hero + filtros (categoría) + grid de cards.
- **Reproductor (`/aprende/...`)**: sidebar con módulos/lecciones + MuxPlayer central + tabs (descripción, recursos, marcar completada) + botones anterior/siguiente.

---

# 7. Customer journey (objetivo por página)

| Página | Etapa | Métrica clave | Target |
|--------|-------|---------------|--------|
| `/` | Descubrimiento + Interés | Bounce rate | < 60% |
| `/sobre-mi` | Confianza | Tiempo en página | > 60s |
| `/cursos` | Transición a consideración | Click a curso | > 50% |
| `/cursos/[slug]` | Consideración → Compra | Add-to-cart rate | > 8% |
| `/checkout` | Compra | Conversión | > 75% |
| `/pago/exito` | Onboarding | Click "Empezar curso" | > 80% |
| `/aprende/...` | Consumo | Completion rate | > 40% |

**Las 5 objeciones que la página de detalle de curso DEBE responder en orden:**
1. "¿Esto es para mí?" → "Para quién sí/no"
2. "¿Qué voy a aprender?" → Programa detallado
3. "¿La profe sabe enseñar?" → Free preview + bio + testimonios
4. "¿Vale la plata?" → "Qué incluye" + cuotas
5. "¿Y si no me gusta?" → Garantía 7 días

**5 reglas de oro de conversión:**
1. Free preview de lección 1 sin login obligatorio.
2. Checkout en < 90 segundos, sin registro previo (la cuenta se crea con el email del checkout).
3. Mostrar siempre precio en cuotas, no solo total.
4. Email automático a las 24h si la alumna no entró al curso.
5. Botón WhatsApp humano en todas las páginas críticas.

**Secuencias de email automatizadas (Resend):**

- **Bienvenida post-compra** (4 emails):
  - Día 0: Tu acceso + datos de cuenta
  - Día 2: ¿Ya empezaste? (solo si no entró)
  - Día 7: ¿Cómo va? + tip
  - Día 14: Recordatorio + invitación a IG/WhatsApp
- **Carrito abandonado** (2 emails):
  - +1h: "Te quedaste a un paso"
  - +24h: "10% de descuento por hoy: VOLVER10"
- **Post-curso completado** (3 emails):
  - Inmediato: Felicitaciones + certificado + pedido testimonio
  - Día 7: Cross-sell siguiente nivel con 20% exalumna
  - Día 30: ¿Qué tejiste? + invitación a compartir foto

---

# 8. Panel de administración

`/admin/**` — solo para usuarios con `role='admin'`. **Doble guardia**: middleware de Next.js + verificación en cada page server-side.

## Secciones

- **Dashboard**: ventas del mes, pedidos pendientes, nuevos alumnos, top cursos, gráfico 30 días.
- **Cursos**: lista, crear, editar (3 tabs: General / Programa / SEO). En "Programa", drag-and-drop de módulos y lecciones. Subida de video con **Mux Direct Upload** (no pasa por server).
- **Productos**: lista, crear, editar. Campos: nombre, descripción, precio, stock, peso, fotos múltiples, categoría, SEO.
- **Órdenes**: tabla con filtros (estado, fecha, tipo). Click → detalle. Marcar como enviado (productos físicos).
- **Alumnos**: listado con nombre, email, # cursos, fecha. Click → ver progreso.
- **Cupones**: crear códigos (% o monto fijo), vigencia, usos máximos.
- **Reviews**: aprobar/rechazar reseñas antes de publicar.
- **Configuración**: datos empresa, branding (logo, colores), email templates editables, páginas estáticas (sobre, FAQ, términos).

## Flujo de subida de video (lo que más vamos a usar)

1. Admin entra a curso → click "Agregar lección".
2. Form: título, descripción, posición, "Es preview gratuito" toggle.
3. Campo "Subir video": el cliente pide al backend un `Mux Direct Upload URL` → el video sube **directo a Mux desde el navegador** (no pasa por nuestro server → rápido y barato).
4. Mux procesa en 5-10 min. Webhook nos avisa cuando está listo → marcamos lección como publicada.
5. Los alumnos inscritos ya pueden verla.

---

# 9. Tono de voz y reglas de copy

**Voz de marca:** Katy en primera persona singular. Cercana, en chileno suave (sin modismos pesados), maternal sin condescendencia, orgullosa del oficio. Tutea siempre.

**No-go:** lenguaje corporativo, marketing agresivo ("¡COMPRA YA!"), promesas exageradas, emojis excesivos.

**Reglas de copy:**

1. **Una idea por frase.** Frases cortas.
2. **Mostrar, no decir.** "Vas a terminar tu primer tapiz" > "El curso es excelente".
3. **Cuantificar.** "En 6 semanas, tejiendo 30 min al día" > "Aprende rápido".
4. **Eliminar hedging.** "Vas a aprender" > "Quizás puedas aprender".
5. **CTA con verbo de acción.** "Quiero empezar", "Comprar curso". No "Click aquí" ni "Más info".
6. **Invitación, no imperativo.** "Quiero empezar" > "Inscríbete ya".
7. **Sin jerga sin explicar.** Primero "trama", después qué es.
8. **Headlines en serif display, body en sans.**

**Ejemplos antes/después:**

| ❌ Antes | ✅ Después |
|----------|------------|
| "COMPRAR AHORA" | "Quiero empezar →" |
| "Tu compra ha sido procesada exitosamente" | "Gracias por confiar 🧶 Tu acceso está aquí abajo." |
| "Soy Katy, instructora con X años de experiencia" | "Tejer cambió cómo me relaciono con el tiempo. Te cuento cómo llegué hasta acá." |
| "En este curso aprenderás técnicas de urdimbre" | "Te acompaño a hacer tu primer tapiz, paso a paso, sin secretos." |

**Paleta visual provisional:** crema `#F4EDE2`, terracota `#C0633D`, marrón profundo `#1F1410`, peach acento `#E8B89B`, verde musgo `#6B7B5A`. Refinable cuando definamos branding final.

**Tipografía provisional:** Fraunces (display serif) + Manrope (body sans). Distintiva, evita la trampa de Inter/Roboto.

---

# 10. Roadmap por fases

Cada fase termina con un commit funcional y deploy de preview en Vercel.

### Fase 0 — Setup (medio día)
- `npx create-next-app@latest` con TS, Tailwind, App Router
- Instalar shadcn/ui, libs principales (ver sección 11.1)
- Crear repo GitHub, conectar Vercel
- Crear proyecto Supabase, configurar `.env.local`
- Aplicar SQL completo (sección 3 + RLS de sección 4.5)
- Generar tipos TS

### Fase 1 — Seguridad base + Auth + Layouts (1 día)
- Configurar headers de seguridad (`next.config.js`, Apéndice A)
- Implementar Supabase Auth (email + Google)
- Middleware para sesión + protección de rutas privadas + protección de `/admin`
- Layouts: marketing, account, admin
- Páginas `/login`, `/registro`, `/recuperar-password`
- Setup de Sentry + Vercel Analytics

### Fase 2 — Landing y catálogo público + SEO (2-3 días)
- Landing con todas las secciones (sección 6.2)
- `/cursos` listado con filtros
- `/cursos/[slug]` detalle con todas las secciones (sección 6.3)
- Trailer Mux público
- Skill `frontend-design` aplicado para UI
- **SEO completo** (sección 5): metadata, sitemap, robots, JSON-LD, OG, optimización de imágenes

### Fase 3 — Carrito y checkout (2 días)
- Carrito Zustand + persistencia
- `/checkout` con form mínimo
- `POST /api/checkout` que crea preference MP (sandbox)
- `/pago/exito`, `/pago/fallo`, `/pago/pendiente`
- Webhook con verificación HMAC (sección 4.7)
- Rate limiting en endpoints críticos
- Email confirmación con Resend

### Fase 4 — Reproductor protegido (2 días)
- Setup cuenta Mux + signing keys
- `/api/video-token` con validación de enrollment + JWT
- `/aprende/[curso]/[leccion]` con MuxPlayer
- Sidebar de navegación
- Progreso por lección

### Fase 5 — Panel de admin (3-4 días)
- Dashboard con métricas
- CRUD cursos (3 tabs: general, programa, SEO)
- Subida de video con Mux Direct Upload
- CRUD productos
- Vista de órdenes
- Audit log activado

### Fase 6 — Productos físicos (1-2 días)
- Catálogo `/tienda`
- Cálculo de envío
- Email al admin con nueva orden física

### Fase 7 — Boleta SII + pulido + tests de seguridad (2 días)
- Integración OpenFactura
- PDF adjunto en email
- Historial de compras en `/mi-cuenta`
- Lighthouse > 90 en todas las páginas
- Tests E2E críticos (Playwright)
- **Checklist completo de seguridad (4.14) y SEO (5.12)**

### Fase 8 — Marketing y growth (continuo)
- Blog (MDX)
- Newsletter
- Cupones
- Pixel Meta + GA4 events

---

# 11. Skills y agentes a usar en Claude Code

## 11.1 Skills disponibles que aplicar

- **`frontend-design`** (Anthropic public skill): aplicar al construir cualquier UI (Fase 2 sobre todo). Genera componentes con calidad de diseño alta, evita estética "AI slop".

## 11.2 Skills a CREAR en Claude Code (apéndices)

Si Claude Code tiene la capacidad de crear skills propios (vía `skill-creator` u otro mecanismo), crear estos cinco con el contenido de los apéndices al final de este documento:

- **A. `security-headers-nextjs`** — headers HTTP, CSP, configuración Next.js
- **B. `supabase-rls-patterns`** — patrones de Row Level Security
- **C. `seo-technical-nextjs`** — SEO técnico exhaustivo (metadata, JSON-LD, Core Web Vitals)
- **D. `mercadopago-checkout-pro`** — integración pagos y webhook con HMAC
- **E. `mux-signed-urls`** — video protegido con JWT

Si no tiene mecanismo de skills, igualmente los apéndices sirven como guía técnica al construir cada feature.

## 11.3 Agentes recomendados (si Claude Code soporta sub-agentes)

- **`security-reviewer`**: agente especializado que revisa cada PR buscando: secretos hardcodeados, queries sin RLS, validación de input faltante, headers de seguridad ausentes, exposición de service_role key, paths admin sin guardia.
- **`seo-reviewer`**: agente que verifica cada página nueva tenga: metadata, JSON-LD apropiado, alt en imágenes, canonical, mobile-friendly.
- **`ux-copy-reviewer`**: agente que revisa que el copy siga las reglas de tono (sección 9): tuteo, primera persona, sin marketing agresivo.

---

# 12. Prompt de arranque sugerido para Claude Code

Cuando abras Claude Code con este documento en el repo, usar este prompt inicial:

```
Acabo de cargar MASTER_INSTRUCTIONS.md a la raíz del repo. Léelo completo
antes de hacer cualquier otra cosa. Después:

1. Resume en 7 líneas qué entendiste del proyecto: qué construir, para
   quién, stack, las dos prioridades máximas (seguridad y SEO).

2. Confírmame que entendiste las 5 reglas absolutas de seguridad (sección
   4.2) y las puedes recitar.

3. Confírmame que entendiste el target de Core Web Vitals (5.7) y cómo
   pretendes lograrlo.

4. Si tienes capacidad de crear skills propios, crea los 5 skills de los
   Apéndices A-E con su contenido respectivo.

5. Cuando confirmes los 4 puntos anteriores, arranquemos la Fase 0:
   bootstrap del proyecto.

Reglas durante toda la construcción:
- Nunca commitear .env*. Verificar .gitignore en Fase 0.
- Nunca exponer SUPABASE_SERVICE_ROLE_KEY al cliente.
- Cada nueva tabla en Supabase debe tener RLS + políticas antes de hacer
  merge.
- Cada nueva página debe pasar el checklist de SEO (5.12) antes de
  hacer merge.
- Cada nuevo endpoint API debe validar input con Zod antes de procesar.
- Antes de pasar a la siguiente fase, hacer test manual en preview deploy.
```

---

# Apéndice A — Skill `security-headers-nextjs`

Crear `/.claude/skills/security-headers-nextjs/SKILL.md` (o equivalente) con:

```markdown
---
name: security-headers-nextjs
description: Configurar headers de seguridad en Next.js 15 App Router para producción. Incluye CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Usar siempre que se configure next.config.js, middleware, o se haga deploy a producción.
---

# Headers de Seguridad en Next.js 15

## next.config.js completo

```javascript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://sdk.mercadopago.com https://cdn.mux.com https://www.googletagmanager.com https://connect.facebook.net https://*.vercel-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https: https://*.mux.com https://*.supabase.co;
  media-src 'self' https://stream.mux.com;
  connect-src 'self' https://*.supabase.co https://api.mercadopago.com https://*.mux.com https://www.google-analytics.com https://*.vercel-analytics.com;
  frame-src 'self' https://www.mercadopago.com https://player.mux.com https://js.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://www.mercadopago.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader.replace(/\s{2,}/g, ' ').trim() },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  poweredByHeader: false, // Oculta "X-Powered-By: Next.js"
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};
```

## Test post-deploy

- securityheaders.com → grade A+
- observatory.mozilla.org → grade A+
- Inspeccionar consola browser: no debe haber warnings de CSP en uso normal
```

---

# Apéndice B — Skill `supabase-rls-patterns`

```markdown
---
name: supabase-rls-patterns
description: Patrones de Row Level Security en Supabase Postgres. Usar siempre que se cree una nueva tabla, se modifique una existente, o se quiera verificar que el acceso a datos es seguro.
---

# RLS Patterns

## Regla #1: TODA tabla con datos de usuario tiene RLS activado

```sql
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;
```

Sin políticas, RLS bloquea TODO acceso (incluso desde service_role NO, eso bypassa). Útil como default-deny.

## Regla #2: Función helper `is_admin()`

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
```

## Patrones por tipo de tabla

### Pública pero filtrada por estado (cursos, productos)
```sql
CREATE POLICY "anyone reads published" ON tabla
  FOR SELECT USING (status = 'published');
CREATE POLICY "admins manage" ON tabla
  FOR ALL USING (is_admin());
```

### Datos del propio usuario (orders, enrollments)
```sql
CREATE POLICY "users read own" ON tabla
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all" ON tabla
  FOR SELECT USING (is_admin());
```

### Datos derivados (order_items, lesson_progress)
```sql
CREATE POLICY "users read own via parent" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
```

## Testing manual

Después de definir políticas, probar en SQL Editor con `SET request.jwt.claims = '...'` simulando distintos usuarios.

## Anti-patrones

- ❌ Confiar en filtros del cliente para esconder datos. RLS es la única defensa real.
- ❌ Insertar registros sensibles (enrollments, orders) desde el cliente. SIEMPRE server-side con service_role.
- ❌ Olvidar políticas para INSERT/UPDATE/DELETE — la falta de política bloquea todo, lo cual puede romper features sin que sea evidente al testear.
```

---

# Apéndice C — Skill `seo-technical-nextjs`

```markdown
---
name: seo-technical-nextjs
description: SEO técnico para Next.js 15 App Router. Metadata, JSON-LD structured data, sitemap, robots, Open Graph, Core Web Vitals. Usar siempre que se cree una página nueva, se modifique metadata, o se trabaje en optimización de rendimiento.
---

# SEO Técnico Next.js 15

## Checklist por página nueva

1. **Metadata vía `generateMetadata` o `export const metadata`**
   - title 50-60 chars, único, con keyword principal
   - description 140-160 chars, única, con CTA
   - canonical absoluto (`alternates.canonical`)
   - openGraph completo (title, description, images 1200x630, type)
   - twitter card (`summary_large_image`)

2. **H1 único** en la página, incluye keyword principal

3. **JSON-LD apropiado** según tipo:
   - Landing → Organization + WebSite
   - Curso → Course + Offer + AggregateRating (si hay reviews)
   - Producto → Product + Offer
   - Cualquier interna → BreadcrumbList
   - FAQ → FAQPage

4. **Imágenes**: `next/image` siempre, alt descriptivo, `priority` solo en LCP candidate, `sizes` correcto

5. **URL**: kebab-case, sin parámetros, ≤ 5 niveles

6. **Mobile-first**: probar en DevTools mobile

7. **Performance**:
   - LCP < 2.5s mobile
   - CLS < 0.1
   - Bundle JS < 100KB gzipped en home

8. **Si la página es privada**: `metadata.robots = { index: false, follow: false }`

## Patrones de código

### Generación dinámica de metadata
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(params.slug);
  if (!data) return { robots: { index: false } };
  return {
    title: data.seo_title || `${data.title} · Marca`,
    description: data.seo_description?.slice(0, 160),
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/path/${data.slug}` },
    openGraph: { title: data.title, images: [{ url: data.og_image, width: 1200, height: 630 }] },
  };
}
```

### JSON-LD component
```typescript
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

## Validación obligatoria pre-merge

- https://search.google.com/test/rich-results (para cada tipo de página)
- Lighthouse → SEO ≥ 95, Performance ≥ 90
- https://search.google.com/test/mobile-friendly
```

---

# Apéndice D — Skill `mercadopago-checkout-pro`

```markdown
---
name: mercadopago-checkout-pro
description: Integración Mercado Pago Checkout Pro para Chile en Next.js. Crear preferencias, manejar webhook con verificación HMAC, idempotencia, manejo de estados (approved, rejected, pending). Usar siempre que se trabaje en endpoints de pago.
---

# Mercado Pago Checkout Pro (Chile)

## SDK

`npm install mercadopago`

## Crear preferencia

```typescript
// app/api/checkout/route.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: Request) {
  // 1) Validar input con Zod
  // 2) Validar sesión de usuario
  // 3) Crear orden interna en DB con status 'pending'
  // 4) Crear preferencia
  const preference = await new Preference(client).create({
    body: {
      items: orderItems.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.price_clp,
        currency_id: 'CLP',
      })),
      payer: { email: user.email },
      external_reference: order.id, // mapear orden interna
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/exito?order=${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/fallo?order=${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/pendiente?order=${order.id}`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
    },
  });
  return Response.json({ init_point: preference.init_point });
}
```

## Webhook con HMAC

Ver código completo en sección 4.7 del MASTER_INSTRUCTIONS.md.

Reglas críticas:
1. Verificar firma con `crypto.timingSafeEqual` (NO `===`)
2. Idempotencia con `x-request-id`
3. NO confiar en payload del webhook → consultar a la API de MP con el `payment_id` para obtener el estado real
4. Solo si `status === 'approved'` marcar orden como paid + crear enrollments
5. Logear todo en `audit_log`

## Sandbox

Antes de producción, probar todos los flujos en sandbox:
- Tarjeta aprobada: 5031 7557 3453 0604 (Mastercard test)
- Tarjeta rechazada por fondos: usar nombre `OTHE`
- Tarjeta pendiente: usar nombre `CONT`

## Comisiones (info de referencia)

- Chile: ~3.19% + IVA por transacción (variable según método y plan)
- Tiempos de acreditación: inmediato (con retención), o 1-2 días hábiles para liberación total
```

---

# Apéndice E — Skill `mux-signed-urls`

```markdown
---
name: mux-signed-urls
description: Servir video protegido con Mux usando signed URLs. Crear assets con signing policy, firmar JWT en server, integrar MuxPlayer en cliente. Usar siempre que se trabaje con video del curso o reproductor.
---

# Mux Signed URLs

## Setup

`npm install @mux/mux-node @mux/mux-player-react`

Crear signing key en dashboard de Mux → guardar `MUX_SIGNING_KEY_ID` y la private key en RSA.

## Crear asset con signing policy

```typescript
import Mux from '@mux/mux-node';
const mux = new Mux({ tokenId: process.env.MUX_TOKEN_ID!, tokenSecret: process.env.MUX_TOKEN_SECRET! });

const asset = await mux.video.assets.create({
  input: [{ url: uploadUrl }],
  playback_policy: ['signed'], // ⚠️ obligatorio
  encoding_tier: 'smart',
});

// asset.playback_ids[0].id es el playback_id que guardas en DB (lessons.mux_playback_id)
```

## Firmar JWT en backend

```typescript
// app/api/video-token/route.ts
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('lesson_id');

  // 1) Verificar sesión
  const user = await getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  // 2) Cargar lección + verificar acceso
  const lesson = await getLessonWithCourse(lessonId);
  if (!lesson) return new Response('Not found', { status: 404 });

  const hasAccess = lesson.is_free_preview || await userHasEnrollment(user.id, lesson.course_id);
  if (!hasAccess) return new Response('Forbidden', { status: 403 });

  // 3) Firmar token (1 hora de vigencia)
  const token = jwt.sign(
    { sub: lesson.mux_playback_id, aud: 'v', exp: Math.floor(Date.now() / 1000) + 3600 },
    process.env.MUX_SIGNING_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    { algorithm: 'RS256', keyid: process.env.MUX_SIGNING_KEY_ID! }
  );

  return Response.json({ token, playback_id: lesson.mux_playback_id });
}
```

## Reproductor en cliente

```typescript
'use client';
import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/video-token?lesson_id=${lessonId}`)
      .then(r => r.json())
      .then(d => { setToken(d.token); setPlaybackId(d.playback_id); });
  }, [lessonId]);

  if (!token || !playbackId) return <div>Cargando...</div>;

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={{ playback: token }}
      metadata={{ video_title: 'Lección', viewer_user_id: 'user-id' }}
      streamType="on-demand"
    />
  );
}
```

## Subida directa desde admin

```typescript
// Backend: pide URL de upload
const upload = await mux.video.uploads.create({
  cors_origin: process.env.NEXT_PUBLIC_SITE_URL,
  new_asset_settings: { playback_policy: ['signed'], encoding_tier: 'smart' },
});
// upload.url se devuelve al cliente

// Cliente: sube archivo directo a Mux con UpChunk
import * as UpChunk from '@mux/upchunk';
const uploader = UpChunk.createUpload({ endpoint: upload.url, file });
uploader.on('success', () => { /* asset listo, esperar webhook */ });
```

## Webhook de Mux (asset ready)

Configurar en dashboard Mux → endpoint a `/api/webhooks/mux`. Cuando llega `video.asset.ready`, extraer `playback_ids[0].id` y guardarlo en la lección correspondiente.

## Anti-patrones

- ❌ Servir asset con `playback_policy: 'public'` y "seguridad por oscuridad"
- ❌ Firmar JWT sin verificar enrollment
- ❌ Token sin expiración o con expiración larga (> 1h)
- ❌ Almacenar private key en cliente
```

---

# Fin del documento

Cualquier duda durante la construcción, volver a esta referencia. Cuando algo no esté cubierto acá, priorizar: **seguridad > SEO > conversión > estética**, en ese orden.
