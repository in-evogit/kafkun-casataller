# ADDENDUM — Modo Desarrollo Inicial

> Este documento complementa `MASTER_INSTRUCTIONS.md`. Léelo después del master.
>
> **Contexto**: el proyecto se construye en **modo desarrollo/staging** primero, sin formalización tributaria de la dueña ni dominio comprado. Cuando todo esté funcionando y aprobado, se migra a producción con cambios mínimos.

---

## Marca

- **Nombre comercial**: Casa Taller Kafkun
- **Handle Instagram**: @casataller_kafkun (ya existe, es de la dueña)
- **Dueña**: Katherine ("Katy")
- **Origen**: familia del sur de Chile
- **Tono**: cercano, primera persona, chileno suave, maternal sin condescendencia

---

## Modo: Desarrollo / Staging

### Lo que cambia respecto al master original

| Item | Master original | Modo dev (este addendum) |
|------|-----------------|---------------------------|
| Dominio | Comprar `.cl` o `.com` | Usar dominio Vercel preview (`kafkun-casataller.vercel.app`) |
| Mercado Pago | Producción con HMAC | **Sandbox/test** con HMAC (mismo código, distintas credenciales) |
| Boleta SII (OpenFactura) | Activa, automática | **Desactivada con feature flag** `BOLETA_AUTO_ENABLED=false`. Código presente, no se ejecuta. |
| Resend | Producción | Resend free tier, dominio `onresend.com` o similar |
| Datos en DB | Reales | Cursos de prueba, productos de prueba, fotos placeholder |
| Mux | Producción | Free tier (suficiente para desarrollo) |
| Supabase | Free → Pro al lanzar | Free tier durante todo desarrollo |

### Variables de entorno en modo dev

```bash
# .env.local (modo desarrollo)

# Públicas
NEXT_PUBLIC_SUPABASE_URL=                  # del proyecto Supabase free tier
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://kafkun-casataller.vercel.app
NEXT_PUBLIC_BUSINESS_MODE=development      # ← flag clave

# Privadas — DESARROLLO
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago en TEST/SANDBOX
MP_ACCESS_TOKEN=TEST-xxxxxxxxxx            # ← prefijo TEST-
MP_WEBHOOK_SECRET=                         # generar uno propio para dev
MP_MODE=sandbox                            # ← flag explícito

# Mux (mismo en dev y prod, distintos environments)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_SIGNING_KEY_ID=
MUX_SIGNING_PRIVATE_KEY=

# Resend (dev: mismo, prod: dominio verificado)
RESEND_API_KEY=
RESEND_FROM=onboarding@resend.dev          # dominio default de Resend para dev

# Boletas SII — DESACTIVADO en dev
BOLETA_AUTO_ENABLED=false                  # ← cuando true, llama OpenFactura
OPENFACTURA_API_KEY=                       # vacío en dev
EMPRESA_RUT=                               # vacío en dev
EMPRESA_RAZON_SOCIAL=
EMPRESA_DIRECCION=
EMPRESA_COMUNA=
EMPRESA_CIUDAD=
```

---

## Feature Flags

Implementar un sistema simple de flags en `lib/config.ts`:

```typescript
export const config = {
  isProduction: process.env.NEXT_PUBLIC_BUSINESS_MODE === 'production',
  mp: {
    mode: (process.env.MP_MODE ?? 'sandbox') as 'sandbox' | 'production',
    accessToken: process.env.MP_ACCESS_TOKEN!,
    webhookSecret: process.env.MP_WEBHOOK_SECRET!,
  },
  boleta: {
    autoEnabled: process.env.BOLETA_AUTO_ENABLED === 'true',
    provider: 'openfactura' as const,
  },
  email: {
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
  },
};
```

Usar en código:

```typescript
// app/api/webhooks/mercadopago/route.ts
import { config } from '@/lib/config';

// Tras pago aprobado:
if (config.boleta.autoEnabled) {
  await emitBoletaAutomatica(orderId);
} else {
  // En modo dev: avisar al admin por email para emitir manual
  await notifyAdminPendingBoleta(orderId);
}
```

Esto permite que **el código de producción esté escrito y testeado**, solo activarlo cuando Katy se formalice.

---

## Mercado Pago en Modo Sandbox

### Cuentas de prueba

MP permite crear "cuentas de prueba" tanto del vendedor como del comprador. Son independientes de la cuenta real.

1. En https://www.mercadopago.com.cl/developers → "Cuentas de prueba"
2. Crear usuario "vendedor de prueba" (te da credenciales TEST-xxx)
3. Crear usuario "comprador de prueba" (con plata virtual)

### Tarjetas de prueba (sandbox Chile)

| Resultado | Número tarjeta | CVV | Vencimiento | Nombre titular |
|-----------|----------------|-----|-------------|-----------------|
| Aprobada | 5031 7557 3453 0604 | 123 | 11/30 | APRO |
| Rechazada | 5031 7557 3453 0604 | 123 | 11/30 | OTHE |
| Pendiente | 5031 7557 3453 0604 | 123 | 11/30 | CONT |
| Fondos insuficientes | 5031 7557 3453 0604 | 123 | 11/30 | FUND |

El nombre del titular controla el resultado. Probar todos antes de pasar a producción.

### Migración a producción

Cuando Katy esté formalizada en SII y abra MP a su nombre:

1. En MP Developers crear "aplicación" producción
2. Copiar nuevas credenciales
3. En Vercel cambiar `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET`
4. Cambiar `MP_MODE=production` y `NEXT_PUBLIC_BUSINESS_MODE=production`
5. Redeploy
6. **Listo**, mismo código, ahora en vivo

---

## Datos de Prueba (Seed)

Para que el sitio se vea real durante desarrollo, crear seed con:

### 3 cursos de prueba

```typescript
// scripts/seed.ts
const seedCourses = [
  {
    slug: 'tu-primer-telar',
    title: 'Tu primer telar',
    subtitle: 'De cero a tu primer tapiz',
    description: 'Aprende los fundamentos del telar desde la base. Pensado para quien nunca ha tejido. En 12 lecciones vas a armar tu primer tapiz, paso a paso, sin saltarse nada.',
    price_clp: 45000,
    level: 'principiante',
    duration_minutes: 260,
    status: 'published',
    seo_title: 'Curso de telar para principiantes · Casa Taller Kafkun',
    seo_description: 'Aprende a tejer en telar desde cero, a tu ritmo. 12 lecciones, 4h 20min, acceso de por vida. Empieza por $45.000.',
  },
  {
    slug: 'telar-mapuche',
    title: 'Telar mapuche',
    subtitle: 'Witral, técnicas ancestrales',
    description: 'Adéntrate en el telar mapuche tradicional. Técnicas de witral, ñimin, y el respeto del oficio.',
    price_clp: 72000,
    level: 'intermedio',
    duration_minutes: 430,
    status: 'published',
  },
  {
    slug: 'diseno-propio',
    title: 'Diseño propio',
    subtitle: 'Color, composición y oficio',
    description: 'Para alumnas que ya saben tejer y quieren desarrollar su propio lenguaje. Color, composición, identidad.',
    price_clp: 68000,
    level: 'avanzado',
    duration_minutes: 400,
    status: 'published',
  },
];
```

### 6 productos de prueba

```typescript
const seedProducts = [
  { slug: 'telar-maria-mediano', name: 'Telar María mediano', price_clp: 38900, stock: 8, weight_grams: 1200 },
  { slug: 'lana-oveja-100g', name: 'Lana de oveja · 100g', price_clp: 5200, stock: 50, weight_grams: 110 },
  { slug: 'kit-iniciacion-completo', name: 'Kit completo iniciación', price_clp: 67000, stock: 5, weight_grams: 1500 },
  { slug: 'set-peines-telar', name: 'Set de peines de telar', price_clp: 12400, stock: 12, weight_grams: 300 },
  { slug: 'telar-pequeno-portatil', name: 'Telar pequeño portátil', price_clp: 24000, stock: 6, weight_grams: 600 },
  { slug: 'kit-lanas-paleta-tierra', name: 'Kit de lanas paleta tierra', price_clp: 32000, stock: 4, weight_grams: 800 },
];
```

### Imágenes placeholder

Usar https://placehold.co/ con tonos cálidos:
- Cursos: `https://placehold.co/600x450/C0633D/F4EDE2?text=Curso`
- Productos: `https://placehold.co/600x600/B85C38/F4EDE2?text=Producto`
- Hero: `https://placehold.co/1200x800/9A4D2C/F4EDE2?text=Hero`

Después se reemplazan con fotos reales.

### Usuarios de prueba

- 1 admin: tu email
- 1 alumna ficticia con enrollment a "Tu primer telar" (para probar el aula)

---

## Adjustes al Roadmap

### Lo que se mantiene igual

Fases 0 al 5 del master original son idénticas.

### Cambios

**Fase 0** — agregar:
- Configurar feature flags en `lib/config.ts`
- Setup de variables de entorno en modo dev
- Confirmar dominio Vercel preview asignado

**Fase 3** (checkout) — adaptar:
- MP en sandbox desde el inicio
- Crear usuarios de prueba MP
- Probar TODOS los estados (approved/rejected/pending/fund/expi/secu)
- Generar email manual al admin con datos para emitir boleta

**Fase 7** (originalmente boleta SII + pulido) — dividir en dos:
- **Fase 7a**: pulido + tests + checklist de seguridad y SEO (hacer en modo dev)
- **Fase 7b**: integración OpenFactura **(POSPONER hasta que Katy esté formalizada)**

### Nueva fase final: **Fase 9 — Migración a producción**

Cuando Katy decide arrancar real:

1. Katy hace inicio de actividades en SII (2-3 días)
2. Katy habilita boleta electrónica gratuita del SII
3. Katy crea cuenta MP a su nombre
4. Comprar dominio (`kafkun.cl` o el disponible)
5. Configurar dominio en Vercel → SSL automático
6. Cambiar credenciales MP a producción
7. Cambiar `NEXT_PUBLIC_BUSINESS_MODE=production`
8. Setup Resend con dominio propio (verificar DNS)
9. Decidir: ¿OpenFactura automático ($10k/mes) o emisión manual los primeros meses?
10. Si manual: dejar `BOLETA_AUTO_ENABLED=false`, recibir email tras venta, emitir boleta en sii.cl manualmente
11. Probar flujo completo en producción con tarjeta real (compra pequeña)
12. Soft launch a círculo cercano de Katy
13. Anuncio público en Instagram

---

## Lo que Katy puede ver durante desarrollo

Cuando termine Fase 5 (admin) y Fase 6 (productos), enviarle a Katy:

> *"Hola Katy, ya está la base de tu tienda online. Entra acá: [URL preview de Vercel]. Es como va a verse. Los cursos y productos son de prueba para que veas el funcionamiento. Cuando estés lista, formalizamos lo del SII (tarda 2-3 días) y lanzamos en serio."*

Esto le permite:
- Ver el sitio funcionando
- Probar comprando con tarjetas de test
- Ver el panel admin
- Decidir si quiere proceder (y formalizarse)
- Sugerir cambios antes de lanzar

---

## Resumen para Claude Code

Construir como dice el `MASTER_INSTRUCTIONS.md` original, pero con:

1. ✅ Dominio Vercel preview (no comprar)
2. ✅ MP en sandbox (no producción)
3. ✅ Feature flag `BOLETA_AUTO_ENABLED=false`
4. ✅ Seed de cursos/productos de prueba
5. ✅ Imágenes placeholder de placehold.co
6. ✅ Email transaccional con dominio default de Resend
7. ✅ Todo el código de producción presente, solo desactivado por flags

Cuando llegue el momento de producción, los cambios son **solo variables de entorno** + setup de dominio en Vercel. Cero refactor.
