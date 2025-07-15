import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, PieChart, BarChart3, Target } from "lucide-react";
import Image from "next/image";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CTASection from "@/components/cta-section";

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-5">
      {/* Header */}
      <SiteHeader currentPage="/investments" />

      {/* Hero Section */}
      <section className="bg-zinc-900 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:px-16 mx-5 mb-5 rounded-b-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 p-2 px-3 bg-zinc-800 text-zinc-200 hover:bg-blue-100">
              📈 Investment Solutions
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 leading-tight">
              Grow Your Wealth
              <span className="text-zinc-300 block">With Smart Investing</span>
            </h1>
            <p className="mt-6 text-lg sm:text-lg text-zinc-500 max-w-2xl mx-auto">
              Build your financial future with our comprehensive investment
              platform. From beginner-friendly portfolios to advanced trading
              tools, we have everything you need.
            </p>
          </div>
        </div>
      </section>

      {/* Investment Options Section */}
      <section className="py-20 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
              Investment Options for Every Goal
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're saving for retirement, building wealth, or planning
              for major life events, we have the right investment solution for
              you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <PieChart className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Managed Portfolios
                </h3>
                <p className="text-gray-600 mb-6">
                  Professionally managed, diversified portfolios tailored to
                  your risk tolerance.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Expert portfolio management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Automatic rebalancing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Low management fees
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                  Start Investing
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Self-Directed Trading
                </h3>
                <p className="text-gray-600 mb-6">
                  Take control with our advanced trading platform and research
                  tools.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Commission-free stock trades
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Advanced charting tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Real-time market data
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                  Open Trading Account
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-2xl duration-500 transition-colors">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Retirement Planning
                </h3>
                <p className="text-gray-600 mb-6">
                  Secure your future with IRAs and 401(k) rollover options.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Traditional & Roth IRAs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    401(k) rollover assistance
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Retirement planning tools
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl">
                  Plan for Retirement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section className="py-20 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                Award-Winning Investment Platform
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg">
                Our investment platform has been recognized for its performance,
                user experience, and comprehensive features by leading financial
                publications.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-zinc-900">8.2%</div>
                  <div className="text-gray-600 text-sm">
                    Average Annual Return
                  </div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-zinc-900">0.25%</div>
                  <div className="text-gray-600 text-sm">Management Fee</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-zinc-900">$0</div>
                  <div className="text-gray-600 text-sm">Account Minimum</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-zinc-900">24/7</div>
                  <div className="text-gray-600 text-sm">Market Access</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Investment Dashboard"
                width={600}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Start Building Your Investment Portfolio Today"
        description="Join thousands of investors who trust Meridian Private Holdings to help them achieve their financial goals."
        primaryButtonText="Open Investment Account"
        secondaryButtonText="Schedule Consultation"
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
