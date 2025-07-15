"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { useState, useEffect } from "react"
import PageLoader from "@/components/page-loader"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <body className={inter.className}>
      <PageLoader isLoading={isLoading} onComplete={() => setIsLoading(false)} />
      {!isLoading && children}
    </body>
  )
}
