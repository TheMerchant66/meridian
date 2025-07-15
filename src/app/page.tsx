import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, ArrowRight, User } from "lucide-react"
import Image from "next/image"
import { IoFlash } from "react-icons/io5"
import { BsFillShieldLockFill } from "react-icons/bs"
import { FaMobile } from "react-icons/fa6"
import { BiSolidBank, BiSolidCreditCardAlt } from "react-icons/bi"
import { TbBriefcase2Filled } from "react-icons/tb"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import CTASection from "@/components/cta-section"
import ScrollReveal from "@/components/scroll-reveal"
import StaggeredReveal from "@/components/staggered-reveal"
import Link from "next/link"

export default function BankingLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-3 sm:pt-5">
      {/* Header */}
      <SiteHeader currentPage="/" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 pt-8 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 mx-2 sm:mx-5 mb-5 rounded-b-2xl sm:rounded-b-3xl px-4 sm:px-0 lg:px-16 relative overflow-hidden">
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <ScrollReveal direction="down" delay={200}>
                <Badge className="mb-3 sm:mb-4 p-2 px-3 bg-zinc-800 text-zinc-200 hover:bg-blue-100 text-xs sm:text-sm hover:scale-105 transition-all duration-300">
                  🎉 New: Mobile App 2.0 Now Available
                </Badge>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={400}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-zinc-100 leading-tight">
                  Experience the Convenience of
                  <span className="text-zinc-300 block"> Online Banking</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={600}>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Experience the future of banking with our award-winning platform. Manage your finances, transfer
                  money, and invest with confidence.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={800}>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-zinc-800 hover:bg-zinc-700 rounded-2xl sm:rounded-3xl px-5 py-3 w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  >
                    Open Account
                    <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    className="bg-zinc-300 hover:bg-zinc-200 text-zinc-900 rounded-2xl sm:rounded-3xl px-5 py-3 w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Learn more
                  </Button>
                </div>
              </ScrollReveal>

              <StaggeredReveal
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500"
                staggerDelay={150}
                direction="fade"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  FDIC Insured
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  256-bit SSL
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" />
                  24/7 Support
                </div>
              </StaggeredReveal>
            </div>

            <ScrollReveal direction="right" delay={300} className="relative order-1 lg:order-2">
              <div className="relative z-10 group">
                <Image
                  src="/images/hero-cards.png"
                  alt="Banking App Interface"
                  width={650}
                  height={600}
                  className="mx-auto rounded-xl sm:rounded-2xl  w-full max-w-sm sm:max-w-md lg:max-w-lg transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl sm:rounded-2xl blur-3xl opacity-20 transform rotate-6 animate-pulse"></div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <ScrollReveal direction="up" delay={200}>
        <section className="py-8 sm:py-12 lg:py-14 mx-4 sm:mx-8 lg:mx-32 rounded-2xl sm:rounded-3xl mt-6 sm:mt-10 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <StaggeredReveal
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center"
              staggerDelay={200}
              direction="up"
            >
              <div className="hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">2M+</div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">Active Users</div>
              </div>
              <div className="hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">$50B+</div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">Transactions</div>
              </div>
              <div className="hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">99.9%</div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">Uptime</div>
              </div>
              <div className="hover:scale-110 transition-transform duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">4.9★</div>
                <div className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">App Rating</div>
              </div>
            </StaggeredReveal>
          </div>
        </section>
      </ScrollReveal>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4 max-w-2xl leading-tight">
                Loans and Investment opportunities
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
                From everyday banking to investment management, we've got you covered with cutting-edge features.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-4 sm:p-6 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-pink-50 min-h-[400px] sm:h-[470px] rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5 h-full flex flex-col justify-between">
                <div className="w-14 h-14 sm:w-17 sm:h-17 bg-zinc-100 rounded-3xl sm:rounded-4xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <FaMobile className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 leading-tight">
                    Access our full-suite banking services
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
                    Bank on-the-go with our award-winning mobile app. Available for iOS and Android.
                  </p>
                  <Button
                    size="lg"
                    className="bg-transparent text-zinc-900 border-2 border-zinc-500 hover:bg-zinc-800 hover:text-white rounded-xl px-3 py-2.5 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:scale-105 group/btn"
                  >
                    Open Account
                    <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 border-zinc-100 hover:bg-gradient-to-tl hover:from-white hover:to-blue-50 min-h-[400px] sm:h-[470px] rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5 h-full flex flex-col justify-between">
                <div className="w-14 h-14 sm:w-17 sm:h-17 bg-zinc-100 rounded-3xl sm:rounded-4xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <BsFillShieldLockFill className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 leading-tight">
                    We Handle your finances securely
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
                    Bank-level security with 256-bit encryption and fraud monitoring to keep your money safe.
                  </p>
                  <Button
                    size="lg"
                    className="bg-transparent text-zinc-900 border-2 border-zinc-500 hover:bg-zinc-800 hover:text-white rounded-xl px-3 py-2.5 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:scale-105 group/btn"
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 border-zinc-100 hover:bg-gradient-to-tr hover:from-white hover:to-yellow-50 min-h-[400px] sm:h-[470px] rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group md:col-span-2 lg:col-span-1">
              <CardContent className="py-3 sm:py-5 h-full flex flex-col justify-between">
                <div className="w-14 h-14 sm:w-17 sm:h-17 bg-zinc-100 rounded-3xl sm:rounded-4xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <IoFlash className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 leading-tight">
                    Our Transfers are lightning Fast
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">
                    Instant transfers and real-time notifications keep you in control of your money.
                  </p>
                  <Button
                    size="lg"
                    className="bg-transparent text-zinc-900 border-2 border-zinc-500 hover:bg-zinc-800 hover:text-white rounded-xl px-3 py-2.5 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 hover:scale-105 group/btn"
                  >
                    Try Now
                    <ArrowRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

        {/* Loans Section */}
        <section id="loans" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Flexible Loan Solutions for Every Need
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                Whether you're buying a home, starting a business, or consolidating debt, we offer competitive rates and
                personalized loan options to help you achieve your financial goals.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">Home Loans</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                  Competitive mortgage rates starting from 3.2% APR. First-time buyer programs available.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Up to $2M loan amount
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    30-year fixed rates
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No prepayment penalties
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">Business Loans</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                  Fuel your business growth with flexible financing options from $10K to $5M.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Fast approval process
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Competitive rates from 4.5%
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Flexible repayment terms
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 sm:p-8 border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group md:col-span-2 lg:col-span-1">
              <CardContent className="py-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">Personal Loans</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                  Consolidate debt, fund major purchases, or cover unexpected expenses.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    $1K - $100K loan amounts
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Fixed rates from 5.99%
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Same-day funding available
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggeredReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="text-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                Ready to Apply for a Loan?
              </h3>
              <p className="text-zinc-300 mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Get pre-approved in minutes with our simple online application. No hidden fees, transparent terms, and
                personalized rates based on your credit profile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/loan-application"> <Button
                  size="lg"
                  className="bg-white hover:bg-gray-100 text-zinc-900 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group w-full sm:w-auto"
                >
                  Apply for Loan
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                </Link>
               
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-zinc-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Affordable application fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Quick approval
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Competitive rates
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <ScrollReveal direction="left" delay={200} className="relative order-2 lg:order-1">
              <div className="group">
                <Image
                  src="/images/vault.png"
                  alt="Security Features"
                  width={500}
                  height={500}
                  className="rounded-xl sm:rounded-2xl mx-auto  transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>

            <div className="order-1 lg:order-2">
              <ScrollReveal direction="right" delay={200}>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold max-w-lg text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Browse our set of banking services and offerings
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={400}>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-lg text-sm sm:text-base leading-relaxed">
                  We offer a variety of tools and resources to help you manage your finances more effectively and
                  achieve your financial goals.
                </p>
              </ScrollReveal>

              <StaggeredReveal className="flex flex-col sm:flex-row gap-3 sm:gap-4" staggerDelay={200} direction="up">
                <div className="flex flex-col items-center border rounded-xl py-4 px-3 sm:px-4 bg-zinc-900 flex-1 transition-all duration-300 hover:scale-105 hover:bg-zinc-800 group">
                  <BiSolidBank className="w-7 h-7 sm:w-9 sm:h-9 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="mx-auto mt-3">
                    <h3 className="font-semibold text-sm sm:text-lg text-center text-zinc-100 leading-tight">
                      Checking Accounts
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-4 mt-2 text-center">
                      Secure and convenient banking
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center border rounded-xl py-4 px-3 sm:px-4 bg-zinc-900 flex-1 transition-all duration-300 hover:scale-105 hover:bg-zinc-800 group">
                  <BiSolidCreditCardAlt className="w-7 h-7 sm:w-9 sm:h-9 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="mx-auto mt-3">
                    <h3 className="font-semibold text-sm sm:text-lg text-center text-zinc-100 leading-tight">
                      Credit/Debit Cards
                    </h3>
                    <p className="text-xs sm:text-sm leading-4 mt-2 text-zinc-400 text-center">Contactless payments</p>
                  </div>
                </div>

                <div className="flex flex-col items-center border rounded-xl py-4 px-3 sm:px-4 bg-zinc-900 flex-1 transition-all duration-300 hover:scale-105 hover:bg-zinc-800 group">
                  <TbBriefcase2Filled className="w-7 h-7 sm:w-9 sm:h-9 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="mx-auto mt-3">
                    <h3 className="font-semibold text-white text-sm sm:text-lg text-center leading-tight">
                      Loans and Credit
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-4 mt-2 text-center">Competitive rates</p>
                  </div>
                </div>
              </StaggeredReveal>
            </div>
          </div>
        </div>
      </section>

    

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold max-w-lg text-gray-900 mb-3 sm:mb-4 leading-tight">
                Trusted by over Two Million Users
              </h2>
              <p className="max-w-lg text-gray-600 text-sm sm:text-base leading-relaxed">
                See what our customers have to say about their banking experience and how we've helped them achieve
                their financial goals.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative overflow-hidden">
            {/* Fade effect on the left */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>

            {/* Fade effect on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

            <div className="flex animate-carousel gap-8 sm:gap-12">
              {/* First set of cards */}
              <div className="flex gap-8 sm:gap-12">
                {[
                  {
                    name: "David Martinez",
                    role: "Financial Analyst",
                    quote:
                      "The real-time market insights and portfolio tracking features have revolutionized how I manage my investments. The platform's intuitive interface makes complex financial decisions much more manageable.",
                    rating: 5,
                  },
                  {
                    name: "Sophia Patel",
                    role: "Startup Founder",
                    quote:
                      "As a business owner, the seamless integration between my business and personal accounts has been a game-changer. The automated expense tracking saves me hours every week.",
                    rating: 4,
                  },
                  {
                    name: "James Wilson",
                    role: "Retirement Planner",
                    quote:
                      "The retirement planning tools are exceptional. I can easily visualize my financial future and make informed decisions about my investments and savings.",
                    rating: 5,
                  },
                ].map((testimonial, index) => (
                  <Card
                    key={`first-${index}`}
                    className="p-4 sm:p-6 min-h-[350px] sm:h-[400px] rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group flex-shrink-0 w-[300px] sm:w-[350px]"
                  >
                    <CardContent className="px-2 sm:px-3 py-2 flex flex-col h-full justify-between">
                      <div className="flex items-center mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 hover:scale-125 ${
                              i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-100 flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-110">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Second set of cards */}
              <div className="flex gap-8 sm:gap-12">
                {[
                  {
                    name: "Rachel Kim",
                    role: "Digital Marketing Director",
                    quote:
                      "The mobile app's user experience is outstanding. I can manage my finances on the go, and the biometric security features give me complete peace of mind.",
                    rating: 5,
                  },
                  {
                    name: "Thomas Anderson",
                    role: "Real Estate Developer",
                    quote:
                      "The loan application process was incredibly smooth. The personalized support and competitive rates made financing my latest project much easier than expected.",
                    rating: 4,
                  },
                  {
                    name: "Isabella Santos",
                    role: "Freelance Consultant",
                    quote:
                      "As someone who works with international clients, the multi-currency accounts and low transfer fees have been invaluable for my business operations.",
                    rating: 5,
                  },
                ].map((testimonial, index) => (
                  <Card
                    key={`second-${index}`}
                    className="p-4 sm:p-6 min-h-[350px] sm:h-[400px] rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group flex-shrink-0 w-[300px] sm:w-[350px]"
                  >
                    <CardContent className="px-2 sm:px-3 py-2 flex flex-col h-full justify-between">
                      <div className="flex items-center mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 hover:scale-125 ${
                              i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-100 flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-110">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Third set of cards for seamless loop */}
              <div className="flex gap-8 sm:gap-12">
                {[
                  {
                    name: "Marcus Johnson",
                    role: "Tech Entrepreneur",
                    quote:
                      "The API integration capabilities have allowed me to automate my business finances completely. The developer support team is incredibly responsive and helpful.",
                    rating: 4,
                  },
                  {
                    name: "Olivia Chen",
                    role: "Investment Strategist",
                    quote:
                      "The advanced analytics and reporting tools have transformed how I analyze market trends and make investment decisions. The platform's insights are invaluable.",
                    rating: 5,
                  },
                  {
                    name: "Daniel Rodriguez",
                    role: "Small Business Owner",
                    quote:
                      "The business banking features are exactly what I needed. From payroll management to expense tracking, everything is streamlined and efficient.",
                    rating: 4,
                  },
                ].map((testimonial, index) => (
                  <Card
                    key={`third-${index}`}
                    className="p-4 sm:p-6 min-h-[350px] sm:h-[400px] rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl group flex-shrink-0 w-[300px] sm:w-[350px]"
                  >
                    <CardContent className="px-2 sm:px-3 py-2 flex flex-col h-full justify-between">
                      <div className="flex items-center mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 hover:scale-125 ${
                              i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-100 flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-110">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                            <div className="text-xs sm:text-sm text-gray-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Banking Journey?"
        description="Join millions of satisfied customers and experience the future of banking today."
        primaryButtonText="Open Account Now"
        secondaryButtonText="Schedule a Demo"
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
