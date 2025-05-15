import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bugün Ne Yapsam AI",
  description: "Yapay zeka destekli tarif asistanınız",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Puter.js script */}
        <Script
          src="https://js.puter.com/v2/"
          strategy="beforeInteractive"
          onError={() => console.error("Puter.js yüklenemedi")}
          onLoad={() => console.log("Puter.js başarıyla yüklendi")}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
