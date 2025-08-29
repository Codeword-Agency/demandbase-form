import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import VHSOverlay from "@/components/vhs-overlay"
import CRTScreen from "@/components/crt-effect"

export const metadata: Metadata = {
  title: "66.6FM Horror Hotline",
  description: "Share your worst data horror story for a chance to win prizes, including tickets to NYC Advertising Week.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta property="og:image" content="/socials/og-share.png" />
      <meta property="og:image:alt" content="66.6FM Horror Hotline" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="628" />

      <meta name="twitter:image" content="/socials/og-share.png" />
      <meta name="twitter:image:alt" content="66.6FM Horror Hotline" />
      <meta name="twitter:image:type" content="image/png" />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="628" />
      </head>
      <body>
        <CRTScreen />
        {children}
        <VHSOverlay />
      </body>
    </html>
  )
}
