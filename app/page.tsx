"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    }

    try {
      console.log("[v0] Submitting form data:", data)
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("[v0] Response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] Response data:", responseData)

      if (response.ok) {
        setIsSuccess(true)
        e.currentTarget.reset()

        setTimeout(() => {
          setIsSuccess(false)
        }, 3000)
      } else {
        console.error("[v0] Server error:", responseData.error || "Failed to submit message")
      }
    } catch (error) {
      console.error("[v0] Client error:", error)
    } finally {
      setIsSubmitting(false)
    }
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
              <Input id="name" name="name" type="text" placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" name="company" type="text" placeholder="Your company" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" name="message" placeholder="Your message..." required rows={4} />
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
