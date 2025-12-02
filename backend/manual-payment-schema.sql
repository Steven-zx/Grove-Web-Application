-- Add columns for manual payment proof of payment
-- Run this in your Supabase SQL Editor

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update status enum to include pending_approval and rejected
-- Note: If your status column is TEXT (not ENUM), this will work automatically
-- If it's an ENUM, you may need to recreate it

COMMENT ON COLUMN bookings.payment_proof_url IS 'URL to uploaded proof of payment screenshot';
COMMENT ON COLUMN bookings.payment_amount IS 'Amount paid by user';
COMMENT ON COLUMN bookings.admin_notes IS 'Admin notes for payment approval/rejection';
