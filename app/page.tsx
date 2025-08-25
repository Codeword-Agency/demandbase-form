"use client"

import type React from "react"
import VoiceRecorder from "@/components/voice-recorder"
import FloatingImages from "@/components/floating-images"
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
    <>
    <div className="fw"></div>
    <div className="bg"></div>
    <FloatingImages />
    <div className="site-bg min-h-screen p-4">
      

      <div className="container">
        {/* Headliner */}
        <div className="headliner">
          <div className="logo">
            <svg viewBox="0 0 666 75" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M582.374 74.7861C572.993 74.7861 565.223 71.5529 559.675 65.479V49.5991C565.828 56.8838 574.104 61.2346 583.285 61.2346C589.645 61.2346 593.477 58.201 593.477 53.5441C593.477 50.1047 591.262 47.7763 586.618 45.8536L574.51 40.6978C565.329 36.7528 560.885 30.4793 560.885 21.9905C560.879 9.44358 571.17 0.94812 585.194 0.94812C593.67 0.94812 600.529 3.37634 606.183 7.92677V23.3011C601.134 17.7395 592.359 14.2002 585.607 14.2002C579.852 14.2002 576.519 16.7283 576.519 20.8795C576.519 24.0129 578.236 26.1418 582.773 27.9646L595.386 32.9208C604.467 36.3603 609.104 43.0329 609.104 52.2335C609.104 66.1975 598.506 74.7927 582.367 74.7927H582.374V74.7861Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M619.802 73.2693V64.8737V10.7608V2.46497H665.406V15.7171H652.187H634.531V30.2798H649.366H659.757V43.4254H649.26H634.531V60.0172H650.677H665.406V73.2693H619.802Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M71.5351 73.2693V64.8737V10.7542V2.46497H117.146V15.7171H103.927H86.2707V30.2798H101.1H111.498V43.4254H101.006H86.2707V60.0172H102.41H117.146V73.2693H71.5351Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M284.74 73.2693V64.8737V2.46497H298.963L330.849 48.7942V10.7608V2.46497H344.973V10.8606V73.2693H330.849L298.963 27.1464V64.9734V73.2693H284.74Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M235.47 57.6954H257.018L258.828 62.8512C259.313 64.2616 259.779 65.6587 260.245 67.0491C260.943 69.138 261.635 71.2003 262.36 73.2693H278.4C277.216 70.3288 276.085 67.3285 274.974 64.3681C274.674 63.5564 274.368 62.7515 274.062 61.9465L250.858 2.46497H235.623L212.725 61.3344C211.913 63.3036 211.135 65.2994 210.35 67.3019C209.571 69.2977 208.786 71.3001 207.975 73.2693H223.921L227.254 63.3568L229.17 57.6888L233.707 44.6429L243.087 17.4268L252.568 44.6429H248.163C242.988 44.6429 238.424 48.0224 236.907 52.9853L235.47 57.6888H235.477L235.47 57.6954Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M512.807 57.6954H534.348L536.157 62.8512C536.643 64.2616 537.109 65.6587 537.574 67.0491C538.273 69.138 538.965 71.2003 539.69 73.2693H555.73C554.545 70.3288 553.414 67.3285 552.303 64.3681C552.004 63.5564 551.698 62.7515 551.392 61.9465L528.188 2.46497H512.953L490.054 61.3344C489.243 63.3036 488.464 65.2994 487.679 67.3019C486.901 69.2977 486.116 71.3001 485.304 73.2693H501.251L504.584 63.3568L506.5 57.6888L511.037 44.6429L520.417 17.4268L529.897 44.6429H525.493C520.317 44.6429 515.754 48.0224 514.237 52.9853L512.8 57.6888H512.807V57.6954Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M128.03 73.2693V64.8737V10.7608V2.46497H140.949L164.553 36.7528L188.17 2.46497H200.983V10.8606V64.9734V73.2693H187.059V64.0687V26.9401L164.553 60.8288L141.954 26.9401V64.9734V73.2693H128.03Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M386.492 2.46497H360.055V73.2627H386.492C406.47 73.2627 422.716 60.7224 422.716 37.8572C422.716 14.9919 406.47 2.45166 386.492 2.45166V2.46497ZM385.887 60.2168H374.79V15.5175H385.887C397.19 15.5175 407.382 22.8022 407.382 37.8705C407.382 52.9388 397.19 60.2234 385.887 60.2234" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M467.262 35.5353C476.21 34.4177 480.734 27.133 480.734 19.6554C480.734 8.9313 473.197 2.45825 459.625 2.45825H431.578V73.2693H459.419C474.494 73.2693 483.043 65.1796 483.043 52.3267C483.043 43.5252 477.115 36.653 467.262 35.5353ZM446.36 13.6813H456.106C462.439 13.6813 465.553 17.0209 465.553 22.1768C465.553 27.3326 462.439 30.5791 455.906 30.5791H446.36V13.6813ZM457.21 61.2279H446.353V41.9086H457.104C463.637 41.9086 468.061 45.4478 468.061 51.6215C468.061 57.7952 463.736 61.2346 457.204 61.2346L457.21 61.2279Z" fill="#FF7C33"/>
<path fillRule="evenodd" clipRule="evenodd" d="M0.138611 2.46497H26.2969C46.062 2.46497 62.1348 15.0052 62.1348 37.8705C62.1348 60.7357 46.062 73.276 26.2969 73.276H0.138611V36.999C0.138611 28.8428 6.66488 22.23 14.708 22.23V60.2168H25.6849C36.868 60.2168 46.9468 52.9321 46.9468 37.8638C46.9468 22.7955 36.8613 15.5108 25.6849 15.5108H13.0049C5.90648 15.5108 0.138611 9.66981 0.138611 2.46497Z" fill="#FF7C33"/>
</svg>
          </div>
          <div className="handjet sub-head">Horror Hotline</div>
        </div>

        {/* information */}
        <div className="bentos">
          <div className="left">
            <div className="outliner white dj-booth">
              <img src="https://media.tenor.com/on6WFzYlLJcAAAAM/pokemon-cute.gif" />
            </div>
            <div className="outliner tune-in">
              player goes here
            </div>
          </div>
          <div className="right">
            <div className="outliner stories handjet">
              <div className="stories-scroll">
              <h2>Data Horror Stories</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis tellus vitae condimentum imperdiet. Aenean mauris lacus, rutrum vel aliquam eget, volutpat eget velit. Quisque malesuada pulvinar odio, id interdum mauris rutrum eget. Morbi id iaculis ligula. Fusce a consequat augue. Pellentesque mi tellus, finibus sit amet odio non, luctus efficitur massa. Etiam eget augue id magna fermentum rhoncus at eu augue. Cras pretium nulla in nisl tristique, ut tincidunt eros pulvinar. Ut elementum est viverra arcu ultrices bibendum. Ut euismod luctus iaculis. Curabitur dignissim sapien nec felis fermentum, eu consequat mauris tincidunt. Phasellus enim lorem, bibendum sed vehicula quis, consequat at lorem. Nullam mattis nisl in aliquet vulputate.</p>
              <p>Maecenas suscipit sagittis sagittis. Suspendisse lectus nunc, ullamcorper a sem quis, euismod dignissim massa. Nullam eu nisi molestie metus auctor semper. Curabitur volutpat est id rutrum dapibus. Etiam elementum vestibulum nisi sit amet interdum. Nullam porttitor enim quam, ac consequat augue euismod a. Nam id tincidunt ipsum, ac dignissim ligula.</p>
              <p>Donec auctor vel libero ac mollis. Integer eleifend sagittis lorem, sit amet convallis eros. Aliquam vitae ante lacinia, placerat nibh maximus, malesuada ante. Fusce sollicitudin lacinia molestie. Pellentesque id erat molestie, tincidunt dui ut, euismod sem. Donec convallis nisl ac risus imperdiet, sed feugiat mi pulvinar. Proin ac porttitor lectus, non malesuada nibh. Fusce at arcu vel tortor lacinia vehicula. Donec luctus magna eu pharetra tempor. Etiam vel nibh sed odio accumsan commodo. Cras quis scelerisque enim, commodo condimentum nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit elit augue, nec volutpat turpis congue nec.</p>
              </div>
            </div>
          </div>
        </div>

        {/* form */}
      <div className="w-full forms handjet">
          <CardTitle className="title">Caller, you're next on the request line</CardTitle>
          <CardDescription className="description"><p>Let us know who you are os we can give you a shout-out on air.</p>
          <p>Feel free to stay anonymous for some extra mystique.</p></CardDescription>
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
                placeholder="Your horror story..."
                required
                rows={4}
                value={formValues.message}
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
              >
                {isSubmitting ? "Submitting..." : isSuccess ? "Sent" : "Send Message"}
              </Button>
              </div>
            </div>
          </form>
      </div>
      </div>
    </div>
    </>
  )
}
