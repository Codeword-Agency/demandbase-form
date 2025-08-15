"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GoogleAuthProps {
  onAuthSuccess: () => void
}

export default function GoogleAuth({ onAuthSuccess }: GoogleAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status")
      if (response.ok) {
        const { authenticated } = await response.json()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          onAuthSuccess()
        }
      }
    } catch (error) {
      console.error("Auth status check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Checking authentication...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Don't render anything if authenticated
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Google Authentication Required</CardTitle>
          <CardDescription>
            To submit forms with voice recordings, you need to authenticate with Google to access Drive and Sheets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleAuth} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
