-- Add document_type_detail column to documents table for categorization
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS document_type_detail text;

-- Add doctor_id column to treatments table to link with admin/doctor
ALTER TABLE public.treatments
ADD COLUMN IF NOT EXISTS doctor_id uuid REFERENCES auth.users(id);

-- Add doctor_id column to invoices table
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS doctor_id uuid REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_documents_type_detail ON public.documents(document_type_detail);
CREATE INDEX IF NOT EXISTS idx_treatments_doctor ON public.treatments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_doctor ON public.invoices(doctor_id);