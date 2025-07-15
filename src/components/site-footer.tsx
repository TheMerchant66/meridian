import Link from "next/link"
import { DollarSign } from "lucide-react"
import ScrollReveal from "@/components/scroll-reveal"
import StaggeredReveal from "@/components/staggered-reveal"

export default function SiteFooter() {
  return (
    <ScrollReveal direction="up" delay={200}>
      <footer className="bg-zinc-900 rounded-t-3xl mx-2 sm:mx-8 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <ScrollReveal direction="left" delay={300} className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4 group">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <DollarSign className="w-5 h-5 text-white transition-colors duration-300 group-hover:text-blue-400" />
                </div>
                <span className="text-lg sm:text-xl text-white transition-colors duration-300 group-hover:text-blue-100">
                  Stellarone<span className="font-semibold"> Holdings</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Modern banking solutions for the digital age.</p>
            </ScrollReveal>

            {[
              {
                title: "Products",
                links: ["Checking", "Savings", "Credit Cards", "Investments"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Security", "Privacy"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Legal"],
              },
            ].map((section, sectionIndex) => (
              <ScrollReveal key={section.title} direction="up" delay={400 + sectionIndex * 100}>
                <div>
                  <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
                  <StaggeredReveal
                    className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base"
                    staggerDelay={50}
                    direction="fade"
                  >
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </StaggeredReveal>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={800}>
            <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
              <p>&copy; 2024 Stellarone Holdings. All rights reserved. Member FDIC.</p>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </ScrollReveal>
  )
}
