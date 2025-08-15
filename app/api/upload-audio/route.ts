import { type NextRequest, NextResponse } from "next/server"
import { uploadToGoogleDrive } from "@/lib/google-drive"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Audio upload request received")

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

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const fileName = `voice-memo-${timestamp}-${name || "anonymous"}.webm`

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
    return NextResponse.json(
      {
        error: "Failed to upload audio file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
