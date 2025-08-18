-- Migration script to remove unused columns and keep only form fields
-- This script will modify the existing table to match the current form requirements

-- First, let's see what columns exist (this will help identify what to drop)
-- Note: Run this manually first to see current structure: SELECT column_name FROM information_schema.columns WHERE table_name = 'form_submissions';

-- Drop unused columns if they exist (these might be from previous versions)
ALTER TABLE form_submissions DROP COLUMN IF EXISTS email;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS phone;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS role;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS website;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS budget;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS timeline;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS project_description;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS additional_info;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS preferred_contact;
ALTER TABLE form_submissions DROP COLUMN IF EXISTS industry;

-- Ensure the table has the correct structure for current form
-- Add columns if they don't exist (in case table was created differently)
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS voice_recording_url TEXT;
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make sure message is NOT NULL (required field)
ALTER TABLE form_submissions ALTER COLUMN message SET NOT NULL;

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-recordings', 'voice-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Set up RLS policies for the bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'voice-recordings');

CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'voice-recordings');
