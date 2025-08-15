# Contact Form with Google Sheets & Voice Memo Integration

A Next.js contact form that saves submissions to Google Sheets and uploads voice memos to Google Drive using native HTML5 audio recording.

## Features

- **Contact Form**: Name, company, and message fields
- **Voice Recording**: Native HTML5 audio recording with compression
- **Google Sheets Integration**: Form submissions saved automatically
- **Google Drive Storage**: Voice memos uploaded and linked in spreadsheet
- **Real-time Feedback**: Visual recording indicators and success states

## Setup Instructions

### 1. Create Google Cloud Project & APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create Service Account
1. Go to "Credentials" → "Create Credentials" → "Service Account"
2. Create a service account with any name
3. Click on the created service account
4. Go to "Keys" tab → "Add Key" → "Create New Key" → "JSON"
5. Download the JSON file and extract these values:
   - `client_email`
   - `private_key`
   - `project_id`
   - `private_key_id`
   - `client_id`

### 3. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add headers in the first row: `Timestamp`, `Name`, `Company`, `Message`, `Has Voice Memo`, `Voice Memo Link`
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
5. Share the sheet with your service account email as an editor

### 4. Create Google Drive Folder (Optional)
1. Create a folder in Google Drive for voice memos
2. Share the folder with your service account email as an editor
3. Copy the folder ID from the URL

### 5. Configure Environment Variables
Add these to your Vercel project settings or `.env.local`:

\`\`\`env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id (optional)
\`\`\`

**Important**: The private key should include the full key with `\n` characters for line breaks.

### 6. Install Dependencies and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

## How It Works

1. **Form Submission**: User fills out contact form with optional voice memo
2. **Voice Recording**: Uses MediaRecorder API with WebM/Opus compression
3. **File Upload**: Voice memos uploaded to Google Drive via service account
4. **Sheet Update**: Form data and voice memo links saved to Google Sheets
5. **User Feedback**: Success indicators and form reset on completion

## Browser Compatibility

- **Voice Recording**: Requires modern browsers with MediaRecorder API support
- **Mobile**: Works on iOS Safari 14.3+ and Android Chrome 47+
- **Desktop**: Works on Chrome 47+, Firefox 25+, Safari 14.1+

## Security Features

- Service account authentication (more secure than API keys)
- Scoped permissions (only access to shared sheets/folders)
- No external dependencies for audio recording
- Compressed audio files to minimize storage usage
