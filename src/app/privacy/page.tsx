import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";
import PageLayout from "@/components/page-layout";
import HeroSection from "@/components/hero-section";
import ScrollReveal from "@/components/scroll-reveal";
import StaggeredReveal from "@/components/staggered-reveal";

export default function PrivacyPage() {
  return (
    <PageLayout currentPage="/privacy">
      {/* Hero Section */}
      <HeroSection
        badgeText="Privacy Policy"
        badgeIcon="🔒"
        title="Your Privacy"
        subtitle="Is Our Priority"
        description="Learn how we collect, use, and protect your personal information. We're committed to maintaining the highest standards of privacy and data security."
      />

      {/* Privacy Principles */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4">
                Our Privacy Principles
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                These core principles guide how we handle your personal
                information and protect your privacy.
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            staggerDelay={200}
            direction="up"
          >
            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Data Protection
                </h3>
                <p className="text-gray-600 text-sm">
                  We use industry-leading security measures to protect your data
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-green-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Transparency
                </h3>
                <p className="text-gray-600 text-sm">
                  Clear information about what data we collect and why
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Your Control
                </h3>
                <p className="text-gray-600 text-sm">
                  You have control over your personal information and privacy
                  settings
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-zinc-100 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50 rounded-xl sm:rounded-2xl duration-500 transition-all hover:scale-105 hover:shadow-xl group">
              <CardContent className="py-3 sm:py-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-zinc-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-800" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Limited Sharing
                </h3>
                <p className="text-gray-600 text-sm">
                  We never sell your data and limit sharing to essential
                  services
                </p>
              </CardContent>
            </Card>
          </StaggeredReveal>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ScrollReveal direction="up" delay={200}>
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Information We Collect
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  Personal Information
                </h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>• Name, address, phone number, and email address</li>
                  <li>• Social Security number and date of birth</li>
                  <li>• Employment and income information</li>
                  <li>• Account numbers and transaction history</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">
                  Automatically Collected Information
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Device information and IP address</li>
                  <li>• Browser type and operating system</li>
                  <li>• Usage patterns and preferences</li>
                  <li>• Location data (with your permission)</li>
                </ul>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                How We Use Your Information
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <ul className="text-gray-600 space-y-3">
                  <li>
                    • <strong>Account Management:</strong> To open, maintain,
                    and service your accounts
                  </li>
                  <li>
                    • <strong>Transaction Processing:</strong> To process
                    payments, transfers, and other transactions
                  </li>
                  <li>
                    • <strong>Security:</strong> To protect against fraud and
                    unauthorized access
                  </li>
                  <li>
                    • <strong>Customer Service:</strong> To respond to your
                    questions and provide support
                  </li>
                  <li>
                    • <strong>Legal Compliance:</strong> To comply with
                    applicable laws and regulations
                  </li>
                  <li>
                    • <strong>Product Improvement:</strong> To enhance our
                    services and develop new features
                  </li>
                </ul>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Information Sharing
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <p className="text-gray-600 mb-4">
                  We do not sell, rent, or trade your personal information. We
                  may share your information only in these limited
                  circumstances:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• With your explicit consent</li>
                  <li>
                    • With service providers who help us operate our business
                  </li>
                  <li>• To comply with legal requirements or court orders</li>
                  <li>
                    • To protect our rights or the safety of our customers
                  </li>
                  <li>• In connection with a business transfer or merger</li>
                </ul>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Your Privacy Rights
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Access and review your personal information</li>
                  <li>• Request corrections to inaccurate information</li>
                  <li>• Opt out of marketing communications</li>
                  <li>
                    • Request deletion of your information (subject to legal
                    requirements)
                  </li>
                  <li>• File a complaint with regulatory authorities</li>
                </ul>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Data Security
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl mb-8">
                <p className="text-gray-600 mb-4">
                  We implement comprehensive security measures to protect your
                  information:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• 256-bit SSL encryption for all data transmission</li>
                  <li>• Multi-factor authentication for account access</li>
                  <li>• Regular security audits and monitoring</li>
                  <li>• Employee training on data protection</li>
                  <li>• Secure data centers with physical access controls</li>
                </ul>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Contact Us
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-xl">
                <p className="text-gray-600 mb-4">
                  If you have questions about this privacy policy or your
                  personal information:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>
                    <strong>Email:</strong> privacy@meridianprivateholdings.com
                  </li>
                  <li>
                    <strong>Phone:</strong> (555) 123-BANK
                  </li>
                  <li>
                    <strong>Mail:</strong> Privacy Officer, Meridian Private
                    Holdings, 123 Financial District, New York, NY 10001
                  </li>
                </ul>
                <p className="text-gray-600 mt-4 text-sm">
                  <em>Last updated: December 2024</em>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
}
