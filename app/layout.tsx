import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from 'next/script'
import VHSOverlay from "@/components/vhs-overlay"
import CRTScreen from "@/components/crt-effect"

export const metadata: Metadata = {
  title: "66.6FM Horror Hotline",
  description: "Demandbase presents 66.6FM Live. Tune into Data Horror Stories and share your own as B2B marketers confront the nightmares that keep coming back.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/png" href="/socials/favicon.png" />
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
<Script async src="https://www.googletagmanager.com/gtag/js?id=G-YZM91Z07CT"></Script>
<Script id="google-analytics">
  {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-YZM91Z07CT');
  `}
</Script>
      <body>
        <CRTScreen />
        {children}
        <VHSOverlay />
      </body>
    </html>
  )
}
