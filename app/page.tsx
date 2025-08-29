"use client"

import type React from "react"
import VoiceRecorder from "@/components/voice-recorder"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CardDescription, CardTitle } from "@/components/ui/card"
import Carousel, { CarouselItem } from "@/components/ui/carousel"
import { CornerDownRight } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null)
  const [formValues, setFormValues] = useState({
    name: "",
    company: "",
    email: "",
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
      email: formData.get('email') as string,
      message: formData.get("message") as string,
    }

    try {
      console.log("[v0] Submitting form data:", data)
      console.log("[v0] Voice recording exists:", !!voiceRecording)
      console.log("[v0] Voice recording size:", voiceRecording?.size || 0)

      let voiceRecordingData = null
      if (voiceRecording) {
        console.log("[v0] Converting voice recording to base64...")
        const arrayBuffer = await voiceRecording.arrayBuffer()
        voiceRecordingData = Array.from(new Uint8Array(arrayBuffer))
      }

      console.log("[v0] Submitting to Airtable...")

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          voiceRecording: voiceRecordingData,
        }),
      })

      console.log("[v0] Form submission response status:", response.status)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("[v0] Non-JSON response received:", textResponse)
        throw new Error(`Server returned non-JSON response: ${response.status}`)
      }

      const responseData = await response.json()
      console.log("[v0] Form submission response data:", responseData)

      if (response.ok) {
        setIsSuccess(true)
        setFormValues({ name: "", company: "", email: "", message: "" })
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

  const handleSent = () => {
    let sendGate = document.querySelector('.sent-gate');
    sendGate?.classList.toggle('entered');
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
    <>
    <div className="fw"></div>

    {/* enter gate */}
    <div className="enter-gate">
      <video autoPlay loop muted preload="auto" id="enterGate">
        <source src="/video/gate.mp4" type="video/mp4" />
      </video>
      <div className="enter-wrap">
        <img src="/LOGO-NEW.svg" />
        <p>Haunted by bad data?</p>
        <p>Tell us your horror story</p>
        <Button
          type="enter"
          className={`enter`}
          onClick={ () => {document.querySelector('.enter-gate')?.classList.add('entered')}}
        > Enter
        </Button>
      </div>
    </div>

    {/* messge sent */}
    <div className="sent-gate entered">
      <video autoPlay loop muted preload="auto" id="enterGate">
        <source src="/video/accepted.mp4" type="video/mp4" />
      </video>
      
      <div className="sent-wrap">
        <div className="ex" onClick={handleSent}>
        <svg xmlns='https://www.w3.org/200/svg' width="39" height="38" viewBox="0 0 39 38" fill="none">
        <path d="M9.94946 9.39746L28.6937 28.1417" stroke="white" strokeWidth="2" stroke-lincap="round" strokeLinejoin="round" />
        <path d="M28.6936 9.38965L9.9494 28.1338" stroke="white" strokeWidth="2" stroke-lincap="round" strokeLinejoin="round" />
        </svg>
      </div>
        <h1>Your hit send. You can't take it back</h1>
        <p>Confessions can be costly</p>
        <p>But in this broadcast, they might be rewarded.</p>
      </div>
    </div>

    <div className="site-bg min-h-screen p-4">
      <div className="container">
        {/* Headliner */}
        <div className="headliner">
      <div className="headline-wrap">
          <img src="/LOGO-NEW.svg" />
          <div className="tune-in">
              <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/1yXUDcTJ8KWTYyclJjgmy1?utm_source=generator&theme=0" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        {/* information */}
        <div className="bentos">
          <div className="left">
            <div className="outliner white dj-booth">
              <h1>Tonight's DJ</h1>
              <div className="data-dread"></div>
              <p>Everyone talks about data wins. Data Dread is only interested in talking about the losses. Call in to your favorite on-air exorcist to talk about all things static, panic, and bad data.</p>
            </div>
          </div>
          <div className="right">
            <div className="outliner stories handjet">
              <div className="stories-scroll">
                <h1>Tonight's Show</h1>
              <h2>Data Horror Stories</h2>
              <p>Bad data never sleeps. Neither will you. These aren’t ghost stories from summer camp. These are real-life stories of when bad data caused chaos: campaigns that failed, forecasts that collapsed, signals that went nowhere. Everyone has one of these stories, and we’re giving you a place to tell it. Call in. Rage out.</p> 
              </div>
            </div>
          </div>
        </div>

        {/* form */}
      <div className="w-full forms handjet">
          <CardTitle className="title">Caller, you're next</CardTitle>
          <CardDescription className="description">
            <p>Not every nightmare happens at night. Some happen in dashboards. Some bleed into forecasts. Some poison entire campaigns. Every marketer has a data horror story. Tell us yours:</p>
          <p>Tell us your worst data horror story for a chance to win prizes, including tickets to NYC Advertising Week.</p>
          </CardDescription>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2 input">
              <Label className="visually-hidden" htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name (Optional)"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 input">
              <Label className="visually-hidden" htmlFor="company visually-hidden">Company (Optional)</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Company (Optional)"
                value={formValues.company}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 textarea">
              <Label className="visually-hidden" htmlFor="message visually-hidden">Message *</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Confess here"
                required
                rows={4}
                value={formValues.message}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 email">
              <Label className="visually-hidden" htmlFor="company visually-hidden">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email (Required to enter giveaway)"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="button-wrap">
              <div className="space-y-2 voice">
                <Label>Voice Memo (Optional)</Label>
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} onRecordingDelete={handleRecordingDelete} />
              </div>
              <div className="space-y-2 button">
                <Label>&nbsp;</Label>
              <Button
                type="submit"
                className={`w-full  ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
                disabled={isSubmitting}
              ><CornerDownRight />
                {isSuccess ? handleSent() : ""}
                {isSubmitting ? "Submitting..." : isSuccess ? "Sent" : "Share your nightmare"}
              </Button>
              </div>
            </div>
          </form>
      </div>
        <div className="bentos">
          <div className="left-half">
            <div className="outliner">
              <h1>Live studio Feed</h1>
              <p>Watch the horror unfold in real time.</p>
              <video autoPlay loop muted preload="auto" id="studioFeed">
                <source src="/video/feed.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="right-half">
            <div className="outliner">
              <h1>Past Callers <span className="  ">(RIP)</span></h1>
              <p>Only survivors tell their story…</p>
               <Carousel>
              <CarouselItem>
                <div className="leaky-lead-linda"></div>
                    <p>“Our CRM wasn't a database; it was a graveyard full of ghost leads and dead-end accounts. My job was to haunt it, looking for a sign of life.”</p>
                    <p className="auth">Leaky-Lead Linda</p>
              </CarouselItem>

              <CarouselItem>
                <div className="failed-ad-frank"></div>
                    <p>“They asked why the campaign failed. I knew the answer. I’d trusted dirty data, and it betrayed me in front of everyone.”</p>
                    <p className="auth">Failed-Ad Frank</p>
              </CarouselItem>

              <CarouselItem>
                <div className="no-click-nick"></div>
                    <p>“The sales team said my leads were garbage. I checked the source: a three-year-old spreadsheet I found on a shared drive. I didn't generate leads—I disturbed a tomb.”</p>
                    <p className="auth">No-Click Nick</p>
              </CarouselItem>
              
            </Carousel>
            </div>
          </div>
        </div>

        <div className="socials">
          <div className="socials-wrap">
            <a href="https://www.demandbase.com/" target="_blank">
            <img src="/socials/website-button.png" />
            </a>

            <a href="https://x.com/Demandbase/" target="_blank">
            <img src="/socials/x-button.png" />
            </a>

             <a href="https://www.linkedin.com/company/demandbase/" target="_blank">
            <img src="/socials/linkedin-button.png" />
            </a>

            <a href="https://www.instagram.com/demandbase/" target="_blank">
            <img src="/socials/IG-button.png" />
            </a>
          </div>

          <div className="main-logo">
            <p>Conjured by</p>
            <p><a href="https://www.demandbase.com/" target="_blank"><img src="/socials/demandbase_full_neon.png" /></a></p>
          </div>
        </div>


      </div>
    </div>
    <div className="bg"></div>
    </>
  )
}
