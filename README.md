# Contact Form with Supabase Integration

A Next.js contact form that saves submissions to Supabase database and uploads voice memos to Supabase Storage using native HTML5 audio recording.

## Features

- **Comprehensive Contact Form**: Name, email, phone, company, role, and message fields
- **Voice Recording**: Native HTML5 audio recording with compression
- **Supabase Integration**: Form submissions saved to database and voice memos stored in Supabase Storage
- **Public Access**: No authentication required - completely open to public use
- **Real-time Feedback**: Visual recording indicators and success states
- **Form Validation**: Client-side and server-side validation for all fields

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Go to Project Settings > API to find your project URL and anon key

### 2. Configure Environment Variables
The following environment variables should already be available in your Vercel project:

\`\`\`env
# Supabase Configuration
SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

### 3. Set Up Database and Storage
Run the provided SQL script to create the necessary database table and storage bucket:

1. In your v0 project, execute the SQL script: `scripts/create_form_submissions_table.sql`
2. This will create:
   - `form_submissions` table with all necessary fields
   - `voice-recordings` storage bucket with public access
   - Proper RLS policies for public access

### 4. Install Dependencies and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

## Database Schema

The `form_submissions` table includes:
- `id` (UUID, primary key)
- `name` (text, required)
- `email` (text, required)
- `phone` (text, optional)
- `company` (text, optional)
- `role` (text, optional)
- `message` (text, required)
- `voice_recording_url` (text, optional) - URL to audio file in Supabase Storage
- `created_at` (timestamp)

## How It Works

1. **Form Submission**: User fills out comprehensive contact form with optional voice memo
2. **Voice Recording**: Uses MediaRecorder API with WebM/Opus compression
3. **File Upload**: Voice memos uploaded to Supabase Storage bucket
4. **Database Storage**: Form data and voice recording URL saved to Supabase database
5. **User Feedback**: Success indicators and form reset on completion

## Public Access

This form is designed for **public use** without authentication:
- ✅ No login required - completely open access
- ✅ Direct submission to your Supabase database
- ✅ Voice memos stored securely in Supabase Storage
- ✅ RLS policies configured for public insert access

## Browser Compatibility

- **Voice Recording**: Requires modern browsers with MediaRecorder API support
- **Mobile**: Works on iOS Safari 14.3+ and Android Chrome 47+
- **Desktop**: Works on Chrome 47+, Firefox 25+, Safari 14.1+

## Security Features

- Supabase Row Level Security (RLS) policies for controlled access
- Service role key for server-side operations
- Compressed audio files to minimize storage usage
- Direct integration with Supabase's secure infrastructure
- Form validation on both client and server side

## Storage Management

Voice recordings are stored in the `voice-recordings` bucket with:
- Public read access for playback
- Automatic file naming with timestamps
- WebM format for optimal compression
- No file size limits (handled by browser constraints)
