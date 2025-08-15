import { type NextRequest, NextResponse } from "next/server"
import { uploadToGoogleDrive } from "@/lib/google-drive"
import { Buffer } from "buffer"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Audio upload request received")

    const requiredEnvVars = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_PROJECT_ID"]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
    if (missingVars.length > 0) {
      console.error("[v0] Missing environment variables:", missingVars)
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: `Missing environment variables: ${missingVars.join(", ")}`,
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const name = formData.get("name") as string
    const company = formData.get("company") as string

    if (!audioFile) {
      console.log("[v0] No audio file provided")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("[v0] Processing audio file:", {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
    })

    if (audioFile.size > 50 * 1024 * 1024) {
      // 50MB limit
      console.error("[v0] File too large:", audioFile.size)
      return NextResponse.json(
        {
          error: "File too large",
          details: "Audio file must be less than 50MB",
        },
        { status: 400 },
      )
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `voice-memo-${timestamp}-${name || "anonymous"}.webm`

    console.log("[v0] Attempting Google Drive upload...")

    // Upload to Google Drive
    const result = await uploadToGoogleDrive(buffer, fileName, {
      name: name || "Anonymous",
      company: company || "N/A",
    })

    console.log("[v0] Audio upload successful:", result)

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      fileName: result.fileName,
      webViewLink: result.webViewLink,
    })
  } catch (error) {
    console.error("[v0] Audio upload error:", error)

    let errorMessage = "Failed to upload audio file"
    let errorDetails = "Unknown error"

    if (error instanceof Error) {
      errorDetails = error.message

      // Provide more specific error messages based on common issues
      if (error.message.includes("403")) {
        errorMessage = "Permission denied - check Google Drive access"
        errorDetails = "Service account may not have access to Google Drive or the specified folder"
      } else if (error.message.includes("401")) {
        errorMessage = "Authentication failed"
        errorDetails = "Invalid Google service account credentials"
      } else if (error.message.includes("404")) {
        errorMessage = "Google Drive folder not found"
        errorDetails = "Check GOOGLE_DRIVE_FOLDER_ID environment variable"
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
