---
name: nextjs-app-router
description: >
  Skill experto en patrones de Next.js 15 App Router. USAR SIEMPRE que el usuario mencione: Next.js, Next 15, App Router, Server Components, Client Components, "use client", "use server", server actions, Route Handlers, API routes, middleware.ts, loading.tsx, error.tsx, not-found.tsx, layout.tsx, page.tsx, generateMetadata, generateStaticParams, dynamic routes, parallel routes, intercepting routes, route groups, ISR, SSG, SSR, streaming, Suspense, revalidate, revalidateTag, revalidatePath, cookies(), headers(), redirect(), next/navigation, next/image, next/font, next/link, Server Actions con forms, useFormState, useFormStatus, optimistic UI, Tanstack Query, Zustand, Vercel deploy, edge runtime, nodejs runtime. También activar al estructurar carpetas, decidir entre client/server components, debuggear hydration errors, o optimizar performance.
---

# Next.js 15 App Router — Patterns Production-Grade

Skill para construir bien en Next.js 15 App Router. App Router cambia mucho la forma de pensar: por default todo es Server Component, las API routes son Route Handlers, los forms usan Server Actions.

## Filosofía Central

**Server-first.** Por default todo renderiza en el servidor. Cliente solo cuando hay interactividad real. Esto da: bundles JS pequeños, SEO excelente, mejor seguridad, mejor performance.

**Streaming + Suspense.** No bloquear el render inicial. Mostrar el esqueleto rápido, hidratar contenido async después.

**Cache por default.** Next.js cachea automáticamente. Aprender cuándo y cómo invalidar.

## Decisión Clave: Server vs Client Component

### Server Component (default, sin "use client")

Usar para:
- Cualquier componente que NO necesite interactividad
- Acceso a DB, secretos, file system
- SEO content (heading, descripción, imágenes)
- Componentes que cargan data

```typescript
// app/cursos/[slug]/page.tsx
// Es Server Component por default
import { fetchCourse } from '@/lib/courses';

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await fetchCourse(slug); // ← acceso directo a DB, sin API route

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
    </div>
  );
}
```

### Client Component ("use client" arriba)

Usar SOLO para:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- State (`useState`, `useReducer`)
- Effects (`useEffect`)
- Browser APIs (window, localStorage, etc.)
- Hooks de librerías de UI (drag-and-drop, animaciones)

```typescript
// components/like-button.tsx
'use client';
import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '♥' : '♡'}</button>;
}
```

### Patrón: Server Component que renderiza Client Component

```typescript
// app/cursos/[slug]/page.tsx (Server Component)
import { LikeButton } from '@/components/like-button';

export default async function Page() {
  const course = await fetchCourse(/* ... */);
  return (
    <>
      <h1>{course.title}</h1>
      <LikeButton /> {/* Client Component dentro de Server Component, OK */}
    </>
  );
}
```

### Anti-patrón: Client Component que importa Server Component

```typescript
// ❌ NO HACER ESTO
'use client';
import { ServerComponent } from './server-comp'; // ERROR

export function ClientWrapper() {
  return <ServerComponent />;
}
```

Solución: pasar Server Component como children:

```typescript
// ✅ HACER ESTO
'use client';
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// En el padre Server Component:
<ClientWrapper>
  <ServerComponent />
</ClientWrapper>
```

## Estructura de Carpetas Recomendada

```
app/
├── (marketing)/              # Route group, no afecta URL
│   ├── layout.tsx            # Layout específico
│   ├── page.tsx              # /
│   ├── sobre-mi/page.tsx     # /sobre-mi
│   └── contacto/page.tsx     # /contacto
├── (shop)/
│   ├── cursos/
│   │   ├── page.tsx          # /cursos
│   │   └── [slug]/
│   │       ├── page.tsx      # /cursos/[slug]
│   │       └── opengraph-image.tsx
│   └── tienda/...
├── (account)/                # Protegido (middleware)
│   ├── layout.tsx
│   ├── mi-cuenta/page.tsx
│   └── aprende/[curso]/[leccion]/page.tsx
├── (admin)/admin/            # Protegido + rol admin
│   ├── layout.tsx
│   ├── page.tsx              # /admin
│   └── cursos/...
├── api/
│   ├── checkout/route.ts
│   ├── video-token/route.ts
│   └── webhooks/
│       ├── mercadopago/route.ts
│       └── mux/route.ts
├── layout.tsx                # Root layout (fonts, providers)
├── page.tsx                  # /
├── loading.tsx               # Loading UI global
├── error.tsx                 # Error boundary
├── not-found.tsx             # 404
├── sitemap.ts
└── robots.ts

components/
├── ui/                       # shadcn/ui primitives
├── course-card.tsx
└── ...

lib/
├── supabase/
│   ├── client.ts             # Cliente browser
│   ├── server.ts             # Cliente server (RSC, server actions)
│   ├── admin.ts              # Service role (server-only)
│   └── middleware.ts
├── mercadopago.ts
├── mux.ts
└── utils.ts

types/
└── database.ts               # Generated from Supabase
```

## Layouts

```typescript
// app/layout.tsx (Root Layout)
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  metadataBase: new URL('https://katytelar.cl'),
  title: { default: 'Katy Academia de Telar', template: '%s · Katy' },
  description: 'Academia online de telar en Chile.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

```typescript
// app/(marketing)/layout.tsx (Sub-layout)
import { MarketingHeader } from '@/components/marketing/header';
import { MarketingFooter } from '@/components/marketing/footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
```

## Loading, Error, Not Found

```typescript
// app/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Cargando...</div>;
}

// app/error.tsx
'use client'; // Error boundaries deben ser client
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Reintentar</button>
    </div>
  );
}

// app/not-found.tsx
export default function NotFound() {
  return <div>Página no encontrada</div>;
}
```

## Streaming con Suspense

```typescript
// app/cursos/page.tsx
import { Suspense } from 'react';
import { CourseList } from '@/components/course-list';
import { CourseListSkeleton } from '@/components/skeletons';

export default function CoursesPage() {
  return (
    <div>
      <h1>Todos los cursos</h1>
      {/* Header se renderiza inmediato, lista en streaming */}
      <Suspense fallback={<CourseListSkeleton />}>
        <CourseList />
      </Suspense>
    </div>
  );
}

// CourseList es Server Component async
async function CourseList() {
  const courses = await fetchCourses(); // toma 500ms
  return courses.map(c => <CourseCard key={c.id} course={c} />);
}
```

## Server Actions (Forms)

Patrón moderno para forms. Reemplaza API routes en muchos casos.

```typescript
// app/contacto/actions.ts
'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export async function submitContact(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: 'Datos inválidos' };
  }

  // Enviar email, guardar en DB, etc.
  await sendEmail(parsed.data);

  redirect('/contacto/gracias');
}
```

```typescript
// app/contacto/page.tsx
import { submitContact } from './actions';

export default function ContactPage() {
  return (
    <form action={submitContact}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Server Action con estado (useFormState)

```typescript
'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { submitContact } from './actions';

export function ContactForm() {
  const [state, formAction] = useFormState(submitContact, { error: null });
  return (
    <form action={formAction}>
      {/* ... */}
      <SubmitButton />
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Enviando...' : 'Enviar'}</button>;
}
```

## Route Handlers (API routes)

Para endpoints REST puros (webhooks, integraciones externas):

```typescript
// app/api/webhooks/mercadopago/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  // ...
  return Response.json({ ok: true });
}
```

**Cuándo usar Server Action vs Route Handler:**
- Server Action: forms internos, mutaciones desde tu UI
- Route Handler: webhooks externos, endpoints que llamarán terceros, integraciones móviles

## Middleware

```typescript
// middleware.ts (raíz, no en /app)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Crear cliente Supabase para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: '', ...options }),
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  // Rutas protegidas
  const isProtected = pathname.startsWith('/mi-cuenta') ||
                       pathname.startsWith('/aprende') ||
                       pathname.startsWith('/admin');

  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Solo admin para /admin/**
  if (pathname.startsWith('/admin') && session) {
    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (role?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Importante:** middleware corre en edge runtime. No puedes usar todas las APIs de Node. Para lógica pesada, hacerla en Server Components / Server Actions.

## Cache y Revalidation

### Cache automático

Por default, fetch() en Server Components se cachea hasta revalidar manualmente.

```typescript
// Cacheado para siempre (hasta deploy)
const data = await fetch('https://api.example.com/data');

// Sin cache (siempre fresco)
const data = await fetch('https://api.example.com/data', { cache: 'no-store' });

// ISR: revalida cada 60s
const data = await fetch('https://api.example.com/data', { next: { revalidate: 60 } });
```

### Revalidar bajo demanda

```typescript
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateCourse(id: string, data: any) {
  await db.update(/* ... */);
  revalidatePath(`/cursos/${slug}`); // refresca esa página
  revalidatePath('/cursos'); // y el listado
}
```

### Tags para cache granular

```typescript
const courses = await fetch('https://api/courses', { next: { tags: ['courses'] } });

// En otro lado:
revalidateTag('courses'); // invalida todo lo tageado así
```

## Dynamic Routes

```typescript
// app/cursos/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  // ...
}

// Generación estática (SSG) en build time
export async function generateStaticParams() {
  const courses = await fetchAllCourseSlugs();
  return courses.map(c => ({ slug: c.slug }));
}
```

```typescript
// app/diario/[...path]/page.tsx (catch-all)
type Props = { params: Promise<{ path: string[] }> };
```

## Parallel Routes (avanzado)

Para mostrar múltiples páginas en paralelo en un mismo layout:

```
app/
├── @feed/
│   └── page.tsx
├── @sidebar/
│   └── page.tsx
└── layout.tsx  // recibe { feed, sidebar, children }
```

Útil para dashboards admin.

## Generación de Open Graph Images Dinámicas

```typescript
// app/cursos/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const course = await fetchCourse(params.slug);

  return new ImageResponse(
    (
      <div style={{ /* JSX como CSS */ }}>
        <h1>{course.title}</h1>
        <p>Curso de telar</p>
      </div>
    ),
    { ...size }
  );
}
```

Genera dinámicamente la imagen OG para cada curso. Brutal para SEO/redes.

## Performance Tips

### Reduce Client Component bundle

- Cada `'use client'` agrega al bundle JS. Minimizar.
- Si un componente solo necesita interactividad en una pequeña parte, extraer SOLO esa parte como Client.

### Imágenes con next/image

```typescript
import Image from 'next/image';

<Image
  src={course.thumbnail_url}
  alt={course.title}
  width={600}
  height={450}
  priority={isHero}
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

### Fonts con next/font

```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

Self-hosted automáticamente, sin requests externos, sin FOUT/FOIT.

### Dynamic imports

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <p>Cargando...</p>,
  ssr: false, // si depende de window
});
```

## Errores Comunes y Soluciones

### "Hydration mismatch"

Causa: el HTML del servidor no coincide con el del cliente al hidratar.

Comunes:
- Fechas formateadas con `Date.now()` o `Math.random()` en render
- `window` o `localStorage` accedido durante render
- HTML inválido (ej: `<p>` dentro de otro `<p>`)

Solución: usar `useEffect` para lógica que solo corre en cliente.

### "Cannot use cookies() outside of Server Component/Action"

Causa: tratar de leer cookies desde un Client Component.

Solución: leer en Server Component, pasar como prop.

### "Module not found: Can't resolve 'fs'"

Causa: importar módulo de Node en Client Component.

Solución: ese código va a Server Component / Server Action / Route Handler.

### "useFormState only works on Client Components"

Causa: usar hook en archivo server.

Solución: marcar componente como `'use client'`.

## Checklist al Construir Nueva Feature

- [ ] ¿Server Component por default? Solo `'use client'` donde necesite interactividad
- [ ] ¿Usa `await params` (Next 15 los params son async)?
- [ ] ¿Form usa Server Action o necesita API route?
- [ ] ¿Tiene loading.tsx en su carpeta o usa Suspense?
- [ ] ¿Tiene error.tsx para error boundary?
- [ ] ¿Páginas dinámicas tienen `generateMetadata`?
- [ ] ¿Páginas dinámicas tienen `generateStaticParams` (si son pre-renderizables)?
- [ ] ¿Revalidation correcta? (ISR, on-demand, no-store)
- [ ] ¿Imágenes con next/image?
- [ ] ¿Cliente NO importa Server Components (usa children pattern)?

## Anti-patrones

- ❌ Marcar TODA la app como `'use client'` (pierdes los beneficios)
- ❌ Acceso a DB desde Client Component (necesita API route innecesaria)
- ❌ Fetch del lado cliente cuando podías hacerlo server-side
- ❌ Pasar funciones como props de Server a Client (deben ser serializables)
- ❌ Olvidar `await` en `params` y `searchParams` (Next 15 los hizo async)
- ❌ Usar middleware para lógica pesada (limita performance edge)
- ❌ No invalidar cache tras mutación (ven datos viejos)
- ❌ Usar `getServerSideProps`/`getStaticProps` (Pages Router, no App Router)
