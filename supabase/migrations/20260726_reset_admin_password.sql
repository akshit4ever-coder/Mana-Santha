-- ============================================================
-- RESET & SET ADMIN PASSWORD TO Admin@12345
-- Run this in Supabase Dashboard → SQL Editor → Run
-- ============================================================

DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- 1. Find user
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@local.test';

  -- 2. Create user if doesn't exist
  IF target_user_id IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, raw_user_meta_data, is_super_admin, 
      created_at, updated_at, role, aud
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 
      'admin@local.test',
      crypt('Admin@12345', gen_salt('bf')), 
      NOW(), 
      '{"provider": "email", "providers": ["email"]}', 
      '{"full_name": "Super Admin"}', 
      FALSE, NOW(), NOW(), 'authenticated', 'authenticated'
    ) RETURNING id INTO target_user_id;
  ELSE
    -- Update password directly
    UPDATE auth.users 
    SET encrypted_password = crypt('Admin@12345', gen_salt('bf')),
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = target_user_id;
  END IF;

  -- 3. Ensure profile and roles
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (target_user_id, 'Super Admin', '')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Super Admin';

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Password updated for admin@local.test to Admin@12345';
END;
$$;
