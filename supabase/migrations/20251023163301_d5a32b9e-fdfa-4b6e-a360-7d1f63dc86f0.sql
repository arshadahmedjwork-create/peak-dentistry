-- Insert admin user profile and role
-- Note: The user must be created through Supabase Auth first, then we link the profile

-- First, let's create a sample admin profile
-- You'll need to sign up with admin@peakdentistry.in / admin@peak first through the UI
-- This migration prepares the profile structure

-- Create a function to setup admin user after signup
CREATE OR REPLACE FUNCTION public.setup_admin_user(
  user_id uuid,
  user_email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile if not exists
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
  SET email = EXCLUDED.email;
  
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

-- Update the handle_new_user trigger to check for admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Check if this is the admin email and assign admin role
  IF NEW.email = 'admin@peakdentistry.in' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Assign default patient role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
  END IF;
  
  -- Create default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;