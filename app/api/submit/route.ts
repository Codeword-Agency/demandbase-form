import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { name, company, message, voiceFileId, hasVoiceRecording } = await request.json()
    console.log("[v0] Request data:", { name, company, message, voiceFileId, hasVoiceRecording })

    // Validate required fields
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const tokensCookie = request.cookies.get("google_tokens")
    if (!tokensCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    let tokens
    try {
      tokens = JSON.parse(tokensCookie.value)
    } catch (parseError) {
      return NextResponse.json({ error: "Invalid authentication tokens" }, { status: 401 })
    }

    // Google Sheets configuration
    const SHEET_ID = process.env.GOOGLE_SHEET_ID

    console.log("[v0] Environment variables check:", {
      hasSheetId: !!SHEET_ID,
      hasTokens: !!tokens.access_token,
      sheetId: SHEET_ID,
    })

    if (!SHEET_ID) {
      console.error("[v0] Missing Google Sheets configuration")
      return NextResponse.json(
        {
          error: "Server configuration error - missing GOOGLE_SHEET_ID",
        },
        { status: 500 },
      )
    }

    try {
      console.log("[v0] Creating OAuth client...")
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      )

      oauth2Client.setCredentials(tokens)

      console.log("[v0] Creating sheets client...")
      const sheets = google.sheets({ version: "v4", auth: oauth2Client })

      const timestamp = new Date().toISOString()
      const voiceLink = voiceFileId ? `https://drive.google.com/file/d/${voiceFileId}/view` : ""
      const rowData = [timestamp, name || "", company || "", message, hasVoiceRecording ? "Yes" : "No", voiceLink]
      console.log("[v0] Row data to append:", rowData)

      console.log("[v0] Attempting to append to sheet...")
      const result = await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:F",
        valueInputOption: "RAW",
        requestBody: {
          values: [rowData],
        },
      })

      console.log("[v0] Successfully appended to sheet:", result.status)
      return NextResponse.json({ success: true })
    } catch (authError) {
      console.error("[v0] Google Sheets API error:", authError)
      if (authError instanceof Error) {
        console.error("[v0] Auth error message:", authError.message)

        // Check for common authentication issues
        if (authError.message.includes("403")) {
          return NextResponse.json(
            {
              error: "Permission denied - make sure you've shared the sheet with your Google account",
            },
            { status: 500 },
          )
        } else if (authError.message.includes("404")) {
          return NextResponse.json(
            {
              error: "Sheet not found - check your GOOGLE_SHEET_ID",
            },
            { status: 500 },
          )
        } else if (authError.message.includes("401")) {
          return NextResponse.json(
            {
              error: "Authentication expired - please sign in again",
            },
            { status: 401 },
          )
        }
      }

      return NextResponse.json(
        {
          error: `Google Sheets API error: ${authError instanceof Error ? authError.message : "Unknown error"}`,
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
