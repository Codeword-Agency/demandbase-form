"use client"

import type React from "react"
import VoiceRecorder from "@/components/voice-recorder"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null)
  const [formValues, setFormValues] = useState({
    name: "",
    company: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
      hasVoiceRecording: voiceRecording !== null,
    }

    try {
      console.log("[v0] Submitting form data:", data)
      console.log("[v0] Voice recording exists:", !!voiceRecording)
      console.log("[v0] Voice recording size:", voiceRecording?.size || 0)

      let voiceFileId = null
      let voiceFileUrl = null

      if (voiceRecording) {
        console.log("[v0] Starting audio upload process...")

        const audioFormData = new FormData()
        audioFormData.append("audio", voiceRecording, `voice-memo-${Date.now()}.webm`)
        audioFormData.append("name", data.name || "Anonymous")
        audioFormData.append("company", data.company || "N/A")

        console.log("[v0] Audio FormData prepared, making upload request...")

        try {
          const audioResponse = await fetch("/api/upload-audio", {
            method: "POST",
            body: audioFormData,
          })

          console.log("[v0] Audio upload response status:", audioResponse.status)

          if (audioResponse.ok) {
            const audioResult = await audioResponse.json()
            console.log("[v0] Audio upload successful:", audioResult)
            voiceFileId = audioResult.fileId
            voiceFileUrl = audioResult.webViewLink
          } else {
            const errorData = await audioResponse.json()
            console.error("[v0] Audio upload failed:", errorData)
            alert(`Audio upload failed: ${errorData.error || "Unknown error"}`)
          }
        } catch (audioError) {
          console.error("[v0] Audio upload request failed:", audioError)
          alert(`Audio upload request failed: ${audioError}`)
        }
      }

      console.log("[v0] Proceeding with form submission...")
      console.log("[v0] Voice file ID:", voiceFileId)
      console.log("[v0] Voice file URL:", voiceFileUrl)

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          voiceFileId,
          voiceFileUrl,
        }),
      })

      console.log("[v0] Form submission response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Form submission response data:", responseData)

      if (response.ok) {
        setIsSuccess(true)
        setFormValues({ name: "", company: "", message: "" })
        setVoiceRecording(null)

        setTimeout(() => {
          setIsSuccess(false)
        }, 3000)
      } else {
        console.error("[v0] Form submission server error:", responseData.error || "Failed to submit message")
        alert(`Form submission failed: ${responseData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("[v0] Client error:", error)
      alert(`Submission failed: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecordingComplete = (audioBlob: Blob) => {
    setVoiceRecording(audioBlob)
  }

  const handleRecordingDelete = () => {
    setVoiceRecording(null)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Send us a message and we'll get back to you soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Your company"
                value={formValues.company}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message..."
                required
                rows={4}
                value={formValues.message}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Voice Memo (Optional)</Label>
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} onRecordingDelete={handleRecordingDelete} />
            </div>

            <Button
              type="submit"
              className={`w-full ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : isSuccess ? "Sent" : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
