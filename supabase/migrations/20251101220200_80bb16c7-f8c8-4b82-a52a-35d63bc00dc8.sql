-- Drop the existing policy
DROP POLICY IF EXISTS "Users can access their own STL files" ON storage.objects;

-- Create a better policy that checks the documents table for patient ownership
CREATE POLICY "Users can access STL files they own via documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (
    -- Check if user owns the document record with this file_url
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE documents.file_url = storage.objects.name
      AND documents.patient_id = auth.uid()
    )
    -- Or user is an admin
    OR public.is_admin(auth.uid())
    -- Or user is the file owner (for direct uploads)
    OR owner_id::text = (auth.uid())::text
  )
);