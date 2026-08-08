# Database Setup Guide

## Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy and paste the SQL from below
5. Click "Run"

## SQL Migrations

```sql
-- ============ OTP VERIFICATION TABLE ============
CREATE TABLE IF NOT EXISTS public.otp_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '10 minutes',
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_otp_phone ON public.otp_requests(phone);
CREATE INDEX idx_otp_expires_at ON public.otp_requests(expires_at);

-- ============ INSERT DUMMY CATEGORIES ============
INSERT INTO public.categories (name, slug, icon, sort_order, is_active) VALUES
  ('Fruits & Vegetables', 'fruits-vegetables', '🥬', 1, true),
  ('Dairy & Eggs', 'dairy-eggs', '🥛', 2, true),
  ('Rice & Atta', 'rice-atta-dals', '🌾', 3, true),
  ('Snacks', 'snacks', '🍿', 4, true),
  ('Beverages', 'beverages', '🧃', 5, true),
  ('Oil & Condiments', 'oil-condiments', '🫙', 6, true),
  ('Spices', 'spices', '🌶️', 7, true),
  ('Ready-to-Cook', 'ready-to-cook', '⏱️', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- ============ INSERT DUMMY PRODUCTS ============
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Tomato',
  'tomato-1kg',
  'Fresh',
  'Fresh farm tomatoes, packed with nutrition',
  80,
  60,
  'kg',
  '1 kg',
  100,
  true,
  true
FROM public.categories c WHERE c.slug = 'fruits-vegetables'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Spinach',
  'spinach-500g',
  'Fresh',
  'Leafy green spinach, excellent source of iron',
  60,
  40,
  'piece',
  '500g',
  80,
  true,
  true
FROM public.categories c WHERE c.slug = 'fruits-vegetables'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Onion',
  'onion-1kg',
  'Fresh',
  'Golden onions, perfect for cooking',
  50,
  35,
  'kg',
  '1 kg',
  150,
  false,
  true
FROM public.categories c WHERE c.slug = 'fruits-vegetables'
ON CONFLICT (slug) DO NOTHING;

-- Dairy & Eggs
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Whole Milk',
  'whole-milk-1l',
  'Local Dairy',
  'Fresh whole milk, delivered daily',
  65,
  55,
  'litre',
  '1 L',
  120,
  true,
  true
FROM public.categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Eggs Brown',
  'eggs-brown-dozen',
  'Local Farm',
  'Brown eggs from free-range hens',
  120,
  100,
  'piece',
  '12 eggs',
  90,
  true,
  true
FROM public.categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Paneer',
  'paneer-500g',
  'Fresh',
  'Homemade fresh paneer',
  220,
  190,
  'piece',
  '500g',
  60,
  false,
  true
FROM public.categories c WHERE c.slug = 'dairy-eggs'
ON CONFLICT (slug) DO NOTHING;

-- Rice & Atta
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Basmati Rice',
  'basmati-rice-5kg',
  'Tata',
  'Premium basmati rice, aromatic and long-grain',
  450,
  400,
  'kg',
  '5 kg',
  80,
  true,
  true
FROM public.categories c WHERE c.slug = 'rice-atta-dals'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Whole Wheat Atta',
  'wheat-atta-5kg',
  'Aashirvaad',
  '100% whole wheat flour for rotis',
  250,
  220,
  'kg',
  '5 kg',
  100,
  true,
  true
FROM public.categories c WHERE c.slug = 'rice-atta-dals'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Arhar Dal',
  'arhar-dal-1kg',
  'Local',
  'High-quality arhar dal',
  150,
  130,
  'kg',
  '1 kg',
  70,
  false,
  true
FROM public.categories c WHERE c.slug = 'rice-atta-dals'
ON CONFLICT (slug) DO NOTHING;

-- Snacks
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Chips Lay''s',
  'lays-chips-30g',
  'Lay''s',
  'Crispy potato chips, salted',
  20,
  15,
  'piece',
  '30g',
  200,
  true,
  true
FROM public.categories c WHERE c.slug = 'snacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Biscuits',
  'hide-seek-biscuits-100g',
  'Hide & Seek',
  'Delicious chocolate chips biscuits',
  35,
  28,
  'piece',
  '100g',
  150,
  false,
  true
FROM public.categories c WHERE c.slug = 'snacks'
ON CONFLICT (slug) DO NOTHING;

-- Beverages
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Tea',
  'tea-leaves-250g',
  'Tata Tea',
  'Premium loose leaf tea',
  220,
  190,
  'piece',
  '250g',
  100,
  false,
  true
FROM public.categories c WHERE c.slug = 'beverages'
ON CONFLICT (slug) DO NOTHING;

-- Oil & Condiments
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Refined Oil',
  'refined-oil-1l',
  'Fortune',
  'Pure refined soybean oil',
  230,
  200,
  'litre',
  '1 L',
  120,
  true,
  true
FROM public.categories c WHERE c.slug = 'oil-condiments'
ON CONFLICT (slug) DO NOTHING;

-- Spices
INSERT INTO public.products (category_id, name, slug, brand, description, mrp, price, unit, weight, stock, is_featured, is_active)
SELECT 
  c.id,
  'Turmeric Powder',
  'turmeric-powder-100g',
  'Everest',
  'Pure turmeric powder',
  80,
  65,
  'piece',
  '100g',
  150,
  false,
  true
FROM public.categories c WHERE c.slug = 'spices'
ON CONFLICT (slug) DO NOTHING;
```

## Steps:

1. Log in to your Supabase Dashboard: https://app.supabase.com/
2. Select your project: `jbdfcqycvmekkuaedtug`
3. Go to SQL Editor on the left sidebar
4. Create a new query and paste the SQL above
5. Click "Run"

This will:
- Create the `otp_requests` table for OTP verification
- Insert dummy categories (Fruits & Vegetables, Dairy & Eggs, Rice & Atta, etc.)
- Insert dummy products with pricing and inventory

After running the migrations, refresh your browser and try the phone number authentication!
