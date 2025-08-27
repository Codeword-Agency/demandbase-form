import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import VHSOverlay from "@/components/vhs-overlay"
import CRTScreen from "@/components/crt-effect"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <CRTScreen />
        {children}
        <VHSOverlay />
      </body>
    </html>
  )
}
