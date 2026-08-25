-- ============================================================
-- Kafkun Casa Taller — esquema inicial
-- Alineado con el código de la app (no con MASTER_INSTRUCTIONS.md,
-- que quedó desfasado: ver notas [DIF-n] más abajo).
-- Aplicar completo en el SQL Editor de Supabase, de una sola vez.
-- ============================================================

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

-- [DIF-1] El código lee y escribe profiles para todo usuario logueado, y
-- orders.user_id apunta a profiles. Sin esta fila el checkout falla por FK.
-- El doc no tenía este trigger: hay que crearlo.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- COURSES
-- ============================================
-- [DIF-2] El código usa published (BOOLEAN) y lessons_count, no status TEXT.
--   app/admin/page.tsx:29        -> .eq("published", true)
--   app/admin/cursos/page.tsx:23 -> select("... published, lessons_count")
--   app/admin/cursos/actions.ts  -> insert({ ..., published: boolean })
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  trailer_mux_playback_id TEXT,
  price_clp INTEGER NOT NULL CHECK (price_clp >= 0),
  compare_at_price_clp INTEGER,
  level TEXT CHECK (level IN ('principiante', 'intermedio', 'avanzado')),
  duration_minutes INTEGER,
  lessons_count INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX courses_slug_idx ON courses(slug);
CREATE INDEX courses_published_idx ON courses(published);

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
-- [DIF-3] El código usa active (BOOLEAN) e image_url (TEXT singular),
-- no status TEXT ni images TEXT[].
--   app/admin/productos/page.tsx:19    -> select("... stock, category, active")
--   app/admin/productos/actions.ts:8   -> schema con image_url y active
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_clp INTEGER NOT NULL CHECK (price_clp >= 0),
  compare_at_price_clp INTEGER,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight_grams INTEGER,
  image_url TEXT,
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_active_idx ON products(active);

-- ============================================
-- ORDERS
-- ============================================
-- [DIF-4] user_id apunta a profiles(id), NO a auth.users(id).
-- PostgREST necesita la FK directa para resolver los embeds del admin:
--   app/admin/ordenes/page.tsx:31 -> select("... profiles(full_name, id)")
--   app/admin/page.tsx:34         -> select("... profiles(full_name)")
-- Con la FK a auth.users esas consultas fallan.
-- ON DELETE SET NULL: si se borra el usuario, la orden se conserva.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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
CREATE INDEX order_items_order_idx ON order_items(order_id);

-- ============================================
-- ENROLLMENTS & PROGRESS
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX enrollments_user_idx ON enrollments(user_id);

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all', 'course', 'product')),
  target_id UUID,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [DIF-5] reviews.user_id y course_id a profiles/courses para los embeds:
--   app/admin/reviews/page.tsx:21 -> select("... profiles(full_name), courses(title)")
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
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
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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
-- TRIGGERS updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log       ENABLE ROW LEVEL SECURITY;

-- Nota: la service_role key (usada por createAdminClient) bypassa RLS.
-- Todo insert de orders, order_items, enrollments y audit_log va por ahí.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- [DIF-6] CRÍTICO. El guard del admin consulta user_roles con la sesión del
-- usuario, no con service_role:
--   app/admin/layout.tsx:19, app/admin/cursos/actions.ts:25,
--   app/admin/productos/actions.ts:23
-- El doc activaba RLS en user_roles sin ninguna policy de SELECT, así que la
-- consulta devolvía vacío y el panel quedaba inaccesible incluso para Katy.
CREATE POLICY "users read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON user_roles
  FOR SELECT USING (is_admin());

-- profiles
CREATE POLICY "users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admins read all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- courses
CREATE POLICY "anyone reads published courses" ON courses
  FOR SELECT USING (published = TRUE);
CREATE POLICY "admins manage courses" ON courses
  FOR ALL USING (is_admin());

-- modules
CREATE POLICY "anyone reads modules of published courses" ON modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = modules.course_id AND c.published = TRUE)
  );
CREATE POLICY "admins manage modules" ON modules FOR ALL USING (is_admin());

-- lessons
-- El playback_id NO se expone en el SELECT general: el backend decide si lo
-- devuelve según is_free_preview o enrollment (app/api/video-token/route.ts).
CREATE POLICY "anyone reads lesson metadata" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id AND c.published = TRUE
    )
  );
CREATE POLICY "admins manage lessons" ON lessons FOR ALL USING (is_admin());

-- products
CREATE POLICY "anyone reads active products" ON products
  FOR SELECT USING (active = TRUE);
CREATE POLICY "admins manage products" ON products FOR ALL USING (is_admin());

-- orders
CREATE POLICY "users read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all orders" ON orders
  FOR SELECT USING (is_admin());

-- order_items
CREATE POLICY "users read items of own orders" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "admins read all order items" ON order_items
  FOR SELECT USING (is_admin());

-- enrollments
CREATE POLICY "users read own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins read all enrollments" ON enrollments
  FOR SELECT USING (is_admin());

-- lesson_progress
CREATE POLICY "users manage own progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- coupons
-- [DIF-7] El doc permitía a cualquiera leer los cupones activos, lo que deja
-- enumerar todos los códigos de descuento. El código siempre los valida con
-- service_role (app/api/cupon/route.ts:29, app/api/checkout/route.ts:49),
-- así que no hace falta lectura pública: se cierra.
CREATE POLICY "admins manage coupons" ON coupons FOR ALL USING (is_admin());

-- reviews
CREATE POLICY "anyone reads published reviews" ON reviews
  FOR SELECT USING (published = TRUE);
CREATE POLICY "users manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins manage all reviews" ON reviews FOR ALL USING (is_admin());

-- audit_log
CREATE POLICY "admins read audit log" ON audit_log
  FOR SELECT USING (is_admin());
