import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import "./globals.css"

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lincoln Wellness Assistant",
  description: "Your path to financial confidence starts here",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} font-sans antialiased`}>{children}</body>
    </html>
  )
}
