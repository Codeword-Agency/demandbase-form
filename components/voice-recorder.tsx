"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onRecordingDelete: () => void
}

export default function VoiceRecorder({ onRecordingComplete, onRecordingDelete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      // Use webm with opus codec for better compression
      const options = { mimeType: "audio/webm;codecs=opus" }
      const mediaRecorder = new MediaRecorder(stream, options)

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        setHasRecording(true)
        onRecordingComplete(audioBlob)

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setHasRecording(false)
    setIsPlaying(false)
    setRecordingTime(0)
    onRecordingDelete()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {!isRecording && !hasRecording && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startRecording}
            className="flex items-center gap-2 bg-transparent"
          >
            <Mic className="w-4 h-4" />
            Record Voice Memo
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={stopRecording}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop Recording
            </Button>
            <span className="text-sm text-muted-foreground">{formatTime(recordingTime)}</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}

        {hasRecording && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isPlaying ? pauseRecording : playRecording}
              className="flex items-center gap-2 bg-transparent"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={deleteRecording}
              className="flex items-center gap-2 bg-transparent"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <span className="text-sm text-muted-foreground">Voice memo recorded ({formatTime(recordingTime)})</span>
          </div>
        )}
      </div>

      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}
    </div>
  )
}
