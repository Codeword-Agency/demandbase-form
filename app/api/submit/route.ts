import { type NextRequest, NextResponse } from "next/server"
import { createAirtableRecord, validateAirtableConfig } from "@/lib/airtable"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { name, company, message, voiceRecording } = await request.json()
    console.log("[v0] Request data:", { name, company, message, hasVoiceRecording: !!voiceRecording })

    // Validate required fields
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let isConfigValid
    try {
      isConfigValid = await validateAirtableConfig()
    } catch (validationError) {
      console.error("[v0] Airtable validation error:", validationError)
      return NextResponse.json(
        {
          error: `Configuration error: ${validationError instanceof Error ? validationError.message : "Unknown validation error"}`,
        },
        { status: 500 },
      )
    }

    if (!isConfigValid) {
      return NextResponse.json(
        {
          error: "Server configuration error - please check Airtable environment variables",
        },
        { status: 500 },
      )
    }

    try {
      console.log("[v0] Creating Airtable record...")

      const airtableData = {
        name: name || "",
        company: company || "",
        message,
        voiceRecording: voiceRecording
          ? new File([voiceRecording], `voice-memo-${Date.now()}.webm`, { type: "audio/webm" })
          : undefined,
        submittedAt: new Date().toISOString(),
      }

      const result = await createAirtableRecord(airtableData)
      console.log("[v0] Successfully created Airtable record:", result.id)

      return NextResponse.json({ success: true, recordId: result.id })
    } catch (airtableError) {
      console.error("[v0] Airtable API error:", airtableError)
      if (airtableError instanceof Error) {
        console.error("[v0] Airtable error message:", airtableError.message)

        // Check for common Airtable issues
        if (airtableError.message.includes("401") || airtableError.message.includes("AUTHENTICATION_REQUIRED")) {
          return NextResponse.json(
            {
              error: "Invalid Airtable API key - check your AIRTABLE_API_KEY",
            },
            { status: 500 },
          )
        } else if (airtableError.message.includes("404") || airtableError.message.includes("NOT_FOUND")) {
          return NextResponse.json(
            {
              error: "Airtable base or table not found - check your AIRTABLE_BASE_ID and AIRTABLE_TABLE_ID",
            },
            { status: 500 },
          )
        } else if (airtableError.message.includes("422") || airtableError.message.includes("INVALID_REQUEST")) {
          return NextResponse.json(
            {
              error: "Invalid data format - check your Airtable table structure",
            },
            { status: 500 },
          )
        }
      }

      return NextResponse.json(
        {
          error: `Airtable API error: ${airtableError instanceof Error ? airtableError.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] General API error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
