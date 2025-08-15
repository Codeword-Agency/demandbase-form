import { NextResponse } from "next/server"
import { getAuthUrl } from "@/lib/google-oauth"

export async function GET() {
  try {
    const authUrl = getAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("OAuth setup error:", error)
    return NextResponse.json({ error: "Failed to setup OAuth" }, { status: 500 })
  }
}
