-- ============================================================
-- MANA SANTHA — COMPLETE DATABASE SETUP (RUN ALL AT ONCE)
-- Project: jbdfcqycvmekkuaedtug.supabase.co
-- ============================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select Project: jbdfcqycvmekkuaedtug
-- 3. Click "SQL Editor" on the left menu
-- 4. Click "New query"
-- 5. Copy ALL text in this file, paste into editor, and click "RUN"
-- ============================================================

-- 1. ENUMS & HELPERS
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('pending','confirmed','packed','out_for_delivery','delivered','cancelled','refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('cod','online');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 2. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  brand TEXT,
  description TEXT,
  image_url TEXT,
  mrp NUMERIC(10,2) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  weight TEXT,
  stock INT NOT NULL DEFAULT 0,
  max_qty INT NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'active',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  option_name TEXT,
  name TEXT NOT NULL,
  quantity_value NUMERIC,
  unit TEXT,
  sku TEXT,
  barcode TEXT,
  mrp NUMERIC(10,2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  max_qty INT NOT NULL DEFAULT 20,
  sort_order INT NOT NULL DEFAULT 0,
  image_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- 5. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE DEFAULT ('MS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_method public.payment_method NOT NULL DEFAULT 'cod',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  address_snapshot JSONB NOT NULL,
  delivery_slot TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
CREATE POLICY IF NOT EXISTS "Authenticated users manage own orders"
  ON public.orders FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY IF NOT EXISTS "Admins manage all orders"
  ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID,
  name TEXT NOT NULL,
  variant_name TEXT,
  image_url TEXT,
  unit TEXT,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
CREATE POLICY IF NOT EXISTS "Authenticated users view own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY IF NOT EXISTS "Authenticated users insert own order items"
  ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = new.order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY IF NOT EXISTS "Admins manage all order items"
  ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  variant_name TEXT,
  variant_unit TEXT,
  variant_price NUMERIC(10,2),
  variant_image_url TEXT,
  variant_max_qty INT,
  UNIQUE(user_id, product_id, variant_id)
);
GRANT SELECT ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view their own cart items"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own cart items"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own cart items"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_no_variant_idx ON public.cart_items(user_id, product_id) WHERE variant_id IS NULL;
CREATE TRIGGER IF NOT EXISTS cart_items_updated BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. COUPONS, BANNERS, DELIVERY PARTNERS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL,
  max_discount NUMERIC(10,2),
  min_cart_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  per_user_limit INT NOT NULL DEFAULT 1,
  active_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_till TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_till TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  vehicle_number TEXT,
  vehicle_type TEXT DEFAULT 'bike',
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  total_deliveries INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.delivery_partners TO authenticated;
GRANT ALL ON public.delivery_partners TO service_role;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
DROP POLICY IF EXISTS "Anyone views categories" ON public.categories;
CREATE POLICY "Anyone views categories" ON public.categories FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Anyone views products" ON public.products;
CREATE POLICY "Anyone views products" ON public.products FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Users view own profiles" ON public.profiles;
CREATE POLICY "Users view own profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 8. SEED SUPER ADMIN USER
DO $$
DECLARE
  admin_id UUID;
  existing_id UUID;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'admin@manasantha.com';

  IF existing_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (existing_id, 'admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.profiles (id, full_name, phone) VALUES (existing_id, 'Super Admin', '') ON CONFLICT (id) DO UPDATE SET full_name = 'Super Admin';
    RETURN;
  END IF;

  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, role, aud
  ) VALUES (
    gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'admin@manasantha.com', crypt('Admin@12345', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"full_name": "Super Admin"}', FALSE, NOW(), NOW(), 'authenticated', 'authenticated'
  ) RETURNING id INTO admin_id;

  INSERT INTO public.profiles (id, full_name, phone) VALUES (admin_id, 'Super Admin', '') ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin') ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'customer') ON CONFLICT DO NOTHING;
END;
$$;
