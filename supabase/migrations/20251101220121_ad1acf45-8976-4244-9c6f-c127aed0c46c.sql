-- Fix STL files storage policies with proper type casting
DROP POLICY IF EXISTS "Patients can view their own STL files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can download STL files they own" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can download STL files" ON storage.objects;

-- Create policy that checks owner_id with proper type casting
CREATE POLICY "Users can access their own STL files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (
    owner_id::text = (auth.uid())::text
    OR public.is_admin(auth.uid())
  )
);