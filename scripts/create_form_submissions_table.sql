-- Create form_submissions table
DROP TABLE IF EXISTS form_submissions;

CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  company TEXT,
  message TEXT NOT NULL,
  voice_recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for voice recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-recordings', 'voice-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies before creating new ones to prevent "already exists" errors
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Set up RLS policies for the bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'voice-recordings');

CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'voice-recordings');
