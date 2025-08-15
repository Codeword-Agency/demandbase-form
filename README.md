# Contact Form with Airtable & Voice Memo Integration

A Next.js contact form that saves submissions to Airtable and uploads voice memos as file attachments using native HTML5 audio recording.

## Features

- **Contact Form**: Name, company, and message fields
- **Voice Recording**: Native HTML5 audio recording with compression
- **Airtable Integration**: Form submissions and voice memos saved automatically
- **Public Access**: No authentication required - completely open to public use
- **Real-time Feedback**: Visual recording indicators and success states

## Setup Instructions

### 1. Create Airtable Base
1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table with these fields:
   - **Name** (Single line text)
   - **Company** (Single line text) 
   - **Message** (Long text)
   - **Voice Recording** (Attachment)
   - **Submitted At** (Date & time)
3. Copy your Base ID from the URL or API documentation
4. Copy your Table ID (usually the table name like "Table 1" or custom name)

### 2. Generate Personal Access Token
1. Go to [Airtable Account Settings](https://airtable.com/account)
2. Navigate to "Personal access tokens"
3. Click "Create new token"
4. Give it a name (e.g., "Contact Form Integration")
5. Add these scopes:
   - `data:records:read`
   - `data:records:write`
6. Select your specific base
7. Copy the generated token (starts with `pat...`)

### 3. Configure Environment Variables
Add these to your Vercel project settings or `.env.local`:

\`\`\`env
# Airtable Configuration
AIRTABLE_PERSONAL_ACCESS_TOKEN=pat_your_personal_access_token_here
AIRTABLE_BASE_ID=app_your_base_id_here
AIRTABLE_TABLE_ID=your_table_name_or_id_here
\`\`\`

### 4. Install Dependencies and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

## How It Works

1. **Form Submission**: User fills out contact form with optional voice memo
2. **Voice Recording**: Uses MediaRecorder API with WebM/Opus compression
3. **Direct Upload**: Form data and voice memo sent directly to Airtable
4. **File Attachment**: Voice memos stored as file attachments in Airtable
5. **User Feedback**: Success indicators and form reset on completion

## Public Access

This form is designed for **public use** without authentication:
- ✅ No login required - completely open access
- ✅ Direct submission to your Airtable base
- ✅ Voice memos stored securely in Airtable
- ✅ Simple setup with just 3 environment variables

## Browser Compatibility

- **Voice Recording**: Requires modern browsers with MediaRecorder API support
- **Mobile**: Works on iOS Safari 14.3+ and Android Chrome 47+
- **Desktop**: Works on Chrome 47+, Firefox 25+, Safari 14.1+

## Security Features

- Personal Access Token authentication (scoped permissions)
- No external dependencies for audio recording
- Compressed audio files to minimize storage usage
- Direct API integration with Airtable's secure infrastructure
