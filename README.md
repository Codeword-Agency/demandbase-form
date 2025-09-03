# Contact Form with Supabase Integration

A Next.js contact form that saves submissions to Supabase database and uploads voice memos to Supabase Storage using native HTML5 audio recording.

## Setup Instructions
clone or download project.

### 2. Configure Environment Variables
the exact varribles are in a google doc I'll share, but looks similar to this:

\`\`\`env
# Supabase Configuration
SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

# run:
npm install
npm run dev

it should run on your local.