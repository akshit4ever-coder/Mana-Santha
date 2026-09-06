-- ============================================================
-- MANA SANTHA — ADMIN ACCOUNT SEED
-- ============================================================
-- Run this in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
--
-- This creates:
--   1. A super admin user in auth.users
--   2. A profile record
--   3. An admin role in user_roles
--
-- Admin Credentials:
--   Email:    admin@local.test
--   Password: Admin@12345
-- ============================================================

DO $$
DECLARE
  admin_id UUID;
  existing_id UUID;
BEGIN
  -- Check if admin already exists
  SELECT id INTO existing_id
  FROM auth.users
  WHERE email = 'admin@local.test';

  IF existing_id IS NOT NULL THEN
    RAISE NOTICE 'Admin user already exists with id: %', existing_id;
    
    -- Ensure they have the admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (existing_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Ensure they have a profile
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (existing_id, 'Super Admin', '')
    ON CONFLICT (id) DO UPDATE SET full_name = 'Super Admin';
    
    RETURN;
  END IF;

  -- Create the admin user
  -- NOTE: Password hash below is bcrypt of 'Admin@12345'
  -- Supabase uses GoTrue — we insert directly into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token,
    email_change_token_current,
    email_change_token_new
  ) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@local.test',
    crypt('Admin@12345', gen_salt('bf')),
    NOW(),                           -- email already confirmed
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Super Admin"}',
    FALSE,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    '',
    '',
    ''
  )
  RETURNING id INTO admin_id;

  RAISE NOTICE 'Created admin user with id: %', admin_id;

  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (admin_id, 'Super Admin', '')
  ON CONFLICT (id) DO NOTHING;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Also add customer role (so admin can browse the store)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin setup complete! Email: admin@local.test | Password: Admin@12345';
END;
$$;

-- ============================================================
-- VERIFY: Check admin was created
-- ============================================================
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  array_agg(r.role) as roles
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE u.email = 'admin@local.test'
GROUP BY u.id, u.email, u.email_confirmed_at, p.full_name;
