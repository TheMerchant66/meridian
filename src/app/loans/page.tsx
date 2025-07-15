import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, Car, Calculator } from "lucide-react"
import { TbBriefcase2Filled } from "react-icons/tb"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CTASection from "@/components/cta-section"
import HeroSection from "@/components/hero-section"

export default function LoansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-5">
      {/* Header */}
      <SiteHeader currentPage="/loans" />

      {/* Hero Section */}
      <HeroSection
        badgeText="Competitive Loan Rates"
        badgeIcon="💰"
        title="Loans That Fit"
        subtitle="Your Life Goals"
        description="From home purchases to personal projects, we offer competitive rates and flexible terms to help you achieve your dreams with confidence."
      />

      {/* Loan Types Section */}
      <section className="py-20 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Loan Solutions for Every Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're buying a home, financing education, or consolidating debt, we have the right loan product
              with competitive rates and terms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Home Loans</h3>
                <p className="text-gray-600 mb-6">
                  Make homeownership a reality with our competitive mortgage rates and flexible terms.
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-zinc-900">Starting at 6.25% APR</div>
                  <div className="text-sm text-gray-500">30-year fixed rate</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    No origination fees
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Fast pre-approval
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Local loan specialists
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">Apply Now</Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <Car className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Auto Loans</h3>
                <p className="text-gray-600 mb-6">
                  Drive away with confidence with our low-rate auto financing for new and used vehicles.
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-zinc-900">Starting at 4.99% APR</div>
                  <div className="text-sm text-gray-500">New vehicles, 60 months</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Up to 100% financing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Same-day approval
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Refinancing available
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">Get Pre-Approved</Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <TbBriefcase2Filled className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Personal Loans</h3>
                <p className="text-gray-600 mb-6">
                  Flexible personal loans for debt consolidation, home improvements, or major purchases.
                </p>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-zinc-900">Starting at 7.99% APR</div>
                  <div className="text-sm text-gray-500">Fixed rate, up to 7 years</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    No collateral required
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Fixed monthly payments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Quick online application
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">Check Your Rate</Button>
              </CardContent>
            </Card>

            {/* Additional loan cards would go here */}
          </div>
        </div>
      </section>

      {/* Loan Process Section */}
      <section className="py-20 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">Simple Application Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting approved for your loan is easier than ever with our streamlined digital process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply Online</h3>
              <p className="text-gray-600">
                Complete our secure online application in just minutes with your basic information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Approved</h3>
              <p className="text-gray-600">
                Receive a decision quickly, often within the same business day for most loan types.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Receive Funds</h3>
              <p className="text-gray-600">Once approved, funds are typically available within 1-3 business days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Apply for Your Loan?"
        description="Take the first step towards achieving your goals. Our loan specialists are here to help you find the perfect solution."
        primaryButtonText="Start Application"
        secondaryButtonText="Calculate Payments"
        secondaryButtonIcon={<Calculator className="ml-2 w-5 h-5" />}
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
