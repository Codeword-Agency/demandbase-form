import { google } from "googleapis"

export async function uploadToGoogleDrive(
  audioBuffer: Buffer,
  fileName: string,
  metadata: { name: string; company: string },
) {
  try {
    // Initialize Google Drive API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`,
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    })

    const drive = google.drive({ version: "v3", auth })

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
      description: `Voice memo from ${metadata.name} (${metadata.company}) - ${new Date().toISOString()}`,
    }

    // Upload file
    const media = {
      mimeType: "audio/webm",
      body: Buffer.from(audioBuffer),
    }

    console.log("[v0] Uploading to Google Drive:", fileName)
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    })

    console.log("[v0] Google Drive upload successful:", response.data.id)
    return {
      fileId: response.data.id,
      fileName: fileName,
      webViewLink: `https://drive.google.com/file/d/${response.data.id}/view`,
    }
  } catch (error) {
    console.error("[v0] Google Drive upload error:", error)
    throw new Error(`Failed to upload to Google Drive: ${error}`)
  }
}
