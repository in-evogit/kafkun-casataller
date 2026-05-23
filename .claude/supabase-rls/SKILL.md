---
name: supabase-rls
description: >
  Skill experto en Row Level Security (RLS) de Supabase / PostgreSQL. USAR SIEMPRE que el usuario mencione: Supabase, RLS, Row Level Security, políticas de Postgres, policy, GRANT, REVOKE, auth.uid(), service_role, anon key, multi-tenant, multi-usuario, control de acceso, autorización a nivel de fila, "que solo el dueño pueda ver", "que los admins puedan", auth.jwt(), security definer, security invoker, Postgres permissions, datos privados por usuario, ALTER TABLE ENABLE ROW LEVEL SECURITY, o cuando esté creando/modificando cualquier tabla de Supabase. También activar al hacer migraciones, crear nuevos modelos de datos, o debuggear problemas de "no veo mis datos" / "veo datos de otros".
---

# Supabase RLS Master

Este skill convierte a Claude en experto en Row Level Security de Supabase/PostgreSQL. RLS es la **única defensa real** contra accesos no autorizados a datos en Supabase. Sin RLS, cualquier hacker con la anon key puede leer/escribir todo.

## Filosofía Central

**RLS es default-deny.** Cuando activas RLS en una tabla, NADIE puede leerla/escribirla hasta que crees políticas explícitas. Esto es bueno: te obliga a pensar caso por caso.

**La anon key NO es secreta.** Está expuesta al cliente. Tu única defensa es RLS bien configurado.

**El service_role key BYPASEA RLS.** Por eso nunca debe llegar al cliente. Solo se usa server-side para operaciones administrativas (insertar enrollments tras pago verificado, etc.).

## Las 7 Reglas Absolutas

1. **TODA tabla con datos de usuario tiene RLS activado.** Sin excepciones.

2. **Activar RLS antes de poblar la tabla**, no después. Si pones RLS después y olvidas políticas, datos quedan inaccesibles silenciosamente.

3. **NUNCA usar service_role key en el cliente.** Solo en API routes / server actions / edge functions.

4. **NUNCA insertar registros sensibles desde el cliente.** Orders, enrollments, payments → siempre server-side con service_role tras verificación.

5. **Probar las políticas manualmente** con `SET request.jwt.claims` antes de declarar la tabla "lista".

6. **Crear policies para INSERT/UPDATE/DELETE explícitas**, no solo SELECT. Si faltan, esas operaciones quedan bloqueadas y features rompen silenciosamente.

7. **Performance**: políticas con `EXISTS()` subqueries pueden ser lentas. Usar índices apropiados.

## Workflow al Crear Nueva Tabla

```
1. Diseñar el schema (columnas, FKs, constraints)
2. Crear la tabla
3. INMEDIATAMENTE: ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
4. Decidir el modelo de acceso:
   - ¿Es pública (cualquiera lee)? → policy SELECT USING (true)
   - ¿Es del usuario propietario? → policy USING (auth.uid() = user_id)
   - ¿Es admin-only? → policy USING (is_admin())
   - ¿Derivada de tabla padre? → policy USING (EXISTS (SELECT 1 FROM padre WHERE ...))
5. Crear policies para SELECT, INSERT, UPDATE, DELETE según corresponda
6. Probar con jwt simulado
7. Documentar el modelo de acceso en comentarios SQL
```

## Función Helper `is_admin()`

Crear UNA VEZ al inicio del proyecto:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
```

- `SECURITY DEFINER`: ejecuta con permisos del owner, evita recursión infinita de RLS al consultar `user_roles`.
- `STABLE`: indica que la función no modifica datos, permite caching dentro de una query.

## Patrones de Políticas (Cookbook)

### Patrón 1: Tabla 100% pública (read-only)

Ej: `categories`, `regions` (datos de catálogo).

```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads" ON categories
  FOR SELECT USING (true);

CREATE POLICY "admins manage" ON categories
  FOR ALL USING (is_admin());
```

### Patrón 2: Pública filtrada por estado

Ej: `courses`, `products` (solo "published" son visibles).

```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads published" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "admins manage all" ON courses
  FOR ALL USING (is_admin());
```

### Patrón 3: Datos del propio usuario

Ej: `orders`, `enrollments`, `profiles`.

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users insert own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own" ON orders
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins read all" ON orders
  FOR SELECT USING (is_admin());
```

**Nota crítica `USING` vs `WITH CHECK`:**
- `USING`: qué rows EXISTENTES puede ver/modificar/borrar
- `WITH CHECK`: qué rows NUEVAS puede crear/dejar tras UPDATE
- INSERT solo usa `WITH CHECK` (no hay rows existentes)
- UPDATE usa ambos (rows que puede modificar Y cómo deben quedar)

### Patrón 4: Datos derivados (vía relación padre)

Ej: `order_items` (depende de `orders.user_id`), `lesson_progress` (depende del enrollment).

```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read items of own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "admins read all" ON order_items
  FOR ALL USING (is_admin());
```

**Performance tip:** asegurar índice en `order_items.order_id` y `orders.user_id`.

### Patrón 5: Acceso por enrollment / suscripción

Ej: `lessons` (solo accesible si tienes enrollment al curso, o si es free preview).

```sql
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Metadata de lección visible si curso publicado
CREATE POLICY "anyone reads lesson metadata of published courses" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
        AND c.status = 'published'
    )
  );

CREATE POLICY "admins manage" ON lessons FOR ALL USING (is_admin());
```

**IMPORTANTE:** Esta política permite leer metadata de la lección (título, duración). El campo sensible `mux_playback_id` NO debe exponerse por SELECT general. El backend debe filtrarlo: solo devolverlo si `is_free_preview = true` o existe enrollment. RLS no puede ocultar columnas individuales, solo rows enteras.

### Patrón 6: Multi-tenant (cada tenant ve solo su data)

Ej: SaaS donde cada empresa es un tenant.

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own tenant projects" ON projects
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()
    )
  );
```

### Patrón 7: Time-based access

Ej: contenido que expira.

```sql
CREATE POLICY "users access non-expired content" ON premium_content
  FOR SELECT USING (
    expires_at > NOW()
    AND EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid() AND active = TRUE)
  );
```

## Testing de Políticas

### Método 1: SQL Editor de Supabase con JWT simulado

```sql
-- Simular usuario específico
SET LOCAL request.jwt.claims = '{"sub": "uuid-del-usuario", "role": "authenticated"}';

-- Probar query
SELECT * FROM orders;
-- Debe retornar SOLO los orders de ese user_id

-- Cambiar a admin
SET LOCAL request.jwt.claims = '{"sub": "uuid-admin", "role": "authenticated"}';
SELECT * FROM orders;
-- Debe retornar todos los orders

-- Reset
RESET request.jwt.claims;
```

### Método 2: Test E2E con cuentas reales

Crear 2 usuarios de prueba (user_a, user_b), insertar data para cada uno, y desde el cliente con auth de user_a intentar:
- ✅ Leer datos de user_a
- ❌ Leer datos de user_b (debe fallar / retornar vacío)
- ❌ Modificar datos de user_b (debe fallar)

## Service Role Key (Uso Server-Side)

Cuando necesitas hacer operaciones que RLS bloquearía (insertar enrollment tras pago verificado, marcar webhook como procesado, etc.):

```typescript
// lib/supabase/admin.ts (SOLO server-side, NUNCA importar desde client)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← bypassa RLS
  { auth: { persistSession: false } }
);

// En API route:
await supabaseAdmin.from('enrollments').insert({ user_id, course_id, order_id });
```

**Verificación crítica antes de usar service role:**
1. ¿El webhook está firmado y verificado?
2. ¿La acción es legítima (no manipulable por el usuario)?
3. ¿Estoy ejecutando en server, no en cliente?

## Debugging "No veo mis datos" / "Veo datos de otros"

### Síntoma: "Mi query retorna vacío pero los datos están en la DB"

Causa probable: RLS bloquea sin política que permita SELECT.

Diagnóstico:
```sql
-- Ver si la tabla tiene RLS
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'mi_tabla';

-- Ver políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'mi_tabla';
```

Solución: agregar policy SELECT apropiada.

### Síntoma: "Usuario A ve datos de Usuario B"

Causa probable: policy demasiado laxa o no usa `auth.uid()`.

Diagnóstico: revisar las policies de SELECT. ¿Filtran por `user_id = auth.uid()`?

### Síntoma: "INSERT/UPDATE me da error de policy"

Causa: falta policy WITH CHECK para INSERT/UPDATE.

Solución: agregar policy específica:
```sql
CREATE POLICY "users insert own" ON tabla
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Síntoma: "Performance lenta en queries con RLS"

Causa: subqueries en policies sin índices apropiados.

Solución:
1. Identificar las columnas usadas en policies (ej: `user_id`, `tenant_id`)
2. Crear índices: `CREATE INDEX idx_tabla_user ON tabla(user_id);`
3. Si la policy hace JOIN: índice en ambos lados

## Migrations y RLS

Cuando agregues una nueva tabla en una migration:

```sql
-- migrations/0042_create_invoices.sql

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SIEMPRE en la misma migration:
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admins read all invoices" ON invoices
  FOR SELECT USING (is_admin());

-- Index para performance
CREATE INDEX idx_invoices_user ON invoices(user_id);
```

## Anti-patrones

- ❌ Crear tabla, poblarla, después activar RLS → datos quedan invisibles, hay que re-validar
- ❌ Confiar solo en filtros del cliente (`.eq('user_id', currentUser.id)`) → atacante manipula y filtra otro user_id
- ❌ Usar service_role en cliente "para que funcione más rápido"
- ❌ Policies con `USING (true)` para tablas privadas
- ❌ Olvidar policies de INSERT/UPDATE → operaciones fallan silenciosamente
- ❌ Subqueries pesadas en policies sin índices
- ❌ `auth.uid()` en lugar de `( SELECT auth.uid() )` en policies complejas (Postgres re-evalúa por row, lento)

## Optimización Avanzada

Para tablas grandes con RLS, envolver `auth.uid()` en SELECT para que se evalúe UNA vez:

```sql
-- Lento (re-evalúa por row):
CREATE POLICY "fast" ON huge_table
  FOR SELECT USING (user_id = auth.uid());

-- Más rápido en tablas grandes:
CREATE POLICY "fast" ON huge_table
  FOR SELECT USING (user_id = (SELECT auth.uid()));
```

Combinado con índice en `user_id`, hace diferencias enormes en producción.

## Checklist al Diseñar Schema

Para cada tabla nueva, responder:
- [ ] ¿Quién PUEDE leer? (público / dueño / admin / otros)
- [ ] ¿Quién PUEDE insertar? (cliente / solo server / admin)
- [ ] ¿Quién PUEDE actualizar?
- [ ] ¿Quién PUEDE borrar?
- [ ] ¿Hay columnas sensibles que ni el dueño debe ver? (ej: `internal_notes`) → filtrar en queries del backend
- [ ] ¿Las queries que harán los componentes usan índices apropiados con esta RLS?
- [ ] ¿Hay tests que verifican que un usuario NO ve datos de otro?
