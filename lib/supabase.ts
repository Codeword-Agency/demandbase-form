import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.SUPABASE_URL === "string" &&
  process.env.SUPABASE_URL.length > 0 &&
  typeof process.env.SUPABASE_SERVICE_ROLE_KEY === "string" &&
  process.env.SUPABASE_SERVICE_ROLE_KEY.length > 0

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface FormSubmission {
  id?: string
  name?: string
  company?: string
  message: string
  voice_recording_url?: string
  created_at?: string
}
