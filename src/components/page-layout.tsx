import type { ReactNode } from "react"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

interface PageLayoutProps {
  children: ReactNode
  currentPage: string
}

export default function PageLayout({ children, currentPage }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-3 sm:pt-5">
      <SiteHeader currentPage={currentPage} />
      {children}
      <SiteFooter />
    </div>
  )
}
