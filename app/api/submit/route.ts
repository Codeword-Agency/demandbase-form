import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { name, company, message } = await request.json()
    console.log("[v0] Request data:", { name, company, message })

    // Validate required fields
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Google Sheets configuration
    const SHEET_ID = process.env.GOOGLE_SHEET_ID
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

    console.log("[v0] Environment variables check:", {
      hasSheetId: !!SHEET_ID,
      hasEmail: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!GOOGLE_PRIVATE_KEY,
      sheetId: SHEET_ID,
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    })

    if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error("[v0] Missing Google Sheets configuration")
      return NextResponse.json(
        {
          error: "Server configuration error - missing environment variables",
        },
        { status: 500 },
      )
    }

    try {
      console.log("[v0] Creating Google Auth...")
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      console.log("[v0] Creating sheets client...")
      const sheets = google.sheets({ version: "v4", auth })

      // Prepare data for Google Sheets
      const timestamp = new Date().toISOString()
      const rowData = [timestamp, name || "", company || "", message]
      console.log("[v0] Row data to append:", rowData)

      console.log("[v0] Attempting to append to sheet...")
      const result = await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:D",
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
              error: "Permission denied - check if service account has access to the sheet",
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
              error: "Authentication failed - check your service account credentials",
            },
            { status: 500 },
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
