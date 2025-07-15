"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  duration?: number
  threshold?: number
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 800,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true })

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out"
    const durationClass = `duration-[${duration}ms]`
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : ""

    if (!isVisible) {
      switch (direction) {
        case "up":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-8`
        case "down":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-y-8`
        case "left":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-x-8`
        case "right":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 -translate-x-8`
        case "fade":
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0`
        default:
          return `${baseClasses} ${durationClass} ${delayClass} opacity-0 translate-y-8`
      }
    }

    return `${baseClasses} ${durationClass} ${delayClass} opacity-100 translate-x-0 translate-y-0`
  }

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  )
}
