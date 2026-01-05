-- Drop and recreate setup_admin_user with unambiguous parameter names
DROP FUNCTION IF EXISTS public.setup_admin_user(uuid, text);

CREATE OR REPLACE FUNCTION public.setup_admin_user(p_user_id uuid, p_user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile if exists, insert if not
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email
  ) VALUES (
    p_user_id,
    'Admin',
    'User',
    p_user_email
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  
  -- Remove any existing patient role
  DELETE FROM public.user_roles
  WHERE user_id = p_user_id 
  AND role = 'patient';
  
  -- Assign admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create notification preferences if not exists
  INSERT INTO public.notification_preferences (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.setup_admin_user(uuid, text) TO authenticated;