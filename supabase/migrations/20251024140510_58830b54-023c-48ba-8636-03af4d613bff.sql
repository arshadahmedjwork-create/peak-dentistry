-- Fix: Patient Contact Information Exposed to Public
-- Add SELECT policy to restrict reading booking requests to admins only
CREATE POLICY "Only admins can view booking requests"
ON public.booking_requests FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));