"use client"

import { useEffect, useState } from "react"
import { DollarSign } from "lucide-react"

interface PageLoaderProps {
  isLoading?: boolean
  onComplete?: () => void
}

export default function PageLoader({ isLoading = true, onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) return

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setIsVisible(false)
            onComplete?.()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isLoading, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center animate-spin">
            <DollarSign className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl text-white animate-pulse">
            Stellarone<span className="font-semibold"> Holdings</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-zinc-700 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-zinc-400 text-sm animate-pulse">Loading your banking experience...</p>
      </div>
    </div>
  )
}
