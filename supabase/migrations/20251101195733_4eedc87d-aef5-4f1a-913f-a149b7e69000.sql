-- Drop and recreate the setup_admin_user function with improved error handling
DROP FUNCTION IF EXISTS public.setup_admin_user(uuid, text);

CREATE OR REPLACE FUNCTION public.setup_admin_user(user_id uuid, user_email text)
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
    user_id,
    'Admin',
    'User',
    user_email
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();
  
  -- Remove any existing patient role
  DELETE FROM public.user_roles
  WHERE user_roles.user_id = setup_admin_user.user_id 
  AND user_roles.role = 'patient';
  
  -- Assign admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create notification preferences if not exists
  INSERT INTO public.notification_preferences (user_id)
  VALUES (user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.setup_admin_user(uuid, text) TO authenticated;