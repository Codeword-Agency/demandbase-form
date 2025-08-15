import { google } from "googleapis"
import { Readable } from "stream"

export async function uploadToGoogleDrive(
  audioBuffer: Buffer,
  fileName: string,
  metadata: { name: string; company: string },
  accessToken: string,
) {
  try {
    console.log("[v0] Starting Google Drive upload process with OAuth...")

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    )

    // Set the access token
    oauth2Client.setCredentials({
      access_token: accessToken,
    })

    console.log("[v0] OAuth client initialized with access token")

    const drive = google.drive({ version: "v3", auth: oauth2Client })

    try {
      console.log("[v0] Testing Drive API access...")
      await drive.about.get({ fields: "user" })
      console.log("[v0] Drive API access confirmed")
    } catch (driveError) {
      console.error("[v0] Drive API access failed:", driveError)
      throw new Error(`Drive API access denied: ${driveError}`)
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
      console.error("[v0] Full error details:")
      console.error("- Message:", error.message)
      console.error("- Stack:", error.stack)

      throw new Error(`Google Drive upload failed: ${error.message}`)
    }

    throw new Error(`Failed to upload to Google Drive: ${String(error)}`)
  }
}
