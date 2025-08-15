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
      privateKeyStart: GOOGLE_PRIVATE_KEY?.substring(0, 50) + "...",
    })

    if (!SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error("[v0] Missing Google Sheets configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

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
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [rowData],
      },
    })

    console.log("[v0] Successfully appended to sheet")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API error details:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Failed to save to Google Sheets" }, { status: 500 })
  }
}
