---
name: mux-video-protected
description: >
  Skill experto en servir video protegido con Mux usando signed URLs / JWT. USAR SIEMPRE que el usuario mencione: Mux, video streaming, video hosting, video protegido, signed URLs, signed playback, JWT para video, video on demand, VOD, HLS, adaptive bitrate, DRM, video privado, video paywall, plataforma de cursos, video en cursos online, direct upload, mux player, MuxPlayer, mux-node, upchunk, transcoding, asset, playback_id, signing key, video DRM Widevine FairPlay, watermark, screen recording protection, anti-piratería video. También activar al construir reproductor de video, sistema de cursos, upload de video desde admin, o protección de contenido pagado.
---

# Mux Video Protegido

Skill para servir video protegido (cursos pagados) con Mux + signed URLs en Next.js. Mux es el mejor servicio para esto en términos de calidad/precio/facilidad.

## Filosofía Central

**Si el video se puede ver sin pagar, nadie paga.**

Mux signed URLs resuelve esto con JWT cortos (1h) que tu backend firma solo si el usuario tiene acceso. El video deja de cargar tras el plazo. Si comparten el link, queda inservible rápido.

Para protección extra (que el usuario no pueda descargar mientras lo ve), existe DRM (Widevine/FairPlay/PlayReady) que Mux también soporta, pero es complejo y caro. Se justifica solo si la piratería se vuelve problema real.

## Las 7 Reglas Absolutas

1. **TODO asset de video se crea con `playback_policy: 'signed'`**, nunca `'public'`. Una vez creado, no se puede cambiar.

2. **El JWT se firma server-side**, nunca en el cliente. La private key nunca llega al navegador.

3. **El JWT expira en 1 hora máximo.** Si el usuario sigue viendo, el player pide otro automáticamente (re-fetch del endpoint).

4. **Antes de firmar, verificar acceso**: usuario tiene enrollment al curso O la lección es `is_free_preview`. Si no, 403.

5. **Subida de video desde admin: usar Direct Upload.** El archivo va de navegador → Mux, no pasa por tu server. Más rápido, no consume bandwidth tuyo.

6. **Configurar webhook de Mux** para enterarte cuándo un asset está `ready` (procesado).

7. **Rate limit en `/api/video-token`** para evitar que alguien firme tokens infinitos.

## Setup Inicial

### 1. Cuenta Mux

1. Crear cuenta en https://dashboard.mux.com
2. Settings → Access Tokens → Generate new token
   - Permisos: Mux Video (Full)
   - Guardar `MUX_TOKEN_ID` y `MUX_TOKEN_SECRET`
3. Settings → Signing Keys → Generate new signing key
   - Guardar `MUX_SIGNING_KEY_ID` y la **private key** (en formato RSA, no la pierdas, solo se muestra una vez)

### 2. Variables de entorno

```
# .env.local

# API access (para crear assets, leer info)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Signing (para firmar JWTs de playback)
MUX_SIGNING_KEY_ID=
MUX_SIGNING_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----"
```

**Nota sobre la private key:** se guarda con `\n` literal en `.env`. En código se reemplaza por saltos de línea reales con `.replace(/\\n/g, '\n')`.

### 3. Instalación

```bash
npm install @mux/mux-node @mux/mux-player-react @mux/upchunk jsonwebtoken
npm install -D @types/jsonwebtoken
```

## Crear Asset con Signing Policy

Cuando el admin sube una lección, el archivo sube a Mux. El asset se crea con policy 'signed':

```typescript
// lib/mux.ts
import Mux from '@mux/mux-node';

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// Para subida de archivos remotos (URL)
export async function createAssetFromUrl(url: string) {
  return mux.video.assets.create({
    input: [{ url }],
    playback_policy: ['signed'], // ⚠️ OBLIGATORIO para contenido pagado
    encoding_tier: 'smart',
    mp4_support: 'none', // no permitir descarga MP4
    normalize_audio: true,
  });
}
```

## Direct Upload desde Admin (lo común)

Patrón: el admin elige archivo en su navegador → backend pide URL de upload a Mux → cliente sube directo a esa URL → Mux procesa → webhook nos avisa cuando está ready.

### Backend: generar URL de upload

```typescript
// app/api/admin/mux-upload/route.ts
import { mux } from '@/lib/mux';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  await requireAdmin();

  const upload = await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_SITE_URL!,
    new_asset_settings: {
      playback_policy: ['signed'],
      encoding_tier: 'smart',
      mp4_support: 'none',
    },
  });

  return Response.json({
    upload_url: upload.url,
    upload_id: upload.id,
  });
}
```

### Frontend: subir con UpChunk

```typescript
// components/admin/video-upload.tsx
'use client';
import { useState } from 'react';
import * as UpChunk from '@mux/upchunk';

export function VideoUpload({ onUploaded }: { onUploaded: (uploadId: string) => void }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);

    // 1) Pedir URL al backend
    const res = await fetch('/api/admin/mux-upload', { method: 'POST' });
    const { upload_url, upload_id } = await res.json();

    // 2) Subir con UpChunk (resumable, chunked)
    const uploader = UpChunk.createUpload({
      endpoint: upload_url,
      file,
      chunkSize: 5120, // KB por chunk
    });

    uploader.on('progress', (e) => setProgress(e.detail));
    uploader.on('success', () => {
      setUploading(false);
      onUploaded(upload_id);
    });
    uploader.on('error', (e) => {
      setUploading(false);
      console.error('Upload failed', e.detail);
    });
  }

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max={100} />}
    </div>
  );
}
```

## Webhook de Mux (asset listo)

Cuando Mux termina de procesar el video, dispara `video.asset.ready`. Ahí guardas el `playback_id` en tu DB.

```typescript
// app/api/webhooks/mux/route.ts
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('mux-signature') ?? '';

  // Verificar firma
  // Mux firma con: t=timestamp,v1=hash
  const parts = Object.fromEntries(
    signature.split(',').map(kv => kv.split('=').map(s => s.trim()))
  );
  const t = parts.t;
  const v1 = parts.v1;

  const payload = `${t}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', process.env.MUX_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === 'video.asset.ready') {
    const asset = event.data;
    const uploadId = asset.upload_id;
    const playbackId = asset.playback_ids?.[0]?.id;

    if (uploadId && playbackId) {
      // Encontrar la lección que pertenece a este upload_id
      await supabaseAdmin
        .from('lessons')
        .update({
          mux_asset_id: asset.id,
          mux_playback_id: playbackId,
          duration_seconds: Math.round(asset.duration ?? 0),
        })
        .eq('mux_upload_id', uploadId); // requiere guardar upload_id al crearlo
    }
  }

  return new Response('ok');
}
```

## Endpoint para Firmar JWT de Playback

Este es el corazón del sistema de protección.

```typescript
// app/api/video-token/route.ts
import jwt from 'jsonwebtoken';
import { getUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('lesson_id');

  if (!lessonId) {
    return Response.json({ error: 'Missing lesson_id' }, { status: 400 });
  }

  // 1) Verificar sesión
  const user = await getUser();
  if (!user) {
    return Response.json({ error: 'Auth required' }, { status: 401 });
  }

  // 2) Cargar lección con curso
  const { data: lesson } = await supabaseAdmin
    .from('lessons')
    .select(`
      id, mux_playback_id, is_free_preview,
      module:modules!inner (
        course_id
      )
    `)
    .eq('id', lessonId)
    .single();

  if (!lesson || !lesson.mux_playback_id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  // 3) Chequear acceso
  let hasAccess = lesson.is_free_preview;

  if (!hasAccess) {
    const courseId = (lesson.module as any).course_id;
    const { data: enrollment } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();
    hasAccess = !!enrollment;
  }

  if (!hasAccess) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 4) Firmar JWT (vigencia 1h)
  const privateKey = process.env.MUX_SIGNING_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const token = jwt.sign(
    {
      sub: lesson.mux_playback_id, // playback_id
      aud: 'v', // 'v' = video playback
      exp: Math.floor(Date.now() / 1000) + 3600, // 1h
    },
    privateKey,
    {
      algorithm: 'RS256',
      keyid: process.env.MUX_SIGNING_KEY_ID!,
    }
  );

  return Response.json({
    token,
    playback_id: lesson.mux_playback_id,
  });
}
```

## Reproductor en el Cliente

```typescript
// components/lesson-player.tsx
'use client';
import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState, useRef } from 'react';

export function LessonPlayer({ lessonId, lessonTitle, userId }: {
  lessonId: string;
  lessonTitle: string;
  userId: string;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchToken() {
    try {
      const res = await fetch(`/api/video-token?lesson_id=${lessonId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setToken(data.token);
      setPlaybackId(data.playback_id);
    } catch (e) {
      setError('No se pudo cargar el video. Recarga la página.');
    }
  }

  useEffect(() => {
    fetchToken();

    // Re-fetch cada 55 min para que nunca expire mientras ve
    const interval = setInterval(fetchToken, 55 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lessonId]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!token || !playbackId) return <div className="aspect-video bg-gray-100 animate-pulse" />;

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={{ playback: token }}
      metadata={{
        video_id: lessonId,
        video_title: lessonTitle,
        viewer_user_id: userId,
      }}
      streamType="on-demand"
      accentColor="#C0633D"
      style={{ aspectRatio: '16/9', width: '100%' }}
      onTimeUpdate={(e) => {
        // Reportar progreso a tu backend cada N segundos
        // Para guardar lesson_progress
      }}
    />
  );
}
```

## Trailer Público (preview gratis del curso)

Para el trailer público del curso (que cualquiera ve sin login), usar un asset con `playback_policy: 'public'`. Sin signed URL.

```typescript
// Crear asset público para trailer
await mux.video.assets.create({
  input: [{ url: trailerUrl }],
  playback_policy: ['public'], // ← público
  encoding_tier: 'baseline', // calidad menor, suficiente para trailer
});

// En el frontend, usar sin token:
<MuxPlayer
  playbackId={course.trailer_mux_playback_id}
  streamType="on-demand"
/>
```

## Free Preview de Primera Lección

Para que cualquiera vea la lección 1 sin pagar (es preview):

1. En DB: `lessons.is_free_preview = true`
2. El endpoint `/api/video-token` permite firmar el JWT sin requerir enrollment si `is_free_preview = true`
3. Pero igual REQUIERE login (para tracking y rate limit)

Si quieres que NI siquiera requiera login, mejor crear ese asset con `playback_policy: 'public'`.

## Tracking de Progreso

```typescript
// En el player, escuchar timeupdate
const lastReported = useRef(0);

<MuxPlayer
  onTimeUpdate={(e) => {
    const currentTime = e.currentTarget.currentTime;
    // Reportar cada 30 segundos
    if (currentTime - lastReported.current > 30) {
      fetch('/api/lesson-progress', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonId, watched_seconds: currentTime }),
      });
      lastReported.current = currentTime;
    }
  }}
  onEnded={() => {
    fetch('/api/lesson-progress', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, completed: true }),
    });
  }}
/>
```

## Costos (referencia 2026, verificar)

| Concepto | Costo aprox |
|----------|-------------|
| Encoding (smart tier) | $0.04 / min de video subido |
| Storage | $0.003 / min / mes |
| Streaming | $0.0007 / min visto |

Ejemplo: un curso de 5 horas, 100 alumnos lo ven entero:
- Encoding: 300 min × $0.04 = $12 una sola vez
- Storage: 300 min × $0.003 × 12 meses = $10.80 al año
- Streaming: 300 min × 100 alumnos × $0.0007 = $21
- **Total año 1: ~$43 USD** por ese curso con 100 alumnos

Muy razonable comparado con Vimeo OTT ($1000+/mes) o construir infraestructura propia.

## Protección Extra: Watermark Dinámico

Mux puede agregar watermark con email del usuario en runtime (visible en el video). Disuade screen recording. Configurar al firmar JWT:

```typescript
const token = jwt.sign(
  {
    sub: playbackId,
    aud: 'v',
    exp: Math.floor(Date.now() / 1000) + 3600,
    customer_id: user.id,
    // Mux puede usar esto para watermarking
  },
  privateKey,
  { algorithm: 'RS256', keyid: process.env.MUX_SIGNING_KEY_ID! }
);
```

Configuración del watermark en dashboard de Mux.

## DRM (Widevine / FairPlay) — Avanzado

Solo si la piratería es problema real. DRM impide screen recording en muchos dispositivos.

Costos adicionales:
- Mux DRM add-on: ~$0.04 / hora de viewing
- Complejidad de implementación: alta (necesitas certificados, configuración por OS)

Recomendación: NO implementar al inicio. Lanzar con signed URLs + watermark. Si detectas piratería real, agregar DRM en fase 2.

## Debugging Común

### "Video no carga, error 403 en HLS"
Causa: JWT inválido o expirado. Verificar que se está firmando con la private key correcta y `kid` del keyid.

### "Video carga pero buffer infinito"
Causa: el asset todavía no terminó de procesarse. Estado `ready` se confirma vía webhook. Hasta que llegue, el playback_id no funciona.

### "El usuario ve la lección sin haber pagado"
Causa: el endpoint `/api/video-token` no verifica enrollment. Auditar el código.

### "Token expira mid-video y rompe el reproductor"
Causa: no se está re-fetcheando. Implementar re-fetch cada 55 min.

## Anti-patrones

- ❌ Crear assets con `'public'` y "esconder el playback_id"
- ❌ Firmar JWT en el cliente
- ❌ JWT con expiración de 24h o más
- ❌ No verificar enrollment antes de firmar
- ❌ Servir video directo desde Supabase Storage (sin protección, sin adaptive bitrate)
- ❌ Hardcodear la private key en código
- ❌ Permitir `mp4_support: 'standard'` en cursos pagados (permite descargar)
- ❌ No rate-limitar `/api/video-token`
- ❌ Logear el token JWT (contiene el playback_id)

## Checklist Pre-Producción

- [ ] Todos los assets de curso creados con `playback_policy: 'signed'`
- [ ] Trailer público con `playback_policy: 'public'` (si aplica)
- [ ] Endpoint `/api/video-token` verifica enrollment / is_free_preview
- [ ] JWT con expiración 1h máximo
- [ ] Frontend re-fetcha token cada 55 min
- [ ] Rate limit en `/api/video-token` (60/h por usuario)
- [ ] Webhook de Mux configurado y firma verificada
- [ ] Private key NUNCA en código (solo env var)
- [ ] Direct Upload funcionando (no pasa por server)
- [ ] `mp4_support: 'none'` en assets pagados
- [ ] Tracking de progreso (`lesson_progress`) funcionando
