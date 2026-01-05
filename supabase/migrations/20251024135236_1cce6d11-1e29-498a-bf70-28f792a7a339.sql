-- Create storage bucket for STL files
INSERT INTO storage.buckets (id, name, public)
VALUES ('stl-files', 'stl-files', false);

-- Create RLS policies for STL files bucket
CREATE POLICY "Admins can upload STL files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'stl-files' 
  AND (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can update STL files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can delete STL files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Patients can view their own STL files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'stl-files' 
  AND (
    (SELECT is_admin(auth.uid()))
    OR
    (storage.foldername(name))[1] = auth.uid()::text
  )
);

-- Add STL file tracking to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'document';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_documents_patient_type ON documents(patient_id, file_type);