-- ============================================================
-- SETUP ADMIN USER WITH USERNAME 'manasantha' AND PASSWORD 'ManaSantha@2026'
-- Run this in Supabase Dashboard → SQL Editor → Run
-- ============================================================

DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- 1. Find existing user with synthetic email or admin email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email IN ('manasantha@username.manasantha.local', 'admin@manasantha.com');

  -- 2. Create or Update user
  IF target_user_id IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, raw_user_meta_data, is_super_admin, 
      created_at, updated_at, role, aud
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 
      'manasantha@username.manasantha.local', 
      crypt('ManaSantha@2026', gen_salt('bf')), 
      NOW(), 
      '{"provider": "email", "providers": ["email"]}', 
      '{"full_name": "Mana Santha Admin", "username": "manasantha"}', 
      FALSE, NOW(), NOW(), 'authenticated', 'authenticated'
    ) RETURNING id INTO target_user_id;
  ELSE
    UPDATE auth.users 
    SET email = 'manasantha@username.manasantha.local',
        encrypted_password = crypt('ManaSantha@2026', gen_salt('bf')),
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = target_user_id;
  END IF;

  -- 3. Ensure profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (target_user_id, 'Mana Santha Admin', '')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Mana Santha Admin';

  -- 4. Grant Admin & Customer Roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Admin created/updated! Username: manasantha | Password: ManaSantha@2026';
END;
$$;
