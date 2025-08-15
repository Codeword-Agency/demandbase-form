# Contact Form with Google Sheets Integration

A simple Next.js contact form that saves submissions directly to Google Sheets using service account authentication.

## Setup Instructions

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add headers in the first row: `Timestamp`, `Name`, `Company`, `Message`
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Create Google Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Create a service account with any name
6. Click on the created service account
7. Go to "Keys" tab → "Add Key" → "Create New Key" → "JSON"
8. Download the JSON file and note the `client_email` and `private_key` values

### 3. Share Sheet with Service Account
1. In your Google Sheet, click "Share"
2. Add the service account email (from step 2) as an editor
3. This allows the service account to write to your sheet

### 4. Configure Environment Variables
Add these to your `.env.local` file:

\`\`\`env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
\`\`\`

**Important**: The private key should include the full key with `\n` characters for line breaks.

### 5. Install Dependencies and Run
\`\`\`bash
npm install
npm run dev
\`\`\`

The form will now save submissions directly to your Google Sheet!

## Security Note
This setup uses service account authentication which is more secure than API keys. The service account only has access to sheets you explicitly share with it.
