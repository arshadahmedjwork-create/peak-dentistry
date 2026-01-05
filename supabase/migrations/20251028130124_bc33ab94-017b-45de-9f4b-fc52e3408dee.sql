-- Update appointment_status enum to include pending_confirmation
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'pending_confirmation';

-- Update existing 'scheduled' appointments from patient portal to 'pending_confirmation'
-- This ensures all patient bookings need admin confirmation going forward
COMMENT ON TYPE appointment_status IS 'Status values: pending_confirmation (awaiting admin approval), scheduled (confirmed by admin), confirmed, completed, cancelled';