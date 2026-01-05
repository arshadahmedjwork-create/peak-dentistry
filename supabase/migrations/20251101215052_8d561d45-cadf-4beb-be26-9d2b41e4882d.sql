-- Drop existing policies
DROP POLICY IF EXISTS "Patients can view their own STL files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all STL files" ON storage.objects;

-- Create better policies for STL file access
CREATE POLICY "Patients can view their own STL files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (
    auth.uid()::text = (string_to_array(name, '/'))[1]
    OR 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
);

CREATE POLICY "Authenticated users can download STL files they own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);