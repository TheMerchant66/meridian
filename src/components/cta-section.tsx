"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"

interface CTASectionProps {
  title: string
  description: string
  primaryButtonText: string
  secondaryButtonText?: string
  primaryButtonIcon?: React.ReactNode
  secondaryButtonIcon?: React.ReactNode
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export default function CTASection({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonIcon = (
    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
  ),
  secondaryButtonIcon,
  onPrimaryClick,
  onSecondaryClick,
}: CTASectionProps) {
  return (
    <ScrollReveal direction="up" delay={200}>
      <section className="py-12 sm:py-16 lg:py-20 mx-4 sm:mx-8 lg:mx-32 rounded-2xl sm:rounded-3xl my-8 sm:my-12 lg:my-15 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up" delay={300}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3 sm:mb-4 leading-tight">
              {title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={500}>
            <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={700}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-3 text-sm sm:text-base w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                onClick={onPrimaryClick}
              >
                {primaryButtonText}
                {primaryButtonIcon}
              </Button>
              {secondaryButtonText && (
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-3 text-sm sm:text-base w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  onClick={onSecondaryClick}
                >
                  {secondaryButtonText}
                  {secondaryButtonIcon}
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </ScrollReveal>
  )
}
