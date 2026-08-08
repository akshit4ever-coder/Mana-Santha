-- ============================================================
-- MANA SANTHA — SECURE ADMIN ACCOUNT SEED
-- ============================================================
-- Run this in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste → Run
--
-- This creates/updates:
--   1. A secure admin user in auth.users
--   2. A profile record
--   3. An admin role in user_roles
--
-- Admin Credentials:
--   Email:    manasantha@gmail.com
--   Password: ManaSantha@2026
-- ============================================================

DO $$
DECLARE
  admin_id UUID;
  existing_id UUID;
BEGIN
  -- Check if admin already exists
  SELECT id INTO existing_id
  FROM auth.users
  WHERE email = 'manasantha@gmail.com';

  IF existing_id IS NOT NULL THEN
    RAISE NOTICE 'Admin user already exists with id: %', existing_id;
    
    -- Ensure they have the correct password
    UPDATE auth.users 
    SET encrypted_password = crypt('ManaSantha@2026', gen_salt('bf')),
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = existing_id;

    -- Ensure they have the admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (existing_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Ensure they have a profile
    INSERT INTO public.profiles (id, full_name, phone)
    VALUES (existing_id, 'Mana Santha Admin', '')
    ON CONFLICT (id) DO UPDATE SET full_name = 'Mana Santha Admin';
    
    RETURN;
  END IF;

  -- Create the admin user
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
    'manasantha@gmail.com',
    crypt('ManaSantha@2026', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mana Santha Admin"}',
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

  RAISE NOTICE 'Created secure admin user with id: %', admin_id;

  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (admin_id, 'Mana Santha Admin', '')
  ON CONFLICT (id) DO NOTHING;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Also add customer role (so admin can browse the store)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin setup complete! Email: manasantha@gmail.com | Password: ManaSantha@2026';
END;
$$;
