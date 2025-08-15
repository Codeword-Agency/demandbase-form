import { google } from "googleapis"
import { Readable } from "stream"

export async function uploadToGoogleDrive(
  audioBuffer: Buffer,
  fileName: string,
  metadata: { name: string; company: string },
) {
  try {
    console.log("[v0] Starting Google Drive upload process...")
    console.log("[v0] Environment variables check:")
    console.log("[v0] - GOOGLE_PROJECT_ID:", !!process.env.GOOGLE_PROJECT_ID)
    console.log("[v0] - GOOGLE_PRIVATE_KEY_ID:", !!process.env.GOOGLE_PRIVATE_KEY_ID)
    console.log("[v0] - GOOGLE_PRIVATE_KEY:", !!process.env.GOOGLE_PRIVATE_KEY)
    console.log("[v0] - GOOGLE_SERVICE_ACCOUNT_EMAIL:", !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
    console.log("[v0] - GOOGLE_CLIENT_ID:", !!process.env.GOOGLE_CLIENT_ID)
    console.log("[v0] - GOOGLE_DRIVE_FOLDER_ID:", !!process.env.GOOGLE_DRIVE_FOLDER_ID)

    if (
      !process.env.GOOGLE_PROJECT_ID ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    ) {
      throw new Error("Missing required Google Drive environment variables")
    }

    console.log("[v0] Testing service account authentication...")

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

    try {
      const authClient = await auth.getClient()
      console.log("[v0] Authentication successful")
    } catch (authError) {
      console.error("[v0] Authentication failed:", authError)
      throw new Error(`Service account authentication failed: ${authError}`)
    }

    console.log("[v0] Google Auth initialized, creating Drive client...")
    const drive = google.drive({ version: "v3", auth })

    try {
      console.log("[v0] Testing Drive API access...")
      await drive.about.get({ fields: "user" })
      console.log("[v0] Drive API access confirmed")
    } catch (driveError) {
      console.error("[v0] Drive API access failed:", driveError)
      throw new Error(`Drive API access denied. Make sure the service account has Drive API enabled: ${driveError}`)
    }

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : undefined,
      description: `Voice memo from ${metadata.name} (${metadata.company}) - ${new Date().toISOString()}`,
    }

    const stream = new Readable()
    stream.push(audioBuffer)
    stream.push(null) // End the stream

    // Upload file
    const media = {
      mimeType: "audio/webm",
      body: stream,
    }

    console.log("[v0] Uploading to Google Drive:", fileName)
    console.log("[v0] File metadata:", fileMetadata)
    console.log("[v0] Audio buffer size:", audioBuffer.length)

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    })

    console.log("[v0] Google Drive upload successful:", response.data.id)

    if (response.data.id) {
      try {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: "reader",
            type: "anyone",
          },
        })
        console.log("[v0] File permissions set to public")
      } catch (permError) {
        console.warn("[v0] Could not set file permissions:", permError)
      }
    }

    return {
      fileId: response.data.id,
      fileName: fileName,
      webViewLink: `https://drive.google.com/file/d/${response.data.id}/view`,
    }
  } catch (error) {
    console.error("[v0] Google Drive upload error:", error)

    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)

      // Provide specific guidance based on error type
      if (error.message.includes("Service account")) {
        console.error("[v0] SOLUTION: Check your service account setup:")
        console.error("1. Ensure Google Drive API is enabled in Google Cloud Console")
        console.error("2. Verify service account has proper permissions")
        console.error("3. Check that all environment variables are correctly set")
      }
    }

    throw new Error(`Failed to upload to Google Drive: ${error}`)
  }
}
