import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from 'next/script'

export const metadata: Metadata = {
  title: "66.6FM Horror Hotline",
  description: "Something is out there, hiding in your dashboards. It’s hungry and waiting for you to confess. Share your Data Horror Stories on 66.6FM Live. The last voice you hear may be your own.",
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
      <meta property="og:title" content="66.6FM Horror Hotline" />
      <meta property="og:description" content="Something is out there, hiding in your dashboards. It’s hungry and waiting for you to confess. Share your Data Horror Stories on 66.6FM Live. The last voice you hear may be your own." />
      <meta property="og:image" content="https://666fm.live/socials/og-share.png" />
      <meta property="og:image:alt" content="66.6FM Horror Hotline" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="628" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="66.6FM Horror Hotline" />
      <meta name="twitter:description" content="Something is out there, hiding in your dashboards. It’s hungry and waiting for you to confess. Share your Data Horror Stories on 66.6FM Live. The last voice you hear may be your own." />
      <meta name="twitter:image" content="https://666fm.live/socials/og-share.png" />
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
        {children}
      </body>
    </html>
  )
}
