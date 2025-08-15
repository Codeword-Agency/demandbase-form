import { type NextRequest, NextResponse } from "next/server"
import { getTokens } from "@/lib/google-oauth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 })
    }

    const tokens = await getTokens(code)

    // Store tokens in session/database - for now we'll return them
    // In production, you'd want to store these securely
    const response = NextResponse.redirect(process.env.NEXTAUTH_URL || "http://localhost:3000")
    response.cookies.set("google_tokens", JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 })
  }
}
