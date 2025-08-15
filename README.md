# Contact Form with Google Sheets & Voice Memo Integration

A Next.js contact form that saves submissions to Google Sheets and uploads voice memos to Google Drive using native HTML5 audio recording with OAuth authentication.

## Features

- **Contact Form**: Name, company, and message fields
- **Voice Recording**: Native HTML5 audio recording with compression
- **Google Sheets Integration**: Form submissions saved automatically
- **Google Drive Storage**: Voice memos uploaded and linked in spreadsheet
- **OAuth Authentication**: Secure user authentication with Google
- **Real-time Feedback**: Visual recording indicators and success states

## Setup Instructions

### 1. Create Google Cloud Project & APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create OAuth 2.0 Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
2. Configure OAuth consent screen first if prompted:
   - Choose "External" user type
   - Fill in required app information
   - Add your domain to authorized domains
   - Add scopes: `../auth/spreadsheets` and `../auth/drive.file`
3. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback`
4. Download the JSON file and extract:
   - `client_id`
   - `client_secret`

### 3. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add headers in the first row: `Timestamp`, `Name`, `Company`, `Message`, `Has Voice Memo`, `Voice Memo Link`
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
5. **Important**: Make sure the sheet is accessible to your Google account (the one you'll authenticate with)

### 4. Create Google Drive Folder (Optional)
1. Create a folder in Google Drive for voice memos
2. Copy the folder ID from the URL
3. **Note**: With OAuth, files will be uploaded to the authenticated user's Drive

### 5. Configure Environment Variables
Add these to your Vercel project settings or `.env.local`:

\`\`\`env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Google Services
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id (optional)

# App Configuration
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**For Production**: Update `GOOGLE_REDIRECT_URI` and `NEXTAUTH_URL` to your production domain.

### 6. Install Dependencies and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

## How It Works

1. **Authentication**: User signs in with Google OAuth to grant access to Sheets and Drive
2. **Form Submission**: User fills out contact form with optional voice memo
3. **Voice Recording**: Uses MediaRecorder API with WebM/Opus compression
4. **File Upload**: Voice memos uploaded to user's Google Drive via OAuth
5. **Sheet Update**: Form data and voice memo links saved to Google Sheets
6. **User Feedback**: Success indicators and form reset on completion

## OAuth vs Service Account

This app now uses **OAuth authentication** instead of service accounts, which provides:
- ✅ Access to user's personal Google Drive (no storage quota issues)
- ✅ More secure user-based permissions
- ✅ No need to share sheets with service accounts
- ✅ Better user experience with familiar Google sign-in

## Browser Compatibility

- **Voice Recording**: Requires modern browsers with MediaRecorder API support
- **Mobile**: Works on iOS Safari 14.3+ and Android Chrome 47+
- **Desktop**: Works on Chrome 47+, Firefox 25+, Safari 14.1+

## Security Features

- OAuth 2.0 authentication (industry standard)
- Scoped permissions (only access to user's sheets and drive files)
- No external dependencies for audio recording
- Compressed audio files to minimize storage usage
- Secure token handling with HTTP-only cookies
