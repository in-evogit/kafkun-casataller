---
name: seo-master
description: >
  Skill experto en SEO técnico y on-page para Next.js / aplicaciones web modernas. USAR SIEMPRE que el usuario mencione: SEO, search engine optimization, posicionamiento en Google, ranking, keywords, palabras clave, metadata, meta tags, title, description, Open Graph, OG tags, Twitter Cards, sitemap, sitemap.xml, robots.txt, JSON-LD, structured data, datos estructurados, schema.org, rich results, rich snippets, canonical, canonical URL, hreflang, Core Web Vitals, LCP, INP, CLS, FCP, TTFB, Lighthouse, PageSpeed Insights, indexación, indexing, Google Search Console, GSC, Bing Webmaster, crawl, crawlable, internal linking, anchor text, alt text, semantic HTML, headings H1 H2 H3, mobile-first, AMP, breadcrumbs, FAQ schema, Product schema, Course schema, Organization schema, sitemap dinámico, generateMetadata, next/image, optimización imágenes, AVIF, WebP, lazy loading. También activar al crear cualquier página pública nueva, blog posts, landing pages, páginas de producto, o al hacer migración SEO.
---

# SEO Master — Next.js 15 App Router

Este skill convierte a Claude en consultor SEO técnico senior. El SEO bien hecho desde el día 1 es 10x más barato que arreglarlo después. Toda página pública debe pasar el checklist de este skill antes de mergear.

## Filosofía Central

**SEO = (Contenido de calidad) × (Accesibilidad técnica) × (Autoridad de dominio).**

Si cualquiera de los tres es cero, el resultado es cero.

Este skill cubre principalmente los dos primeros. La autoridad se construye con links y tiempo.

**Tres principios:**
1. **Cada página tiene un solo propósito.** Una keyword principal, un H1, una intent (informational/commercial/transactional).
2. **El usuario primero, Google después.** Google premia lo que el usuario consume bien.
3. **Velocidad y mobile no son opcionales.** Son tabla rasa: si fallan, no rankeas.

## Las 10 Reglas Absolutas

1. **Toda página pública** tiene `<title>` único 50-60 chars y `<meta description>` única 140-160 chars.

2. **Un solo H1 por página**, con la keyword principal natural.

3. **Canonical URL absoluto** en cada página (incluso en la URL "canónica" → apunta a sí misma).

4. **JSON-LD apropiado** según tipo: Course, Product, Article, Organization, Breadcrumb, FAQ.

5. **Imágenes con `next/image`** y `alt` descriptivo. LCP candidate con `priority`.

6. **Páginas privadas** (login, mi-cuenta, admin) con `robots: { index: false, follow: false }`.

7. **Sitemap dinámico** que incluye todas las páginas indexables.

8. **Mobile-first**: probar en viewport mobile antes que desktop.

9. **Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1.

10. **URLs limpias** en kebab-case, sin parámetros si se puede evitar, descriptivas.

## Metadata en Next.js 15 App Router

### Estática (página simple)

```typescript
// app/sobre-mi/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre mí · Katy Academia de Telar',
  description: 'Hola, soy Katy. Tejo en telar hace 12 años y enseño a más de 200 alumnas en Chile. Te cuento cómo llegué hasta acá.',
  alternates: {
    canonical: 'https://katytelar.cl/sobre-mi',
  },
  openGraph: {
    title: 'Sobre Katy · Academia de Telar',
    description: 'Conoce a Katy y su academia online de telar.',
    url: 'https://katytelar.cl/sobre-mi',
    siteName: 'Katy Academia de Telar',
    images: [{ url: 'https://katytelar.cl/og/sobre-mi.jpg', width: 1200, height: 630 }],
    locale: 'es_CL',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Page() { /* ... */ }
```

### Dinámica (generada server-side)

```typescript
// app/cursos/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { robots: { index: false } };

  return {
    title: course.seo_title ?? `${course.title} · Curso de telar online · Katy`,
    description: course.seo_description ?? course.subtitle?.slice(0, 160),
    alternates: {
      canonical: `https://katytelar.cl/cursos/${course.slug}`,
    },
    openGraph: {
      title: course.title,
      description: course.subtitle,
      images: [{
        url: course.seo_og_image_url ?? course.thumbnail_url,
        width: 1200,
        height: 630,
        alt: `Curso ${course.title}`,
      }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
```

### Páginas privadas (NO indexar)

```typescript
export const metadata: Metadata = {
  title: 'Mi cuenta',
  robots: { index: false, follow: false },
};
```

## JSON-LD Structured Data (CRÍTICO)

JSON-LD es lo que dispara rich results en Google. **Validar SIEMPRE** en https://search.google.com/test/rich-results.

### Componente reutilizable

```typescript
// components/json-ld.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Schemas por tipo de página

#### Landing — Organization + WebSite

```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://katytelar.cl/#organization',
      name: 'Katy Academia de Telar',
      url: 'https://katytelar.cl',
      logo: 'https://katytelar.cl/logo.png',
      sameAs: [
        'https://instagram.com/katy_telar',
        'https://facebook.com/katytelar',
      ],
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
      publisher: { '@id': 'https://katytelar.cl/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://katytelar.cl/buscar?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};
```

#### Curso — Course + Offer + AggregateRating

```typescript
const courseSchema = {
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
      bestRating: 5,
      worstRating: 1,
    },
  }),
};
```

#### Producto — Product + Offer

```typescript
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  sku: product.id,
  offers: {
    '@type': 'Offer',
    price: product.price_clp,
    priceCurrency: 'CLP',
    availability: product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: `https://katytelar.cl/tienda/${product.slug}`,
    seller: { '@type': 'Organization', name: 'Katy Academia de Telar' },
  },
};
```

#### Artículo de blog — Article

```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.cover_image,
  datePublished: post.published_at,
  dateModified: post.updated_at,
  author: {
    '@type': 'Person',
    name: 'Katy',
    url: 'https://katytelar.cl/sobre-mi',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Katy Academia de Telar',
    logo: { '@type': 'ImageObject', url: 'https://katytelar.cl/logo.png' },
  },
};
```

#### Breadcrumb (en CUALQUIER página interna)

```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://katytelar.cl' },
    { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://katytelar.cl/cursos' },
    { '@type': 'ListItem', position: 3, name: course.title },
  ],
};
```

#### FAQ — FAQPage

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};
```

## Sitemap Dinámico

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/cursos`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
    { url: `${baseUrl}/sobre-mi`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' },
  ];

  // Fetch dinámico de cursos publicados
  const courses = await fetchPublishedCourses();
  const coursePages = courses.map(c => ({
    url: `${baseUrl}/cursos/${c.slug}`,
    lastModified: new Date(c.updated_at),
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }));

  // Productos publicados
  const products = await fetchPublishedProducts();
  const productPages = products.map(p => ({
    url: `${baseUrl}/tienda/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticPages, ...coursePages, ...productPages];
}
```

## Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/login',
          '/registro',
          '/recuperar',
          '/carrito',
          '/checkout',
          '/pago/',
          '/mi-cuenta',
          '/mis-cursos',
          '/mis-compras',
          '/aprende/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## Core Web Vitals — Targets y Tácticas

| Métrica | Target Mobile | Target Desktop | Cómo lograrlo |
|---------|---------------|----------------|---------------|
| LCP | < 2.5s | < 2.0s | next/image priority, preload hero, CDN edge |
| INP | < 200ms | < 100ms | Server Components, dynamic imports, evitar JS pesado |
| CLS | < 0.1 | < 0.1 | Reservar espacio para imágenes y embeds, no inyectar contenido tardío |
| FCP | < 1.8s | < 1.0s | Streaming SSR, fonts con next/font, CSS crítico inline |
| TTFB | < 600ms | < 400ms | Vercel edge, cache HTTP, evitar consultas DB sin índice |

### Optimización de imágenes

```typescript
import Image from 'next/image';

// LCP candidate (hero)
<Image
  src="/hero.jpg"
  alt="Katy tejiendo en su telar"
  width={1200}
  height={800}
  priority  // ← preload, no lazy
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Imagen normal (lazy automático)
<Image
  src={course.thumbnail_url}
  alt={`Portada del curso ${course.title}`}
  width={600}
  height={450}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Reglas:**
- Siempre `alt` descriptivo. Si es decorativa pura, `alt=""`.
- `priority` solo en LCP (típicamente 1 por página, el hero).
- Originales 2x del tamaño máximo de render.
- Formato moderno: AVIF + WebP (next/image hace automático con config).

### Fonts

```typescript
// app/layout.tsx
import { Fraunces, Manrope } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export default function RootLayout({ children }) {
  return (
    <html lang="es-CL" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`next/font` auto-hostea (no llama a Google Fonts en runtime) y previene FOUT/FOIT.

### Bundle JS

- Page de home: < 100KB gzipped first load JS
- Usar Server Components por default
- Client Components solo cuando necesitas interactividad real
- Dynamic imports para componentes pesados:

```typescript
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('./video-player'), {
  loading: () => <div>Cargando...</div>,
  ssr: false,  // si depende de window/document
});
```

## URLs y Estructura

### Reglas
- kebab-case: `/cursos/telar-mapuche-principiante` ✅, no `/cursos/Telar_Mapuche_Principiante` ❌
- Descriptivas, con keyword: `/cursos/telar-mapuche-principiante` ✅, no `/cursos/p123` ❌
- ≤ 5 niveles de profundidad
- Sin parámetros para páginas indexables (filtros usan query strings con `noindex`)

### Trailing slash

Decidir UNA política y respetarla. Next.js por defecto sin trailing slash. Si cambias, configurar redirect 301.

### Idiomas (futuro)

Si agregas inglés:
```
/es/cursos/...  (español, default)
/en/courses/...  (inglés)
```

Con `alternates.languages` en metadata + `hreflang`.

## H1, H2, H3 — Estructura semántica

```html
<h1>Curso de telar mapuche</h1>  <!-- ÚNICO H1, keyword principal -->

  <h2>Lo que aprenderás</h2>
    <h3>Técnicas básicas</h3>
    <h3>Diseño de patrones</h3>

  <h2>Programa del curso</h2>
    <h3>Módulo 1: ...</h3>
    <h3>Módulo 2: ...</h3>

  <h2>Sobre la instructora</h2>
```

**No saltar niveles:** H1 → H2 → H3, no H1 → H3.
**No usar headings para estilo visual:** usar `<h2>` porque es h2 semántico, no porque "se ve más grande".

## Internal Linking

- Footer con links a categorías principales (cursos, tienda, sobre, contacto)
- En cada detalle de curso: 3 cursos relacionados
- En blog posts: 2-3 links internos contextuales con anchor descriptivo
- Breadcrumbs visibles
- Anchor text variado, descriptivo. NO "click aquí", "leer más" → mejor "ver el curso de telar mapuche"

## Checklist por Página Nueva

Antes de mergear cualquier página pública:

- [ ] `<title>` único, 50-60 chars, con keyword principal
- [ ] `<meta description>` única, 140-160 chars, con CTA suave
- [ ] H1 único por página, con keyword
- [ ] Estructura H2/H3 jerárquica
- [ ] Canonical URL absoluto y correcto
- [ ] Open Graph completo (title, description, image 1200x630, type, url)
- [ ] Twitter Card (`summary_large_image`)
- [ ] JSON-LD apropiado según tipo de página
- [ ] Imágenes con `next/image`, alt descriptivo
- [ ] Una imagen con `priority` (LCP candidate)
- [ ] URL kebab-case, descriptiva, sin parámetros
- [ ] Mobile-friendly (DevTools mobile view + test real)
- [ ] Lighthouse SEO ≥ 95
- [ ] Lighthouse Performance ≥ 90
- [ ] Rich Results Test sin errores
- [ ] Internal links contextuales (≥ 2)
- [ ] Breadcrumb visible y en JSON-LD
- [ ] Si es privada: `robots: { index: false, follow: false }`

## Setup Post-Deploy

- [ ] Verificar dominio en Google Search Console
- [ ] Enviar sitemap.xml a GSC
- [ ] Verificar dominio en Bing Webmaster Tools
- [ ] Configurar GA4 con events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
- [ ] Configurar Meta Pixel con events: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`
- [ ] Solicitar indexación manual de landing + top 3 cursos
- [ ] Configurar redirecciones 301 si había sitio previo
- [ ] Test PageSpeed Insights en URLs clave
- [ ] Mobile-friendly Test
- [ ] Rich Results Test por cada tipo de página

## Anti-patrones

- ❌ Keyword stuffing (repetir keyword 50 veces)
- ❌ Texto blanco sobre fondo blanco (cloaking)
- ❌ Comprar backlinks de granjas
- ❌ Contenido duplicado (mismo texto en múltiples URLs sin canonical)
- ❌ Imágenes sin alt (excepto decorativas con `alt=""`)
- ❌ JS-only navigation (Google crawler tiene problemas)
- ❌ Bloquear CSS/JS en robots.txt (Google necesita renderizar)
- ❌ Múltiples H1 por página
- ❌ Meta keywords (deprecated hace años)
- ❌ AMP (deprecado, no usar para nuevos sitios)
- ❌ Auto-playing video con sonido (mata UX y rankings)
- ❌ Pop-ups intrusivos en mobile (Google penaliza)

## Cuando Crear /diario (Blog) — Estrategia de Contenido

Estructura tipo "topic cluster":

**Pillar page**: `/diario/guia-completa-telar-principiantes`
- 3000+ palabras
- Cubre exhaustivamente el tema
- Linkea a posts más específicos

**Cluster posts**:
- `/diario/que-lana-usar-en-telar`
- `/diario/diferencia-telar-mapuche-y-peine`
- `/diario/cuanto-tiempo-toma-aprender-telar`
- `/diario/herramientas-basicas-para-empezar`

Cada post linkea al pillar (anchor descriptivo) y a 1-2 posts hermanos relevantes.

Esto construye autoridad temática y rankea long-tail keywords.

## Validación Continua

Mensualmente:
- Revisar GSC: queries en las que apareces, impresiones, CTR
- Páginas con CTR bajo (< 2%) → mejorar title/description
- Páginas con buen tráfico pero bajo tiempo → mejorar contenido
- Crawl errors → corregir 404s, redirects rotos
- Core Web Vitals report → atender warnings

Trimestralmente:
- Refresh de contenido antiguo
- Auditoría de backlinks (rechazar spammy)
- Revisar competidores (qué keywords nuevos ranquean)
