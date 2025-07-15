import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, PiggyBank, TrendingUp, Smartphone } from "lucide-react";
import Image from "next/image";
import { BiSolidBank, BiSolidCreditCardAlt } from "react-icons/bi";
import { BsFillShieldLockFill } from "react-icons/bs";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CTASection from "@/components/cta-section";
import ScrollReveal from "@/components/scroll-reveal";
import StaggeredReveal from "@/components/staggered-reveal";

export default function PersonalBankingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-5">
      {/* Header */}
      <SiteHeader currentPage="/personal-banking" />

      {/* Hero Section */}
      <section className="bg-zinc-900 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:px-16 mx-5 mb-5 rounded-b-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal direction="down" delay={200}>
              <Badge className="mb-4 p-2 px-3  bg-zinc-800 text-zinc-200 hover:bg-blue-100">
                💳 Personal Banking Solutions
              </Badge>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 leading-tight">
                Banking Made Simple
                <span className="text-zinc-300 block">
                  For Your Everyday Life
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <p className="mt-6 text-lg sm:text-lg text-zinc-500 max-w-2xl mx-auto">
                From checking accounts to savings goals, we provide
                comprehensive personal banking solutions tailored to your
                lifestyle and financial objectives.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-20 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
                Choose Your Perfect Account
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Whether you're just starting out or managing complex finances,
                we have the right account for you.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-3 gap-8"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <BiSolidBank className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Essential Checking
                </h3>
                <p className="text-gray-600 mb-6">
                  Perfect for everyday banking with no monthly fees and
                  unlimited transactions.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    No monthly maintenance fee
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Free online and mobile banking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Free debit card
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105">
                  Open Account
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <PiggyBank className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  High-Yield Savings
                </h3>
                <p className="text-gray-600 mb-6">
                  Grow your money with competitive interest rates and flexible
                  access.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    4.5% APY on all balances
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    No minimum balance required
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    FDIC insured up to $250,000
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105">
                  Start Saving
                </Button>
              </CardContent>
            </Card>

            <Card className="p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-5">
                <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <BiSolidCreditCardAlt className="w-8 h-8 text-zinc-800" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Premium Banking</h3>
                <p className="text-gray-600 mb-6">
                  Exclusive benefits and personalized service for sophisticated
                  banking needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Dedicated relationship manager
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Premium credit card included
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Waived fees on all services
                  </li>
                </ul>
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all duration-300 hover:scale-105">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" delay={200}>
              <div>
                <h2 className="text-4xl font-semibold text-gray-900 mb-6">
                  Banking Tools That Work For You
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg">
                  Access powerful tools and features designed to make managing
                  your money easier and more efficient.
                </p>

                <StaggeredReveal
                  className="space-y-6"
                  staggerDelay={200}
                  direction="left"
                >
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Mobile Banking
                      </h3>
                      <p className="text-gray-600">
                        Bank anywhere, anytime with our award-winning mobile
                        app.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <BsFillShieldLockFill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Advanced Security
                      </h3>
                      <p className="text-gray-600">
                        Your money is protected with bank-level security and
                        fraud monitoring.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Financial Insights
                      </h3>
                      <p className="text-gray-600">
                        Track spending, set budgets, and achieve your financial
                        goals.
                      </p>
                    </div>
                  </div>
                </StaggeredReveal>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={400}>
              <div className="relative group">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Banking Features"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Experience Better Banking?"
        description="Open your account today and discover why millions trust Meridian Private Holdings with their finances."
        primaryButtonText="Open Account Now"
        secondaryButtonText="Compare Accounts"
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
