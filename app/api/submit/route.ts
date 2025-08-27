import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured, type FormSubmission } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API route called")
    const { name, company, message, email, voiceRecording } = await request.json()
    console.log("[v0] Request data:", { name, company, message, email, hasVoiceRecording: !!voiceRecording })

    // Validate required fields
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[v0] Checking Supabase configuration...")
    if (!isSupabaseConfigured) {
      console.log("[v0] Supabase not configured")
      return NextResponse.json(
        {
          error: "Supabase configuration error - please check environment variables",
        },
        { status: 500 },
      )
    }
    console.log("[v0] Supabase configuration OK")

    try {
      console.log("[v0] Starting Supabase operations...")

      let voiceRecordingUrl: string | undefined

      if (voiceRecording) {
        try {
          console.log("[v0] Processing voice recording...")
          const fileName = `voice-memo-${Date.now()}.webm`
          const audioBlob = new Blob([new Uint8Array(voiceRecording)], { type: "audio/webm" })
          console.log("[v0] Created audio blob, size:", audioBlob.size)

          console.log("[v0] Uploading to Supabase Storage...")
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("voice-recordings")
            .upload(fileName, audioBlob, {
              contentType: "audio/webm",
            })

          if (uploadError) {
            console.error("[v0] Supabase storage upload error:", uploadError)
            throw uploadError
          } else {
            console.log("[v0] Upload successful, getting public URL...")
            // Get public URL for the uploaded file
            const {
              data: { publicUrl },
            } = supabase.storage.from("voice-recordings").getPublicUrl(fileName)

            voiceRecordingUrl = publicUrl
            console.log("[v0] Voice recording uploaded to Supabase:", voiceRecordingUrl)
          }
        } catch (storageError) {
          console.error("[v0] Failed to upload to Supabase Storage:", storageError)
          throw storageError
        }
      }

      console.log("[v0] Preparing form data for database insert...")
      const formData: FormSubmission = {
        name: name || "",
        company: company || "",
        message: message,
        email: email || "",
        voice_recording_url: voiceRecordingUrl,
      }
      console.log("[v0] Form data prepared:", formData)

      console.log("[v0] Inserting into database...")
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("form_submissions")
        .insert([formData])
        .select()
        .single()

      if (supabaseError) {
        console.error("[v0] Supabase database error:", supabaseError)
        console.error("[v0] Error details:", JSON.stringify(supabaseError, null, 2))
        throw supabaseError
      }

      console.log("[v0] Successfully created Supabase record:", supabaseData.id)

      return NextResponse.json({
        success: true,
        recordId: supabaseData.id,
        voiceRecordingUrl,
      })
    } catch (error) {
      console.error("[v0] API error:", error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)

        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          return NextResponse.json(
            {
              error: "Database table 'form_submissions' does not exist. Please run the SQL script to create it.",
            },
            { status: 500 },
          )
        } else if (error.message.includes("bucket") && error.message.includes("not found")) {
          return NextResponse.json(
            {
              error: "Storage bucket 'voice-recordings' does not exist. Please run the SQL script to create it.",
            },
            { status: 500 },
          )
        } else if (error.message.includes("401") || error.message.includes("AUTHENTICATION_REQUIRED")) {
          return NextResponse.json(
            {
              error: "Authentication error - check your Supabase credentials",
            },
            { status: 500 },
          )
        } else if (error.message.includes("404") || error.message.includes("NOT_FOUND")) {
          return NextResponse.json(
            {
              error: "Resource not found - check your Supabase configuration",
            },
            { status: 500 },
          )
        }
      }

      return NextResponse.json(
        {
          error: `API error: ${error instanceof Error ? error.message : "Unknown error"}`,
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
