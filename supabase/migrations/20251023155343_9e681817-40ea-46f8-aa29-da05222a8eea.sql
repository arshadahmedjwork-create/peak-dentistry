-- Update admin user's role from patient to admin
UPDATE public.user_roles 
SET role = 'admin'
WHERE user_id = 'eb1bef26-4df7-4054-bde1-4decc9bb5956';

-- Add policy to allow authenticated users to insert their own profile
-- (This helps ensure the trigger can create profiles during signup)
CREATE POLICY "Users can insert their own profile during signup"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);