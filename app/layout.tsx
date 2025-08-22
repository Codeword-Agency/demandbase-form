import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import VHSOverlay from "@/components/vhs-overlay"

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
        {children}
        <VHSOverlay />
      </body>
    </html>
  )
}
