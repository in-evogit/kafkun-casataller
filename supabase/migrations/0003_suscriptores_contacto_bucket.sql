-- ============================================================
-- Kafkun Casa Taller — 0003
--
-- Tres huecos que el codigo ya daba por existentes:
--
--   1. El bucket de fotos del encargo. /api/encargo sube ahi desde el
--      28-ago y el bucket NUNCA se creo: cada encargo con fotos fallaba
--      entero, porque si la subida falla el endpoint no guarda nada.
--   2. Los suscriptores del correo. Estaban cayendo en audit_log, que es
--      el registro de eventos del sistema: se podia escribir, pero no
--      listar quien esta suscrito ni dar de baja a nadie.
--   3. Los mensajes de contacto. Mismo caso, y ademas no habia donde
--      anotar "a esta persona ya le respondi".
--
-- Aplicar completo en el SQL Editor, despues de 0001 y 0002.
-- ============================================================

-- ============================================
-- 1. BUCKET DE REFERENCIAS DEL ENCARGO
-- ============================================
-- PRIVADO a proposito. Son fotos que alguien manda para explicar el chaleco
-- que quiere: a veces una prenda suya, a veces una foto de su casa. Publicas
-- quedarian indexables por Google con solo adivinar la URL.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'referencias-encargo',
  'referencias-encargo',
  FALSE,
  8388608,  -- 8 MB, el mismo MAX_PESO_MB que valida el endpoint
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Quien sube es /api/encargo con service_role, que se salta RLS y no necesita
-- politica. Esta es solo para que el panel pueda MIRAR las fotos del encargo
-- sin pasar por el servidor.
CREATE POLICY "admins leen referencias de encargo" ON storage.objects
  FOR SELECT USING (bucket_id = 'referencias-encargo' AND is_admin());

-- ============================================
-- 2. SUSCRIPTORES DEL CORREO
-- ============================================
CREATE TABLE suscriptores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Normalizado a minusculas por el CHECK: sin esto "Ana@gmail.com" y
  -- "ana@gmail.com" entran como dos personas y reciben todo dos veces.
  email TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  nombre TEXT,

  -- De donde llego. Sirve para saber que parte del sitio trae gente:
  -- el pie de la portada no vale lo mismo que el final de una clase.
  origen TEXT NOT NULL DEFAULT 'portada',

  -- 'activo' | 'baja'. No se borra la fila al darse de baja: si se borrara,
  -- el proximo formulario que llene la volveria a suscribir como si nada.
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'baja')),

  -- El link de "no quiero mas correos". Va en cada envio. Sin esto los
  -- correos terminan marcados como spam y se cae la reputacion del dominio.
  token_baja UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX suscriptores_estado_idx ON suscriptores (estado, created_at DESC);

CREATE TRIGGER update_suscriptores_updated_at BEFORE UPDATE ON suscriptores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. MENSAJES DE CONTACTO
-- ============================================
CREATE TABLE mensajes_contacto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,

  estado TEXT NOT NULL DEFAULT 'nuevo'
    CHECK (estado IN ('nuevo', 'respondido', 'cerrado')),
  notas_internas TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX mensajes_contacto_estado_idx ON mensajes_contacto (estado, created_at DESC);

CREATE TRIGGER update_mensajes_contacto_updated_at BEFORE UPDATE ON mensajes_contacto
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEGURIDAD
-- ============================================
-- Las dos tablas son lista de correos y mensajes privados de gente real.
-- Igual que encargos: ninguna politica para anon ni authenticated. Se escribe
-- por /api/newsletter y /api/contacto con service_role, y solo el panel lee.
--
-- Sin RLS activado, la llave publica del navegador podria descargar la lista
-- de correos entera.
ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins gestionan suscriptores" ON suscriptores
  FOR ALL USING (is_admin());

CREATE POLICY "admins gestionan mensajes de contacto" ON mensajes_contacto
  FOR ALL USING (is_admin());
