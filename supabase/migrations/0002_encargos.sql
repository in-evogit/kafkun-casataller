-- ============================================================
-- Encargos a pedido — solicitudes desde /a-pedido/empezar
-- ============================================================

CREATE TABLE encargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contacto
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,

  -- La pieza
  tipo TEXT NOT NULL CHECK (tipo IN ('chaleco', 'bufanda', 'otra')),
  descripcion TEXT NOT NULL,
  plazo TEXT,

  -- Rutas en el bucket de referencias. Nunca la imagen en si:
  -- una foto en base64 dentro de la fila hincha la tabla y rompe los backups.
  referencias JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- La cita. NULL = la persona prefiere coordinar por mensaje.
  hora_iso TIMESTAMPTZ,
  prefiere_mensaje BOOLEAN NOT NULL DEFAULT FALSE,

  estado TEXT NOT NULL DEFAULT 'nuevo'
    CHECK (estado IN ('nuevo', 'contactado', 'agendado', 'cerrado')),
  notas_internas TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EL indice que impide la doble reserva.
--
-- Filtrar las horas ya tomadas al dibujar el formulario NO basta: dos personas
-- pueden pedir la misma hora en el mismo segundo, las dos ven la lista vieja y
-- las dos escriben. Lo unico atomico es la base. Con esto, la segunda insercion
-- se rechaza y la persona recibe "esa hora se acaba de tomar".
--
-- Parcial (WHERE hora_iso IS NOT NULL) para que si convivan muchos encargos
-- sin hora: en un indice unico normal, varios NULL son permitidos, pero se deja
-- explicito para que se lea la intencion.
CREATE UNIQUE INDEX encargos_hora_unica
  ON encargos (hora_iso)
  WHERE hora_iso IS NOT NULL;

CREATE INDEX encargos_estado_idx ON encargos (estado, created_at DESC);
CREATE INDEX encargos_created_idx ON encargos (created_at DESC);

CREATE TRIGGER update_encargos_updated_at BEFORE UPDATE ON encargos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Seguridad ──────────────────────────────────────────────────────────────
ALTER TABLE encargos ENABLE ROW LEVEL SECURITY;

-- Ninguna politica para anon ni para authenticated: nadie de fuera lee ni
-- escribe encargos directamente. Las solicitudes entran por /api/encargo, que
-- valida y escribe con service_role (que se salta RLS). Un encargo trae nombre,
-- correo, telefono y lo que la persona quiere regalar: no se expone jamas.
CREATE POLICY "admins gestionan encargos" ON encargos
  FOR ALL USING (is_admin());
