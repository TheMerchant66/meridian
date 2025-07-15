"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { type ReactNode, Children, cloneElement, isValidElement, type ReactElement } from "react"

interface StaggeredRevealProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  duration?: number
  threshold?: number
}

interface ChildProps {
  className?: string
  [key: string]: any
}

export default function StaggeredReveal({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
  duration = 600,
  threshold = 0.1,
}: StaggeredRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true })

  const getAnimationClasses = (index: number) => {
    const baseClasses = "transition-all ease-out"
    const durationClass = `duration-[${duration}ms]`
    const delayClass = `delay-[${index * staggerDelay}ms]`

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
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          const element = child as ReactElement<ChildProps>
          const props = { ...element.props } as ChildProps
          return cloneElement(element, {
            ...props,
            className: `${props.className || ""} ${getAnimationClasses(index)}`,
          })
        }
        return child
      })}
    </div>
  )
}
