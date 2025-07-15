import { Badge } from "@/components/ui/badge"

interface HeroSectionProps {
  badgeText: string
  badgeIcon?: string
  title: string
  subtitle: string
  description: string
}

export default function HeroSection({ badgeText, badgeIcon = "", title, subtitle, description }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br z-20 from-zinc-900 via-zinc-800 to-zinc-900 pt-8 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 mx-2 sm:mx-5 mb-5 rounded-b-2xl sm:rounded-b-3xl px-4 sm:px-0 lg:px-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <Badge className="mb-3 sm:mb-4 p-2 px-3 bg-zinc-800 text-zinc-200 hover:bg-blue-100 text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 duration-800 hover:scale-105 transition-all duration-300">
            {badgeIcon} {badgeText}
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {title}
            <span className="text-zinc-300 block animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              {subtitle}
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
