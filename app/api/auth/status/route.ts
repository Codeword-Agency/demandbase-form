import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const tokens = request.cookies.get("google_tokens")

    if (!tokens) {
      return NextResponse.json({ authenticated: false })
    }

    // Parse tokens and check if they're valid
    const tokenData = JSON.parse(tokens.value)

    // Basic check - in production you'd want to validate the token
    const authenticated = !!tokenData.access_token

    return NextResponse.json({ authenticated })
  } catch (error) {
    console.error("Auth status check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}
