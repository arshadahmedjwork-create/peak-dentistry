-- Fix the setup_admin_user function to avoid ambiguous column reference
CREATE OR REPLACE FUNCTION public.setup_admin_user(user_id uuid, user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update profile if exists, insert if not
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email
  ) VALUES (
    setup_admin_user.user_id,
    'Admin',
    'User',
    user_email
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  
  -- Remove any existing patient role - use table alias to avoid ambiguity
  DELETE FROM public.user_roles ur
  WHERE ur.user_id = setup_admin_user.user_id 
  AND ur.role = 'patient';
  
  -- Assign admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (setup_admin_user.user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create notification preferences if not exists
  INSERT INTO public.notification_preferences (user_id)
  VALUES (setup_admin_user.user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;